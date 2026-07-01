import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../dist/client');
const SITEMAP_PATH = path.join(DIST_DIR, 'sitemap-0.xml');

// XML escape helper
function xmlEscape(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function run() {
  console.log('[Postbuild] Starting image sitemap generation...');

  if (!fs.existsSync(SITEMAP_PATH)) {
    console.error(`[Postbuild] Sitemap not found at: ${SITEMAP_PATH}`);
    process.exit(1);
  }

  let sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf8');

  // Regex to extract each <url> ... </url> block
  const urlBlockRegex = /<url>([\s\S]*?)<\/url>/g;
  let matches = [];
  let match;
  while ((match = urlBlockRegex.exec(sitemapContent)) !== null) {
    matches.push({
      full: match[0],
      inner: match[1]
    });
  }

  console.log(`[Postbuild] Found ${matches.length} URLs in sitemap.`);

  let updatedBlocks = [];

  for (const item of matches) {
    const locMatch = /<loc>(https:\/\/xyro\.art[^<]*)<\/loc>/.exec(item.inner);
    if (!locMatch) {
      updatedBlocks.push(item.full);
      continue;
    }

    const url = locMatch[1];
    // Map URL to local built HTML file
    let relativePath = url.replace('https://xyro.art', '');
    if (relativePath.endsWith('/')) {
      relativePath += 'index.html';
    } else if (relativePath === '') {
      relativePath = 'index.html';
    } else if (!relativePath.endsWith('.html')) {
      relativePath += '/index.html';
    }

    // Clean double slashes
    relativePath = relativePath.replace(/\/+/g, '/');
    if (relativePath.startsWith('/')) {
      relativePath = relativePath.substring(1);
    }

    const htmlFilePath = path.join(DIST_DIR, relativePath);
    
    if (fs.existsSync(htmlFilePath)) {
      const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
      
      // Extract all <img> tags
      const imgTagRegex = /<img\s+([^>]+)>/gi;
      let imgMatch;
      const imagesFound = [];

      while ((imgMatch = imgTagRegex.exec(htmlContent)) !== null) {
        const imgAttrs = imgMatch[1];
        const srcMatch = /src="([^"]+)"/i.exec(imgAttrs);
        
        if (srcMatch) {
          const src = srcMatch[1].replace(/&amp;/g, '&');
          const altMatch = /alt="([^"]*)"/i.exec(imgAttrs);
          const alt = altMatch ? altMatch[1].replace(/&amp;/g, '&') : '';

          // Only index relevant artwork: Sanity CDN images or the main profile picture
          if (src.includes('cdn.sanity.io') || src.includes('about-pic.jpg')) {
            // Avoid duplicate images in sitemap for the same page
            if (!imagesFound.some(img => img.src === src)) {
              imagesFound.push({ src, alt });
            }
          }
        }
      }

      // Strip out any existing image tags to ensure the script is idempotent
      const cleanInner = item.inner.replace(/<image:image>[\s\S]*?<\/image:image>/g, '').trim();

      if (imagesFound.length > 0) {
        console.log(`[Postbuild] Injected ${imagesFound.length} images into URL: ${url}`);
        
        // Generate image XML block
        let imageXml = '';
        for (const img of imagesFound) {
          imageXml += `<image:image><image:loc>${xmlEscape(img.src)}</image:loc>`;
          if (img.alt) {
            imageXml += `<image:title>${xmlEscape(img.alt)}</image:title>`;
          }
          imageXml += `</image:image>`;
        }

        updatedBlocks.push(`<url>${cleanInner}${imageXml}</url>`);
      } else {
        updatedBlocks.push(`<url>${cleanInner}</url>`);
      }
    } else {
      console.warn(`[Postbuild] Page HTML file not found: ${htmlFilePath}`);
      updatedBlocks.push(item.full);
    }
  }

  // Re-build sitemap XML
  const urlsetOpenRegex = /<urlset[^>]*>/;
  const headerMatch = urlsetOpenRegex.exec(sitemapContent);
  if (!headerMatch) {
    console.error('[Postbuild] Could not locate <urlset> tag in sitemap.');
    process.exit(1);
  }
  
  const header = sitemapContent.split(headerMatch[0])[0] + headerMatch[0];
  const footer = '</urlset>';

  const newSitemapContent = header + updatedBlocks.join('') + footer;
  fs.writeFileSync(SITEMAP_PATH, newSitemapContent, 'utf8');
  console.log('[Postbuild] Sitemap update complete! Image metadata appended.');
}

run();

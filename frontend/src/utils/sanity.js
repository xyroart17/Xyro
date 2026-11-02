import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: 'pfnvy1zn',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2026-05-18',
});

const builder = imageUrlBuilder(client);

// Helper function to turn Sanity asset references into ultra-fast CDN URLs (uncropped)
export function urlFor(source) {
  return builder.image(source);
}

// Convert Hex string into 0-360 HSL hue
export function hexToHue(hex) {
  if (!hex) return 200;
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0;
  if (max === min) h = 0;
  else if (max === r) h = (60 * ((g - b) / (max - min)) + 360) % 360;
  else if (max === g) h = (60 * ((b - r) / (max - min)) + 120) % 360;
  else if (max === b) h = (60 * ((r - g) / (max - min)) + 240) % 360;
  return Math.round(h);
}

const LEGACY_RAW = [
  "VELORA Issue 001: Nico Robin|digital fanart editorial|265|.8|2026",
  "Couple Portrait|digital commission|340|1|2026",
  "Yamato, watercolour|traditional fanart|20|.9|2026",
  "Nico Robin: Denim and Lavender|digital fanart|255|1.1|2026",
  "Golden Hour: Frieren|digital fanart|45|1.4|2026",
  "Boa Hancock: Summer Cover|digital fanart|330|.75|2026",
  "Nico Robin: Editorial Poster|digital fanart editorial|285|.7|2026",
  "Nami: Summer Beach|digital fanart|25|1|2026",
  "Princess Vivi: Arabasta|digital fanart|195|.85|2026",
  "Miyamoto Musashi Poster|digital fanart poster|0|.7|2026",
  "Amara: One Piece OC|digital commission original|35|.8|2026",
  "Nami as GTA VI cover girl|digital fanart|310|.75|2026",
  "Nyra Voss|digital commission original|330|1.5|2026",
  "Eva|digital commission original|190|.623|2026",
  "The Quiet Hour|3d original|260|1.6|2026",
  "Big Three: Trinity|digital commission|45|1.3|2026",
  "Boa Hancock: Empress|digital fanart|350|.8|2026",
  "The Fifth Hokage|digital fanart|50|.9|2026",
  "After-school empty classroom|3d original|280|1.5|2026",
  "The Sky Before the Storm|3d original|215|1.7|2026",
  "The Grave Alchemist|manga commission original|150|.7|2026",
  "Dhurandhar: Split Portrait|traditional commission|0|1|2026",
  "Nami, watercolour|traditional fanart|30|.85|2025",
  "Lord Shiva: Blue Profile|traditional original mythology|215|.8|2025",
  "Boa Hancock, watercolour|traditional fanart|335|.8|2025",
  "Lord Rama: Acrylic Portrait|traditional original mythology|25|.8|2025",
  "Madara Uchiha|traditional fanart|270|.9|2025",
  "Goku Ultra Instinct|traditional fanart|200|.8|2025",
  "Dragon Ball Collage|traditional fanart|55|1.3|2025",
  "Sung Jin-Woo|traditional fanart|275|.8|2025",
  "Your Name: Silhouette|traditional fanart|230|1.3|2025",
  "Itachi: Red Moon|traditional fanart|355|1|2025",
  "Yamato: Oni Princess|traditional fanart|15|.85|2025",
  "Mitsuri Kanroji|traditional fanart|325|.8|2025",
];

const LEGACY_SLUG_MAP = {
  Eva: "eva",
  "Couple Portrait": "couple-portrait-commission",
  "Yamato, watercolour": "yamato-fan-art-or-watercolor-anime-portrait",
  "Princess Vivi: Arabasta": "princess-nefertari-vivi-arabasta-royal-attire-character-illustration-or-one-piece",
  "Amara: One Piece OC": "amara-one-piece-original-character",
  "Nami, watercolour": "nami-one-piece-or-one-piece-fan-art",
  "Boa Hancock, watercolour": "boa-hancock-watercolor-fan-art-or-one-piece-pirate-empress",
  "Your Name: Silhouette": "your-name-kimi-no-na-wa-silhouette",
  "Itachi: Red Moon": "itachi-uchiha-red-moon-silhouette-or-naruto-fan-art",
  "Yamato: Oni Princess": "yamato-one-piece-watercolor-fan-art-or-oni-princess-portrait-or-one-piece",
  "Nico Robin: Denim and Lavender": "nico-robin-fan-art-or-denim-and-lavender",
  "Nico Robin: Editorial Poster": "nico-robin-editorial-art-poster-and-lighting-study-or-one-piece-fanart",
  "Miyamoto Musashi Poster": "miyamoto-musashi-poster-design-vagabond",
  "Nami as GTA VI cover girl": "nami-as-gta-vi-cover-girl-one-piece-x-gta-6-fan-art",
  "The Grave Alchemist": "the-grave-alchemist",
  "Lord Shiva: Blue Profile": "lord-shiva-blue-profile-watercolor-or-hindu-god-art",
  "Lord Rama: Acrylic Portrait": "lord-rama-acrylic-portrait-or-hindu-god-art",
  "Madara Uchiha": "madara-uchiha-or-naruto-shippuden-traditional-painting",
  "Goku Ultra Instinct": "goku-ultra-instinct-watercolor-or-dragon-ball-fan-art",
  "Dragon Ball Collage": "dragon-ball-collage-or-dragon-ball-super-watercolor-fan-art",
  "Sung Jin-Woo": "sung-jin-woo-or-solo-leveling",
  "Mitsuri Kanroji": "mitsuri-kanroji-watercolor-or-demon-slayer-kimetsu-no-yaiba",
  "VELORA Issue 001: Nico Robin": "velora-issue-001-nico-robin-anime-fashion-editorial-or-xyro",
  "Golden Hour: Frieren": "golden-hour-frieren",
  "Boa Hancock: Summer Cover": "boa-hancock-summer-cover-or-one-piece-fanart",
  "Nami: Summer Beach": "nami-summer-beach-or-one-piece-fanart",
  "Nyra Voss": "nyra-voss",
  "The Quiet Hour": "the-quiet-hour",
  "Big Three: Trinity": "big-three-trinity",
  "Boa Hancock: Empress": "boa-hancock-empress",
  "The Fifth Hokage": "the-fifth-hokage",
  "After-school empty classroom": "after-school-empty-classroom",
  "The Sky Before the Storm": "the-sky-before-the-storm",
  "Dhurandhar: Split Portrait": "dhurandhar-or-split-portrait",
};

const LEGACY_BY_SLUG = {};
LEGACY_RAW.forEach((r) => {
  const p = r.split("|");
  const t = p[0];
  const tags = p[1].split(" ");
  const hue = +p[2];
  const ratio = +p[3];
  const year = p[4];
  const slug = LEGACY_SLUG_MAP[t];
  if (slug) {
    LEGACY_BY_SLUG[slug] = { title: t, tags, hue, ratio, year };
  }
});

// Dynamic Vault fetcher: gets ALL works directly from Sanity, preserves legacy curated meta, and handles new uploads seamlessly
export async function fetchVaultData() {
  try {
    const sanityItems = await client.fetch(`
      *[_type in ["project", "manga"] && defined(slug.current)] | order(coalesce(publishDate, _createdAt) desc) {
        _id,
        _type,
        title,
        "slug": slug.current,
        tag,
        tags,
        subtitle,
        publishDate,
        year,
        hue,
        featured,
        mainImage,
        coverImage,
        gridImage,
        "dimensions": coalesce(mainImage.asset->metadata.dimensions, coverImage.asset->metadata.dimensions),
        "palette": coalesce(mainImage.asset->metadata.palette, coverImage.asset->metadata.palette)
      }
    `);

    const vaultData = sanityItems.map((item) => {
      const slug = item.slug;
      const legacy = LEGACY_BY_SLUG[slug] || {};

      const title = legacy.title || item.title || "Untitled";

      let tags = [];
      if (Array.isArray(item.tags) && item.tags.length > 0) {
        tags = item.tags;
      } else if (legacy.tags && legacy.tags.length > 0) {
        tags = legacy.tags;
      } else {
        const rawTag = (item.tag || "").toLowerCase();
        const rawSub = (item.subtitle || "").toLowerCase();
        if (rawTag.includes("3d") || rawTag.includes("blender")) tags.push("3d");
        if (rawTag.includes("traditional")) tags.push("traditional");
        if (rawTag.includes("illustration")) tags.push("digital");
        if (item._type === "manga" || rawSub.includes("manga")) tags.push("manga");
        if (rawSub.includes("commission")) tags.push("commission");
        if (rawSub.includes("fanart") || rawSub.includes("fan art")) tags.push("fanart");
        if (rawSub.includes("personal") || rawSub.includes("oc")) tags.push("original");
        if (tags.length === 0) tags = ["original", "digital"];
      }

      let hue = 200;
      if (typeof item.hue === "number") {
        hue = item.hue;
      } else if (typeof legacy.hue === "number") {
        hue = legacy.hue;
      } else if (item.palette?.dominant?.background) {
        hue = hexToHue(item.palette.dominant.background);
      }

      let ratio = 0.8;
      if (item.dimensions?.aspectRatio) {
        ratio = Math.round(item.dimensions.aspectRatio * 100) / 100;
      } else if (legacy.ratio) {
        ratio = legacy.ratio;
      }

      const year =
        item.year ||
        legacy.year ||
        (item.publishDate ? new Date(item.publishDate).getFullYear().toString() : "2026");

      const asset = item.mainImage || item.coverImage || item.gridImage;
      let img = "";
      if (asset) {
        try {
          img = urlFor(asset.asset || asset).width(1200).auto("format").url();
        } catch (e) {}
      }

      const url = item._type === "manga" ? `/manga/${slug}` : `/project/${slug}`;

      return {
        t: title,
        g: tags,
        h: hue,
        r: ratio,
        y: year,
        img,
        url,
        featured: Boolean(item.featured || slug === "eva"),
      };
    });

    // Pinned sort: Eva is always first, then featured items, then latest
    vaultData.sort((a, b) => {
      if (a.t === "Eva" || a.url === "/project/eva") return -1;
      if (b.t === "Eva" || b.url === "/project/eva") return 1;
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });

    return vaultData;
  } catch (err) {
    console.error("fetchVaultData error:", err);
    return [];
  }
}

// Fetch featured manga from Sanity
export async function fetchFeaturedManga() {
  try {
    const mangaList = await client.fetch(`
      *[_type == "manga"] | order(featured desc, coalesce(publishDate, _createdAt) desc) {
        _id,
        title,
        "slug": slug.current,
        subtitle,
        tag,
        genre,
        status,
        featured,
        coverImage,
        "pageCount": count(pages)
      }
    `);
    return mangaList;
  } catch (err) {
    console.error("fetchFeaturedManga error:", err);
    return [];
  }
}

// Fetch client reviews / testimonials from Sanity
export async function fetchTestimonials() {
  try {
    const reviews = await client.fetch(`
      *[_type == "testimonial"] | order(coalesce(reviewDate, publishDate, _createdAt) desc) {
        _id,
        quote,
        clientTitle,
        reviewDate,
        cardImage,
        "client": clientRef-> {
          _id,
          name,
          avatar,
          clientSince
        },
        "project": projectRef-> {
          title,
          "slug": slug.current,
          mainImage
        },
        "manga": mangaRef-> {
          title,
          "slug": slug.current,
          coverImage
        }
      }
    `);
    return reviews;
  } catch (err) {
    console.error("fetchTestimonials error:", err);
    return [];
  }
}



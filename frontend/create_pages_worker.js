import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');

const workerContent = `
import server from './server/entry.mjs';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // If request path starts with /api/, route directly to Astro SSR handler
    if (url.pathname.startsWith('/api/')) {
      return server.fetch(request, env, ctx);
    }

    // For all other requests, attempt to serve from static assets inside client/ folder
    const clientUrl = new URL(url);
    if (clientUrl.pathname.endsWith('/')) {
      clientUrl.pathname += 'index.html';
    }
    clientUrl.pathname = '/client' + clientUrl.pathname;

    try {
      const response = await env.ASSETS.fetch(new Request(clientUrl, request));
      if (response.status !== 404) {
        return response;
      }
    } catch (e) {
      // Ignore error and fall back to Astro SSR
    }

    // Fall back to Astro SSR handler
    return server.fetch(request, env, ctx);
  }
};
`;

fs.writeFileSync(path.join(distDir, '_worker.js'), workerContent);
console.log('Successfully created _worker.js in dist/');

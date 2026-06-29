import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: "https://xyro.art",
  // Notice there is NO output: 'server' here. This keeps the site static!
  adapter: cloudflare({
    prerenderEnvironment: 'node'
  }),
  integrations: [sitemap()],
});
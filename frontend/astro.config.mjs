import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: "https://xyro.art",
  adapter: cloudflare({
    prerenderEnvironment: 'node'
  }),
  integrations: [sitemap()],
});
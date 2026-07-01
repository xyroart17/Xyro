import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: "https://xyroart.pages.dev",
  adapter: cloudflare({
    prerenderEnvironment: 'node'
  }),
  integrations: [sitemap()],
});
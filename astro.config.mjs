// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Set SITE_URL in your host's environment variables once you know your address,
// for example https://linuxoria.com. Until then the fallback below is used.
const site = process.env.SITE_URL || "https://linuxoria.pages.dev";

export default defineConfig({
  site,
  integrations: [sitemap()],
});

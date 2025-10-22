export default defineNuxtConfig({
  features: {
    devLogs: true,
  },
  experimental: {
    typedPages: true,
  },
  compatibilityDate: "2025-10-06",
  devtools: { enabled: true },
  icon: {
    mode: "css",
    cssLayer: "base",
    clientBundle: {
      scan: true,
    },
    provider: "iconify",
  },
  css: ["@/assets/css/main.css"],
  modules: [
    "@nuxt/ui",
    "@nuxt/eslint",
    "@nuxt/image",
    "@vueuse/nuxt",
    "@nuxtjs/seo",
    "motion-v/nuxt",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@nuxt/test-utils/module",
    "nuxt-security",
  ],
  site: {
    url: "https://csmc-infinity-contest.vercel.app",
    name: "CSMC Infinity Contest",
    description:
      "Register for the CSMC Infinity Contest and receive your examination username",
    defaultLocale: "en",
  },
  seo: {
    redirectToCanonicalSiteUrl: true,
  },
  sitemap: {
    strictNuxtContentPaths: true,
  },
  ogImage: {
    fonts: ["Geist:400", "Geist:700"],
  },
});

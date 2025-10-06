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
  },
  nitro: {
    preset: "github_pages",
  },
  css: ["@/assets/css/main.css"],
  modules: [
    "@nuxt/ui",
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/scripts",
    "@vueuse/nuxt",
    "@nuxtjs/seo",
    "motion-v/nuxt",
    "@pinia/nuxt",
    "@nuxt/test-utils/module",
    "nuxt-security",
  ],
});

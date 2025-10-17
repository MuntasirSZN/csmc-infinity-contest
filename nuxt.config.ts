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
  css: ["@/assets/css/main.css"],
  modules: [
    "@nuxt/ui",
    "@nuxt/eslint",
    "@nuxt/image",
    "@vueuse/nuxt",
    "@nuxtjs/seo",
    "motion-v/nuxt",
    "@pinia/nuxt",
    "@nuxt/test-utils/module",
    "nuxt-security",
  ],
});

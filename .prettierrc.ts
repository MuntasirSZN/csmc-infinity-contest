import type { Config } from "prettier";
import type { PluginOptions } from "prettier-plugin-tailwindcss";

export default {
  singleQuote: false,
  plugins: ["@prettier/plugin-oxc", "prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./app/assets/css/main.css",
} satisfies Config & PluginOptions;

import checkFile from "eslint-plugin-check-file";
import oxlint from "eslint-plugin-oxlint";
import withNuxt from "./.nuxt/eslint.config.mjs";
import drizzle from "eslint-plugin-drizzle";
import * as mdx from "eslint-plugin-mdx";
import nodePlugin from "eslint-plugin-n";
import vitest from "eslint-plugin-vitest";

export default withNuxt(
  {
    files: ["tests/**"],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.all.rules,
    },
  },
  {
    ...mdx.flat,
    processor: mdx.createRemarkProcessor({
      lintCodeBlocks: true,
      languageMapper: {},
    }),
  },
  {
    ...mdx.flatCodeBlocks,
    rules: {
      ...mdx.flatCodeBlocks.rules,
    },
  },
  {
    plugins: {
      "check-file": checkFile,
      drizzle,
      n: nodePlugin,
    },
    rules: {
      ...drizzle.configs.recommended.rules,
      "n/exports-style": ["error", "module.exports"],
      "check-file/filename-naming-convention": [
        "error",
        {
          "**/!(*[[]*)*.{ts,tsx}": "KEBAB_CASE",
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
      "check-file/folder-naming-convention": [
        "error",
        {
          "**/**": "KEBAB_CASE",
        },
      ],
    },
  },
  ...oxlint.buildFromOxlintConfigFile("./.oxlintrc.json"),
);

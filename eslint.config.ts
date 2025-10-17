import { fileURLToPath } from "node:url";
import { includeIgnoreFile } from "@eslint/compat";
import { globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import checkFile from "eslint-plugin-check-file";
import drizzle from "eslint-plugin-drizzle";
import * as mdx from "eslint-plugin-mdx";
import nodePlugin from "eslint-plugin-n";
import oxlint from "eslint-plugin-oxlint";
import vitest from "eslint-plugin-vitest";
import withNuxt from "./.nuxt/eslint.config.mjs";

const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url));

export default withNuxt(
  includeIgnoreFile(gitignorePath, "Imported .gitignore patterns"),
  globalIgnores([
    "specs/**/*",
    ".specify/**/*",
    ".opencode/**/*",
    ".prettierrc*",
  ]),
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
  eslintConfigPrettier,
);

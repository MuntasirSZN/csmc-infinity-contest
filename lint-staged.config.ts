/** @type {import('lint-staged').Configuration} */
export default {
  "**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx,vue,astro,svelte}":
    "bun run lint:oxlint --fix",
  "**/*": "bun run lint:eslint --fix",
  "**/**": "bun run fmt --no-errors-on-unmatched --files-ignore-unknown=true",
  "**/*.ts?(x)": () => "bun run typecheck -p tsconfig.json",
  "*.{css,vue}": "bun run lint:stylelint --fix",
  "content/**/*": "bun run lint:markdownlint",
};

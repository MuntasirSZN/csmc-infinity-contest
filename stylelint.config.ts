/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-standard", "stylelint-config-recommended-vue"],
  rules: {
    "at-rule-no-deprecated": null,
    "import-notation": "string",
    "function-no-unknown": [
      true,
      {
        ignoreFunctions: ["theme"],
      },
    ],
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "tailwind",
          "screen",
          "custom-variant",
          "plugin",
          "source",
        ],
      },
    ],
    "selector-pseudo-class-no-unknown": [
      true,
      {
        ignorePseudoClasses: ["global"],
      },
    ],
  },
};

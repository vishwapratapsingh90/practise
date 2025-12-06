// eslint.config.js
/* eslint-env node */

const js = require("@eslint/js");

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "script",
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",
        $: "readonly",
        jQuery: "readonly",
        require: "readonly",
        module: "readonly",
      }
    },
    rules: {
      "no-var": "off",
      "prefer-const": "off"
    }
  }
];

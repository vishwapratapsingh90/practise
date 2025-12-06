// eslint.config.js
/*
import nadiaConfig from "eslint-config-nadia";

export default [
  {
    ignores: ["public/contrib/*"]
  },
  ...nadiaConfig
];
*/


const js = require("@eslint/js");

module.exports = [
  js.configs.recommended,
  {
    ignores: ["public/contrib/*"]
  },
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

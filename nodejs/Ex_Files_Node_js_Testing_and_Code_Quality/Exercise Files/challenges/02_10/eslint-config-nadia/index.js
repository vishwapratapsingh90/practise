// eslint-config-nadia

const js = require("@eslint/js");

module.exports = [
  {
    ignores: []
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "commonjs",
      globals: {
        console: "readonly",
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        module: "readonly",
        require: "readonly",
        exports: "readonly",
        Buffer: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
      }
    },
    rules: {
      "no-multiple-empty-lines": "warn",
      "no-var": "error",
      "prefer-const": "error"
    }
  }
];

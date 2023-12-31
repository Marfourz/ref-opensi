/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  plugins: ["@typescript-eslint", "promise"],
  extends: [
    "airbnb-base",
    "airbnb-typescript/base",
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "plugin:promise/recommended",
    "@vue/eslint-config-typescript",
    "@vue/eslint-config-prettier",
  ],
  ignorePatterns: ["vite.config.ts"],
  parserOptions: {
    ecmaVersion: "latest",
    project: ["./tsconfig.json"],
  },
  rules: {
    "func-names": "error",
    "import/extensions": "off",
    "import/no-unresolved": "off",
    "require-await": "error",
    "no-async-promise-executor": "error",
    "no-await-in-loop": "error",
    "promise/prefer-await-to-then": "error",
    "promise/always-return": "warn",
    "no-magic-numbers": ["error", { ignoreArrayIndexes: true, ignore: [0, 1] }],
  },
};

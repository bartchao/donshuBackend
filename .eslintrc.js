module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  ignorePatterns: ["node_modules/*"],
  extends: "standard",
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: "latest"
  },
  rules: {
    quotes: ["error", "double"],
    semi: ["error", "always"],
    noTabs: 0
  }
};

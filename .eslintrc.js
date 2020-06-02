module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: ["airbnb-typescript", "prettier", "prettier/@typescript-eslint"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    ecmaVersion: 11,
  },
  plugins: ["@typescript-eslint"],
  rules: {},
};

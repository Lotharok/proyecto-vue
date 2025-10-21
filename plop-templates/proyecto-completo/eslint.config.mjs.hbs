import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
   // Global ignores
   {
      ignores: [
         "**/dist",
         "**/.eslintrc.cjs",
         "**/drop",
         "**/node_modules",
         "**/*.d.ts",
         "**/coverage",
         "**/plopfile.js",
      ],
   },

   // Base ESLint recommended config
   js.configs.recommended,

   // TypeScript ESLint recommended configs
   ...tseslint.configs.recommended,

   // Vue recommended config for flat config
   ...pluginVue.configs["flat/recommended"],

   // Prettier config (disables conflicting rules)
   eslintConfigPrettier,

   // Custom configuration
   {
      files: ["**/*.{js,mjs,cjs,ts,vue}"],
      plugins: {
         "simple-import-sort": simpleImportSort,
      },
      languageOptions: {
         globals: {
            ...globals.browser,
            ...globals.node,
         },
         ecmaVersion: "latest",
         sourceType: "module",
         parserOptions: {
            parser: tseslint.parser,
         },
      },
      rules: {
         "simple-import-sort/imports": "error",
         "simple-import-sort/exports": "error",
         "linebreak-style": ["error", "unix"],
         "no-unused-vars": "off",
         "@typescript-eslint/no-unused-vars": [
            "error",
            {
               argsIgnorePattern: "^_",
            },
         ],
      },
   },
   // Vue-specific configuration
   {
      files: ["**/*.vue"],
      languageOptions: {
         parserOptions: {
            parser: tseslint.parser,
         },
      },
   },
];

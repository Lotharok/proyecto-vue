import path from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
   baseDirectory: __dirname,
   recommendedConfig: js.configs.recommended,
   allConfig: js.configs.all,
});

export default [
   {
      ignores: ["**/dist", "**/.eslintrc.cjs", "**/drop", "**/plopfile.js"],
   },
   ...compat.extends(
      "plugin:@typescript-eslint/recommended",
      "eslint:recommended",
      "plugin:vue/vue3-recommended",
      "prettier",
   ),
   {
      plugins: { "simple-import-sort": simpleImportSort },

      languageOptions: {
         parserOptions: {
            parser: "@typescript-eslint/parser",
         },
         globals: {
            ...globals.browser,
         },

         ecmaVersion: "latest",
         sourceType: "module",
      },

      settings: {},

      rules: {
         "simple-import-sort/imports": "error",
         "simple-import-sort/exports": "error",
         "linebreak-style": ["error", "unix"],
         "no-unused-vars": [
            "error",
            {
               argsIgnorePattern: "^_",
            },
         ],
         "@typescript-eslint/no-unused-vars": [
            "error",
            {
               argsIgnorePattern: "^_",
            },
         ],
      },
   },
];

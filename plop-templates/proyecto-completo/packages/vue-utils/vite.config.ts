import vue from "@vitejs/plugin-vue";
import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
   build: {
      lib: {
         entry: path.resolve(__dirname, "src/index.ts"),
         formats: ["es"],
      },
      rollupOptions: {
         external: [
            "vue",
            "i18next",
            "i18next-vue",
            "i18next-http-backend",
         ],
         output: {
            preserveModules: true,
            preserveModulesRoot: "src",
            entryFileNames: "[name].js",
            assetFileNames: (assetInfo) => {
               if (assetInfo.name === "style.css") return "style.css";
               return assetInfo.name || "asset-[hash][extname]";
            },
            globals: {
               vue: "Vue",
            },
         },
      },
      cssCodeSplit: false,
      minify: process.env.NODE_ENV === "production",
   },
   plugins: [vue(), dts({ exclude: ["**/*.test.ts", "**/*.spec.ts", "src/test-utils/**/*"] })],
   resolve: {
      alias: {
         "@": path.resolve(__dirname, "./src"),
      },
   },
});

import vue from "@vitejs/plugin-vue";
import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
   build: {
      lib: {
         entry: {
            index: path.resolve(__dirname, "src/index.ts"),
            "i18n/index": path.resolve(__dirname, "src/i18n/index.ts"),
         },
         formats: ["es"],
      },
      rollupOptions: {
         external: (id) => {
            if (id === "vue" || id.startsWith("vue/")) return true;
            if (id === "i18next" || id.startsWith("i18next/")) return true;
            if (id === "i18next-vue" || id.startsWith("i18next-vue/")) return true;
            if (id === "i18next-http-backend" || id.startsWith("i18next-http-backend/")) return true;
            if (id.startsWith("@pnpmworkspace/")) return true;

            return false;
         },
         output: {
            preserveModules: true,
            preserveModulesRoot: "src",
            entryFileNames: "[name].js",
            assetFileNames: (assetInfo) => {
               if (assetInfo.names?.[0] === "style.css") return "style.css";
               return assetInfo.names?.[0] || "asset-[hash][extname]";
            },
         },
      },
      cssCodeSplit: false,
      sourcemap: true,
      minify: process.env.NODE_ENV === "production",
   },
   plugins: [
      vue(),
      dts({
         include: ["src/**/*"],
         exclude: ["**/*.test.ts", "**/*.spec.ts"],
         insertTypesEntry: true,
         copyDtsFiles: true,
         rollupTypes: false,
      }),
   ],
   resolve: {
      alias: {
         "@": path.resolve(__dirname, "./src"),
      },
   },
});

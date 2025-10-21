import path from "path";
import dts from "vite-plugin-dts";
import { defineConfig } from "vitest/config";

export default defineConfig({
   build: {
      lib: {
         entry: {
            index: path.resolve(__dirname, "src/index.ts"),
         },
         formats: ["es"],
      },
      rollupOptions: {
         output: {
            preserveModules: true,
            preserveModulesRoot: "src",
            entryFileNames: "[name].js",
         },
      },
      minify: process.env.NODE_ENV === "production",
   },
   plugins: [
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

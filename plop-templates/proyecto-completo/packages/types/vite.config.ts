import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

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
         exclude: ["**/*.test.ts", "**/*.spec.ts", "src/test-utils/**/*"],
         insertTypesEntry: true,
         copyDtsFiles: true,
         rollupTypes: true,
      }),
   ],
   resolve: {
      alias: {
         "@": path.resolve(__dirname, "./src"),
      },
   },
});

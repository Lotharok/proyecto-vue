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
         // Externaliza peerDependencies si las necesitas
         external: (_id) => {
            // Agrega aquí tus peerDependencies
            // Ejemplo: if (_id === "lodash") return true;
            return false;
         },
         output: {
            preserveModules: true,
            preserveModulesRoot: "src",
            entryFileNames: "[name].js",
         },
      },
      sourcemap: true,
      minify: process.env.NODE_ENV === "production",
   },
   plugins: [
      dts({
         include: ["src/**/*"],
         exclude: ["**/*.test.ts", "**/*.spec.ts", "src/test-utils/**/*"],
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

import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

/**
 * Template de Vite para librerías TypeScript puras (sin Vue/React)
 *
 * Uso:
 * 1. Copia este archivo a tu paquete: packages/my-lib/vite.config.ts
 * 2. Ajusta el campo 'external' según tus peerDependencies
 * 3. Cambia el 'entry' si tienes múltiples puntos de entrada
 */
export default defineConfig({
   build: {
      // Configuración de librería
      lib: {
         entry: {
            index: path.resolve(__dirname, "src/index.ts"),
            // Agrega más entry points si es necesario:
            // utils: path.resolve(__dirname, "src/utils/index.ts"),
         },
         formats: ["es"], // Solo ESM para módulos modernos
      },

      // Opciones de Rollup
      rollupOptions: {
         // IMPORTANTE: Externaliza TODAS las dependencias que están en peerDependencies
         // Esto evita bundlearlas en tu librería
         external: (_id) => {
            // Agrega aquí tus peerDependencies
            // Ejemplo:
            // if (_id === "lodash" || _id.startsWith("lodash/")) return true;
            return false; // Cambiar según tus necesidades
         },

         output: {
            // Preserva la estructura de módulos (tree-shaking friendly)
            preserveModules: true,
            preserveModulesRoot: "src",
            entryFileNames: "[name].js",
         },
      },

      // Source maps para debugging
      sourcemap: true,

      // Minificar solo en producción
      minify: process.env.NODE_ENV === "production",
   },

   // Plugins
   plugins: [
      dts({
         // Incluye todos los archivos de tipos
         include: ["src/**/*"],

         // Excluye tests y archivos de desarrollo
         exclude: ["**/*.test.ts", "**/*.spec.ts", "src/test-utils/**/*"],

         // rollupTypes: false para mejor tree-shaking
         // Los tipos se preservan en la misma estructura que los archivos JS
         rollupTypes: false,

         // Genera entry point de tipos
         insertTypesEntry: true,

         // Copia archivos .d.ts
         copyDtsFiles: true,
      }),
   ],

   // Alias de rutas
   resolve: {
      alias: {
         "@": path.resolve(__dirname, "./src"),
      },
   },
});

import vue from "@vitejs/plugin-vue";
import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

/**
 * Template de Vite para librerías Vue
 *
 * Uso:
 * 1. Copia este archivo a tu paquete: packages/my-vue-lib/vite.config.ts
 * 2. Ajusta el campo 'external' según tus peerDependencies
 * 3. Cambia el 'entry' si tienes múltiples puntos de entrada
 */
export default defineConfig({
   build: {
      // Configuración de librería
      lib: {
         entry: path.resolve(__dirname, "src/index.ts"),
         formats: ["es"], // Solo ESM para módulos modernos
      },

      // Opciones de Rollup
      rollupOptions: {
         // IMPORTANTE: Externaliza TODAS las peerDependencies
         // Esto evita bundlearlas en tu librería
         external: (id) => {
            // Vue es SIEMPRE external en librerías Vue
            if (id === "vue" || id.startsWith("vue/")) {
               return true;
            }

            // Agrega aquí tus otras peerDependencies
            // Ejemplos comunes:
            // if (id === "pinia" || id.startsWith("pinia/")) return true;
            // if (id === "vue-router" || id.startsWith("vue-router/")) return true;
            // if (id === "i18next-vue" || id.startsWith("i18next-vue/")) return true;
            // if (id === "@pnpmworkspace/types" || id.startsWith("@pnpmworkspace/types/")) return true;

            return false;
         },

         output: {
            // Preserva la estructura de módulos (tree-shaking friendly)
            preserveModules: true,
            preserveModulesRoot: "src",
            entryFileNames: "[name].js",

            // Manejo de assets (CSS, imágenes, etc.)
            assetFileNames: (assetInfo) => {
               // CSS principal siempre como style.css
               if (assetInfo.names?.[0] === "style.css") return "style.css";
               // Otros assets con nombre original o hash
               return assetInfo.names?.[0] || "asset-[hash][extname]";
            },

            // Globals para UMD (si lo necesitas)
            globals: {
               vue: "Vue",
            },
         },
      },

      // NO dividir CSS en múltiples archivos
      cssCodeSplit: false,

      // Source maps para debugging
      sourcemap: true,

      // Minificar solo en producción
      minify: process.env.NODE_ENV === "production",
   },

   // Plugins
   plugins: [
      // Plugin de Vue
      vue(),

      // Generación de tipos
      dts({
         // Incluye archivos Vue y TypeScript
         include: ["src/**/*.ts", "src/**/*.vue", "src/**/*.tsx"],

         // Excluye tests y archivos de desarrollo
         exclude: ["**/*.test.ts", "**/*.spec.ts", "**/*.story.vue", "src/test-utils/**/*"],

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

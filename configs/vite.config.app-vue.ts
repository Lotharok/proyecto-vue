import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig, loadEnv } from "vite";

/**
 * Template de Vite para aplicaciones Vue finales
 *
 * Uso:
 * 1. Copia este archivo a tu app: @apps/my-app/vite.config.ts
 * 2. Ajusta el 'entryFileNames' con el nombre de tu app
 * 3. Ajusta 'manualChunks' según las dependencias que uses
 * 4. Ajusta 'optimizeDeps' según tus dependencias
 */
export default defineConfig(({ mode }) => {
   // Cargar variables de entorno
   const env = loadEnv(mode, process.cwd(), "");
   const isDebug = env.VITE_IS_DEBUG === "true";
   const useMocks = env.VITE_USE_MOCKS === "true";
   const cdnBaseUrl = env.VITE_CDN_BASE_URL;

   return {
      // Plugins
      plugins: [
         vue({
            template: {
               compilerOptions: {
                  // Configurar elementos personalizados (web components)
                  isCustomElement: (tag) => tag.includes("-"),
               },
            },
         }),
      ],

      // Alias de rutas
      resolve: {
         alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
         },
      },

      // Base URL para CDN
      base: cdnBaseUrl ?? "/",

      // Configuración de build
      build: {
         // Target moderno
         target: "es2020",

         // Minificar solo en producción
         minify: !isDebug,

         // Source maps:
         // - En desarrollo: completos para debugging
         // - En producción: 'hidden' genera .map separados (no aumenta bundle)
         sourcemap: mode === "production" ? "hidden" : true,

         // Rollup options
         rollupOptions: {
            // Output configuration
            output: {
               // Nombres de chunks con hash para cache busting
               chunkFileNames: "[name]-[hash].js",

               // Entry file name (CAMBIAR según tu app)
               entryFileNames: "my-app.js",

               // Assets sin hash (CSS, imágenes)
               assetFileNames: "[name][extname]",

               // Manual chunks para code splitting optimizado
               manualChunks: (id) => {
                  // Mocks solo si están habilitados
                  if (useMocks && id.includes("/mocks/")) {
                     return "mocks";
                  }

                  // Vendor chunks (node_modules)
                  if (id.includes("node_modules")) {
                     // Vue core (cambios poco frecuentes)
                     if (id.includes("/vue/") || id.includes("/@vue/")) {
                        return "vue-vendor";
                     }

                     // Pinia (state management)
                     if (id.includes("/pinia/")) {
                        return "pinia-vendor";
                     }

                     // i18next (internacionalización)
                     if (id.includes("/i18next/")) {
                        return "i18n-vendor";
                     }

                     // Lottie (animaciones)
                     if (id.includes("/@lottiefiles/")) {
                        return "lottie-vendor";
                     }

                     // Dependencias internas de la organización
                     if (id.includes("/@my-organization/")) {
                        return "my-organization-vendor";
                     }

                     // Otros vendors en un chunk genérico
                     return "vendor";
                  }

                  // Paquetes del monorepo (workspace)
                  // IMPORTANTE: Ajusta según los paquetes que uses
                  if (id.includes("packages/types")) {
                     return "pk-types";
                  }
                  if (id.includes("packages/vue-utils")) {
                     return "pk-vue-utils";
                  }
                  if (id.includes("packages/vue-modal")) {
                     return "pk-vue-modal";
                  }
                  if (id.includes("packages/commission-table")) {
                     return "pk-commission-table";
                  }
                  if (id.includes("packages/upsell")) {
                     return "pk-upsell";
                  }

                  // No especificar chunk (Vite decide)
                  return undefined;
               },
            },

            // Tree-shaking optimizado
            treeshake: {
               preset: "recommended",
               moduleSideEffects: "no-external",
            },
         },
      },

      // Pre-bundling de dependencias (acelera dev server)
      optimizeDeps: {
         include: [
            "vue",
            "@vue/runtime-core",
            "@vue/runtime-dom",
            "pinia",
            "i18next",
            "i18next-vue",
            // Agrega aquí otras dependencias pesadas que uses
         ],
      },
   };
});

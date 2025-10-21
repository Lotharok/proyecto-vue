import i18next from "i18next";
import Backend from "i18next-http-backend";
import I18NextVue from "i18next-vue";
import type { App } from "vue";

let _isDebug = false;
let _i18Version = "1";
let _i18Path = "/locales";
let _isInitialized = false;

/**
 * Promesa de inicialización de i18next
 * Exportada para que otros módulos puedan esperar a que i18next esté listo
 */
export const i18nextPromise = i18next.use(Backend).init({
   debug: _isDebug,
   fallbackLng: "es-mx",
   load: "currentOnly",
   // Precargar idiomas comunes para evitar delays
   preload: ["es-mx", "en-us"],
   interpolation: {
      escapeValue: false, // not needed for vue as it escapes by default
   },
   backend: {
      loadPath: (lng: string, ns: string) => {
         return _i18Path + `/${lng}/${ns}.json?v=${_i18Version}`;
      },
      crossDomain: true,
      // Configuración de request options para mejor manejo de caché
      requestOptions: {
         mode: "cors",
         credentials: "same-origin",
         cache: "default",
      },
   },
});

// Marcar como inicializado cuando la promesa se resuelva
i18nextPromise
   .then(() => {
      _isInitialized = true;
      if (_isDebug) {
         console.log("[i18n] Initialized successfully");
      }
   })
   .catch((error) => {
      console.error("[i18n] Initialization error:", error);
   });

/**
 * Exportar i18next para uso directo
 */
export { i18next };

/**
 * Verifica si i18next está inicializado
 */
export function isI18nextReady(): boolean {
   return _isInitialized;
}

/**
 * Cambia el idioma de forma segura, esperando a que i18next esté inicializado
 * y manejando errores apropiadamente
 *
 * @param language - Código de idioma (ej: "es-mx", "en-us")
 * @param fallbackLang - Idioma de respaldo en caso de error (default: "es-mx")
 * @returns Promise que se resuelve cuando el idioma ha cambiado
 */
export async function changeLanguageSafe(language: string, fallbackLang: string = "es-mx"): Promise<void> {
   try {
      // Esperar a que i18next esté inicializado
      if (!_isInitialized) {
         if (_isDebug) {
            console.log("[i18n] Waiting for i18next initialization...");
         }
         await i18nextPromise;
      }

      // Validar que el idioma no esté vacío
      if (!language || language.trim() === "") {
         console.warn("[i18n] Invalid language provided, using fallback:", fallbackLang);
         language = fallbackLang;
      }

      if (_isDebug) {
         console.log(`[i18n] Changing language to: ${language}`);
      }

      // Cambiar el idioma y esperar a que se carguen los recursos
      await i18next.changeLanguage(language);

      if (_isDebug) {
         console.log(`[i18n] Language changed successfully to: ${language}`);
      }
   } catch (error) {
      console.error(`[i18n] Error changing language to ${language}:`, error);

      // Intentar con idioma fallback si no es el mismo
      if (language !== fallbackLang) {
         console.warn(`[i18n] Attempting to use fallback language: ${fallbackLang}`);
         try {
            await i18next.changeLanguage(fallbackLang);
            console.log(`[i18n] Fallback language set to: ${fallbackLang}`);
         } catch (fallbackError) {
            console.error(`[i18n] Error setting fallback language:`, fallbackError);
            throw fallbackError;
         }
      } else {
         throw error;
      }
   }
}

/**
 * Obtiene el idioma actual
 */
export function getCurrentLanguage(): string {
   return i18next.language || "es-mx";
}

/**
 * Precarga un idioma específico
 * Útil para mejorar la experiencia de usuario al cambiar de idioma
 *
 * @param language - Código de idioma a precargar
 */
export async function preloadLanguage(language: string): Promise<void> {
   try {
      await i18nextPromise;

      if (!i18next.hasResourceBundle(language, "translation")) {
         if (_isDebug) {
            console.log(`[i18n] Preloading language: ${language}`);
         }
         await i18next.loadLanguages(language);
      }
   } catch (error) {
      console.error(`[i18n] Error preloading language ${language}:`, error);
   }
}

/**
 * Función de inicialización principal de i18n para Vue
 *
 * @param app - Aplicación Vue
 * @param i18Path - Ruta donde se encuentran los archivos de traducción
 * @param i18Version - Versión de los archivos de traducción (para cache busting)
 * @param isDebug - Activar modo debug
 * @param initialLanguage - Idioma inicial (opcional)
 */
export default async function (
   app: App,
   i18Path: string,
   i18Version: string,
   isDebug: boolean,
   initialLanguage?: string,
) {
   _isDebug = isDebug;
   _i18Version = i18Version;
   _i18Path = i18Path;

   if (_isDebug) {
      console.log("[i18n] Initializing with config:", { i18Path, i18Version, initialLanguage });
   }

   await i18nextPromise;

   // Si se proporciona un idioma inicial, cambiarlo
   if (initialLanguage && initialLanguage !== i18next.language) {
      if (_isDebug) {
         console.log(`[i18n] Setting initial language to: ${initialLanguage}`);
      }
      await changeLanguageSafe(initialLanguage);
   }

   app.use(I18NextVue, { i18next });

   if (_isDebug) {
      console.log("[i18n] Vue plugin installed successfully");
   }

   return app;
}

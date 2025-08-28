import i18next from "i18next";
import Backend from "i18next-http-backend";
import I18NextVue from "i18next-vue";
import type { App } from "vue";

let _isDebug = false;
let _i18Version = "1";
let _i18Path = "/locales";

export const i18nextPromise = i18next.use(Backend).init({
   debug: _isDebug,
   fallbackLng: "es-mx",
   load: "currentOnly",
   interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
   },
   backend: {
      loadPath: (lng: string, ns: string) => {
         return _i18Path + `/${lng}/${ns}.json?v=${_i18Version}`;
      },
      crossDomain: true,
   },
});

export default async function (app: App, i18Path: string, i18Version: string, isDebug: boolean) {
   _isDebug = isDebug;
   _i18Version = i18Version;
   _i18Path = i18Path;

   await i18nextPromise;
   app.use(I18NextVue, { i18next });
   return app;
}

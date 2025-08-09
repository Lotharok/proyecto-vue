const fs = require("fs");
const path = require("path");

module.exports = function (plop) {
   // -------------------
   // Helpers personalizados para plantillas
   // -------------------
   plop.setHelper("kebabCase", (text) =>
      text
         .toLowerCase()
         .replace(/\s+/g, "-")
         .replace(/[^a-z0-9-]/g, ""),
   );

   plop.setHelper("pascalCase", (text) => text.replace(/(?:^|-)([a-z])/g, (_, letter) => letter.toUpperCase()));

   plop.setHelper("eq", (a, b) => a === b);
   plop.setHelper("or", (a, b) => a || b);

   // -------------------
   // Validaciones
   // -------------------
   function validateUniqueName(input) {
      if (!input || input.trim() === "") {
         return "El nombre es requerido";
      }

      const kebabName = input
         .toLowerCase()
         .replace(/\s+/g, "-")
         .replace(/[^a-z0-9-]/g, "");

      if (kebabName !== input) {
         return "Use formato kebab-case (ejemplo: mi-proyecto)";
      }

      // Validar existencia en @apps
      if (fs.existsSync(path.join(process.cwd(), "@apps", kebabName))) {
         return `Ya existe un microfrontend con el nombre "${kebabName}"`;
      }

      // Validar existencia en packages
      if (fs.existsSync(path.join(process.cwd(), "packages", kebabName))) {
         return `Ya existe un package con el nombre "${kebabName}"`;
      }

      return true;
   }

   function validateDescription(input) {
      if (!input || input.trim() === "") {
         return "La descripción es requerida";
      }
      if (input.length < 10) {
         return "La descripción debe tener al menos 10 caracteres";
      }
      return true;
   }

   // -------------------
   // Generadores
   // -------------------

   plop.setGenerator("microfrontend-integrado", {
      description: "Crear un microfrontend que se integra en aplicaciones ASP.NET",
      prompts: [
         {
            type: "input",
            name: "name",
            message: "Nombre del microfrontend (kebab-case):",
            validate: validateUniqueName,
         },
         {
            type: "input",
            name: "description",
            message: "Descripción del microfrontend:",
            validate: validateDescription,
         },
         {
            type: "input",
            name: "cdnTestUrl",
            message: "URL del CDN de pruebas (opcional):",
            default: "https://test-b2b2c.cdnpt.com",
         },
         {
            type: "input",
            name: "cdnUrl",
            message: "URL del CDN de producción (opcional):",
            default: "https://b2b2c.cdnpt.com",
         },
      ],
      actions: [
         {
            type: "addMany",
            destination: "@apps/{{kebabCase name}}",
            templateFiles: "plop-templates/microfrontend-integrado/**/*",
            base: "plop-templates/microfrontend-integrado",
            globOptions: { dot: true },
         },
         {
            type: "modify",
            path: "package.json",
            pattern: /("scripts": {[^}]*)/,
            template: '$1,\n    "app-{{kebabCase name}}": "pnpm --filter {{kebabCase name}}"',
         },
         (data) =>
            `✅ Microfrontend integrado "${data.name}" creado exitosamente!\n\n` +
            `📁 Ubicación: @apps/${data.name}/\n` +
            `🚀 Para comenzar: pnpm app-${data.name} dev\n` +
            `📦 Para construir: pnpm app-${data.name} build`,
      ],
   });

   plop.setGenerator("microfrontend-independiente", {
      description: "Crear un microfrontend independiente (SPA)",
      prompts: [
         {
            type: "input",
            name: "name",
            message: "Nombre del microfrontend (kebab-case):",
            validate: validateUniqueName,
         },
         {
            type: "input",
            name: "description",
            message: "Descripción del microfrontend:",
            validate: validateDescription,
         },
         {
            type: "input",
            name: "cdnTestUrl",
            message: "URL del CDN de pruebas (opcional):",
            default: "https://test-b2b2c.cdnpt.com",
         },
         {
            type: "input",
            name: "cdnUrl",
            message: "URL del CDN de producción (opcional):",
            default: "https://b2b2c.cdnpt.com",
         },
      ],
      actions: [
         {
            type: "addMany",
            destination: "@apps/{{kebabCase name}}",
            templateFiles: "plop-templates/microfrontend-independiente/**/*",
            base: "plop-templates/microfrontend-independiente",
            globOptions: { dot: true },
         },
         {
            type: "modify",
            path: "package.json",
            pattern: /("scripts": {[^}]*)/,
            template: '$1,\n    "app-{{kebabCase name}}": "pnpm --filter {{kebabCase name}}"',
         },
         (data) =>
            `✅ Microfrontend independiente "${data.name}" creado exitosamente!\n\n` +
            `📁 Ubicación: @apps/${data.name}/\n` +
            `🚀 Para comenzar: pnpm app-${data.name} dev\n` +
            `📦 Para construir: pnpm app-${data.name} build`,
      ],
   });

   plop.setGenerator("libreria-vue", {
      description: "Crear una librería con componentes Vue reutilizables",
      prompts: [
         {
            type: "input",
            name: "name",
            message: "Nombre de la librería (kebab-case):",
            validate: (input) => {
               const uniqueCheck = validateUniqueName(input);
               if (uniqueCheck !== true) return uniqueCheck;

               if (!input.startsWith("vue-")) {
                  return 'Las librerías Vue deben comenzar con "vue-" (ejemplo: vue-components)';
               }
               return true;
            },
         },
         {
            type: "input",
            name: "description",
            message: "Descripción de la librería:",
            validate: validateDescription,
         },
         {
            type: "confirm",
            name: "usesPinia",
            message: "¿La librería usará Pinia?",
            default: false,
         },
         {
            type: "confirm",
            name: "usesI18n",
            message: "¿La librería usará i18next?",
            default: false,
         },
      ],
      actions: [
         {
            type: "addMany",
            destination: "packages/{{kebabCase name}}",
            templateFiles: "plop-templates/libreria-vue/**/*",
            base: "plop-templates/libreria-vue",
            globOptions: { dot: true },
         },
         (data) =>
            `✅ Librería Vue "${data.name}" creada exitosamente!\n\n` +
            `📁 Ubicación: packages/${data.name}/\n` +
            `🔧 Para desarrollar: cd packages/${data.name} && pnpm dev\n` +
            `📦 Para construir: cd packages/${data.name} && pnpm build`,
      ],
   });

   plop.setGenerator("libreria-utils", {
      description: "Crear una librería de utilidades JavaScript/TypeScript",
      prompts: [
         {
            type: "input",
            name: "name",
            message: "Nombre de la librería (kebab-case):",
            validate: validateUniqueName,
         },
         {
            type: "input",
            name: "description",
            message: "Descripción de la librería:",
            validate: validateDescription,
         },
         {
            type: "list",
            name: "buildTarget",
            message: "Target de construcción:",
            choices: [
               { name: "ES2020 (Moderno)", value: "es2020" },
               { name: "ES2018 (Compatibilidad)", value: "es2018" },
               { name: "ES2015 (Legacy)", value: "es2015" },
            ],
            default: "es2020",
         },
      ],
      actions: [
         {
            type: "addMany",
            destination: "packages/{{kebabCase name}}",
            templateFiles: "plop-templates/libreria-utils/**/*",
            base: "plop-templates/libreria-utils",
            globOptions: { dot: true },
         },
         (data) =>
            `✅ Librería de utilidades "${data.name}" creada exitosamente!\n\n` +
            `📁 Ubicación: packages/${data.name}/\n` +
            `🔧 Para desarrollar: cd packages/${data.name} && pnpm dev\n` +
            `📦 Para construir: cd packages/${data.name} && pnpm build`,
      ],
   });
};

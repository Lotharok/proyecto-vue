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
         {
            type: "modify",
            path: "package.json",
            pattern: /("scripts": {[^}]*)/,
            template: '$1,\n    "lib-{{kebabCase name}}": "pnpm --filter {{kebabCase name}}"',
         },
         (data) =>
            `✅ Librería Vue "${data.name}" creada exitosamente!\n\n` +
            `📁 Ubicación: packages/${data.name}/\n` +
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
      ],
      actions: [
         {
            type: "addMany",
            destination: "packages/{{kebabCase name}}",
            templateFiles: "plop-templates/libreria-utils/**/*",
            base: "plop-templates/libreria-utils",
            globOptions: { dot: true },
         },
         {
            type: "modify",
            path: "package.json",
            pattern: /("scripts": {[^}]*)/,
            template: '$1,\n    "lib-{{kebabCase name}}": "pnpm --filter {{kebabCase name}}"',
         },
         (data) =>
            `✅ Librería de utilidades "${data.name}" creada exitosamente!\n\n` +
            `📁 Ubicación: packages/${data.name}/\n` +
            `📦 Para construir: cd packages/${data.name} && pnpm build`,
      ],
   });

   plop.setGenerator('proyecto-completo', {
      description: '🏗️ Crear workspace Vue.js completo desde cero',
      prompts: [
        {
          type: 'input',
          name: 'projectName',
          message: 'Nombre del proyecto/workspace (kebab-case):',
          default: 'mi-proyecto-vue',
          validate: function (value) {
            if (!value || value.length < 2) {
              return 'El nombre debe tener al menos 2 caracteres';
            }
            if (!/^[a-z][a-z0-9-]*$/.test(value)) {
              return 'Use formato kebab-case (solo minúsculas, números y guiones)';
            }
            return true;
          }
        },
        {
          type: 'input', 
          name: 'description',
          message: 'Descripción del proyecto:',
          default: function(answers) {
            return `Workspace de microfrontends Vue.js 3 + TypeScript para ${answers.projectName}`;
          }
        },
        {
          type: 'input',
          name: 'teamName', 
          message: 'Nombre del equipo:',
          default: 'Frontend Team'
        },
        {
          type: 'confirm',
          name: 'includeTypes',
          message: '¿Incluir package de tipos TypeScript compartidos?',
          default: true
        },
        {
          type: 'confirm',
          name: 'includeUtils', 
          message: '¿Incluir package de utilidades generales (sin Vue)?',
          default: true
        }
      ],
      actions: function(data) {
        let actions = [];
  
        // 1. Archivos de configuración raíz
        actions.push({
          type: 'add',
          path: '{{kebabCase projectName}}/package.json',
          templateFile: 'plop-templates/proyecto-completo/package.json.hbs'
        });
  
        actions.push({
          type: 'add', 
          path: '{{kebabCase projectName}}/pnpm-workspace.yaml',
          templateFile: 'plop-templates/proyecto-completo/pnpm-workspace.yaml.hbs'
        });
  
        actions.push({
          type: 'add',
          path: '{{kebabCase projectName}}/.gitignore', 
          templateFile: 'plop-templates/proyecto-completo/.gitignore.hbs'
        });
  
        actions.push({
          type: 'add',
          path: '{{kebabCase projectName}}/.gitattributes',
          templateFile: 'plop-templates/proyecto-completo/.gitattributes.hbs'
        });
  
        actions.push({
          type: 'add',
          path: '{{kebabCase projectName}}/README.md',
          templateFile: 'plop-templates/proyecto-completo/README.md.hbs'
        });
  
        actions.push({
          type: 'add',
          path: '{{kebabCase projectName}}/eslint.config.mjs',
          templateFile: 'plop-templates/proyecto-completo/eslint.config.mjs.hbs'
        });
  
        actions.push({
          type: 'add',
          path: '{{kebabCase projectName}}/.prettierrc.json',
          templateFile: 'plop-templates/proyecto-completo/.prettierrc.json.hbs'
        });
  
        actions.push({
          type: 'add',
          path: '{{kebabCase projectName}}/.prettierignore',
          templateFile: 'plop-templates/proyecto-completo/.prettierignore.hbs'
        });
  
        // 2. Estructura de carpetas
        actions.push({
          type: 'add',
          path: '{{kebabCase projectName}}/@apps/.gitkeep',
          templateFile: 'plop-templates/proyecto-completo/@apps/.gitkeep.hbs'
        });
  
        // 3. Package vue-utils (siempre incluido)
        actions.push({
          type: 'add',
          path: '{{kebabCase projectName}}/packages/vue-utils/package.json',
          templateFile: 'plop-templates/proyecto-completo/packages/vue-utils/package.json.hbs'
        });
        
        actions.push({
          type: 'addMany',
          destination: '{{kebabCase projectName}}/packages/vue-utils/',
          base: 'plop-templates/proyecto-completo/packages/vue-utils/',
          templateFiles: 'plop-templates/proyecto-completo/packages/vue-utils/**/*',
          globOptions: { dot: true, ignore: ['**/package.json.hbs'] }
        });
  
        // 4. Package types (condicional)
        if (data.includeTypes) {
          actions.push({
            type: 'add',
            path: '{{kebabCase projectName}}/packages/types/package.json',
            templateFile: 'plop-templates/proyecto-completo/packages/types/package.json.hbs'
          });
          
          actions.push({
            type: 'addMany',
            destination: '{{kebabCase projectName}}/packages/types/',
            base: 'plop-templates/proyecto-completo/packages/types/',
            templateFiles: 'plop-templates/proyecto-completo/packages/types/**/*',
            globOptions: { dot: true, ignore: ['**/package.json.hbs'] }
          });
        }
  
        // 5. Package utils (condicional) 
        if (data.includeUtils) {
          actions.push({
            type: 'add',
            path: '{{kebabCase projectName}}/packages/utils/package.json',
            templateFile: 'plop-templates/proyecto-completo/packages/utils/package.json.hbs'
          });
          
          actions.push({
            type: 'addMany',
            destination: '{{kebabCase projectName}}/packages/utils/',
            base: 'plop-templates/proyecto-completo/packages/utils/',
            templateFiles: 'plop-templates/proyecto-completo/packages/utils/**/*',
            globOptions: { dot: true, ignore: ['**/package.json.hbs'] }
          });
        }
  
        // 6. Mensaje de éxito personalizado
        actions.push({
          type: 'custom',
          name: 'success-message',
          function: function(answers, config, plop) {
            const projectPath = `./${plop.renderString('{{kebabCase projectName}}', answers)}/`;
            
            console.log('\n🎉 ¡Workspace generado exitosamente!');
            console.log('📁 Ubicación:', projectPath);
            console.log('\n📋 Próximos pasos:');
            console.log('1. Copiar contenido a tu nuevo repositorio:');
            console.log(`   cp -r ${projectPath}* /ruta/a/tu/nuevo/repo/`);
            console.log('2. cd /ruta/a/tu/nuevo/repo');
            console.log('3. pnpm install');
            console.log('4. pnpm build');
            console.log('5. Crear tu primer microfrontend: npx plop');
            
            return 'Generación completada';
          }
        });
  
        return actions;
      }
    });
};

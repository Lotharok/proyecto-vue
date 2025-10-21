# Configuration Templates

Esta carpeta contiene templates de configuración para TypeScript y Vite que se usan en diferentes tipos de paquetes del monorepo.

## 📂 Contenido

- [TypeScript Configurations](#-typescript-configurations) - Templates de tsconfig.json
- [Vite Configurations](#-vite-configurations) - Templates de vite.config.ts
- [Dependencies Management](#-dependencies-management) - Gestión de dependencias en monorepo

---

# 📘 TypeScript Configurations

Templates de configuración de TypeScript para diferentes tipos de paquetes en el monorepo.

## 📦 Templates disponibles

### 1. `lib.tsconfig.jsonc` - Librerías TypeScript puras

**Cuándo usar:**
- Paquetes que solo contienen TypeScript/JavaScript (sin Vue/React)
- Librerías que serán consumidas por otros paquetes
- Código compartido que se publica a npm

**Características clave:**
- ✅ **SIN `noEmit`** - Genera archivos `.js` y `.d.ts`
- ✅ `declaration: true` - Genera archivos de tipos
- ✅ `composite: true` - Soporta project references
- ✅ `moduleResolution: "bundler"` - Compatible con Vite
- ✅ Strict mode activado para máxima seguridad de tipos

**Ejemplo de uso:**
```json
{
  "extends": "../../configs/lib.tsconfig.jsonc",
  "compilerOptions": {
    // IMPORTANTE: Cambiar el nombre del tsBuildInfoFile para que sea único
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.my-package-name.tsbuildinfo"
  }
}
```

---

### 2. `lib-vue.tsconfig.jsonc` - Librerías Vue

**Cuándo usar:**
- Paquetes que contienen componentes Vue
- Librerías Vue que serán consumidas por otros paquetes
- Componentes compartidos que se publican

**Características clave:**
- ✅ **SIN `noEmit`** - Genera archivos `.js` y `.d.ts`
- ✅ Extiende de `@vue/tsconfig/tsconfig.dom.json`
- ✅ `jsx: "preserve"` - Mantiene JSX para Vue
- ✅ Soporta `.vue`, `.ts`, `.tsx`
- ✅ Strict mode con `noUncheckedIndexedAccess`

**Ejemplo de uso:**
```json
{
  "extends": "../../configs/lib-vue.tsconfig.jsonc",
  "compilerOptions": {
    // IMPORTANTE: Cambiar el nombre del tsBuildInfoFile para que sea único
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.my-vue-package.tsbuildinfo"
  }
}
```

---

### 3. `app-vue.tsconfig.jsonc` - Aplicaciones Vue

**Cuándo usar:**
- Aplicaciones finales Vue (no librerías)
- Apps que usan Vite/Webpack como bundler
- Proyectos que solo necesitan type-checking

**Características clave:**
- ✅ `noEmit` implícito (desde `@vue/tsconfig`) - El bundler compila
- ✅ Solo type-checking, no genera archivos
- ✅ Configuración optimizada para desarrollo
- ✅ `erasableSyntaxOnly` y `noUncheckedSideEffectImports`

**Uso recomendado:**
Para apps, usa la estructura de project references:

```json
// tsconfig.json (raíz de la app)
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}

// tsconfig.app.json
{
  "extends": "../../configs/app-vue.tsconfig.jsonc",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```

---

## 🎯 Regla de oro: `noEmit`

### ❌ **Librerías: NO usar `noEmit`**
Las librerías **deben emitir** archivos compilados (`.js` y `.d.ts`) porque:
- Otros paquetes las consumen desde `dist/`
- Necesitan archivos de definición de tipos
- Vite + `vite-plugin-dts` requiere que TypeScript genere los tipos

### ✅ **Aplicaciones: Usar `noEmit` (implícito)**
Las apps solo necesitan type-checking porque:
- Vite/Webpack manejan la compilación
- No se publican a npm
- Solo se ejecutan en desarrollo/producción

---

## 📚 Diferencias clave

| Característica | lib.tsconfig | lib-vue.tsconfig | app-vue.tsconfig |
|----------------|--------------|------------------|------------------|
| **Genera archivos** | ✅ Sí | ✅ Sí | ❌ No |
| **noEmit** | ❌ No | ❌ No | ✅ Sí (implícito) |
| **Vue support** | ❌ No | ✅ Sí | ✅ Sí |
| **composite** | ✅ Sí | ✅ Sí | ❌ No |
| **Uso** | Libs TS puras | Libs Vue | Apps Vue |

---

## 🔧 Cómo usar estos templates

1. **Para una nueva librería TypeScript:**
   ```bash
   cp configs/lib.tsconfig.jsonc packages/mi-lib/tsconfig.json
   ```

2. **Para una nueva librería Vue:**
   ```bash
   cp configs/lib-vue.tsconfig.jsonc packages/mi-vue-lib/tsconfig.json
   ```

3. **Para una nueva app Vue:**
   ```bash
   cp configs/app-vue.tsconfig.jsonc @apps/mi-app/tsconfig.app.json
   ```

---

## ⚙️ Opciones comunes explicadas

### `incremental` y `tsBuildInfoFile`
- Acelera compilaciones incrementales
- Guarda cache en `.tmp/` para no contaminar el workspace
- **CRÍTICO en monorepos:** Cada paquete DEBE tener un nombre único para `tsBuildInfoFile`
- ❌ Mal: `"tsBuildInfoFile": "./node_modules/.tmp/tsconfig.tsbuildinfo"` (genérico)
- ✅ Bien: `"tsBuildInfoFile": "./node_modules/.tmp/tsconfig.my-package.tsbuildinfo"` (único)
- Si varios paquetes comparten el mismo nombre, los builds incrementales se pisarán entre sí

### `composite: true`
- Habilita project references
- Permite builds incrementales en monorepos
- Solo para librerías, no para apps

### `verbatimModuleSyntax`
- TypeScript 5.0+
- Más estricto con imports/exports
- Previene errores de transpilación

### `noUncheckedIndexedAccess`
- Hace que `obj[key]` retorne `T | undefined`
- Mayor seguridad en accesos dinámicos
- Recomendado para librerías críticas

---

## 🚨 Errores comunes

### ❌ tsBuildInfoFile duplicado en monorepo
```jsonc
// ❌ MAL - Todos los paquetes usan el mismo nombre
// packages/foo/tsconfig.json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.tsbuildinfo"
  }
}

// packages/bar/tsconfig.json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.tsbuildinfo" // ❌ Colisión!
  }
}
```

```jsonc
// ✅ BIEN - Cada paquete tiene nombre único
// packages/foo/tsconfig.json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.foo.tsbuildinfo"
  }
}

// packages/bar/tsconfig.json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.bar.tsbuildinfo"
  }
}
```

### ❌ Librería con `noEmit: true`
```jsonc
// ❌ MAL - La librería no generará archivos
{
  "compilerOptions": {
    "noEmit": true,
    "declaration": true  // Contradictorio
  }
}
```

### ✅ Librería correcta
```jsonc
// ✅ BIEN - Genera .js y .d.ts
{
  "compilerOptions": {
    // SIN noEmit
    "declaration": true
  }
}
```

---

## 📖 Referencias TypeScript

- [TypeScript Handbook - Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
- [Vue TypeScript Config](https://github.com/vuejs/tsconfig)
- [Vite - TypeScript](https://vitejs.dev/guide/features.html#typescript)

---

# ⚡ Vite Configurations

Templates de configuración de Vite para diferentes tipos de paquetes y aplicaciones en el monorepo.

## 📦 Templates disponibles

### 1. `vite.config.lib.ts` - Librerías TypeScript puras

**Cuándo usar:**
- Paquetes sin Vue (como `packages/types`, `packages/utils`)
- Librerías que serán consumidas por otros paquetes
- Código compartido que se publica a npm

**Cómo usar:**
```bash
cp configs/vite.config.lib.ts packages/mi-lib/vite.config.ts
```

**Características clave:**
- ✅ Sin plugin `vue()`
- ✅ `vite-plugin-dts` con `rollupTypes: false`
- ✅ Source maps habilitados
- ✅ `preserveModules: true` para tree-shaking
- ✅ Externalización de peerDependencies

---

### 2. `vite.config.lib-vue.ts` - Librerías Vue

**Cuándo usar:**
- Paquetes con componentes Vue (como `packages/vue-utils`)
- Librerías Vue que serán consumidas por otros paquetes
- Componentes compartidos que se publican

**Cómo usar:**
```bash
cp configs/vite.config.lib-vue.ts packages/mi-vue-lib/vite.config.ts
```

**Características clave:**
- ✅ Plugin `vue()` incluido
- ✅ `vite-plugin-dts` con soporte para `.vue`
- ✅ Manejo de CSS sin code-splitting
- ✅ `assetFileNames` para nombrar `style.css` de forma predecible
- ✅ Externalización de Vue y peerDependencies

---

### 3. `vite.config.app-vue.ts` - Aplicaciones Vue

**Cuándo usar:**
- Aplicaciones finales Vue en `@apps/`
- Apps que se sirven a usuarios finales
- Proyectos que necesitan code splitting

**Cómo usar:**
```bash
cp configs/vite.config.app-vue.ts @apps/mi-app/vite.config.ts
```

**Características clave:**
- ✅ **NO tiene `build.lib`** - Compila como aplicación
- ✅ Code splitting con `manualChunks` para optimizar carga
- ✅ Entry file name específico (personalizable)
- ✅ Source maps condicionales según entorno (`hidden` en producción)
- ✅ Tree-shaking agresivo
- ❌ **NO usa `vite-plugin-dts`** (las apps no generan tipos)

**Personalización requerida:**
```typescript
// Edita estas líneas en tu copia:
output: {
  entryFileNames: "my-app.js", // ← Cambia esto por el nombre de tu app
  manualChunks: (id) => {
    // ← Ajusta según los paquetes que uses
  }
}
```

---

## 🎯 Diferencias clave: Librerías vs Aplicaciones

| Característica | Librerías | Aplicaciones |
|----------------|-----------|--------------|
| **`build.lib`** | ✅ Sí | ❌ No |
| **`vite-plugin-dts`** | ✅ Sí | ❌ No |
| **`preserveModules`** | ✅ Sí | ❌ No |
| **`manualChunks`** | ❌ No | ✅ Sí |
| **`external`** | ✅ Sí (peerDeps) | ❌ No (bundlea todo) |
| **Source maps** | ✅ `true` | ✅ `hidden` en prod |
| **Objetivo** | Distribuible | Aplicación final |

---

## 🔧 Opciones importantes explicadas

### `preserveModules: true` (Librerías)

```typescript
output: {
  preserveModules: true,
  preserveModulesRoot: "src",
}
```

**¿Por qué?**
- Mantiene la estructura de carpetas original
- Permite tree-shaking efectivo (importar solo lo necesario)
- Mejor para librerías consumidas por otros paquetes

**Resultado:**
```
dist/
  index.js
  components/
    Button.js
    Card.js
  utils/
    format.js
```

**Alternativa (`preserveModules: false`):**
- Bundlea todo en un solo archivo
- Peor para tree-shaking
- Útil solo si necesitas un bundle único

---

### `rollupTypes: false` en vite-plugin-dts (Librerías)

```typescript
dts({
  rollupTypes: false,      // ← No bundlea tipos (RECOMENDADO)
  insertTypesEntry: true,
  copyDtsFiles: true,
})
```

**¿Por qué `false`?**
- ✅ **Mejor tree-shaking**: Los consumidores importan solo los tipos que necesitan
- ✅ **Preserva estructura**: Los `.d.ts` siguen la misma organización que los `.ts`
- ✅ **Consistencia**: Los tipos tienen la misma estructura que el código JavaScript
- ✅ **Más rápido**: No necesita bundlear todos los tipos en uno solo
- ✅ **Menos errores**: Evita problemas de resolución de tipos bundleados

**Resultado con `rollupTypes: false` (RECOMENDADO):**
```
dist/
  index.js
  index.d.ts           ← Entry point de tipos
  components/
    Button.js
    Button.d.ts        ← Tipos individuales preservados
    Card.js
    Card.d.ts          ← Permite tree-shaking selectivo
  utils/
    format.js
    format.d.ts
```

**Comparación con `rollupTypes: true` (NO recomendado):**
```
dist/
  index.js
  index.d.ts           ← TODOS los tipos bundleados en un solo archivo
  components/
    Button.js
    Button.d.ts        ← Tipos individuales duplicados (redundante)
    Card.js
    Card.d.ts
```

**Ejemplo práctico:**

Con `rollupTypes: false`, si un consumidor importa solo un componente:
```typescript
// El consumidor solo importa Button
import { Button } from '@pnpmworkspace/vue-utils';
```

TypeScript carga:
- ✅ Solo `components/Button.d.ts` (tree-shaking efectivo)

Con `rollupTypes: true`:
- ❌ Carga `index.d.ts` completo con TODOS los tipos (sin tree-shaking)

> **Nota importante:** Usamos `rollupTypes: false` porque ya usamos `preserveModules: true`. Ambos trabajan juntos para optimizar el tree-shaking tanto de JavaScript como de tipos TypeScript.

---

### `external` - Externalización de dependencias (Librerías)

```typescript
rollupOptions: {
  external: (id) => {
    // No bundlear peerDependencies
    return id === "vue" || id.startsWith("vue/");
  },
}
```

**¿Por qué externalizar?**
- ❌ Sin externalizar: Tu librería bundlea `vue` → duplicación, bundle gigante (500KB+)
- ✅ Con externalizar: Tu librería asume que `vue` está disponible → bundle pequeño (<50KB)

**Regla de oro:**
- ✅ Externaliza TODAS las `peerDependencies`
- ✅ Externaliza dependencias grandes que el consumidor ya tiene
- ❌ NO externalices utilidades pequeñas específicas de tu librería

---

### `manualChunks` - Code Splitting (Aplicaciones)

```typescript
manualChunks: (id) => {
  // Vendor chunks (dependencias externas)
  if (id.includes("node_modules")) {
    if (id.includes("/vue/")) return "vue-vendor";        // ~40KB
    if (id.includes("/pinia/")) return "pinia-vendor";    // ~10KB
    if (id.includes("/i18next/")) return "i18n-vendor";   // ~30KB
    return "vendor"; // Otros vendors
  }

  // Package chunks (monorepo)
  if (id.includes("packages/vue-utils")) return "pk-vue-utils";
  if (id.includes("packages/vue-modal")) return "pk-vue-modal";
}
```

**Beneficios:**
- ✅ **Caching efectivo**: Vendors cambian menos que código de app
- ✅ **Carga paralela**: El navegador descarga chunks simultáneamente
- ✅ **Actualizaciones rápidas**: Solo se recarga código de app, no vendors

**Resultado:**
```
dist/assets/
  my-app.js                    # Entry point de la app
  vue-vendor-[hash].js         # Vue core (~40KB)
  pinia-vendor-[hash].js       # Pinia (~10KB)
  i18n-vendor-[hash].js        # i18next (~30KB)
  pk-vue-utils-[hash].js       # Paquetes del monorepo
  vendor-[hash].js             # Otros vendors
  index.css                    # Estilos
```

---

### `sourcemap` - Source Maps

**Para librerías:**
```typescript
build: {
  sourcemap: true, // Siempre true
}
```

**Para aplicaciones:**
```typescript
build: {
  sourcemap: mode === "production" ? "hidden" : true,
}
```

**Diferencias:**

| Modo | Valor | Resultado |
|------|-------|-----------|
| **Desarrollo** | `true` | Source maps inline (debugging fácil) |
| **Producción (libs)** | `true` | Archivos `.map` separados (para consumidores) |
| **Producción (apps)** | `"hidden"` | Archivos `.map` separados (no referenciados en JS) |

**Beneficios de `hidden` en apps:**
- ✅ Los `.map` se generan pero no se referencian en el código
- ✅ Bundle principal no carga los source maps
- ✅ Puedes usar los `.map` para debugging de errores en producción
- ✅ Servicios de error tracking (Sentry, etc.) pueden usar los `.map`

---

### `assetFileNames` - Nombres de archivos CSS (Librerías Vue)

```typescript
assetFileNames: (assetInfo) => {
  if (assetInfo.names?.[0] === "style.css") return "style.css";
  return assetInfo.names?.[0] || "asset-[hash][extname]";
}
```

**¿Por qué?**
- CSS principal siempre se llama `style.css` (predecible en `package.json`)
- Otros assets usan nombres originales o hash
- **Nota:** Usa `names?.[0]` en lugar de `name` (deprecado en Vite 5+)

**En `package.json`:**
```json
{
  "exports": {
    "./style.css": "./dist/style.css"
  }
}
```

---

## 🚨 Problemas comunes y soluciones

### ❌ Problema 1: Tipos no se generan correctamente

**Síntoma:**
```
dist/
  index.js ✓
  index.d.ts ❌ Falta
```

**Causa:** Falta configuración de `vite-plugin-dts`

**Solución:**
```typescript
import dts from "vite-plugin-dts";

plugins: [
  dts({
    rollupTypes: false,       // ← Agrega esto
    insertTypesEntry: true,   // ← Y esto
    copyDtsFiles: true,       // ← Y esto
  }),
],
```

---

### ❌ Problema 2: Vue bundleado en la librería

**Síntoma:**
- `dist/index.js` pesa 500KB+ (debería ser <50KB)
- Warnings: "vue is not externalized"

**Causa:** Vue no está externalizado

**Solución:**
```typescript
rollupOptions: {
  external: (id) => {
    // Externalizar Vue
    return id === "vue" || id.startsWith("vue/");
  },
}
```

---

### ❌ Problema 3: `assetInfo.name is deprecated`

**Síntoma:**
```
Warning: assetInfo.name is deprecated (6385)
```

**Solución:**
```typescript
// ❌ Deprecated
assetFileNames: (assetInfo) => {
  if (assetInfo.name === "style.css") return "style.css";
  return assetInfo.name || "asset-[hash][extname]";
}

// ✅ Correcto (Vite 5+)
assetFileNames: (assetInfo) => {
  if (assetInfo.names?.[0] === "style.css") return "style.css";
  return assetInfo.names?.[0] || "asset-[hash][extname]";
}
```

---

### ❌ Problema 4: Source maps no disponibles

**Síntoma:**
- No puedes hacer debugging del código original
- Stack traces muestran código compilado/minificado

**Solución para librerías:**
```typescript
build: {
  sourcemap: true, // ← Agrega esto
}
```

**Solución para apps:**
```typescript
build: {
  sourcemap: mode === "production" ? "hidden" : true,
}
```

---

### ❌ Problema 5: Bundle de app demasiado grande

**Síntoma:**
- Bundle principal >500KB
- Tiempo de carga inicial lento

**Solución:** Implementar code splitting

```typescript
rollupOptions: {
  output: {
    manualChunks: (id) => {
      // Separar vendors grandes
      if (id.includes("node_modules")) {
        if (id.includes("/vue/")) return "vue-vendor";
        if (id.includes("/@lottiefiles/")) return "lottie-vendor";
        return "vendor";
      }
    },
  },
  // Tree-shaking agresivo
  treeshake: {
    preset: "recommended",
    moduleSideEffects: "no-external",
  },
}
```

**Impacto estimado:**
- 30-50% reducción en bundle principal
- Mejor performance en carga inicial
- Mejor caching

---

## 🧪 Verificación

### Para librerías

**1. Build exitoso:**
```bash
cd packages/mi-lib
pnpm build
```

**2. Archivos generados:**
```
dist/
  ✅ index.js              - Código compilado
  ✅ index.d.ts            - Tipos
  ✅ index.js.map          - Source map de código
  ✅ index.d.ts.map        - Source map de tipos
  ✅ style.css             - CSS (si aplica)
  ✅ components/           - Módulos preservados
     ✅ Button.js
     ✅ Button.d.ts
```

**3. Sin warnings:**
- ❌ "assetInfo.name is deprecated"
- ❌ "vue is not externalized"
- ❌ "Failed to generate types"

---

### Para aplicaciones

**1. Build exitoso:**
```bash
cd @apps/mi-app
pnpm build
```

**2. Analizar chunks generados:**
```bash
ls -lh dist/assets/

# Deberías ver:
my-app.js                 # Entry point
vue-vendor-[hash].js      # Vue core
pinia-vendor-[hash].js    # Pinia
i18n-vendor-[hash].js     # i18next
pk-vue-utils-[hash].js    # Paquetes del monorepo
vendor-[hash].js          # Otros vendors
index.css                 # Estilos
```

**3. Verificar source maps:**
```bash
# Producción: debería generar .map separados (hidden)
ls dist/**/*.map

# Desarrollo: inline en el código
```

---

## 🎯 Recomendaciones adicionales

### 1. Lazy Loading de rutas (Apps)

Si usas Vue Router:
```typescript
// ❌ Import estático (todo en bundle principal)
import Home from './views/Home.vue'

// ✅ Import dinámico (chunk separado)
const Home = () => import('./views/Home.vue')
```

### 2. Bundle analyzer

Para visualizar qué ocupa espacio:
```bash
pnpm add -D rollup-plugin-visualizer
```

```typescript
import { visualizer } from 'rollup-plugin-visualizer'

plugins: [
  vue(),
  visualizer({ open: true }), // Genera stats.html
]
```

### 3. Compression en producción (Apps)

Considera agregar compresión gzip/brotli:
```bash
pnpm add -D vite-plugin-compression
```

```typescript
import compression from 'vite-plugin-compression'

plugins: [
  vue(),
  compression({ algorithm: 'brotliCompress' }),
]
```

---

## 📖 Referencias Vite

- [Vite Library Mode](https://vitejs.dev/guide/build.html#library-mode)
- [Vite Build Options](https://vitejs.dev/config/build-options.html)
- [vite-plugin-dts](https://github.com/qmhc/vite-plugin-dts)
- [Rollup External](https://rollupjs.org/configuration-options/#external)
- [Rollup Output Options](https://rollupjs.org/configuration-options/#output-preservemodules)
- [Rollup Manual Chunks](https://rollupjs.org/configuration-options/#output-manualchunks)
- [Code Splitting Best Practices](https://web.dev/code-splitting-suspense/)

---

# 📦 Dependencies Management

Guía completa para gestionar dependencias correctamente en el monorepo con pnpm workspaces y Turborepo.

## 🎯 Conceptos clave

### `dependencies`
Paquetes **necesarios en runtime**. Se instalan automáticamente cuando alguien consume tu paquete.

### `devDependencies`
Paquetes **solo necesarios en desarrollo/build**. No se instalan cuando alguien consume tu paquete.

### `peerDependencies`
Paquetes que **debe proveer el consumidor**. Evita duplicación de dependencias compartidas (como Vue, React, etc.).

---

## 📚 Estrategia para Librerías

### Paquetes en `packages/`

Las librerías son paquetes **compartidos y reutilizables** que otras partes del monorepo consumen.

#### ✅ ¿Qué va en `dependencies`?

**SOLO paquetes del workspace** que necesitas importar:

```json
{
  "dependencies": {
    "@pnpmworkspace/types": "workspace:*",
    "@pnpmworkspace/vue-modal": "workspace:*"
  }
}
```

**¿Por qué?**
- Turbo necesita esto para inferir el orden de build
- Con `"dependsOn": ["^build"]`, Turbo construirá las dependencias antes que tu paquete

#### ✅ ¿Qué va en `devDependencies`?

**Librerías necesarias para compilar** (TypeScript necesita acceso a tipos):

```json
{
  "devDependencies": {
    "@my-organization/vue-shared": "catalog:",
    "i18next-vue": "catalog:",
    "vue": "catalog:"
  }
}
```

**¿Por qué?**
- TypeScript/Vite necesitan estos paquetes durante el build
- No se instalarán cuando otro paquete consuma tu librería

**⚠️ REGLA DE ORO:**

```
peerDependencies ⊆ devDependencies
```

**Todo lo que esté en `peerDependencies` DEBE estar también en `devDependencies`**

- `peerDependencies` NO se instalan automáticamente
- Sin `devDependencies`, tu build fallará porque los paquetes no estarán en `node_modules`

#### ✅ ¿Qué va en `peerDependencies`?

**Dependencias que el consumidor debe proveer**:

```json
{
  "peerDependencies": {
    "@my-organization/vue-shared": "catalog:",
    "i18next-vue": "catalog:",
    "vue": "catalog:"
  }
}
```

**¿Por qué?**
- Indicas qué versiones son compatibles
- El consumidor final (app) proveerá estas dependencias
- Evitas que se empaqueten múltiples versiones de Vue, por ejemplo

#### ✅ Sincronizar con `vite.config.ts`

**CRÍTICO**: Marca como `external` todo lo que esté en `peerDependencies`:

```typescript
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      formats: ["es"],
    },
    rollupOptions: {
      external: (id) => {
        // Vue (peerDependency)
        if (id === "vue" || id.startsWith("vue/")) return true;

        // Otras peerDependencies
        if (id === "@my-organization/vue-shared" || id.startsWith("@my-organization/vue-shared/")) return true;
        if (id === "i18next-vue" || id.startsWith("i18next-vue/")) return true;

        // Paquetes del workspace (dependency)
        if (id.startsWith("@pnpmworkspace/")) return true;

        return false;
      },
    },
  },
});
```

**¿Por qué?**
- Los `external` no se empaquetan en el `dist/`
- El bundle final es más ligero
- Se mantienen como imports que el consumidor resuelve

---

### Ejemplo completo: Librería Vue

**`packages/vue-utils/package.json`**

```json
{
  "name": "@pnpmworkspace/vue-utils",
  "dependencies": {
    "@pnpmworkspace/types": "workspace:*",
    "@pnpmworkspace/vue-modal": "workspace:*"
  },
  "devDependencies": {
    "@my-organization/vue-shared": "catalog:",
    "i18next-vue": "catalog:",
    "pinia": "catalog:",
    "vue": "catalog:",
    "@vitejs/plugin-vue": "^6.0.1",
    "vite": "^7.1.10",
    "vite-plugin-dts": "^4.3.0"
  },
  "peerDependencies": {
    "@my-organization/vue-shared": "catalog:",
    "i18next-vue": "catalog:",
    "pinia": "catalog:",
    "vue": "catalog:"
  }
}
```

**Beneficios:**
- ✅ Turbo construye `types` y `vue-modal` primero
- ✅ TypeScript tiene acceso a tipos durante build
- ✅ El bundle NO incluye Vue ni otras librerías externas
- ✅ El consumidor controla las versiones finales

---

## 🚀 Estrategia para Apps

### Apps en `@apps/`

Las apps son **puntos de entrada finales** que empaquetan todo en un bundle listo para producción.

#### ✅ ¿Qué va en `dependencies`?

**TODO lo que necesita la app en runtime**:

```json
{
  "dependencies": {
    "@my-organization/ts-shared": "catalog:",
    "@my-organization/vue-shared": "catalog:",
    "@pnpmworkspace/types": "workspace:*",
    "@pnpmworkspace/vue-utils": "workspace:*",
    "@pnpmworkspace/commission-table": "workspace:*",
    "i18next": "catalog:",
    "i18next-vue": "catalog:",
    "pinia": "catalog:",
    "vue": "catalog:"
  }
}
```

**¿Por qué?**
- Las apps empaquetan todo (no usan `externals`)
- Son el punto final de la cadena de dependencias
- Necesitan todas las dependencias disponibles

#### ✅ ¿Qué va en `devDependencies`?

**SOLO herramientas de desarrollo** (NO librerías de código):

```json
{
  "devDependencies": {
    "@vitejs/plugin-vue": "^6.0.1",
    "vite": "^7.1.10",
    "vue-tsc": "^3.1.1"
  }
}
```

**¿Por qué?**
- Build tools, linters, test frameworks
- NO código que se importa en tu app

#### ❌ NO usar `peerDependencies`

Las apps no necesitan `peerDependencies` porque:
- No son consumidas por otros paquetes
- Son el consumidor final

---

### Ejemplo completo: App Vue

**`@apps/review/package.json`**

```json
{
  "name": "review",
  "dependencies": {
    "@my-organization/ts-shared": "catalog:",
    "@my-organization/vue-shared": "catalog:",
    "@pnpmworkspace/types": "workspace:*",
    "@pnpmworkspace/vue-modal": "workspace:*",
    "@pnpmworkspace/vue-utils": "workspace:*",
    "@pnpmworkspace/commission-table": "workspace:*",
    "i18next": "catalog:",
    "i18next-vue": "catalog:",
    "pinia": "catalog:",
    "vue": "catalog:"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^6.0.1",
    "vite": "^7.1.10",
    "vue-tsc": "^3.1.1"
  }
}
```

**Beneficios:**
- ✅ Todas las dependencias workspace disponibles
- ✅ Turbo construye las librerías antes que la app
- ✅ Declaración clara de todas las dependencias

---

## 📊 Comparación: Librerías vs Apps

| Aspecto | **Librerías** (`packages/`) | **Apps** (`@apps/`) |
|---------|----------------------------|---------------------|
| **Propósito** | Reutilizables, compartidas | Punto final, ejecutable |
| **`dependencies`** | Solo paquetes workspace | Todo lo necesario en runtime |
| **`devDependencies`** | Librerías para build + tools | Solo build tools |
| **`peerDependencies`** | ✅ Librerías externas | ❌ No aplica |
| **Vite externals** | ✅ Marca peerDeps como external | ❌ Empaqueta todo |
| **Bundle** | Ligero, sin peerDeps | Completo, listo para deploy |
| **Consumidores** | Apps y otras librerías | Usuario final (navegador) |

---

## 🚨 Problemas comunes

### ❌ Problema 1: Turbo no infiere orden de build

**Síntoma:**
```
Error: Cannot find module '@pnpmworkspace/types'
```

**Causa:**
```json
// ❌ MAL - Paquete workspace en peerDependencies
{
  "peerDependencies": {
    "@pnpmworkspace/types": "workspace:*"
  }
}
```

**Solución:**
```json
// ✅ BIEN - Paquete workspace en dependencies
{
  "dependencies": {
    "@pnpmworkspace/types": "workspace:*"
  }
}
```

---

### ❌ Problema 2: Bundle de librería muy grande

**Síntoma:**
El `dist/` de tu librería pesa 500KB+ e incluye Vue, i18next, etc.

**Causa:**
```typescript
// ❌ MAL - vite.config.ts sin externals
export default defineConfig({
  build: {
    lib: { entry: "./src/index.ts" }
  }
});
```

**Solución:**
```typescript
// ✅ BIEN - Con externals
export default defineConfig({
  build: {
    lib: { entry: "./src/index.ts" },
    rollupOptions: {
      external: (id) => {
        if (id === "vue" || id.startsWith("vue/")) return true;
        if (id === "@my-organization/vue-shared") return true;
        return false;
      },
    },
  },
});
```

```json
// ✅ Y en package.json
{
  "peerDependencies": {
    "vue": "catalog:",
    "@my-organization/vue-shared": "catalog:"
  },
  "devDependencies": {
    "vue": "catalog:",
    "@my-organization/vue-shared": "catalog:"
  }
}
```

---

### ❌ Problema 3: Build de librería falla

**Síntoma:**
```
Cannot find module 'vue' or its corresponding type declarations
```

**Causa:**
```json
// ❌ MAL - peerDependency sin devDependency
{
  "peerDependencies": {
    "vue": "catalog:"
  }
  // Falta devDependencies
}
```

**Solución:**
```json
// ✅ BIEN - peerDependency + devDependency
{
  "devDependencies": {
    "vue": "catalog:"
  },
  "peerDependencies": {
    "vue": "catalog:"
  }
}
```

---

## 🔧 Resolución de Problemas

### Después de cambiar dependencias

```bash
# 1. Limpiar e instalar
pnpm install

# 2. Si persisten problemas, limpiar cache
pnpm turbo clean
rm -rf node_modules
pnpm install

# 3. Build completo
pnpm build
```

### Validar orden de build

```bash
# Ver el grafo de dependencias
pnpm turbo build --dry-run

# Debería mostrar:
# - types (sin deps)
# - vue-modal (sin deps)
# - commission-table (depende de types)
# - vue-utils (depende de types, vue-modal)
# - apps (dependen de todas las anteriores)
```

### Verificar externals

```bash
# Construir librería
cd packages/vue-utils
pnpm build

# Revisar el dist - NO debería contener:
# - node_modules/vue
# - node_modules/@my-organization
# - etc.

# Debería solo tener tu código compilado
ls -la dist/
```

---

## 🔍 Checklist de validación

### Para Librerías (`packages/`)

- [ ] `dependencies` solo contiene paquetes workspace (`@pnpmworkspace/*`)
- [ ] `devDependencies` contiene librerías necesarias para build
- [ ] `peerDependencies` declara librerías externas
- [ ] **CRÍTICO:** Todo en `peerDependencies` está también en `devDependencies`
- [ ] `vite.config.ts` marca como `external` todo en `peerDependencies`
- [ ] `vite.config.ts` marca como `external` los paquetes workspace
- [ ] El `dist/` NO contiene código de peerDependencies (verificar tamaño)

### Para Apps (`@apps/`)

- [ ] `dependencies` contiene TODO (workspace + librerías externas)
- [ ] `devDependencies` solo contiene build tools
- [ ] NO hay `peerDependencies`
- [ ] `vite.config.ts` NO usa `external` (empaqueta todo)
- [ ] El build genera un bundle completo

### Para Ambos

- [ ] Después de cambios: ejecutar `pnpm install`
- [ ] Build exitoso: `pnpm build`
- [ ] No hay errores de módulos no encontrados
- [ ] Turbo respeta el orden de build: `pnpm turbo build --dry-run`

---

## ❓ Preguntas frecuentes

### ¿Por qué una librería necesita `devDependencies` Y `peerDependencies`?

**Respuesta corta:** Las `peerDependencies` NO se instalan automáticamente.

**Explicación detallada:**
- **`peerDependencies`**: "Consumidor, **tú** debes proveer estas dependencias" (declaración)
- **`devDependencies`**: "**Yo** necesito estas dependencias para compilar" (instalación real)

Cuando desarrollas la librería:
```bash
cd packages/vue-utils
pnpm install  # Instala devDependencies ✅
pnpm build    # TypeScript puede resolver 'vue', 'i18next-vue', etc. ✅
```

Cuando alguien consume tu librería:
```bash
pnpm add @pnpmworkspace/vue-utils
# Solo instala dependencies
# peerDependencies → solo genera warnings si faltan
# devDependencies → NO se instalan (evita duplicados)
```

### ¿Qué pasa si pongo todo en `dependencies` en una librería?

- ❌ Tu librería empaquetará Vue, i18next, etc. (bundle gigante)
- ❌ La app final podría tener múltiples versiones de Vue
- ❌ Conflictos de versiones y mayor tamaño de bundle

### ¿Cómo sé si algo debe ir en `dependencies` o `devDependencies`?

**Pregunta simple:** ¿Lo importas en tu código fuente?

**Para apps:**
- ✅ **SÍ** → `dependencies`
- ❌ **NO** (solo herramienta) → `devDependencies`

**Para librerías:**
- ✅ **SÍ** (paquete workspace) → `dependencies`
- ✅ **SÍ** (librería externa) → `devDependencies` + `peerDependencies`
- ❌ **NO** (solo herramienta) → `devDependencies`

---

## 📖 Referencias Dependencies

- [pnpm workspace docs](https://pnpm.io/workspaces)
- [Turborepo - Dependencies](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks#dependencies)
- [npm peer dependencies](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#peerdependencies)

---

**Última actualización:** 2025-10-21

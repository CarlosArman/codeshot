# 📝 Changelog

> 🌐 [Read in English](./CHANGELOG.md)

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/),
y este proyecto sigue versionado semántico ([SemVer](https://semver.org/lang/es/)).

---

## [Sin publicar]

### ⚙️ CI/CD

- **Despliegue automático a GitHub Pages** (`.github/workflows/deploy-pages.yml`): un push a `main` ahora despliega automáticamente `codeshot-web/` a la rama `gh-pages` usando `JamesIves/github-pages-deploy-action`. El workflow solo se activa cuando cambian archivos dentro de `codeshot-web/**`; los archivos existentes en `gh-pages` que no están en `codeshot-web/` (p. ej. `vendor/`) se preservan (`clean: false`). También se admite ejecución manual mediante `workflow_dispatch`.

---

## [1.3.0] - 2026-10-27

### ✨ Añadido

- **Filtros curados de templates**: la galería de plantillas ahora filtra por estilo/destino (Profesional, Documentación, Social) y ratio vertical, manteniendo estados `aria-pressed` para navegación accesible.
- **Procesamiento por lote de archivos de código** (app web/Chrome): permite seleccionar hasta 12 snippets/archivos, detecta su lenguaje por extensión y genera un ZIP PNG 2× por archivo usando la composición visual actual. La cola es secuencial, informa el progreso y restaura el editor original al finalizar.
- **Packs de exportación por destino** (app web/Chrome): LinkedIn, Documentation y Social generan ZIPs con sus combinaciones reales de formato y escala. Los nombres de archivo son deterministas y WEBP usa PNG con sufijo de fallback cuando el navegador no lo soporta.
- **Feedback de exportación accionable** (app web/Chrome): muestra estados visibles de generación, preparación y éxito; ante un fallo ofrece una explicación contextual (librería ausente, restricción de seguridad o renderizado) y un botón accesible para reintentar la descarga.
- **Aviso de fuentes en el preflight de exportación** (app web/Chrome): detecta mediante la Font Loading API si la familia tipográfica seleccionada está disponible; cuando no lo está, avisa que la imagen se exportará con una fuente de respaldo. El aviso se actualiza al cambiar de fuente.
- **Mejoras de la biblioteca persistente de proyectos** (app web/Chrome):
  - Miniaturas JPEG reales generadas desde el canvas actual y guardadas con cada proyecto.
  - Base de datos IndexedDB versionada (`codeshot-library`) para proyectos, con migración automática desde la biblioteca existente en `localStorage`.
  - Caché/fallback resiliente en `localStorage`, conservado para un inicio inmediato y para entornos donde IndexedDB no esté disponible.
  - Conciliación automática de IndexedDB y de los proyectos en caché por ID y `updatedAt`, conservando la copia más reciente.
  - Respaldo/importación, autoguardado, versiones, renombrado, duplicado, archivar/restaurar y eliminación usan la misma capa de persistencia.
  - Restaurar los valores por defecto también elimina la base local versionada de proyectos.

### 📚 Documentación

- Documentada la biblioteca persistente de proyectos, las miniaturas reales, el respaldo/importación JSON y la estrategia de almacenamiento con IndexedDB en los README en inglés y español.

### 🔄 Cambiado

- **Versión de la extensión** bumpeada a `1.3.0`.

### 🐛 Corregido

- **SonarQube — `role="status"` en HTML**: el `<div role="status">` del banner de feedback de exportación (`#exportFeedback`) reemplazado por el elemento nativo `<output>`, que provee la semántica de estado sin necesitar un rol explícito.
- **SonarQube — `role="group"` en HTML (×2)**: los dos `<div role="group">` reemplazados por `<fieldset>` con `<legend class="sr-only">` — la barra de filtro de la biblioteca de proyectos y los filtros de la galería de plantillas.
- **SonarQube — campo de archivo sin label**: añadido `<label for="importProjectsInput" class="sr-only">` al campo oculto de importación de proyectos JSON.
- **SonarQube — promesa sin gestionar**: `autosaveActiveProject(true)` en `saveActiveProjectNow()` marcado explícitamente con `void`.
- **SonarQube — ternario anidado en `renderProjects`**: ternario de tres ramas extraído a un bloque `if/else if/else` explícito que asigna la variable `emptyMessage`.
- **SonarQube — template literal anidado en `renderProjects`**: el template literal condicional dentro de `item.innerHTML` descompuesto en variables previas (`restoreVersionBtn`, `archiveLabel`, `archiveIcon`, `activeLabel`).
- **SonarQube — ternario anidado en `updateBatchFilesStatus`**: ternarios de pluralización extraídos a variables independientes `fileLabel` y `readyLabel`.
- **SonarQube — `await` dentro de bucles (×2)**: los dos `for...of` con `await` (exportación de lote y exportación de pack) refactorizados a `Promise.all` con `.map()`.
- **SonarQube — Complejidad Cognitiva en `exportPackBtn`**: reducida de 17 a ≤ 15 extrayendo la lógica de construcción de cada archivo a la función `generatePackFile(base, pack, definition, index)`.
- **SonarQube — cadena `.then()` / async IIFE en el arranque**: `void hydrateProjectsFromDatabase().then(...)` y la posterior async IIFE reemplazados por la función `async startApp()` nombrada, invocada con `void startApp()`.

### 🗺️ Planeado

- Publicación de la extensión en la Chrome Web Store.
- Publicación de la extensión en el VS Code Marketplace.

---

## [1.2.0] - 2026-10-22

### ✨ Added

- **Dropdown de compartir en redes sociales** (versión web): el botón "🔗 Compartir" ahora abre un dropdown con:
  - **Botón "Compartir imagen"** — usa la Web Share API (`navigator.share({ files: [...] })`) para abrir el selector nativo del sistema en móvil (WhatsApp, Instagram, Telegram, etc.); descarga la imagen como fallback en desktop.
  - **Botón "Copiar enlace"** — copia la URL con el estado serializado al portapapeles (igual que antes).
  - **Botones de redes sociales** con iconos SVG oficiales: **X / Twitter**, **WhatsApp**, **LinkedIn**, **Reddit**, **Facebook** — abren el diálogo de compartir de cada red en una ventana emergente con la URL del estado.
- **Presets de estilo** en la extensión VS Code: el panel lateral ahora incluye una sección "Presets de estilo" idéntica a la versión web — guarda la configuración visual actual (lenguaje, tema, fuente, marco, fondo, etc.) con un nombre personalizado y restáurala con un clic; persistidos en `localStorage`.

### 🔄 Changed

- **Diseño de scrollbars mejorado** (web + VS Code): todos los elementos con scroll usan ahora un scrollbar consistente y elegante — 6 px de ancho con thumb redondeado, efecto flotante (`background-clip: content-box`), color de acento al hover y soporte Firefox (`scrollbar-width: thin`). Aplica a: panel de controles, lista de historial, área de previsualización.
- **Corregido el scrollbar del textarea**: se añadió `overflow: hidden` a `.code-input` y se eliminó `overflow: visible` de la regla compartida `pre, textarea`, eliminando el scrollbar inesperado en el área del editor de código.
- **Versión de la extensión** bumpeada a `1.2.0`.

### 🐛 Fixed

- **SonarQube — selector duplicado**: `scrollbar-width`/`scrollbar-color` (Firefox) fusionados en el bloque principal `.controls-panel` para eliminar la advertencia de selector duplicado en `codeshot-web/style.css` y `codeshot-vscode/media/style.css`.
- **SonarQube — Complejidad Cognitiva**: `applyPresetState` en la extensión VS Code refactorizado de CC 48 a CC ≤ 15 descomponiendo en `applyPresetEditorStateVSC`, `applyPresetFrameStateVSC`, `applyPresetAppearanceVSC` (con sub-funciones `applyPresetPaddingVSC`, `applyPresetRadiusVSC`, `applyPresetShadowVSC`) y `applyPresetBgStateVSC`.
- **SonarQube — Complejidad Cognitiva**: handler del botón "Compartir imagen" refactorizado de CC 18 a CC ≤ 15 extrayendo `handleShareImageBlob(blob, filename)`.
- **SonarQube — optional chaining**: `navigator.canShare && navigator.canShare(...)` reemplazado por `navigator.canShare?.()`.

---

## [1.1.0] - 2026-10-22

### ✨ Added

- **Historial local de capturas generadas** (versión web): las últimas 8 imágenes exportadas se guardan en `localStorage` como miniaturas; cada entrada puede re-descargarse con un clic. El historial se borra con el botón "Borrar historial".
- **Exportación a múltiples resoluciones en un único archivo ZIP** (versión web): el botón "Exportar ZIP" genera un archivo `.zip` con tres PNG a escalas 1×, 2× y 3× simultáneamente, construido con una implementación ZIP en JS puro (sin librerías externas).
- **Botón "Copiar imagen"** en el encabezado: copia la captura directamente al portapapeles usando la API `ClipboardItem`, sin necesidad de descargar el archivo.
- **Selector de familia tipográfica**: Fira Code, JetBrains Mono, Cascadia Code, Source Code Pro, Consolas.
- **Control de ancho del marco** (slider 400–1400 px): permite crear capturas más anchas para código con líneas largas.
- **Número de línea inicial configurable**: útil al capturar fragmentos de un archivo real (ej. líneas 120–145).
- **Texto de marca de agua editable**: ya no está fijo en "Hecho con CodeShot".
- **Marca de agua auto-adaptable**: cambia automáticamente a color oscuro cuando el fondo activo es claro.
- **Contador de líneas y caracteres** en tiempo real (ej. `47 líneas · 1.2 KB`).
- **Plantillas de ejemplo por lenguaje**: 18 snippets representativos — cada lenguaje muestra un ejemplo idiomático propio en lugar del mismo `fibonacci` para todos.
- **Detección automática de lenguaje al pegar**: heurísticas sobre la primera línea del código detectan Python, Rust, PHP, Go, C++, Java, C#, JSX, SQL, YAML, JSON, Bash, HTML y Markdown.
- **Drag & drop de archivos**: arrastra cualquier archivo de código (`.js`, `.py`, `.rs`, etc.) sobre el editor para cargarlo; el lenguaje y el título de la ventana se actualizan automáticamente.
- **Botón "Restaurar valores por defecto"**: limpia todas las preferencias de `localStorage` y recarga la interfaz.
- **Atajos de teclado en la UI**: `Ctrl+Enter` descarga, `Ctrl+Shift+C` copia al portapapeles, `Ctrl+L` limpia el código, `Ctrl+±` controla el zoom.
- **Persistencia completa de preferencias**: lenguaje, tema de código, tamaño y familia de fuente, estilo y ancho de marco, barra de título, números de línea, línea inicial, padding, radio, sombra, watermark y fondo guardados en `localStorage` y restaurados al recargar.
- **Nuevo comando VS Code `codeshot.captureFile`**: captura el archivo completo abierto sin necesidad de seleccionar texto.
- **`activationEvents` explícitos** en `package.json` para los tres comandos y la vista lateral.
- **Keybindings en VS Code**: `Ctrl+Shift+S` → capturar selección; `Ctrl+Shift+Alt+S` → capturar archivo completo.
- **Categorías del Marketplace mejoradas**: añadidas `Snippets` y `Education`.
- **`retainContextWhenHidden: true`** en la vista de la barra de actividades: el estado del webview se preserva al ocultar el panel.
- **Exportación a JPEG** con control deslizante de calidad (50–100 %): nueva sección "Exportación" en el panel; para JPEG el fondo transparente se reemplaza automáticamente por blanco.
- **Escala de exportación configurable** (1×, 2× o 3×): sustituye la escala fija de 2× que había hasta ahora.
- **Presets de estilo con nombre** (versión web): guarda la configuración visual actual (lenguaje, tema, fuente, marco, fondo, etc.) con un nombre personalizado y restáurala con un clic; los presets se persisten en `localStorage`.
- **Compartir por enlace** (versión web): el botón "🔗 Compartir" serializa todo el estado actual (configuración + código) en el hash de la URL usando Base64; al abrir ese enlace la app restaura el estado completo automáticamente.

### 🔄 Changed

- **Bug crítico corregido — redimensionamiento con líneas largas**: el marco de ventana ahora se expande automáticamente con el contenido en lugar de recortarlo. Cambios: `window-frame` usa `min-width` en lugar de `width` fijo, `max-width: 100%` eliminado del `export-stage`, `code-editor-wrapper` cambia a `overflow: visible`, `#highlightPre` usa `width: max-content` y `syncTextareaSize()` sincroniza tanto alto como ancho del textarea.
- **Rendimiento mejorado**: debounce de 80 ms en `highlightCodeNow` (evita rehidratar Prism en cada pulsación), `updateLineNumbers` incremental (solo recalcula si el número de líneas cambió), `syncTextareaSize` usa `requestAnimationFrame` (evita layouts síncronos forzados).
- **`mapVscodeLanguageToPrism` ampliado**: añadidos Kotlin, Swift, Dart, Scala, Lua, PowerShell, R, Groovy, Perl, Dockerfile, TOML, INI, Batch, Objective-C, CoffeeScript, GraphQL, Handlebars, Less, SCSS.
- **Sección "Acciones"** añadida al panel de configuración con el resumen de atajos de teclado disponibles.
- **Versión de la extensión** bumpeada a `1.1.0`.

### 🐛 Fixed

- **`pendingSelection` como variable global**: reemplazado por un `Map<Webview, Selection>` para evitar condiciones de carrera cuando el panel y la barra lateral están abiertos simultáneamente.

---

## [1.0.0] - 2026-10-11

### ✨ Added

- **App web inicial**: editor visual de capturas de código (`index.html`, `style.css`, `script.js`) con:
  - Resaltado de sintaxis en vivo con Prism.js (18+ lenguajes, 9 temas de color).
  - Marcos de ventana: macOS, Windows, Navegador, Ubuntu/Linux y "sin marco".
  - Fondos degradados predefinidos o color personalizado.
  - Controles de apariencia: padding, radio de borde, intensidad de sombra, números de línea, marca de agua.
  - Tema claro/oscuro de la interfaz, persistido en `localStorage`.
  - Exportación a PNG en alta resolución (2x) con `html2canvas`, incluyendo soporte de transparencia real.
  - Accesibilidad: navegación por teclado, roles ARIA, contraste conforme a WCAG 2.2.
- **Extensión de Chrome (Manifest V3)**:
  - `manifest.json`, `background.js` (service worker) para abrir/enfocar la app en una pestaña nueva.
  - Vendorización local de Prism.js y html2canvas (sin CDNs) para cumplir la Content Security Policy de Manifest V3.
  - Iconos de la extensión en 16/32/48/128px con diseño propio (cámara + símbolo `</>`).
- **Extensión de VS Code**:
  - `extension.js` con lógica de `WebviewPanel`, dos comandos (`Abrir editor de capturas`, `Capturar selección actual`) y puente de mensajes (`postMessage`) con el webview para guardar imágenes vía el diálogo nativo "Guardar como".
  - Detección automática de lenguaje y nombre de archivo al capturar una selección del editor activo.
  - `package.json`, `README.md` y `.vscodeignore` propios de la extensión.
- Paquetes de distribución listos para instalar: `extension/codeshot-chrome-extension.zip` y `extension/codeshot-vscode-extension.vsix`.
- `README.md` principal documentando las tres variantes del proyecto (app web, extensión de Chrome, extensión de VS Code), con instrucciones de instalación, estructura del proyecto, stack tecnológico y roadmap.

### 🔄 Changed

- **Rebranding completo** de "CodeSnap Clone" a **CodeShot**: título, marca visual, claves de `localStorage`, nombres de archivo exportados, nombres de comandos de VS Code (`codeshot.*`), `manifest.json` y `package.json`.
- **Favicon e icono de la extensión** rediseñados: cámara con el símbolo de código `</>` en el lente, sobre fondo morado degradado consistente con la paleta de marca.
- **Marco "Windows"** rediseñado: icono de app, controles de minimizar/maximizar/cerrar dibujados completamente con CSS puro (sin glifos Unicode).
- **Marco "Navegador"** mejorado:
  - Favicon de pestaña, flechas de navegación e icono de recarga dibujados con CSS puro.
  - Agregados los controles de ventana (minimizar/maximizar/cerrar) en la esquina superior derecha de la barra, al estilo de un navegador de escritorio real.
  - Icono de candado de seguridad reconstruido como un elemento `.lock-icon` independiente con su propio contexto de posicionamiento, corrigiendo la superposición rota con el emoji 🔒 original.
- **Marco "Ubuntu/Linux"** rediseñado: controles circulares estilo GNOME/Yaru, con glifos sutiles visibles solo en hover y el naranja característico de Ubuntu.

### 🐛 Fixed

- Eliminada la duplicación visual del emoji 🔒 en la barra de URL del marco de navegador (se renderizaba como un cuadrado roto por falta de fuente de emoji en algunos entornos); reemplazado por un icono dibujado íntegramente en CSS.
- Corregido el icono de recarga del marco de navegador, que no era reconocible como tal; rediseñado con la técnica de "círculo con hueco rotado + punta de flecha".
- Corregidos los warnings de SonarQube en la extensión de VS Code: uso de `node:fs`/`node:path` en vez de `fs`/`path`, `String#replaceAll()` en vez de `replace()` con regex global, cuerpo no vacío en `deactivate()`, y verificación del origen (`event.source === window`) en el listener de `postMessage` del webview.

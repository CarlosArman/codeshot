# 📸 CodeShot

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.4.0-blueviolet" alt="Version" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Prism.js-Syntax%20Highlighting-orange" alt="Prism.js" />
  <img src="https://img.shields.io/badge/html2canvas-PNG%20Export-green" alt="html2canvas" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Architecture-Vanilla%20JS-blueviolet" alt="Architecture" />
  <img src="https://img.shields.io/badge/Design-Offline%20First-informational" alt="Design" />
  <img src="https://img.shields.io/badge/Platforms-Web%20%7C%20Chrome%20%7C%20VS%20Code-blue" alt="Platforms" />
  <img src="https://img.shields.io/badge/Accessibility-WCAG%202.2-success" alt="Accessibility" />
  <img src="https://img.shields.io/badge/i18n-ES%20%7C%20EN-brightgreen" alt="i18n" />
  <img src="https://img.shields.io/badge/Status-Portfolio%20Ready-yellow" alt="Status" />
  <img src="https://img.shields.io/github/actions/workflow/status/CarlosArman/codeshot/deploy-pages.yml?label=GitHub%20Pages&logo=githubactions&logoColor=white" alt="GitHub Pages deploy" />
</p>

<p align="center"><b>🌐 Language / Idioma</b></p>

<p align="center">
  <a href="./README.md">GB English</a> &nbsp; | &nbsp; ES Español
</p>

<p align="center">
  Crea capturas de código elegantes, directamente desde tu navegador, VS Code, o como extensión instalable, construido con <b>HTML5</b>, <b>CSS3</b> y <b>JavaScript vanilla</b>, incluyendo una <b>extensión de Chrome</b> y una <b>extensión de VS Code</b> empaquetadas desde la misma base de código.
</p>

---

CodeShot es un editor visual para generar imágenes de fragmentos de código con marcos de ventana realistas (macOS, Windows 11, Navegador, Ubuntu/Linux), fondos degradados, resaltado de sintaxis para 18+ lenguajes y exportación a PNG en alta resolución — todo sin depender de servicios externos ni conexión a internet.

---

## 🎯 Why This Project Matters

Este proyecto demuestra cómo construir una **herramienta de productividad para desarrolladores** usando únicamente HTML, CSS y JavaScript vanilla — sin frameworks, sin build step, y sin backend — y empaquetarla para **tres superficies de distribución distintas** a partir de una sola base de código.

Destaca capacidad práctica en:

- Manipulación avanzada del DOM y generación de imágenes en el navegador (`html2canvas`).
- Integración de librerías de terceros (Prism.js) de forma 100% local/offline, respetando políticas estrictas de seguridad (CSP de Manifest V3).
- Desarrollo de extensiones de navegador (Chrome Manifest V3) y de editor (VS Code Extension API) a partir del mismo núcleo de UI.
- Diseño de interfaces accesibles (ARIA, navegación por teclado, contraste WCAG 2.2), controles de interfaz en CSS y una marca SVG portable compartida por web, Chrome y VS Code.

Esto convierte al repositorio en un ejemplo sólido de **ingeniería de producto frontend multiplataforma**.

---

## 🚀 Project Overview

Este repositorio contiene un editor visual de capturas de código para la **web pública**, empaquetado también como:

- Una **extensión de navegador** (Chrome/Edge/Brave, Manifest V3).
- Una **extensión de VS Code** (WebviewPanel + comandos de editor).

La solución combina:

- Un editor de texto con resaltado de sintaxis en vivo (Prism.js).
- Marcos de ventana realistas (macOS, Windows 11, Navegador, Ubuntu/Linux) dibujados con CSS puro.
- Controles de apariencia: fondo, padding, radio de borde, sombra, números de línea, marca de agua.
- Exportación a PNG en alta resolución (`html2canvas`), con soporte de transparencia real.

🔗 **App web**: [`codeshot-web/index.html`](./codeshot-web/index.html) — 🚀 Demo en vivo: **https://carlosarman.github.io/codeshot/**
🔗 **Extensión de Chrome**: [`codeshot-web/`](./codeshot-web)
🔗 **Extensión de VS Code**: [`codeshot-vscode/`](./codeshot-vscode)

---

## ✨ What This Project Demonstrates

### Functional Value

- ✅ Resaltado de sintaxis en vivo con Prism.js (18+ lenguajes, 9 temas).
- ✅ Cuatro marcos de ventana realistas + opción "sin marco".
- ✅ Control de ancho del marco (400–1400 px) y selector de familia tipográfica.
- ✅ Fondos degradados predefinidos o color personalizado.
- ✅ Exportación a **PNG** (transparencia real) o **JPEG** (calidad ajustable) en 1×/2×/3×.
- ✅ Packs de exportación para LinkedIn, Documentación y Social, con ZIPs de nombres deterministas y fallback de WEBP a PNG.
- ✅ Procesamiento por lote de hasta 12 archivos de código en un ZIP PNG 2× secuencial, conservando la composición visual activa.
- ✅ Copiar imagen al portapapeles con un clic (`ClipboardItem` API).
- ✅ Compartir por enlace y presets de estilo guardados (versión web).
- ✅ Compartir en redes sociales: X/Twitter, WhatsApp, LinkedIn, Reddit, Facebook + Web Share API (selector nativo en móvil).
- ✅ Biblioteca persistente de proyectos: autoguardado, versiones recientes, colecciones, búsqueda, archivar/restaurar, respaldo/importación JSON y miniaturas reales.
- ✅ Almacenamiento local versionado de proyectos con IndexedDB, migrado automáticamente desde y respaldado por una caché resiliente en `localStorage`.
- ✅ Persistencia completa de preferencias en `localStorage`.
- ✅ Detección automática de lenguaje al pegar + drag & drop de archivos.
- ✅ Tema claro/oscuro de la interfaz.
- ✅ **Interfaz bilingüe (ES / EN)** — cambia entre español e inglés instantáneamente con el botón de idioma; preferencia persistida entre sesiones.

### Engineering Value

- ✅ Una sola base de código (`codeshot-web/`) reutilizada en la app web y la extensión de Chrome.
- ✅ Librerías de terceros vendorizadas localmente (sin CDNs), compatibles con Content Security Policy estricta.
- ✅ Controles de interfaz (candados, flechas, controles de ventana) dibujados en CSS; la marca oficial de diamante de CodeShot se entrega en SVG y PNG para un branding consistente entre plataformas.
- ✅ Separación clara entre lógica de UI (`script.js`) y lógica específica de cada plataforma (`background.js` para Chrome, `extension.js` para VS Code).
- ✅ Módulo i18n autocontenido (`i18n.js`) — IIFE sin dependencias externas con traducción del DOM mediante atributos `data-i18n*`, función `window.t(key, vars)` para cadenas dinámicas y persistencia en `localStorage`.

### Portfolio Value

- ✅ Ejemplo práctico de desarrollo de extensiones multiplataforma (navegador + editor).
- ✅ Documentación orientada a instalación real, no solo a desarrollo.
- ✅ Empaquetado reproducible de Chrome (`.zip`) y VS Code (`.vsix`) a partir de los assets actuales.

---

## 🎨 Assets de marca

CodeShot usa un marco de captura redondeado con una **firma de código en forma de diamante** como marca oficial. El directorio `brand/` contiene las variantes SVG principal, transparente, clara, oscura, monocromática, favicon y marketplace.

Después de modificar la marca fuente, regenera todos los PNG de Chrome, VS Code, favicon y escritorio con:

```bash
python brand/generate_assets.py
```

El encabezado web/Chrome carga `codeshot-web/icons/codeshot-brand.svg`; el webview de VS Code carga `codeshot-vscode/media/codeshot-brand.svg`. Ambos provienen del asset oficial transparente.

---

## 🧰 Tech Stack

- **Lenguaje**: HTML5, CSS3, JavaScript (vanilla, sin frameworks)
- **Resaltado de sintaxis**: [Prism.js](https://prismjs.com/)
- **Exportación de imágenes**: [html2canvas](https://html2canvas.hertzen.com/)
- **Almacenamiento de la biblioteca de proyectos**: IndexedDB con fallback/caché en `localStorage`
- **Extensión de navegador**: Chrome Extension API (Manifest V3)
- **Extensión de editor**: VS Code Extension API (WebviewPanel, Commands)
- **Empaquetado**: `Compress-Archive` (Chrome), `@vscode/vsce` (VS Code)
- **CI/CD**: GitHub Actions (`JamesIves/github-pages-deploy-action`) — despliegue automático a GitHub Pages en cada push a `main` que modifique `codeshot-web/`

---

## 📂 Project Structure

```
CodeShot
├── .github/
│   └── workflows/
│       └── deploy-pages.yml       # Despliegue automático codeshot-web/ → gh-pages al hacer push a main
│
├── codeshot-web/                       # App web + extensión de Chrome
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── i18n.js                    # Sistema bilingüe ES/EN (sin dependencias)
│   ├── manifest.json              # Manifest V3 (extensión de Chrome)
│   ├── background.js              # Service worker de la extensión
│   ├── icons/                     # Iconos Chrome + SVG oficial de CodeShot
│   ├── favicon.png
│   └── vendor/                    # Prism.js + html2canvas (local, offline)
│
├── brand/                           # Identidad SVG fuente + exportaciones PNG reproducibles
│   ├── codeshot-icon.svg           # Marca principal de captura con diamante
│   ├── codeshot-marketplace.svg    # Marca optimizada para marketplace
│   └── generate_assets.py          # Regenera los tamaños PNG
│
├── codeshot-vscode/                 # Extensión de VS Code
│   ├── extension.js               # Lógica del WebviewPanel y comandos
│   ├── package.json               # Manifiesto de la extensión
│   ├── media/                     # HTML/CSS/JS del webview (comparte diseño con codeshot-web/)
│   │   ├── i18n.js                # Copia del módulo bilingüe ES/EN compartido
│   │   └── ...
│   └── images/icon.png            # Icono de la extensión
│
└── README.md
```

---

## ⚙️ Quick Start

### 1. Clona el repositorio

```bash
git clone https://github.com/<tu-usuario>/codeshot.git
cd codeshot
```

### 2. Elige cómo quieres usarlo

| Opción | Comando / Acción |
|---|---|
| 🌐 App web | Abre `codeshot-web/index.html` en tu navegador |
| 🧩 Extensión de Chrome | Carga la carpeta `codeshot-web/` sin empaquetar |
| 🧰 Extensión de VS Code | Empaqueta `codeshot-vscode/` con `vsce` e instala el `.vsix` generado |

No se requiere build, servidor, ni conexión a internet en ningún caso.

---

## 🌐 Usar la app web

**Demo en vivo** (sin instalar nada): **https://carlosarman.github.io/codeshot/**

O ejecútala localmente:
1. Abre `codeshot-web/index.html` en tu navegador (doble clic, o `Archivo → Abrir`).
2. Escribe o pega tu código, ajusta el estilo en el panel lateral.
3. Haz clic en **"Descargar PNG"**.

---

## 🧩 Instalar la extensión de Chrome / Edge / Brave

El código fuente de la extensión está en [`codeshot-web/`](./codeshot-web).

1. Abre `chrome://extensions` (o `edge://extensions`, `brave://extensions`).
2. Activa el **"Modo de desarrollador"**.
3. Haz clic en **"Cargar extensión sin empaquetar"**.
4. Selecciona la carpeta [`codeshot-web/`](./codeshot-web).
5. El icono de CodeShot aparecerá en la barra de herramientas.

> La extensión funciona 100% offline: Prism.js y html2canvas están incluidos localmente en `codeshot-web/vendor/`, cumpliendo con la Content Security Policy de Manifest V3.

### Regenerar el `.zip` manualmente

```powershell
cd codeshot-web
Compress-Archive -Path * -DestinationPath ..\extension\codeshot-chrome-extension.zip -Force
```

---

## 🧰 Instalar la extensión de VS Code

### Opción A — Modo desarrollo

```bash
cd codeshot-vscode
code .
```

Presiona **`F5`** para abrir una ventana de **Extension Development Host**.

### Opción B — Empaquetar e instalar el `.vsix`

```bash
npm install -g @vscode/vsce
cd codeshot-vscode
vsce package --no-dependencies --allow-missing-repository
```

Además del panel independiente, CodeShot también agrega su propio icono a la **barra de actividades** de VS Code (barra lateral izquierda), abriendo una vista integrada con el mismo editor.

### Comandos disponibles

| Comando | Atajo | Descripción |
|---|---|---|
| `CodeShot: Abrir editor de capturas` | — | Abre el panel de CodeShot vacío. |
| `CodeShot: Capturar selección actual` | `Ctrl+Shift+S` | Abre el panel con el texto seleccionado; detecta lenguaje y nombre de archivo automáticamente. También disponible en el menú contextual. |
| `CodeShot: Capturar archivo completo` | `Ctrl+Shift+Alt+S` | Carga todo el archivo activo en el panel de CodeShot. |

Al exportar, la extensión usa el diálogo nativo **"Guardar como"** de VS Code, ya que los webviews no tienen acceso directo al sistema de archivos.

Más detalles en el [README de la extensión de VS Code](./codeshot-vscode/README.md).

---

## 🏛️ Architecture Snapshot

CodeShot sigue una arquitectura **vanilla JS por capas**, sin build step:

- `index.html` / `webview.html` — estructura semántica de la interfaz con atributos `data-i18n*` en todos los elementos traducibles.
- `style.css` — estilos de la aplicación y controles de interfaz dibujados con CSS; el icono oficial de marca se carga desde un asset SVG local.
- `script.js` — lógica de UI compartida: resaltado de sintaxis, controles de apariencia, exportación, biblioteca de proyectos, generación de miniaturas y persistencia en IndexedDB.
- `i18n.js` — módulo bilingüe autocontenido (ES/EN): aplica traducciones mediante atributos `data-i18n*` del DOM, expone `window.t(key, vars)` para cadenas dinámicas y persiste la preferencia de idioma en `localStorage`. Compartido entre la app web y la extensión de VS Code.
- `manifest.json` + `background.js` — capa específica de la extensión de Chrome (Manifest V3, service worker).
- `extension.js` — capa específica de la extensión de VS Code (WebviewPanel, comandos, puente de mensajes con el webview).
- `vendor/` — dependencias de terceros (Prism.js, html2canvas) copiadas localmente para funcionar 100% offline y cumplir Content Security Policy.

**Puente de comunicación (VS Code):** el webview no tiene acceso al sistema de archivos ni a la API de VS Code directamente. `extension.js` actúa como intermediario: recibe `postMessage` desde el webview (por ejemplo, `saveImage`) y responde usando las APIs nativas (`showSaveDialog`, `fs.writeFile`).

---

## 🗺️ Roadmap

- [ ] Publicar la extensión en la Chrome Web Store.
- [ ] Publicar la extensión en el VS Code Marketplace.
- [x] Historial local de capturas generadas.
- [x] Exportación a múltiples resoluciones en un único archivo ZIP.
- [x] Biblioteca persistente de proyectos con miniaturas, respaldos y almacenamiento local versionado.
- [x] Interfaz bilingüe (ES / EN) con cambio de idioma instantáneo y preferencia persistente.

---

## 📜 Changelog

El historial detallado de cambios del proyecto está disponible en [`CHANGELOG.es.md`](./CHANGELOG.es.md).

---

## 👤 Author

**Carlos R.**
Frontend / Tooling Engineer
🔗 GitHub: https://github.com/CarlosArman

---

## ⭐ Final Note

Este proyecto está documentado intencionalmente para demostrar no solo **manipulación del DOM y generación de imágenes en el navegador**, sino también **desarrollo de extensiones multiplataforma** (Chrome Manifest V3 y VS Code Extension API) a partir de una única base de código, con empaquetado y distribución reales listos para instalar.

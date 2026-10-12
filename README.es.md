# 📸 CodeShot

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.0.0-blueviolet" alt="Version" />
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
  <img src="https://img.shields.io/badge/Status-Portfolio%20Ready-yellow" alt="Status" />
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
- Diseño de interfaces accesibles (ARIA, navegación por teclado, contraste WCAG 2.2) e iconografía dibujada íntegramente con CSS puro (sin SVG ni emojis, para evitar inconsistencias de renderizado entre sistemas).

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

🔗 **App web**: [`codeshot-web/index.html`](./codeshot-web/index.html)
🔗 **Extensión de Chrome**: [`codeshot-web/`](./codeshot-web) + [`extension/codeshot-chrome-extension.zip`](./extension/codeshot-chrome-extension.zip)
🔗 **Extensión de VS Code**: [`codeshot-vscode/`](./codeshot-vscode) + [`extension/codeshot-vscode-extension.vsix`](./extension/codeshot-vscode-extension.vsix)

---

## ✨ What This Project Demonstrates

### Functional Value

- ✅ Resaltado de sintaxis en vivo con Prism.js (18+ lenguajes, 9 temas).
- ✅ Cuatro marcos de ventana realistas + opción "sin marco".
- ✅ Fondos degradados predefinidos o color personalizado.
- ✅ Exportación a PNG en 2x con transparencia real.
- ✅ Tema claro/oscuro de la interfaz, persistido en `localStorage`.

### Engineering Value

- ✅ Una sola base de código (`codeshot-web/`) reutilizada en la app web y la extensión de Chrome.
- ✅ Librerías de terceros vendorizadas localmente (sin CDNs), compatibles con Content Security Policy estricta.
- ✅ Iconografía de interfaz (candados, flechas, controles de ventana) dibujada 100% en CSS, sin SVG ni emojis — evitando inconsistencias de fuente entre sistemas operativos.
- ✅ Separación clara entre lógica de UI (`script.js`) y lógica específica de cada plataforma (`background.js` para Chrome, `extension.js` para VS Code).

### Portfolio Value

- ✅ Ejemplo práctico de desarrollo de extensiones multiplataforma (navegador + editor).
- ✅ Documentación orientada a instalación real, no solo a desarrollo.
- ✅ Paquetes de distribución (`.zip`, `.vsix`) ya generados y listos para instalar.

---

## 🧰 Tech Stack

- **Lenguaje**: HTML5, CSS3, JavaScript (vanilla, sin frameworks)
- **Resaltado de sintaxis**: [Prism.js](https://prismjs.com/)
- **Exportación de imágenes**: [html2canvas](https://html2canvas.hertzen.com/)
- **Extensión de navegador**: Chrome Extension API (Manifest V3)
- **Extensión de editor**: VS Code Extension API (WebviewPanel, Commands)
- **Empaquetado**: `Compress-Archive` (Chrome), `@vscode/vsce` (VS Code)

---

## 📂 Project Structure

```
CodeShot
├── codeshot-web/                       # App web + extensión de Chrome
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── manifest.json              # Manifest V3 (extensión de Chrome)
│   ├── background.js              # Service worker de la extensión
│   ├── icons/                     # Iconos de la extensión (16/32/48/128px)
│   ├── favicon.png
│   └── vendor/                    # Prism.js + html2canvas (local, offline)
│
├── codeshot-vscode/                 # Extensión de VS Code
│   ├── extension.js               # Lógica del WebviewPanel y comandos
│   ├── package.json               # Manifiesto de la extensión
│   ├── media/                     # HTML/CSS/JS del webview (comparte diseño con codeshot-web/)
│   └── images/icon.png            # Icono de la extensión
│
├── extension/                       # Paquetes listos para instalar
│   ├── codeshot-chrome-extension.zip
│   └── codeshot-vscode-extension.vsix
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
| 🧩 Extensión de Chrome | Carga la carpeta `codeshot-web/` sin empaquetar, o instala `extension/codeshot-chrome-extension.zip` descomprimido |
| 🧰 Extensión de VS Code | `code --install-extension extension/codeshot-vscode-extension.vsix` |

No se requiere build, servidor, ni conexión a internet en ningún caso.

---

## 🌐 Instalar la app web

1. Abre `codeshot-web/index.html` en tu navegador (doble clic, o `Archivo → Abrir`).
2. Escribe o pega tu código, ajusta el estilo en el panel lateral.
3. Haz clic en **"Descargar PNG"**.

---

## 🧩 Instalar la extensión de Chrome / Edge / Brave

Paquete listo: **[`extension/codeshot-chrome-extension.zip`](./extension/codeshot-chrome-extension.zip)**.

1. Abre `chrome://extensions` (o `edge://extensions`, `brave://extensions`).
2. Activa el **"Modo de desarrollador"**.
3. Haz clic en **"Cargar extensión sin empaquetar"**.
4. Selecciona la carpeta [`codeshot-web/`](./codeshot-web), o la carpeta resultante de descomprimir el `.zip`.
5. El icono de CodeShot aparecerá en la barra de herramientas.

> La extensión funciona 100% offline: Prism.js y html2canvas están incluidos localmente en `codeshot-web/vendor/`, cumpliendo con la Content Security Policy de Manifest V3.

### Regenerar el `.zip` manualmente

```powershell
cd codeshot-web
Compress-Archive -Path * -DestinationPath ..\extension\codeshot-chrome-extension.zip -Force
```

---

## 🧰 Instalar la extensión de VS Code

Paquete listo: **[`extension/codeshot-vscode-extension.vsix`](./extension/codeshot-vscode-extension.vsix)**.

### Opción A — Instalar el `.vsix` ya generado

```bash
code --install-extension extension/codeshot-vscode-extension.vsix
```

O desde la interfaz: paleta de comandos (`Ctrl+Shift+P`) → **"Extensiones: Instalar desde VSIX..."**.

### Opción B — Modo desarrollo

```bash
cd codeshot-vscode
code .
```

Presiona **`F5`** para abrir una ventana de **Extension Development Host**.

### Opción C — Regenerar el `.vsix` manualmente

```bash
npm install -g @vscode/vsce
cd codeshot-vscode
vsce package --no-dependencies --allow-missing-repository
```

Además del panel independiente, CodeShot también agrega su propio icono a la **barra de actividades** de VS Code (barra lateral izquierda), abriendo una vista integrada con el mismo editor.

### Comandos disponibles

| Comando | Descripción |
|---|---|
| `CodeShot: Abrir editor de capturas` | Abre el panel de CodeShot vacío. |
| `CodeShot: Capturar selección actual` | Abre el panel con el texto seleccionado en el editor activo, detectando automáticamente el lenguaje y el nombre de archivo. También disponible en el menú contextual al hacer clic derecho sobre una selección. |

Al exportar, la extensión usa el diálogo nativo **"Guardar como"** de VS Code, ya que los webviews no tienen acceso directo al sistema de archivos.

Más detalles en el [README de la extensión de VS Code](./codeshot-vscode/README.md).

---

## 🏛️ Architecture Snapshot

CodeShot sigue una arquitectura **vanilla JS por capas**, sin build step:

- `index.html` / `webview.html` — estructura semántica de la interfaz.
- `style.css` — todos los estilos, incluyendo iconografía dibujada con pseudo-elementos CSS (sin SVG ni emojis).
- `script.js` — lógica de UI compartida: resaltado de sintaxis, controles de apariencia, exportación a PNG.
- `manifest.json` + `background.js` — capa específica de la extensión de Chrome (Manifest V3, service worker).
- `extension.js` — capa específica de la extensión de VS Code (WebviewPanel, comandos, puente de mensajes con el webview).
- `vendor/` — dependencias de terceros (Prism.js, html2canvas) copiadas localmente para funcionar 100% offline y cumplir Content Security Policy.

**Puente de comunicación (VS Code):** el webview no tiene acceso al sistema de archivos ni a la API de VS Code directamente. `extension.js` actúa como intermediario: recibe `postMessage` desde el webview (por ejemplo, `saveImage`) y responde usando las APIs nativas (`showSaveDialog`, `fs.writeFile`).

---

## 🗺️ Roadmap

- [ ] Publicar la extensión en la Chrome Web Store.
- [ ] Publicar la extensión en el VS Code Marketplace.
- [ ] Agregar más temas de fondo y marcos de ventana (p. ej. macOS Big Sur, GNOME moderno).
- [ ] Soporte de arrastrar y soltar archivos de código directamente al editor.
- [ ] Historial local de capturas generadas.

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

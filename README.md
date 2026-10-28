# 📸 CodeShot

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.3.0-blueviolet" alt="Version" />
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
  <img src="https://img.shields.io/github/actions/workflow/status/CarlosArman/codeshot/deploy-pages.yml?label=GitHub%20Pages&logo=githubactions&logoColor=white" alt="GitHub Pages deploy" />
</p>

<p align="center"><b>🌐 Language / Idioma</b></p>

<p align="center">
  GB English &nbsp; | &nbsp; <a href="./README.es.md">ES Español</a>
</p>

<p align="center">
  Create elegant code screenshots, directly from your browser, VS Code, or as an installable extension, built with <b>HTML5</b>, <b>CSS3</b>, and <b>Vanilla JavaScript</b>, including a <b>Chrome extension</b> and a <b>VS Code extension</b> packaged from the same codebase.
</p>

---

CodeShot is a visual editor for generating code snippet images with realistic window frames (macOS, Windows 11, Browser, Ubuntu/Linux), gradient backgrounds, syntax highlighting for 18+ languages, and high-resolution PNG export — all without depending on external services or an internet connection.

---

## 🎯 Why This Project Matters

This project demonstrates how to build a **developer productivity tool** using only vanilla HTML, CSS, and JavaScript — no frameworks, no build step, no backend — and package it for **three distinct distribution surfaces** from a single codebase.

It highlights practical capability in:

- Advanced DOM manipulation and in-browser image generation (`html2canvas`).
- Integrating third-party libraries (Prism.js) 100% locally/offline, respecting strict security policies (Manifest V3 CSP).
- Building both browser extensions (Chrome Manifest V3) and editor extensions (VS Code Extension API) from the same UI core.
- Designing accessible interfaces (ARIA, keyboard navigation, WCAG 2.2 contrast) with iconography drawn entirely in pure CSS (no SVG or emoji, to avoid rendering inconsistencies across systems).

This makes the repository a solid example of **multi-platform frontend product engineering**.

---

## 🚀 Project Overview

This repository contains a visual code-screenshot editor for the **public web**, also packaged as:

- A **browser extension** (Chrome/Edge/Brave, Manifest V3).
- A **VS Code extension** (WebviewPanel + editor commands).

The solution combines:

- A text editor with live syntax highlighting (Prism.js).
- Realistic window frames (macOS, Windows 11, Browser, Ubuntu/Linux) drawn in pure CSS.
- Appearance controls: background, padding, border radius, shadow, line numbers, watermark.
- High-resolution PNG export (`html2canvas`), with real transparency support.

🔗 **Web app**: [`codeshot-web/index.html`](./codeshot-web/index.html) — 🚀 Live demo: **https://carlosarman.github.io/codeshot/**
🔗 **Chrome extension**: [`codeshot-web/`](./codeshot-web) + [`extension/codeshot-chrome-extension.zip`](./extension/codeshot-chrome-extension.zip)
🔗 **VS Code extension**: [`codeshot-vscode/`](./codeshot-vscode) + [`extension/codeshot-vscode-extension.vsix`](./extension/codeshot-vscode-extension.vsix)

---

## ✨ What This Project Demonstrates

### Functional Value

- ✅ Live syntax highlighting with Prism.js (18+ languages, 9 color themes).
- ✅ Four realistic window frames + a "no frame" option.
- ✅ Frame width control (400–1400 px) and monospace font family selector.
- ✅ Predefined gradient backgrounds or custom color.
- ✅ Export as **PNG** (real transparency) or **JPEG** (adjustable quality) at 1×/2×/3×.
- ✅ Export packs for LinkedIn, Documentation, and Social, with deterministic ZIP names and WEBP-to-PNG fallback.
- ✅ Batch-process up to 12 code files into a sequential PNG 2× ZIP, preserving the active visual composition.
- ✅ Copy image to clipboard with one click (`ClipboardItem` API).
- ✅ Share by link and named style presets (web version).
- ✅ Social media sharing: X/Twitter, WhatsApp, LinkedIn, Reddit, Facebook + Web Share API (mobile native share sheet).
- ✅ Persistent project library: autosave, recent versions, collections, search, archive/restore, JSON backup/import, and real project thumbnails.
- ✅ Versioned local project storage with IndexedDB, automatically migrated from and backed by a resilient `localStorage` cache.
- ✅ Full preference persistence in `localStorage`.
- ✅ Automatic language detection on paste + file drag & drop.
- ✅ Light/dark UI theme.

### Engineering Value

- ✅ A single codebase (`codeshot-web/`) reused across the web app and the Chrome extension.
- ✅ Third-party libraries vendored locally (no CDNs), compatible with strict Content Security Policy.
- ✅ UI iconography (locks, arrows, window controls) drawn 100% in CSS, no SVG or emoji — avoiding font inconsistencies across operating systems.
- ✅ Clear separation between shared UI logic (`script.js`) and platform-specific logic (`background.js` for Chrome, `extension.js` for VS Code).

### Portfolio Value

- ✅ Practical example of multi-platform extension development (browser + editor).
- ✅ Documentation oriented toward real installation, not just development.
- ✅ Distribution packages (`.zip`, `.vsix`) already generated and ready to install.

---

## 🧰 Tech Stack

- **Language**: HTML5, CSS3, JavaScript (vanilla, no frameworks)
- **Syntax highlighting**: [Prism.js](https://prismjs.com/)
- **Image export**: [html2canvas](https://html2canvas.hertzen.com/)
- **Project library storage**: IndexedDB with `localStorage` fallback/cache
- **Browser extension**: Chrome Extension API (Manifest V3)
- **Editor extension**: VS Code Extension API (WebviewPanel, Commands)
- **Packaging**: `Compress-Archive` (Chrome), `@vscode/vsce` (VS Code)
- **CI/CD**: GitHub Actions (`JamesIves/github-pages-deploy-action`) — automatic deployment to GitHub Pages on every push to `main` that modifies `codeshot-web/`

---

## 📂 Project Structure

```
CodeShot
├── .github/
│   └── workflows/
│       └── deploy-pages.yml       # Auto-deploy codeshot-web/ → gh-pages on push to main
│
├── codeshot-web/                       # Web app + Chrome extension
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── manifest.json              # Manifest V3 (Chrome extension)
│   ├── background.js              # Extension service worker
│   ├── icons/                     # Extension icons (16/32/48/128px)
│   ├── favicon.png
│   └── vendor/                    # Prism.js + html2canvas (local, offline)
│
├── codeshot-vscode/                 # VS Code extension
│   ├── extension.js               # WebviewPanel logic and commands
│   ├── package.json               # Extension manifest
│   ├── media/                     # Webview HTML/CSS/JS (shares design with codeshot-web/)
│   └── images/icon.png            # Extension icon
│
├── extension/                       # Ready-to-install packages
│   ├── codeshot-chrome-extension.zip
│   └── codeshot-vscode-extension.vsix
│
└── README.md
```

---

## ⚙️ Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/codeshot.git
cd codeshot
```

### 2. Choose how you want to use it

| Option | Command / Action |
|---|---|
| 🌐 Web app | Open `codeshot-web/index.html` in your browser |
| 🧩 Chrome extension | Load the `codeshot-web/` folder unpacked, or install the unzipped `extension/codeshot-chrome-extension.zip` |
| 🧰 VS Code extension | `code --install-extension extension/codeshot-vscode-extension.vsix` |

No build, server, or internet connection is required in any case.

---

## 🌐 Use the web app

**Live demo** (no installation needed): **https://carlosarman.github.io/codeshot/**

Or run it locally:
1. Open `codeshot-web/index.html` in your browser (double-click, or `File → Open`).
2. Write or paste your code, adjust the style in the side panel.
3. Click **"Download PNG"**.

---

## 🧩 Install the Chrome / Edge / Brave extension

Ready-made package: **[`extension/codeshot-chrome-extension.zip`](./extension/codeshot-chrome-extension.zip)**.

1. Open `chrome://extensions` (or `edge://extensions`, `brave://extensions`).
2. Enable **"Developer mode"**.
3. Click **"Load unpacked"**.
4. Select the [`codeshot-web/`](./codeshot-web) folder, or the folder resulting from unzipping the `.zip`.
5. The CodeShot icon will appear in the toolbar.

> The extension works 100% offline: Prism.js and html2canvas are included locally in `codeshot-web/vendor/`, complying with Manifest V3's Content Security Policy.

### Regenerate the `.zip` manually

```powershell
cd codeshot-web
Compress-Archive -Path * -DestinationPath ..\extension\codeshot-chrome-extension.zip -Force
```

---

## 🧰 Install the VS Code extension

Ready-made package: **[`extension/codeshot-vscode-extension.vsix`](./extension/codeshot-vscode-extension.vsix)**.

### Option A — Install the already generated `.vsix`

```bash
code --install-extension extension/codeshot-vscode-extension.vsix
```

Or from the UI: command palette (`Ctrl+Shift+P`) → **"Extensions: Install from VSIX..."**.

### Option B — Development mode

```bash
cd codeshot-vscode
code .
```

Press **`F5`** to open an **Extension Development Host** window.

### Option C — Regenerate the `.vsix` manually

```bash
npm install -g @vscode/vsce
cd codeshot-vscode
vsce package --no-dependencies --allow-missing-repository
```

Besides the standalone panel, CodeShot also adds its own icon to VS Code's **Activity Bar** (left sidebar), opening an integrated view with the same editor.

### Available commands

| Command | Shortcut | Description |
|---|---|---|
| `CodeShot: Open screenshot editor` | — | Opens an empty CodeShot panel. |
| `CodeShot: Capture current selection` | `Ctrl+Shift+S` | Opens the panel with the selected text; detects language and file name automatically. Also available in the context menu. |
| `CodeShot: Capture full file` | `Ctrl+Shift+Alt+S` | Loads the entire active file into the CodeShot panel. |

When exporting, the extension uses VS Code's native **"Save As"** dialog, since webviews don't have direct access to the file system.

More details in the [VS Code extension README](./codeshot-vscode/README.md).

---

## 🏛️ Architecture Snapshot

CodeShot follows a **layered vanilla JS architecture**, with no build step:

- `index.html` / `webview.html` — semantic UI structure.
- `style.css` — all styles, including iconography drawn with CSS pseudo-elements (no SVG or emoji).
- `script.js` — shared UI logic: syntax highlighting, appearance controls, export, project library, thumbnail generation, and IndexedDB persistence.
- `manifest.json` + `background.js` — Chrome-specific layer (Manifest V3, service worker).
- `extension.js` — VS Code-specific layer (WebviewPanel, commands, message bridge with the webview).
- `vendor/` — third-party dependencies (Prism.js, html2canvas) copied locally to work 100% offline and comply with Content Security Policy.

**Communication bridge (VS Code):** the webview has no direct access to the file system or the VS Code API. `extension.js` acts as an intermediary: it receives `postMessage` from the webview (e.g. `saveImage`) and responds using native APIs (`showSaveDialog`, `fs.writeFile`).

---

## 🗺️ Roadmap

- [ ] Publish the extension on the Chrome Web Store.
- [ ] Publish the extension on the VS Code Marketplace.
- [x] Local history of generated screenshots.
- [x] Multi-resolution ZIP export.
- [x] Persistent project library with thumbnails, backups, and versioned local storage.

---

## 📜 Changelog

The detailed change history of the project is available in [`CHANGELOG.md`](./CHANGELOG.md).

---

## 👤 Author

**Carlos R.**
Frontend / Tooling Engineer
🔗 GitHub: https://github.com/CarlosArman

---

## ⭐ Final Note

This project is intentionally documented to demonstrate not only **DOM manipulation and in-browser image generation**, but also **multi-platform extension development** (Chrome Manifest V3 and VS Code Extension API) from a single codebase, with real packaging and distribution ready to install.

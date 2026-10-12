# 📝 Changelog

> 🌐 [Leer en Español](./CHANGELOG.es.md)

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### ✨ Added

- **VS Code Activity Bar view**: CodeShot now also appears as its own icon in VS Code's Activity Bar (left sidebar), opening an integrated webview with the same editor as the standalone panel. Both surfaces share the same HTML-building and message-handling logic (`ready`, `loadSelection`, `saveImage`).

### 🗺️ Planned

- Publish the extension on the Chrome Web Store.
- Publish the extension on the VS Code Marketplace.
- Additional background themes and window frames.
- Support for dragging and dropping code files directly into the editor.
- Local history of generated screenshots.

---

## [1.0.0] - 2026-10-11

### ✨ Added

- **Initial web app**: visual code-screenshot editor (`index.html`, `style.css`, `script.js`) with:
  - Live syntax highlighting with Prism.js (18+ languages, 9 color themes).
  - Window frames: macOS, Windows, Browser, Ubuntu/Linux, and "no frame".
  - Predefined gradient backgrounds or custom color.
  - Appearance controls: padding, border radius, shadow intensity, line numbers, watermark.
  - Light/dark UI theme, persisted in `localStorage`.
  - High-resolution PNG export (2x) with `html2canvas`, including real transparency support.
  - Accessibility: keyboard navigation, ARIA roles, WCAG 2.2-compliant contrast.
- **Chrome extension (Manifest V3)**:
  - `manifest.json`, `background.js` (service worker) to open/focus the app in a new tab.
  - Local vendoring of Prism.js and html2canvas (no CDNs) to comply with Manifest V3's Content Security Policy.
  - Extension icons at 16/32/48/128px with a custom design (camera + `</>` symbol).
- **VS Code extension**:
  - `extension.js` with `WebviewPanel` logic, two commands (`Open screenshot editor`, `Capture current selection`), and a message bridge (`postMessage`) with the webview to save images via the native "Save As" dialog.
  - Automatic language and file name detection when capturing a selection from the active editor.
  - Its own `package.json`, `README.md`, and `.vscodeignore`.
- Ready-to-install distribution packages: `extension/codeshot-chrome-extension.zip` and `extension/codeshot-vscode-extension.vsix`.
- Main `README.md` documenting the three variants of the project (web app, Chrome extension, VS Code extension), with installation instructions, project structure, tech stack, and roadmap.

### 🔄 Changed

- **Full rebranding** from "CodeSnap Clone" to **CodeShot**: title, visual identity, `localStorage` keys, exported file names, VS Code command names (`codeshot.*`), `manifest.json`, and `package.json`.
- **Favicon and extension icon** redesigned: a camera with the `</>` code symbol in the lens, over a purple gradient background consistent with the brand palette.
- **"Windows" frame** redesigned: app icon, minimize/maximize/close controls drawn entirely in pure CSS (no Unicode glyphs).
- **"Browser" frame** improved:
  - Tab favicon, navigation arrows, and refresh icon drawn in pure CSS.
  - Added window controls (minimize/maximize/close) in the top-right corner of the bar, matching the look of a real desktop browser.
  - Security lock icon rebuilt as an independent `.lock-icon` element with its own positioning context, fixing the broken overlap with the original 🔒 emoji.
- **"Ubuntu/Linux" frame** redesigned: GNOME/Yaru-style circular controls, with subtle glyphs visible only on hover and the characteristic Ubuntu orange.

### 🐛 Fixed

- Removed the duplicated 🔒 emoji in the browser frame's URL bar (it rendered as a broken square due to missing emoji fonts in some environments); replaced with an icon drawn entirely in CSS.
- Fixed the browser frame's refresh icon, which wasn't recognizable as such; redesigned using the "rotated circle with a gap + arrow tip" technique.
- Fixed SonarQube warnings in the VS Code extension: using `node:fs`/`node:path` instead of `fs`/`path`, `String#replaceAll()` instead of global-regex `replace()`, a non-empty `deactivate()` body, and origin verification (`event.source === window`) in the webview's `postMessage` listener.

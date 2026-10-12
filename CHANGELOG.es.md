# 📝 Changelog

> 🌐 [Read in English](./CHANGELOG.md)

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/),
y este proyecto sigue versionado semántico ([SemVer](https://semver.org/lang/es/)).

---

## [Unreleased]

### ✨ Added

- **Vista en la barra de actividades de VS Code**: CodeShot ahora también aparece como su propio icono en la barra de actividades de VS Code (barra lateral izquierda), abriendo una vista integrada con el mismo editor que el panel independiente. Ambas superficies comparten la misma lógica de construcción de HTML y manejo de mensajes (`ready`, `loadSelection`, `saveImage`).

### 🗺️ Planeado

- Publicación de la extensión en la Chrome Web Store.
- Publicación de la extensión en el VS Code Marketplace.
- Nuevos temas de fondo y marcos de ventana adicionales.
- Soporte de arrastrar y soltar archivos de código directamente al editor.
- Historial local de capturas generadas.

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

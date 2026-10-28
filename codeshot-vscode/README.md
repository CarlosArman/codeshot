# CodeShot — Capturas de código elegantes (VS Code)

Extensión de VS Code que abre un editor visual para crear capturas de código elegantes: marcos de ventana (macOS, Windows 11, navegador, Ubuntu), fondos degradados, resaltado de sintaxis con temas de Prism.js y exportación a PNG o JPEG — todo sin salir del editor.

> **Versión actual: 1.3.1**

## Características

- Vista integrada en la **barra de actividades** (barra lateral izquierda) de VS Code, además del panel independiente. El estado del webview se preserva al ocultar el panel (`retainContextWhenHidden`).
- Identidad visual oficial con marco de captura redondeado y firma de código en diamante: icono de Marketplace, Activity Bar, favicon y encabezado del webview alineados.
- Editor de código con resaltado de sintaxis en vivo (18+ lenguajes, 9 temas de color).
- Marcos de ventana: macOS, Windows 11, navegador, Ubuntu/Linux o sin marco.
- **Control de ancho del marco** (slider 400–1400 px) para capturas de líneas largas.
- Fondos degradados predefinidos o color personalizado.
- Control de padding, radio de borde, intensidad de sombra, números de línea y marca de agua.
- **Número de línea inicial configurable**: útil al capturar fragmentos de un archivo real (ej. líneas 120–145).
- **Selector de familia tipográfica**: Fira Code, JetBrains Mono, Cascadia Code, Source Code Pro, Consolas.
- **Texto de marca de agua editable** con color auto-adaptable según el fondo activo.
- **Contador de líneas y caracteres** en tiempo real.
- **Detección automática de lenguaje** al capturar desde el editor activo.
- **Exportación a PNG** (transparencia real) o **JPEG** (calidad ajustable 50–100 %) en escala 1×/2×/3×.
- **Botón "Copiar imagen"**: copia la captura directamente al portapapeles.
- Tema claro/oscuro de la interfaz.
- **Presets de estilo**: guarda configuraciones visuales con nombre personalizado y restáuralas con un clic.
- Persistencia completa de preferencias en `localStorage`.

## Comandos

| Comando | Atajo | Descripción |
|---|---|---|
| `CodeShot: Abrir editor de capturas` | — | Abre el panel de CodeShot vacío. |
| `CodeShot: Capturar selección actual` | `Ctrl+Shift+S` / `Cmd+Shift+S` | Abre el panel con el texto seleccionado en el editor activo, detectando automáticamente el lenguaje y el nombre de archivo. |
| `CodeShot: Capturar archivo completo` | `Ctrl+Shift+Alt+S` / `Cmd+Shift+Alt+S` | Carga el archivo activo completo en el panel de CodeShot. |

Los comandos `Capturar selección actual` y `Capturar archivo completo` también están disponibles en el **menú contextual** del editor.

## Uso

**Opción 1 — Barra de actividades:** haz clic en el icono de CodeShot en la barra de actividades (lateral izquierda de VS Code) para abrir la vista integrada.

**Opción 2 — Paleta de comandos:**
1. Abre la paleta de comandos (`Ctrl+Shift+P` / `Cmd+Shift+P`).
2. Ejecuta `CodeShot: Abrir editor de capturas`, `Capturar selección actual` o `Capturar archivo completo`.

**Opción 3 — Atajos de teclado:**
- Selecciona código y pulsa `Ctrl+Shift+S` para capturar la selección.
- Pulsa `Ctrl+Shift+Alt+S` para capturar el archivo completo.

En todos los casos:
3. Ajusta el estilo en el panel lateral.
4. Haz clic en **"Descargar PNG"** (o **"Descargar JPEG"**) y elige dónde guardar la imagen.
   - La extensión usa el diálogo nativo **"Guardar como"** de VS Code, ya que los webviews no tienen acceso directo al sistema de archivos.

## Desarrollo

```bash
cd codeshot-vscode
code .
```

Presiona `F5` para abrir una ventana de **Extension Development Host** con la extensión cargada.

## Empaquetado

```bash
npm install -g @vscode/vsce
cd codeshot-vscode
vsce package --no-dependencies --allow-missing-repository
```

Esto genera un archivo `.vsix` con los assets de marca actuales. Instálalo manualmente con:

```bash
code --install-extension codeshot-<version>.vsix
```

O desde la interfaz: paleta de comandos (`Ctrl+Shift+P`) → **"Extensiones: Instalar desde VSIX..."**.

## Assets de marca

- `images/icon.png`: icono optimizado para VS Code Marketplace.
- `images/activitybar-icon.svg`: versión monocromática para la barra de actividades.
- `media/codeshot-brand.svg`: marca oficial mostrada en el encabezado del webview.
- `media/favicon.png`: favicon del webview.

Los PNG de Marketplace y escritorio se regeneran desde la raíz del repositorio con `python brand/generate_assets.py`.

# CodeShot — Capturas de código elegantes (VS Code)

Extensión de VS Code que abre un editor visual para crear capturas de código elegantes: marcos de ventana (macOS, Windows, navegador, Ubuntu), fondos degradados, resaltado de sintaxis con temas de Prism.js y exportación a PNG — todo sin salir del editor.

## Características

- Vista integrada en la **barra de actividades** (barra lateral izquierda) de VS Code, además del panel independiente.
- Editor de código con resaltado de sintaxis en vivo (18+ lenguajes).
- Marcos de ventana: macOS, Windows 11, navegador, Ubuntu/Linux o sin marco.
- Fondos degradados predefinidos o color personalizado.
- Control de padding, radio de borde, intensidad de sombra, números de línea y marca de agua.
- Tema claro/oscuro de la interfaz.
- Exportación a PNG mediante el diálogo nativo "Guardar como" de VS Code.
- Comando para capturar directamente la selección activa del editor.

## Comandos

| Comando | Descripción |
|---|---|
| `CodeShot: Abrir editor de capturas` | Abre el panel de CodeShot vacío. |
| `CodeShot: Capturar selección actual` | Abre el panel con el texto seleccionado en el editor activo, detectando automáticamente el lenguaje y el nombre de archivo. |

También puedes acceder a "Capturar selección actual" desde el menú contextual del editor cuando hay texto seleccionado.

## Uso

**Opción 1 — Barra de actividades:** haz clic en el icono de CodeShot en la barra de actividades (lateral izquierda de VS Code) para abrir la vista integrada.

**Opción 2 — Paleta de comandos:**
1. Abre la paleta de comandos (`Ctrl+Shift+P` / `Cmd+Shift+P`).
2. Ejecuta `CodeShot: Abrir editor de capturas` (o selecciona código y usa `Capturar selección actual`).

En ambos casos:
3. Ajusta el estilo en el panel lateral.
4. Haz clic en "Descargar PNG" y elige dónde guardar la imagen.

## Desarrollo

```
cd codeshot-vscode
code .
```

Presiona `F5` para abrir una ventana de **Extension Development Host** con la extensión cargada.

## Empaquetado

```
npm install -g @vscode/vsce
vsce package
```

Esto genera un archivo `.vsix` que puede instalarse manualmente con:

```
code --install-extension codeshot-1.0.0.vsix
```

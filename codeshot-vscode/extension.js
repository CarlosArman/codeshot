const vscode = require('vscode');
const fs = require('node:fs');
const path = require('node:path');

/** @type {vscode.WebviewPanel | undefined} */
let currentPanel;

/** @type {vscode.WebviewView | undefined} */
let currentSidebarView;

let pendingSelection = null;

function activate(context) {
  const sidebarProvider = new CodeShotViewProvider(context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('codeshotSidebar', sidebarProvider)
  );

  const openCommand = vscode.commands.registerCommand('codeshot.open', () => {
    createOrShowPanel(context);
  });

  const openWithSelectionCommand = vscode.commands.registerCommand(
    'codeshot.openWithSelection',
    () => {
      const editor = vscode.window.activeTextEditor;
      const panel = createOrShowPanel(context);

      if (editor && !editor.selection.isEmpty) {
        const code = editor.document.getText(editor.selection);
        const language = mapVscodeLanguageToPrism(editor.document.languageId);
        const fileName = path.basename(editor.document.fileName);

        // El webview puede no estar listo de inmediato; se envía el
        // mensaje tras un breve retraso y también se reenvía cuando el
        // webview confirme que ya cargó (ver manejador de mensajes).
        panel.webview.postMessage({ type: 'loadSelection', code, language, fileName });
        pendingSelection = { code, language, fileName };
      }
    }
  );

  context.subscriptions.push(openCommand, openWithSelectionCommand);
}

function createOrShowPanel(context) {
  const column = vscode.window.activeTextEditor
    ? vscode.ViewColumn.Beside
    : vscode.ViewColumn.One;

  if (currentPanel) {
    currentPanel.reveal(column);
    return currentPanel;
  }

  const panel = vscode.window.createWebviewPanel(
    'codeshot',
    'CodeShot',
    column,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')]
    }
  );

  panel.iconPath = vscode.Uri.joinPath(context.extensionUri, 'images', 'icon.png');
  panel.webview.html = buildHtml(context, panel.webview);
  attachMessageHandler(panel.webview);

  panel.onDidDispose(() => {
    currentPanel = undefined;
  });

  currentPanel = panel;
  return panel;
}

// Proveedor de la vista integrada en la barra de actividades (lateral
// izquierda de VS Code). Muestra la misma interfaz de CodeShot que el
// panel independiente, pero anclada como una vista más del editor.
class CodeShotViewProvider {
  constructor(context) {
    this.context = context;
  }

  resolveWebviewView(webviewView) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this.context.extensionUri, 'media')]
    };

    webviewView.webview.html = buildHtml(this.context, webviewView.webview);
    attachMessageHandler(webviewView.webview);

    currentSidebarView = webviewView;
    webviewView.onDidDispose(() => {
      if (currentSidebarView === webviewView) {
        currentSidebarView = undefined;
      }
    });
  }
}

// Manejador de mensajes compartido entre el panel independiente y la
// vista de la barra lateral: ambos usan el mismo protocolo de
// postMessage (`ready`, `loadSelection`, `saveImage`).
function attachMessageHandler(webview) {
  webview.onDidReceiveMessage(async (message) => {
    if (message?.type === 'ready' && pendingSelection) {
      webview.postMessage({ type: 'loadSelection', ...pendingSelection });
      pendingSelection = null;
      return;
    }

    if (message?.type === 'saveImage') {
      await handleSaveImage(message.dataUrl, message.filename);
    }
  });
}

async function handleSaveImage(dataUrl, filename) {
  try {
    const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');

    const uri = await vscode.window.showSaveDialog({
      defaultUri: vscode.Uri.file(filename || 'codeshot.png'),
      filters: { 'Imagen PNG': ['png'] }
    });

    if (!uri) return; // El usuario canceló el diálogo.

    await fs.promises.writeFile(uri.fsPath, buffer);
    vscode.window.showInformationMessage(`Imagen guardada: ${path.basename(uri.fsPath)}`);
  } catch (err) {
    vscode.window.showErrorMessage('No se pudo guardar la imagen: ' + err.message);
  }
}

function buildHtml(context, webview) {
  const mediaUri = vscode.Uri.joinPath(context.extensionUri, 'media');
  const htmlPath = vscode.Uri.joinPath(mediaUri, 'webview.html');
  let html = fs.readFileSync(htmlPath.fsPath, 'utf8');

  const baseUri = webview.asWebviewUri(mediaUri).toString();
  html = html.replaceAll('{{cspSource}}', webview.cspSource);
  html = html.replaceAll('{{baseUri}}', baseUri);

  return html;
}

// Mapea el languageId de VS Code al identificador de lenguaje de Prism.js
// usado por el selector de la app (ambos difieren en varios casos).
function mapVscodeLanguageToPrism(languageId) {
  const map = {
    javascript: 'javascript',
    javascriptreact: 'jsx',
    typescript: 'typescript',
    typescriptreact: 'jsx',
    python: 'python',
    java: 'java',
    csharp: 'csharp',
    cpp: 'cpp',
    c: 'c',
    go: 'go',
    rust: 'rust',
    php: 'php',
    ruby: 'ruby',
    html: 'markup',
    xml: 'markup',
    css: 'css',
    json: 'json',
    jsonc: 'json',
    shellscript: 'bash',
    sql: 'sql',
    yaml: 'yaml',
    markdown: 'markdown'
  };
  return map[languageId] || 'javascript';
}

function deactivate() {
  // Nada que limpiar explícitamente: el WebviewPanel, la vista de
  // barra lateral y los comandos registrados en context.subscriptions
  // se liberan automáticamente cuando VS Code desactiva la extensión.
}

module.exports = { activate, deactivate };

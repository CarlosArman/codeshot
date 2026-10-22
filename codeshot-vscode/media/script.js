// ============ Puente con la extensión de VS Code ============
const vscodeApi = typeof acquireVsCodeApi === 'function' ? acquireVsCodeApi() : null;

// ============ Almacenamiento tolerante a fallos ============
function readPreference(key) {
  try { return window.localStorage.getItem(key); } catch { return null; }
}
function writePreference(key, value) {
  try { window.localStorage.setItem(key, value); } catch { /* noop */ }
}
function clearAllPreferences() {
  try {
    Object.keys(localStorage).filter(k => k.startsWith('codeshot-')).forEach(k => localStorage.removeItem(k));
  } catch { /* noop */ }
}

// ============ Tema claro/oscuro ============
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');
const THEME_STORAGE_KEY = 'codeshot-theme';

function getPreferredTheme() {
  const saved = readPreference(THEME_STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  writePreference(THEME_STORAGE_KEY, theme);
  if (themeIcon) themeIcon.textContent = theme === 'light' ? '☀️' : '🌙';
  if (themeToggleBtn) {
    themeToggleBtn.setAttribute('aria-label',
      theme === 'light' ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro');
  }
}

applyTheme(getPreferredTheme());

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    applyTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light');
  });
}

// ============ Panel lateral ============
const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
const appMain = document.querySelector('.app-main');
const controlsPanel = document.getElementById('controlsPanel');
const SIDEBAR_STORAGE_KEY = 'codeshot-sidebar-collapsed';

function applySidebarState(collapsed) {
  if (!appMain || !sidebarToggleBtn) return;
  if (collapsed && controlsPanel?.contains(document.activeElement)) sidebarToggleBtn.focus();
  appMain.classList.toggle('sidebar-collapsed', collapsed);
  sidebarToggleBtn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
  sidebarToggleBtn.setAttribute('aria-label',
    collapsed ? 'Expandir panel de configuración' : 'Contraer panel de configuración');
  writePreference(SIDEBAR_STORAGE_KEY, collapsed ? '1' : '0');
}

if (sidebarToggleBtn) {
  applySidebarState(readPreference(SIDEBAR_STORAGE_KEY) === '1');
  sidebarToggleBtn.addEventListener('click', () => {
    applySidebarState(!appMain.classList.contains('sidebar-collapsed'));
  });
}

// ============ Elementos ============
const codeInput        = document.getElementById('codeInput');
const highlightCode    = document.getElementById('highlightCode');
const highlightPre     = document.getElementById('highlightPre');
const lineNumbers      = document.getElementById('lineNumbers');
const codeArea         = document.querySelector('.code-area');

const frameStyleSel    = document.getElementById('frameStyle');
const frameWidthInput  = document.getElementById('frameWidth');
const frameWidthVal    = document.getElementById('frameWidthVal');
const windowTitleInput = document.getElementById('windowTitle');
const windowTitleText  = document.getElementById('windowTitleText');
const showTitlebarChk  = document.getElementById('showTitlebar');
const windowFrame      = document.getElementById('windowFrame');
const titlebar         = document.getElementById('titlebar');
const browserBar       = document.getElementById('browserBar');
const browserUrlText   = document.getElementById('browserUrlText');
const clearCodeBtn     = document.getElementById('clearCodeBtn');
const resetDefaultsBtn = document.getElementById('resetDefaultsBtn');

const languageSel      = document.getElementById('language');
const fontFamilySel    = document.getElementById('fontFamily');
const codeThemeSel     = document.getElementById('codeTheme');
const prismThemeLink   = document.getElementById('prismThemeLink');
const fontSizeInput    = document.getElementById('fontSize');
const fontSizeVal      = document.getElementById('fontSizeVal');
const showLineNumbersChk = document.getElementById('showLineNumbers');
const lineStartInput   = document.getElementById('lineStart');
const codeStatsEl      = document.getElementById('codeStats');

const bgSwatchesContainer = document.getElementById('bgSwatches');
const customBgToggle   = document.getElementById('customBgToggle');
const customBgColor    = document.getElementById('customBgColor');

const paddingInput     = document.getElementById('padding');
const paddingVal       = document.getElementById('paddingVal');
const radiusInput      = document.getElementById('radius');
const radiusVal        = document.getElementById('radiusVal');
const shadowInput      = document.getElementById('shadow');
const shadowVal        = document.getElementById('shadowVal');
const showWatermarkChk = document.getElementById('showWatermark');
const watermarkTextInput = document.getElementById('watermarkText');
const watermark        = document.getElementById('watermark');

const exportStage      = document.getElementById('exportStage');
const downloadBtn      = document.getElementById('downloadBtn');
const copyImgBtn       = document.getElementById('copyImgBtn');
const downloadStatus   = document.getElementById('downloadStatus');

const zoomInBtn        = document.getElementById('zoomIn');
const zoomOutBtn       = document.getElementById('zoomOut');
const zoomValText      = document.getElementById('zoomVal');

// ============ Estado ============
let zoomLevel = 1;
let lastLineCount = -1;
let highlightDebounceTimer = null;
let syncRafId = null;

const NONE_BG_VALUE = 'none';
const FRAME_CLASSES = new Set(['frame-mac', 'frame-windows', 'frame-browser', 'frame-ubuntu', 'frame-none']);

// ============ Plantillas de código por lenguaje ============
const CODE_TEMPLATES = {
  javascript: 'function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nconsole.log(fibonacci(10));\n',
  typescript: 'function greet(name: string): string {\n  return `Hello, ${name}!`;\n}\n\nconst msg = greet("TypeScript");\nconsole.log(msg);\n',
  jsx:        'function Button({ label, onClick }) {\n  return (\n    <button className="btn" onClick={onClick}>\n      {label}\n    </button>\n  );\n}\n',
  python:     'def fibonacci(n: int) -> int:\n    if n <= 1:\n        return n\n    return fibonacci(n - 1) + fibonacci(n - 2)\n\nprint(fibonacci(10))\n',
  java:       'public class Hello {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n',
  csharp:     'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}\n',
  cpp:        '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}\n',
  c:          '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}\n',
  go:         'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}\n',
  rust:       'fn main() {\n    let message = String::from("Hello, World!");\n    println!("{}", message);\n}\n',
  php:        '<?php\n\nfunction greet(string $name): string {\n    return "Hello, $name!";\n}\n\necho greet("World");\n',
  ruby:       'def fibonacci(n)\n  return n if n <= 1\n  fibonacci(n - 1) + fibonacci(n - 2)\nend\n\nputs fibonacci(10)\n',
  markup:     '<!DOCTYPE html>\n<html lang="es">\n<head>\n  <meta charset="UTF-8" />\n  <title>Mi página</title>\n</head>\n<body>\n  <h1>Hola, mundo</h1>\n</body>\n</html>\n',
  css:        'body {\n  margin: 0;\n  font-family: system-ui, sans-serif;\n  background: #f4f5f8;\n  color: #1d1f27;\n}\n\n.container {\n  max-width: 900px;\n  margin: 0 auto;\n  padding: 2rem;\n}\n',
  json:       '{\n  "name": "my-project",\n  "version": "1.0.0",\n  "scripts": {\n    "dev": "node server.js"\n  }\n}\n',
  bash:       '#!/usr/bin/env bash\n\nNAME="${1:-World}"\necho "Hello, $NAME!"\n',
  sql:        'SELECT u.name, COUNT(o.id) AS total_orders\nFROM users u\nLEFT JOIN orders o ON o.user_id = u.id\nWHERE u.active = 1\nGROUP BY u.id\nORDER BY total_orders DESC;\n',
  yaml:       'name: deploy\non:\n  push:\n    branches: [main]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci && npm run build\n',
  markdown:   '# My Project\n\nA brief description of what this project does.\n\n## Getting Started\n\n```bash\nnpm install\nnpm run dev\n```\n\n## License\n\nMIT\n'
};

const PRISM_THEME_URLS = {
  tomorrow:      'vendor/prism/themes/prism-tomorrow.min.css',
  okaidia:       'vendor/prism/themes/prism-okaidia.min.css',
  dark:          'vendor/prism/themes/prism-dark.min.css',
  twilight:      'vendor/prism/themes/prism-twilight.min.css',
  funky:         'vendor/prism/themes/prism-funky.min.css',
  default:       'vendor/prism/themes/prism-default.min.css',
  coy:           'vendor/prism/themes/prism-coy.min.css',
  solarizedlight:'vendor/prism/themes/prism-solarizedlight.min.css',
  onelight:      'vendor/prism/themes/prism-onelight.min.css'
};

const LIGHT_PRISM_THEMES = new Set(['default', 'coy', 'solarizedlight', 'onelight']);

const FONT_FAMILIES = {
  'fira-code':    "'Fira Code', 'Consolas', monospace",
  'jetbrains':    "'JetBrains Mono', 'Consolas', monospace",
  'cascadia':     "'Cascadia Code', 'Consolas', monospace",
  'source-code':  "'Source Code Pro', 'Consolas', monospace",
  'consolas':     "'Consolas', 'Courier New', monospace"
};

const BACKGROUNDS = [
  'linear-gradient(135deg, #ff5f6d, #ffc371)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #a18cd1, #fbc2eb)',
  'linear-gradient(135deg, #0ba360, #3cba92)',
  'linear-gradient(135deg, #f6d365, #fda085)',
  'linear-gradient(135deg, #30cfd0, #330867)',
  'linear-gradient(135deg, #ff9a9e, #fecfef)',
  'linear-gradient(135deg, #2b5876, #4e4376)',
  'linear-gradient(135deg, #000000, #434343)',
  'linear-gradient(135deg, #c31432, #240b36)',
  '#ffffff',
  '#000000'
];

// ============ Persistencia: guardar preferencias ============
function saveAllPreferences() {
  writePreference('codeshot-language',    languageSel?.value ?? 'javascript');
  writePreference('codeshot-codeTheme',   codeThemeSel?.value ?? 'tomorrow');
  writePreference('codeshot-fontSize',    fontSizeInput?.value ?? '14');
  writePreference('codeshot-fontFamily',  fontFamilySel?.value ?? 'fira-code');
  writePreference('codeshot-frameStyle',  frameStyleSel?.value ?? 'mac');
  writePreference('codeshot-frameWidth',  frameWidthInput?.value ?? '680');
  writePreference('codeshot-showTitlebar', showTitlebarChk?.checked ? '1' : '0');
  writePreference('codeshot-showLineNumbers', showLineNumbersChk?.checked ? '1' : '0');
  writePreference('codeshot-lineStart',   lineStartInput?.value ?? '1');
  writePreference('codeshot-padding',     paddingInput?.value ?? '64');
  writePreference('codeshot-radius',      radiusInput?.value ?? '12');
  writePreference('codeshot-shadow',      shadowInput?.value ?? '60');
  writePreference('codeshot-showWatermark', showWatermarkChk?.checked ? '1' : '0');
  writePreference('codeshot-watermarkText', watermarkTextInput?.value ?? 'Hecho con CodeShot');
  writePreference('codeshot-customBgActive', customBgToggle?.checked ? '1' : '0');
  writePreference('codeshot-customBgColor', customBgColor?.value ?? '#6a11cb');
  const activeSwatch = bgSwatchesContainer?.querySelector('.swatch.active');
  if (activeSwatch) {
    writePreference('codeshot-activeBg', activeSwatch.style.background || NONE_BG_VALUE);
  }
  if (windowTitleInput?.dataset.touched) {
    writePreference('codeshot-windowTitle', windowTitleInput.value);
    writePreference('codeshot-windowTitleTouched', '1');
  }
}

// ============ Persistencia: restaurar preferencias ============
function applyFontSizeToUI(fontSize) {
  if (!fontSizeInput) return;
  fontSizeInput.value = fontSize;
  if (fontSizeVal) fontSizeVal.textContent = fontSize;
  const size = fontSize + 'px';
  if (highlightPre) highlightPre.style.fontSize = size;
  if (codeInput) codeInput.style.fontSize = size;
  if (lineNumbers) lineNumbers.style.fontSize = size;
}

function applyBoxShadowVSC(intensity) {
  if (windowFrame) windowFrame.style.boxShadow = `0 ${25 * intensity}px ${50 * intensity + 20}px rgba(0,0,0,${0.7 * intensity})`;
}

function restoreEditorPrefs() {
  const lang = readPreference('codeshot-language');
  if (lang && languageSel && [...languageSel.options].some(o => o.value === lang)) languageSel.value = lang;
  const theme = readPreference('codeshot-codeTheme');
  if (theme && codeThemeSel && PRISM_THEME_URLS[theme]) {
    codeThemeSel.value = theme;
    if (prismThemeLink) prismThemeLink.href = PRISM_THEME_URLS[theme];
  }
  const fontSize = readPreference('codeshot-fontSize');
  if (fontSize) applyFontSizeToUI(fontSize);
  const fontFamily = readPreference('codeshot-fontFamily');
  if (fontFamily && fontFamilySel && FONT_FAMILIES[fontFamily]) {
    fontFamilySel.value = fontFamily;
    applyFontFamily(fontFamily);
  }
}

function restoreFrameStylePrefVSC() {
  const frameStyle = readPreference('codeshot-frameStyle');
  if (!frameStyle || !frameStyleSel || !FRAME_CLASSES.has('frame-' + frameStyle)) { return; }
  frameStyleSel.value = frameStyle;
  if (windowFrame) {
    windowFrame.classList.remove(...FRAME_CLASSES);
    windowFrame.classList.add('frame-' + frameStyle);
  }
}

function restoreFrameWidthPrefVSC() {
  const frameWidth = readPreference('codeshot-frameWidth');
  if (!frameWidth || !frameWidthInput) { return; }
  frameWidthInput.value = frameWidth;
  if (frameWidthVal) { frameWidthVal.textContent = frameWidth; }
  if (windowFrame) { windowFrame.style.minWidth = frameWidth + 'px'; }
}

function restoreFramePrefsVSC() {
  restoreFrameStylePrefVSC();
  restoreFrameWidthPrefVSC();
  const showTitlebar = readPreference('codeshot-showTitlebar');
  if (showTitlebar !== null && showTitlebarChk) { showTitlebarChk.checked = showTitlebar === '1'; }
  const showLineNums = readPreference('codeshot-showLineNumbers');
  if (showLineNums !== null && showLineNumbersChk) { showLineNumbersChk.checked = showLineNums === '1'; }
  const lineStart = readPreference('codeshot-lineStart');
  if (lineStart && lineStartInput) { lineStartInput.value = lineStart; }
}

function restoreWatermarkPrefsVSC() {
  const showWm = readPreference('codeshot-showWatermark');
  if (showWm !== null && showWatermarkChk) {
    showWatermarkChk.checked = showWm === '1';
    if (watermark) watermark.classList.toggle('visible', showWm === '1');
  }
  const wmText = readPreference('codeshot-watermarkText');
  if (wmText && watermarkTextInput) {
    watermarkTextInput.value = wmText;
    if (watermark) watermark.textContent = wmText;
  }
}

function restorePaddingPrefVSC() {
  const padding = readPreference('codeshot-padding');
  if (!padding || !paddingInput) { return; }
  paddingInput.value = padding;
  if (paddingVal) { paddingVal.textContent = padding; }
  if (exportStage) { exportStage.style.setProperty('--stage-padding', padding + 'px'); }
}

function restoreRadiusPrefVSC() {
  const radius = readPreference('codeshot-radius');
  if (!radius || !radiusInput) { return; }
  radiusInput.value = radius;
  if (radiusVal) { radiusVal.textContent = radius; }
  if (windowFrame) { windowFrame.style.borderRadius = radius + 'px'; }
}

function restoreShadowPrefVSC() {
  const shadow = readPreference('codeshot-shadow');
  if (!shadow || !shadowInput) { return; }
  shadowInput.value = shadow;
  if (shadowVal) { shadowVal.textContent = shadow; }
  applyBoxShadowVSC(shadow / 100);
}

function restoreCustomBgPrefVSC() {
  const customBgActive = readPreference('codeshot-customBgActive');
  if (customBgActive !== '1' || !customBgToggle) { return; }
  customBgToggle.checked = true;
  if (customBgColor) { customBgColor.disabled = false; }
  const savedColor = readPreference('codeshot-customBgColor');
  if (savedColor && customBgColor) { customBgColor.value = savedColor; applyBackground(savedColor); }
}

function restoreVisualPrefsVSC() {
  restorePaddingPrefVSC();
  restoreRadiusPrefVSC();
  restoreShadowPrefVSC();
  restoreWatermarkPrefsVSC();
  restoreCustomBgPrefVSC();
}

function restoreAllPreferences() {
  restoreEditorPrefs();
  restoreFramePrefsVSC();
  restoreVisualPrefsVSC();
  const savedTitle = readPreference('codeshot-windowTitle');
  const savedTouched = readPreference('codeshot-windowTitleTouched');
  if (savedTouched === '1' && savedTitle && windowTitleInput) {
    windowTitleInput.value = savedTitle;
    windowTitleInput.dataset.touched = 'true';
    updateWindowTitleText();
  }
}

// ============ Inicialización ============
function init() {
  renderBgSwatches();
  restoreAllPreferences();
  const template = CODE_TEMPLATES[languageSel?.value] || CODE_TEMPLATES.javascript;
  if (codeInput && !codeInput.value) codeInput.value = template;
  codeInput.placeholder = 'Escribe o pega tu código aquí…';
  highlightCodeNow();
  updateLineNumbers();
  updateWindowTitleText();
  applyCodeThemeMode();
  renderHistory();
}

function applyCodeThemeMode() {
  if (!codeArea) return;
  const isLight = LIGHT_PRISM_THEMES.has(codeThemeSel?.value ?? 'tomorrow');
  codeArea.classList.toggle('light-editor', isLight);
}

function applyFontFamily(key) {
  const family = FONT_FAMILIES[key] || FONT_FAMILIES['fira-code'];
  const els = [highlightPre, codeInput, lineNumbers];
  els.forEach(el => { if (el) el.style.fontFamily = family; });
}

// ============ Fondo: radiogroup accesible con roving tabindex ============
function renderBgSwatches() {
  if (!bgSwatchesContainer) return;
  BACKGROUNDS.forEach((bg, idx) => {
    const sw = document.createElement('div');
    sw.className = 'swatch';
    sw.style.background = bg;
    if (bg === '#ffffff' || bg === '#000000') sw.classList.add('swatch-solid');
    makeSwatchAccessible(sw, describeBackground(bg), idx === 0);
    if (idx === 0) sw.classList.add('active');
    sw.addEventListener('click', () => { selectSwatch(sw, bg); sw.focus(); });
    bgSwatchesContainer.appendChild(sw);
  });

  const noneSwatch = document.createElement('div');
  noneSwatch.className = 'swatch swatch-none';
  noneSwatch.title = 'Sin fondo';
  noneSwatch.style.background = 'repeating-conic-gradient(#55565f 0% 25%, #35363f 0% 50%) 0 0 / 10px 10px';
  makeSwatchAccessible(noneSwatch, 'Sin fondo (transparente)', false);
  noneSwatch.addEventListener('click', () => { selectSwatch(noneSwatch, NONE_BG_VALUE); noneSwatch.focus(); });
  bgSwatchesContainer.appendChild(noneSwatch);
  setupSwatchKeyboardNavigation();

  // Restaurar fondo guardado
  const savedBg = readPreference('codeshot-activeBg');
  if (savedBg && readPreference('codeshot-customBgActive') !== '1') {
    const swatches = Array.from(bgSwatchesContainer.querySelectorAll('.swatch'));
    const match = swatches.find(s => s.style.background === savedBg || (savedBg === NONE_BG_VALUE && s.classList.contains('swatch-none')));
    if (match) {
      swatches.forEach(s => { s.classList.remove('active'); s.setAttribute('aria-checked', 'false'); s.setAttribute('tabindex', '-1'); });
      match.classList.add('active');
      match.setAttribute('aria-checked', 'true');
      match.setAttribute('tabindex', '0');
      applyBackground(savedBg);
    }
  }
}

function describeBackground(bg) {
  if (bg === '#ffffff') return 'Fondo blanco sólido';
  if (bg === '#000000') return 'Fondo negro sólido';
  return 'Fondo degradado de color';
}

function makeSwatchAccessible(swatchEl, label, isChecked) {
  swatchEl.setAttribute('role', 'radio');
  swatchEl.setAttribute('tabindex', isChecked ? '0' : '-1');
  swatchEl.setAttribute('aria-label', label);
  swatchEl.setAttribute('aria-checked', isChecked ? 'true' : 'false');
}

function setupSwatchKeyboardNavigation() {
  if (!bgSwatchesContainer) return;
  bgSwatchesContainer.addEventListener('keydown', (e) => {
    const items = Array.from(bgSwatchesContainer.querySelectorAll('.swatch'));
    const currentIndex = items.indexOf(document.activeElement);
    if (currentIndex === -1) return;
    let nextIndex = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextIndex = (currentIndex + 1) % items.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') nextIndex = (currentIndex - 1 + items.length) % items.length;
    else if (e.key === 'Home') nextIndex = 0;
    else if (e.key === 'End') nextIndex = items.length - 1;
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); document.activeElement.click(); return; }
    if (nextIndex !== null) {
      e.preventDefault();
      items.forEach(item => item.setAttribute('tabindex', '-1'));
      items[nextIndex].setAttribute('tabindex', '0');
      items[nextIndex].focus();
    }
  });
}

function selectSwatch(swatchEl, bgValue) {
  document.querySelectorAll('.swatch').forEach(s => {
    s.classList.remove('active');
    s.setAttribute('aria-checked', 'false');
    s.setAttribute('tabindex', '-1');
  });
  swatchEl.classList.add('active');
  swatchEl.setAttribute('aria-checked', 'true');
  swatchEl.setAttribute('tabindex', '0');
  if (customBgToggle) customBgToggle.checked = false;
  if (customBgColor) customBgColor.disabled = true;
  applyBackground(bgValue);
  saveAllPreferences();
}

function applyBackground(bgValue) {
  if (!exportStage) return;
  if (bgValue === NONE_BG_VALUE) {
    exportStage.style.background = '';
    exportStage.classList.add('bg-none');
  } else {
    exportStage.classList.remove('bg-none');
    exportStage.style.background = bgValue;
  }
  updateWatermarkColor();
}

// ============ Color automático del watermark ============
function updateWatermarkColor() {
  if (!watermark || !showWatermarkChk?.checked) return;
  const bg = exportStage?.style.background || '';
  const isLight = bg.includes('#ffffff') || bg.includes('255,255,255') ||
    bg.includes('#fafafa') || bg.includes('fecfef') || bg.includes('fbc2eb');
  watermark.style.color = isLight ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.75)';
}

// ============ Resaltado de código con debounce ============
function highlightCodeNow() {
  const code = codeInput?.value ?? '';
  if (highlightCode) {
    highlightCode.textContent = code;
    highlightCode.className = 'language-' + (languageSel?.value ?? 'javascript');
    if (window.Prism) Prism.highlightElement(highlightCode);
  }
  scheduleSyncTextareaSize();
  updateCodeStats();
}

function scheduleHighlight() {
  clearTimeout(highlightDebounceTimer);
  highlightDebounceTimer = setTimeout(highlightCodeNow, 80);
}

function scheduleSyncTextareaSize() {
  if (syncRafId) cancelAnimationFrame(syncRafId);
  syncRafId = requestAnimationFrame(() => {
    if (codeInput && highlightPre) {
      codeInput.style.height = highlightPre.scrollHeight + 'px';
      codeInput.style.width  = highlightPre.scrollWidth  + 'px';
    }
    syncRafId = null;
  });
}

function syncTextareaSize() {
  scheduleSyncTextareaSize();
}

// ============ Estadísticas del código ============
function updateCodeStats() {
  if (!codeStatsEl) return;
  const code = codeInput?.value ?? '';
  const lines = code.split('\n').length;
  const chars = code.length;
  codeStatsEl.textContent = `${lines} líneas · ${chars} caracteres`;
}

// ============ Números de línea (incremental) ============
function updateLineNumbers() {
  if (!showLineNumbersChk?.checked) {
    lineNumbers?.classList.remove('visible');
    return;
  }
  lineNumbers?.classList.add('visible');
  const lines = (codeInput?.value ?? '').split('\n').length;
  if (lines === lastLineCount) return; // incremental: solo recalcular si cambió
  lastLineCount = lines;
  const start = Number.parseInt(lineStartInput?.value ?? '1', 10) || 1;
  let text = '';
  for (let i = start; i < start + lines; i++) text += i + '\n';
  if (lineNumbers) lineNumbers.textContent = text.trimEnd();
}

// ============ Detección automática de lenguaje ============
function detectScriptLanguageVSC(f) {
  if (f.startsWith('def ') || (f.startsWith('import ') && f.includes(':')) || (f.startsWith('class ') && f.includes(':'))) return 'python';
  if (f.startsWith('fn ') || f.startsWith('use ')) return 'rust';
  if (f.startsWith('<?php')) return 'php';
  if (f.startsWith('package ') && f.includes('import "')) return 'go';
  if (f.startsWith('#include')) return 'cpp';
  if (f.startsWith('public class ')) return 'java';
  if (f.startsWith('using System')) return 'csharp';
  if (f.startsWith('import React')) return 'jsx';
  return null;
}

function detectDataLanguageVSC(f) {
  if (f.startsWith('SELECT ') || f.startsWith('CREATE ') || f.startsWith('INSERT ')) return 'sql';
  if (f.startsWith('---')) return 'yaml';
  if (f.startsWith('{') || f.startsWith('[')) return 'json';
  if (f.startsWith('#!/')) return 'bash';
  if (f.startsWith('<!DOCTYPE') || f.startsWith('<html')) return 'markup';
  if (f.startsWith('# ') || f.startsWith('## ')) return 'markdown';
  return null;
}

function detectLanguageByPrefixVSC(f) {
  return detectScriptLanguageVSC(f) ?? detectDataLanguageVSC(f);
}

function detectLanguageBySuffixVSC(f) {
  if (f.includes('println!')) return 'rust';
  if (f.includes('int main(') && f.includes('{')) return 'cpp';
  if (f.includes('System.out.println')) return 'java';
  if (f.includes('Console.WriteLine')) return 'csharp';
  if (f.includes('<div') || f.includes('jsx')) return 'jsx';
  if (/^\w+:\s/.test(f)) return 'yaml';
  return null;
}

function detectLanguage(code) {
  if (!code) return null;
  const f = code.trimStart();
  return detectLanguageByPrefixVSC(f) ?? detectLanguageBySuffixVSC(f);
}

// ============ Eventos del editor ============
if (codeInput) {
  codeInput.addEventListener('input', () => {
    scheduleHighlight();
    updateLineNumbers();
  });

  codeInput.addEventListener('paste', (e) => {
    setTimeout(() => {
      const detected = detectLanguage(codeInput.value);
      if (detected && languageSel && [...languageSel.options].some(o => o.value === detected)) {
        languageSel.value = detected;
        saveAllPreferences();
      }
    }, 0);
  });

  codeInput.addEventListener('scroll', () => {
    if (highlightPre) { highlightPre.scrollTop = codeInput.scrollTop; highlightPre.scrollLeft = codeInput.scrollLeft; }
    if (lineNumbers) lineNumbers.scrollTop = codeInput.scrollTop;
  });
}

// ============ Drag & Drop de archivos ============
if (codeInput) {
  codeInput.addEventListener('dragover', (e) => { e.preventDefault(); codeInput.classList.add('drag-over'); });
  codeInput.addEventListener('dragleave', () => codeInput.classList.remove('drag-over'));
  codeInput.addEventListener('drop', (e) => {
    e.preventDefault();
    codeInput.classList.remove('drag-over');
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    const extLangMap = { js:'javascript', ts:'typescript', jsx:'jsx', tsx:'jsx', py:'python', java:'java', cs:'csharp', cpp:'cpp', c:'c', go:'go', rs:'rust', php:'php', rb:'ruby', html:'markup', htm:'markup', css:'css', json:'json', sh:'bash', sql:'sql', yml:'yaml', yaml:'yaml', md:'markdown' };
    void file.text().then(text => {
      codeInput.value = text;
      const detectedLang = extLangMap[ext] ?? detectLanguage(codeInput.value) ?? languageSel?.value ?? 'javascript';
      if (languageSel && [...languageSel.options].some(o => o.value === detectedLang)) languageSel.value = detectedLang;
      if (!windowTitleInput?.dataset.touched && windowTitleInput) { windowTitleInput.value = file.name; updateWindowTitleText(); }
      highlightCodeNow();
      updateLineNumbers();
      saveAllPreferences();
    });
  });
}

// ============ Limpiar código ============
if (clearCodeBtn) {
  clearCodeBtn.addEventListener('click', () => {
    if (codeInput) codeInput.value = '';
    highlightCodeNow();
    updateLineNumbers();
    codeInput?.focus();
  });
}

// ============ Restaurar valores por defecto ============
if (resetDefaultsBtn) {
  resetDefaultsBtn.addEventListener('click', () => {
    if (!confirm('¿Restaurar todos los ajustes a los valores por defecto?')) return;
    clearAllPreferences();
    location.reload();
  });
}

// ============ Lenguaje y tema ============
if (languageSel) {
  languageSel.addEventListener('change', () => {
    highlightCodeNow();
    updateFileExtensionHint();
    saveAllPreferences();
  });
}

function updateFileExtensionHint() {
  const extMap = { javascript:'.js', typescript:'.ts', jsx:'.jsx', python:'.py', java:'.java', csharp:'.cs', cpp:'.cpp', c:'.c', go:'.go', rust:'.rs', php:'.php', ruby:'.rb', markup:'.html', css:'.css', json:'.json', bash:'.sh', sql:'.sql', yaml:'.yml', markdown:'.md' };
  const ext = extMap[languageSel?.value] ?? '';
  if (!windowTitleInput?.dataset.touched && windowTitleInput) { windowTitleInput.value = 'untitled' + ext; updateWindowTitleText(); }
}

if (windowTitleInput) {
  windowTitleInput.addEventListener('input', () => {
    windowTitleInput.dataset.touched = 'true';
    updateWindowTitleText();
    saveAllPreferences();
  });
}

function updateWindowTitleText() {
  const title = windowTitleInput?.value || 'untitled';
  if (windowTitleText) windowTitleText.textContent = title;
  if (browserUrlText) browserUrlText.textContent = title;
}

if (codeThemeSel) {
  codeThemeSel.addEventListener('change', () => {
    if (prismThemeLink) prismThemeLink.href = PRISM_THEME_URLS[codeThemeSel.value];
    applyCodeThemeMode();
    saveAllPreferences();
  });
}

// ============ Familia de fuente ============
if (fontFamilySel) {
  fontFamilySel.addEventListener('change', () => {
    applyFontFamily(fontFamilySel.value);
    syncTextareaSize();
    saveAllPreferences();
  });
}

// ============ Tamaño de fuente ============
if (fontSizeInput) {
  fontSizeInput.addEventListener('input', () => {
    const size = fontSizeInput.value + 'px';
    if (fontSizeVal) fontSizeVal.textContent = fontSizeInput.value;
    if (highlightPre) highlightPre.style.fontSize = size;
    if (codeInput) codeInput.style.fontSize = size;
    if (lineNumbers) lineNumbers.style.fontSize = size;
    syncTextareaSize();
    fontSizeInput.setAttribute('aria-valuenow', fontSizeInput.value);
    fontSizeInput.setAttribute('aria-valuetext', fontSizeInput.value + ' píxeles');
    saveAllPreferences();
  });
}

// ============ Números de línea y línea inicial ============
if (showLineNumbersChk) showLineNumbersChk.addEventListener('change', () => { lastLineCount = -1; updateLineNumbers(); saveAllPreferences(); });
if (lineStartInput) lineStartInput.addEventListener('input', () => { lastLineCount = -1; updateLineNumbers(); saveAllPreferences(); });

// ============ Marco de ventana ============
if (frameStyleSel) {
  frameStyleSel.addEventListener('change', () => {
    if (windowFrame) { windowFrame.classList.remove(...FRAME_CLASSES); windowFrame.classList.add('frame-' + frameStyleSel.value); }
    syncTitlebarVisibility();
    saveAllPreferences();
  });
}

if (frameWidthInput) {
  frameWidthInput.addEventListener('input', () => {
    const w = frameWidthInput.value;
    if (frameWidthVal) frameWidthVal.textContent = w;
    if (windowFrame) windowFrame.style.minWidth = w + 'px';
    frameWidthInput.setAttribute('aria-valuenow', w);
    frameWidthInput.setAttribute('aria-valuetext', w + ' píxeles');
    saveAllPreferences();
  });
}

function syncTitlebarVisibility() {
  const show = showTitlebarChk?.checked ?? true;
  if (titlebar) titlebar.style.display = show ? '' : 'none';
  if (browserBar) {
    const isBrowserFrame = windowFrame?.classList.contains('frame-browser');
    browserBar.style.display = show && isBrowserFrame ? '' : 'none';
  }
  saveAllPreferences();
}

if (showTitlebarChk) showTitlebarChk.addEventListener('change', syncTitlebarVisibility);

// ============ Fondo personalizado ============
if (customBgToggle) {
  customBgToggle.addEventListener('change', () => {
    if (customBgColor) customBgColor.disabled = !customBgToggle.checked;
    if (customBgToggle.checked) {
      document.querySelectorAll('.swatch').forEach(s => { s.classList.remove('active'); s.setAttribute('aria-checked', 'false'); });
      applyBackground(customBgColor?.value ?? '#6a11cb');
    }
    saveAllPreferences();
  });
}

if (customBgColor) {
  customBgColor.addEventListener('input', () => {
    if (customBgToggle?.checked) applyBackground(customBgColor.value);
    saveAllPreferences();
  });
}

// ============ Apariencia ============
if (paddingInput) {
  paddingInput.addEventListener('input', () => {
    if (paddingVal) paddingVal.textContent = paddingInput.value;
    if (exportStage) exportStage.style.setProperty('--stage-padding', paddingInput.value + 'px');
    paddingInput.setAttribute('aria-valuenow', paddingInput.value);
    saveAllPreferences();
  });
}

if (radiusInput) {
  radiusInput.addEventListener('input', () => {
    if (radiusVal) radiusVal.textContent = radiusInput.value;
    if (windowFrame) windowFrame.style.borderRadius = radiusInput.value + 'px';
    radiusInput.setAttribute('aria-valuenow', radiusInput.value);
    saveAllPreferences();
  });
}

if (shadowInput) {
  shadowInput.addEventListener('input', () => {
    if (shadowVal) shadowVal.textContent = shadowInput.value;
    const intensity = shadowInput.value / 100;
    if (windowFrame) windowFrame.style.boxShadow = `0 ${25 * intensity}px ${50 * intensity + 20}px rgba(0,0,0,${0.7 * intensity})`;
    shadowInput.setAttribute('aria-valuenow', shadowInput.value);
    saveAllPreferences();
  });
}

if (showWatermarkChk) {
  showWatermarkChk.addEventListener('change', () => {
    watermark?.classList.toggle('visible', showWatermarkChk.checked);
    updateWatermarkColor();
    saveAllPreferences();
  });
}

if (watermarkTextInput) {
  watermarkTextInput.addEventListener('input', () => {
    if (watermark) watermark.textContent = watermarkTextInput.value || 'Hecho con CodeShot';
    saveAllPreferences();
  });
}

// ============ Zoom ============
function applyZoom() {
  if (exportStage) exportStage.style.transform = `scale(${zoomLevel})`;
  if (zoomValText) zoomValText.textContent = Math.round(zoomLevel * 100) + '%';
}

if (zoomInBtn) zoomInBtn.addEventListener('click', () => { zoomLevel = Math.min(2, zoomLevel + 0.1); applyZoom(); });
if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => { zoomLevel = Math.max(0.3, zoomLevel - 0.1); applyZoom(); });

// ============ Controles de exportación ============
const exportFormatSel   = document.getElementById('exportFormat');
const jpegQualityWrapper = document.getElementById('jpegQualityWrapper');
const exportQualityInput = document.getElementById('exportQuality');
const exportQualityVal  = document.getElementById('exportQualityVal');

if (exportFormatSel) {
  exportFormatSel.addEventListener('change', () => {
    const isJpeg = exportFormatSel.value === 'jpeg';
    if (jpegQualityWrapper) jpegQualityWrapper.style.display = isJpeg ? '' : 'none';
    // El botón muestra siempre el formato elegido
    if (downloadBtn) downloadBtn.innerHTML = `<span aria-hidden="true">⬇</span> Descargar ${isJpeg ? 'JPEG' : 'PNG'}`;
    saveAllPreferences();
  });
}

if (exportQualityInput) {
  exportQualityInput.addEventListener('input', () => {
    if (exportQualityVal) exportQualityVal.textContent = exportQualityInput.value;
    saveAllPreferences();
  });
}

function getExportFormat() { return exportFormatSel?.value ?? 'png'; }
function getExportQuality() { return Number.parseInt(exportQualityInput?.value ?? '90', 10) / 100; }
function getExportScale() {
  const checked = document.querySelector('input[name="exportScale"]:checked');
  return Number.parseInt(checked?.value ?? '2', 10);
}

// ============ Exportar como PNG/JPEG ============
const INVALID_FILENAME_CHARS = new Set(['<', '>', ':', '"', '/', '\\', '|', '?', '*']);

function isTrailingSpaceOrDot(char) { return char === ' ' || char === '.'; }

function safeFilename(rawTitle = 'codeshot') {
  const title = rawTitle || 'codeshot';
  const lastDot = title.lastIndexOf('.');
  const withoutExt = lastDot > 0 ? title.slice(0, lastDot) : title;
  let sanitized = '';
  for (const char of withoutExt) {
    const code = char.codePointAt(0);
    sanitized += (code <= 0x1f || INVALID_FILENAME_CHARS.has(char)) ? '-' : char;
  }
  let end = sanitized.length;
  while (end > 0 && isTrailingSpaceOrDot(sanitized[end - 1])) end -= 1;
  return (sanitized.slice(0, end).trim().slice(0, 100) || 'codeshot') + '.png';
}

async function generateCanvas() {
  if (typeof window.html2canvas !== 'function') return null;
  const originalTransform = exportStage.style.transform;
  exportStage.style.transform = 'none';
  const isJpeg = getExportFormat() === 'jpeg';
  const isNoneBg = exportStage.classList.contains('bg-none') && !isJpeg;
  codeInput?.blur();
  try {
    const canvas = await html2canvas(exportStage, {
      backgroundColor: isJpeg ? '#ffffff' : null,
      scale: getExportScale(),
      useCORS: true,
      onclone: (clonedDoc) => {
        if (!isNoneBg) return;
        const clonedStage = clonedDoc.getElementById('exportStage');
        if (clonedStage) { clonedStage.classList.remove('bg-none'); clonedStage.style.background = 'transparent'; clonedStage.style.backgroundImage = 'none'; }
      }
    });
    return canvas;
  } finally {
    exportStage.style.transform = originalTransform;
  }
}

async function executeDownload() {
  const canvas = await generateCanvas();
  if (!canvas) { throw new Error('Canvas nulo'); }
  const fmt = getExportFormat();
  const mimeType = fmt === 'jpeg' ? 'image/jpeg' : 'image/png';
  const ext = fmt === 'jpeg' ? '.jpg' : '.png';
  const filename = safeFilename(windowTitleInput?.value).replace(/\.png$/, ext);
  const quality = fmt === 'jpeg' ? getExportQuality() : undefined;
  const dataUrl = canvas.toDataURL(mimeType, quality);
  if (vscodeApi) {
    vscodeApi.postMessage({ type: 'saveImage', dataUrl, filename });
    if (downloadStatus) { downloadStatus.textContent = 'Abriendo diálogo para guardar ' + filename; }
  } else {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    link.remove();
    if (downloadStatus) { downloadStatus.textContent = 'Imagen "' + filename + '" descargada.'; }
    addToHistory(filename, dataUrl);
  }
}

if (downloadBtn) {
  downloadBtn.addEventListener('click', async () => {
    if (typeof window.html2canvas !== 'function') {
      if (downloadStatus) { downloadStatus.textContent = 'No se pudo generar la imagen: librería no disponible.'; }
      return;
    }
    downloadBtn.disabled = true;
    if (downloadStatus) { downloadStatus.textContent = 'Generando imagen...'; }
    try {
      await executeDownload();
    } catch (err) {
      console.error('Error al exportar:', err);
      if (downloadStatus) { downloadStatus.textContent = 'Error al generar la imagen.'; }
    } finally {
      downloadBtn.disabled = false;
    }
  });
}

// ============ Copiar imagen al portapapeles ============
if (copyImgBtn) {
  copyImgBtn.addEventListener('click', async () => {
    if (typeof window.html2canvas !== 'function' || !navigator.clipboard?.write) {
      if (downloadStatus) downloadStatus.textContent = 'Copiar al portapapeles no está disponible en este entorno.';
      return;
    }
    copyImgBtn.disabled = true;
    if (downloadStatus) downloadStatus.textContent = 'Copiando imagen…';
    try {
      const canvas = await generateCanvas();
      if (!canvas) throw new Error('Canvas nulo');
      canvas.toBlob(async (blob) => {
        if (!blob) throw new Error('Blob nulo');
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        if (downloadStatus) downloadStatus.textContent = 'Imagen copiada al portapapeles.';
      }, 'image/png');
    } catch (err) {
      console.error('Error al copiar:', err);
      if (downloadStatus) downloadStatus.textContent = 'No se pudo copiar al portapapeles.';
    } finally {
      copyImgBtn.disabled = false;
    }
  });
}

// ============ ZIP multi-resolución (pure JS, sin librería) ============
const CRC32_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[i] = c;
  }
  return t;
})();

function crc32(data) {
  let crc = 0xFFFFFFFF;
  for (const byte of data) crc = (crc >>> 8) ^ CRC32_TABLE[(crc ^ byte) & 0xFF];
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function buildZip(files) {
  const enc = new TextEncoder();
  const localParts = [], centralParts = [];
  let offset = 0;
  for (const { name, data } of files) {
    const nb = enc.encode(name);
    const crc = crc32(data), size = data.length;
    const lh = new Uint8Array(30 + nb.length);
    const lv = new DataView(lh.buffer);
    lv.setUint32(0, 0x04034b50, true); lv.setUint16(4, 20, true); lv.setUint16(6, 0, true);
    lv.setUint16(8, 0, true); lv.setUint16(10, 0, true); lv.setUint16(12, 0, true);
    lv.setUint32(14, crc, true); lv.setUint32(18, size, true); lv.setUint32(22, size, true);
    lv.setUint16(26, nb.length, true); lv.setUint16(28, 0, true);
    lh.set(nb, 30);
    localParts.push(lh, data);
    const cd = new Uint8Array(46 + nb.length);
    const cv = new DataView(cd.buffer);
    cv.setUint32(0, 0x02014b50, true); cv.setUint16(4, 20, true); cv.setUint16(6, 20, true);
    cv.setUint16(8, 0, true); cv.setUint16(10, 0, true); cv.setUint16(12, 0, true); cv.setUint16(14, 0, true);
    cv.setUint32(16, crc, true); cv.setUint32(20, size, true); cv.setUint32(24, size, true);
    cv.setUint16(28, nb.length, true); cv.setUint16(30, 0, true); cv.setUint16(32, 0, true);
    cv.setUint16(34, 0, true); cv.setUint16(36, 0, true); cv.setUint32(38, 0, true); cv.setUint32(42, offset, true);
    cd.set(nb, 46);
    centralParts.push(cd);
    offset += lh.length + size;
  }
  const cdSize = centralParts.reduce((s, c) => s + c.length, 0);
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true); ev.setUint16(4, 0, true); ev.setUint16(6, 0, true);
  ev.setUint16(8, files.length, true); ev.setUint16(10, files.length, true);
  ev.setUint32(12, cdSize, true); ev.setUint32(16, offset, true); ev.setUint16(20, 0, true);
  const all = [...localParts, ...centralParts, eocd];
  const total = all.reduce((s, p) => s + p.length, 0);
  const result = new Uint8Array(total);
  let pos = 0;
  for (const p of all) { result.set(p, pos); pos += p.length; }
  return result;
}

function canvasToUint8Array(canvas) {
  const b64 = canvas.toDataURL('image/png').split(',')[1];
  const bin = atob(b64);
  return Uint8Array.from(bin, ch => ch.codePointAt(0));
}

async function generateCanvasAtScale(scale) {
  if (typeof window.html2canvas !== 'function') return null;
  const orig = exportStage.style.transform;
  exportStage.style.transform = 'none';
  const isNone = exportStage.classList.contains('bg-none');
  codeInput?.blur();
  try {
    return await html2canvas(exportStage, {
      backgroundColor: null, scale, useCORS: true,
      onclone: (d) => {
        if (isNone) {
          const s = d.getElementById('exportStage');
          if (s) { s.classList.remove('bg-none'); s.style.background = 'transparent'; s.style.backgroundImage = 'none'; }
        }
      }
    });
  } finally { exportStage.style.transform = orig; }
}

const exportZipBtn = document.getElementById('exportZipBtn');
if (exportZipBtn) {
  exportZipBtn.addEventListener('click', async () => {
    if (typeof window.html2canvas !== 'function') {
      if (downloadStatus) downloadStatus.textContent = 'Librería no disponible.';
      return;
    }
    exportZipBtn.disabled = true;
    if (downloadStatus) downloadStatus.textContent = 'Generando ZIP (1x/2x/3x)...';
    try {
      const base = safeFilename(windowTitleInput?.value).replace(/\.png$/, '');
      const [c1, c2, c3] = await Promise.all([generateCanvasAtScale(1), generateCanvasAtScale(2), generateCanvasAtScale(3)]);
      if (!c1 || !c2 || !c3) throw new Error('Canvas nulo');
      const zipBytes = buildZip([
        { name: base + '_1x.png', data: canvasToUint8Array(c1) },
        { name: base + '_2x.png', data: canvasToUint8Array(c2) },
        { name: base + '_3x.png', data: canvasToUint8Array(c3) }
      ]);
      const blob = new Blob([zipBytes], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = base + '_all-scales.zip';
      link.href = url;
      document.body.appendChild(link); link.click(); link.remove();
      URL.revokeObjectURL(url);
      if (downloadStatus) downloadStatus.textContent = 'ZIP descargado.';
    } catch (err) {
      console.error(err);
      if (downloadStatus) downloadStatus.textContent = 'Error al generar el ZIP.';
    } finally { exportZipBtn.disabled = false; }
  });
}

// ============ Historial de capturas ============
const HISTORY_KEY = 'codeshot-history';
const HISTORY_MAX = 8;
const historyListEl = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

function getHistory() { try { return JSON.parse(readPreference(HISTORY_KEY) ?? '[]'); } catch { return []; } }
function saveHistory(h) { try { writePreference(HISTORY_KEY, JSON.stringify(h)); } catch { /* noop */ } }

function addToHistory(filename, dataUrl) {
  const thumb = document.createElement('canvas');
  const img = new Image();
  img.onload = () => {
    const ratio = Math.min(120 / img.width, 80 / img.height, 1);
    thumb.width = Math.round(img.width * ratio);
    thumb.height = Math.round(img.height * ratio);
    thumb.getContext('2d').drawImage(img, 0, 0, thumb.width, thumb.height);
    const thumbnailUrl = thumb.toDataURL('image/jpeg', 0.7);
    const history = getHistory();
    history.unshift({ id: Date.now(), filename, thumbnailUrl, dataUrl, date: new Date().toLocaleDateString('es') });
    if (history.length > HISTORY_MAX) history.pop();
    saveHistory(history);
    renderHistory();
  };
  img.src = dataUrl;
}

function renderHistory() {
  if (!historyListEl) return;
  const history = getHistory();
  historyListEl.innerHTML = '';
  if (!history.length) { historyListEl.innerHTML = '<p style="font-size:12px;color:var(--text-dim);margin:0">No hay capturas recientes.</p>'; return; }
  history.forEach(item => {
    const div = document.createElement('div');
    div.className = 'history-item';
    const img = document.createElement('img');
    img.className = 'history-thumb'; img.src = item.thumbnailUrl; img.alt = item.filename;
    const meta = document.createElement('div');
    meta.className = 'history-meta';
    meta.innerHTML = '<span class="history-name">' + item.filename + '</span><span class="history-date">' + item.date + '</span>';
    const dlBtn = document.createElement('button');
    dlBtn.className = 'history-dl'; dlBtn.title = 'Re-descargar'; dlBtn.textContent = '\u2B07';
    dlBtn.addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = item.filename; link.href = item.dataUrl;
      document.body.appendChild(link); link.click(); link.remove();
    });
    div.append(img, meta, dlBtn);
    historyListEl.appendChild(div);
  });
}

if (clearHistoryBtn) clearHistoryBtn.addEventListener('click', () => { saveHistory([]); renderHistory(); });

// ============ Atajos de teclado globales en la UI ============
document.addEventListener('keydown', (e) => {
  const ctrl = e.ctrlKey || e.metaKey;
  if (!ctrl) return;
  if (e.key === 'Enter') { e.preventDefault(); downloadBtn?.click(); }
  else if (e.shiftKey && e.key === 'C') { e.preventDefault(); copyImgBtn?.click(); }
  else if (e.key === 'l' || e.key === 'L') { e.preventDefault(); clearCodeBtn?.click(); }
  else if (e.key === '=' || e.key === '+') { e.preventDefault(); zoomInBtn?.click(); }
  else if (e.key === '-') { e.preventDefault(); zoomOutBtn?.click(); }
});

// ============ Carga de selección enviada desde VS Code ============
// VS Code webview messages use 'null' or empty string as origin by platform design.
// Origin validation is combined with strict message-type checking for defense in depth.
const VSCODE_TRUSTED_ORIGINS = new Set([window.location.origin, 'null', '']);

function isVSCodeMessage(event) {
  return VSCODE_TRUSTED_ORIGINS.has(event.origin) && event.data?.type === 'loadSelection';
}

if (vscodeApi) {
  window.addEventListener('message', (event) => {
    // Explicit origin check required by static analysis (SonarQube S2819).
    // VS Code webview messages arrive with 'null' or '' as origin by platform design.
    if (!VSCODE_TRUSTED_ORIGINS.has(event.origin)) { return; }
    if (event.data?.type !== 'loadSelection') { return; }
    const message = event.data;
    if (codeInput) { codeInput.value = message.code ?? ''; }
    if (message.language && languageSel && [...languageSel.options].some(o => o.value === message.language)) { languageSel.value = message.language; }
    if (message.fileName && windowTitleInput) { windowTitleInput.value = message.fileName; windowTitleInput.dataset.touched = 'true'; updateWindowTitleText(); }
    highlightCodeNow();
    updateLineNumbers();
    codeInput?.focus();
  });
}

// ============ Presets de estilo ============
const PRESETS_KEY       = 'codeshot-presets';
const presetNameInput   = document.getElementById('presetNameInput');
const savePresetBtn     = document.getElementById('savePresetBtn');
const presetList        = document.getElementById('presetList');

function loadPresets() {
  try { return JSON.parse(readPreference(PRESETS_KEY) ?? '[]'); } catch { return []; }
}

function savePresetsToStorage(presets) {
  try { writePreference(PRESETS_KEY, JSON.stringify(presets)); } catch { /* noop */ }
}

function buildCurrentPresetState() {
  return {
    language:      languageSel?.value,
    codeTheme:     codeThemeSel?.value,
    fontSize:      fontSizeInput?.value,
    fontFamily:    fontFamilySel?.value,
    frameStyle:    frameStyleSel?.value,
    frameWidth:    frameWidthInput?.value,
    showTitlebar:  showTitlebarChk?.checked ? '1' : '0',
    padding:       paddingInput?.value,
    radius:        radiusInput?.value,
    shadow:        shadowInput?.value,
    activeBg:      bgSwatchesContainer?.querySelector('.swatch.active')?.style.background ?? '',
    customBgActive: customBgToggle?.checked ? '1' : '0',
    customBgColor:  customBgColor?.value
  };
}

function applyPresetEditorStateVSC(state) {
  if (state.language && languageSel && [...languageSel.options].some(o => o.value === state.language)) languageSel.value = state.language;
  if (state.codeTheme && codeThemeSel && PRISM_THEME_URLS[state.codeTheme]) {
    codeThemeSel.value = state.codeTheme;
    if (prismThemeLink) prismThemeLink.href = PRISM_THEME_URLS[state.codeTheme];
  }
  if (state.fontSize) applyFontSizeToUI(state.fontSize);
  if (state.fontFamily && fontFamilySel && FONT_FAMILIES[state.fontFamily]) {
    fontFamilySel.value = state.fontFamily;
    applyFontFamily(state.fontFamily);
  }
}

function applyPresetFrameStateVSC(state) {
  if (state.frameStyle && frameStyleSel && FRAME_CLASSES.has('frame-' + state.frameStyle)) {
    frameStyleSel.value = state.frameStyle;
    if (windowFrame) { windowFrame.classList.remove(...FRAME_CLASSES); windowFrame.classList.add('frame-' + state.frameStyle); }
  }
  if (state.frameWidth && frameWidthInput) {
    frameWidthInput.value = state.frameWidth;
    if (frameWidthVal) frameWidthVal.textContent = state.frameWidth;
    if (windowFrame) windowFrame.style.minWidth = state.frameWidth + 'px';
  }
  if (state.showTitlebar !== undefined && showTitlebarChk) showTitlebarChk.checked = state.showTitlebar === '1';
}

function applyPresetPaddingVSC(state) {
  if (!state.padding || !paddingInput) return;
  paddingInput.value = state.padding;
  if (paddingVal) paddingVal.textContent = state.padding;
  if (exportStage) exportStage.style.setProperty('--stage-padding', state.padding + 'px');
}

function applyPresetRadiusVSC(state) {
  if (!state.radius || !radiusInput) return;
  radiusInput.value = state.radius;
  if (radiusVal) radiusVal.textContent = state.radius;
  if (windowFrame) windowFrame.style.borderRadius = state.radius + 'px';
}

function applyPresetShadowVSC(state) {
  if (!state.shadow || !shadowInput) return;
  shadowInput.value = state.shadow;
  if (shadowVal) shadowVal.textContent = state.shadow;
  applyBoxShadowVSC(state.shadow / 100);
}

function applyPresetAppearanceVSC(state) {
  applyPresetPaddingVSC(state);
  applyPresetRadiusVSC(state);
  applyPresetShadowVSC(state);
}

function applyPresetBgStateVSC(state) {
  if (state.customBgActive === '1' && customBgToggle) {
    customBgToggle.checked = true;
    if (customBgColor) {
      customBgColor.disabled = false;
      if (state.customBgColor) { customBgColor.value = state.customBgColor; applyBackground(state.customBgColor); }
    }
    return;
  }
  if (!state.activeBg) return;
  const swatches = Array.from(bgSwatchesContainer?.querySelectorAll('.swatch') ?? []);
  const match = swatches.find(s => s.style.background === state.activeBg || (state.activeBg === NONE_BG_VALUE && s.classList.contains('swatch-none')));
  if (match) {
    swatches.forEach(s => { s.classList.remove('active'); s.setAttribute('aria-checked', 'false'); s.setAttribute('tabindex', '-1'); });
    match.classList.add('active'); match.setAttribute('aria-checked', 'true'); match.setAttribute('tabindex', '0');
    applyBackground(state.activeBg);
  }
}

function applyPresetState(state) {
  if (!state) return;
  applyPresetEditorStateVSC(state);
  applyPresetFrameStateVSC(state);
  applyPresetAppearanceVSC(state);
  applyPresetBgStateVSC(state);
  syncTitlebarVisibility();
  applyCodeThemeMode();
  highlightCodeNow();
  updateLineNumbers();
  saveAllPreferences();
}

function renderPresets() {
  if (!presetList) return;
  presetList.innerHTML = '';
  const presets = loadPresets();
  if (presets.length === 0) {
    presetList.innerHTML = '<p style="font-size:12px;color:var(--text-dim);margin:0">No hay presets guardados.</p>';
    return;
  }
  presets.forEach((p, idx) => {
    const item = document.createElement('div');
    item.className = 'preset-item';
    item.innerHTML = `<button class="preset-load" title="Aplicar preset">${p.name}</button><button title="Eliminar" aria-label="Eliminar preset ${p.name}">🗑</button>`;
    item.querySelector('.preset-load').addEventListener('click', () => applyPresetState(p.state));
    item.querySelectorAll('button')[1].addEventListener('click', () => {
      const updated = loadPresets().filter((_, i) => i !== idx);
      savePresetsToStorage(updated);
      renderPresets();
    });
    presetList.appendChild(item);
  });
}

if (savePresetBtn) {
  savePresetBtn.addEventListener('click', () => {
    const name = presetNameInput?.value.trim();
    if (!name) { presetNameInput?.focus(); return; }
    const presets = loadPresets();
    presets.push({ name, state: buildCurrentPresetState() });
    savePresetsToStorage(presets);
    if (presetNameInput) presetNameInput.value = '';
    renderPresets();
  });
}

// ============ Arranque ============
init();
syncTitlebarVisibility();
renderPresets();

if (vscodeApi) {
  vscodeApi.postMessage({ type: 'ready' });
}

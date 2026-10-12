// ============ Almacenamiento tolerante a fallos ============
function readPreference(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writePreference(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // La app sigue funcionando aunque no se puedan persistir preferencias.
  }
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
    themeToggleBtn.setAttribute(
      'aria-label',
      theme === 'light' ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro'
    );
  }
}

applyTheme(getPreferredTheme());

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const current = document.documentElement.dataset.theme;
    applyTheme(current === 'light' ? 'dark' : 'light');
  });
}

// ============ Panel lateral: contraer / expandir ============
const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
const appMain = document.querySelector('.app-main');
const controlsPanel = document.getElementById('controlsPanel');
const SIDEBAR_STORAGE_KEY = 'codeshot-sidebar-collapsed';

function applySidebarState(collapsed) {
  if (!appMain || !sidebarToggleBtn) return;
  if (collapsed && controlsPanel?.contains(document.activeElement)) {
    sidebarToggleBtn.focus();
  }
  appMain.classList.toggle('sidebar-collapsed', collapsed);
  sidebarToggleBtn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
  sidebarToggleBtn.setAttribute(
    'aria-label',
    collapsed ? 'Expandir panel de configuración' : 'Contraer panel de configuración'
  );
  writePreference(SIDEBAR_STORAGE_KEY, collapsed ? '1' : '0');
}

if (sidebarToggleBtn) {
  const savedCollapsed = readPreference(SIDEBAR_STORAGE_KEY) === '1';
  applySidebarState(savedCollapsed);
  sidebarToggleBtn.addEventListener('click', () => {
    const isCollapsed = appMain.classList.contains('sidebar-collapsed');
    applySidebarState(!isCollapsed);
  });
}

// ============ Elementos ============
const codeInput = document.getElementById('codeInput');
const highlightCode = document.getElementById('highlightCode');
const highlightPre = document.getElementById('highlightPre');
const lineNumbers = document.getElementById('lineNumbers');
const codeArea = document.querySelector('.code-area');

const frameStyleSel = document.getElementById('frameStyle');
const windowTitleInput = document.getElementById('windowTitle');
const windowTitleText = document.getElementById('windowTitleText');
const showTitlebarChk = document.getElementById('showTitlebar');
const windowFrame = document.getElementById('windowFrame');
const titlebar = document.getElementById('titlebar');
const browserBar = document.getElementById('browserBar');
const browserUrl = document.getElementById('browserUrl');
const browserUrlText = document.getElementById('browserUrlText');
const clearCodeBtn = document.getElementById('clearCodeBtn');

const languageSel = document.getElementById('language');
const codeThemeSel = document.getElementById('codeTheme');
const prismThemeLink = document.getElementById('prismThemeLink');
const fontSizeInput = document.getElementById('fontSize');
const fontSizeVal = document.getElementById('fontSizeVal');
const showLineNumbersChk = document.getElementById('showLineNumbers');

const bgSwatchesContainer = document.getElementById('bgSwatches');
const customBgToggle = document.getElementById('customBgToggle');
const customBgColor = document.getElementById('customBgColor');

const paddingInput = document.getElementById('padding');
const paddingVal = document.getElementById('paddingVal');
const radiusInput = document.getElementById('radius');
const radiusVal = document.getElementById('radiusVal');
const shadowInput = document.getElementById('shadow');
const shadowVal = document.getElementById('shadowVal');
const showWatermarkChk = document.getElementById('showWatermark');
const watermark = document.getElementById('watermark');

const exportStage = document.getElementById('exportStage');
const downloadBtn = document.getElementById('downloadBtn');
const downloadStatus = document.getElementById('downloadStatus');

const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');
const zoomValText = document.getElementById('zoomVal');

// ============ Estado ============
let zoomLevel = 1;
const NONE_BG_VALUE = 'none';
const FRAME_CLASSES = ['frame-mac', 'frame-windows', 'frame-browser', 'frame-ubuntu', 'frame-none'];

const DEFAULT_CODE = [
  'function fibonacci(n) {',
  '  if (n <= 1) return n;',
  '  return fibonacci(n - 1) + fibonacci(n - 2);',
  '}',
  '',
  'console.log(fibonacci(10));',
  ''
].join('\n');

const PRISM_THEME_URLS = {
  tomorrow: 'vendor/prism/themes/prism-tomorrow.min.css',
  okaidia: 'vendor/prism/themes/prism-okaidia.min.css',
  dark: 'vendor/prism/themes/prism-dark.min.css',
  twilight: 'vendor/prism/themes/prism-twilight.min.css',
  funky: 'vendor/prism/themes/prism-funky.min.css',
  default: 'vendor/prism/themes/prism-default.min.css',
  coy: 'vendor/prism/themes/prism-coy.min.css',
  solarizedlight: 'vendor/prism/themes/prism-solarizedlight.min.css',
  onelight: 'vendor/prism/themes/prism-onelight.min.css'
};

const LIGHT_PRISM_THEMES = new Set(['default', 'coy', 'solarizedlight', 'onelight']);

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

// ============ Inicialización ============
codeInput.value = DEFAULT_CODE;
codeInput.placeholder = 'Escribe o pega tu código aquí…';

function init() {
  renderBgSwatches();
  highlightCodeNow();
  updateLineNumbers();
  updateWindowTitleText();
  applyCodeThemeMode();
}

function applyCodeThemeMode() {
  if (!codeArea) return;
  const isLight = LIGHT_PRISM_THEMES.has(codeThemeSel.value);
  codeArea.classList.toggle('light-editor', isLight);
}

// ============ Fondo: radiogroup accesible con roving tabindex ============
function renderBgSwatches() {
  BACKGROUNDS.forEach((bg, idx) => {
    const sw = document.createElement('div');
    sw.className = 'swatch';
    sw.style.background = bg;
    if (bg === '#ffffff' || bg === '#000000') {
      sw.classList.add('swatch-solid');
    }
    makeSwatchAccessible(sw, describeBackground(bg), idx === 0);
    if (idx === 0) sw.classList.add('active');
    sw.addEventListener('click', () => {
      selectSwatch(sw, bg);
      sw.focus();
    });
    bgSwatchesContainer.appendChild(sw);
  });

  const noneSwatch = document.createElement('div');
  noneSwatch.className = 'swatch swatch-none';
  noneSwatch.title = 'Sin fondo';
  noneSwatch.style.background = 'repeating-conic-gradient(#55565f 0% 25%, #35363f 0% 50%) 0 0 / 10px 10px';
  makeSwatchAccessible(noneSwatch, 'Sin fondo (transparente)', false);
  noneSwatch.addEventListener('click', () => {
    selectSwatch(noneSwatch, NONE_BG_VALUE);
    noneSwatch.focus();
  });
  bgSwatchesContainer.appendChild(noneSwatch);

  setupSwatchKeyboardNavigation();
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

// Navegación de teclado tipo radiogroup: flechas mueven selección y foco
// (roving tabindex), Home/End van al primero/último, Enter/Espacio activan.
function setupSwatchKeyboardNavigation() {
  bgSwatchesContainer.addEventListener('keydown', (e) => {
    const items = Array.from(bgSwatchesContainer.querySelectorAll('.swatch'));
    const currentIndex = items.indexOf(document.activeElement);
    if (currentIndex === -1) return;

    let nextIndex = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % items.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + items.length) % items.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = items.length - 1;
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      document.activeElement.click();
      return;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      items.forEach((item) => item.setAttribute('tabindex', '-1'));
      items[nextIndex].setAttribute('tabindex', '0');
      items[nextIndex].focus();
    }
  });
}

function selectSwatch(swatchEl, bgValue) {
  document.querySelectorAll('.swatch').forEach((s) => {
    s.classList.remove('active');
    s.setAttribute('aria-checked', 'false');
    s.setAttribute('tabindex', '-1');
  });
  swatchEl.classList.add('active');
  swatchEl.setAttribute('aria-checked', 'true');
  swatchEl.setAttribute('tabindex', '0');
  customBgToggle.checked = false;
  customBgColor.disabled = true;
  applyBackground(bgValue);
}

function applyBackground(bgValue) {
  if (bgValue === NONE_BG_VALUE) {
    exportStage.style.background = '';
    exportStage.classList.add('bg-none');
  } else {
    exportStage.classList.remove('bg-none');
    exportStage.style.background = bgValue;
  }
}

// ============ Resaltado de código en vivo ============
function highlightCodeNow() {
  const code = codeInput.value;
  highlightCode.textContent = code;
  highlightCode.className = 'language-' + languageSel.value;
  if (window.Prism) {
    Prism.highlightElement(highlightCode);
  }
  syncTextareaSize();
}

function syncTextareaSize() {
  codeInput.style.height = highlightPre.scrollHeight + 'px';
}

function updateLineNumbers() {
  if (!showLineNumbersChk.checked) {
    lineNumbers.classList.remove('visible');
    return;
  }
  lineNumbers.classList.add('visible');
  const lines = codeInput.value.split('\n').length;
  let text = '';
  for (let i = 1; i <= lines; i++) {
    text += i + '\n';
  }
  lineNumbers.textContent = text.trimEnd();
}

codeInput.addEventListener('input', () => {
  highlightCodeNow();
  updateLineNumbers();
});

codeInput.addEventListener('scroll', () => {
  highlightPre.scrollTop = codeInput.scrollTop;
  highlightPre.scrollLeft = codeInput.scrollLeft;
  lineNumbers.scrollTop = codeInput.scrollTop;
});

// ============ Limpiar código ============
clearCodeBtn.addEventListener('click', () => {
  codeInput.value = '';
  highlightCodeNow();
  updateLineNumbers();
  codeInput.focus();
});

// ============ Lenguaje y tema ============
languageSel.addEventListener('change', () => {
  highlightCodeNow();
  updateFileExtensionHint();
});

function updateFileExtensionHint() {
  const extMap = {
    javascript: '.js', typescript: '.ts', jsx: '.jsx', python: '.py',
    java: '.java', csharp: '.cs', cpp: '.cpp', c: '.c', go: '.go',
    rust: '.rs', php: '.php', ruby: '.rb', markup: '.html', css: '.css',
    json: '.json', bash: '.sh', sql: '.sql', yaml: '.yml', markdown: '.md'
  };
  const ext = extMap[languageSel.value] || '';
  if (!windowTitleInput.dataset.touched) {
    windowTitleInput.value = 'untitled' + ext;
    updateWindowTitleText();
  }
}

windowTitleInput.addEventListener('input', () => {
  windowTitleInput.dataset.touched = 'true';
  updateWindowTitleText();
});

function updateWindowTitleText() {
  const title = windowTitleInput.value || 'untitled';
  windowTitleText.textContent = title;
  if (browserUrlText) {
    browserUrlText.textContent = title;
  }
}

codeThemeSel.addEventListener('change', () => {
  prismThemeLink.href = PRISM_THEME_URLS[codeThemeSel.value];
  applyCodeThemeMode();
});

// ============ Tamaño de fuente ============
fontSizeInput.addEventListener('input', () => {
  const size = fontSizeInput.value + 'px';
  fontSizeVal.textContent = fontSizeInput.value;
  highlightPre.style.fontSize = size;
  codeInput.style.fontSize = size;
  lineNumbers.style.fontSize = size;
  syncTextareaSize();
  fontSizeInput.setAttribute('aria-valuenow', fontSizeInput.value);
  fontSizeInput.setAttribute('aria-valuetext', fontSizeInput.value + ' píxeles');
});

// ============ Números de línea ============
showLineNumbersChk.addEventListener('change', updateLineNumbers);

// ============ Marco de ventana ============
frameStyleSel.addEventListener('change', () => {
  windowFrame.classList.remove(...FRAME_CLASSES);
  windowFrame.classList.add('frame-' + frameStyleSel.value);
  syncTitlebarVisibility();
});

// Mantiene coherencia entre "Mostrar barra de título" y el marco de
// navegador: ese marco usa su propia barra (browser-bar) en lugar de la
// titlebar genérica, así que ambos elementos deben ocultarse/mostrarse
// juntos para evitar una barra de navegador huérfana.
function syncTitlebarVisibility() {
  const show = showTitlebarChk.checked;
  titlebar.style.display = show ? '' : 'none';
  if (browserBar) {
    const isBrowserFrame = windowFrame.classList.contains('frame-browser');
    browserBar.style.display = show && isBrowserFrame ? '' : 'none';
  }
}

showTitlebarChk.addEventListener('change', syncTitlebarVisibility);

// ============ Fondo personalizado ============
customBgToggle.addEventListener('change', () => {
  customBgColor.disabled = !customBgToggle.checked;
  if (customBgToggle.checked) {
    document.querySelectorAll('.swatch').forEach((s) => {
      s.classList.remove('active');
      s.setAttribute('aria-checked', 'false');
    });
    applyBackground(customBgColor.value);
  }
});

customBgColor.addEventListener('input', () => {
  if (customBgToggle.checked) {
    applyBackground(customBgColor.value);
  }
});

// ============ Apariencia: padding, radio, sombra, watermark ============
paddingInput.addEventListener('input', () => {
  paddingVal.textContent = paddingInput.value;
  exportStage.style.setProperty('--stage-padding', paddingInput.value + 'px');
  paddingInput.setAttribute('aria-valuenow', paddingInput.value);
  paddingInput.setAttribute('aria-valuetext', paddingInput.value + ' píxeles');
});

radiusInput.addEventListener('input', () => {
  radiusVal.textContent = radiusInput.value;
  windowFrame.style.borderRadius = radiusInput.value + 'px';
  radiusInput.setAttribute('aria-valuenow', radiusInput.value);
  radiusInput.setAttribute('aria-valuetext', radiusInput.value + ' píxeles');
});

shadowInput.addEventListener('input', () => {
  shadowVal.textContent = shadowInput.value;
  const intensity = shadowInput.value / 100;
  const blur = 50 * intensity;
  const spread = 25 * intensity;
  windowFrame.style.boxShadow = `0 ${spread}px ${blur + 20}px rgba(0,0,0,${0.7 * intensity})`;
  shadowInput.setAttribute('aria-valuenow', shadowInput.value);
  shadowInput.setAttribute('aria-valuetext', shadowInput.value + ' por ciento');
});

showWatermarkChk.addEventListener('change', () => {
  watermark.classList.toggle('visible', showWatermarkChk.checked);
});

// ============ Zoom (solo visual, no afecta exportación) ============
function applyZoom() {
  exportStage.style.transform = `scale(${zoomLevel})`;
  zoomValText.textContent = Math.round(zoomLevel * 100) + '%';
}

zoomInBtn.addEventListener('click', () => {
  zoomLevel = Math.min(2, zoomLevel + 0.1);
  applyZoom();
});

zoomOutBtn.addEventListener('click', () => {
  zoomLevel = Math.max(0.3, zoomLevel - 0.1);
  applyZoom();
});

// ============ Exportar como PNG ============

// Sanea el nombre de archivo derivado del título de la ventana:
// elimina separadores de ruta, caracteres de control y espacios/puntos
// finales; limita longitud y aplica un valor por defecto seguro.
// Caracteres de un único símbolo probados sin cuantificador +, evitando
// cualquier patrón de regex con riesgo de backtracking superlineal.
const INVALID_FILENAME_CHARS = new Set(['<', '>', ':', '"', '/', '\\', '|', '?', '*']);

function isTrailingSpaceOrDot(char) {
  return char === ' ' || char === '.';
}

function safeFilename(rawTitle = 'codeshot') {
  const title = rawTitle || 'codeshot';

  // Elimina la extensión final (si existe) localizando el último punto
  // manualmente, sin usar un patrón de regex.
  const lastDot = title.lastIndexOf('.');
  const withoutExt = lastDot > 0 ? title.slice(0, lastDot) : title;

  // Sustituye caracteres inválidos y de control recorriendo la cadena
  // carácter por carácter (sin regex), para eliminar por completo el
  // riesgo de backtracking superlineal con entradas adversariales.
  let sanitized = '';
  for (const char of withoutExt) {
    const code = char.codePointAt(0);
    const isControlChar = code <= 0x1f;
    sanitized += (isControlChar || INVALID_FILENAME_CHARS.has(char)) ? '-' : char;
  }

  // Recorta espacios y puntos finales de forma iterativa (sin regex).
  let end = sanitized.length;
  while (end > 0 && isTrailingSpaceOrDot(sanitized[end - 1])) {
    end -= 1;
  }
  const trimmed = sanitized.slice(0, end).trim().slice(0, 100);

  return (trimmed || 'codeshot') + '.png';
}

downloadBtn.addEventListener('click', async () => {
  if (typeof window.html2canvas !== 'function') {
    if (downloadStatus) {
      downloadStatus.textContent = 'No se pudo generar la imagen: la librería de exportación no está disponible.';
    }
    return;
  }

  const originalTransform = exportStage.style.transform;
  exportStage.style.transform = 'none'; // exportar sin zoom visual

  // Detectamos si el fondo activo es "Sin fondo" (patrón de ajedrez,
  // solo una guía visual en el editor). En ese caso, la imagen exportada
  // debe tener transparencia real (canal alfa), no el patrón ni blanco.
  const isNoneBg = exportStage.classList.contains('bg-none');

  codeInput.blur();
  downloadBtn.disabled = true;
  if (downloadStatus) downloadStatus.textContent = 'Generando imagen, por favor espera…';

  try {
    const canvas = await html2canvas(exportStage, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
      onclone: (clonedDoc) => {
        if (!isNoneBg) return;
        const clonedStage = clonedDoc.getElementById('exportStage');
        if (clonedStage) {
          clonedStage.classList.remove('bg-none');
          clonedStage.style.background = 'transparent';
          clonedStage.style.backgroundImage = 'none';
        }
      }
    });

    const link = document.createElement('a');
    const filename = safeFilename(windowTitleInput.value);
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    link.remove();
    if (downloadStatus) downloadStatus.textContent = `Imagen "${filename}" descargada correctamente.`;
  } catch (err) {
    console.error('Error al exportar la imagen:', err);
    if (downloadStatus) {
      downloadStatus.textContent = 'Ocurrió un error al generar la imagen. Intenta nuevamente.';
    }
  } finally {
    exportStage.style.transform = originalTransform;
    downloadBtn.disabled = false;
  }
});

// ============ Arranque ============
init();
syncTitlebarVisibility();

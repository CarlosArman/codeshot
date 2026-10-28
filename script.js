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
    window.indexedDB?.deleteDatabase('codeshot-library');
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
const backgroundImageInput = document.getElementById('backgroundImageInput');
const clearBackgroundImageBtn = document.getElementById('clearBackgroundImageBtn');
const backgroundImageStatus = document.getElementById('backgroundImageStatus');
let backgroundImageUrl = null;

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
const exportFeedback   = document.getElementById('exportFeedback');
const exportFeedbackText = document.getElementById('exportFeedbackText');
const retryExportBtn   = document.getElementById('retryExportBtn');
const saveIndicator    = document.getElementById('saveIndicator');
let retryExportAction = null;

const zoomInBtn        = document.getElementById('zoomIn');
const zoomOutBtn       = document.getElementById('zoomOut');
const zoomValText      = document.getElementById('zoomVal');
const resetZoomBtn     = document.getElementById('resetZoomBtn');
const fitScreenBtn     = document.getElementById('fitScreenBtn');
const centerStageBtn   = document.getElementById('centerStageBtn');
const previewArea      = document.querySelector('.preview-area');
const stageWrapper     = document.querySelector('.stage-wrapper');
const mobileMenuBtn    = document.getElementById('mobileMenuBtn');
const sidebarOverlay   = document.getElementById('sidebarOverlay');
const contextFileName  = document.getElementById('contextFileName');
const contextLanguage  = document.getElementById('contextLanguage');
const contextTheme     = document.getElementById('contextTheme');
const contextWidth     = document.getElementById('contextWidth');
const contextFormat    = document.getElementById('contextFormat');
const quickActions     = document.getElementById('quickActions');
const templatesBtn     = document.getElementById('templatesBtn');
const templateDialog   = document.getElementById('templateDialog');
const closeTemplatesBtn = document.getElementById('closeTemplatesBtn');
const templateGallery  = document.getElementById('templateGallery');
const templateFilters  = document.getElementById('templateFilters');
const onboardingDialog = document.getElementById('onboardingDialog');
const onboardingDestinations = document.getElementById('onboardingDestinations');
const skipOnboardingBtn = document.getElementById('skipOnboardingBtn');
const ONBOARDING_STORAGE_KEY = 'codeshot-onboarding-complete';

// ============ Componentes de interfaz ============
const SELECT_ICONS = {
  mac: '●', windows: '⊞', browser: '◉', ubuntu: '◒', none: '—',
  javascript: 'JS', typescript: 'TS', jsx: '⚛', python: 'PY', java: '☕',
  csharp: 'C#', cpp: 'C++', c: 'C', go: 'GO', rust: 'Rs', php: 'PHP',
  ruby: '♦', markup: '⌘', css: 'CSS', json: '{}', bash: '$', sql: '⌗',
  yaml: 'YML', markdown: 'MD', png: 'PNG', jpeg: 'JPG',
  'fira-code': 'ƒ', jetbrains: 'JB', cascadia: '⌁', 'source-code': 'SC', consolas: 'C',
  tomorrow: '◐', okaidia: '◒', dark: '●', twilight: '◑', funky: '✦',
  default: '☼', coy: '◌', solarizedlight: '☀', onelight: '◍'
};

function closeCustomSelects(except = null) {
  document.querySelectorAll('.select-shell.open').forEach(shell => {
    if (shell !== except) {
      shell.classList.remove('open');
      shell.querySelector('.select-shell__button')?.setAttribute('aria-expanded', 'false');
    }
  });
}

function syncCustomSelect(select) {
  const shell = select?.nextElementSibling;
  if (!shell?.classList.contains('select-shell')) return;
  const option = select.options[select.selectedIndex];
  shell.querySelector('.select-shell__value').textContent = option?.textContent ?? '';
  shell.querySelectorAll('.select-shell__option').forEach(item => {
    item.setAttribute('aria-selected', item.dataset.value === select.value ? 'true' : 'false');
  });
}

function enhanceSelects() {
  document.querySelectorAll('.control-group select').forEach(select => {
    if (select.dataset.enhanced) return;
    select.dataset.enhanced = 'true';
    const shell = document.createElement('div');
    const listId = `${select.id}-options`;
    shell.className = 'select-shell';
    shell.innerHTML = `<button class="select-shell__button" type="button" aria-haspopup="listbox" aria-expanded="false" aria-controls="${listId}"><span class="select-shell__value"></span><span class="select-shell__chevron" aria-hidden="true">⌄</span></button><div class="select-shell__list" id="${listId}" role="listbox"></div>`;
    const button = shell.querySelector('.select-shell__button');
    const list = shell.querySelector('.select-shell__list');

    [...select.options].forEach(option => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'select-shell__option';
      item.dataset.value = option.value;
      item.setAttribute('role', 'option');
      item.innerHTML = `<span aria-hidden="true">${SELECT_ICONS[option.value] ?? '•'}</span>&nbsp; ${option.textContent}`;
      item.addEventListener('click', () => {
        select.value = option.value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        syncCustomSelect(select);
        closeCustomSelects();
        button.focus();
      });
      list.appendChild(item);
    });

    button.addEventListener('click', () => {
      const willOpen = !shell.classList.contains('open');
      closeCustomSelects(shell);
      shell.classList.toggle('open', willOpen);
      button.setAttribute('aria-expanded', String(willOpen));
      if (willOpen) list.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
    });
    button.addEventListener('keydown', event => {
      const items = [...list.querySelectorAll('.select-shell__option')];
      const current = items.findIndex(item => item.dataset.value === select.value);
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const next = event.key === 'ArrowDown' ? (current + 1) % items.length : (current - 1 + items.length) % items.length;
        select.value = items[next].dataset.value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        syncCustomSelect(select);
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        button.click();
      } else if (event.key === 'Escape') {
        closeCustomSelects();
      }
    });
    select.after(shell);
    select.addEventListener('change', () => syncCustomSelect(select));
    syncCustomSelect(select);
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.select-shell')) closeCustomSelects();
  });
}

function setupAccordions() {
  const storageKey = 'codeshot-collapsed-panels';
  let collapsed = [];
  try { collapsed = JSON.parse(readPreference(storageKey) ?? '[]'); } catch { collapsed = []; }

  document.querySelectorAll('.control-group').forEach((group, index) => {
    const heading = group.querySelector(':scope > h2');
    if (!heading || group.querySelector('.control-group-content')) return;
    const content = document.createElement('div');
    const inner = document.createElement('div');
    const contentId = `control-group-content-${index}`;
    content.className = 'control-group-content';
    content.id = contentId;
    while (heading.nextSibling) inner.appendChild(heading.nextSibling);
    content.appendChild(inner);
    group.appendChild(content);
    heading.setAttribute('role', 'button');
    heading.setAttribute('tabindex', '0');
    heading.setAttribute('aria-controls', contentId);
    const groupId = heading.id || `group-${index}`;
    const setState = isCollapsed => {
      group.classList.toggle('collapsed', isCollapsed);
      heading.setAttribute('aria-expanded', String(!isCollapsed));
      collapsed = isCollapsed ? [...new Set([...collapsed, groupId])] : collapsed.filter(id => id !== groupId);
      writePreference(storageKey, JSON.stringify(collapsed));
    };
    setState(collapsed.includes(groupId));
    heading.addEventListener('click', () => setState(!group.classList.contains('collapsed')));
    heading.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        heading.click();
      }
    });
  });
}

function setMobileSidebar(open) {
  if (!appMain) return;
  appMain.classList.toggle('sidebar-mobile-open', open);
  mobileMenuBtn?.setAttribute('aria-expanded', String(open));
  sidebarOverlay?.setAttribute('aria-hidden', String(!open));
  document.body.style.overflow = open ? 'hidden' : '';
}

function updateRangeProgress(input) {
  const min = Number(input.min || 0);
  const max = Number(input.max || 100);
  const progress = ((Number(input.value) - min) / (max - min)) * 100;
  input.style.setProperty('--range-progress', `${progress}%`);
}

function updateWorkspaceContext() {
  const exportFormat = document.getElementById('exportFormat');
  if (contextFileName) contextFileName.textContent = windowTitleInput?.value || 'untitled';
  if (contextLanguage) contextLanguage.textContent = languageSel?.options[languageSel.selectedIndex]?.textContent || 'Código';
  if (contextTheme) contextTheme.textContent = codeThemeSel?.options[codeThemeSel.selectedIndex]?.textContent || 'Tema';
  if (contextWidth) contextWidth.textContent = `${frameWidthInput?.value || 680}px`;
  if (contextFormat) contextFormat.textContent = (exportFormat?.value || 'png').toUpperCase();
}

function revealControlGroup(groupId, focusId) {
  const heading = document.getElementById(groupId);
  const group = heading?.closest('.control-group');
  if (!heading || !group) return;
  if (group.classList.contains('collapsed')) heading.click();
  group.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  if (focusId) setTimeout(() => document.getElementById(focusId)?.focus({ preventScroll: true }), 220);
}

const TEMPLATE_STYLES = {
  linkedin: { frameWidth: 920, padding: 72, radius: 16, shadow: 65, background: 'linear-gradient(135deg, #312e81, #7c3aed 55%, #c4b5fd)' },
  github: { frameWidth: 860, padding: 56, radius: 10, shadow: 48, background: 'linear-gradient(135deg, #111827, #374151)' },
  blog: { frameWidth: 1040, padding: 84, radius: 18, shadow: 60, background: 'linear-gradient(135deg, #f97316, #fb7185)' },
  slide: { frameWidth: 1140, padding: 88, radius: 12, shadow: 70, background: 'linear-gradient(135deg, #0f766e, #22d3ee)' },
  social: { frameWidth: 1000, padding: 72, radius: 14, shadow: 62, background: 'linear-gradient(135deg, #2563eb, #60a5fa)' },
  story: { frameWidth: 580, padding: 74, radius: 18, shadow: 65, background: 'linear-gradient(180deg, #ec4899, #7c3aed 55%, #1e1b4b)' }
};

function applyTemplate(name) {
  const template = TEMPLATE_STYLES[name];
  if (!template) return;
  frameWidthInput.value = template.frameWidth;
  paddingInput.value = template.padding;
  radiusInput.value = template.radius;
  shadowInput.value = template.shadow;
  [frameWidthInput, paddingInput, radiusInput, shadowInput].forEach(input => input.dispatchEvent(new Event('input', { bubbles: true })));
  applyBackground(template.background);
  document.querySelectorAll('.template-card').forEach(card => card.classList.toggle('is-featured', card.dataset.template === name));
  saveAllPreferences();
  updateWorkspaceContext();
  templateDialog?.close();
  requestAnimationFrame(fitStageToViewport);
}

function completeOnboarding() {
  writePreference(ONBOARDING_STORAGE_KEY, '1');
  onboardingDialog?.close();
}

function setupOnboarding() {
  if (readPreference(ONBOARDING_STORAGE_KEY) !== '1') {
    requestAnimationFrame(() => onboardingDialog?.showModal());
  }
  onboardingDestinations?.addEventListener('click', event => {
    const destination = event.target.closest('button[data-template]');
    if (!destination) return;
    applyTemplate(destination.dataset.template);
    completeOnboarding();
  });
  skipOnboardingBtn?.addEventListener('click', completeOnboarding);
}

function applyTemplateFilter(filter) {
  templateFilters?.querySelectorAll('button[data-template-filter]').forEach(button => {
    const selected = button.dataset.templateFilter === filter;
    button.classList.toggle('is-active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  templateGallery?.querySelectorAll('.template-card').forEach(card => {
    const categories = (card.dataset.templateCategory ?? '').split(' ');
    card.hidden = filter !== 'all' && !categories.includes(filter);
  });
}

function setupProductInteractions() {
  setupOnboarding();
  quickActions?.addEventListener('click', event => {
    const action = event.target.closest('button[data-target]');
    if (action) revealControlGroup(action.dataset.target, action.dataset.focus);
  });
  templatesBtn?.addEventListener('click', () => templateDialog?.showModal());
  closeTemplatesBtn?.addEventListener('click', () => templateDialog?.close());
  templateGallery?.addEventListener('click', event => {
    const card = event.target.closest('.template-card');
    if (card) applyTemplate(card.dataset.template);
  });
  templateFilters?.addEventListener('click', event => {
    const filter = event.target.closest('button[data-template-filter]');
    if (filter) applyTemplateFilter(filter.dataset.templateFilter);
  });
  templateDialog?.addEventListener('click', event => {
    if (event.target === templateDialog) templateDialog.close();
  });
}

function setupInterfaceComponents() {
  setupAccordions();
  enhanceSelects();
  setupProductInteractions();
  document.querySelectorAll('#windowTitle, #language, #codeTheme, #frameWidth, #exportFormat').forEach(element => {
    element.addEventListener('input', updateWorkspaceContext);
    element.addEventListener('change', updateWorkspaceContext);
  });
  updateWorkspaceContext();
  document.querySelectorAll('input[type="range"]').forEach(input => {
    updateRangeProgress(input);
    input.addEventListener('input', () => updateRangeProgress(input));
  });
  mobileMenuBtn?.addEventListener('click', () => setMobileSidebar(!appMain?.classList.contains('sidebar-mobile-open')));
  sidebarOverlay?.addEventListener('click', () => setMobileSidebar(false));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) setMobileSidebar(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeCustomSelects();
      setMobileSidebar(false);
      return;
    }
    const target = event.target;
    const isTyping = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement || target?.isContentEditable;
    if (!isTyping && event.key.toLowerCase() === 't' && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      templateDialog?.showModal();
    }
  });
}

// ============ Estado ============
let zoomLevel = 1;
let lastLineCount = -1;
let highlightDebounceTimer = null;
let syncRafId = null;

const NONE_BG_VALUE = 'none';
const FRAME_CLASSES = new Set(['frame-mac', 'frame-windows', 'frame-browser', 'frame-ubuntu', 'frame-none']);

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
  'fira-code':   "'Fira Code', 'Consolas', monospace",
  'jetbrains':   "'JetBrains Mono', 'Consolas', monospace",
  'cascadia':    "'Cascadia Code', 'Consolas', monospace",
  'source-code': "'Source Code Pro', 'Consolas', monospace",
  'consolas':    "'Consolas', 'Courier New', monospace"
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
  'linear-gradient(135deg, rgba(255,255,255,.32), rgba(255,255,255,.04)), linear-gradient(135deg, #1e3a8a, #7c3aed)',
  'radial-gradient(circle at 18% 22%, #f472b6 0 9%, transparent 30%), radial-gradient(circle at 80% 16%, #60a5fa 0 12%, transparent 35%), radial-gradient(circle at 52% 78%, #a78bfa 0 16%, #111827 58%)',
  'repeating-linear-gradient(45deg, rgba(255,255,255,.07) 0 1px, transparent 1px 7px), linear-gradient(135deg, #0f172a, #334155)',
  'conic-gradient(from 210deg at 50% 50%, #ec4899, #7c3aed, #0ea5e9, #ec4899)',
  '#ffffff',
  '#000000'
];

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
  if (activeSwatch) writePreference('codeshot-activeBg', activeSwatch.style.background || NONE_BG_VALUE);
  if (windowTitleInput?.dataset.touched) {
    writePreference('codeshot-windowTitle', windowTitleInput.value);
    writePreference('codeshot-windowTitleTouched', '1');
  }
}

function applyFontSizeToUI(fontSize) {
  if (!fontSizeInput) return;
  fontSizeInput.value = fontSize;
  if (fontSizeVal) fontSizeVal.textContent = fontSize;
  const s = fontSize + 'px';
  if (highlightPre) highlightPre.style.fontSize = s;
  if (codeInput) codeInput.style.fontSize = s;
  if (lineNumbers) lineNumbers.style.fontSize = s;
}

function restoreCodeEditorPrefs() {
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

function restoreFrameStylePref() {
  const frameStyle = readPreference('codeshot-frameStyle');
  if (frameStyle && frameStyleSel && FRAME_CLASSES.has('frame-' + frameStyle)) {
    frameStyleSel.value = frameStyle;
    if (windowFrame) {
      windowFrame.classList.remove(...FRAME_CLASSES);
      windowFrame.classList.add('frame-' + frameStyle);
    }
  }
}

function restoreFramePrefs() {
  restoreFrameStylePref();
  const frameWidth = readPreference('codeshot-frameWidth');
  if (frameWidth && frameWidthInput) {
    frameWidthInput.value = frameWidth;
    if (frameWidthVal) frameWidthVal.textContent = frameWidth;
    if (windowFrame) windowFrame.style.setProperty('--frame-width', frameWidth + 'px');
  }
  const showTitlebar = readPreference('codeshot-showTitlebar');
  if (showTitlebar !== null && showTitlebarChk) showTitlebarChk.checked = showTitlebar === '1';
  const showLineNums = readPreference('codeshot-showLineNumbers');
  if (showLineNums !== null && showLineNumbersChk) showLineNumbersChk.checked = showLineNums === '1';
  const lineStart = readPreference('codeshot-lineStart');
  if (lineStart && lineStartInput) lineStartInput.value = lineStart;
}

function applyBoxShadow(intensity) {
  if (windowFrame) windowFrame.style.boxShadow = `0 ${25*intensity}px ${50*intensity+20}px rgba(0,0,0,${0.7*intensity})`;
}

function restoreWatermarkPrefs() {
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

function restorePaddingPref() {
  const padding = readPreference('codeshot-padding');
  if (!padding || !paddingInput) { return; }
  paddingInput.value = padding;
  if (paddingVal) { paddingVal.textContent = padding; }
  if (exportStage) { exportStage.style.setProperty('--stage-padding', padding + 'px'); }
}

function restoreRadiusPref() {
  const radius = readPreference('codeshot-radius');
  if (!radius || !radiusInput) { return; }
  radiusInput.value = radius;
  if (radiusVal) { radiusVal.textContent = radius; }
  if (windowFrame) { windowFrame.style.borderRadius = radius + 'px'; }
}

function restoreShadowPref() {
  const shadow = readPreference('codeshot-shadow');
  if (!shadow || !shadowInput) { return; }
  shadowInput.value = shadow;
  if (shadowVal) { shadowVal.textContent = shadow; }
  applyBoxShadow(shadow / 100);
}

function restoreCustomBgPref() {
  const customBgActive = readPreference('codeshot-customBgActive');
  if (customBgActive !== '1' || !customBgToggle) { return; }
  customBgToggle.checked = true;
  if (customBgColor) { customBgColor.disabled = false; }
  const c = readPreference('codeshot-customBgColor');
  if (c && customBgColor) { customBgColor.value = c; applyBackground(c); }
}

function restoreVisualPrefs() {
  restorePaddingPref();
  restoreRadiusPref();
  restoreShadowPref();
  restoreWatermarkPrefs();
  restoreCustomBgPref();
}

function restoreAllPreferences() {
  restoreCodeEditorPrefs();
  restoreFramePrefs();
  restoreVisualPrefs();
  const savedTitle = readPreference('codeshot-windowTitle');
  if (readPreference('codeshot-windowTitleTouched') === '1' && savedTitle && windowTitleInput) {
    windowTitleInput.value = savedTitle;
    windowTitleInput.dataset.touched = 'true';
    updateWindowTitleText();
  }
}

function init() {
  renderBgSwatches();
  restoreAllPreferences();
  const template = CODE_TEMPLATES[languageSel?.value] || CODE_TEMPLATES.javascript;
  if (codeInput && !codeInput.value) codeInput.value = template;
  if (codeInput) codeInput.placeholder = 'Escribe o pega tu código aquí…';
  highlightCodeNow();
  updateLineNumbers();
  updateWindowTitleText();
  applyCodeThemeMode();
}

function applyCodeThemeMode() {
  if (!codeArea) return;
  codeArea.classList.toggle('light-editor', LIGHT_PRISM_THEMES.has(codeThemeSel?.value ?? 'tomorrow'));
}

function applyFontFamily(key) {
  const family = FONT_FAMILIES[key] || FONT_FAMILIES['fira-code'];
  [highlightPre, codeInput, lineNumbers].forEach(el => { if (el) el.style.fontFamily = family; });
}

function renderBgSwatches() {
  if (!bgSwatchesContainer) return;
  BACKGROUNDS.forEach((bg, idx) => {
    const sw = document.createElement('div');
    sw.className = 'swatch';
    sw.style.background = bg;
    if (bg === '#ffffff' || bg === '#000000') sw.classList.add('swatch-solid');
    let swatchLabel = 'Fondo degradado de color';
    if (idx === 10) swatchLabel = 'Fondo Glass azul violeta';
    else if (idx === 11) swatchLabel = 'Fondo Mesh rosa y azul';
    else if (idx === 12) swatchLabel = 'Fondo Noise oscuro';
    else if (idx === 13) swatchLabel = 'Fondo Abstract cónico';
    else if (bg === '#ffffff') { swatchLabel = 'Fondo blanco sólido'; }
    else if (bg === '#000000') { swatchLabel = 'Fondo negro sólido'; }
    makeSwatchAccessible(sw, swatchLabel, idx === 0);
    if (idx === 0) sw.classList.add('active');
    sw.addEventListener('click', () => { selectSwatch(sw, bg); sw.focus(); });
    bgSwatchesContainer.appendChild(sw);
  });
  const noneSwatch = document.createElement('div');
  noneSwatch.className = 'swatch swatch-none';
  noneSwatch.style.background = 'repeating-conic-gradient(#55565f 0% 25%, #35363f 0% 50%) 0 0 / 10px 10px';
  makeSwatchAccessible(noneSwatch, 'Sin fondo (transparente)', false);
  noneSwatch.addEventListener('click', () => { selectSwatch(noneSwatch, NONE_BG_VALUE); noneSwatch.focus(); });
  bgSwatchesContainer.appendChild(noneSwatch);
  setupSwatchKeyboardNavigation();
  const savedBg = readPreference('codeshot-activeBg');
  if (savedBg && readPreference('codeshot-customBgActive') !== '1') {
    const swatches = Array.from(bgSwatchesContainer.querySelectorAll('.swatch'));
    const match = swatches.find(s => s.style.background === savedBg || (savedBg === NONE_BG_VALUE && s.classList.contains('swatch-none')));
    if (match) { swatches.forEach(s => { s.classList.remove('active'); s.setAttribute('aria-checked','false'); s.setAttribute('tabindex','-1'); }); match.classList.add('active'); match.setAttribute('aria-checked','true'); match.setAttribute('tabindex','0'); applyBackground(savedBg); }
  }
}

function makeSwatchAccessible(el, label, isChecked) {
  el.setAttribute('role','radio'); el.setAttribute('tabindex', isChecked?'0':'-1');
  el.setAttribute('aria-label', label); el.setAttribute('aria-checked', isChecked?'true':'false');
}

function setupSwatchKeyboardNavigation() {
  if (!bgSwatchesContainer) return;
  bgSwatchesContainer.addEventListener('keydown', (e) => {
    const items = Array.from(bgSwatchesContainer.querySelectorAll('.swatch'));
    const ci = items.indexOf(document.activeElement);
    if (ci === -1) return;
    let ni = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') ni = (ci+1)%items.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') ni = (ci-1+items.length)%items.length;
    else if (e.key === 'Home') ni = 0;
    else if (e.key === 'End') ni = items.length-1;
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); document.activeElement.click(); return; }
    if (ni !== null) { e.preventDefault(); items.forEach(i => i.setAttribute('tabindex','-1')); items[ni].setAttribute('tabindex','0'); items[ni].focus(); }
  });
}

function clearBackgroundImage() {
  if (!backgroundImageUrl) return;
  URL.revokeObjectURL(backgroundImageUrl);
  backgroundImageUrl = null;
  if (backgroundImageInput) backgroundImageInput.value = '';
  if (clearBackgroundImageBtn) clearBackgroundImageBtn.disabled = true;
  if (backgroundImageStatus) backgroundImageStatus.textContent = '';
  exportStage?.classList.remove('bg-image');
}

function applyBackgroundImage(file) {
  const supportedTypes = new Set(['image/png', 'image/jpeg', 'image/webp']);
  if (!file || !supportedTypes.has(file.type) || file.size > 8 * 1024 * 1024) {
    if (backgroundImageStatus) backgroundImageStatus.textContent = 'Selecciona una imagen PNG, JPG o WEBP de hasta 8 MB.';
    return;
  }
  clearBackgroundImage();
  backgroundImageUrl = URL.createObjectURL(file);
  if (exportStage) {
    exportStage.classList.remove('bg-none');
    exportStage.classList.add('bg-image');
    exportStage.style.backgroundImage = `url("${backgroundImageUrl}")`;
    exportStage.style.backgroundSize = 'cover';
    exportStage.style.backgroundPosition = 'center';
  }
  if (customBgToggle) customBgToggle.checked = false;
  if (customBgColor) customBgColor.disabled = true;
  document.querySelectorAll('.swatch').forEach(s => { s.classList.remove('active'); s.setAttribute('aria-checked', 'false'); });
  if (clearBackgroundImageBtn) clearBackgroundImageBtn.disabled = false;
  if (backgroundImageStatus) backgroundImageStatus.textContent = `${file.name} aplicado temporalmente a esta sesión.`;
  requestAnimationFrame(updateExportPreflight);
}

function selectSwatch(el, bgValue) {
  clearBackgroundImage();
  document.querySelectorAll('.swatch').forEach(s => { s.classList.remove('active'); s.setAttribute('aria-checked','false'); s.setAttribute('tabindex','-1'); });
  el.classList.add('active'); el.setAttribute('aria-checked','true'); el.setAttribute('tabindex','0');
  if (customBgToggle) customBgToggle.checked = false;
  if (customBgColor) customBgColor.disabled = true;
  applyBackground(bgValue); saveAllPreferences();
}

function applyBackground(bgValue) {
  if (!exportStage) return;
  if (backgroundImageUrl) clearBackgroundImage();
  exportStage.classList.remove('bg-image');
  exportStage.style.backgroundImage = '';
  if (bgValue === NONE_BG_VALUE) { exportStage.style.background = ''; exportStage.classList.add('bg-none'); }
  else { exportStage.classList.remove('bg-none'); exportStage.style.background = bgValue; }
  updateWatermarkColor();
  requestAnimationFrame(updateExportPreflight);
}

function updateWatermarkColor() {
  if (!watermark || !showWatermarkChk?.checked) return;
  const bg = exportStage?.style.background || '';
  const isLight = bg.includes('#ffffff') || bg.includes('255,255,255') || bg.includes('fecfef') || bg.includes('fbc2eb');
  watermark.style.color = isLight ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.75)';
}

function highlightCodeNow() {
  const code = codeInput?.value ?? '';
  if (highlightCode) { highlightCode.textContent = code; highlightCode.className = 'language-' + (languageSel?.value ?? 'javascript'); if (window.Prism) Prism.highlightElement(highlightCode); }
  scheduleSyncTextareaSize();
  updateCodeStats();
}

function scheduleHighlight() { clearTimeout(highlightDebounceTimer); highlightDebounceTimer = setTimeout(highlightCodeNow, 80); }

function scheduleSyncTextareaSize() {
  if (syncRafId) cancelAnimationFrame(syncRafId);
  syncRafId = requestAnimationFrame(() => { if (codeInput && highlightPre) { codeInput.style.height = highlightPre.scrollHeight+'px'; codeInput.style.width = highlightPre.scrollWidth+'px'; } syncRafId = null; });
}

function updateCodeStats() {
  const code = codeInput?.value ?? '';
  if (codeStatsEl) codeStatsEl.textContent = `${code.split('\n').length} líneas · ${code.length} caracteres`;
  requestAnimationFrame(updateExportPreflight);
}

function updateLineNumbers() {
  if (!showLineNumbersChk?.checked) { lineNumbers?.classList.remove('visible'); return; }
  lineNumbers?.classList.add('visible');
  const lines = (codeInput?.value ?? '').split('\n').length;
  if (lines === lastLineCount) return;
  lastLineCount = lines;
  const start = Number.parseInt(lineStartInput?.value ?? '1', 10) || 1;
  let text = '';
  for (let i = start; i < start + lines; i++) text += i + '\n';
  if (lineNumbers) lineNumbers.textContent = text.trimEnd();
}

function detectLanguageByPrefix(f) {
  if (f.startsWith('def ') || (f.startsWith('import ') && f.includes(':')) || (f.startsWith('class ') && f.includes(':'))) return 'python';
  if (f.startsWith('fn ') || f.startsWith('use ')) return 'rust';
  if (f.startsWith('<?php')) return 'php';
  if (f.startsWith('package ') && f.includes('import "')) return 'go';
  if (f.startsWith('#include')) return 'cpp';
  if (f.startsWith('public class ')) return 'java';
  if (f.startsWith('using System')) return 'csharp';
  if (f.startsWith('import React')) return 'jsx';
  if (f.startsWith('SELECT ') || f.startsWith('CREATE ') || f.startsWith('INSERT ')) return 'sql';
  if (f.startsWith('{') || f.startsWith('[')) return 'json';
  if (f.startsWith('#!/')) return 'bash';
  if (f.startsWith('<!DOCTYPE') || f.startsWith('<html')) return 'markup';
  return null;
}

function detectLanguageBySuffix(f) {
  if (f.startsWith('# ') || f.startsWith('## ')) return 'markdown';
  if (f.includes('println!')) return 'rust';
  if (f.includes('int main(') && f.includes('{')) return 'cpp';
  if (f.includes('System.out.println')) return 'java';
  if (f.includes('Console.WriteLine')) return 'csharp';
  if (f.includes('<div')) return 'jsx';
  if (/^\w+:\s/.test(f)) return 'yaml';
  return null;
}

function detectLanguage(code) {
  if (!code) return null;
  const f = code.trimStart();
  return detectLanguageByPrefix(f) ?? detectLanguageBySuffix(f);
}

if (codeInput) {
  codeInput.addEventListener('input', () => { scheduleHighlight(); updateLineNumbers(); });
  codeInput.addEventListener('paste', () => setTimeout(() => { const d = detectLanguage(codeInput.value); if (d && languageSel && [...languageSel.options].some(o => o.value === d)) { languageSel.value = d; saveAllPreferences(); } }, 0));
  codeInput.addEventListener('scroll', () => {
    if (highlightPre) { highlightPre.scrollTop = codeInput.scrollTop; highlightPre.scrollLeft = codeInput.scrollLeft; }
    if (lineNumbers) lineNumbers.scrollTop = codeInput.scrollTop;
  });
  codeInput.addEventListener('dragover', (e) => { e.preventDefault(); codeInput.classList.add('drag-over'); });
  codeInput.addEventListener('dragleave', () => codeInput.classList.remove('drag-over'));
  codeInput.addEventListener('drop', (e) => {
    e.preventDefault(); codeInput.classList.remove('drag-over');
    const file = e.dataTransfer?.files?.[0]; if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    const extMap = { js:'javascript', ts:'typescript', jsx:'jsx', tsx:'jsx', py:'python', java:'java', cs:'csharp', cpp:'cpp', c:'c', go:'go', rs:'rust', php:'php', rb:'ruby', html:'markup', htm:'markup', css:'css', json:'json', sh:'bash', sql:'sql', yml:'yaml', yaml:'yaml', md:'markdown' };
    void file.text().then(text => {
      codeInput.value = text;
      const lang = extMap[ext] ?? detectLanguage(codeInput.value) ?? languageSel?.value ?? 'javascript';
      if (languageSel && [...languageSel.options].some(o => o.value === lang)) languageSel.value = lang;
      if (!windowTitleInput?.dataset.touched && windowTitleInput) { windowTitleInput.value = file.name; updateWindowTitleText(); }
      highlightCodeNow(); updateLineNumbers(); saveAllPreferences();
    });
  });
}

if (clearCodeBtn) {
  clearCodeBtn.addEventListener('click', () => {
    if (codeInput) { codeInput.value = ''; }
    highlightCodeNow();
    updateLineNumbers();
    codeInput?.focus();
  });
}
if (resetDefaultsBtn) {
  resetDefaultsBtn.addEventListener('click', () => {
    if (confirm('¿Restaurar todos los ajustes a los valores por defecto?')) { clearAllPreferences(); location.reload(); }
  });
}

if (languageSel) {
  languageSel.addEventListener('change', () => {
    highlightCodeNow();
    const extMap = { javascript:'.js', typescript:'.ts', jsx:'.jsx', python:'.py', java:'.java', csharp:'.cs', cpp:'.cpp', c:'.c', go:'.go', rust:'.rs', php:'.php', ruby:'.rb', markup:'.html', css:'.css', json:'.json', bash:'.sh', sql:'.sql', yaml:'.yml', markdown:'.md' };
    const ext = extMap[languageSel.value] ?? '';
    if (!windowTitleInput?.dataset.touched && windowTitleInput) {
      windowTitleInput.value = 'untitled' + ext;
      updateWindowTitleText();
    }
    saveAllPreferences();
  });
}

if (windowTitleInput) windowTitleInput.addEventListener('input', () => { windowTitleInput.dataset.touched = 'true'; updateWindowTitleText(); saveAllPreferences(); });

function updateWindowTitleText() {
  const title = windowTitleInput?.value || 'untitled';
  if (windowTitleText) windowTitleText.textContent = title;
  if (browserUrlText) browserUrlText.textContent = title;
}

if (codeThemeSel) {
  codeThemeSel.addEventListener('change', () => {
    if (prismThemeLink) { prismThemeLink.href = PRISM_THEME_URLS[codeThemeSel.value]; }
    applyCodeThemeMode();
    saveAllPreferences();
  });
}
if (fontFamilySel) {
  fontFamilySel.addEventListener('change', () => {
    applyFontFamily(fontFamilySel.value);
    scheduleSyncTextareaSize();
    saveAllPreferences();
    updateExportPreflight();
  });
}

if (fontSizeInput) {
  fontSizeInput.addEventListener('input', () => {
    const size = fontSizeInput.value + 'px';
    if (fontSizeVal) fontSizeVal.textContent = fontSizeInput.value;
    if (highlightPre) highlightPre.style.fontSize = size;
    if (codeInput) codeInput.style.fontSize = size;
    if (lineNumbers) lineNumbers.style.fontSize = size;
    scheduleSyncTextareaSize();
    fontSizeInput.setAttribute('aria-valuenow', fontSizeInput.value);
    saveAllPreferences();
  });
}

if (showLineNumbersChk) showLineNumbersChk.addEventListener('change', () => { lastLineCount = -1; updateLineNumbers(); saveAllPreferences(); });
if (lineStartInput) lineStartInput.addEventListener('input', () => { lastLineCount = -1; updateLineNumbers(); saveAllPreferences(); });

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
    if (frameWidthVal) { frameWidthVal.textContent = w; }
    if (windowFrame) { windowFrame.style.setProperty('--frame-width', w + 'px'); }
    saveAllPreferences();
  });
}

function syncTitlebarVisibility() {
  const show = showTitlebarChk?.checked ?? true;
  if (titlebar) titlebar.style.display = show ? '' : 'none';
  if (browserBar) { const isBrowser = windowFrame?.classList.contains('frame-browser'); browserBar.style.display = show && isBrowser ? '' : 'none'; }
  saveAllPreferences();
}
if (showTitlebarChk) showTitlebarChk.addEventListener('change', syncTitlebarVisibility);

if (customBgToggle) {
  customBgToggle.addEventListener('change', () => {
    if (customBgColor) { customBgColor.disabled = !customBgToggle.checked; }
    if (customBgToggle.checked) {
      document.querySelectorAll('.swatch').forEach(s => { s.classList.remove('active'); s.setAttribute('aria-checked', 'false'); });
      applyBackground(customBgColor?.value ?? '#6a11cb');
    }
    saveAllPreferences();
  });
}
if (customBgColor) {
  customBgColor.addEventListener('input', () => {
    if (customBgToggle?.checked) { applyBackground(customBgColor.value); }
    saveAllPreferences();
  });
}
backgroundImageInput?.addEventListener('change', event => applyBackgroundImage(event.target.files?.[0]));
clearBackgroundImageBtn?.addEventListener('click', () => {
  clearBackgroundImage();
  applyBackground(bgSwatchesContainer?.querySelector('.swatch.active')?.style.background || BACKGROUNDS[0]);
});
window.addEventListener('beforeunload', clearBackgroundImage);

if (paddingInput) {
  paddingInput.addEventListener('input', () => {
    if (paddingVal) paddingVal.textContent = paddingInput.value;
    if (exportStage) exportStage.style.setProperty('--stage-padding', paddingInput.value + 'px');
    saveAllPreferences();
  });
}
if (radiusInput) {
  radiusInput.addEventListener('input', () => {
    if (radiusVal) radiusVal.textContent = radiusInput.value;
    if (windowFrame) windowFrame.style.borderRadius = radiusInput.value + 'px';
    saveAllPreferences();
  });
}
if (shadowInput) {
  shadowInput.addEventListener('input', () => {
    if (shadowVal) shadowVal.textContent = shadowInput.value;
    applyBoxShadow(shadowInput.value / 100);
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

function applyZoom() {
  if (exportStage) { exportStage.style.transform = `scale(${zoomLevel})`; }
  if (zoomValText) { zoomValText.textContent = Math.round(zoomLevel * 100) + '%'; }
}

function fitStageToViewport() {
  if (!exportStage || !previewArea) return;
  const maxWidth = Math.max(previewArea.clientWidth - 94, 180);
  const maxHeight = Math.max(previewArea.clientHeight - 132, 180);
  const widthRatio = maxWidth / exportStage.offsetWidth;
  const heightRatio = maxHeight / exportStage.offsetHeight;
  zoomLevel = Math.max(0.3, Math.min(1, widthRatio, heightRatio));
  applyZoom();
}

function centerStage() {
  stageWrapper?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
  requestAnimationFrame(() => {
    if (!previewArea || !stageWrapper) return;
    previewArea.scrollLeft = Math.max(0, (stageWrapper.scrollWidth - previewArea.clientWidth) / 2);
  });
}

if (zoomInBtn) zoomInBtn.addEventListener('click', () => { zoomLevel = Math.min(2, zoomLevel + 0.1); applyZoom(); });
if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => { zoomLevel = Math.max(0.3, zoomLevel - 0.1); applyZoom(); });
if (resetZoomBtn) resetZoomBtn.addEventListener('click', () => { zoomLevel = 1; applyZoom(); });
if (fitScreenBtn) fitScreenBtn.addEventListener('click', fitStageToViewport);
if (centerStageBtn) centerStageBtn.addEventListener('click', centerStage);

// ============ Controles de exportación ============
const exportFormatSel    = document.getElementById('exportFormat');
const jpegQualityWrapper = document.getElementById('jpegQualityWrapper');
const exportQualityInput = document.getElementById('exportQuality');
const exportQualityVal   = document.getElementById('exportQualityVal');
const preflightFormat    = document.getElementById('preflightFormat');
const preflightScale     = document.getElementById('preflightScale');
const preflightDimensions = document.getElementById('preflightDimensions');
const preflightSize      = document.getElementById('preflightSize');
const preflightHint      = document.getElementById('preflightHint');
const preflightWarnings  = document.getElementById('preflightWarnings');
const preflightStatus    = document.getElementById('preflightStatus');
const shareBtn           = document.getElementById('shareBtn');
let realPreflightTimer = null;
let realPreflightToken = 0;
const presetNameInput    = document.getElementById('presetNameInput');
const savePresetBtn      = document.getElementById('savePresetBtn');
const presetList         = document.getElementById('presetList');
const PRESETS_KEY        = 'codeshot-presets';
const brandKitNameInput  = document.getElementById('brandKitNameInput');
const saveBrandKitBtn    = document.getElementById('saveBrandKitBtn');
const brandKitList       = document.getElementById('brandKitList');
const BRAND_KITS_KEY     = 'codeshot-brand-kits';
const PROJECTS_KEY       = 'codeshot-projects';
const ACTIVE_PROJECT_KEY = 'codeshot-active-project-id';
const projectNameInput   = document.getElementById('projectNameInput');
const saveProjectBtn     = document.getElementById('saveProjectBtn');
const projectList        = document.getElementById('projectList');
const projectStatus      = document.getElementById('projectStatus');
const showActiveProjectsBtn = document.getElementById('showActiveProjectsBtn');
const showArchivedProjectsBtn = document.getElementById('showArchivedProjectsBtn');
const projectSearchInput = document.getElementById('projectSearchInput');
const projectCollectionInput = document.getElementById('projectCollectionInput');
const projectCollectionFilter = document.getElementById('projectCollectionFilter');
const projectSortSelect = document.getElementById('projectSortSelect');
const exportProjectsBtn = document.getElementById('exportProjectsBtn');
const importProjectsBtn = document.getElementById('importProjectsBtn');
const importProjectsInput = document.getElementById('importProjectsInput');
let projectLibraryView = 'active';
let projectAutosaveTimer = null;

function formatFileSize(bytes) {
  if (bytes < 1024) return `${Math.round(bytes)} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10240 ? 1 : 0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getExportFormat() { return exportFormatSel?.value ?? 'png'; }
function getExportQuality() { return Number.parseInt(exportQualityInput?.value ?? '90', 10) / 100; }
function getExportScale() {
  const checked = document.querySelector('input[name="exportScale"]:checked');
  return Number.parseInt(checked?.value ?? '2', 10);
}

function getExportCompression(format) {
  const compressionByFormat = { png: 0.34, jpeg: 0.16, webp: 0.12 };
  return compressionByFormat[format] ?? compressionByFormat.png;
}

function supportsWebp() {
  try {
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').startsWith('data:image/webp');
  } catch {
    return false;
  }
}

const FONT_PRELIGHT_NAMES = {
  'fira-code': 'Fira Code',
  jetbrains: 'JetBrains Mono',
  cascadia: 'Cascadia Code',
  'source-code': 'Source Code Pro',
  consolas: 'Consolas'
};

function isSelectedFontAvailable() {
  const name = FONT_PRELIGHT_NAMES[fontFamilySel?.value ?? 'fira-code'];
  if (!name || !document.fonts?.check) return true;
  return document.fonts.check(`14px "${name}"`);
}

function getPreflightWarnings(format, width, height) {
  const warnings = [];
  const codeLines = (codeInput?.value ?? '').split('\n');
  const lines = codeLines.length;
  const longestLine = Math.max(0, ...codeLines.map(line => line.length));
  const hasTransparency = exportStage?.classList.contains('bg-none');
  const hasHorizontalClipping = Boolean(highlightPre && windowFrame && highlightPre.scrollWidth > windowFrame.clientWidth);

  if (backgroundImageUrl) warnings.push('La imagen de fondo es temporal: se exporta en esta sesión, pero no se guarda en proyectos ni enlaces compartibles.');
  if (!isSelectedFontAvailable()) warnings.push(`La fuente "${FONT_PRELIGHT_NAMES[fontFamilySel?.value] ?? 'seleccionada'}" no está disponible; la exportación usará una fuente de respaldo.`);
  if (hasHorizontalClipping) warnings.push('El código supera el ancho visible del frame; aumenta el ancho o reduce la fuente antes de exportar.');
  if (format === 'jpeg' && hasTransparency) warnings.push('JPG no admite transparencia: se exportará sobre fondo blanco.');
  if (format === 'webp' && !supportsWebp()) warnings.push('Este navegador no admite WEBP; la descarga usará PNG.');
  if (lines > 30) warnings.push(`El snippet tiene ${lines} líneas; revisa la legibilidad antes de publicar.`);
  if (longestLine > 110) warnings.push(`Hay una línea de ${longestLine} caracteres; verifica el corte horizontal en pantallas móviles.`);
  if (Math.min(width, height) < 900) warnings.push('La resolución final es baja para publicación social; considera 2× o 3×.');
  if (width > 6000 || height > 6000) warnings.push('La resolución es muy alta y puede tardar más en renderizarse.');
  return warnings;
}

function renderPreflightWarnings(warnings) {
  if (!preflightWarnings) return;
  preflightWarnings.innerHTML = warnings.map(warning => `<li>${warning}</li>`).join('');
}

function setPreflightStatus(text, state = 'ready') {
  if (!preflightStatus) return;
  preflightStatus.dataset.state = state;
  preflightStatus.innerHTML = `<i aria-hidden="true"></i> ${text}`;
}

function scheduleRealPreflight() {
  clearTimeout(realPreflightTimer);
  const token = ++realPreflightToken;
  if (typeof window.html2canvas !== 'function') return;
  setPreflightStatus('Estimando…', 'pending');
  realPreflightTimer = setTimeout(async () => {
    try {
      const canvas = await generateCanvas();
      if (!canvas || token !== realPreflightToken) return;
      const format = getExportFormat();
      const { mimeType, usesQuality } = getExportMetadata(format);
      canvas.toBlob(blob => {
        if (!blob || token !== realPreflightToken) return;
        if (preflightSize) preflightSize.textContent = formatFileSize(blob.size);
        setPreflightStatus('Peso real', 'ready');
      }, mimeType, usesQuality ? getExportQuality() : undefined);
    } catch {
      if (token === realPreflightToken) setPreflightStatus('Estimación', 'ready');
    }
  }, 650);
}

function updateExportPreflight() {
  if (!exportStage) return;
  const format = getExportFormat();
  const scale = getExportScale();
  const width = Math.round(exportStage.offsetWidth * scale);
  const height = Math.round(exportStage.offsetHeight * scale);
  const pixelBytes = width * height * 4;
  const compression = getExportCompression(format);
  const labels = { png: 'PNG', jpeg: 'JPG', webp: 'WEBP' };
  const hints = {
    png: 'PNG conserva transparencia y máxima fidelidad.',
    jpeg: 'JPG reduce el peso; se exporta sobre fondo blanco.',
    webp: 'WEBP ofrece gran calidad con un peso optimizado para web.'
  };

  if (preflightFormat) preflightFormat.textContent = labels[format];
  if (preflightScale) preflightScale.textContent = `${scale}×`;
  if (preflightDimensions) preflightDimensions.textContent = `${width} × ${height}`;
  if (preflightSize) preflightSize.textContent = `≈ ${formatFileSize(pixelBytes * compression)}`;
  if (preflightHint) preflightHint.textContent = hints[format];
  renderPreflightWarnings(getPreflightWarnings(format, width, height));
  scheduleRealPreflight();
}

if (exportFormatSel) {
  exportFormatSel.addEventListener('change', () => {
    const format = getExportFormat();
    const usesQuality = format === 'jpeg' || format === 'webp';
    if (jpegQualityWrapper) jpegQualityWrapper.style.display = usesQuality ? '' : 'none';
    if (downloadBtn) downloadBtn.innerHTML = `<span aria-hidden="true">⬇</span> Descargar ${format === 'jpeg' ? 'JPG' : format.toUpperCase()}`;
    updateExportPreflight();
  });
}

if (exportQualityInput) {
  exportQualityInput.addEventListener('input', () => {
    if (exportQualityVal) exportQualityVal.textContent = exportQualityInput.value;
    updateExportPreflight();
  });
}

document.querySelectorAll('input[name="exportScale"]').forEach(input => {
  input.addEventListener('change', updateExportPreflight);
});

// ============ Presets de estilo ============
function loadPresets() {
  try { return JSON.parse(readPreference(PRESETS_KEY) ?? '[]'); } catch { return []; }
}

function savePresetsToStorage(presets) {
  try { writePreference(PRESETS_KEY, JSON.stringify(presets)); } catch { /* noop */ }
}

const CURATED_PRESETS = [
  { name: 'Dark Developer', state: { codeTheme: 'tomorrow', fontFamily: 'jetbrains', frameStyle: 'mac', frameWidth: '760', showTitlebar: '1', padding: '64', radius: '12', shadow: '60', activeBg: 'linear-gradient(135deg, #000000, #434343)', customBgActive: '0' } },
  { name: 'Nord Minimal', state: { codeTheme: 'twilight', fontFamily: 'jetbrains', frameStyle: 'none', frameWidth: '720', showTitlebar: '0', padding: '52', radius: '10', shadow: '28', activeBg: 'linear-gradient(135deg, #2b5876, #4e4376)', customBgActive: '0' } },
  { name: 'LinkedIn Professional', state: { codeTheme: 'tomorrow', fontFamily: 'fira-code', frameStyle: 'mac', frameWidth: '920', showTitlebar: '1', padding: '72', radius: '16', shadow: '65', activeBg: 'linear-gradient(135deg, #312e81, #7c3aed 55%, #c4b5fd)', customBgActive: '0' } },
  { name: 'GitHub Dark', state: { codeTheme: 'dark', fontFamily: 'fira-code', frameStyle: 'browser', frameWidth: '860', showTitlebar: '1', padding: '56', radius: '10', shadow: '48', activeBg: 'linear-gradient(135deg, #111827, #374151)', customBgActive: '0' } },
  { name: 'Sunset Gradient', state: { codeTheme: 'okaidia', fontFamily: 'cascadia', frameStyle: 'mac', frameWidth: '800', showTitlebar: '1', padding: '76', radius: '20', shadow: '70', activeBg: 'linear-gradient(135deg, #f97316, #fb7185)', customBgActive: '0' } }
];

function ensureCuratedPresets() {
  if (readPreference(PRESETS_KEY) === null) savePresetsToStorage(CURATED_PRESETS);
}

function loadBrandKits() {
  try { return JSON.parse(readPreference(BRAND_KITS_KEY) ?? '[]'); } catch { return []; }
}

function saveBrandKitsToStorage(kits) {
  try { writePreference(BRAND_KITS_KEY, JSON.stringify(kits)); } catch { /* noop */ }
}

const PROJECT_DB_NAME = 'codeshot-library';
const PROJECT_DB_VERSION = 1;
const PROJECT_STORE_NAME = 'projects';
let projectDatabasePromise = null;

function loadProjects() {
  try { return JSON.parse(readPreference(PROJECTS_KEY) ?? '[]'); } catch { return []; }
}

function openProjectDatabase() {
  if (!('indexedDB' in window)) return Promise.resolve(null);
  if (projectDatabasePromise) return projectDatabasePromise;
  projectDatabasePromise = new Promise(resolve => {
    const request = window.indexedDB.open(PROJECT_DB_NAME, PROJECT_DB_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(PROJECT_STORE_NAME)) {
        database.createObjectStore(PROJECT_STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
  });
  return projectDatabasePromise;
}

async function persistProjectsToDatabase(projects) {
  const database = await openProjectDatabase();
  if (!database) return;
  try {
    await new Promise((resolve, reject) => {
      const transaction = database.transaction(PROJECT_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(PROJECT_STORE_NAME);
      store.clear();
      projects.forEach(project => store.put(project));
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
    });
  } catch { /* localStorage remains the resilient fallback */ }
}

async function hydrateProjectsFromDatabase() {
  const database = await openProjectDatabase();
  if (!database) return;
  try {
    const projects = await new Promise((resolve, reject) => {
      const request = database.transaction(PROJECT_STORE_NAME, 'readonly').objectStore(PROJECT_STORE_NAME).getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const cachedProjects = loadProjects();
    if (projects.length > 0) {
      const newest = [...projects, ...cachedProjects]
        .reduce((byId, project) => {
          const previous = byId.get(String(project.id));
          if (!previous || (project.updatedAt ?? 0) > (previous.updatedAt ?? 0)) byId.set(String(project.id), project);
          return byId;
        }, new Map());
      const merged = [...newest.values()].sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0)).slice(0, 48);
      writePreference(PROJECTS_KEY, JSON.stringify(merged));
      void persistProjectsToDatabase(merged);
    } else if (cachedProjects.length > 0) {
      await persistProjectsToDatabase(cachedProjects);
    }
    renderProjects();
  } catch { /* continue with the localStorage cache */ }
}

function saveProjectsToStorage(projects) {
  try {
    writePreference(PROJECTS_KEY, JSON.stringify(projects));
    void persistProjectsToDatabase(projects);
  } catch { /* noop */ }
}

function isValidImportedProject(project) {
  return project
    && typeof project === 'object'
    && typeof project.name === 'string'
    && typeof project.code === 'string'
    && typeof project.windowTitle === 'string'
    && project.visual
    && typeof project.visual === 'object';
}

function downloadProjectsBackup() {
  const backup = {
    version: 1,
    exportedAt: new Date().toISOString(),
    projects: loadProjects()
  };
  const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a');
  link.download = `codeshot-projects-${new Date().toISOString().slice(0, 10)}.json`;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  if (downloadStatus) downloadStatus.textContent = 'Respaldo de proyectos descargado.';
}

async function importProjectsBackup(file) {
  try {
    const parsed = JSON.parse(await file.text());
    const incoming = Array.isArray(parsed) ? parsed : parsed?.projects;
    if (!Array.isArray(incoming)) throw new Error('Formato inválido');
    const existing = loadProjects();
    const existingIds = new Set(existing.map(project => String(project.id)));
    const accepted = incoming
      .filter(isValidImportedProject)
      .filter(project => !existingIds.has(String(project.id)))
      .map((project, index) => ({
        ...project,
        id: project.id ?? Date.now() + index,
        updatedAt: Number.isFinite(project.updatedAt) ? project.updatedAt : Date.now(),
        archived: Boolean(project.archived)
      }));
    if (accepted.length === 0) {
      if (downloadStatus) downloadStatus.textContent = 'No hay proyectos nuevos válidos para importar.';
      return;
    }
    saveProjectsToStorage([...accepted, ...existing].slice(0, 48));
    renderProjects();
    if (downloadStatus) downloadStatus.textContent = `${accepted.length} proyecto${accepted.length === 1 ? '' : 's'} importado${accepted.length === 1 ? '' : 's'}.`;
  } catch (error) {
    console.error(error);
    if (downloadStatus) downloadStatus.textContent = 'No se pudo importar el respaldo. Verifica el archivo JSON.';
  }
}

function buildCurrentProjectState() {
  return {
    code: codeInput?.value ?? '',
    windowTitle: windowTitleInput?.value ?? 'untitled.js',
    visual: buildCurrentPresetState()
  };
}

function buildCurrentPresetState() {
  return {
    language:    languageSel?.value,
    codeTheme:   codeThemeSel?.value,
    fontSize:    fontSizeInput?.value,
    fontFamily:  fontFamilySel?.value,
    frameStyle:  frameStyleSel?.value,
    frameWidth:  frameWidthInput?.value,
    showTitlebar: showTitlebarChk?.checked ? '1' : '0',
    padding:     paddingInput?.value,
    radius:      radiusInput?.value,
    shadow:      shadowInput?.value,
    showWatermark: showWatermarkChk?.checked ? '1' : '0',
    watermarkText: watermarkTextInput?.value,
    activeBg:    bgSwatchesContainer?.querySelector('.swatch.active')?.style.background ?? '',
    customBgActive: customBgToggle?.checked ? '1' : '0',
    customBgColor:  customBgColor?.value
  };
}

function applyPresetEditorState(state) {
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

function applyPresetFrameState(state) {
  if (state.frameStyle && frameStyleSel && FRAME_CLASSES.has('frame-' + state.frameStyle)) {
    frameStyleSel.value = state.frameStyle;
    if (windowFrame) { windowFrame.classList.remove(...FRAME_CLASSES); windowFrame.classList.add('frame-' + state.frameStyle); }
  }
  if (state.frameWidth && frameWidthInput) {
    frameWidthInput.value = state.frameWidth;
    if (frameWidthVal) frameWidthVal.textContent = state.frameWidth;
    if (windowFrame) windowFrame.style.setProperty('--frame-width', state.frameWidth + 'px');
  }
  if (state.showTitlebar !== undefined && showTitlebarChk) showTitlebarChk.checked = state.showTitlebar === '1';
}

function applyPresetBgState(state) {
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
    swatches.forEach(s => { s.classList.remove('active'); s.setAttribute('aria-checked','false'); s.setAttribute('tabindex','-1'); });
    match.classList.add('active'); match.setAttribute('aria-checked','true'); match.setAttribute('tabindex','0');
    applyBackground(state.activeBg);
  }
}

function applyPresetPadding(state) {
  if (!state.padding || !paddingInput) { return; }
  paddingInput.value = state.padding;
  if (paddingVal) { paddingVal.textContent = state.padding; }
  if (exportStage) { exportStage.style.setProperty('--stage-padding', state.padding + 'px'); }
}

function applyPresetRadius(state) {
  if (!state.radius || !radiusInput) { return; }
  radiusInput.value = state.radius;
  if (radiusVal) { radiusVal.textContent = state.radius; }
  if (windowFrame) { windowFrame.style.borderRadius = state.radius + 'px'; }
}

function applyPresetShadow(state) {
  if (!state.shadow || !shadowInput) { return; }
  shadowInput.value = state.shadow;
  if (shadowVal) { shadowVal.textContent = state.shadow; }
  applyBoxShadow(state.shadow / 100);
}

function applyPresetVisualState(state) {
  applyPresetPadding(state);
  applyPresetRadius(state);
  applyPresetShadow(state);
  applyPresetBgState(state);
  if (state.showWatermark !== undefined && showWatermarkChk) {
    showWatermarkChk.checked = state.showWatermark === '1';
    watermark?.classList.toggle('visible', showWatermarkChk.checked);
  }
  if (state.watermarkText !== undefined && watermarkTextInput) {
    watermarkTextInput.value = state.watermarkText;
    if (watermark) watermark.textContent = state.watermarkText || 'Hecho con CodeShot';
  }
}

function applyPresetState(state) {
  if (!state) return;
  applyPresetEditorState(state);
  applyPresetFrameState(state);
  applyPresetVisualState(state);
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
  if (presets.length === 0) { presetList.innerHTML = '<p style="font-size:12px;color:var(--text-dim);margin:0">No hay presets guardados.</p>'; return; }
  presets.forEach((p, idx) => {
    const item = document.createElement('article');
    const preview = p.state.customBgActive === '1' ? p.state.customBgColor : p.state.activeBg;
    item.className = 'preset-item preset-card';
    item.innerHTML = `<button class="preset-load" title="Aplicar preset ${p.name}"><span class="preset-thumbnail" style="background:${preview || 'linear-gradient(135deg,#312e81,#7c3aed)'}"><i></i></span><span><strong>${p.name}</strong><small>${p.state.frameWidth || 680}px · ${p.state.codeTheme || 'tomorrow'}</small></span></button><button class="preset-delete" title="Eliminar" aria-label="Eliminar preset ${p.name}">×</button>`;
    item.querySelector('.preset-load').addEventListener('click', () => {
      applyPresetState(p.state);
      updateWorkspaceContext();
      requestAnimationFrame(fitStageToViewport);
    });
    item.querySelector('.preset-delete').addEventListener('click', () => {
      const updated = loadPresets().filter((_, i) => i !== idx);
      savePresetsToStorage(updated);
      renderPresets();
    });
    presetList.appendChild(item);
  });
}

function renderBrandKits() {
  if (!brandKitList) return;
  const kits = loadBrandKits();
  brandKitList.innerHTML = '';
  if (kits.length === 0) {
    brandKitList.innerHTML = '<p class="brand-kit-empty">Aún no has guardado una identidad visual.</p>';
    return;
  }
  kits.forEach((kit, index) => {
    const item = document.createElement('article');
    const preview = kit.state.customBgActive === '1' ? kit.state.customBgColor : kit.state.activeBg;
    item.className = 'brand-kit-card';
    item.innerHTML = `<button class="brand-kit-apply" type="button" title="Aplicar ${kit.name}"><span class="brand-kit-mark" style="background:${preview || 'linear-gradient(135deg,#312e81,#7c3aed)'}"></span><span><strong>${kit.name}</strong><small>${kit.state.fontFamily || 'fira-code'} · ${kit.state.frameStyle || 'mac'}</small></span></button><button class="brand-kit-delete" type="button" aria-label="Eliminar Brand Kit ${kit.name}">×</button>`;
    item.querySelector('.brand-kit-apply').addEventListener('click', () => {
      applyPresetState(kit.state);
      updateWorkspaceContext();
      requestAnimationFrame(() => {
        updateExportPreflight();
        fitStageToViewport();
      });
    });
    item.querySelector('.brand-kit-delete').addEventListener('click', () => {
      saveBrandKitsToStorage(loadBrandKits().filter((_, currentIndex) => currentIndex !== index));
      renderBrandKits();
    });
    brandKitList.appendChild(item);
  });
}

function getActiveProjectId() {
  return readPreference(ACTIVE_PROJECT_KEY);
}

function setActiveProjectId(id) {
  if (id === null || id === undefined) {
    try { window.localStorage.removeItem(ACTIVE_PROJECT_KEY); } catch { /* noop */ }
    return;
  }
  writePreference(ACTIVE_PROJECT_KEY, String(id));
}

function formatProjectDate(timestamp) {
  if (!timestamp) return 'Sin guardar';
  return new Intl.DateTimeFormat('es', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(timestamp));
}

function setSaveIndicator(state, label) {
  if (!saveIndicator) return;
  saveIndicator.dataset.state = state;
  const text = saveIndicator.querySelector('span');
  if (text) text.textContent = label;
}

function updateProjectStatus() {
  const active = loadProjects().find(project => String(project.id) === getActiveProjectId());
  if (projectStatus) {
    projectStatus.textContent = active
      ? `Autosave local activo · ${active.name} · ${formatProjectDate(active.updatedAt)}`
      : 'Crea un proyecto para activar el guardado automático local.';
  }
  setSaveIndicator(active ? 'saved' : 'idle', active ? 'Guardado' : 'Sin proyecto');
}

function buildProjectSnapshot(project) {
  return {
    code: project.code ?? '',
    windowTitle: project.windowTitle ?? 'untitled.js',
    visual: project.visual ?? {},
    thumbnailUrl: project.thumbnailUrl ?? '',
    savedAt: Date.now()
  };
}

async function createProjectThumbnail() {
  if (typeof window.html2canvas !== 'function' || !exportStage) return '';
  try {
    const canvas = await generateCanvasAtScale(1);
    if (!canvas) return '';
    const maxWidth = 320;
    const maxHeight = 180;
    const ratio = Math.min(maxWidth / canvas.width, maxHeight / canvas.height, 1);
    const thumbnail = document.createElement('canvas');
    thumbnail.width = Math.max(1, Math.round(canvas.width * ratio));
    thumbnail.height = Math.max(1, Math.round(canvas.height * ratio));
    thumbnail.getContext('2d')?.drawImage(canvas, 0, 0, thumbnail.width, thumbnail.height);
    return thumbnail.toDataURL('image/jpeg', 0.68);
  } catch {
    return '';
  }
}

async function autosaveActiveProject(createVersion = false) {
  projectAutosaveTimer = null;
  const activeId = getActiveProjectId();
  if (!activeId) return;
  const projects = loadProjects();
  const index = projects.findIndex(project => String(project.id) === activeId);
  if (index === -1 || projects[index].archived) {
    setActiveProjectId(null);
    updateProjectStatus();
    return;
  }
  const current = projects[index];
  const versions = createVersion
    ? [buildProjectSnapshot(current), ...(current.versions ?? [])].slice(0, 8)
    : current.versions ?? [];
  const thumbnailUrl = await createProjectThumbnail();
  projects[index] = {
    ...current,
    ...buildCurrentProjectState(),
    ...(thumbnailUrl ? { thumbnailUrl } : {}),
    versions,
    updatedAt: Date.now()
  };
  saveProjectsToStorage(projects);
  setSaveIndicator('saved', 'Guardado');
  updateProjectStatus();
  renderProjects();
}

function scheduleProjectAutosave() {
  if (!getActiveProjectId()) return;
  clearTimeout(projectAutosaveTimer);
  setSaveIndicator('saving', 'Guardando…');
  projectAutosaveTimer = setTimeout(autosaveActiveProject, 700);
}

function saveActiveProjectNow() {
  if (!getActiveProjectId()) return false;
  clearTimeout(projectAutosaveTimer);
  setSaveIndicator('saving', 'Guardando…');
  void autosaveActiveProject(true);
  if (downloadStatus) downloadStatus.textContent = 'Proyecto guardado como nueva versión.';
  return true;
}

function applyProject(project) {
  if (!project) return;
  setActiveProjectId(project.id);
  renderProjects();
  if (codeInput) codeInput.value = project.code ?? '';
  if (windowTitleInput) {
    windowTitleInput.value = project.windowTitle || 'untitled.js';
    windowTitleInput.dataset.touched = 'true';
  }
  applyPresetState(project.visual);
  updateWindowTitleText();
  highlightCodeNow();
  updateLineNumbers();
  updateWorkspaceContext();
  requestAnimationFrame(() => {
    updateExportPreflight();
    fitStageToViewport();
  });
}

function restoreActiveProject() {
  const activeId = getActiveProjectId();
  const project = loadProjects().find(item => String(item.id) === activeId && !item.archived);
  if (!project) {
    if (activeId) setActiveProjectId(null);
    return false;
  }
  applyProject(project);
  return true;
}

function renderCollectionFilter() {
  if (!projectCollectionFilter) return;
  const selected = projectCollectionFilter.value;
  const collections = [...new Set(loadProjects().map(project => project.collection?.trim()).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'es'));
  projectCollectionFilter.innerHTML = '<option value="">Todas las colecciones</option>';
  collections.forEach(collection => {
    const option = document.createElement('option');
    option.value = collection;
    option.textContent = collection;
    projectCollectionFilter.appendChild(option);
  });
  projectCollectionFilter.value = collections.includes(selected) ? selected : '';
}

function renderProjects() {
  if (!projectList) return;
  renderCollectionFilter();
  const activeId = getActiveProjectId();
  const query = projectSearchInput?.value.trim().toLocaleLowerCase('es') ?? '';
  const collection = projectCollectionFilter?.value ?? '';
  const projects = loadProjects()
    .filter(project => Boolean(project.archived) === (projectLibraryView === 'archived'))
    .filter(project => !collection || project.collection === collection)
    .filter(project => {
      if (!query) return true;
      const searchable = `${project.name ?? ''} ${project.windowTitle ?? ''} ${project.code ?? ''}`.toLocaleLowerCase('es');
      return searchable.includes(query);
    })
    .sort((a, b) => {
      const sort = projectSortSelect?.value ?? 'recent';
      if (sort === 'name') return (a.name ?? '').localeCompare(b.name ?? '', 'es');
      if (sort === 'file') return (a.windowTitle ?? '').localeCompare(b.windowTitle ?? '', 'es');
      return (b.updatedAt ?? 0) - (a.updatedAt ?? 0);
    });
  projectList.innerHTML = '';
  if (projects.length === 0) {
    let emptyMessage;
    if (query) {
      emptyMessage = 'No hay proyectos que coincidan con la búsqueda.';
    } else if (projectLibraryView === 'archived') {
      emptyMessage = 'No hay proyectos archivados.';
    } else {
      emptyMessage = 'Aún no hay proyectos activos.';
    }
    projectList.innerHTML = `<p class="project-empty">${emptyMessage}</p>`;
    updateProjectStatus();
    return;
  }
  projects.forEach(project => {
    const item = document.createElement('article');
    const preview = project.visual?.customBgActive === '1' ? project.visual.customBgColor : project.visual?.activeBg;
    const lines = (project.code ?? '').split('\n').length;
    const isActive = String(project.id) === activeId;
    item.className = `project-card${isActive ? ' is-active' : ''}`;
    const canRestoreVersion = (project.versions?.length ?? 0) > 0;
    const collectionMeta = project.collection ? ` · ${project.collection}` : '';
    const thumbnail = project.thumbnailUrl
      ? `<img src="${project.thumbnailUrl}" alt="" />`
      : '<i aria-hidden="true"></i>';
    const restoreVersionBtn = canRestoreVersion
      ? `<button class="project-version" type="button" aria-label="Restaurar última versión de ${project.name}" title="Restaurar última versión">↶</button>`
      : '';
    const archiveLabel = project.archived ? 'Restaurar' : 'Archivar';
    const archiveIcon = project.archived ? '↶' : '⌑';
    const activeLabel = isActive ? ' <em>Activo</em>' : '';
    item.innerHTML = `<button class="project-open" type="button" title="Abrir ${project.name}"><span class="project-thumbnail" style="background:${preview || 'linear-gradient(135deg,#312e81,#7c3aed)'}">${thumbnail}</span><span><strong>${project.name}${activeLabel}</strong><small>${lines} líneas · ${project.windowTitle || 'untitled.js'}${collectionMeta} · ${formatProjectDate(project.updatedAt)}</small></span></button><div class="project-actions">${restoreVersionBtn}<button class="project-rename" type="button" aria-label="Renombrar ${project.name}" title="Renombrar">✎</button><button class="project-duplicate" type="button" aria-label="Duplicar ${project.name}" title="Duplicar">⧉</button><button class="project-archive" type="button" aria-label="${archiveLabel} ${project.name}" title="${archiveLabel}">${archiveIcon}</button><button class="project-delete" type="button" aria-label="Eliminar proyecto ${project.name}" title="Eliminar">×</button></div>`;
    item.querySelector('.project-open').addEventListener('click', () => applyProject(project));
    item.querySelector('.project-version')?.addEventListener('click', () => {
      const version = project.versions?.[0];
      if (!version || !confirm(`¿Restaurar la versión guardada el ${formatProjectDate(version.savedAt)}?`)) return;
      const restored = { ...project, ...version, versions: project.versions.slice(1), updatedAt: Date.now() };
      saveProjectsToStorage(loadProjects().map(current => current.id === project.id ? restored : current));
      applyProject(restored);
      if (downloadStatus) downloadStatus.textContent = 'Última versión restaurada.';
    });
    item.querySelector('.project-rename').addEventListener('click', () => {
      const name = prompt('Nuevo nombre del proyecto:', project.name)?.trim();
      if (!name) return;
      saveProjectsToStorage(loadProjects().map(current => current.id === project.id ? { ...current, name, updatedAt: Date.now() } : current));
      renderProjects();
    });
    item.querySelector('.project-duplicate').addEventListener('click', () => {
      const copy = { ...project, id: Date.now(), name: `${project.name} (copia)`, updatedAt: Date.now(), archived: false };
      saveProjectsToStorage([copy, ...loadProjects()].slice(0, 48));
      setActiveProjectId(copy.id);
      renderProjects();
    });
    item.querySelector('.project-archive').addEventListener('click', () => {
      const archived = !project.archived;
      saveProjectsToStorage(loadProjects().map(current => current.id === project.id ? { ...current, archived, updatedAt: Date.now() } : current));
      if (String(project.id) === activeId && archived) setActiveProjectId(null);
      renderProjects();
    });
    item.querySelector('.project-delete').addEventListener('click', () => {
      if (!confirm(`¿Eliminar el proyecto "${project.name}"?`)) return;
      saveProjectsToStorage(loadProjects().filter(current => current.id !== project.id));
      if (String(project.id) === activeId) setActiveProjectId(null);
      renderProjects();
    });
    projectList.appendChild(item);
  });
  updateProjectStatus();
}

if (saveProjectBtn) {
  saveProjectBtn.addEventListener('click', async () => {
    const name = projectNameInput?.value.trim();
    if (!name) { projectNameInput?.focus(); return; }
    saveProjectBtn.disabled = true;
    setSaveIndicator('saving', 'Guardando…');
    const collection = projectCollectionInput?.value.trim().slice(0, 60) ?? '';
    const thumbnailUrl = await createProjectThumbnail();
    const project = {
      id: Date.now(),
      name,
      collection,
      updatedAt: Date.now(),
      archived: false,
      ...buildCurrentProjectState(),
      ...(thumbnailUrl ? { thumbnailUrl } : {})
    };
    saveProjectsToStorage([project, ...loadProjects()].slice(0, 48));
    setActiveProjectId(project.id);
    setSaveIndicator('saved', 'Guardado');
    if (projectNameInput) projectNameInput.value = '';
    if (projectCollectionInput) projectCollectionInput.value = '';
    saveProjectBtn.disabled = false;
    renderProjects();
  });
}

function setProjectLibraryView(view) {
  projectLibraryView = view;
  const active = view === 'active';
  showActiveProjectsBtn?.classList.toggle('is-active', active);
  showArchivedProjectsBtn?.classList.toggle('is-active', !active);
  showActiveProjectsBtn?.setAttribute('aria-pressed', String(active));
  showArchivedProjectsBtn?.setAttribute('aria-pressed', String(!active));
  renderProjects();
}

showActiveProjectsBtn?.addEventListener('click', () => setProjectLibraryView('active'));
showArchivedProjectsBtn?.addEventListener('click', () => setProjectLibraryView('archived'));
projectSearchInput?.addEventListener('input', renderProjects);
projectCollectionFilter?.addEventListener('change', renderProjects);
projectSortSelect?.addEventListener('change', renderProjects);
exportProjectsBtn?.addEventListener('click', downloadProjectsBackup);
importProjectsBtn?.addEventListener('click', () => importProjectsInput?.click());
importProjectsInput?.addEventListener('change', event => {
  const file = event.target.files?.[0];
  if (file) void importProjectsBackup(file);
  event.target.value = '';
});
document.addEventListener('input', event => {
  if (!event.target.closest('#projectNameInput, #brandKitNameInput, #presetNameInput')) scheduleProjectAutosave();
});
document.addEventListener('change', event => {
  if (!event.target.closest('#projectNameInput, #brandKitNameInput, #presetNameInput')) scheduleProjectAutosave();
});

if (saveBrandKitBtn) {
  saveBrandKitBtn.addEventListener('click', () => {
    const name = brandKitNameInput?.value.trim();
    if (!name) { brandKitNameInput?.focus(); return; }
    const kits = loadBrandKits();
    kits.push({ name, state: buildCurrentPresetState() });
    saveBrandKitsToStorage(kits);
    if (brandKitNameInput) brandKitNameInput.value = '';
    renderBrandKits();
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

// ============ Compartir por URL ============
function serializeStateToHash() {
  const state = buildCurrentPresetState();
  state.code = codeInput?.value ?? '';
  state.windowTitle = windowTitleInput?.value ?? '';
  try { return '#v1=' + btoa(encodeURIComponent(JSON.stringify(state))); } catch { return ''; }
}

function restoreFromHash() {
  try {
    const hash = location.hash;
    if (!hash.startsWith('#v1=')) return false;
    const state = JSON.parse(decodeURIComponent(atob(hash.slice(4))));
    if (state.code !== undefined && codeInput) { codeInput.value = state.code; }
    if (state.windowTitle && windowTitleInput) { windowTitleInput.value = state.windowTitle; windowTitleInput.dataset.touched = 'true'; }
    applyPresetState(state);
    history.replaceState(null, '', location.pathname + location.search);
    return true;
  } catch { return false; }
}

// ============ Share dropdown ============
const shareWrapper  = document.getElementById('shareWrapper');
const shareDropdown = document.getElementById('shareDropdown');
const shareImageBtn = document.getElementById('shareImageBtn');
const shareCopyLink = document.getElementById('shareCopyLink');
const shareX        = document.getElementById('shareX');
const shareWhatsapp = document.getElementById('shareWhatsapp');
const shareLinkedin = document.getElementById('shareLinkedin');
const shareReddit   = document.getElementById('shareReddit');
const shareFacebook = document.getElementById('shareFacebook');

function getShareUrl() {
  const hash = serializeStateToHash();
  return location.origin + location.pathname + hash;
}

function closeShareDropdown() {
  if (!shareDropdown) return;
  shareDropdown.classList.remove('open');
  shareDropdown.setAttribute('aria-hidden', 'true');
  shareBtn?.setAttribute('aria-expanded', 'false');
}

function openShareDropdown() {
  if (!shareDropdown) return;
  shareDropdown.classList.add('open');
  shareDropdown.setAttribute('aria-hidden', 'false');
  shareBtn?.setAttribute('aria-expanded', 'true');
}

if (shareBtn) {
  shareBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = shareDropdown?.classList.contains('open');
    if (isOpen) { closeShareDropdown(); } else { openShareDropdown(); }
  });
}

document.addEventListener('click', (e) => {
  if (shareWrapper && !shareWrapper.contains(e.target)) closeShareDropdown();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeShareDropdown();
});

async function handleShareImageBlob(blob, filename) {
  if (!blob) throw new Error('Blob nulo');
  const file = new File([blob], filename, { type: 'image/png' });
  const canShare = navigator.canShare?.({ files: [file] });
  if (navigator.share && canShare) {
    try {
      await navigator.share({ files: [file], title: 'CodeShot', text: 'Mi captura de código hecha con CodeShot 📸' });
      if (downloadStatus) downloadStatus.textContent = 'Imagen compartida.';
    } catch (err) {
      if (err.name !== 'AbortError' && downloadStatus) downloadStatus.textContent = 'No se pudo compartir.';
    }
    return;
  }
  // Fallback: download the image
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  if (downloadStatus) downloadStatus.textContent = 'Imagen descargada. Compártela manualmente.';
}

if (shareImageBtn) {
  shareImageBtn.addEventListener('click', async () => {
    if (typeof window.html2canvas !== 'function') {
      if (downloadStatus) downloadStatus.textContent = 'Librería de exportación no disponible.';
      closeShareDropdown();
      return;
    }
    shareImageBtn.disabled = true;
    if (downloadStatus) downloadStatus.textContent = 'Generando imagen…';
    try {
      const canvas = await generateCanvas();
      if (!canvas) throw new Error('Canvas nulo');
      const filename = safeFilename(windowTitleInput?.value);
      canvas.toBlob(blob => { void handleShareImageBlob(blob, filename); }, 'image/png');
    } catch (err) {
      console.error(err);
      if (downloadStatus) downloadStatus.textContent = 'Error al generar la imagen.';
    } finally {
      shareImageBtn.disabled = false;
    }
    closeShareDropdown();
  });
}

if (shareCopyLink) {
  shareCopyLink.addEventListener('click', async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      if (downloadStatus) downloadStatus.textContent = 'Enlace copiado al portapapeles.';
    } catch {
      if (downloadStatus) downloadStatus.textContent = 'URL: ' + url;
    }
    closeShareDropdown();
  });
}

function openSocialShare(urlBuilder) {
  const url = getShareUrl();
  window.open(urlBuilder(url), '_blank', 'noopener,noreferrer,width=600,height=500');
  closeShareDropdown();
}

const SHARE_TEXT = encodeURIComponent('Mira este snippet de código que hice con CodeShot 📸');
const SHARE_TITLE = encodeURIComponent('CodeShot — Captura de código');

if (shareX)        shareX.addEventListener('click',        () => openSocialShare(u => `https://twitter.com/intent/tweet?text=${SHARE_TEXT}&url=${encodeURIComponent(u)}`));
if (shareWhatsapp) shareWhatsapp.addEventListener('click', () => openSocialShare(u => `https://api.whatsapp.com/send?text=${SHARE_TEXT}%20${encodeURIComponent(u)}`));
if (shareLinkedin) shareLinkedin.addEventListener('click', () => openSocialShare(u => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}`));
if (shareReddit)   shareReddit.addEventListener('click',   () => openSocialShare(u => `https://reddit.com/submit?url=${encodeURIComponent(u)}&title=${SHARE_TITLE}`));
if (shareFacebook) shareFacebook.addEventListener('click', () => openSocialShare(u => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`));

const INVALID_FILENAME_CHARS = new Set(['<', '>', ':', '"', '/', '\\', '|', '?', '*']);
function safeFilename(rawTitle = 'codeshot') {
  const title = rawTitle || 'codeshot';
  const lastDot = title.lastIndexOf('.');
  const withoutExt = lastDot > 0 ? title.slice(0, lastDot) : title;
  let sanitized = '';
  for (const char of withoutExt) { const code = char.codePointAt(0); sanitized += (code <= 0x1f || INVALID_FILENAME_CHARS.has(char)) ? '-' : char; }
  let end = sanitized.length;
  while (end > 0 && (sanitized[end-1] === ' ' || sanitized[end-1] === '.')) end--;
  return (sanitized.slice(0, end).trim().slice(0, 100) || 'codeshot') + '.png';
}

async function generateCanvas() {
  if (typeof window.html2canvas !== 'function') return null;
  const orig = exportStage.style.transform;
  exportStage.style.transform = 'none';
  const isJpeg = getExportFormat() === 'jpeg';
  const isNone = exportStage.classList.contains('bg-none') && !isJpeg;
  codeInput?.blur();
  try {
    return await html2canvas(exportStage, {
      backgroundColor: isJpeg ? '#ffffff' : null,
      scale: getExportScale(),
      useCORS: true,
      onclone: (d) => {
        if (isNone) {
          const s = d.getElementById('exportStage');
          if (s) { s.classList.remove('bg-none'); s.style.background = 'transparent'; s.style.backgroundImage = 'none'; }
        }
      }
    });
  } finally { exportStage.style.transform = orig; }
}

function getExportMetadata(format) {
  const metadataByFormat = {
    png: { mimeType: 'image/png', extension: '.png', usesQuality: false },
    jpeg: { mimeType: 'image/jpeg', extension: '.jpg', usesQuality: true },
    webp: { mimeType: 'image/webp', extension: '.webp', usesQuality: true }
  };
  if (format === 'webp' && !supportsWebp()) return metadataByFormat.png;
  return metadataByFormat[format] ?? metadataByFormat.png;
}

function triggerImageDownload(canvas) {
  const format = getExportFormat();
  const { mimeType, extension, usesQuality } = getExportMetadata(format);
  const filename = safeFilename(windowTitleInput?.value).replace(/\.png$/, extension);
  const quality = usesQuality ? getExportQuality() : undefined;
  const dataUrl = canvas.toDataURL(mimeType, quality);
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  link.remove();
  addToHistory(filename, dataUrl);
  return filename;
}

function setExportFeedback(message, state = 'progress', retryAction = null) {
  retryExportAction = retryAction;
  if (downloadStatus) downloadStatus.textContent = message;
  if (!exportFeedback || !exportFeedbackText || !retryExportBtn) return;
  exportFeedback.hidden = false;
  exportFeedback.dataset.state = state;
  exportFeedbackText.textContent = message;
  retryExportBtn.hidden = !retryAction;
}

function clearExportFeedback() {
  retryExportAction = null;
  if (exportFeedback) exportFeedback.hidden = true;
  if (retryExportBtn) retryExportBtn.hidden = true;
}

function getExportErrorMessage(error) {
  if (typeof window.html2canvas !== 'function') return 'No se pudo iniciar la exportación: la librería de renderizado no está disponible. Recarga la página e inténtalo de nuevo.';
  if (error?.name === 'SecurityError') return 'No se pudo exportar por una restricción de seguridad del navegador. Quita la imagen de fondo o utiliza una imagen local permitida.';
  return 'No se pudo generar la imagen. Reduce la escala o el tamaño del snippet y vuelve a intentarlo.';
}

async function downloadCurrentImage() {
  if (typeof window.html2canvas !== 'function') {
    setExportFeedback('No se pudo iniciar la exportación: la librería de renderizado no está disponible. Recarga la página e inténtalo de nuevo.', 'error', downloadCurrentImage);
    return;
  }
  downloadBtn.disabled = true;
  setExportFeedback('Generando imagen…', 'progress');
  try {
    const canvas = await generateCanvas();
    if (!canvas) throw new Error('Canvas nulo');
    setExportFeedback('Preparando descarga…', 'progress');
    const filename = triggerImageDownload(canvas);
    setExportFeedback(`Imagen "${filename}" descargada.`, 'success');
  } catch (error) {
    console.error(error);
    setExportFeedback(getExportErrorMessage(error), 'error', downloadCurrentImage);
  } finally {
    downloadBtn.disabled = false;
  }
}

retryExportBtn?.addEventListener('click', () => {
  const action = retryExportAction;
  clearExportFeedback();
  if (action) void action();
});

if (downloadBtn) {
  downloadBtn.addEventListener('click', downloadCurrentImage);
}

if (copyImgBtn) {
  copyImgBtn.addEventListener('click', async () => {
    if (typeof window.html2canvas !== 'function' || !navigator.clipboard?.write) {
      if (downloadStatus) downloadStatus.textContent = 'Copiar al portapapeles no disponible.';
      return;
    }
    copyImgBtn.disabled = true;
    if (downloadStatus) downloadStatus.textContent = 'Copiando imagen…';
    try {
      const canvas = await generateCanvas(); if (!canvas) throw new Error('Canvas nulo');
      canvas.toBlob(async (blob) => { if (!blob) { throw new Error('Blob nulo'); } await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]); if (downloadStatus) downloadStatus.textContent = 'Imagen copiada al portapapeles.'; }, 'image/png');
    } catch (err) { console.error(err); if (downloadStatus) downloadStatus.textContent = 'No se pudo copiar.'; }
    finally { copyImgBtn.disabled = false; }
  });
}

document.addEventListener('keydown', (e) => {
  const ctrl = e.ctrlKey || e.metaKey;
  if (!ctrl) return;
  if (e.key === 'Enter') { e.preventDefault(); downloadBtn?.click(); }
  else if (e.key === 's' || e.key === 'S') {
    e.preventDefault();
    if (!saveActiveProjectNow()) {
      revealControlGroup('group-proyectos', 'projectNameInput');
      if (downloadStatus) downloadStatus.textContent = 'Asigna un nombre para crear el primer proyecto.';
    }
  }
  else if (e.shiftKey && e.key === 'C') { e.preventDefault(); copyImgBtn?.click(); }
  else if (e.key === 'l' || e.key === 'L') { e.preventDefault(); clearCodeBtn?.click(); }
  else if (e.key === '=' || e.key === '+') { e.preventDefault(); zoomInBtn?.click(); }
  else if (e.key === '-') { e.preventDefault(); zoomOutBtn?.click(); }
});

// ============ ZIP multi-resolución (pure JS) ============
const CRC32_TABLE = (() => { const t = new Uint32Array(256); for (let i = 0; i < 256; i++) { let c = i; for (let j = 0; j < 8; j++) { c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1); } t[i] = c; } return t; })();
function crc32(data) { let c = 0xFFFFFFFF; for (const byte of data) { c = (c >>> 8) ^ CRC32_TABLE[(c ^ byte) & 0xFF]; } return (c ^ 0xFFFFFFFF) >>> 0; }
function buildZip(files) {
  const enc = new TextEncoder(), lp = [], cp = []; let off = 0;
  for (const { name, data } of files) {
    const nb = enc.encode(name), crc = crc32(data), sz = data.length;
    const lh = new Uint8Array(30 + nb.length); const lv = new DataView(lh.buffer);
    lv.setUint32(0,0x04034b50,true); lv.setUint16(4,20,true); lv.setUint16(6,0,true); lv.setUint16(8,0,true); lv.setUint16(10,0,true); lv.setUint16(12,0,true);
    lv.setUint32(14,crc,true); lv.setUint32(18,sz,true); lv.setUint32(22,sz,true); lv.setUint16(26,nb.length,true); lv.setUint16(28,0,true); lh.set(nb,30); lp.push(lh,data);
    const cd = new Uint8Array(46 + nb.length); const cv = new DataView(cd.buffer);
    cv.setUint32(0,0x02014b50,true); cv.setUint16(4,20,true); cv.setUint16(6,20,true); cv.setUint16(8,0,true); cv.setUint16(10,0,true); cv.setUint16(12,0,true); cv.setUint16(14,0,true);
    cv.setUint32(16,crc,true); cv.setUint32(20,sz,true); cv.setUint32(24,sz,true); cv.setUint16(28,nb.length,true); cv.setUint16(30,0,true); cv.setUint16(32,0,true); cv.setUint16(34,0,true); cv.setUint16(36,0,true); cv.setUint32(38,0,true); cv.setUint32(42,off,true); cd.set(nb,46); cp.push(cd); off += lh.length + sz;
  }
  const cds = cp.reduce((s,c) => s+c.length, 0); const eocd = new Uint8Array(22); const ev = new DataView(eocd.buffer);
  ev.setUint32(0,0x06054b50,true); ev.setUint16(4,0,true); ev.setUint16(6,0,true); ev.setUint16(8,files.length,true); ev.setUint16(10,files.length,true); ev.setUint32(12,cds,true); ev.setUint32(16,off,true); ev.setUint16(20,0,true);
  const all = [...lp,...cp,eocd], total = all.reduce((s,p) => s+p.length,0), res = new Uint8Array(total); let pos = 0; for (const p of all) { res.set(p,pos); pos += p.length; } return res;
}
function dataUrlToUint8Array(dataUrl) { const bin = atob(dataUrl.split(',')[1]); return Uint8Array.from(bin, ch => ch.codePointAt(0)); }
function canvasToUint8Array(canvas) { return dataUrlToUint8Array(canvas.toDataURL('image/png')); }
async function generateCanvasAtScale(scale) {
  if (typeof window.html2canvas !== 'function') return null;
  const orig = exportStage.style.transform; exportStage.style.transform = 'none'; const isNone = exportStage.classList.contains('bg-none'); codeInput?.blur();
  try { return await html2canvas(exportStage, { backgroundColor: null, scale, useCORS: true, onclone: (d) => { if (!isNone) { return; } const s = d.getElementById('exportStage'); if (s) { s.classList.remove('bg-none'); s.style.background='transparent'; s.style.backgroundImage='none'; } } }); }
  finally { exportStage.style.transform = orig; }
}
const exportZipBtn = document.getElementById('exportZipBtn');
const exportWebPackBtn = document.getElementById('exportWebPackBtn');
const exportPackSelect = document.getElementById('exportPackSelect');
const exportPackBtn = document.getElementById('exportPackBtn');
const EXPORT_PACKS = {
  linkedin: {
    label: 'LinkedIn',
    files: [{ format: 'png', scale: 1 }, { format: 'png', scale: 2 }, { format: 'webp', scale: 2 }]
  },
  documentation: {
    label: 'Documentation',
    files: [{ format: 'png', scale: 1 }, { format: 'png', scale: 2 }, { format: 'webp', scale: 1 }]
  },
  social: {
    label: 'Social',
    files: [{ format: 'png', scale: 2 }, { format: 'jpeg', scale: 2 }, { format: 'webp', scale: 2 }]
  }
};

if (exportWebPackBtn) {
  exportWebPackBtn.addEventListener('click', async () => {
    if (typeof window.html2canvas !== 'function') {
      if (downloadStatus) downloadStatus.textContent = 'Librería no disponible.';
      return;
    }
    exportWebPackBtn.disabled = true;
    if (downloadStatus) downloadStatus.textContent = 'Generando Web Pack…';
    try {
      const canvas = await generateCanvas();
      if (!canvas) throw new Error('Canvas nulo');
      const base = safeFilename(windowTitleInput?.value).replace(/\.png$/, '');
      const quality = getExportQuality();
      const files = [
        { name: `${base}.png`, data: dataUrlToUint8Array(canvas.toDataURL('image/png')) },
        { name: `${base}.jpg`, data: dataUrlToUint8Array(canvas.toDataURL('image/jpeg', quality)) }
      ];
      if (supportsWebp()) {
        files.push({ name: `${base}.webp`, data: dataUrlToUint8Array(canvas.toDataURL('image/webp', quality)) });
      } else {
        files.push({ name: `${base}-webp-fallback.png`, data: dataUrlToUint8Array(canvas.toDataURL('image/png')) });
      }
      const blob = new Blob([buildZip(files)], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${base}-web-pack.zip`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      if (downloadStatus) downloadStatus.textContent = supportsWebp() ? 'Web Pack descargado.' : 'Web Pack descargado con fallback PNG para WEBP.';
    } catch (err) {
      console.error(err);
      if (downloadStatus) downloadStatus.textContent = 'Error al generar el Web Pack.';
    } finally {
      exportWebPackBtn.disabled = false;
    }
  });
}

const batchFilesInput = document.getElementById('batchFilesInput');
const exportBatchBtn = document.getElementById('exportBatchBtn');
const batchFilesStatus = document.getElementById('batchFilesStatus');
let selectedBatchFiles = [];

function detectLanguageFromFilename(filename) {
  const extension = filename.split('.').pop()?.toLowerCase() ?? '';
  const languagesByExtension = {
    js: 'javascript', ts: 'typescript', jsx: 'jsx', tsx: 'jsx', py: 'python',
    java: 'java', cs: 'csharp', cpp: 'cpp', c: 'c', go: 'go', rs: 'rust',
    php: 'php', rb: 'ruby', html: 'markup', htm: 'markup', css: 'css',
    json: 'json', sh: 'bash', sql: 'sql', yml: 'yaml', yaml: 'yaml', md: 'markdown'
  };
  return languagesByExtension[extension] ?? 'javascript';
}

function updateBatchFilesStatus() {
  const count = selectedBatchFiles.length;
  if (batchFilesStatus) {
    const fileLabel = count === 1 ? 'archivo' : 'archivos';
    const readyLabel = count === 1 ? 'listo' : 'listos';
    batchFilesStatus.textContent = count
      ? `${count} ${fileLabel} ${readyLabel} para exportar como PNG 2×.`
      : 'Selecciona hasta 12 archivos de código.';
  }
  if (exportBatchBtn) exportBatchBtn.disabled = count === 0;
}

batchFilesInput?.addEventListener('change', event => {
  selectedBatchFiles = [...(event.target.files ?? [])].slice(0, 12);
  updateBatchFilesStatus();
});

async function renderBatchFile(file) {
  const original = buildCurrentProjectState();
  const originalTouched = windowTitleInput?.dataset.touched;
  try {
    if (codeInput) codeInput.value = await file.text();
    if (windowTitleInput) {
      windowTitleInput.value = file.name;
      windowTitleInput.dataset.touched = 'true';
    }
    if (languageSel) languageSel.value = detectLanguageFromFilename(file.name);
    highlightCodeNow();
    lastLineCount = -1;
    updateLineNumbers();
    updateWindowTitleText();
    updateWorkspaceContext();
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const canvas = await generateCanvasAtScale(2);
    if (!canvas) throw new Error('Canvas nulo');
    return {
      name: safeFilename(file.name).replace(/\.png$/, '-batch-2x.png'),
      data: canvasToUint8Array(canvas)
    };
  } finally {
    if (codeInput) codeInput.value = original.code;
    if (windowTitleInput) {
      windowTitleInput.value = original.windowTitle;
      if (originalTouched === undefined) delete windowTitleInput.dataset.touched;
      else windowTitleInput.dataset.touched = originalTouched;
    }
    applyPresetState(original.visual);
    updateWindowTitleText();
    updateWorkspaceContext();
  }
}

exportBatchBtn?.addEventListener('click', async () => {
  if (selectedBatchFiles.length === 0) return;
  if (typeof window.html2canvas !== 'function') {
    setExportFeedback('No se pudo iniciar el lote: la librería de renderizado no está disponible. Recarga la página e inténtalo de nuevo.', 'error');
    return;
  }
  exportBatchBtn.disabled = true;
  const files = [];
  try {
    const renderedFiles = await Promise.all(
      selectedBatchFiles.map((file, index) => {
        setExportFeedback(`Procesando archivo ${index + 1}/${selectedBatchFiles.length}: ${file.name}`, 'progress');
        return renderBatchFile(file);
      })
    );
    files.push(...renderedFiles);
    const archive = new Blob([buildZip(files)], { type: 'application/zip' });
    const url = URL.createObjectURL(archive);
    const link = document.createElement('a');
    link.download = `codeshot-batch-${new Date().toISOString().slice(0, 10)}.zip`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setExportFeedback(`Lote descargado con ${files.length} captura${files.length === 1 ? '' : 's'} PNG.`, 'success');
  } catch (error) {
    console.error(error);
    setExportFeedback('No se pudo completar el lote. Verifica los archivos seleccionados y reduce el tamaño de los snippets.', 'error');
  } finally {
    updateBatchFilesStatus();
  }
});

async function generatePackFile(base, pack, definition, index) {
  setExportFeedback(`Generando pack ${pack.label}: ${index + 1}/${pack.files.length}…`, 'progress');
  const canvas = await generateCanvasAtScale(definition.scale);
  if (!canvas) throw new Error('Canvas nulo');
  const requestedFormat = definition.format === 'webp' && !supportsWebp() ? 'png' : definition.format;
  const extension = requestedFormat === 'jpeg' ? 'jpg' : requestedFormat;
  const mimeType = requestedFormat === 'jpeg' ? 'image/jpeg' : `image/${requestedFormat}`;
  const suffix = definition.format === 'webp' && requestedFormat === 'png' ? '-webp-fallback' : '';
  return {
    name: `${base}-${pack.label.toLowerCase()}-${definition.scale}x${suffix}.${extension}`,
    data: dataUrlToUint8Array(canvas.toDataURL(mimeType, requestedFormat === 'png' ? undefined : getExportQuality()))
  };
}

if (exportPackBtn) {
  exportPackBtn.addEventListener('click', async () => {
    if (typeof window.html2canvas !== 'function') {
      setExportFeedback('No se pudo iniciar el pack: la librería de renderizado no está disponible. Recarga la página e inténtalo de nuevo.', 'error');
      return;
    }
    const pack = EXPORT_PACKS[exportPackSelect?.value] ?? EXPORT_PACKS.linkedin;
    exportPackBtn.disabled = true;
    setExportFeedback(`Generando pack ${pack.label}: 0/${pack.files.length}…`, 'progress');
    try {
      const base = safeFilename(windowTitleInput?.value).replace(/\.png$/, '');
      const files = await Promise.all(
        pack.files.map((definition, index) => generatePackFile(base, pack, definition, index))
      );
      const blob = new Blob([buildZip(files)], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${base}-${pack.label.toLowerCase()}-pack.zip`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setExportFeedback(`Pack ${pack.label} descargado con ${files.length} archivos.`, 'success');
    } catch (error) {
      console.error(error);
      setExportFeedback('No se pudo generar el pack. Reduce la escala o el tamaño del snippet y vuelve a intentarlo.', 'error');
    } finally {
      exportPackBtn.disabled = false;
    }
  });
}

if (exportZipBtn) {
  exportZipBtn.addEventListener('click', async () => {
    if (typeof window.html2canvas !== 'function') {
      if (downloadStatus) downloadStatus.textContent = 'Librería no disponible.';
      return;
    }
    exportZipBtn.disabled = true;
    if (downloadStatus) downloadStatus.textContent = 'Generando ZIP...';
    try {
      const base = safeFilename(windowTitleInput?.value).replace(/\.png$/, '');
      const [c1,c2,c3] = await Promise.all([generateCanvasAtScale(1),generateCanvasAtScale(2),generateCanvasAtScale(3)]);
      if (!c1||!c2||!c3) throw new Error('Canvas nulo');
      const zipBytes = buildZip([{ name:base+'_1x.png', data:canvasToUint8Array(c1) },{ name:base+'_2x.png', data:canvasToUint8Array(c2) },{ name:base+'_3x.png', data:canvasToUint8Array(c3) }]);
      const blob = new Blob([zipBytes],{type:'application/zip'}); const url = URL.createObjectURL(blob);
      const link = document.createElement('a'); link.download = base+'_all-scales.zip'; link.href = url;
      document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
      if (downloadStatus) downloadStatus.textContent = 'ZIP descargado.';
    } catch (err) { console.error(err); if (downloadStatus) downloadStatus.textContent = 'Error al generar el ZIP.'; }
    finally { exportZipBtn.disabled = false; }
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
  const thumb = document.createElement('canvas'), img = new Image();
  img.onload = () => {
    const ratio = Math.min(120/img.width, 80/img.height, 1);
    thumb.width = Math.round(img.width*ratio); thumb.height = Math.round(img.height*ratio);
    thumb.getContext('2d').drawImage(img,0,0,thumb.width,thumb.height);
    const thumbnailUrl = thumb.toDataURL('image/jpeg',0.7);
    const history = getHistory();
    history.unshift({ id:Date.now(), filename, thumbnailUrl, dataUrl, date:new Date().toLocaleDateString('es') });
    if (history.length > HISTORY_MAX) history.pop();
    saveHistory(history); renderHistory();
  };
  img.src = dataUrl;
}
function renderHistory() {
  if (!historyListEl) return;
  const history = getHistory(); historyListEl.innerHTML = '';
  if (!history.length) { historyListEl.innerHTML = '<p style="font-size:12px;color:var(--text-dim);margin:0">No hay capturas recientes.</p>'; return; }
  history.forEach(item => {
    const div = document.createElement('div'); div.className = 'history-item';
    const img = document.createElement('img'); img.className = 'history-thumb'; img.src = item.thumbnailUrl; img.alt = item.filename;
    const meta = document.createElement('div'); meta.className = 'history-meta';
    meta.innerHTML = '<span class="history-name">'+item.filename+'</span><span class="history-date">'+item.date+'</span>';
    const dlBtn = document.createElement('button'); dlBtn.className = 'history-dl'; dlBtn.title = 'Re-descargar'; dlBtn.textContent = '\u2B07';
    dlBtn.addEventListener('click', () => { const link = document.createElement('a'); link.download=item.filename; link.href=item.dataUrl; document.body.appendChild(link); link.click(); link.remove(); });
    div.append(img,meta,dlBtn); historyListEl.appendChild(div);
  });
}
if (clearHistoryBtn) clearHistoryBtn.addEventListener('click', () => { saveHistory([]); renderHistory(); });

// ============ Arranque ============
init();
setupInterfaceComponents();
syncTitlebarVisibility();
ensureCuratedPresets();
renderPresets();
renderBrandKits();
renderProjects();
renderHistory();
await hydrateProjectsFromDatabase();
if (!restoreFromHash()) restoreActiveProject();
document.querySelectorAll('.control-group select').forEach(syncCustomSelect);
document.querySelectorAll('input[type="range"]').forEach(updateRangeProgress);
document.querySelectorAll('#frameWidth, #padding, #radius, #shadow').forEach(input => {
  input.addEventListener('input', () => requestAnimationFrame(updateExportPreflight));
});
requestAnimationFrame(() => {
  updateExportPreflight();
  if (window.innerWidth <= 760) fitStageToViewport();
});

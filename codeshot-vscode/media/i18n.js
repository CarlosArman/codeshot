// i18n — ES / EN
(function () {
  var LANG_KEY = 'codeshot-lang';
  var T = { es: {}, en: {} };

  function t(key, vars) {
    var lang = window.__i18nLang || 'es';
    var str = T[lang]?.[key] || T.es?.[key] || key;
    if (vars) Object.keys(vars).forEach(function(k){ str = str.split('{'+k+'}').join(vars[k]); });
    return str;
  }

  function applyTranslations(lang) {
    window.__i18nLang = lang;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function(el){
      el.innerHTML = t(el.dataset.i18nHtml);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el){
      el.placeholder = t(el.dataset.i18nPlaceholder);
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach(function(el){
      el.setAttribute('aria-label', t(el.dataset.i18nAriaLabel));
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function(el){
      el.title = t(el.dataset.i18nTitle);
    });
    document.querySelectorAll('[data-i18n-value]').forEach(function(el){
      el.value = t(el.dataset.i18nValue);
    });
    document.querySelectorAll('.lang-toggle-btn').forEach(function(btn) {
      btn.textContent = lang === 'en' ? 'EN' : 'ES';
    });
    try { localStorage.setItem(LANG_KEY, lang); } catch(e) {}
    document.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang: lang } }));
  }

  function initLang() {
    var saved;
    try { saved = localStorage.getItem(LANG_KEY); } catch(e) {}
    var lang = (saved === 'en' || saved === 'es') ? saved : 'es';
    applyTranslations(lang);
  }

  window.t = t;
  window.applyTranslations = applyTranslations;
  window.initLang = initLang;
  window.getCurrentLang = function(){ return window.__i18nLang || 'es'; };

  // ---- ES translations ----
  Object.assign(T.es, {
    skip_to_editor:'Saltar al editor de código',mobile_menu_open:'Abrir panel de edición',brand_home:'CodeShot, inicio',nav_templates:'Plantillas',nav_themes:'Temas',nav_resources:'Recursos',workspace_ready:'Workspace listo',theme_to_light:'Cambiar a tema claro',theme_to_dark:'Cambiar a tema oscuro',theme_toggle_title:'Cambiar tema claro/oscuro',share:'Compartir',share_image:'Compartir imagen',copy_link:'Copiar enlace',share_to:'Publicar en',share_on_x:'Compartir en X',share_via_whatsapp:'Compartir por WhatsApp',share_on_linkedin:'Compartir en LinkedIn',share_on_reddit:'Compartir en Reddit',share_on_facebook:'Compartir en Facebook',copy:'Copiar',download_png:'Descargar PNG',lang_toggle_label:'Switch to English',retry:'Reintentar',sidebar_collapse:'Contraer panel de configuración',sidebar_expand:'Expandir panel de configuración',editor_heading:'Editor',saved:'Guardado',saving:'Guardando…',no_project:'Sin proyecto'
  });
  Object.assign(T.es, {
    section_window:'Ventana',frame_style:'Estilo de marco',frame_none:'Sin marco',frame_browser:'Navegador',window_title_label:'Título de la ventana',frame_width_label:'Ancho del marco:',show_titlebar:'Mostrar barra de título',section_code:'Código',code_hint:'Escribe o pega tu código directamente en el editor de la vista previa.',clear_code:'Limpiar código',font_family:'Familia de fuente',language:'Lenguaje',code_theme:'Tema del editor',font_size_label:'Tamaño de fuente:',line_numbers:'Números de línea',line_start:'Número de línea inicial',theme_default_light:'Default (claro)',theme_coy_light:'Coy (claro)',theme_onelight:'One Light (claro)',section_background:'Fondo',gradient_color:'Gradiente / color',custom_color:'Color personalizado',custom_bg_label:'Selector de color personalizado para el fondo',upload_bg_image:'Subir imagen de fondo',remove_image:'Quitar imagen'
  });
  Object.assign(T.es, {
    section_appearance:'Apariencia',bg_padding_label:'Padding del fondo:',border_radius_label:'Radio del borde:',shadow_label:'Intensidad de sombra:',watermark:'Marca de agua',watermark_text_aria:'Texto de la marca de agua',watermark_placeholder:'Texto de la marca de agua',watermark_default:'Hecho con CodeShot',section_brand_kit:'Brand Kit',brand_kit_hint:'Guarda tu identidad visual y aplícala en un clic a cada captura.',brand_kit_placeholder:'Nombre del Brand Kit…',brand_kit_name_aria:'Nombre del Brand Kit',save:'Guardar',brand_kit_empty:'Aún no has guardado una identidad visual.',section_export:'Exportación',format_label:'Formato',png_desc:'PNG (transparencia)',jpeg_desc:'JPEG (menor tamaño)',webp_desc:'WEBP (óptimo para web)',jpeg_quality_label:'Calidad JPEG:',export_scale_legend:'Escala de exportación',scale_recommended:'2× (recomendado)'
  });
  Object.assign(T.es, {
    preflight_title:'Preflight de exportación',preflight_ready:'Listo',preflight_format:'Formato',preflight_scale:'Escala',preflight_resolution:'Resolución',preflight_size:'Peso estimado',preflight_calculating:'Calculando…',preflight_hint_png:'PNG conserva transparencia y máxima fidelidad.',preflight_hint_jpeg:'JPG reduce el peso; se exporta sobre fondo blanco.',preflight_hint_webp:'WEBP ofrece gran calidad con un peso optimizado para web.',export_zip:'Exportar ZIP (1×/2×/3×)',export_web_pack:'Exportar Web Pack (PNG/JPG/WEBP)',export_pack_label:'Export Pack',pack_linkedin:'LinkedIn · PNG 1×/2× + WEBP 2×',pack_documentation:'Documentación · PNG 1×/2× + WEBP 1×',pack_social:'Social · PNG 2× + JPG/WEBP 2×',export_pack_btn:'Exportar Pack seleccionado',select_files:'Seleccionar archivos',export_batch:'Exportar lote',batch_hint:'Selecciona hasta 12 archivos de código.'
  });
  Object.assign(T.es, {
    section_projects:'Proyectos',project_create_hint:'Crea un proyecto para activar el guardado automático local.',project_placeholder:'Nombre del proyecto…',project_name_aria:'Nombre del proyecto',create:'Crear',collection_placeholder:'Colección opcional…',active_projects:'Activos',archived_projects:'Archivados',search_projects_placeholder:'Buscar proyectos…',all_collections:'Todas las colecciones',sort_recent:'Más recientes',sort_name:'Nombre',sort_file:'Archivo',export_json:'Exportar JSON',import_json:'Importar JSON',import_projects_aria:'Importar proyectos desde archivo JSON',section_history:'Historial reciente',clear_history:'Limpiar historial',section_presets:'Presets de estilo',presets_hint:'Guarda la configuración actual con un nombre para reutilizarla.',preset_placeholder:'Nombre del preset…',preset_name_aria:'Nombre del preset'
  });
  Object.assign(T.es, {
    section_actions:'Acciones',shortcuts_html:'<span aria-hidden="true">⌨️</span> <strong>Ctrl+S</strong> guardar proyecto · <strong>Ctrl+Enter</strong> descargar · <strong>Ctrl+Shift+C</strong> copiar · <strong>Ctrl+L</strong> limpiar',reset_defaults:'Restaurar valores por defecto',preview_aria:'Vista previa del código',preview_controls_aria:'Controles de encuadre de la vista previa',fit:'Ajustar',center:'Centrar',zoom_out_aria:'Reducir zoom',zoom_in_aria:'Aumentar zoom',reset_zoom_aria:'Restablecer zoom',reset_zoom_title:'Restablecer zoom',workspace_hint:'Selecciona la captura para editar estilos',quick_bg:'Fondo',quick_radius:'Radio',quick_shadow:'Sombra',quick_padding:'Padding',quick_save:'Guardar',metadata_aria:'Metadatos de la captura',code_editor_aria:'Editor de código: escribe o pega tu código aquí',code_placeholder:'Escribe o pega tu código aquí…'
  });
  Object.assign(T.es, {
    onboarding_eyebrow:'Tu primera captura en menos de 30 segundos',onboarding_title:'¿Dónde vas a publicar?',onboarding_description:'Selecciona un destino y prepararemos un canvas con proporciones y estilo recomendados.',start_from_scratch:'Empezar desde cero',template_linkedin_small:'Post profesional',template_github_small:'README o issue',template_blog_small:'Hero editorial',template_slide_small:'Conference slide',template_social_small:'Post para X',template_story_small:'Formato vertical',template_eyebrow:'Comienza con una intención',template_title:'Plantillas de captura',close_templates_aria:'Cerrar plantillas',filter_all:'Todas',filter_professional:'Profesional',filter_documentation:'Documentación',filter_social_btn:'Social',filter_vertical:'Vertical',tpl_linkedin_size:'1200 × 627 · Profesional',tpl_github_size:'1280 × 720 · Documentación',tpl_blog_size:'1600 × 900 · Editorial',tpl_slide_size:'1920 × 1080 · Presentación',tpl_social_size:'1600 × 900 · Social',tpl_story_size:'1080 × 1920 · Vertical'
  });
  Object.assign(T.es, {
    confirm_reset:'¿Restaurar todos los ajustes a los valores por defecto?',confirm_delete_project:'¿Eliminar el proyecto "{name}"?',confirm_restore_version:'¿Restaurar la versión guardada el {date}?',generating_image:'Generando imagen…',preparing_download:'Preparando descarga…',image_downloaded:'Imagen "{name}" descargada.',copying_image:'Copiando imagen…',image_copied:'Imagen copiada al portapapeles.',cannot_copy:'No se pudo copiar.',copy_not_available:'Copiar al portapapeles no disponible.',render_lib_unavailable:'No se pudo iniciar la exportación: librería no disponible. Recarga e inténtalo de nuevo.',export_security_error:'No se pudo exportar por restricción de seguridad del navegador.',export_generic_error:'No se pudo generar la imagen. Reduce la escala e inténtalo de nuevo.',generating_zip:'Generando ZIP...',zip_downloaded:'ZIP descargado.',zip_error:'Error al generar el ZIP.',generating_web_pack:'Generando Web Pack…',web_pack_downloaded:'Web Pack descargado.',web_pack_downloaded_fallback:'Web Pack descargado con fallback PNG para WEBP.',web_pack_error:'Error al generar el Web Pack.',lib_not_available:'Librería no disponible.'
  });
  Object.assign(T.es, {
    batch_lib_unavailable:'No se pudo iniciar el lote: librería no disponible.',batch_processing:'Procesando archivo {index}/{total}: {name}',batch_downloaded_one:'Lote descargado con {count} captura PNG.',batch_downloaded_many:'Lote descargado con {count} capturas PNG.',batch_error:'No se pudo completar el lote. Verifica los archivos.',pack_lib_unavailable:'No se pudo iniciar el pack: librería no disponible.',pack_generating:'Generando pack {label}: {index}/{total}…',pack_downloaded:'Pack {label} descargado con {count} archivos.',pack_error:'No se pudo generar el pack.',share_image_shared:'Imagen compartida.',share_failed:'No se pudo compartir.',image_downloaded_manual:'Imagen descargada. Compártela manualmente.',share_lib_unavailable:'Librería de exportación no disponible.',share_image_error:'Error al generar la imagen.',link_copied:'Enlace copiado al portapapeles.',backup_downloaded:'Respaldo de proyectos descargado.',no_valid_projects:'No hay proyectos nuevos válidos para importar.',projects_imported_one:'{count} proyecto importado.',projects_imported_many:'{count} proyectos importados.',import_error:'No se pudo importar el respaldo.',project_saved_version:'Proyecto guardado como nueva versión.',version_restored:'Última versión restaurada.',assign_project_name:'Asigna un nombre para crear el primer proyecto.',no_recent_captures:'No hay capturas recientes.',no_saved_presets:'No hay presets guardados.'
  });
  Object.assign(T.es, {
    autosave_active:'Autosave local activo · {name} · {date}',no_active_project_status:'Crea un proyecto para activar el guardado automático local.',no_active_projects:'Aún no hay proyectos activos.',no_archived_projects:'No hay proyectos archivados.',no_search_results:'No hay proyectos que coincidan con la búsqueda.',files_ready_one:'{count} archivo listo para exportar como PNG 2×.',files_ready_many:'{count} archivos listos para exportar como PNG 2×.',estimating:'Estimando…',real_weight:'Peso real',estimation:'Estimación',bg_temp_warning:'La imagen de fondo es temporal y no se guarda en proyectos.',font_not_available:'La fuente "{name}" no está disponible; se usará una de respaldo.',horizontal_clipping:'El código supera el ancho del frame; aumenta el ancho o reduce la fuente.',jpeg_transparency_warning:'JPG no admite transparencia: se exportará sobre fondo blanco.',webp_not_supported:'Este navegador no admite WEBP; la descarga usará PNG.',too_many_lines:'El snippet tiene {lines} líneas; revisa la legibilidad.',long_line_warning:'Hay una línea de {chars} caracteres; verifica el corte horizontal.',low_resolution_warning:'La resolución final es baja; considera 2× o 3×.',high_resolution_warning:'La resolución es muy alta y puede tardar más.',date_locale:'es',project_lines:'{lines} líneas',project_copy:'{name} (copia)',redownload_title:'Re-descargar',active_label:' Activo',download_format:'Descargar {fmt}',vsc_shortcuts_html:'<span aria-hidden="true">⌨️</span> <strong>Ctrl+Enter</strong> descargar · <strong>Ctrl+Shift+C</strong> copiar · <strong>Ctrl+L</strong> limpiar',vsc_brand_kit_hint:'Guarda tu identidad visual y aplícala en un clic.',onboarding_vsc_eyebrow:'Primera captura',onboarding_vsc_description:'Elige un destino para aplicar un estilo recomendado.'
  });

  // ---- EN translations ----
  Object.assign(T.en, {
    skip_to_editor:'Skip to code editor',mobile_menu_open:'Open editing panel',brand_home:'CodeShot, home',nav_templates:'Templates',nav_themes:'Themes',nav_resources:'Resources',workspace_ready:'Workspace ready',theme_to_light:'Switch to light theme',theme_to_dark:'Switch to dark theme',theme_toggle_title:'Toggle light/dark theme',share:'Share',share_image:'Share image',copy_link:'Copy link',share_to:'Share to',share_on_x:'Share on X',share_via_whatsapp:'Share via WhatsApp',share_on_linkedin:'Share on LinkedIn',share_on_reddit:'Share on Reddit',share_on_facebook:'Share on Facebook',copy:'Copy',download_png:'Download PNG',lang_toggle_label:'Cambiar a Español',retry:'Retry',sidebar_collapse:'Collapse settings panel',sidebar_expand:'Expand settings panel',editor_heading:'Editor',saved:'Saved',saving:'Saving…',no_project:'No project'
  });
  Object.assign(T.en, {
    section_window:'Window',frame_style:'Frame style',frame_none:'No frame',frame_browser:'Browser',window_title_label:'Window title',frame_width_label:'Frame width:',show_titlebar:'Show title bar',section_code:'Code',code_hint:'Type or paste your code directly in the preview editor.',clear_code:'Clear code',font_family:'Font family',language:'Language',code_theme:'Editor theme',font_size_label:'Font size:',line_numbers:'Line numbers',line_start:'Starting line number',theme_default_light:'Default (light)',theme_coy_light:'Coy (light)',theme_onelight:'One Light (light)',section_background:'Background',gradient_color:'Gradient / color',custom_color:'Custom color',custom_bg_label:'Custom color selector for the background',upload_bg_image:'Upload background image',remove_image:'Remove image'
  });
  Object.assign(T.en, {
    section_appearance:'Appearance',bg_padding_label:'Background padding:',border_radius_label:'Border radius:',shadow_label:'Shadow intensity:',watermark:'Watermark',watermark_text_aria:'Watermark text',watermark_placeholder:'Watermark text',watermark_default:'Made with CodeShot',section_brand_kit:'Brand Kit',brand_kit_hint:'Save your visual identity and apply it in one click.',brand_kit_placeholder:'Brand Kit name…',brand_kit_name_aria:'Brand Kit name',save:'Save',brand_kit_empty:'No visual identity saved yet.',section_export:'Export',format_label:'Format',png_desc:'PNG (transparency)',jpeg_desc:'JPEG (smaller size)',webp_desc:'WEBP (optimized for web)',jpeg_quality_label:'JPEG quality:',export_scale_legend:'Export scale',scale_recommended:'2× (recommended)'
  });
  Object.assign(T.en, {
    preflight_title:'Export preflight',preflight_ready:'Ready',preflight_format:'Format',preflight_scale:'Scale',preflight_resolution:'Resolution',preflight_size:'Estimated size',preflight_calculating:'Calculating…',preflight_hint_png:'PNG preserves transparency and maximum fidelity.',preflight_hint_jpeg:'JPG reduces file size; exported on white background.',preflight_hint_webp:'WEBP offers great quality with optimized file size.',export_zip:'Export ZIP (1×/2×/3×)',export_web_pack:'Export Web Pack (PNG/JPG/WEBP)',export_pack_label:'Export Pack',pack_linkedin:'LinkedIn · PNG 1×/2× + WEBP 2×',pack_documentation:'Documentation · PNG 1×/2× + WEBP 1×',pack_social:'Social · PNG 2× + JPG/WEBP 2×',export_pack_btn:'Export selected Pack',select_files:'Select files',export_batch:'Export batch',batch_hint:'Select up to 12 code files.'
  });
  Object.assign(T.en, {
    section_projects:'Projects',project_create_hint:'Create a project to enable local autosave.',project_placeholder:'Project name…',project_name_aria:'Project name',create:'Create',collection_placeholder:'Optional collection…',active_projects:'Active',archived_projects:'Archived',search_projects_placeholder:'Search projects…',all_collections:'All collections',sort_recent:'Most recent',sort_name:'Name',sort_file:'File',export_json:'Export JSON',import_json:'Import JSON',import_projects_aria:'Import projects from JSON file',section_history:'Recent history',clear_history:'Clear history',section_presets:'Style presets',presets_hint:'Save the current configuration with a name to reuse it.',preset_placeholder:'Preset name…',preset_name_aria:'Preset name'
  });
  Object.assign(T.en, {
    section_actions:'Actions',shortcuts_html:'<span aria-hidden="true">⌨️</span> <strong>Ctrl+S</strong> save project · <strong>Ctrl+Enter</strong> download · <strong>Ctrl+Shift+C</strong> copy · <strong>Ctrl+L</strong> clear',reset_defaults:'Restore default values',preview_aria:'Code preview',preview_controls_aria:'Preview viewport controls',fit:'Fit',center:'Center',zoom_out_aria:'Zoom out',zoom_in_aria:'Zoom in',reset_zoom_aria:'Reset zoom',reset_zoom_title:'Reset zoom',workspace_hint:'Select the shot to edit styles',quick_bg:'Background',quick_radius:'Radius',quick_shadow:'Shadow',quick_padding:'Padding',quick_save:'Save',metadata_aria:'Capture metadata',code_editor_aria:'Code editor: type or paste your code here',code_placeholder:'Type or paste your code here…'
  });
  Object.assign(T.en, {
    onboarding_eyebrow:'Your first shot in less than 30 seconds',onboarding_title:'Where will you publish?',onboarding_description:'Select a destination and we\'ll prepare a canvas with recommended proportions and style.',start_from_scratch:'Start from scratch',template_linkedin_small:'Professional post',template_github_small:'README or issue',template_blog_small:'Editorial hero',template_slide_small:'Conference slide',template_social_small:'Post for X',template_story_small:'Vertical format',template_eyebrow:'Start with a purpose',template_title:'Capture templates',close_templates_aria:'Close templates',filter_all:'All',filter_professional:'Professional',filter_documentation:'Documentation',filter_social_btn:'Social',filter_vertical:'Vertical',tpl_linkedin_size:'1200 × 627 · Professional',tpl_github_size:'1280 × 720 · Documentation',tpl_blog_size:'1600 × 900 · Editorial',tpl_slide_size:'1920 × 1080 · Presentation',tpl_social_size:'1600 × 900 · Social',tpl_story_size:'1080 × 1920 · Vertical'
  });
  Object.assign(T.en, {
    confirm_reset:'Restore all settings to default values?',confirm_delete_project:'Delete project "{name}"?',confirm_restore_version:'Restore version saved on {date}?',generating_image:'Generating image…',preparing_download:'Preparing download…',image_downloaded:'Image "{name}" downloaded.',copying_image:'Copying image…',image_copied:'Image copied to clipboard.',cannot_copy:'Could not copy.',copy_not_available:'Copy to clipboard not available.',render_lib_unavailable:'Could not start export: rendering library not available. Reload and try again.',export_security_error:'Could not export due to browser security restriction.',export_generic_error:'Could not generate image. Reduce scale and try again.',generating_zip:'Generating ZIP...',zip_downloaded:'ZIP downloaded.',zip_error:'Error generating ZIP.',generating_web_pack:'Generating Web Pack…',web_pack_downloaded:'Web Pack downloaded.',web_pack_downloaded_fallback:'Web Pack downloaded with PNG fallback for WEBP.',web_pack_error:'Error generating Web Pack.',lib_not_available:'Library not available.'
  });
  Object.assign(T.en, {
    batch_lib_unavailable:'Could not start batch: library not available.',batch_processing:'Processing file {index}/{total}: {name}',batch_downloaded_one:'Batch downloaded with {count} PNG capture.',batch_downloaded_many:'Batch downloaded with {count} PNG captures.',batch_error:'Could not complete batch. Check the selected files.',pack_lib_unavailable:'Could not start pack: library not available.',pack_generating:'Generating pack {label}: {index}/{total}…',pack_downloaded:'Pack {label} downloaded with {count} files.',pack_error:'Could not generate pack.',share_image_shared:'Image shared.',share_failed:'Could not share.',image_downloaded_manual:'Image downloaded. Share it manually.',share_lib_unavailable:'Export library not available.',share_image_error:'Error generating image.',link_copied:'Link copied to clipboard.',backup_downloaded:'Projects backup downloaded.',no_valid_projects:'No new valid projects to import.',projects_imported_one:'{count} project imported.',projects_imported_many:'{count} projects imported.',import_error:'Could not import backup. Check the JSON file.',project_saved_version:'Project saved as new version.',version_restored:'Last version restored.',assign_project_name:'Enter a name to create the first project.',no_recent_captures:'No recent captures.',no_saved_presets:'No saved presets.'
  });
  Object.assign(T.en, {
    autosave_active:'Local autosave active · {name} · {date}',no_active_project_status:'Create a project to enable local autosave.',no_active_projects:'No active projects yet.',no_archived_projects:'No archived projects.',no_search_results:'No projects match the search.',files_ready_one:'{count} file ready to export as PNG 2×.',files_ready_many:'{count} files ready to export as PNG 2×.',estimating:'Estimating…',real_weight:'Real size',estimation:'Estimate',bg_temp_warning:'Background image is temporary and not saved in projects.',font_not_available:'Font "{name}" not available; a fallback will be used.',horizontal_clipping:'Code exceeds frame width; increase width or reduce font size.',jpeg_transparency_warning:'JPG does not support transparency: exported on white background.',webp_not_supported:'This browser does not support WEBP; PNG will be used.',too_many_lines:'Snippet has {lines} lines; check readability before publishing.',long_line_warning:'There is a line with {chars} characters; check horizontal clipping.',low_resolution_warning:'Final resolution is low for social publishing; consider 2× or 3×.',high_resolution_warning:'Resolution is very high and may take longer to render.',date_locale:'en',project_lines:'{lines} lines',project_copy:'{name} (copy)',redownload_title:'Re-download',active_label:' Active',download_format:'Download {fmt}',vsc_shortcuts_html:'<span aria-hidden="true">⌨️</span> <strong>Ctrl+Enter</strong> download · <strong>Ctrl+Shift+C</strong> copy · <strong>Ctrl+L</strong> clear',vsc_brand_kit_hint:'Save your visual identity and apply it in one click.',onboarding_vsc_eyebrow:'First capture',onboarding_vsc_description:'Choose a destination to apply a recommended style.'
  });

  Object.assign(T.es, { template_slide_title:'Presentaci\u00f3n' });
  Object.assign(T.en, { template_slide_title:'Presentation' });

  function setupLangToggle() {
    document.querySelectorAll('.lang-toggle-btn').forEach(function(btn) {
      if (btn.__i18nBound) return;
      btn.__i18nBound = true;
      btn.addEventListener('click', function() {
        applyTranslations(window.__i18nLang === 'en' ? 'es' : 'en');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initLang();
      setupLangToggle();
    });
  } else {
    initLang();
    setupLangToggle();
  }
})();

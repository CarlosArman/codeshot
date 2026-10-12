// Service worker (Manifest V3) de CodeShot.
// Al hacer clic en el icono de la extensión, abre (o enfoca) la pestaña
// del editor en lugar de usar un popup pequeño, ya que la app necesita
// espacio completo para el panel de configuración y la vista previa.

chrome.action.onClicked.addListener(async () => {
  const appUrl = chrome.runtime.getURL('index.html');

  const existingTabs = await chrome.tabs.query({ url: appUrl });
  if (existingTabs.length > 0) {
    const tab = existingTabs[0];
    await chrome.tabs.update(tab.id, { active: true });
    if (tab.windowId !== undefined) {
      await chrome.windows.update(tab.windowId, { focused: true });
    }
    return;
  }

  await chrome.tabs.create({ url: appUrl });
});

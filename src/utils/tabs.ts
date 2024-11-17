import log from './logger';

export function getActiveTab(): Promise<chrome.tabs.Tab | null> {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const error = chrome.runtime.lastError;
      if (error) {
        log.error("Error retrieving current tab:", error);
        reject(error);
        return;
      }
      if (tabs.length === 0) {
        log.info("No active tabs found");
        resolve(null);
        return;
      }
      resolve(tabs[0]);
    });
  });
}

export function updateTab(tabId: number, updateProperties: chrome.tabs.UpdateProperties): Promise<chrome.tabs.Tab> {
  return new Promise((resolve, reject) => {
    chrome.tabs.update(tabId, updateProperties, (tab) => {
      const error = chrome.runtime.lastError;
      if (error) {
        // The error here is expected when the URL is illegal such as 'about:config'.
        log.info("Error updating tab:", error);
        reject(error);
      } else if (!tab) {
        log.info("Failed to update tab: tab is undefined");
        reject(new Error('Failed to update tab: tab is undefined'));
      } else {
        resolve(tab);
      }
    });
  });
}

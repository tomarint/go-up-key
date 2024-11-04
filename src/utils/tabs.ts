export function getCurrentTab(): Promise<chrome.tabs.Tab | null> {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError) {
        // console.log("Error retrieving current tab:", chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
        return;
      }
      if (tabs.length === 0) {
        // console.log("No active tabs found");
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
        // console.log("Error updating tab:", error);
        reject(error);
      } else if (!tab) {
        // console.log("Failed to update tab: tab is undefined");
        reject(new Error('Failed to update tab: tab is undefined'));
      } else {
        resolve(tab);
      }
    });
  });
}

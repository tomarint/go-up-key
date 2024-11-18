import log from './logger';

/**
 * Checks if the current platform is Mac.
 * @returns A promise that resolves to true if Mac, otherwise false.
 */
export async function checkIfMac(): Promise<boolean> {
  return new Promise((resolve) => {
    chrome.runtime.getPlatformInfo((info) => {
      if (chrome.runtime.lastError) {
        log.error("Error getting platform info:", chrome.runtime.lastError.message);
        resolve(false);
      } else {
        const isMac = info.os === 'mac';
        log.info(`Platform is Mac: ${isMac}`);
        resolve(isMac);
      }
    });
  });
}

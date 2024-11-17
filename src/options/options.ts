import log from '../utils/logger';
import { setOption, getOptions, Options } from '../utils/settings';

/**
 * Define interfaces for settings
 */
interface DefaultSetting {
  key: keyof Options;
  defaultValue: string;
  selector: string;
}

interface EventSetting {
  selector: string;
  key: keyof Options;
  event: string;
}

interface LocalizeElement {
  id: string;
  messageKey: string;
  messageKeyMac?: string;
}

/**
 * Restores options from chrome.storage and updates the UI elements.
 */
async function restoreOptions(): Promise<void> {
  try {
    const options = await getOptions();
    
    const defaultSettings: DefaultSetting[] = [
      { key: 'OptionCtrlUp', defaultValue: '1', selector: '#OptionCtrlUp' },
      { key: 'OptionAltUp', defaultValue: '1', selector: '#OptionAltUp' },
      // Add other settings here
    ];

    defaultSettings.forEach((setting: DefaultSetting) => {
      const element = document.querySelector(setting.selector) as HTMLInputElement | null;
      if (element === null) {
        log.warn(`Element with selector ${setting.selector} not found`);
      } else {
        element.value = options[setting.key] || setting.defaultValue;
        log.debug(`Restored ${setting.key}:`, options[setting.key]);
      }
    });
  } catch (error) {
    log.error("Failed to restore options:", error);
  }
}

/**
 * Registers event handlers for UI elements to save options.
 */
function registerEventHandlers(): void {
  const settings: EventSetting[] = [
    { selector: '#OptionCtrlUp', key: 'OptionCtrlUp', event: 'change' },
    { selector: '#OptionAltUp', key: 'OptionAltUp', event: 'change' },
    // Add other settings here
  ];

  settings.forEach((setting: EventSetting) => {
    const element = document.querySelector(setting.selector) as HTMLInputElement | null;
    if (element === null) {
      log.warn(`Element with selector ${setting.selector} not found`);
    } else {
      element.addEventListener(setting.event, () => {
        const value = element.value;
        setOption(setting.key, value);
      });
    }
  });
}

/**
 * Localizes the UI elements based on the current platform.
 */
async function localizePage(): Promise<void> {
  try {
    const isMac = await checkIfMac(); // Assume this function is defined below
    
    const elements: LocalizeElement[] = [
      { id: 'strOptionsHeader', messageKey: 'strOptionsHeader' },
      { id: 'strOptionCtrlUp', messageKey: 'strOptionCtrlUp', messageKeyMac: 'strOptionCtrlUpMac' },
      { id: 'strOptionCtrlUpDisabled', messageKey: 'strOptionCtrlUpDisabled' },
      { id: 'strOptionCtrlUpLevel1', messageKey: 'strOptionCtrlUpLevel1' },
      { id: 'strOptionCtrlUpLevel2', messageKey: 'strOptionCtrlUpLevel2' },
      { id: 'strOptionAltUp', messageKey: 'strOptionAltUp', messageKeyMac: 'strOptionAltUpMac' },
      { id: 'strOptionAltUpDisabled', messageKey: 'strOptionAltUpDisabled' },
      { id: 'strOptionAltUpLevel1', messageKey: 'strOptionAltUpLevel1' },
      { id: 'strOptionAltUpLevel2', messageKey: 'strOptionAltUpLevel2' },
      // Add other localization elements here
    ];

    elements.forEach((element: LocalizeElement) => {
      const el = document.getElementById(element.id);
      if (el === null) {
        log.warn(`Element with id ${element.id} not found`);
      } else {
        let messageKey = element.messageKey;
        if (isMac && element.messageKeyMac) {
          messageKey = element.messageKeyMac;
        }
        el.textContent = chrome.i18n.getMessage(messageKey);
        el.classList.remove('invisible-text');
        log.debug(`Localized element ${element.id} with messageKey ${messageKey}`);
      }
    });
  } catch (error) {
    log.error("An error occurred while localizing the page:", error);
  }
}

/**
 * Checks if the current platform is Mac.
 * @returns A promise that resolves to true if Mac, otherwise false.
 */
async function checkIfMac(): Promise<boolean> {
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

/**
 * Initializes the options page by restoring options and registering event handlers.
 */
async function onDomContentLoaded(): Promise<void> {
  await restoreOptions();
  registerEventHandlers();
  await localizePage();
}

// Register the DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", onDomContentLoaded);

import log from '../utils/logger';
import { setOption, getOptions, Options } from '../utils/settings';
import { checkIfMac } from '../utils/platform';

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
}

/**
 * Restores options from chrome.storage and updates the UI elements.
 */
async function restoreOptions(): Promise<void> {
  try {
    const options = await getOptions();
    
    const defaultSettings: DefaultSetting[] = [
      { key: 'OptionWinCtrlUp', defaultValue: '1', selector: '#OptionWinCtrlUp' },
      { key: 'OptionWinAltUp', defaultValue: '1', selector: '#OptionWinAltUp' },
      { key: 'OptionMacCommandUp', defaultValue: '1', selector: '#OptionMacCommandUp' },
      { key: 'OptionMacOptionUp', defaultValue: '1', selector: '#OptionMacOptionUp' },
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
    { selector: '#OptionWinCtrlUp', key: 'OptionWinCtrlUp', event: 'change' },
    { selector: '#OptionWinAltUp', key: 'OptionWinAltUp', event: 'change' },
    { selector: '#OptionMacCommandUp', key: 'OptionMacCommandUp', event: 'change' },
    { selector: '#OptionMacOptionUp', key: 'OptionMacOptionUp', event: 'change' },
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
    const elements: LocalizeElement[] = [
      { id: 'strOptionsWinHeader', messageKey: 'strOptionsWinHeader' },

      { id: 'strOptionWinCtrlUp', messageKey: 'strOptionWinCtrlUp' },
      { id: 'strOptionWinCtrlUpDisabled', messageKey: 'strOptionWinCtrlUpDisabled' },
      { id: 'strOptionWinCtrlUpLevel1', messageKey: 'strOptionWinCtrlUpLevel1' },
      { id: 'strOptionWinCtrlUpLevel2', messageKey: 'strOptionWinCtrlUpLevel2' },

      { id: 'strOptionWinAltUp', messageKey: 'strOptionWinAltUp' },
      { id: 'strOptionWinAltUpDisabled', messageKey: 'strOptionWinAltUpDisabled' },
      { id: 'strOptionWinAltUpLevel1', messageKey: 'strOptionWinAltUpLevel1' },
      { id: 'strOptionWinAltUpLevel2', messageKey: 'strOptionWinAltUpLevel2' },

      { id: 'strOptionsMacHeader', messageKey: 'strOptionsMacHeader' },

      { id: 'strOptionMacCommandUp', messageKey: 'strOptionMacCommandUp' },
      { id: 'strOptionMacCommandUpDisabled', messageKey: 'strOptionMacCommandUpDisabled' },
      { id: 'strOptionMacCommandUpLevel1', messageKey: 'strOptionMacCommandUpLevel1' },
      { id: 'strOptionMacCommandUpLevel2', messageKey: 'strOptionMacCommandUpLevel2' },

      { id: 'strOptionMacOptionUp', messageKey: 'strOptionMacOptionUp' },
      { id: 'strOptionMacOptionUpDisabled', messageKey: 'strOptionMacOptionUpDisabled' },
      { id: 'strOptionMacOptionUpLevel1', messageKey: 'strOptionMacOptionUpLevel1' },
      { id: 'strOptionMacOptionUpLevel2', messageKey: 'strOptionMacOptionUpLevel2' },
    
      // Add other localization elements here
    ];

    elements.forEach((element: LocalizeElement) => {
      const el = document.getElementById(element.id);
      if (el === null) {
        log.warn(`Element with id ${element.id} not found`);
      } else {
        let messageKey = element.messageKey;
        el.textContent = chrome.i18n.getMessage(messageKey);
        // el.classList.remove('invisible-text');
        log.debug(`Localized element ${element.id} with messageKey ${messageKey}`);
      }
    });
  } catch (error) {
    log.error("An error occurred while localizing the page:", error);
  }
}

/**
 * Shows platform-specific options and hides others.
 */
async function showPlatformSpecificOptions(): Promise<void> {
  const isMac = await checkIfMac();
  const windowsOptions = document.getElementById('windows-options');
  const macOptions = document.getElementById('mac-options');

  if (isMac) {
    if (windowsOptions) windowsOptions.style.display = 'none';
  } else {
    if (macOptions) macOptions.style.display = 'none';
  }
}

/**
 * Displays the body after initialization to prevent flicker.
 */
function showBody(): void {
  document.body.style.display = 'block';
}

/**
 * Initializes the options page by restoring options and registering event handlers.
 */
async function onDomContentLoaded(): Promise<void> {
  await restoreOptions();
  registerEventHandlers();
  await localizePage();
  await showPlatformSpecificOptions();
  showBody();
}

// Register the DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", onDomContentLoaded);

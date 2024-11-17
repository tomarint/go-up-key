import log from '../utils/logger';
import { getOption, Options } from '../utils/settings';
import { getActiveTab, updateTab } from '../utils/tabs';
import { getParentUrl } from '../utils/urls';

/**
 * Initializes the background script.
 */
function initializeBackground(): void {
  log.info("Background script initialized.");
  
  // Example: Listen for command events
  chrome.commands.onCommand.addListener((command) => {
    handleCommand(command);
  });
  // Remove the callback when the extension is disabled
  chrome.runtime.onSuspend.addListener(() => {
    chrome.commands.onCommand.removeListener(handleCommand);
  });
}

async function goUp(levels: number): Promise<void> {
  try {
    const tab = await getActiveTab();
    if (tab && tab.url) {
      log.info("Current URL:", tab.url);
      const url = getParentUrl(tab.url, levels);
      log.info("New URL:", url);
      if (tab.id !== undefined) {
        try {
          // updateTab() may throw an error if the URL is illegal such as 'about:config'.
          // In this case, the error is logged and the function continues.
          await updateTab(tab.id, { url: url });
        }
        catch (error) {
          log.info("Failed to update tab:", error);
        }
      } else {
        log.warn("Tab ID is undefined. Cannot update tab.");
      }
    }
  } catch (error: any) {
    log.error("Error in go-up-key command:", error);
    throw new Error("Failed to go up: " + error.message);
  }
}


/**
 * Handles keyboard commands from the user.
 * @param command - The command identifier.
 */
async function handleCommand(command: string): Promise<void> {
  try {
    let optionKey: keyof Options;
    if (command === "go-up-key-ctrl-up") {
      optionKey = 'OptionCtrlUp';
    } else if (command === "go-up-key-alt-up") {
      optionKey = 'OptionAltUp';
    } else {
      log.warn(`Unhandled command: ${command}`);
      return;
    }
    
    const optionValue = await getOption(optionKey);
    if (optionValue === '2') {
      log.info(`${command} is 2 levels up. Executing action twice.`);
      await goUp(2);
    } else if (optionValue === '1') {
      log.info(`${command} is 1 level up. Executing action once.`);
      await goUp(1);
    } else {
      log.info(`${command} is disabled.`);
    }
  } catch (error) {
    log.error("Error handling command:", error);
  }
}

initializeBackground();

export {};


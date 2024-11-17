import log from '../utils/logger';
import { getOption, Options } from '../utils/settings';
import { getCurrentTab, updateTab } from '../utils/tabs';
import { parentUrl } from '../utils/urls';

/**
 * Initializes the background script.
 */
function initializeBackground(): void {
  log.info("Background script initialized.");
  
  // Example: Listen for command events
  chrome.commands.onCommand.addListener((command) => {
    handleCommand(command);
  });
}

async function goUp(levels: number): Promise<void> {
  try {
    const tab = await getCurrentTab();
    if (tab && tab.url) {
      log.info("Current URL:", tab.url);
      const url = await parentUrl(tab.url, levels);
      log.info("New URL:", url);
      await updateTab(tab.id!, { url: url });
    }
  } catch (error) {
    log.info("Error in go-up-key command:", error);
  }
}


/**
 * Handles keyboard commands from the user.
 * @param command - The command identifier.
 */
async function handleCommand(command: string): Promise<void> {
  try {
    if (command === "go-up-key-ctrl-up") {
      const optionCtrlUp = await getOption('OptionCtrlUp');
      if (optionCtrlUp === '2') {
        log.info("Ctrl+Up command is 2 levels up. Executing action twice.");
        await goUp(2);
      } else if (optionCtrlUp === '1') {
        log.info("Ctrl+Up command is 1 level up. Executing action once.");
        await goUp(1);
      } else {
        log.info("Ctrl+Up command is disabled.");
      }
    }
    
    if (command === "go-up-key-alt-up") {
      const optionAltUp = await getOption('OptionAltUp');
      if (optionAltUp === '2') {
        log.info("Alt+Up command is 2 levels up. Executing action twice.");
        await goUp(2);
      } else if (optionAltUp === '1') {
        log.info("Alt+Up command is 1 level up. Executing action once.");
        await goUp(1);
      } else {
        log.info("Alt+Up command is disabled.");
      }
    }
    
    // Add handling for other commands as needed
  } catch (error) {
    log.info("Error handling command:", error);
  }
}

initializeBackground();

export {};


import { getCurrentTab, updateTab } from '../utils/tabs';
import { parentUrl } from '../utils/urls';

// Command listener
chrome.commands.onCommand.addListener(async (command) => {
  // console.log("Command:", command);
  if (command === "go-up-key") {
    try {
      const tab = await getCurrentTab();
      if (tab && tab.url) {
        // console.log("Current URL:", tab.url);
        const url = await parentUrl(tab.url);
        // console.log("New URL:", url);
        await updateTab(tab.id!, { url: url });
      }
    } catch (error) {
      // console.log("Error in go-up-key command:", error);
    }
  }
});

export {};

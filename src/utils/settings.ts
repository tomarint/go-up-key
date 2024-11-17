// Define the structure of the options
export interface Options {
  OptionCtrlUp: string;
  OptionAltUp: string;
  // Add other options as needed
}

/**
 * Saves a single option to chrome.storage.sync.
 * @param key - The option key.
 * @param value - The option value.
 */
export function setOption(key: keyof Options, value: string): void {
  const data: Partial<Options> = {
    [key]: value
  };
  chrome.storage.sync.set(data, () => {
    if (chrome.runtime.lastError) {
      console.error(`Error saving ${key}:`, chrome.runtime.lastError.message);
    } else {
      console.info(`Saved ${key}:`, value);
    }
  });
}

/**
 * Retrieves a single option from chrome.storage.sync.
 * @param key - The option key.
 * @returns A promise that resolves to the option value.
 */
export function getOption(key: keyof Options): Promise<string> {
  const defaultOptions: Partial<Options> = {
    OptionCtrlUp: '1',
    OptionAltUp: '1',
    // Initialize other options with default values
  };

  return new Promise((resolve, reject) => {
    chrome.storage.sync.get([key], (items) => {
      if (chrome.runtime.lastError) {
        console.error(`Error retrieving ${key}:`, chrome.runtime.lastError.message);
        reject(chrome.runtime.lastError);
      } else {
        const value = items[key] || defaultOptions[key];
        console.info(`Retrieved ${key}:`, value);
        resolve(value as string);
      }
    });
  });
}

/**
 * Retrieves all options from chrome.storage.sync.
 * @returns A promise that resolves to the options.
 */
export function getOptions(): Promise<Options> {
  const defaultOptions: Options = {
    OptionCtrlUp: '1',
    OptionAltUp: '1',
    // Initialize other options with default values
  };
  
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(defaultOptions, (items) => {
      if (chrome.runtime.lastError) {
        console.error("Error retrieving options:", chrome.runtime.lastError.message);
        reject(chrome.runtime.lastError);
      } else {
        console.info("Retrieved options:", items);
        resolve(items as Options);
      }
    });
  });
}

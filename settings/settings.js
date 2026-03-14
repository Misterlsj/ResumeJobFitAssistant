/**
 * Settings page controller for Resume Job-Fit Assistant
 */

const STORAGE_KEY = 'extensionSettings';

// DOM Elements
const elements = {
  enabledToggle: document.getElementById('enabledToggle'),
  autoDetectToggle: document.getElementById('autoDetectToggle')
};

/**
 * Loads settings from chrome.storage.local
 */
async function loadSettings() {
  try {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    const settings = result[STORAGE_KEY] || {
      enabled: true,
      autoDetect: true
    };

    // Update UI
    elements.enabledToggle.checked = settings.enabled;
    elements.autoDetectToggle.checked = settings.autoDetect;

  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

/**
 * Saves settings to chrome.storage.local
 */
async function saveSettings() {
  const settings = {
    enabled: elements.enabledToggle.checked,
    autoDetect: elements.autoDetectToggle.checked
  };

  try {
    await chrome.storage.local.set({ [STORAGE_KEY]: settings });
    console.log('Settings saved:', settings);
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

// Event Listeners
elements.enabledToggle?.addEventListener('change', saveSettings);
elements.autoDetectToggle?.addEventListener('change', saveSettings);

// Initialize
document.addEventListener('DOMContentLoaded', loadSettings);

console.log('Settings page initialized');

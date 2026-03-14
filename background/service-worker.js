/**
 * Background Service Worker for Resume Job-Fit Assistant
 * Handles cross-tab communication, storage, and webNavigation events
 */

// Storage keys
const STORAGE_KEYS = {
  SESSION_JOB_DATA: 'currentJobData',
  SETTINGS: 'extensionSettings'
};

// Default settings
const DEFAULT_SETTINGS = {
  enabled: true,
  autoDetect: true,
  sidebarEnabled: false  // Phase 2 feature
};

/**
 * Initializes extension settings on install
 */
async function initializeSettings() {
  const { settings } = await chrome.storage.local.get(STORAGE_KEYS.SETTINGS);

  if (!settings) {
    await chrome.storage.local.set({
      [STORAGE_KEYS.SETTINGS]: DEFAULT_SETTINGS
    });
  }
}

/**
 * Handles job detection messages from content scripts
 * @param {Object} message - Message from content script
 * @param {Object} sender - Message sender info
 * @returns {Object} Response to content script
 */
async function handleJobDetected(message, sender) {
  if (message.type !== 'JOB_DETECTED') {
    return { success: false };
  }

  const { data } = message;

  // Store job data in session storage (cleared on browser close)
  await chrome.storage.session.set({
    [STORAGE_KEYS.SESSION_JOB_DATA]: {
      ...data,
      detectedAt: Date.now(),
      tabId: sender.tab?.id
    }
  });

  // Update extension icon to show detection
  if (sender.tab?.id) {
    await chrome.action.setIcon({
      tabId: sender.tab.id,
      path: {
        '16': 'assets/icon-16.png',
        '48': 'assets/icon-48.png',
        '128': 'assets/icon-128.png'
      }
    });

    // Set badge to indicate job found
    await chrome.action.setBadgeText({
      tabId: sender.tab.id,
      text: '✓'
    });
    await chrome.action.setBadgeBackgroundColor({
      tabId: sender.tab.id,
      color: '#4CAF50'
    });

    // Send message to content script to show floating badge
    chrome.tabs.sendMessage(sender.tab.id, {
      type: 'JOB_DETECTED_BADGE',
      data: data
    }).catch(() => {
      // Content script might not be ready yet
    });
  }

  return { success: true };
}

/**
 * Handles LinkedIn SPA navigation using webNavigation API
 * LinkedIn uses pushState which doesn't trigger content script reload
 */
function handleHistoryStateUpdated(details) {
  if (details.frameId !== 0) return; // Only main frame

  const url = details.url;
  if (!url.includes('linkedin.com/jobs/view')) return;

  // Inject a script to re-run extraction
  chrome.scripting.executeScript({
    target: { tabId: details.tabId },
    func: () => {
      // Dispatch custom event to trigger extraction
      window.dispatchEvent(new CustomEvent('resume-assistant-reextract'));
    }
  }).catch(() => {
    // Tab might be closed or invalid
  });
}

/**
 * Clears job data when tab is closed or navigated away
 */
async function handleTabRemoved(tabId) {
  const { currentJobData } = await chrome.storage.session.get(STORAGE_KEYS.SESSION_JOB_DATA);

  if (currentJobData && currentJobData.tabId === tabId) {
    await chrome.storage.session.remove(STORAGE_KEYS.SESSION_JOB_DATA);
  }
}

/**
 * Clears badge when tab is updated (user navigated away)
 */
async function handleTabUpdated(tabId, changeInfo) {
  if (changeInfo.status === 'complete' || changeInfo.url) {
    const url = changeInfo.url || (await chrome.tabs.get(tabId)).url;

    // Clear badge if not on a supported job page
    if (!isSupportedJobPage(url)) {
      await chrome.action.setBadgeText({ tabId, text: '' });

      // Hide floating badge
      chrome.tabs.sendMessage(tabId, {
        type: 'HIDE_BADGE'
      }).catch(() => {
        // Ignore errors
      });
    }
  }
}

/**
 * Checks if URL is a supported job page
 * @param {string} url - URL to check
 * @returns {boolean} True if supported job page
 */
function isSupportedJobPage(url) {
  if (!url) return false;

  const supportedPatterns = [
    'linkedin.com/jobs/view',
    'indeed.com/viewjob',
    'indeed.com/jobs',
    'glassdoor.com/job-listing',
    'jobs.lever.co',
    'boards.greenhouse.io'
  ];

  return supportedPatterns.some(pattern => url.includes(pattern));
}

/**
 * Handles extension install/update
 */
chrome.runtime.onInstalled.addListener(async (details) => {
  await initializeSettings();

  if (details.reason === 'install') {
    console.log('Resume Job-Fit Assistant installed');
  } else if (details.reason === 'update') {
    console.log('Resume Job-Fit Assistant updated');
  }
});

/**
 * Handles messages from content scripts and popup
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'JOB_DETECTED') {
    handleJobDetected(message, sender).then(sendResponse);
    return true; // Async response
  }

  if (message.type === 'GET_JOB_DATA') {
    chrome.storage.session.get(STORAGE_KEYS.SESSION_JOB_DATA).then(result => {
      sendResponse({ data: result[STORAGE_KEYS.SESSION_JOB_DATA] || null });
    });
    return true; // Async response
  }

  if (message.type === 'OPEN_WEBSITE') {
    const { jobData, websiteUrl } = message;

    if (jobData) {
      // Encode job data into URL parameters
      const params = new URLSearchParams({
        source: 'extension',
        job_title: jobData.job_title,
        company: jobData.company_name,
        location: jobData.location,
        jd: btoa(unescape(encodeURIComponent(jobData.job_description_raw))),
        job_url: jobData.job_url
      });

      const finalUrl = `${websiteUrl}?${params.toString()}`;

      chrome.tabs.create({ url: finalUrl }).then(() => {
        sendResponse({ success: true });
      }).catch(() => {
        sendResponse({ success: false });
      });
    } else {
      sendResponse({ success: false });
    }
    return true; // Async response
  }

  if (message.type === 'HIGHLIGHT_ICON') {
    // Flash the extension badge to draw user attention
    if (sender.tab?.id) {
      const originalText = '✓';

      // Flash animation: clear → show → clear
      chrome.action.setBadgeText({ tabId: sender.tab.id, text: '' });
      setTimeout(() => {
        chrome.action.setBadgeText({
          tabId: sender.tab.id,
          text: originalText
        });
        chrome.action.setBadgeBackgroundColor({
          tabId: sender.tab.id,
          color: '#4CAF50'
        });
      }, 150);
      setTimeout(() => {
        chrome.action.setBadgeText({
          tabId: sender.tab.id,
          text: originalText
        });
      }, 300);

      sendResponse({ success: true });
    } else {
      sendResponse({ success: false });
    }
    return true; // Async response
  }

  return false;
});

/**
 * Listen for SPA navigation (mainly LinkedIn)
 */
if (chrome.webNavigation && chrome.webNavigation.onHistoryStateUpdated) {
  chrome.webNavigation.onHistoryStateUpdated.addListener(handleHistoryStateUpdated);
} else {
  console.warn('Resume Assistant: webNavigation API not available, LinkedIn SPA navigation may not work properly');
}

/**
 * Listen for tab removal
 */
chrome.tabs.onRemoved.addListener(handleTabRemoved);

/**
 * Listen for tab updates
 */
chrome.tabs.onUpdated.addListener(handleTabUpdated);

// Log service worker activation
console.log('Resume Job-Fit Assistant service worker active');

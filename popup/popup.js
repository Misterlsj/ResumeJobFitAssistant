/**
 * Popup controller for Resume Job-Fit Assistant
 * Handles UI state, job data display, and user interactions
 */

// DOM Elements
const elements = {
  loadingState: document.getElementById('loadingState'),
  noJobState: document.getElementById('noJobState'),
  jobState: document.getElementById('jobState'),
  errorState: document.getElementById('errorState'),

  jobTitle: document.getElementById('jobTitle'),
  companyName: document.getElementById('companyName'),
  location: document.getElementById('location'),
  descriptionPreview: document.getElementById('descriptionPreview'),
  descLength: document.getElementById('descLength'),
  platformText: document.getElementById('platformText'),

  tailorBtn: document.getElementById('tailorBtn'),
  retryBtn: document.getElementById('retryBtn'),
  settingsBtn: document.getElementById('settingsBtn'),
  errorMessage: document.getElementById('errorMessage')
};

// Website URL for CTA
const WEBSITE_URL = 'https://resumescorer.com/tailor';

/**
 * Capitalizes platform name for display
 * @param {string} platform - Platform name (e.g., 'linkedin')
 * @returns {string} Capitalized platform name
 */
function capitalizePlatform(platform) {
  const platformNames = {
    linkedin: 'LinkedIn',
    indeed: 'Indeed',
    glassdoor: 'Glassdoor',
    lever: 'Lever',
    greenhouse: 'Greenhouse'
  };
  return platformNames[platform] || platform.charAt(0).toUpperCase() + platform.slice(1);
}

/**
 * Shows a specific state and hides others
 * @param {string} stateName - Name of the state to show
 */
function showState(stateName) {
  Object.values(elements).forEach(el => {
    if (el && el.classList && el.classList.contains('state')) {
      el.classList.add('hidden');
    }
  });

  const stateElement = elements[`${stateName}State`];
  if (stateElement) {
    stateElement.classList.remove('hidden');
  }
}

/**
 * Displays job data in the popup
 * @param {Object} jobData - Job data object
 */
function displayJobData(jobData) {
  if (!jobData) {
    showState('noJob');
    return;
  }

  try {
    // Populate job details
    elements.jobTitle.textContent = jobData.job_title || 'Unknown Position';
    elements.companyName.textContent = jobData.company_name || 'Unknown Company';
    elements.location.textContent = jobData.location || 'Unknown Location';

    // Update platform badge
    const platformName = jobData.platform ? capitalizePlatform(jobData.platform) : 'Job';
    elements.platformText.textContent = `${platformName} detected`;

    // Handle description preview
    const description = jobData.job_description_raw || 'No description available';
    elements.descriptionPreview.textContent = description;
    elements.descLength.textContent = `${description.length.toLocaleString()} chars`;

    showState('job');

  } catch (error) {
    console.error('Error displaying job data:', error);
    showError('Failed to display job data. Please try again.');
  }
}

/**
 * Shows error state with message
 * @param {string} message - Error message to display
 */
function showError(message) {
  elements.errorMessage.textContent = message;
  showState('error');
}

/**
 * Fetches job data from storage
 * @returns {Promise<Object|null>} Job data or null
 */
async function fetchJobData() {
  try {
    const response = await chrome.runtime.sendMessage({ type: 'GET_JOB_DATA' });
    return response?.data || null;
  } catch (error) {
    console.error('Error fetching job data:', error);
    return null;
  }
}

/**
 * Initializes the popup
 */
async function initPopup() {
  showState('loading');

  // Fetch job data from background
  const jobData = await fetchJobData();

  if (jobData) {
    // Check if data is stale (older than 1 hour)
    const dataAge = Date.now() - (jobData.detectedAt || 0);
    const hourInMs = 60 * 60 * 1000;

    if (dataAge > hourInMs) {
      showState('noJob');
    } else {
      displayJobData(jobData);
    }
  } else {
    showState('noJob');
  }
}

/**
 * Encodes and opens website with job data
 * @param {Object} jobData - Job data to encode
 */
async function openWebsite(jobData) {
  if (!jobData) {
    showError('No job data available. Please navigate to a job posting first.');
    return;
  }

  try {
    // Truncate description if needed
    let description = jobData.job_description_raw || '';
    const maxEncodedLength = 8000;

    // Encode and check length
    let encoded = btoa(unescape(encodeURIComponent(description)));

    if (encoded.length > maxEncodedLength) {
      // Binary search for truncation point
      let left = 0;
      let right = description.length;

      while (left < right) {
        const mid = Math.floor((left + right + 1) / 2);
        const truncated = description.substring(0, mid);
        const testEncoded = btoa(unescape(encodeURIComponent(truncated)));

        if (testEncoded.length <= maxEncodedLength) {
          description = truncated;
          left = mid;
        } else {
          right = mid - 1;
        }
      }
    }

    // Build URL with parameters
    const params = new URLSearchParams({
      source: 'extension',
      job_title: jobData.job_title,
      company: jobData.company_name,
      location: jobData.location,
      jd: btoa(unescape(encodeURIComponent(description))),
      job_url: jobData.job_url
    });

    const finalUrl = `${WEBSITE_URL}?${params.toString()}`;

    // Open in new tab
    await chrome.tabs.create({ url: finalUrl });

  } catch (error) {
    console.error('Error opening website:', error);
    showError('Failed to open website. Please try again.');
  }
}

/**
 * Handles CTA button click
 */
async function handleTailorClick() {
  const jobData = await fetchJobData();

  if (jobData) {
    await openWebsite(jobData);
  } else {
    showError('Job data not found. Please refresh the page and try again.');
  }
}

/**
 * Handles settings button click
 */
function handleSettingsClick() {
  chrome.tabs.create({ url: chrome.runtime.getURL('settings/settings.html') });
}

/**
 * Handles retry button click
 */
async function handleRetryClick() {
  await initPopup();
}

// Event Listeners
elements.tailorBtn?.addEventListener('click', handleTailorClick);
elements.retryBtn?.addEventListener('click', handleRetryClick);
elements.settingsBtn?.addEventListener('click', handleSettingsClick);

// Initialize popup when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPopup);
} else {
  initPopup();
}

// Log for debugging
console.log('Resume Assistant popup initialized');

/**
 * LinkedIn-specific job data extraction
 * Handles LinkedIn's React SPA with dynamic navigation
 */

// LinkedIn DOM selectors (configurable for easy updates)
const LINKEDIN_SELECTORS = {
  jobTitle: [
    'h1[data-anonymize="person-name"]',
    '.top-card-layout__title',
    'h1.topcard__title'
  ],
  company: [
    '[data-anonymize="company-name"]',
    '.topcard-layout__first-subline',
    '.topcard__flavor-row span:nth-child(1)'
  ],
  location: [
    '.topcard__flavor-row span:nth-child(2)',
    '.topcard-layout__second-subline',
    '[data-anonymize="job-location"]'
  ],
  jobDescription: [
    '.description__text',
    '.show-more-less-html__markup',
    '#job-details'
  ]
};

/**
 * Safely queries multiple selectors and returns first match
 * @param {string[]} selectors - Array of CSS selectors to try
 * @param {Element} root - Root element to search from (default: document)
 * @returns {Element|null} First matching element or null
 */
function queryFirstSelector(selectors, root = document) {
  for (const selector of selectors) {
    try {
      const element = root.querySelector(selector);
      if (element) return element;
    } catch (error) {
      // Invalid selector, continue to next
      continue;
    }
  }
  return null;
}

/**
 * Extracts text content from element, with cleanup
 * @param {Element|null} element - DOM element
 * @returns {string} Cleaned text content
 */
function extractText(element) {
  if (!element) return '';
  return element.textContent?.trim() || '';
}

/**
 * Extracts job description from LinkedIn job page
 * @returns {string} Job description text
 */
function extractJobDescription() {
  const descElement = queryFirstSelector(LINKEDIN_SELECTORS.jobDescription);

  if (!descElement) {
    return '';
  }

  // Get text content, preserving structure
  let text = descElement.textContent || '';

  // Clean up common LinkedIn artifacts
  text = text
    .replace(/Show more\s*/g, '')
    .replace(/Show less\s*/g, '')
    .replace(/\n\s*\n/g, '\n\n')  // Normalize multiple newlines
    .trim();

  return text;
}

/**
 * Main extraction function for LinkedIn
 * @returns {Object|null} Job data object or null if not found
 */
async function extractJobData() {
  // Verify we're on a LinkedIn job page
  if (!window.location.href.includes('linkedin.com/jobs/view')) {
    return null;
  }

  try {
    // Wait for page to be ready (LinkedIn is async)
    const jobTitleElement = queryFirstSelector(LINKEDIN_SELECTORS.jobTitle);

    if (!jobTitleElement) {
      // Page might still be loading
      return null;
    }

    const jobTitle = extractText(jobTitleElement);
    const companyElement = queryFirstSelector(LINKEDIN_SELECTORS.company);
    const company = extractText(companyElement);
    const locationElement = queryFirstSelector(LINKEDIN_SELECTORS.location);
    const location = extractText(locationElement);
    const jobDescription = extractJobDescription();

    // Validate we have minimum required data
    if (!jobTitle || !company) {
      console.warn('Resume Assistant: Missing required job data');
      return null;
    }

    const jobData = {
      job_title: jobTitle,
      company_name: company,
      location: location || 'Not specified',
      job_description_raw: jobDescription || 'No description available',
      job_url: window.location.href,
      platform: 'linkedin'
    };

    // Log detection and send to background
    logDetectionStatus('LinkedIn', true, jobData);
    await sendJobData(jobData);

    return jobData;

  } catch (error) {
    console.error('Resume Assistant: Error extracting LinkedIn job data', error);
    return null;
  }
}

/**
 * Sets up MutationObserver to detect LinkedIn SPA navigation
 * LinkedIn uses pushState for navigation without full page reloads
 */
function setupLinkedInObserver() {
  // Target the job detail panel container
  const targetSelector = '.jobs-search-results, [data-view-name="job-detail-panel"]';
  const targetElement = document.querySelector(targetSelector);

  if (!targetElement) {
    // If target not found yet, retry after delay
    setTimeout(setupLinkedInObserver, 500);
    return;
  }

  const observer = new MutationObserver((mutations) => {
    // Check if job content changed
    for (const mutation of mutations) {
      if (mutation.type === 'childList' || mutation.type === 'characterData') {
        // Debounce extraction
        if (window.linkedinExtractionTimer) {
          clearTimeout(window.linkedinExtractionTimer);
        }
        window.linkedinExtractionTimer = setTimeout(extractJobData, 300);
        break;
      }
    }
  });

  observer.observe(targetElement, {
    childList: true,
    subtree: true,
    characterData: true
  });

  console.log('Resume Assistant: LinkedIn observer active');
}

/**
 * Initializes the LinkedIn content script
 */
function initLinkedInScript() {
  // Check if page is already loaded
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // Try extraction immediately
    extractJobData();
  }

  // Also set up observer for SPA navigation
  setupLinkedInObserver();

  // Fallback: Listen for popstate events (back/forward navigation)
  window.addEventListener('popstate', () => {
    setTimeout(extractJobData, 100);
  });

  // Also check on visibility change (user returns to tab)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      extractJobData();
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLinkedInScript);
} else {
  initLinkedInScript();
}

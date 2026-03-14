/**
 * Glassdoor-specific job data extraction
 */

const GLASSDOOR_SELECTORS = {
  jobTitle: [
    '.jobTitle',
    '[class*="JobTitle"]',
    'h1[class*="title"]'
  ],
  company: [
    '.employerName',
    '[class*="employerName"]',
    '[class*="companyName"]'
  ],
  location: [
    '.location',
    '[class*="location"]',
    '.job-location'
  ],
  jobDescription: [
    '.jobDescription',
    '#JobDescription',
    '[class*="jobDescription"]',
    '.description'
  ]
};

/**
 * Safely queries multiple selectors and returns first match
 */
function queryFirstSelector(selectors, root = document) {
  for (const selector of selectors) {
    try {
      const element = root.querySelector(selector);
      if (element) return element;
    } catch (error) {
      continue;
    }
  }
  return null;
}

/**
 * Extracts text content from element, with cleanup
 */
function extractText(element) {
  if (!element) return '';
  return element.textContent?.trim() || '';
}

/**
 * Extracts job description from Glassdoor job page
 */
function extractJobDescription() {
  const descElement = queryFirstSelector(GLASSDOOR_SELECTORS.jobDescription);

  if (!descElement) {
    return '';
  }

  let text = descElement.textContent || '';

  // Clean up
  text = text
    .replace(/Show More\s*/g, '')
    .replace(/Show Less\s*/g, '')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();

  return text;
}

/**
 * Main extraction function for Glassdoor
 */
async function extractJobData() {
  // Verify we're on a Glassdoor job page
  if (!window.location.href.includes('glassdoor.com/job-listing')) {
    return null;
  }

  try {
    const jobTitleElement = queryFirstSelector(GLASSDOOR_SELECTORS.jobTitle);

    if (!jobTitleElement) {
      return null;
    }

    const jobTitle = extractText(jobTitleElement);
    const companyElement = queryFirstSelector(GLASSDOOR_SELECTORS.company);
    const company = extractText(companyElement);
    const locationElement = queryFirstSelector(GLASSDOOR_SELECTORS.location);
    const location = extractText(locationElement);
    const jobDescription = extractJobDescription();

    if (!jobTitle) {
      console.warn('Resume Assistant: Missing job title');
      return null;
    }

    const jobData = {
      job_title: jobTitle,
      company_name: company || 'Not specified',
      location: location || 'Not specified',
      job_description_raw: jobDescription || 'No description available',
      job_url: window.location.href,
      platform: 'glassdoor'
    };

    logDetectionStatus('Glassdoor', true, jobData);
    await sendJobData(jobData);

    return jobData;

  } catch (error) {
    console.error('Resume Assistant: Error extracting Glassdoor job data', error);
    return null;
  }
}

/**
 * Initializes the Glassdoor content script
 */
function initGlassdoorScript() {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(extractJobData, 100);
  }

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(extractJobData, 100);
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      extractJobData();
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGlassdoorScript);
} else {
  initGlassdoorScript();
}

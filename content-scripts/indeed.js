/**
 * Indeed-specific job data extraction
 * Handles both desktop and mobile views
 */

// Indeed DOM selectors (configurable for easy updates)
const INDEED_SELECTORS = {
  jobTitle: [
    'h1.jobtitle',
    '.jobsearch-JobInfoHeader-title',
    '[class*="jobTitle"]',
    'h1[class*="JobTitle"]'
  ],
  company: [
    '.jobsearch-CompanyInfoWithoutHeaderImage-companyName',
    '[class*="companyName"]',
    '.job-company-name'
  ],
  location: [
    '.jobsearch-JobInfoHeader-companyLocation',
    '[class*="jobLocation"]',
    '.job-location'
  ],
  jobDescription: [
    '#jobDescriptionText',
    '#job-details',
    '.jobsearch-jobDescriptionText',
    '[class*="jobDescription"]'
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
 * Extracts job description from Indeed job page
 */
function extractJobDescription() {
  const descElement = queryFirstSelector(INDEED_SELECTORS.jobDescription);

  if (!descElement) {
    return '';
  }

  let text = descElement.textContent || '';

  // Clean up common Indeed artifacts
  text = text
    .replace(/Show more\s*/g, '')
    .replace(/Show less\s*/g, '')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();

  return text;
}

/**
 * Main extraction function for Indeed
 */
async function extractJobData() {
  // Verify we're on an Indeed job page
  if (!window.location.href.includes('indeed.com')) {
    return null;
  }

  try {
    // Wait for page to be ready
    const jobTitleElement = queryFirstSelector(INDEED_SELECTORS.jobTitle);

    if (!jobTitleElement) {
      return null;
    }

    const jobTitle = extractText(jobTitleElement);
    const companyElement = queryFirstSelector(INDEED_SELECTORS.company);
    const company = extractText(companyElement);
    const locationElement = queryFirstSelector(INDEED_SELECTORS.location);
    const location = extractText(locationElement);
    const jobDescription = extractJobDescription();

    // Validate we have minimum required data
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
      platform: 'indeed'
    };

    logDetectionStatus('Indeed', true, jobData);
    await sendJobData(jobData);

    return jobData;

  } catch (error) {
    console.error('Resume Assistant: Error extracting Indeed job data', error);
    return null;
  }
}

/**
 * Initializes the Indeed content script
 */
function initIndeedScript() {
  // Indeed doesn't use heavy SPA like LinkedIn, so simple DOMContentLoaded is enough
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(extractJobData, 100);
  }

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(extractJobData, 100);
  });

  // Also check on visibility change
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      extractJobData();
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initIndeedScript);
} else {
  initIndeedScript();
}

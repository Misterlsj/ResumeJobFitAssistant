/**
 * Greenhouse-specific job data extraction
 * Greenhouse is used by many modern tech companies
 */

const GREENHOUSE_SELECTORS = {
  jobTitle: [
    'h1[class*="title"]',
    '.app-title',
    '[class*="posting-title"]',
    '.posting-title'
  ],
  company: [
    '[class*="company-name"]',
    '.company-name',
    'meta[property="og:site_name"]'
  ],
  location: [
    '.location',
    '[class*="location"]',
    '.posting-location'
  ],
  jobDescription: [
    '#content',
    '.job-description',
    '[class*="job-description"]',
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
 * Extracts content from meta element
 */
function extractMetaContent(selector) {
  const element = document.querySelector(selector);
  return element?.getAttribute('content') || '';
}

/**
 * Extracts job description from Greenhouse job page
 */
function extractJobDescription() {
  const descElement = queryFirstSelector(GREENHOUSE_SELECTORS.jobDescription);

  if (!descElement) {
    return '';
  }

  let text = descElement.textContent || '';

  // Clean up Greenhouse-specific artifacts
  text = text
    .replace(/Show more\s*/g, '')
    .replace(/Show less\s*/g, '')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();

  return text;
}

/**
 * Extracts company name from Greenhouse page
 */
function extractCompanyName() {
  // Try meta element first
  const metaCompany = extractMetaContent(GREENHOUSE_SELECTORS.company[2]);
  if (metaCompany) {
    return metaCompany;
  }

  // Try regular selectors
  const companyElement = queryFirstSelector(GREENHOUSE_SELECTORS.company.slice(0, 2));
  if (companyElement) {
    return extractText(companyElement);
  }

  // Fallback: try to extract from URL
  // boards.greenhouse.io/COMPANY/jobs/
  const urlMatch = window.location.pathname.match(/^\/([^\/]+)\//);
  if (urlMatch) {
    return urlMatch[1].charAt(0).toUpperCase() + urlMatch[1].slice(1);
  }

  return 'Not specified';
}

/**
 * Main extraction function for Greenhouse
 */
async function extractJobData() {
  // Verify we're on a Greenhouse job page
  if (!window.location.href.includes('boards.greenhouse.io')) {
    return null;
  }

  try {
    const jobTitleElement = queryFirstSelector(GREENHOUSE_SELECTORS.jobTitle);

    if (!jobTitleElement) {
      return null;
    }

    const jobTitle = extractText(jobTitleElement);
    const company = extractCompanyName();
    const locationElement = queryFirstSelector(GREENHOUSE_SELECTORS.location);
    const location = extractText(locationElement);
    const jobDescription = extractJobDescription();

    if (!jobTitle) {
      console.warn('Resume Assistant: Missing job title');
      return null;
    }

    const jobData = {
      job_title: jobTitle,
      company_name: company,
      location: location || 'Remote / Not specified',
      job_description_raw: jobDescription || 'No description available',
      job_url: window.location.href,
      platform: 'greenhouse'
    };

    logDetectionStatus('Greenhouse', true, jobData);
    await sendJobData(jobData);

    return jobData;

  } catch (error) {
    console.error('Resume Assistant: Error extracting Greenhouse job data', error);
    return null;
  }
}

/**
 * Initializes the Greenhouse content script
 */
function initGreenhouseScript() {
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
  document.addEventListener('DOMContentLoaded', initGreenhouseScript);
} else {
  initGreenhouseScript();
}

/**
 * Lever-specific job data extraction
 * Lever.co is used by many modern tech companies
 */

const LEVER_SELECTORS = {
  jobTitle: [
    'h2.sort-by-time-posted',
    '.posting-title',
    'h1[class*="title"]',
    '[class*="posting-title"]'
  ],
  company: [
    '.heading-large a',
    '[class*="company-name"]',
    '.company-name'
  ],
  location: [
    '.sort-by-time posting-category',
    '[class*="location"]',
    '.posting-location',
    '.work-location'
  ],
  jobDescription: [
    '.section-wrapper.description',
    '.posting-description',
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
 * Extracts job description from Lever job page
 */
function extractJobDescription() {
  const descElement = queryFirstSelector(LEVER_SELECTORS.jobDescription);

  if (!descElement) {
    return '';
  }

  let text = descElement.textContent || '';

  // Clean up Lever-specific artifacts
  text = text
    .replace(/Show more\s*/g, '')
    .replace(/Show less\s*/g, '')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();

  return text;
}

/**
 * Extracts company name from Lever page
 */
function extractCompanyName() {
  // Lever pages often have company in URL or header
  const companyElement = queryFirstSelector(LEVER_SELECTORS.company);

  if (companyElement) {
    return extractText(companyElement);
  }

  // Fallback: try to extract from URL
  const urlMatch = window.location.hostname.match(/jobs\.([^.]+)\.lever\.co/);
  if (urlMatch) {
    return urlMatch[1].charAt(0).toUpperCase() + urlMatch[1].slice(1);
  }

  return 'Not specified';
}

/**
 * Main extraction function for Lever
 */
async function extractJobData() {
  // Verify we're on a Lever job page
  if (!window.location.href.includes('jobs.lever.co')) {
    return null;
  }

  try {
    const jobTitleElement = queryFirstSelector(LEVER_SELECTORS.jobTitle);

    if (!jobTitleElement) {
      return null;
    }

    const jobTitle = extractText(jobTitleElement);
    const company = extractCompanyName();
    const locationElement = queryFirstSelector(LEVER_SELECTORS.location);
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
      platform: 'lever'
    };

    logDetectionStatus('Lever', true, jobData);
    await sendJobData(jobData);

    return jobData;

  } catch (error) {
    console.error('Resume Assistant: Error extracting Lever job data', error);
    return null;
  }
}

/**
 * Initializes the Lever content script
 */
function initLeverScript() {
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
  document.addEventListener('DOMContentLoaded', initLeverScript);
} else {
  initLeverScript();
}

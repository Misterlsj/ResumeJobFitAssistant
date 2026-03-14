/**
 * Shared detection logic for all platform content scripts
 * This file is loaded before platform-specific scripts
 */

// Storage key for job data in chrome.storage.session
const SESSION_STORAGE_KEY = 'currentJobData';

/**
 * Validates that job data contains all required fields
 * @param {Object} data - Job data object to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validateJobData(data) {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const requiredFields = ['job_title', 'company_name', 'location', 'job_description_raw', 'job_url'];
  for (const field of requiredFields) {
    if (!data[field] || typeof data[field] !== 'string') {
      return false;
    }
  }

  return true;
}

/**
 * Sends job data to the background service worker
 * @param {Object} jobData - Extracted job data
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
async function sendJobData(jobData) {
  if (!validateJobData(jobData)) {
    console.warn('Resume Assistant: Invalid job data, not sending');
    return false;
  }

  try {
    const response = await chrome.runtime.sendMessage({
      type: 'JOB_DETECTED',
      data: jobData
    });

    return response?.success || false;
  } catch (error) {
    console.error('Resume Assistant: Failed to send job data', error);
    return false;
  }
}

/**
 * Truncates job description if it exceeds max length
 * @param {string} jd - Job description text
 * @param {number} maxLength - Maximum length after encoding (default: 8000)
 * @returns {Object} { jd: string, truncated: boolean }
 */
function truncateJobDescription(jd, maxLength = 8000) {
  // First, encode to Base64 to check actual length
  let encoded = btoa(unescape(encodeURIComponent(jd)));

  if (encoded.length <= maxLength) {
    return { jd, truncated: false };
  }

  // Binary search to find max truncation point
  let left = 0;
  let right = jd.length;
  let result = jd;

  while (left < right) {
    const mid = Math.floor((left + right + 1) / 2);
    const truncated = jd.substring(0, mid);
    const testEncoded = btoa(unescape(encodeURIComponent(truncated)));

    if (testEncoded.length <= maxLength) {
      result = truncated;
      left = mid;
    } else {
      right = mid - 1;
    }
  }

  return { jd: result, truncated: true };
}

/**
 * Encodes job data for URL parameters
 * @param {Object} jobData - Job data object
 * @param {string} websiteUrl - Base URL of the resume website
 * @returns {string} Full URL with encoded parameters
 */
function encodeJobDataForUrl(jobData, websiteUrl = 'https://resume-tool.com/tailor') {
  const { jd, truncated } = truncateJobDescription(jobData.job_description_raw);

  const params = new URLSearchParams({
    source: 'extension',
    job_title: jobData.job_title,
    company: jobData.company_name,
    location: jobData.location,
    jd: btoa(unescape(encodeURIComponent(jd))),
    job_url: jobData.job_url
  });

  if (truncated) {
    params.append('jd_truncated', 'true');
  }

  return `${websiteUrl}?${params.toString()}`;
}

/**
 * Logs detection status for debugging
 * @param {string} platform - Platform name (e.g., 'LinkedIn')
 * @param {boolean} detected - Whether job was detected
 * @param {Object|null} data - Job data if detected
 */
function logDetectionStatus(platform, detected, data = null) {
  if (detected) {
    console.log(`Resume Assistant: Job detected on ${platform}`, {
      title: data?.job_title,
      company: data?.company_name
    });
  } else {
    console.log(`Resume Assistant: No job detected on ${platform}`);
  }
}

// Export for use in platform-specific scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateJobData,
    sendJobData,
    truncateJobDescription,
    encodeJobDataForUrl,
    logDetectionStatus,
    SESSION_STORAGE_KEY
  };
}

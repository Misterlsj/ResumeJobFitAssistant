/**
 * Floating Badge Injection
 * Shows a non-intrusive badge on supported job pages when a job is detected
 */

// Badge configuration
const BADGE_CONFIG = {
  id: 'resume-assistant-badge',
  position: 'bottom-right', // or 'bottom-left'
  margin: '20px',
  animationDuration: 300
};

// Platform detection for badge positioning
const PLATFORM_SELECTORS = {
  linkedin: '.scaffold-layout__main',
  indeed: '.jobsearch-RightPane',
  glassdoor: '.jobDetailsContainer',
  lever: '.main',
  greenhouse: '#content'
};

/**
 * Creates the floating badge element
 * @param {Object} jobData - Job data to display
 * @returns {HTMLElement} Badge element
 */
function createBadge(jobData) {
  const badge = document.createElement('div');
  badge.id = BADGE_CONFIG.id;
  badge.className = 'resume-assistant-badge';

  badge.innerHTML = `
    <div class="badge-content">
      <svg class="badge-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="badge-text">Resume Assistant</span>
    </div>
  `;

  // Add click handler to highlight extension icon
  badge.addEventListener('click', () => {
    // Flash the extension icon to draw attention
    chrome.runtime.sendMessage({
      type: 'HIGHLIGHT_ICON',
      tabId: chrome.tabs.getCurrent()?.id
    }).catch(() => {
      // Fallback: just log
      console.log('Resume Assistant: Click the extension icon to view job details');
    });
  });

  return badge;
}

/**
 * Injects badge styles into the page
 */
function injectBadgeStyles() {
  if (document.getElementById('resume-assistant-badge-styles')) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'resume-assistant-badge-styles';
  style.textContent = `
    .resume-assistant-badge {
      position: fixed;
      ${BADGE_CONFIG.position === 'bottom-right' ? 'right' : 'left'}: ${BADGE_CONFIG.margin};
      bottom: ${BADGE_CONFIG.margin};
      z-index: 2147483647;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      animation: resume-assistant-slide-in ${BADGE_CONFIG.animationDuration}ms ease-out;
      cursor: pointer;
    }

    .badge-content {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #1E3A5F;
      color: white;
      padding: 10px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      font-size: 13px;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .resume-assistant-badge:hover .badge-content {
      background: #2E75B6;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }

    .badge-icon {
      flex-shrink: 0;
      color: #4CAF50;
    }

    .badge-text {
      white-space: nowrap;
    }

    @keyframes resume-assistant-slide-in {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes resume-assistant-fade-out {
      from {
        opacity: 1;
        transform: translateY(0);
      }
      to {
        opacity: 0;
        transform: translateY(20px);
      }
    }

    .resume-assistant-badge.removing {
      animation: resume-assistant-fade-out ${BADGE_CONFIG.animationDuration}ms ease-in forwards;
    }
  `;

  document.head.appendChild(style);
}

/**
 * Removes existing badge if present
 */
function removeExistingBadge() {
  const existing = document.getElementById(BADGE_CONFIG.id);
  if (existing) {
    existing.classList.add('removing');
    setTimeout(() => existing.remove(), BADGE_CONFIG.animationDuration);
  }
}

/**
 * Shows the floating badge
 * @param {Object} jobData - Job data
 */
function showBadge(jobData) {
  removeExistingBadge();
  injectBadgeStyles();

  const badge = createBadge(jobData);
  document.body.appendChild(badge);
}

/**
 * Hides the floating badge
 */
function hideBadge() {
  removeExistingBadge();
}

/**
 * Detects current platform
 * @returns {string|null} Platform name or null
 */
function detectPlatform() {
  const url = window.location.href;

  if (url.includes('linkedin.com')) return 'linkedin';
  if (url.includes('indeed.com')) return 'indeed';
  if (url.includes('glassdoor.com')) return 'glassdoor';
  if (url.includes('jobs.lever.co')) return 'lever';
  if (url.includes('boards.greenhouse.io')) return 'greenhouse';

  return null;
}

/**
 * Initializes badge system
 */
function initBadgeSystem() {
  const platform = detectPlatform();
  if (!platform) return;

  // Prevent duplicate listeners
  if (window.resumeAssistantBadgeInitialized) {
    return;
  }
  window.resumeAssistantBadgeInitialized = true;

  // Listen for job detection events
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'JOB_DETECTED_BADGE') {
      showBadge(message.data);
      sendResponse({ success: true });
    } else if (message.type === 'HIDE_BADGE') {
      hideBadge();
      sendResponse({ success: true });
    }
    return true;
  });

  console.log('Resume Assistant: Badge system initialized for', platform);
}

// Initialize badge system
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBadgeSystem);
} else {
  initBadgeSystem();
}

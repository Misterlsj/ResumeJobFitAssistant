# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Resume Job-Fit Assistant" is a Chrome browser extension (Manifest V3) that serves as an acquisition channel for a resume tool website. When users browse job postings on major recruitment platforms, the extension automatically detects job content and provides a one-click bridge to the website with structured job data.

**Key Constraints:**
- **Zero AI functionality** - All intelligence lives on the website
- **Zero API keys** - No external API dependencies
- **No backend server** - Pure client-side extension
- **No user data collection** - All data stored locally in chrome.storage

## Target Platforms (v1.0)

The extension supports content script injection on these domains:
- LinkedIn (`linkedin.com/jobs/view/*`)
- Indeed (`indeed.com/viewjob*`, `indeed.com/jobs*`)
- Glassdoor (`glassdoor.com/job-listing/*`)
- Lever (`jobs.lever.co/*`)
- Greenhouse (`boards.greenhouse.io/*/jobs/*`)

## Extension File Structure

```
resume-extension/
├── manifest.json              # Manifest V3 config
├── background/
│   └── service-worker.js      # Event-driven background tasks
├── content-scripts/
│   ├── detector.js            # Shared detection logic
│   ├── linkedin.js            # LinkedIn-specific selectors
│   ├── indeed.js              # Indeed-specific selectors
│   ├── glassdoor.js           # Glassdoor-specific selectors
│   ├── lever.js               # Lever-specific selectors
│   └── greenhouse.js          # Greenhouse-specific selectors
├── popup/
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── sidebar/
│   ├── sidebar.js             # Floating badge injection
│   └── sidebar.css
├── settings/
│   ├── settings.html
│   ├── settings.js
│   └── settings.css
└── assets/
    ├── icon-16.png
    ├── icon-48.png
    └── icon-128.png
```

## Architecture Patterns

### Content Script Pattern
Each platform content script must export a single async function:
```javascript
async function extractJobData() {
  // Returns { job_title, company_name, location, job_description_raw, job_url } or null
}
```

### Data Flow
1. Content script extracts DOM data
2. Sends message to service worker: `chrome.runtime.sendMessage({type:'JOB_DETECTED', data})`
3. Service worker stores in `chrome.storage.session`
4. Popup reads from storage and renders preview
5. CTA click opens website with URL-encoded job data

### LinkedIn SPA Navigation
LinkedIn is a heavy React SPA. URL changes via pushState without full page reloads. Use either:
- `chrome.webNavigation.onHistoryStateUpdated` event, OR
- MutationObserver on job detail panel container

**Do NOT rely on DOMContentLoaded alone on LinkedIn.**

### Service Worker Constraints (Manifest V3)
- Service workers are event-driven and can be terminated at any time
- **Do NOT store state in global variables** - always use `chrome.storage`
- Use `chrome.storage.session` for temporary data (cleared on browser close)
- Use `chrome.storage.local` for persistent settings

### DOM Selector Configuration
Job board DOM structures change frequently. Build selectors as a configuration object (not hardcoded) to allow updates without code changes. Consider a remote selector config fetched from the website.

## Key Technical Decisions

### URL Parameter Encoding
Job descriptions are Base64-encoded before URL embedding:
```
https://yoursite.com/tailor?source=extension&job_title=...&jd=BASE64_ENCODED_JD_TEXT
```

Max JD length: 8000 characters (after Base64). Truncate if longer and append `&jd_truncated=true`.

### Performance Requirements
- Content script injection: < 50ms after DOM ready
- Data extraction: < 200ms per page
- Popup render: < 150ms from click to visible
- Must not degrade host page performance (> 5ms added latency)

### Privacy & Security
- No cross-origin fetch requests from content scripts
- No `eval()` or dynamic code execution
- Content Security Policy headers in manifest.json
- All data stored locally in chrome.storage (no external servers)

## Common Development Commands

```bash
# Load extension for development
# 1. Navigate to chrome://extensions
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select this directory

# Lint extension
npx web-ext lint

# Reload extension during development
# Click reload button on chrome://extensions page
```

## Testing Manual Test Cases

When adding features, verify:
- Extension works on all 5 supported platforms
- Fails gracefully (no console errors on unsupported pages)
- Works after Chrome restarts
- Settings persist across reloads
- Session data clears on browser close

## Chrome Web Store Submission

Required assets:
- Icons: 128×128px, 48×48px, 16×16px PNG
- Screenshots: 1280×800px or 640×400px (1-5 images)
- Privacy Policy URL (hosted on website)

Review timeline: 1-3 business days typically.

## References

- Product Requirements Document: `resume_extension_prd.docx`
- Manifest V3 documentation: https://developer.chrome.com/docs/extensions/mv3/
- chrome.storage API: https://developer.chrome.com/docs/extensions/reference/api/storage

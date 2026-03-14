# Resume Job-Fit Assistant - Chrome Extension

A Chrome browser extension (Manifest V3) that automatically detects job content on recruitment websites and provides one-click navigation to [ResumeScorer](https://resumescorer.com) - your AI-powered resume optimization platform.

## 🌟 About ResumeScorer

[ResumeScorer](https://resumescorer.com) is an intelligent resume analysis and optimization platform that helps job seekers:

- **Analyze Match Rate** - See how well your resume matches job requirements
- **Get AI Suggestions** - Receive personalized recommendations to improve your resume
- **Optimize Keywords** - Ensure your resume contains the right keywords for ATS systems
- **Track Applications** - Monitor your job application success rate

This extension seamlessly bridges job postings from major recruitment sites to ResumeScorer's analysis tools.

## Features

- ✅ **Zero AI Functionality** - All intelligent processing is done on the website side
- ✅ **Zero API Keys** - No external API dependencies
- ✅ **No Backend Server** - Pure client-side extension
- ✅ **No User Data Collection** - All data stored locally in chrome.storage
- ✅ **Floating Badge** - Non-intrusive badge appears in the bottom-right corner when a job is detected

## Supported Platforms

- ✅ LinkedIn (`linkedin.com/jobs/view/*`)
- ✅ Indeed (`indeed.com/viewjob*`, `indeed.com/jobs*`)
- ✅ Glassdoor (`glassdoor.com/job-listing/*`)
- ✅ Lever (`jobs.lever.co/*`)
- ✅ Greenhouse (`boards.greenhouse.io/*/jobs/*`)

## Project Structure

```
resume-extension/
├── manifest.json              # Manifest V3 configuration
├── background/
│   └── service-worker.js      # Background service worker
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
    ├── icon.svg               # Icon source file
    ├── icon-16.png            # 16×16 icon
    ├── icon-48.png            # 48×48 icon
    └── icon-128.png           # 128×128 icon
```

## Development Guide

### Loading Extension for Development

1. Navigate to `chrome://extensions` in Chrome
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select this directory

### Testing Platform Integration

#### LinkedIn
1. Visit [LinkedIn Jobs](https://www.linkedin.com/jobs)
2. Click on any job detail page
3. Verify:
   - Extension icon shows ✓ badge
   - Floating badge appears in bottom-right corner
   - Click extension icon to view job data
   - Status shows "LinkedIn detected"
   - CTA button opens website with encoded parameters
4. Test SPA navigation: Click different jobs, confirm badge updates

#### Indeed
1. Visit [Indeed](https://www.indeed.com/jobs)
2. Search and click on any job
3. Verify:
   - Extension icon shows ✓ badge
   - Floating badge appears in bottom-right corner
   - Status shows "Indeed detected"

#### Glassdoor
1. Visit [Glassdoor Jobs](https://www.glassdoor.com/Job)
2. Click on any job detail page
3. Verify same functionality

#### Lever
1. Visit any Lever hiring page (e.g., `jobs.stripe.co`)
2. Click on any job
3. Verify same functionality

#### Greenhouse
1. Visit any Greenhouse hiring page (e.g., `boards.greenhouse.io/airbnb/jobs`)
2. Click on any job
3. Verify same functionality

### Manual Test Cases

#### Basic Features
- [ ] Extension shows badge correctly on all supported platforms
- [ ] Clicking extension icon displays job data
- [ ] Platform name displays correctly in status badge
- [ ] CTA button opens website with encoded parameters
- [ ] JD truncates correctly when over 8000 characters

#### Floating Badge
- [ ] Floating badge appears in bottom-right corner of page
- [ ] Clicking floating badge opens extension popup
- [ ] Badge disappears when navigating away from job page
- [ ] Badge updates correctly during LinkedIn SPA navigation

#### Stability
- [ ] Badge disappears on non-job page navigation
- [ ] Extension works after Chrome restart
- [ ] Settings persist after page reload
- [ ] Content script errors don't affect host page

## Technical Architecture

### Data Flow

1. Content Script extracts DOM data
2. Sends message to Service Worker: `chrome.runtime.sendMessage({type:'JOB_DETECTED', data})`
3. Service Worker stores in `chrome.storage.session`
4. Popup reads from storage and renders preview
5. CTA click opens website with URL-encoded job data

### LinkedIn SPA Navigation Handling

LinkedIn is a heavy React SPA where URLs change via pushState without triggering full page reloads.

Handle using:
- `chrome.webNavigation.onHistoryStateUpdated` event
- MutationObserver watching job detail panel container

**Do NOT rely solely on DOMContentLoaded on LinkedIn.**

### URL Parameter Encoding

Job descriptions are Base64-encoded before URL embedding:
```
https://yoursite.com/tailor?source=extension&job_title=...&jd=BASE64_ENCODED_JD_TEXT
```

Maximum JD length: 8000 characters (after Base64). Truncate if longer and append `&jd_truncated=true`.

### Performance Requirements

- Content Script injection: < 50ms after DOM ready
- Data extraction: < 200ms per page
- Popup rendering: < 150ms from click to visible
- Must not degrade host page performance (> 5ms added latency)

## Chrome Web Store Submission

Required assets:
- Icons: 128×128px, 48×48px, 16×16px PNG
- Screenshots: 1280×800px or 640×400px (1-5 images)
- Privacy Policy URL (hosted on website)

Review timeline: Typically 1-3 business days

## Development Commands

```bash
# Lint extension
npx web-ext lint

# Reload extension (during development)
# Click reload button on chrome://extensions page
```

## Troubleshooting

### Content Script Not Injecting

- Check `matches` patterns in manifest.json
- Confirm URL pattern matches actual page URL
- Check browser console for CSP errors

### LinkedIn SPA Navigation Not Triggering Extraction

- Check `chrome.webNavigation` permission
- Verify `onHistoryStateUpdated` listener is firing
- Check MutationObserver target element exists

### Popup Shows "No Job Detected"

- Check if `chrome.storage.session` contains data
- Verify content script successfully sent `JOB_DETECTED` message
- Check if service worker is active (see chrome://extensions → Service Worker)

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

## Resources

- **[Visit ResumeScorer](https://resumescorer.com)** - Main website
- [Contributing Guidelines](CONTRIBUTING.md)
- [Development Guide](DEVELOPMENT.md)
- [Security Policy](SECURITY.md)
- [Support Center](SUPPORT.md)

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

---

**Made with ❤️ by [ResumeScorer](https://resumescorer.com)** - helping job seekers land their dream jobs.

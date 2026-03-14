# Development Guide

This document provides detailed development guidelines for the [Resume Job-Fit Assistant](https://resumescorer.com) Chrome extension.

## 🌟 About This Project

This extension is developed by [ResumeScorer](https://resumescorer.com) as part of our mission to help job seekers create better resumes and land more interviews. The extension serves as a bridge between job postings and our AI-powered resume analysis platform.

## 📋 Table of Contents

- [Environment Setup](#environment-setup)
- [Development Workflow](#development-workflow)
- [Architecture Details](#architecture-details)
- [Core Concepts](#core-concepts)
- [Debugging Tips](#debugging-tips)
- [Performance Optimization](#performance-optimization)
- [Testing Strategy](#testing-strategy)
- [Deployment Process](#deployment-process)

## 🔧 Environment Setup

### Required Tools

- **Chrome Browser** (latest stable version)
- **Code Editor** (VS Code recommended)
- **Git** (version control)

### Optional Tools

```bash
# Chrome extension lint tool
npm install -g web-ext

# Code formatter
npm install -g prettier

# JavaScript linting
npm install -g eslint
```

### VS Code Extensions Recommended

- **Chrome Extension Tools** - Debugging support
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **GitHub Copilot** - AI-assisted coding

## 🔄 Development Workflow

### 1. Load Extension for Development

```bash
# 1. Open Chrome extensions page
chrome://extensions

# 2. Enable Developer Mode (toggle in top right)

# 3. Click "Load unpacked"

# 4. Select project root directory
```

### 2. Development Loop

```bash
# 1. Make code changes
# 2. Click refresh button on chrome://extensions page
# 3. Test changes
# 4. Repeat
```

**Quick Tip**: Keep the extensions page open for quick `Ctrl+R` refresh.

### 3. Validate Changes

```bash
# Run lint check
npx web-ext lint

# Check manifest syntax
npx web-ext lint --warnings-as-errors
```

## 🏗️ Architecture Details

### File Structure

```
resume-extension/
├── manifest.json              # Extension manifest
├── background/
│   └── service-worker.js      # Background service (no persistent state)
├── content-scripts/           # Content scripts (injected into web pages)
│   ├── detector.js           # Shared detection logic
│   ├── linkedin.js           # LinkedIn-specific logic
│   ├── indeed.js             # Indeed-specific logic
│   ├── glassdoor.js          # Glassdoor-specific logic
│   ├── lever.js              # Lever-specific logic
│   └── greenhouse.js         # Greenhouse-specific logic
├── popup/                    # Extension popup
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── sidebar/                  # Floating page badge
│   ├── sidebar.js
│   └── sidebar.css
├── settings/                 # Settings page
│   ├── settings.html
│   ├── settings.js
│   └── settings.css
└── assets/                   # Icons and image resources
    ├── icon.svg
    ├── icon-16.png
    ├── icon-48.png
    └── icon-128.png
```

### Data Flow Architecture

```
┌─────────────────┐
│  Job Board Page │
│  (LinkedIn etc) │
└────────┬────────┘
         │ 1. DOM loads
         │
┌────────▼────────┐
│  Content Script │
│  extractJobData()│
└────────┬────────┘
         │ 2. sendMessage()
         │
┌────────▼────────────┐
│  Service Worker     │
│  Stores to session  │
└────────┬────────────┘
         │ 3. Read storage
         │
┌────────▼────────┐
│  Popup/Sidebar  │
│  Shows job data │
└────────┬────────┘
         │ 4. User clicks CTA
         │
┌────────▼────────┐
│  Opens Website  │
│  (URL-encoded)  │
└─────────────────┘
```

## 💡 Core Concepts

### Manifest V3 Features

```json
{
  "manifest_version": 3,
  "background": {
    "service_worker": "background/service-worker.js"
  },
  "permissions": ["storage", "activeTab"],
  "host_permissions": ["<all_urls>"],
  "content_scripts": [...]
}
```

**Key changes** (vs MV2):
- Service Worker replaces background page (no persistent DOM)
- Use `chrome.storage.session` instead of `chrome.storage.local` (session-level storage)
- Must explicitly declare `host_permissions`

### Content Script Injection

```javascript
// Configuration in manifest.json
"content_scripts": [
  {
    "matches": ["https://www.linkedin.com/jobs/view/*"],
    "js": ["content-scripts/detector.js", "content-scripts/linkedin.js"],
    "run_at": "document_idle"
  }
]
```

**Injection timing**:
- `document_start` - After CSS loads, before DOM construction
- `document_end` - After DOM construction, before resource loading
- `document_idle` - Best timing (default)

### Message Passing

**Content Script → Service Worker**:
```javascript
// Send
chrome.runtime.sendMessage({
  type: 'JOB_DETECTED',
  data: jobData
});

// Receive
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'JOB_DETECTED') {
    // Handle data
  }
});
```

**Popup → Service Worker**:
```javascript
// Request current job data
chrome.runtime.sendMessage({ type: 'GET_CURRENT_JOB' }, (response) => {
  console.log(response.data);
});
```

### Storage Strategy

```javascript
// Session-level storage (cleared on browser close)
chrome.storage.session.set({ currentJob: jobData });

// Persistent storage (settings, etc.)
chrome.storage.local.set({ userSettings: settings });

// Read data
chrome.storage.session.get(['currentJob'], (result) => {
  console.log(result.currentJob);
});
```

## 🐛 Debugging Tips

### Debugging Service Worker

1. Visit `chrome://extensions`
2. Find the extension, click "Service Worker"
3. Open DevTools for debugging

**Note**: Service Workers may become dormant. Keep DevTools open to keep them active during debugging.

### Debugging Content Scripts

1. Right-click on the target page → "Inspect"
2. In the Console, you can see content script logs
3. You can execute script code directly in the Console

### Debugging Popup

1. Right-click extension icon → "Inspect"
2. DevTools will show the popup's DOM

### Useful Debugging Code

```javascript
// View all stored data
chrome.storage.session.get(null, (data) => console.log(data));

// Clear storage
chrome.storage.session.clear();

// View all tabs
chrome.tabs.query({}, (tabs) => console.log(tabs));

// Send test message
chrome.runtime.sendMessage({ type: 'TEST' }, (response) => {
  console.log('Response:', response);
});
```

### Performance Profiling

```javascript
// Add performance markers in your code
console.time('jobExtraction');
// ... your code ...
console.timeEnd('jobExtraction');
```

## ⚡ Performance Optimization

### Content Script Optimization

**❌ Bad practice**:
```javascript
// Query DOM every time
function getTitle() {
  return document.querySelector('.job-title').textContent;
}
```

**✅ Good practice**:
```javascript
// Cache DOM queries
const titleElement = document.querySelector('.job-title');
function getTitle() {
  return titleElement?.textContent?.trim();
}
```

### Batch DOM Operations

**❌ Bad practice**:
```javascript
// Multiple repaints
elements.forEach(el => {
  document.body.appendChild(el);
});
```

**✅ Good practice**:
```javascript
// Single addition
const fragment = document.createDocumentFragment();
elements.forEach(el => fragment.appendChild(el));
document.body.appendChild(fragment);
```

### Message Passing Optimization

```javascript
// Batch messages instead of frequent sends
const debouncedSend = debounce(() => {
  chrome.runtime.sendMessage(data);
}, 300);
```

### Memory Management

```javascript
// Clean up event listeners
function cleanup() {
  observer.disconnect();
  element.removeEventListener('click', handler);
}

// Clean up on page unload
window.addEventListener('unload', cleanup);
```

## 🧪 Testing Strategy

### Manual Testing Checklist

#### Basic Functionality Tests
- [ ] All supported platforms detect jobs correctly
- [ ] Badge doesn't appear on non-job pages
- [ ] Popup displays job data correctly
- [ ] Settings save and load properly
- [ ] No console errors

#### Platform-Specific Tests
- [ ] **LinkedIn**: SPA navigation triggers correctly
- [ ] **Indeed**: Works on both search and detail pages
- [ ] **Glassdoor**: Various job page formats
- [ ] **Lever**: Different company Lever pages
- [ ] **Greenhouse**: Different company Greenhouse pages

#### Edge Case Tests
- [ ] Long job descriptions (>8000 chars) truncate correctly
- [ ] Special characters handled properly
- [ ] Network errors handled gracefully
- [ ] Dynamic page content loads

#### Performance Tests
- [ ] Content Script injection < 50ms
- [ ] Data extraction < 200ms
- [ ] Popup rendering < 150ms
- [ ] Doesn't affect original page performance

## 🚀 Deployment Process

### Preparing for Release

```bash
# 1. Run lint check
npx web-ext lint

# 2. Test all platforms
# Manual testing on all 5 platforms

# 3. Update version number
# Update version in manifest.json

# 4. Build production package
# Ensure dev-only code and logs are removed

# 5. Prepare store assets
# - Icons: 128×128, 48×48, 16×16 PNG
# - Screenshots: 1280×800 or 640×400
```

### Chrome Web Store Submission

1. Visit [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Create new item
3. Upload ZIP package (exclude `.git/`, `node_modules/`, etc.)
4. Fill in store information:
   - Name: Resume Job-Fit Assistant
   - Description: Brief feature description
   - Detailed description: Complete feature overview
   - Category: Productivity
   - Language: English
5. Upload screenshots and icons
6. Add Privacy Policy URL
7. Submit for review

### Post-Release

```bash
# Create Git tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# Update CHANGELOG.md
# Add new version features and fixes
```

## 📚 Related Resources

### Official Documentation
- [Chrome Extension MV3 Documentation](https://developer.chrome.com/docs/extensions/mv3/)
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/api/storage)
- [Chrome Web Store Policies](https://developer.chrome.com/docs/webstore/program-policies/)

### Community Resources
- [Chrome Extension Samples](https://github.com/GoogleChrome/chrome-extensions-samples)
- [web-ext (Mozilla)](https://github.com/mozilla/web-ext)

### Project Documentation
- [README.md](README.md) - Project overview and quick start
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- **ResumeScorer**: [https://resumescorer.com](https://resumescorer.com)

---

**Built by [ResumeScorer](https://resumescorer.com)** - Helping job seekers succeed.

Have questions? Check [Issues](../../issues) or create a new Issue!

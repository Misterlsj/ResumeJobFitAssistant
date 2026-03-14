# Changelog

This document records all significant changes to the [Resume Job-Fit Assistant](https://resumescorer.com) project.

Format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and versioning adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Planned
- Add automated testing
- Add CI/CD pipeline
- Support more job boards
- Direct integration with ResumeScorer API
- Multi-language support

## [1.0.0] - 2025-01-14

### Added
- ✨ Initial release
- 🎯 Support for 5 major job boards
- 🌐 Integration with [ResumeScorer](https://resumescorer.com) platform
- 🔗 Direct links to resume analysis tools
  - LinkedIn (`linkedin.com/jobs/view/*`)
  - Indeed (`indeed.com/viewjob*`, `indeed.com/jobs*`)
  - Glassdoor (`glassdoor.com/job-listing/*`)
  - Lever (`jobs.lever.co/*`)
  - Greenhouse (`boards.greenhouse.io/*/jobs/*`)
- 🔍 Automatic job detection and extraction
- 🎨 Non-intrusive floating badge UI
- 📱 Extension popup showing job data
- ⚙️ Settings page
- 📦 Manifest V3 architecture
- 🚀 Zero AI functionality, zero API keys
- 🔒 Fully local storage, no user data collection

### Technical Features
- Content Scripts auto-injection
- Service Worker message handling
- chrome.storage.session temporary data storage
- LinkedIn SPA navigation support
- Base64 URL encoding for job descriptions
- Responsive CSS design

### Documentation
- 📝 README.md - Project overview
- 📝 CONTRIBUTING.md - Contribution guidelines
- 📝 DEVELOPMENT.md - Development guide
- 📝 SECURITY.md - Security policy
- 📝 CLAUDE.md - AI-assisted development guide
- 📝 CHANGELOG.md - Version changelog

### GitHub Configuration
- 🔀 PR template
- 🐛 Bug report template
- ✨ Feature request template
- 🛡️ Branch protection guide

## [Future Versions]

### Planned Features
- 🌍 Support for more international job boards
- 🎨 Custom theme options
- 📊 Usage statistics and performance monitoring
- 🔔 Smart notification system
- 🌐 Multi-language support

---

## Version Explanations

### [1.0.0] - 2025-01-14

**First public release**

Core functionality complete, supports major job boards, clean architecture, comprehensive documentation.

---

## Change Types

- `Added` - New features
- `Changed` - Changes to existing functionality
- `Deprecated` - Soon-to-be removed features
- `Removed` - Removed features
- `Fixed` - Bug fixes
- `Security` - Security-related fixes or improvements

---

## How to Use This File

### Adding New Changes

1. Add changes under `[Unreleased]` section
2. Use standard change types
3. Clearly describe the changes

### Releasing New Version

1. Create new version section: `[1.1.0] - 2025-XX-XX`
2. Move `[Unreleased]` content to new version
3. Clear `[Unreleased]` section
4. Update Git tags

---

**Maintainer**: Please update this file with each release

**Built by [ResumeScorer](https://resumescorer.com)** - Empowering job seekers worldwide.

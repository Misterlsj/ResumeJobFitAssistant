# Contributing Guidelines

Thank you for your interest in contributing to the Resume Job-Fit Assistant project! We welcome all forms of contributions.

## 🤝 How to Contribute

### Reporting Issues

If you find a bug or have a feature suggestion:

1. Check [Issues](../../issues) to confirm the issue hasn't been reported
2. Create a new Issue with a clear title
3. Include in the description:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots (if applicable)
   - Browser and extension version
   - Relevant console error logs

### Submitting Code

#### 1. Fork and Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/ResumeJobFitAssistant.git
cd ResumeJobFitAssistant
```

#### 2. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
# or for bug fix
git checkout -b fix/your-bug-fix
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test-related
- `chore/` - Build/tooling changes

#### 3. Make Changes

- Follow existing code style
- Add tests for new features
- Update relevant documentation
- Ensure code passes lint checks

#### 4. Commit Changes

```bash
git add .
git commit -m "feat: add support for XYZ platform"
```

**Commit message conventions:**

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code formatting (doesn't affect functionality)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Build process or auxiliary tool changes

Examples:
```
feat: add support for Monster.com job board
fix: handle edge case in LinkedIn SPA navigation
docs: update installation instructions
```

#### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

#### 6. Create Pull Request

1. Visit the original repository on GitHub
2. Click "New Pull Request"
3. Select your feature branch
4. Fill out the PR template
5. Wait for code review

## 📋 Pull Request Review Criteria

All Pull Requests must meet:

- ✅ Pass all tests
- ✅ Consistent code style
- ✅ Include necessary documentation
- ✅ Update CHANGELOG.md (if applicable)
- ✅ No new linting errors
- ✅ Don't break existing platform support

## 🧪 Testing Guidelines

### Manual Testing Checklist

Before submitting a PR, ensure:

- [ ] Extension works on all supported platforms
- [ ] Floating badge appears and disappears correctly
- [ ] Popup displays job data correctly
- [ ] Settings page functions properly
- [ ] No console errors
- [ ] No significant performance degradation

### Testing Each Platform

For detailed platform testing steps, see [README.md](README.md#testing-platform-integration).

## 🎨 Code Standards

### JavaScript

- Use modern ES6+ syntax
- Function names should clearly express intent
- Avoid global variable pollution
- Use constants for configuration and magic numbers

### Chrome Extension Specific Standards

- **Minimal Permissions**: Only request necessary permissions
- **Performance**: Content script injection < 50ms
- **Memory**: Clean up event listeners and DOM references promptly
- **Storage**: Use `chrome.storage.session` for temporary data
- **Security**: Avoid `eval()` and dynamic code execution

### CSS

- Use BEM or similar naming convention
- Avoid excessive nesting (max 3 levels)
- Use CSS variables for colors and dimensions
- Ensure sufficient color contrast (WCAG AA)

## 📚 Adding New Platform Support

To add support for a new job board:

1. Create new file `content-scripts/platformname.js`
2. Export `extractJobData()` function
3. Add `matches` rules in `manifest.json`
4. Update documentation and supported platforms list
5. Add test cases

Template example:

```javascript
// content-scripts/newplatform.js
async function extractJobData() {
  try {
    // Extraction logic
    const jobTitle = document.querySelector('...')?.textContent?.trim();
    const companyName = document.querySelector('...')?.textContent?.trim();

    if (!jobTitle) return null;

    return {
      job_title: jobTitle,
      company_name: companyName,
      location: location,
      job_description_raw: jobDescription,
      job_url: window.location.href
    };
  } catch (error) {
    console.error('NewPlatform extraction error:', error);
    return null;
  }
}
```

## 🐛 Debugging Tips

### Chrome DevTools

- **Background Script**: `chrome://extensions` → Service Worker
- **Content Script**: Right-click page → Inspect → Console
- **Popup**: Right-click extension icon → Inspect

### Useful Debugging Commands

```javascript
// View storage data
chrome.storage.session.get(null, console.log);

// Clear storage
chrome.storage.session.clear();

// View all tabs
chrome.tabs.query({}, console.log);
```

## 💬 Discussions and Questions

- 💡 **Feature suggestions**: Use [Issues](../../issues) with `enhancement` label
- 🐛 **Bug reports**: Use Issues with `bug` label
- 💭 **General discussion**: Use [Discussions](../../discussions)

## 📄 License

By contributing code, you agree that your contributions will be licensed under the same license as the project.

## 🙏 Acknowledgments

Thanks to all contributors who make this project better!

---

Have questions? Feel free to create an Issue or Discussion, and we'll respond as soon as possible!

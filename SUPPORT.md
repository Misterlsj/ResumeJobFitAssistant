# Getting Help

Welcome to the Resume Job-Fit Assistant support center! Here are various ways to get help.

## 📚 Documentation

### Quick Start
- 📖 [README.md](README.md) - Project overview and basic usage
- 🛠️ [DEVELOPMENT.md](DEVELOPMENT.md) - Detailed development guide
- 🤝 [CONTRIBUTING.md](CONTRIBUTING.md) - How to contribute

## 🤔 Frequently Asked Questions

### Q: The extension doesn't work on a specific website. What should I do?

**A**: Follow these troubleshooting steps:

1. **Check Platform Support**
   - Verify the platform is in the [supported list](README.md#supported-platforms)
   - Confirm the URL pattern matches

2. **Reload Extension**
   - Visit `chrome://extensions`
   - Click the extension's reload button

3. **Check Console Errors**
   - Press `F12` on the target page to open DevTools
   - Check Console for error messages
   - Copy error messages to us

4. **Reload the Page**
   - Sometimes page loading issues prevent injection
   - Try refreshing the page

### Q: The floating badge doesn't appear?

**A**: Possible reasons:

1. **Not a Job Detail Page**
   - Ensure you're on a job detail page, not a search listing

2. **Extension Not Injected**
   - Check if the extension is enabled in `chrome://extensions`
   - Click "Reload" button

3. **CSS Conflict**
   - Some site CSS may affect badge display
   - Try clicking the extension icon to see if job is detected

### Q: Popup shows "No Job Detected"?

**A**: This means the extension hasn't detected job data:

1. **Verify URL Match**
   - Check `matches` rules in manifest.json
   - Confirm your URL matches the pattern

2. **Wait for Page Load**
   - Some sites dynamically load content
   - Wait a few seconds and try again

3. **Check Service Worker Logs**
   - Visit `chrome://extensions`
   - Click "Service Worker" to view logs

### Q: The badge doesn't update when I switch pages on LinkedIn?

**A**: LinkedIn is a SPA application and needs special handling:

1. **Wait a Few Seconds**
   - Extension needs time to detect URL changes
   - Usually updates within 1-2 seconds

2. **Refresh the Page**
   - If problem persists, try refreshing

3. **Report the Issue**
   - If problem continues, please create an Issue

### Q: How can I view stored job data?

**A**: Use Developer Tools:

```javascript
// Run in Console
chrome.storage.session.get(null, (data) => {
  console.log(data);
});
```

### Q: Does the extension collect my data?

**A**: No. Please see our [Security Policy](SECURITY.md).

## 🐛 Reporting Issues

If you find a bug:

1. **Search Existing Issues**
   - Search [Issues](../../issues) to see if it's already reported
   - Avoid duplicate reports

2. **Use Bug Report Template**
   - Click "New Issue"
   - Select "Bug Report" template
   - Fill in all required information

3. **Provide Detailed Information**
   - Chrome version
   - Extension version
   - Affected platform
   - Steps to reproduce
   - Screenshots and error logs

## 💡 Feature Requests

We welcome feature suggestions!

1. **Check Existing Requests**
   - Search [Issues](../../issues) for label `enhancement`

2. **Use Feature Request Template**
   - Click "New Issue"
   - Select "Feature Request" template
   - Describe your idea in detail

3. **Join Discussions**
   - Chat with other users in [Discussions](../../discussions)

## 🤝 Contributing Code

If you want to contribute code:

1. Read [Contributing Guidelines](CONTRIBUTING.md)
2. Fork repository and create branch
3. Submit Pull Request
4. Wait for code review

## 📞 Contact Information

### GitHub
- **Issues**: [Submit Issues](../../issues)
- **Discussions**: [Join Discussions](../../discussions)
- **Pull Requests**: [Submit Code](../../pulls)

### Community
- **Star ⭐**: If this project helps you, please give it a Star
- **Fork**: If you want to contribute, Fork this project

## 📖 Learning Resources

### Chrome Extension Development
- [Chrome Extension Official Docs](https://developer.chrome.com/docs/extensions/mv3/)
- [Chrome Extension Samples](https://github.com/GoogleChrome/chrome-extensions-samples)

### JavaScript and CSS
- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript.info](https://javascript.info/)

### Git and GitHub
- [GitHub Official Docs](https://docs.github.com/)
- [Pro Git Book](https://git-scm.com/book/en/v2)

## 🔧 Troubleshooting

### Extension Won't Load

1. **Check File Integrity**
   ```bash
   # Verify all files exist
   ls -R
   ```

2. **Check manifest.json Syntax**
   ```bash
   npx web-ext lint
   ```

3. **Reload Extension**
   - Click reload in `chrome://extensions`

### Performance Issues

If extension slows down pages:

1. **Check Console**
   - Look for performance warnings
   - Check for infinite loops

2. **Disable Other Extensions**
   - Confirm it's this extension
   - Might be conflicts with other extensions

3. **Report Issue**
   - Include performance analysis data

## 🌐 International Support

Currently we support:
- 🇺🇸 English
- 🇨🇳 Chinese (documentation)

If you want to help translate:
- Create Issue to propose
- We will add translation support

## 📋 Tips for Getting Better Support

1. **Provide Detailed Information**
   - More details = better help
   - Include screenshots, error logs, reproduction steps

2. **Use Templates**
   - Issue templates help us understand quickly
   - Fill in all required fields

3. **Search First**
   - Check if solution already exists
   - Avoid duplicate issues

4. **Be Friendly**
   - We're all volunteers
   - Politeness and patience get better help

5. **Participate in Community**
   - Help other users
   - Share your experiences

## 🎉 Thanks for Using Resume Job-Fit Assistant!

We appreciate your usage and feedback. Let's make this project better together!

---

**Need more help?** → [Create Issue](../../issues)

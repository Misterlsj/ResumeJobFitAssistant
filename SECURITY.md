# Security Policy

## 🔒 Security Commitment

We are committed to maintaining the security of [Resume Job-Fit Assistant](https://resumescorer.com). This project follows these security principles:

- **Zero User Data Collection**: All data stored locally
- **No External API Calls**: No data sent to any external services
- **Minimal Permissions**: Only requests necessary browser permissions
- **Open Source Transparency**: Code is fully open source and auditable

## 🛡️ Security Architecture

### Data Privacy

- All job data is stored in the user's local browser (`chrome.storage`)
- No data is sent to any servers
- No tracking or analytics tools used
- No personal information is collected

### Permission Usage

```json
{
  "permissions": [
    "storage",      // Local data storage
    "activeTab"     // Access current active tab
  ],
  "host_permissions": [
    "<all_urls>"    // Content script injection on job sites
  ]
}
```

**Permission Explanation**:
- `storage`: Used to store settings and temporary job data
- `activeTab`: Used to detect current page content
- `host_permissions`: Only used to inject content scripts on recruitment websites

### Secure Coding Practices

- ✅ No `eval()` or dynamic code execution
- ✅ Strict Content Security Policy
- ✅ Input validation and sanitization
- ✅ No Cross-Site Scripting (XSS) risks
- ✅ No Cross-Site Request Forgery (CSRF) risks

## 🐛 Reporting Security Vulnerabilities

If you discover a security vulnerability, **please do NOT open a public issue**.

### How to Report

Send an email to: [To be added]

**Email should include**:
- Description of the vulnerability
- Steps to reproduce
- Scope of impact
- Suggested fix (if any)

### Response Commitment

- 🔒 We will acknowledge receipt within **48 hours**
- 🔍 We will provide initial assessment within **7 days**
- 🔧 We will provide a fix or timeline within **14 days**
- 🎉 We will publicly acknowledge after fix (if you wish)

### Security Vulnerability Handling Process

1. **Acknowledgment**: Verify vulnerability report
2. **Assessment**: Determine severity and impact scope
3. **Fix**: Develop and test fix
4. **Release**: Publish new version to Chrome Web Store
5. **Disclosure**: Publicly disclose vulnerability details (if applicable)

## 🔍 Common Security Questions

### Q: Does the extension collect my data?

**A**: No. All data is stored in your local browser.

### Q: Does the extension send data to servers?

**A**: No. The extension works completely offline and doesn't send data to any servers.

### Q: Can I view the source code?

**A**: Absolutely! The project is fully open source, and you can view all code on GitHub.

### Q: What should I do if I find a security issue?

**A**: Please report it following the "Reporting Security Vulnerabilities" section above.

## 📋 Security Audit

We welcome security researchers to audit our code.

### Audit Guidelines

- Please follow responsible disclosure principles
- Do not exploit vulnerabilities for malicious activities
- Limit testing to accounts and data you control

### Acknowledgments

We thank all security researchers who help us discover and fix security issues!

## 🔄 Security Updates

When security vulnerabilities are discovered and fixed:

1. Release new version to Chrome Web Store
2. Update CHANGELOG.md
3. Publish security advisory (if needed)
4. Recommend users update to latest version

## 📞 Contact Information

- **Security Issues**: security@resumescorer.com
- **General Issues**: [GitHub Issues](../../issues)
- **Website**: [https://resumescorer.com](https://resumescorer.com)

---

**Last Updated**: 2025-01-14

**Built by [ResumeScorer](https://resumescorer.com)** - Your trusted resume optimization partner.

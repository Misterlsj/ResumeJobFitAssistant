# Branch Protection Setup Guide

This document explains how to set up branch protection rules for the [Resume Job-Fit Assistant](https://resumescorer.com) project on GitHub to ensure code quality and project stability.

## 🎯 Recommended Branch Protection Configuration

### Main Branch Protection

**Access Path**: Settings → Branches → Add rule

#### Basic Settings

```
Branch name pattern: main
```

#### Required Settings

✅ **Require a pull request before merging**
- Required approving reviews: `1`
- Dismiss stale reviews when new commits are pushed: `✓`
- Require review from CODEOWNERS: `✓` (optional)

✅ **Require status checks to pass before merging**
- Require branches to be up to date before merging: `✓`
- Required status checks:
  - `lint` (if CI is set up)
  - `test` (if tests are set up)

✅ **Do not allow bypassing the above settings**
- Select: "Restrict who can push to matching branches"
- Only allow: Project maintainers

#### Optional Settings

🔹 **Require conversation resolution before merging**
- Require all discussions to be resolved

🔹 **Require linear history**
- Prohibit merge commits
- Enforce rebase or squash merge

## 📋 Setup Steps

### 1. Access Repository Settings

```
https://github.com/Misterlsj/ResumeJobFitAssistant/settings/branches
```

### 2. Create Branch Protection Rule

1. Click "Add rule" button
2. Enter "main" in "Branch name pattern"
3. Configure the recommended settings above
4. Click "Create" or "Save changes"

### 3. Verify Settings

Try pushing directly to `main` branch, which should be rejected:

```bash
git checkout main
git echo "test" >> test.txt
git commit -m "test"
git push origin main
# Should see error message
```

## 🔄 Workflow

After setting up branch protection, use this workflow:

### Feature Development

```bash
# 1. Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/your-feature

# 2. Develop and commit
# ... make changes ...
git add .
git commit -m "feat: add your feature"

# 3. Push to your fork
git push origin feature/your-feature

# 4. Create Pull Request on GitHub
# 5. Wait for review and merge
```

### Bug Fixes

```bash
# 1. Create fix branch from main
git checkout main
git pull origin main
git checkout -b fix/your-bug-fix

# 2. Fix and commit
# ... fix bug ...
git add .
git commit -m "fix: resolve XYZ issue"

# 3. Push and create PR
git push origin fix/your-bug-fix
```

## 🛡️ Protection Levels

### Level 1: Basic Protection (Minimum Recommended)

- ✅ Prohibit direct pushes
- ✅ Require PR for merging

### Level 2: Standard Protection (Recommended)

- ✅ All Level 1 settings
- ✅ Require 1 reviewer approval
- ✅ Require status checks to pass

### Level 3: Strict Protection (Large Teams)

- ✅ All Level 2 settings
- ✅ Require 2 reviewer approvals
- ✅ Require code owner approval
- ✅ Require all discussions resolved
- ✅ Require linear history

## 🎨 GitHub Actions Integration (Optional)

If you set up CI/CD, you can add:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [ main ]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run web-ext lint
        run: npx web-ext lint
```

## 📊 Branch Naming Conventions

We recommend using these branch prefixes:

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test-related
- `chore/` - Build/tooling

Examples:
```bash
feature/add-monster-support
fix/linkedin-spa-navigation
docs/update-readme
```

## 🔒 Permission Management

### Recommended Team Roles

**Admin (Administrators)**:
- Can modify all settings
- Can push to any branch

**Maintainer (Maintainers)**:
- Can merge PRs
- Can bypass branch protection

**Developer (Developers)**:
- Can create PRs
- Cannot push directly to main

**Contributor (Contributors)**:
- Can only fork and create PRs

## ⚠️ Common Issues

### Q: What if I need to make emergency fixes?

**A**: Administrators can temporarily disable branch protection, push emergency fixes, then re-enable protection.

### Q: How to handle merge conflicts?

**A**:
1. Update your feature branch
```bash
git checkout feature/your-feature
git fetch origin
git rebase origin/main
```
2. Resolve conflicts
3. Push updates

### Q: What if status checks fail?

**A**: View detailed logs, fix issues, then push new commits.

## 📚 Related Resources

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-branches-in-your-repository/managing-branch-protections)
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [DEVELOPMENT.md](DEVELOPMENT.md) - Development guide

---

**Note**: We recommend setting up branch protection immediately, even for personal projects to prevent accidental pushes.

**Built by [ResumeScorer](https://resumescorer.com)** - Your resume optimization partner.

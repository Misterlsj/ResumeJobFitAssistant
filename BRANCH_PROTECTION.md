# 分支保护设置指南

本文档说明如何在 GitHub 上设置分支保护规则，确保代码质量和项目稳定性。

## 🎯 推荐的分支保护配置

### Main 分支保护

**访问路径**: Settings → Branches → Add rule

#### 基本设置

```
分支名称模式: main
```

#### 必需设置

✅ **Require a pull request before merging**
- 必需审查人数: `1`
- 解除旧审查的批准: `✓`
- 要求代码所有者批准: `✓` (可选)

✅ **Require status checks to pass before merging**
- 要求分支在合并前是最新状态: `✓`
- 必需的状态检查:
  - `lint` (如果设置了 CI)
  - `test` (如果设置了测试)

✅ **Do not allow bypassing the above settings**
- 选择: "Restrict who can push to matching branches"
- 仅允许: 项目维护者

#### 可选设置

🔹 **Require conversation resolution before merging**
- 要求所有讨论评论都被解决

🔹 **Require linear history**
- 禁止合并提交（merge commits）
- 强制使用 rebase 或 squash merge

## 📋 设置步骤

### 1. 访问仓库设置

```
https://github.com/Misterlsj/ResumeJobFitAssistant/settings/branches
```

### 2. 创建分支保护规则

1. 点击 "Add rule" 按钮
2. 在 "Branch name pattern" 输入: `main`
3. 配置上述推荐设置
4. 点击 "Create" 或 "Save changes"

### 3. 验证设置

尝试直接推送到 `main` 分支，应该会被拒绝：

```bash
git checkout main
git echo "test" >> test.txt
git commit -m "test"
git push origin main
# 应该看到错误信息
```

## 🔄 工作流程

在分支保护设置后，使用以下工作流程：

### 功能开发

```bash
# 1. 从 main 创建功能分支
git checkout main
git pull origin main
git checkout -b feature/your-feature

# 2. 开发和提交
# ... 进行开发 ...
git add .
git commit -m "feat: add your feature"

# 3. 推送到你的 fork
git push origin feature/your-feature

# 4. 在 GitHub 上创建 Pull Request
# 5. 等待审查和合并
```

### Bug 修复

```bash
# 1. 从 main 创建修复分支
git checkout main
git pull origin main
git checkout -b fix/your-bug-fix

# 2. 修复和提交
# ... 修复 bug ...
git add .
git commit -m "fix: resolve XYZ issue"

# 3. 推送并创建 PR
git push origin fix/your-bug-fix
```

## 🛡️ 保护级别

### Level 1: 基础保护 (最小推荐)

- ✅ 禁止直接推送
- ✅ 需要 PR 才能合并

### Level 2: 标准保护 (推荐)

- ✅ Level 1 所有设置
- ✅ 需要 1 个审查人批准
- ✅ 要求状态检查通过

### Level 3: 严格保护 (大型团队)

- ✅ Level 2 所有设置
- ✅ 需要 2 个审查人批准
- ✅ 需要代码所有者批准
- ✅ 要求解决所有讨论
- ✅ 要求线性历史

## 🎨 GitHub Actions 集成 (可选)

如果设置了 CI/CD，可以添加：

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

## 📊 分支命名规范

推荐使用以下分支命名：

- `feature/` - 新功能
- `fix/` - Bug 修复
- `docs/` - 文档更新
- `refactor/` - 代码重构
- `test/` - 测试相关
- `chore/` - 构建/工具相关

示例：
```bash
feature/add-monster-support
fix/linkedin-spa-navigation
docs/update-readme
```

## 🔒 权限管理

### 推荐的团队角色

**Admin (管理员)**:
- 可以修改所有设置
- 可以推送到任何分支

**Maintainer (维护者)**:
- 可以合并 PR
- 可以绕过分支保护

**Developer (开发者)**:
- 可以创建 PR
- 不能直接推送到 main

**Contributor (贡献者)**:
- 只能 fork 和创建 PR

## ⚠️ 常见问题

### Q: 如果需要紧急修复怎么办？

**A**: 管理员可以临时关闭分支保护，推送紧急修复，然后重新启用保护。

### Q: 如何处理合并冲突？

**A**:
1. 更新你的功能分支
```bash
git checkout feature/your-feature
git fetch origin
git rebase origin/main
```
2. 解决冲突
3. 推送更新

### Q: 状态检查失败怎么办？

**A**: 查看详细日志，修复问题后推送新提交。

## 📚 相关资源

- [GitHub 分支保护文档](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-branches-in-your-repository/managing-branch-protections)
- [CONTRIBUTING.md](CONTRIBUTING.md) - 贡献指南
- [DEVELOPMENT.md](DEVELOPMENT.md) - 开发指南

---

**注意**: 建议立即设置分支保护，即使是个人项目也能防止意外推送。

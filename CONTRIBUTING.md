# 贡献指南

感谢你对 Resume Job-Fit Assistant 项目的关注！我们欢迎各种形式的贡献。

## 🤝 如何贡献

### 报告问题

如果你发现了 bug 或有功能建议：

1. 检查 [Issues](../../issues) 确认问题尚未被报告
2. 创建新的 Issue，使用清晰的标题描述问题
3. 在描述中包含：
   - 复现步骤
   - 预期行为
   - 实际行为
   - 截图（如适用）
   - 浏览器版本和扩展版本
   - 相关控制台错误日志

### 提交代码

#### 1. Fork 仓库并克隆

```bash
git clone https://github.com/YOUR_USERNAME/ResumeJobFitAssistant.git
cd ResumeJobFitAssistant
```

#### 2. 创建功能分支

```bash
git checkout -b feature/your-feature-name
# 或修复 bug
git checkout -b fix/your-bug-fix
```

**分支命名规范：**
- `feature/` - 新功能
- `fix/` - Bug 修复
- `docs/` - 文档更新
- `refactor/` - 代码重构
- `test/` - 测试相关
- `chore/` - 构建/工具相关

#### 3. 进行开发

- 遵循现有的代码风格
- 为新功能添加测试
- 更新相关文档
- 确保代码通过 lint 检查

#### 4. 提交更改

```bash
git add .
git commit -m "feat: add support for XYZ platform"
```

**提交信息规范：**

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` - 新功能
- `fix:` - Bug 修复
- `docs:` - 文档更改
- `style:` - 代码格式（不影响功能）
- `refactor:` - 代码重构
- `test:` - 添加或更新测试
- `chore:` - 构建过程或辅助工具变动

示例：
```
feat: add support for Monster.com job board
fix: handle edge case in LinkedIn SPA navigation
docs: update installation instructions
```

#### 5. 推送到你的 Fork

```bash
git push origin feature/your-feature-name
```

#### 6. 创建 Pull Request

1. 访问 GitHub 上的原仓库
2. 点击 "New Pull Request"
3. 选择你的功能分支
4. 填写 PR 模板
5. 等待代码审查

## 📋 PR 审查标准

所有 Pull Request 需要满足：

- ✅ 通过所有测试
- ✅ 代码风格一致
- ✅ 添加必要的文档
- ✅ 更新 CHANGELOG.md（如适用）
- ✅ 没有引入新的 linting 错误
- ✅ 不影响现有平台支持

## 🧪 测试指南

### 手动测试清单

提交 PR 前，请确保：

- [ ] 扩展在所有支持平台正常工作
- [ ] 浮动徽章正确显示和隐藏
- [ ] Popup 正确显示职位数据
- [ ] 设置页面功能正常
- [ ] 无控制台错误
- [ ] 性能没有明显下降

### 测试各平台

详细的平台测试步骤请参考 [README.md](README.md#测试各平台集成)。

## 🎨 代码规范

### JavaScript

- 使用现代 ES6+ 语法
- 函数命名清晰表达意图
- 避免全局变量污染
- 使用常量定义配置和魔法数字

### Chrome Extension 特定规范

- **权限最小化**: 只请求必需的权限
- **性能**: Content script 注入 < 50ms
- **内存**: 及时清理事件监听器和 DOM 引用
- **存储**: 使用 `chrome.storage.session` 存储临时数据
- **安全**: 避免使用 `eval()` 和动态代码执行

### CSS

- 使用 BEM 或类似命名规范
- 避免过度嵌套（最多 3 层）
- 使用 CSS 变量定义颜色和尺寸
- 确保足够的颜色对比度（WCAG AA）

## 📚 添加新平台支持

要添加对新招聘平台的支持：

1. 在 `content-scripts/` 创建新文件 `platform-name.js`
2. 导出 `extractJobData()` 函数
3. 在 `manifest.json` 添加 `matches` 规则
4. 更新文档和支持平台列表
5. 添加测试用例

示例模板：

```javascript
// content-scripts/newplatform.js
async function extractJobData() {
  try {
    // 提取逻辑
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

## 🐛 调试技巧

### Chrome DevTools

- **Background Script**: `chrome://extensions` → Service Worker
- **Content Script**: 右键页面 → 检查 → Console
- **Popup**: 右键扩展图标 → 检查

### 常用调试命令

```javascript
// 查看存储数据
chrome.storage.session.get(null, console.log);

// 清除存储
chrome.storage.session.clear();

// 查看所有标签页
chrome.tabs.query({}, console.log);
```

## 💬 讨论和问题

- 💡 **功能建议**: 使用 [Issues](../../issues) 标记为 `enhancement`
- 🐛 **Bug 报告**: 使用 Issues 标记为 `bug`
- 💭 **一般讨论**: 使用 [Discussions](../../discussions)

## 📄 许可证

通过贡献代码，你同意你的贡献将在与项目相同的许可证下发布。

## 🙏 致谢

感谢所有贡献者让这个项目变得更好！

---

有任何问题？随时创建 Issue 或 Discussion，我们会尽快回复！

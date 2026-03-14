# 获取帮助

欢迎来到 Resume Job-Fit Assistant 的支持中心！这里有多种方式可以获得帮助。

## 📚 文档

### 快速开始
- 📖 [README.md](README.md) - 项目概述和基本使用
- 🛠️ [DEVELOPMENT.md](DEVELOPMENT.md) - 详细的开发指南
- 🤝 [CONTRIBUTING.md](CONTRIBUTING.md) - 如何贡献代码

### 常见问题

### Q: 扩展在某个网站上不工作怎么办？

**A**: 请按以下步骤排查：

1. **确认平台支持**
   - 检查该平台是否在 [支持列表](README.md#支持的所有平台) 中
   - 确认 URL 模式匹配

2. **刷新扩展**
   - 访问 `chrome://extensions`
   - 点击扩展的刷新按钮

3. **检查控制台错误**
   - 在目标页面按 `F12` 打开开发者工具
   - 查看 Console 是否有错误信息
   - 将错误信息复制给我们

4. **重新加载页面**
   - 有时页面加载问题会导致扩展未注入

### Q: 浮动徽章不显示？

**A**: 可能的原因：

1. **页面不是职位详情页**
   - 确保你在职位详情页面，而不是搜索列表页

2. **扩展未注入**
   - 检查 `chrome://extensions` 中扩展是否启用
   - 点击"重新加载"按钮

3. **CSS 冲突**
   - 某些网站的 CSS 可能影响徽章显示
   - 尝试点击扩展图标查看是否检测到职位

### Q: Popup 显示 "No Job Detected"？

**A**: 这意味着扩展未检测到职位数据：

1. **确认 URL 匹配**
   - 检查 manifest.json 中的 `matches` 规则
   - 确认你的 URL 符合模式

2. **等待页面完全加载**
   - 某些网站动态加载内容
   - 等待几秒钟后再试

3. **查看 Service Worker 日志**
   - 访问 `chrome://extensions`
   - 点击 "Service Worker" 查看日志

### Q: LinkedIn 页面切换时徽章不更新？

**A**: LinkedIn 是 SPA 应用，需要特殊处理：

1. **等待几秒钟**
   - 扩展需要时间检测 URL 变化
   - 通常 1-2 秒后会更新

2. **刷新页面**
   - 如果问题持续，尝试刷新页面

3. **报告问题**
   - 如果问题一直存在，请创建 Issue 报告

### Q: 如何查看存储的职位数据？

**A**: 使用开发者工具：

```javascript
// 在 Console 中运行
chrome.storage.session.get(null, (data) => {
  console.log(data);
});
```

### Q: 扩展会收集我的数据吗？

**A**: 不会。请查看我们的 [安全政策](SECURITY.md)。

## 🐛 报告问题

如果你发现了 bug：

1. **搜索现有 Issues**
   - 在 [Issues](../../issues) 中搜索是否已有相同问题
   - 避免重复报告

2. **使用 Bug 报告模板**
   - 点击 "New Issue"
   - 选择 "Bug 报告" 模板
   - 填写所有必要信息

3. **提供详细信息**
   - Chrome 版本
   - 扩展版本
   - 受影响的平台
   - 复现步骤
   - 截图和错误日志

## 💡 功能建议

我们欢迎功能建议！

1. **检查现有功能请求**
   - 在 [Issues](../../issues) 中搜索标签 `enhancement`

2. **使用功能请求模板**
   - 点击 "New Issue"
   - 选择 "功能请求" 模板
   - 详细描述你的想法

3. **参与讨论**
   - 在 [Discussions](../../discussions) 中与其他用户交流

## 🤝 贡献代码

如果你想要贡献代码：

1. 阅读 [贡献指南](CONTRIBUTING.md)
2. Fork 仓库并创建分支
3. 提交 Pull Request
4. 等待代码审查

## 📞 联系方式

### GitHub
- **Issues**: [提交问题](../../issues)
- **Discussions**: [参与讨论](../../discussions)
- **Pull Requests**: [提交代码](../../pulls)

### 社区
- **Star ⭐**: 如果这个项目对你有帮助，请给个 Star
- **Fork**: 如果你想贡献代码，Fork 这个项目

## 📖 学习资源

### Chrome 扩展开发
- [Chrome Extension 官方文档](https://developer.chrome.com/docs/extensions/mv3/)
- [Chrome Extension Samples](https://github.com/GoogleChrome/chrome-extensions-samples)

### JavaScript 和 CSS
- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript.info](https://javascript.info/)

### Git 和 GitHub
- [GitHub 官方文档](https://docs.github.com/)
- [Pro Git 书籍](https://git-scm.com/book/zh/v2)

## 🔧 故障排除

### 扩展无法加载

1. **检查文件完整性**
   ```bash
   # 确认所有文件存在
   ls -R
   ```

2. **检查 manifest.json 语法**
   ```bash
   npx web-ext lint
   ```

3. **重新加载扩展**
   - 在 `chrome://extensions` 点击刷新

### 性能问题

如果扩展导致页面变慢：

1. **检查控制台**
   - 查看是否有性能警告
   - 检查是否有无限循环

2. **禁用其他扩展**
   - 确认是本扩展的问题
   - 可能是其他扩展冲突

3. **报告问题**
   - 提供性能分析数据

## 🌐 国际支持

目前我们支持：
- 🇨🇳 简体中文
- 🇺🇸 英语 (文档)

如果你想要帮助翻译：
- 创建 Issue 提出
- 我们会添加翻译支持

## 📋 获取最佳支持的技巧

1. **提供详细信息**
   - 越多的细节，越容易帮助
   - 包括截图、错误日志、复现步骤

2. **使用模板**
   - Issue 模板帮助我们快速理解问题
   - 填写所有必填字段

3. **搜索优先**
   - 先搜索是否已有解决方案
   - 避免重复问题

4. **保持友好**
   - 我们都是志愿者
   - 礼貌和耐心会得到更好的帮助

5. **参与社区**
   - 帮助其他用户
   - 分享你的经验

## 🎉 感谢使用 Resume Job-Fit Assistant！

我们感谢你的使用和反馈。让我们一起让这个项目变得更好！

---

**需要更多帮助？** → [创建 Issue](../../issues)

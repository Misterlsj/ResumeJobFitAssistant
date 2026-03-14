# 变更日志

本文档记录项目的所有重要变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [未发布]

### 计划中
- 添加自动化测试
- 添加 CI/CD 流程
- 支持更多招聘平台

## [1.0.0] - 2025-01-14

### 新增
- ✨ 初始版本发布
- 🎯 支持 5 大招聘平台：
  - LinkedIn (`linkedin.com/jobs/view/*`)
  - Indeed (`indeed.com/viewjob*`, `indeed.com/jobs*`)
  - Glassdoor (`glassdoor.com/job-listing/*`)
  - Lever (`jobs.lever.co/*`)
  - Greenhouse (`boards.greenhouse.io/*/jobs/*`)
- 🔍 自动职位检测和提取
- 🎨 非侵入式浮动徽章 UI
- 📱 扩展弹出窗口显示职位数据
- ⚙️ 设置页面
- 📦 Manifest V3 架构
- 🚀 零 AI 功能，零 API 密钥
- 🔒 完全本地存储，不收集用户数据

### 技术特性
- Content Scripts 自动注入
- Service Worker 消息处理
- chrome.storage.session 临时数据存储
- LinkedIn SPA 导航支持
- Base64 URL 编码职位描述
- 响应式 CSS 设计

### 文档
- 📝 README.md - 项目概述
- 📝 CONTRIBUTING.md - 贡献指南
- 📝 DEVELOPMENT.md - 开发指南
- 📝 SECURITY.md - 安全政策
- 📝 CLAUDE.md - AI 辅助开发指南
- 📝 CHANGELOG.md - 变更日志

### GitHub 配置
- 🔀 PR 模板
- 🐛 Bug 报告模板
- ✨ 功能请求模板
- 🛡️ 分支保护指南

## [未来版本]

### 计划功能
- 🌍 支持更多国际招聘平台
- 🎨 自定义主题选项
- 📊 使用统计和性能监控
- 🔔 智能通知系统
- 🌐 多语言支持

---

## 版本说明

### [1.0.0] - 2025-01-14

**首次公开发布**

核心功能完整，支持主要招聘平台，架构清晰，文档完善。

---

## 变更类型说明

- `新增` - 新功能
- `变更` - 现有功能的变更
- `弃用` - 即将移除的功能
- `移除` - 已移除的功能
- `修复` - Bug 修复
- `安全` - 安全相关的修复或改进

---

**注释**:
- `[未发布]` - 尚未发布的变更
- `[版本号]` - 已发布版本的链接

---

## 如何使用此文件

### 添加新变更

1. 在 `[未发布]` 部分添加变更
2. 使用标准的变更类型
3. 清晰描述变更内容

### 发布新版本

1. 创建新版本部分：`[1.1.0] - 2025-XX-XX`
2. 移动 `[未发布]` 的内容到新版本
3. 清空 `[未发布]` 部分
4. 更新 Git 标签

---

**维护者**: 请在每次发布时更新此文件

# 开发指南

本文档提供 Resume Job-Fit Assistant Chrome 扩展的详细开发指南。

## 📋 目录

- [环境设置](#环境设置)
- [开发工作流](#开发工作流)
- [架构详解](#架构详解)
- [核心概念](#核心概念)
- [调试技巧](#调试技巧)
- [性能优化](#性能优化)
- [测试策略](#测试策略)
- [部署流程](#部署流程)

## 🔧 环境设置

### 必需工具

- **Chrome 浏览器** (最新稳定版)
- **代码编辑器** (推荐 VS Code)
- **Git** (版本控制)

### 可选工具

```bash
# Chrome 扩展 lint 工具
npm install -g web-ext

# 代码格式化
npm install -g prettier

# JavaScript linting
npm install -g eslint
```

### VS Code 扩展推荐

- **Chrome Extension Tools** - 调试支持
- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **GitHub Copilot** - AI 辅助编码

## 🔄 开发工作流

### 1. 加载扩展进行开发

```bash
# 1. 在 Chrome 中打开扩展管理页面
chrome://extensions

# 2. 启用开发者模式（右上角开关）

# 3. 点击"加载已解压的扩展程序"

# 4. 选择项目根目录
```

### 2. 开发循环

```bash
# 1. 修改代码
# 2. 在 chrome://extensions 页面点击刷新按钮
# 3. 测试更改
# 4. 重复
```

**快捷技巧**: 将扩展页面保持打开，使用 `Ctrl+R` 快速刷新。

### 3. 验证更改

```bash
# 运行 lint 检查
npx web-ext lint

# 检查 manifest 语法
npx web-ext lint --warnings-as-errors
```

## 🏗️ 架构详解

### 文件结构

```
resume-extension/
├── manifest.json              # 扩展配置清单
├── background/
│   └── service-worker.js      # 后台服务（无持久状态）
├── content-scripts/           # 内容脚本（注入到网页）
│   ├── detector.js           # 共享检测逻辑
│   ├── linkedin.js           # LinkedIn 特定逻辑
│   ├── indeed.js             # Indeed 特定逻辑
│   ├── glassdoor.js          # Glassdoor 特定逻辑
│   ├── lever.js              # Lever 特定逻辑
│   └── greenhouse.js         # Greenhouse 特定逻辑
├── popup/                    # 扩展弹出窗口
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── sidebar/                  # 页面浮动徽章
│   ├── sidebar.js
│   └── sidebar.css
├── settings/                 # 设置页面
│   ├── settings.html
│   ├── settings.js
│   └── settings.css
└── assets/                   # 图标和图片资源
    ├── icon.svg
    ├── icon-16.png
    ├── icon-48.png
    └── icon-128.png
```

### 数据流架构

```
┌─────────────────┐
│  招聘网站页面    │
│  (LinkedIn等)   │
└────────┬────────┘
         │ 1. DOM加载
         │
┌────────▼────────┐
│  Content Script │
│  extractJobData()│
└────────┬────────┘
         │ 2. sendMessage()
         │
┌────────▼────────────┐
│  Service Worker     │
│  存储到session      │
└────────┬────────────┘
         │ 3. 读取存储
         │
┌────────▼────────┐
│  Popup/Sidebar  │
│  显示职位数据    │
└────────┬────────┘
         │ 4. 用户点击CTA
         │
┌────────▼────────┐
│  打开网站       │
│  (URL编码数据)  │
└─────────────────┘
```

## 💡 核心概念

### Manifest V3 特性

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

**关键变化**（对比 MV2）：
- Service Worker 替代背景页面（无持久 DOM）
- 使用 `chrome.storage.session` 替代 `chrome.storage.local`（会话级存储）
- 需要显式声明 `host_permissions`

### Content Script 注入

```javascript
// manifest.json 中的配置
"content_scripts": [
  {
    "matches": ["https://www.linkedin.com/jobs/view/*"],
    "js": ["content-scripts/detector.js", "content-scripts/linkedin.js"],
    "run_at": "document_idle"
  }
]
```

**注入时机**:
- `document_start` - CSS 加载后，DOM 构建前
- `document_end` - DOM 构建完成，但在资源加载前
- `document_idle` - 最佳时机（默认）

### 消息传递

**Content Script → Service Worker**:
```javascript
// 发送
chrome.runtime.sendMessage({
  type: 'JOB_DETECTED',
  data: jobData
});

// 接收
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'JOB_DETECTED') {
    // 处理数据
  }
});
```

**Popup → Service Worker**:
```javascript
// 请求当前作业数据
chrome.runtime.sendMessage({ type: 'GET_CURRENT_JOB' }, (response) => {
  console.log(response.data);
});
```

### 存储策略

```javascript
// 会话级存储（浏览器关闭时清除）
chrome.storage.session.set({ currentJob: jobData });

// 持久存储（设置等）
chrome.storage.local.set({ userSettings: settings });

// 读取数据
chrome.storage.session.get(['currentJob'], (result) => {
  console.log(result.currentJob);
});
```

## 🐛 调试技巧

### 调试 Service Worker

1. 访问 `chrome://extensions`
2. 找到扩展，点击 "Service Worker"
3. 打开开发者工具进行调试

**注意**: Service Worker 可能会休眠，调试时保持 DevTools 打开以保持活动。

### 调试 Content Script

1. 在目标网页上右键 → "检查"
2. 在 Console 中可以看到 content script 的日志
3. 可以直接在 Console 中执行脚本代码

### 调试 Popup

1. 右键扩展图标 → "检查"
2. DevTools 将显示 popup 的 DOM

### 常用调试代码

```javascript
// 查看所有存储数据
chrome.storage.session.get(null, (data) => console.log(data));

// 清除存储
chrome.storage.session.clear();

// 查看所有标签页
chrome.tabs.query({}, (tabs) => console.log(tabs));

// 发送测试消息
chrome.runtime.sendMessage({ type: 'TEST' }, (response) => {
  console.log('Response:', response);
});
```

### 性能分析

```javascript
// 在代码中添加性能标记
console.time('jobExtraction');
// ... 你的代码 ...
console.timeEnd('jobExtraction');
```

## ⚡ 性能优化

### Content Script 优化

**❌ 不好的做法**:
```javascript
// 每次都查询 DOM
function getTitle() {
  return document.querySelector('.job-title').textContent;
}
```

**✅ 好的做法**:
```javascript
// 缓存 DOM 查询
const titleElement = document.querySelector('.job-title');
function getTitle() {
  return titleElement?.textContent?.trim();
}
```

### 批量 DOM 操作

**❌ 不好的做法**:
```javascript
// 多次重绘
elements.forEach(el => {
  document.body.appendChild(el);
});
```

**✅ 好的做法**:
```javascript
// 一次性添加
const fragment = document.createDocumentFragment();
elements.forEach(el => fragment.appendChild(el));
document.body.appendChild(fragment);
```

### 消息传递优化

```javascript
// 批量消息而不是频繁发送
const debouncedSend = debounce(() => {
  chrome.runtime.sendMessage(data);
}, 300);
```

### 内存管理

```javascript
// 清理事件监听器
function cleanup() {
  observer.disconnect();
  element.removeEventListener('click', handler);
}

// 在页面卸载时清理
window.addEventListener('unload', cleanup);
```

## 🧪 测试策略

### 手动测试清单

#### 基础功能测试
- [ ] 所有支持平台都能正确检测职位
- [ ] 徽章在非职位页面不显示
- [ ] Popup 正确显示职位数据
- [ ] 设置保存和加载正常
- [ ] 无控制台错误

#### 平台特定测试
- [ ] **LinkedIn**: SPA 导航正确触发
- [ ] **Indeed**: 搜索页和详情页都能工作
- [ ] **Glassdoor**: 各种职位页面格式
- [ ] **Lever**: 不同公司的 Lever 页面
- [ ] **Greenhouse**: 不同公司的 Greenhouse 页面

#### 边界情况测试
- [ ] 长职位描述（>8000 字符）正确截断
- [ ] 特殊字符处理正确
- [ ] 网络错误处理
- [ ] 页面动态内容加载

#### 性能测试
- [ ] Content Script 注入时间 < 50ms
- [ ] 数据提取时间 < 200ms
- [ ] Popup 渲染时间 < 150ms
- [ ] 不影响原页面性能

### 自动化测试（未来）

```javascript
// 示例：单元测试结构
describe('Job Extraction', () => {
  it('should extract LinkedIn job data', async () => {
    const data = await extractJobData();
    expect(data).toHaveProperty('job_title');
    expect(data).toHaveProperty('company_name');
  });
});
```

## 🚀 部署流程

### 准备发布

```bash
# 1. 运行 lint 检查
npx web-ext lint

# 2. 测试所有平台
# 手动测试所有 5 个平台

# 3. 更新版本号
# 在 manifest.json 中更新 version

# 4. 构建生产包
# 确保移除开发-only 代码和日志

# 5. 准备商店资源
# - 图标：128×128, 48×48, 16×16 PNG
# - 截图：1280×800 或 640×400
```

### Chrome Web Store 提交

1. 访问 [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. 创建新项目
3. 上传 ZIP 包（排除 `.git/`, `node_modules/` 等）
4. 填写商店信息：
   - 名称：Resume Job-Fit Assistant
   - 描述：简短功能描述
   - 详细描述：完整功能介绍
   - 分类：生产力工具
   - 语言：英语/中文
5. 上传截图和图标
6. 添加隐私政策 URL
7. 提交审核

### 版本发布后

```bash
# 创建 Git 标签
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# 更新 CHANGELOG.md
# 添加新版本的功能和修复
```

## 📚 相关资源

### 官方文档
- [Chrome Extension MV3 文档](https://developer.chrome.com/docs/extensions/mv3/)
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/api/storage)
- [Chrome Web Store 政策](https://developer.chrome.com/docs/webstore/program-policies/)

### 社区资源
- [Chrome Extension Samples](https://github.com/GoogleChrome/chrome-extensions-samples)
- [web-ext (Mozilla)](https://github.com/mozilla/web-ext)

### 项目文档
- [README.md](README.md) - 项目概述和快速开始
- [CONTRIBUTING.md](CONTRIBUTING.md) - 贡献指南
- [CLAUDE.md](CLAUDE.md) - AI 辅助开发指南

---

有问题？查看 [Issues](../../issues) 或创建新的 Issue！

# Resume Job-Fit Assistant - Chrome Extension

## Phase 2 Complete ✅

这是一个 Chrome 浏览器扩展（Manifest V3），用于在招聘网站上自动检测职位内容，并提供一键跳转到简历工具网站。

### 功能特点

- ✅ **零 AI 功能** - 所有智能处理都在网站端完成
- ✅ **零 API 密钥** - 无外部 API 依赖
- ✅ **无后端服务器** - 纯客户端扩展
- ✅ **不收集用户数据** - 所有数据存储在本地 chrome.storage
- ✅ **浮动徽章** - 检测到职位时在页面右下角显示非侵入式徽章

### 支持的所有平台

- ✅ LinkedIn (`linkedin.com/jobs/view/*`)
- ✅ Indeed (`indeed.com/viewjob*`, `indeed.com/jobs*`)
- ✅ Glassdoor (`glassdoor.com/job-listing/*`)
- ✅ Lever (`jobs.lever.co/*`)
- ✅ Greenhouse (`boards.greenhouse.io/*/jobs/*`)

## 项目结构

```
resume-extension/
├── manifest.json              # Manifest V3 配置
├── background/
│   └── service-worker.js      # 后台服务 Worker
├── content-scripts/
│   ├── detector.js            # 共享检测逻辑
│   ├── linkedin.js            # LinkedIn 特定选择器
│   ├── indeed.js              # Indeed 特定选择器
│   ├── glassdoor.js           # Glassdoor 特定选择器
│   ├── lever.js               # Lever 特定选择器
│   └── greenhouse.js          # Greenhouse 特定选择器
├── popup/
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── sidebar/
│   ├── sidebar.js             # 浮动徽章注入
│   └── sidebar.css
├── settings/
│   ├── settings.html
│   ├── settings.js
│   └── settings.css
├── assets/
│   ├── icon.svg               # 图标源文件
│   ├── icon-16.png            # 16×16 图标（待创建）
│   ├── icon-48.png            # 48×48 图标（待创建）
│   ├── icon-128.png           # 128×128 图标（待创建）
│   └── ICON_GUIDE.md          # 图标创建指南
└── README.md
```
│   └── sidebar.css
├── settings/
│   ├── settings.html
│   ├── settings.js
│   └── settings.css
└── assets/                    # 图标文件（待添加）
    ├── icon-16.png
    ├── icon-48.png
    └── icon-128.png
```

## 开发指南

### 加载扩展进行开发

1. 在 Chrome 中导航到 `chrome://extensions`
2. 启用"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择此目录

### 测试各平台集成

#### LinkedIn
1. 访问 [LinkedIn Jobs](https://www.linkedin.com/jobs)
2. 点击任意职位详情页
3. 检查：
   - 扩展图标显示 ✓ 徽章
   - 页面右下角显示浮动徽章
   - 点击扩展图标查看职位数据
   - 状态显示 "LinkedIn detected"
   - CTA 按钮打开带有编码参数的网站
4. 测试 SPA 导航：点击不同职位，确认徽章更新

#### Indeed
1. 访问 [Indeed](https://www.indeed.com/jobs)
2. 搜索并点击任意职位
3. 检查：
   - 扩展图标显示 ✓ 徽章
   - 页面右下角显示浮动徽章
   - 状态显示 "Indeed detected"

#### Glassdoor
1. 访问 [Glassdoor Jobs](https://www.glassdoor.com/Job)
2. 点击任意职位详情页
3. 检查同上的功能

#### Lever
1. 访问任意 Lever 招聘页面（如 `jobs.stripe.co`）
2. 点击任意职位
3. 检查同上的功能

#### Greenhouse
1. 访问任意 Greenhouse 招聘页面（如 `boards.greenhouse.io/airbnb/jobs`）
2. 点击任意职位
3. 检查同上的功能

### 手动测试用例

#### 基础功能
- [ ] 扩展在所有支持平台的职位页正确显示徽章
- [ ] 点击扩展图标显示职位数据
- [ ] 平台名称正确显示在状态徽章中
- [ ] CTA 按钮打开带有编码参数的网站
- [ ] JD 超过 8000 字符时正确截断

#### 浮动徽章
- [ ] 页面右下角显示浮动徽章
- [ ] 点击浮动徽章打开扩展弹出窗口
- [ ] 导航离开职位页时徽章消失
- [ ] LinkedIn SPA 导航时徽章正确更新

#### 稳定性
- [ ] 在非职位页面导航时徽章消失
- [ ] Chrome 重启后扩展正常工作
- [ ] 设置在页面重新加载后保持
- [ ] content script 错误不影响宿主页面

## 技术架构

### 数据流

1. Content Script 提取 DOM 数据
2. 发送消息到 Service Worker: `chrome.runtime.sendMessage({type:'JOB_DETECTED', data})`
3. Service Worker 存储在 `chrome.storage.session`
4. Popup 从存储读取并渲染预览
5. CTA 点击打开带有 URL 编码职位数据的网站

### LinkedIn SPA 导航处理

LinkedIn 是一个重度 React SPA，URL 通过 pushState 变化而不触发完整页面重新加载。

使用以下方法处理：
- `chrome.webNavigation.onHistoryStateUpdated` 事件
- MutationObserver 监听职位详情面板容器

**不要在 LinkedIn 上仅依赖 DOMContentLoaded。**

### URL 参数编码

职位描述在 URL 嵌入前进行 Base64 编码：
```
https://yoursite.com/tailor?source=extension&job_title=...&jd=BASE64_ENCODED_JD_TEXT
```

最大 JD 长度：8000 字符（Base64 后）。超出则截断并添加 `&jd_truncated=true`。

### 性能要求

- Content Script 注入：DOM ready 后 < 50ms
- 数据提取：每页 < 200ms
- Popup 渲染：点击到可见 < 150ms
- 不得降低宿主页面性能（> 5ms 延迟）

## Chrome Web Store 提交

所需资源：
- 图标：128×128px, 48×48px, 16×16px PNG
- 截图：1280×800px 或 640×400px（1-5 张图片）
- 隐私政策 URL（托管在网站上）

审核时间：通常 1-3 个工作日

## 开发命令

```bash
# Lint 扩展
npx web-ext lint

# 重新加载扩展（开发期间）
# 点击 chrome://extensions 页面上的重新加载按钮
```

## 故障排除

### Content Script 未注入

- 检查 manifest.json 中的 `matches` 模式
- 确认 URL 模式与实际页面 URL 匹配
- 检查浏览器控制台是否有 CSP 错误

### LinkedIn SPA 导航未触发提取

- 检查 `chrome.webNavigation` 权限
- 验证 `onHistoryStateUpdated` 监听器是否触发
- 检查 MutationObserver 目标元素是否存在

### Popup 显示"No Job Detected"

- 检查 `chrome.storage.session` 是否包含数据
- 验证 content script 成功发送 `JOB_DETECTED` 消息
- 检查 service worker 是否活动（查看 chrome://extensions -> Service Worker）

## 参考资料

- 产品需求文档：`resume_extension_prd.docx`
- Manifest V3 文档：https://developer.chrome.com/docs/extensions/mv3/
- chrome.storage API：https://developer.chrome.com/docs/extensions/reference/api/storage

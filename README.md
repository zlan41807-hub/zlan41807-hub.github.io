# 谨防建筑 JFA — 企业品牌官网

杭州谨防建筑设计有限公司（Hangzhou Jinfang Architectural Design Co., Ltd. / **JFA**）官方品牌站。
建筑全产业链一站式解决方案：建筑设计 · 室内设计 · 景观设计 · 结构工程 · BIM 咨询 · 工程管理 · 家具软装 · 门窗系统。

线上地址：<https://ycg875042545-netizen.github.io/archdomain-site/>

---

## 技术说明

| 项目 | 说明 |
|---|---|
| 形态 | 纯静态单页（`index.html`），无需构建、无需服务器 |
| 托管 | GitHub Pages，发布分支 `gh-pages`，根目录即站点根目录 |
| 字体 | **全站自托管**，无外部 CDN 依赖（`assets/fonts` + `assets/fontawesome`） |
| 图标 | Font Awesome 6.5.0 Free（本地 `webfonts/`） |
| 语言 | 中文为默认，右上角按钮切换英文（`data-lang` + `localStorage` 记忆） |
| 询盘 | 由 FormSubmit.co 转发到邮箱，无需后端 |

## 目录结构

```
archdomain-site/
├── index.html                  # 网站主文件（中英双语单页）
├── README.md
├── assets/
│   ├── logo.svg                # 品牌标识（同时用于结构化数据）
│   ├── fonts/
│   │   ├── fonts.css           # 本地 @font-face 定义
│   │   ├── inter-latin-*.woff2          # 300/400/500/600/700/800
│   │   └── playfair-display-latin-*.woff2
│   └── fontawesome/
│       ├── css/all.min.css
│       └── webfonts/fa-{solid-900,regular-400,brands-400}.woff2
└── images/
    ├── projects/               # 项目案例图
    └── ai-works/               # AI 概念图
```

> 中文字体**不再加载 Web 字体**，改用系统字体栈（PingFang SC / 微软雅黑 / 思源黑体…），
> 国内访问不再依赖 `fonts.googleapis.com`，首屏不会被墙掉。

## 页面结构

`#home` 首屏 → `#about` 关于我们 → `#stats` 数据 → `#services` 业务 → `#projects` 案例
→ `#process` 服务流程 → `#team` 团队 → `#contact` 联系我们

## 部署

站点由 `gh-pages` 分支直接发布，改动提交并推送即生效：

```bash
git add -A
git commit -m "更新网站"
git push origin gh-pages
```

推送后约 1 分钟自动发布到 <https://ycg875042545-netizen.github.io/archdomain-site/>。
无需任何部署脚本、无需 SSH 密钥。

## 常见修改

| 想改什么 | 改哪里 |
|---|---|
| 品牌名 / 口号 | `index.html` 中 `lang-zh` / `lang-en` 成对出现的文本 |
| 邮箱 / 电话 | 搜索 `1179060110@qq.com` 与 `tel:+8615958117391`（页脚、联系区、结构化数据共 3 处） |
| 询盘收件邮箱 | `index.html` 中搜索 `formsubmit.co`（`<form action>` 与 JS 里的 `fetch` 各 1 处） |
| 数据指标 | `index.html` 中搜索 `data-target` |
| 服务项目 | 搜索 `services-grid` 区块 |
| 案例图片 | 放入 `images/projects/`，替换 `projects-grid` 中对应的 `<img src>` |
| SEO / 分享卡片 | `<head>` 中的 `og:*`、`twitter:*`、`canonical` 与 JSON-LD 区块 |

### 关于询盘表单

表单通过 **FormSubmit.co** 免费转发，**无需注册、无需后端**：

- 收件邮箱：`1179060110@qq.com`
- 首次上线后需打开该邮箱，点击 FormSubmit 发来的**激活邮件**，之后才能正常收到询盘
- 若发送失败，页面会自动给出「改用电邮发送」按钮兜底，询盘不会丢

更换收件邮箱：把 `index.html` 里所有 `formsubmit.co/<邮箱>` 与 `formsubmit.co/ajax/<邮箱>` 换成新邮箱即可。

## 维护注意

- **不要在仓库中提交私钥、SSH 公钥、API Key 或任何凭据。**
- 修改 `index.html` 前建议先本地用浏览器直接打开预览。
- `.reveal` 入场动画仅在 JS 可用时启用；无 JS 或爬虫抓取时内容照常显示，不会白屏。

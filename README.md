# 开发实验室官网

根据 `docs/实验室官网项目文档.md` 初始化的纯前端静态网站项目。

## 技术栈

- Vue 3 + Vite + TypeScript
- Vue Router + Pinia
- Tailwind CSS + Element Plus + Headless UI Vue
- GSAP + ScrollTrigger
- @lucide/vue 图标

Element Plus 和 Headless UI Vue 已作为依赖保留，当前初始化页面未全量注册 Element Plus，后续表单、列表、后台式页面需要时建议按需引入，避免官网首屏包过大。

## 当前初始化范围

已完成第一阶段的工程基础和当前需要的核心页面：

- 首页：沉浸式 Hero、代码词背景、打字机标题、蓝白渐变条纹、四方向滚动翻牌模块。
- 关于我们：实验室定位说明、横向滚动时间轴、四方向详解、实验室文化。
- 加入我们：四方向招募、8 周学习到正式加入的流程、FAQ 手风琴。
- 主题：深色优先，可切换浅色模式。
- 响应式：桌面、平板、手机均保留基础适配。

文档中标注“暂不需要”的团队成员、研究成果、新闻动态页面暂未展开，避免初始化阶段引入不必要的内容和维护面。

## 本地开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## 目录说明

```text
public/
  data/          静态 JSON 数据
  images/        图片资源占位目录
  fonts/         字体资源占位目录
src/
  components/    布局、基础 UI、首页和动画组件
  data/          页面内使用的结构化数据
  lib/           GSAP 等工具初始化
  pages/         路由页面
  router/        Vue Router 配置
  stores/        Pinia 状态
  styles/        全局样式和 Design Token
```

## 后续替换项

- 实验室正式名称、英文名称、Slogan。
- 所属院校、成立时间、团队规模。
- 招新邮箱、地址、GitHub 组织。
- 成员、项目、新闻等真实数据和图片素材。

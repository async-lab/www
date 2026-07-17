// 应用入口文件：负责创建 Vue 实例，挂载全局样式、状态管理（Pinia）、路由和 GSAP 动画库，
// 最终把整个应用挂载到 index.html 中的 #app 节点上。
import "./styles/globals.css";

import { createPinia } from "pinia";
import { createApp } from "vue";

import App from "./App.vue";
import { setupGsap } from "./lib/gsap";
import router from "./router";

// 注册 GSAP 插件（ScrollTrigger / ScrollSmoother）并设置全局动画默认值。
// 必须在任何组件使用 gsap 之前调用一次，setupGsap() 内部有 configured 标记防止重复执行。
setupGsap();

const app = createApp(App);

// 全局状态管理（当前仅 stores/app.ts 中的主题与移动端菜单开关状态）。
app.use(createPinia());
// 前端路由：管理首页 "/" 与加入我们 "/join" 两个页面的切换。
app.use(router);

app.mount("#app");

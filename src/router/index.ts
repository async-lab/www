import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

// 站点路由表：目前只有首页和加入我们两个页面，其余路径统一重定向。
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    // 路由级懒加载，首屏只加载 Home.vue 对应的代码分片。
    component: () => import("@/pages/Home.vue"),
    meta: {
      title: "首页",
    },
  },
  {
    path: "/about",
    // 历史/兼容路径：跳转到首页的 #about 锚点区块，而不是独立页面。
    redirect: "/#about",
  },
  {
    path: "/join",
    name: "join",
    component: () => import("@/pages/Join.vue"),
    meta: {
      title: "加入我们",
    },
  },
  {
    // 兜底路由：匹配所有未定义路径，避免出现路由级 404 白屏，直接跳回首页。
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  // HTML5 history 模式（无 # 前缀的干净 URL），部署时需要服务器把未知路径回退到 index.html。
  history: createWebHistory(),
  routes,
});

// 每次路由切换完成后，根据目标路由的 meta.title 更新浏览器标签页标题。
router.afterEach((to) => {
  const title = typeof to.meta.title === "string" ? to.meta.title : "异步开发实验室";
  document.title = `${title} - 异步开发实验室官网`;
});

export default router;

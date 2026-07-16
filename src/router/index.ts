import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: () => import("@/pages/Home.vue"),
    meta: {
      title: "首页",
    },
  },
  {
    path: "/about",
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
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.afterEach((to) => {
  const title = typeof to.meta.title === "string" ? to.meta.title : "异步开发实验室";
  document.title = `${title} - 异步开发实验室官网`;
});

export default router;

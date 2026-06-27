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
    name: "about",
    component: () => import("@/pages/About.vue"),
    meta: {
      title: "关于我们",
    },
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
  scrollBehavior() {
    return { top: 0 };
  },
});

router.afterEach((to) => {
  const title = typeof to.meta.title === "string" ? to.meta.title : "开发实验室";
  document.title = `${title} - 开发实验室官网`;
});

export default router;

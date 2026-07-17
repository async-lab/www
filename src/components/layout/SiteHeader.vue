<script setup lang="ts">
// 全站顶部导航栏：桌面端横向导航 + 移动端汉堡菜单，固定在页面顶部，滚动后切换为“紧凑态”样式。
import { Menu, X } from "@lucide/vue";
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

import { useAppStore } from "@/stores/app";

// 主导航条目；"关于我们" 指向首页锚点而非独立路由。
const navItems = [
  { label: "首页", to: "/" },
  { label: "关于我们", to: "/#about" },
  { label: "加入我们", to: "/join" },
];

const route = useRoute();
const appStore = useAppStore();
// 滚动超过 24px 后为 true，用于切换导航栏的紧凑视觉样式（见下方 :class 绑定）。
const isScrolled = ref(false);

function updateScrollState() {
  isScrolled.value = window.scrollY > 24;
}

onMounted(() => {
  updateScrollState();
  window.addEventListener("scroll", updateScrollState, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", updateScrollState);
});

// 路由切换后自动收起移动端菜单，避免跳转到新页面时菜单仍处于展开状态。
watch(
  () => route.fullPath,
  () => {
    appStore.setMenuOpen(false);
  },
);
</script>

<template>
  <header class="fixed left-0 right-0 top-0 z-50 px-3 pt-3 sm:px-4">
    <!-- 无障碍“跳到主内容”链接：默认视觉隐藏，键盘 Tab 聚焦后可见，帮助屏幕阅读器/键盘用户跳过导航。 -->
    <a
      href="#main-content"
      class="sr-only rounded-lg bg-lab-primary px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-20"
    >
      跳到主内容
    </a>

    <nav
      class="mx-auto flex max-w-7xl items-center justify-between rounded-lg border px-4 backdrop-blur-xl transition-[padding,background-color,border-color,box-shadow] duration-300 sm:px-6 lg:px-8"
      :class="
        isScrolled
          ? 'border-white/70 bg-white/85 py-2 shadow-[0_12px_36px_rgba(29,29,31,0.08)]'
          : 'border-lab-border bg-white/95 py-3 shadow-sm'
      "
      aria-label="主导航"
    >
      <RouterLink to="/" class="flex min-w-0 items-center gap-4 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-lab-primary">
        <img
          src="/logo/白色背景_透明.svg"
          alt=""
          class="h-1/2 w-1/1 shrink-0 rounded-lg border border-lab-border bg-white object-contain p-1"
          width="40"
          height="40"
          aria-hidden="true"
        />
        <span class="min-w-0">
          <span class="block truncate font-display text-sm font-semibold text-lab-text sm:text-base">异步开发实验室</span>
          <span class="block truncate font-mono text-[11px] uppercase text-lab-muted">Async Lab</span>
        </span>
      </RouterLink>

      <!-- 桌面导航：md 及以上断点显示，当前路由高亮（背景 + aria-current）。 -->
      <div class="hidden items-center gap-2 md:flex">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 hover:bg-lab-surface hover:text-lab-text focus:outline-none focus-visible:ring-2 focus-visible:ring-lab-primary"
          :class="route.fullPath === item.to ? 'bg-lab-surface text-lab-text' : 'text-lab-muted'"
          :aria-current="route.fullPath === item.to ? 'page' : undefined"
        >
          {{ item.label }}
        </RouterLink>
      </div>

      <div class="flex items-center gap-2">
        <!-- 移动端汉堡菜单开关，展开状态存放在全局 store（appStore.menuOpen）中。 -->
        <button
          type="button"
          class="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-lab-border text-lab-text transition-colors duration-200 hover:border-lab-primary hover:text-lab-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-lab-primary md:hidden"
          :aria-expanded="appStore.menuOpen"
          aria-controls="mobile-navigation"
          :aria-label="appStore.menuOpen ? '关闭导航菜单' : '打开导航菜单'"
          @click="appStore.toggleMenu()"
        >
          <X v-if="appStore.menuOpen" class="h-5 w-5" aria-hidden="true" />
          <Menu v-else class="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </nav>

    <!-- 移动端下拉导航面板，复用全局 "page" 过渡效果实现展开/收起动画。 -->
    <Transition name="page">
      <div
        v-if="appStore.menuOpen"
        id="mobile-navigation"
        class="mx-auto mt-2 max-w-7xl rounded-lg border border-lab-border bg-white/95 p-3 shadow-[0_12px_36px_rgba(29,29,31,0.08)] backdrop-blur-xl md:hidden"
      >
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="block rounded-lg px-4 py-4 text-sm font-medium transition-colors duration-200 hover:bg-lab-surface hover:text-lab-text focus:outline-none focus-visible:ring-2 focus-visible:ring-lab-primary"
          :class="route.fullPath === item.to ? 'bg-lab-surface text-lab-text' : 'text-lab-muted'"
          :aria-current="route.fullPath === item.to ? 'page' : undefined"
        >
          {{ item.label }}
        </RouterLink>
      </div>
    </Transition>
  </header>
</template>

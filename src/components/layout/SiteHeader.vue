<script setup lang="ts">
import { Menu, X } from "@lucide/vue";
import { watch } from "vue";
import { useRoute } from "vue-router";

import ThemeToggle from "@/components/shared/ThemeToggle.vue";
import { useAppStore } from "@/stores/app";

const navItems = [
  { label: "首页", to: "/" },
  { label: "关于我们", to: "/about" },
  { label: "加入我们", to: "/join" },
];

const route = useRoute();
const appStore = useAppStore();

watch(
  () => route.fullPath,
  () => {
    appStore.setMenuOpen(false);
  },
);
</script>

<template>
  <header class="fixed left-4 right-4 top-4 z-50">
    <a
      href="#main-content"
      class="sr-only rounded-lg bg-lab-primary px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:absolute focus:left-0 focus:top-16"
    >
      跳到主内容
    </a>

    <nav
      class="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-lab-border bg-lab-bg/75 px-4 py-3 shadow-xl backdrop-blur-xl"
      aria-label="主导航"
    >
      <RouterLink to="/" class="flex min-w-0 items-center gap-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-lab-primary">
        <span
          class="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-lab-primary/40 bg-lab-primary/15 font-mono text-sm font-bold text-lab-primary shadow-glow"
          aria-hidden="true"
        >
          DL
        </span>
        <span class="min-w-0">
          <span class="block truncate font-display text-sm font-semibold text-lab-text sm:text-base">开发实验室</span>
          <span class="block truncate font-mono text-[11px] uppercase text-lab-muted">Development Lab</span>
        </span>
      </RouterLink>

      <div class="hidden items-center gap-2 md:flex">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="rounded-full px-4 py-2 text-sm font-medium text-lab-muted transition-colors duration-200 hover:bg-white/10 hover:text-lab-text focus:outline-none focus-visible:ring-2 focus-visible:ring-lab-primary"
          :class="{ 'bg-white/10 text-lab-text': route.path === item.to }"
        >
          {{ item.label }}
        </RouterLink>
      </div>

      <div class="flex items-center gap-2">
        <ThemeToggle />
        <button
          type="button"
          class="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-lab-border text-lab-text transition-colors duration-200 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-lab-primary md:hidden"
          :aria-expanded="appStore.menuOpen"
          aria-controls="mobile-navigation"
          aria-label="打开导航菜单"
          @click="appStore.toggleMenu()"
        >
          <X v-if="appStore.menuOpen" class="h-5 w-5" aria-hidden="true" />
          <Menu v-else class="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </nav>

    <Transition name="page">
      <div
        v-if="appStore.menuOpen"
        id="mobile-navigation"
        class="mx-auto mt-3 max-w-7xl rounded-2xl border border-lab-border bg-lab-bg/90 p-3 shadow-xl backdrop-blur-xl md:hidden"
      >
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="block rounded-xl px-4 py-3 text-sm font-medium text-lab-muted transition-colors duration-200 hover:bg-white/10 hover:text-lab-text focus:outline-none focus-visible:ring-2 focus-visible:ring-lab-primary"
          :class="{ 'bg-white/10 text-lab-text': route.path === item.to }"
        >
          {{ item.label }}
        </RouterLink>
      </div>
    </Transition>
  </header>
</template>

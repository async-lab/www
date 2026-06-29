<script setup lang="ts">
import { Menu, X } from "@lucide/vue";
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

import { useAppStore } from "@/stores/app";

const navItems = [
  { label: "首页", to: "/" },
  { label: "关于我们", to: "/about" },
  { label: "加入我们", to: "/join" },
];

const route = useRoute();
const appStore = useAppStore();
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

watch(
  () => route.fullPath,
  () => {
    appStore.setMenuOpen(false);
  },
);
</script>

<template>
  <header class="fixed left-0 right-0 top-0 z-50">
    <a
      href="#main-content"
      class="sr-only rounded-lg bg-lab-primary px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:absolute focus:left-0 focus:top-16"
    >
      跳到主内容
    </a>

    <nav
      class="mx-auto flex max-w-7xl items-center justify-between border-b px-4 transition-all duration-300 sm:px-6 lg:px-8"
      :class="
        isScrolled
          ? 'border-transparent bg-white/72 py-2 backdrop-blur-xl'
          : 'border-lab-border bg-white py-4'
      "
      aria-label="主导航"
    >
      <RouterLink to="/" class="flex min-w-0 items-center gap-4 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-lab-primary">
        <span
          class="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-lab-border bg-white font-mono text-sm font-bold text-lab-text"
          aria-hidden="true"
        >
          DL
        </span>
        <span class="min-w-0">
          <span class="block truncate font-display text-sm font-semibold text-lab-text sm:text-base">异步开发实验室</span>
          <span class="block truncate font-mono text-[11px] uppercase text-lab-muted">Development Lab</span>
        </span>
      </RouterLink>

      <div class="hidden items-center gap-2 md:flex">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="rounded-full px-4 py-2 text-sm font-medium text-lab-muted transition-colors duration-200 hover:text-lab-text focus:outline-none focus-visible:ring-2 focus-visible:ring-lab-primary"
          :class="{ 'text-lab-text': route.path === item.to }"
        >
          {{ item.label }}
        </RouterLink>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-lab-border text-lab-text transition-colors duration-200 hover:border-lab-primary hover:text-lab-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-lab-primary md:hidden"
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
        class="mx-auto max-w-7xl border-b border-lab-border bg-white p-4 md:hidden"
      >
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="block rounded-xl px-4 py-4 text-sm font-medium text-lab-muted transition-colors duration-200 hover:text-lab-text focus:outline-none focus-visible:ring-2 focus-visible:ring-lab-primary"
          :class="{ 'text-lab-text': route.path === item.to }"
        >
          {{ item.label }}
        </RouterLink>
      </div>
    </Transition>
  </header>
</template>

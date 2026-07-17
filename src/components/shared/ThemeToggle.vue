<script setup lang="ts">
// 主题切换按钮（浅色/深色）。当前站点主题固定为 light（见 stores/app.ts 的 getPreferredTheme），
// 此组件已实现完整交互逻辑，但尚未在任何页面/布局中引入，属于预留组件。
import { Moon, Sun } from "@lucide/vue";
import { computed } from "vue";

import { useAppStore } from "@/stores/app";

const appStore = useAppStore();
const isDark = computed(() => appStore.theme === "dark");
</script>

<template>
  <button
    type="button"
    class="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-lab-border text-lab-text transition-colors duration-200 hover:border-lab-primary hover:text-lab-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-lab-primary"
    :aria-label="isDark ? '切换到浅色模式' : '切换到深色模式'"
    @click="appStore.toggleTheme()"
  >
    <Sun v-if="isDark" class="h-5 w-5" aria-hidden="true" />
    <Moon v-else class="h-5 w-5" aria-hidden="true" />
  </button>
</template>

<script setup lang="ts">
// 通用卡片容器：统一圆角、边框、内边距样式；interactive=true 时鼠标悬停会高亮边框（用于可点击/可交互卡片）。
withDefaults(
  defineProps<{
    interactive?: boolean;
  }>(),
  {
    interactive: false,
  },
);
</script>

<template>
  <article
    class="rounded-2xl border border-lab-border bg-lab-elevated p-8 transition-colors duration-200"
    :class="{ 'hover:border-lab-primary/45': interactive }"
  >
    <slot />
  </article>
</template>

<script setup lang="ts">
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
    class="rounded-2xl border border-lab-border bg-lab-surface/80 p-6 shadow-xl backdrop-blur-xl transition-colors duration-200"
    :class="{ 'hover:border-lab-primary/50 hover:bg-lab-elevated': interactive }"
  >
    <slot />
  </article>
</template>

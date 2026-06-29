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
    class="rounded-2xl border border-lab-border bg-lab-elevated p-8 transition-colors duration-200"
    :class="{ 'hover:border-lab-primary/45': interactive }"
  >
    <slot />
  </article>
</template>

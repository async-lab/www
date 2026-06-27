<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow?: string;
    title: string;
    description?: string;
    align?: "left" | "center";
  }>(),
  {
    eyebrow: "",
    description: "",
    align: "left",
  },
);
</script>

<template>
  <div :class="align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'">
    <p v-if="eyebrow" class="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-lab-primary">
      {{ eyebrow }}
    </p>
    <h2 class="font-display text-3xl font-semibold leading-tight text-lab-text md:text-5xl">
      {{ title }}
    </h2>
    <p v-if="description" class="mt-5 text-base leading-8 text-lab-muted md:text-lg">
      {{ description }}
    </p>
  </div>
</template>

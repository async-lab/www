<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

import { gsap } from "@/lib/gsap";

const root = ref<HTMLElement | null>(null);
let ctx: ReturnType<typeof gsap.context> | undefined;

onMounted(() => {
  if (!root.value) return;

  ctx = gsap.context(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    gsap.from(root.value, {
      autoAlpha: 0,
      y: 32,
      duration: 0.75,
      scrollTrigger: {
        trigger: root.value,
        start: "top 86%",
        toggleActions: "play none none reverse",
      },
    });
  }, root.value);
});

onUnmounted(() => {
  ctx?.revert();
});
</script>

<template>
  <div ref="root">
    <slot />
  </div>
</template>

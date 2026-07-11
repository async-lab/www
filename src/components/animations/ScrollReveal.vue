<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

import { gsap } from "@/lib/gsap";

const root = ref<HTMLElement | null>(null);
let ctx: ReturnType<typeof gsap.context> | undefined;

onMounted(() => {
  if (!root.value) return;

  ctx = gsap.context(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      gsap.set(root.value, { autoAlpha: 1, y: 0, clearProps: "transform,opacity,visibility" });
      return;
    }

    gsap.set(root.value, { willChange: "transform,opacity" });
    gsap.fromTo(
      root.value,
      { autoAlpha: 0, y: 28 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.72,
        ease: "power3.out",
        clearProps: "willChange,transform,opacity,visibility",
        scrollTrigger: {
          trigger: root.value,
          start: "top 88%",
          once: true,
        },
      },
    );
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

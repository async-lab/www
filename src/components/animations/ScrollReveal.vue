<script setup lang="ts">
// 通用滚动进场动画容器：把 <slot /> 内容包一层 div，滚动到视口内时做“淡入 + 上移”动画。
// 全站大量 section 都用它包裹内容块，是最基础的复用动画组件。
import { onMounted, onUnmounted, ref } from "vue";

import { gsap } from "@/lib/gsap";

const root = ref<HTMLElement | null>(null);
let ctx: ReturnType<typeof gsap.context> | undefined;

onMounted(() => {
  if (!root.value) return;

  // gsap.context 把内部创建的所有动画/ScrollTrigger 绑定到 root.value 作用域，
  // 卸载时调用 ctx.revert() 即可一次性清理，避免手动逐个 kill。
  ctx = gsap.context(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      // 减少动态效果：直接展示为最终状态，不做位移/透明度动画。
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
        // 动画结束后清除内联样式，避免残留的 transform/opacity 影响后续布局或截图。
        clearProps: "willChange,transform,opacity,visibility",
        scrollTrigger: {
          trigger: root.value,
          // 元素顶部进入视口 88% 位置时触发。
          start: "top 88%",
          // 只播放一次，滚动出视口再滚回来不会重复触发。
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

<script setup lang="ts">
import logoMarkup from "@/assets/logo.svg?raw";

defineProps<{
  play?: boolean;
}>();
</script>

<template>
  <!-- SVG 内联自 public/logo/白色背景_透明.svg，替代已缺失的 motion/outputs_white/logo.svg 产物。 -->
  <div class="animated-logo" :class="{ 'animated-logo--play': play }" v-html="logoMarkup" />
</template>

<style>
.animated-logo,
.animated-logo svg {
  display: block;
  height: 100%;
  width: 100%;
}

.animated-logo svg {
  overflow: visible;
}

.animated-logo--play {
  --logo-motion-duration: 1500ms;
  --logo-motion-ease-enter: cubic-bezier(0.16, 1, 0.3, 1);
  --logo-motion-ease-natural: cubic-bezier(0.34, 0, 0.14, 1);
  --logo-motion-ease-settle: cubic-bezier(0.34, 1.56, 0.64, 1);
}

.animated-logo--play #mark,
.animated-logo--play #mark-left,
.animated-logo--play #mark-right,
.animated-logo--play #mark-accent,
.animated-logo--play #wordmark,
.animated-logo--play #letter-1,
.animated-logo--play #letter-2,
.animated-logo--play #letter-3,
.animated-logo--play #letter-4,
.animated-logo--play #letter-5 {
  transform-box: fill-box;
  transform-origin: center;
  will-change: transform, opacity;
}

.animated-logo--play #mark {
  animation: logo-mark var(--logo-motion-duration) var(--logo-motion-ease-natural) both;
}

.animated-logo--play #mark-left {
  animation: logo-mark-left var(--logo-motion-duration) var(--logo-motion-ease-enter) both;
}

.animated-logo--play #mark-right {
  animation: logo-mark-right var(--logo-motion-duration) var(--logo-motion-ease-enter) both;
}

.animated-logo--play #mark-accent {
  animation: logo-mark-accent var(--logo-motion-duration) var(--logo-motion-ease-settle) both;
}

.animated-logo--play #letter-1 {
  animation: logo-letter-1 var(--logo-motion-duration) var(--logo-motion-ease-enter) both;
}

.animated-logo--play #letter-2 {
  animation: logo-letter-2 var(--logo-motion-duration) var(--logo-motion-ease-enter) both;
}

.animated-logo--play #letter-3 {
  animation: logo-letter-3 var(--logo-motion-duration) var(--logo-motion-ease-enter) both;
}

.animated-logo--play #letter-4 {
  animation: logo-letter-4 var(--logo-motion-duration) var(--logo-motion-ease-enter) both;
}

.animated-logo--play #letter-5 {
  animation: logo-letter-5 var(--logo-motion-duration) var(--logo-motion-ease-enter) both;
}

@keyframes logo-mark {
  0% {
    opacity: 0;
    transform: translateY(16px) scale(0.94);
    animation-timing-function: var(--logo-motion-ease-natural);
  }
  20% {
    opacity: 0.12;
    transform: translateY(12px) scale(0.95);
    animation-timing-function: var(--logo-motion-ease-enter);
  }
  58% {
    opacity: 1;
    transform: translateY(-4px) scale(1.025);
    animation-timing-function: var(--logo-motion-ease-settle);
  }
  80% {
    opacity: 1;
    transform: translateY(1px) scale(0.998);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes logo-mark-left {
  0% {
    opacity: 0;
    transform: translateX(-12px) rotate(-3deg);
  }
  20% {
    opacity: 0;
    transform: translateX(-10px) rotate(-3deg);
  }
  58% {
    opacity: 1;
    transform: translateX(2px) rotate(0.5deg);
  }
  80% {
    opacity: 1;
    transform: translateX(-1px) rotate(-0.1deg);
  }
  100% {
    opacity: 1;
    transform: none;
  }
}

@keyframes logo-mark-right {
  0% {
    opacity: 0;
    transform: translateX(14px) rotate(3deg);
  }
  20% {
    opacity: 0;
    transform: translateX(12px) rotate(3deg);
  }
  58% {
    opacity: 1;
    transform: translateX(-2px) rotate(-0.5deg);
  }
  80% {
    opacity: 1;
    transform: translateX(1px) rotate(0.1deg);
  }
  100% {
    opacity: 1;
    transform: none;
  }
}

@keyframes logo-mark-accent {
  0%,
  42% {
    opacity: 0;
    transform: scale(0.78) translateY(8px);
  }
  68% {
    opacity: 1;
    transform: scale(1.07) translateY(-2px);
  }
  84% {
    opacity: 1;
    transform: scale(0.985) translateY(1px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes logo-letter-1 {
  0%,
  24% {
    opacity: 0;
    transform: translateY(18px) scaleY(0.94);
  }
  56% {
    opacity: 1;
    transform: translateY(-3px) scaleY(1.015);
  }
  78% {
    opacity: 1;
    transform: translateY(1px) scaleY(0.998);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scaleY(1);
  }
}

@keyframes logo-letter-2 {
  0%,
  28% {
    opacity: 0;
    transform: translateY(18px) scaleY(0.94);
  }
  60% {
    opacity: 1;
    transform: translateY(-3px) scaleY(1.015);
  }
  82% {
    opacity: 1;
    transform: translateY(1px) scaleY(0.998);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scaleY(1);
  }
}

@keyframes logo-letter-3 {
  0%,
  32% {
    opacity: 0;
    transform: translateY(18px) scaleY(0.94);
  }
  64% {
    opacity: 1;
    transform: translateY(-3px) scaleY(1.015);
  }
  86% {
    opacity: 1;
    transform: translateY(1px) scaleY(0.998);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scaleY(1);
  }
}

@keyframes logo-letter-4 {
  0%,
  36% {
    opacity: 0;
    transform: translateY(18px) scaleY(0.94);
  }
  68% {
    opacity: 1;
    transform: translateY(-3px) scaleY(1.015);
  }
  90% {
    opacity: 1;
    transform: translateY(1px) scaleY(0.998);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scaleY(1);
  }
}

@keyframes logo-letter-5 {
  0%,
  40% {
    opacity: 0;
    transform: translateY(18px) scaleY(0.94);
  }
  72% {
    opacity: 1;
    transform: translateY(-3px) scaleY(1.015);
  }
  94% {
    opacity: 1;
    transform: translateY(1px) scaleY(0.998);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scaleY(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .animated-logo--play #mark,
  .animated-logo--play #mark-left,
  .animated-logo--play #mark-right,
  .animated-logo--play #mark-accent,
  .animated-logo--play #letter-1,
  .animated-logo--play #letter-2,
  .animated-logo--play #letter-3,
  .animated-logo--play #letter-4,
  .animated-logo--play #letter-5 {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
</style>

<script setup lang="ts">
import { ref } from "vue";

const logoSrc = "/logo/白色背景_透明.svg";
const arcKey = ref(0);
const pressing = ref(false);

function replayArc() {
  arcKey.value += 1;
}

function startPress() {
  pressing.value = true;
}

function endPress() {
  pressing.value = false;
}
</script>

<template>
  <div class="grid grid-cols-2 gap-3" aria-label="Logo motion examples">
    <div class="logo-motion-example logo-motion-example--hover">
      <img :src="logoSrc" alt="" />
      <span>Hover</span>
    </div>

    <div class="logo-motion-example">
      <img class="logo-motion-example__pulse" :src="logoSrc" alt="" />
      <span>Pulse</span>
    </div>

    <button
      type="button"
      class="logo-motion-example cursor-pointer"
      aria-label="Play arc logo motion"
      @pointerenter="replayArc"
      @focus="replayArc"
    >
      <img :key="arcKey" class="logo-motion-example__arc" :src="logoSrc" alt="" />
      <span>Arc</span>
    </button>

    <button
      type="button"
      class="logo-motion-example cursor-pointer"
      :class="{ 'logo-motion-example--pressing': pressing }"
      aria-label="Play press logo motion"
      @pointerdown="startPress"
      @pointerup="endPress"
      @pointercancel="endPress"
      @pointerleave="endPress"
      @keydown.enter.prevent="startPress"
      @keydown.space.prevent="startPress"
      @keyup.enter="endPress"
      @keyup.space="endPress"
    >
      <img :src="logoSrc" alt="" />
      <span>Press</span>
    </button>
  </div>
</template>

<style scoped>
.logo-motion-example {
  display: grid;
  min-height: 7.25rem;
  place-items: center;
  gap: 0.25rem;
  border: 1px solid var(--tw-border-opacity, 1) rgb(228 228 231 / var(--tw-border-opacity, 1));
  background: rgb(255 255 255 / 0.9);
  color: #5d6d80;
  font-family: var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
  font-size: 0.6875rem;
  letter-spacing: 0.08em;
  transition: border-color 200ms ease, box-shadow 200ms ease;
}

.logo-motion-example img {
  display: block;
  width: 4rem;
  transition: transform 200ms ease;
}

.logo-motion-example--hover:hover img {
  transform: scale(1.08) rotate(-1.5deg);
}

.logo-motion-example:focus-visible {
  outline: 2px solid #2a84ff;
  outline-offset: 3px;
}

.logo-motion-example:hover,
.logo-motion-example:focus-visible {
  border-color: #2a84ff;
  box-shadow: 0 10px 24px rgb(31 65 105 / 0.1);
}

.logo-motion-example__pulse {
  animation: logo-example-pulse 1.8s ease-in-out infinite;
}

.logo-motion-example__arc {
  animation: logo-example-arc 560ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.logo-motion-example--pressing img {
  transform: scaleX(1.1) scaleY(0.88);
}

@keyframes logo-example-pulse {
  50% {
    transform: scale(1.1);
  }
}

@keyframes logo-example-arc {
  0% {
    transform: rotate(28deg);
  }
  55% {
    transform: rotate(-4deg);
  }
  100% {
    transform: rotate(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .logo-motion-example,
  .logo-motion-example img {
    transition: none;
  }

  .logo-motion-example__pulse,
  .logo-motion-example__arc {
    animation: none;
  }
}
</style>

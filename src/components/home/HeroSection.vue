<script setup lang="ts">
import { ArrowRight } from "@lucide/vue";
import { onMounted, onUnmounted, ref } from "vue";

import BaseButton from "@/components/ui/BaseButton.vue";
import { gsap } from "@/lib/gsap";

const hero = ref<HTMLElement | null>(null);
const title = "异步开发实验室";
const typedTitle = ref("");

let titleTimer: number | undefined;
let ctx: ReturnType<typeof gsap.context> | undefined;

function startTypewriter() {
  let index = 0;
  typedTitle.value = "";

  titleTimer = window.setInterval(() => {
    typedTitle.value = title.slice(0, index + 1);
    index += 1;

    if (index >= title.length && titleTimer) {
      window.clearInterval(titleTimer);
      titleTimer = undefined;
    }
  }, 250);
}

onMounted(() => {
  startTypewriter();

  if (!hero.value) return;

  ctx = gsap.context(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      gsap.set([".hero-ribbon", ".hero-copy", ".hero-kicker"], { autoAlpha: 1 });
      return;
    }

    const timeline = gsap.timeline();
    timeline
      .fromTo(
        ".hero-ribbon",
        {
          xPercent: -112,
          autoAlpha: 0,
        },
        {
          xPercent: 0,
          autoAlpha: 1,
          duration: 1.25,
          ease: "power3.out",
        },
      )
      .from(
        ".hero-copy",
        {
        autoAlpha: 0,
          y: 32,
          duration: 0.8,
        },
        "-=0.48",
      )
      .from(
        ".hero-kicker",
        {
          autoAlpha: 0,
          y: 16,
          duration: 0.56,
        },
        "-=0.55",
      );
  }, hero.value);
});

onUnmounted(() => {
  if (titleTimer) window.clearInterval(titleTimer);
  ctx?.revert();
});
</script>

<template>
  <section
    ref="hero"
    class="relative min-h-[100svh] overflow-hidden bg-white pt-28"
    aria-labelledby="hero-title"
  >
    <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#ffffff_58%,#f5f5f7_100%)]" />

    <div class="hero-ribbon pointer-events-none absolute inset-0" aria-hidden="true">
      <div
        class="absolute bottom-0 right-0 h-[33svh] w-screen bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.96)_22%,rgba(0,102,255,0.10)_58%,rgba(0,102,255,0.22)_100%)]"
      />
      <div
        class="absolute bottom-0 right-0 h-[100svh] w-[20vw] bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(0,102,255,0.08)_55%,rgba(0,102,255,0.16)_100%)]"
      />
    </div>

    <div
      class="lab-container relative z-10 flex min-h-[calc(100svh-7rem)] items-center"
    >
      <div class="hero-copy max-w-4xl pb-32 pt-16">
        <div
          class="hero-kicker mb-8 inline-flex items-center rounded-full border border-lab-border bg-white px-4 py-2"
        >
          <span class="font-mono text-xs uppercase text-lab-muted"
            >Development Lab · Code the Future</span
          >
        </div>

        <h1
          id="hero-title"
          class="font-display text-5xl font-semibold leading-tight text-lab-text md:text-7xl lg:text-8xl"
        >
          {{ typedTitle }}
          <span
            class="inline-block h-[0.9em] w-1 translate-y-2 bg-lab-primary align-middle animate-caret"
            aria-hidden="true"
          />
        </h1>

        <p
          class="mt-8 max-w-2xl text-base leading-8 text-lab-muted md:text-xl md:leading-9"
        >
          连接前端、后端、移动端与嵌入式技术，用工程能力把想法推进到真实可用的产品和系统。
        </p>

        <div class="mt-12 flex flex-col gap-4 sm:flex-row">
          <BaseButton as="RouterLink" to="/about" size="lg">
            了解实验室
            <ArrowRight class="h-4 w-4" aria-hidden="true" />
          </BaseButton>
          <BaseButton as="RouterLink" to="/join" variant="secondary" size="lg">
            加入我们
          </BaseButton>
        </div>
      </div>
    </div>
  </section>
</template>

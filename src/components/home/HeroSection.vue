<script setup lang="ts">
import { ArrowRight, Sparkles } from "@lucide/vue";
import { computed, onMounted, onUnmounted, ref } from "vue";

import BaseButton from "@/components/ui/BaseButton.vue";
import { gsap } from "@/lib/gsap";

const hero = ref<HTMLElement | null>(null);
const title = "全栈开发实验室";
const typedTitle = ref("");
const words = ["Advance", "Synergy", "Yield", "Nexus", "Create"];
const codeCells = ref(Array.from({ length: 84 }, (_, index) => words[index % words.length]));

let titleTimer: number | undefined;
let wordTimer: number | undefined;
let ctx: ReturnType<typeof gsap.context> | undefined;

const backgroundWords = computed(() => codeCells.value);

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
  }, 135);
}

function startWordShuffle() {
  wordTimer = window.setInterval(() => {
    const next = [...codeCells.value];
    const index = Math.floor(Math.random() * next.length);
    next[index] = words[Math.floor(Math.random() * words.length)];
    codeCells.value = next;
  }, 220);
}

onMounted(() => {
  startTypewriter();
  startWordShuffle();

  if (!hero.value) return;

  ctx = gsap.context(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      gsap.set([".hero-stripe", ".hero-copy", ".hero-logo"], { autoAlpha: 1 });
      return;
    }

    const timeline = gsap.timeline();
    timeline
      .from(".hero-stripe", {
        xPercent: 120,
        autoAlpha: 0,
        duration: 1.1,
        ease: "power3.out",
      })
      .from(
        ".hero-copy",
        {
          autoAlpha: 0,
          y: 34,
          duration: 0.8,
        },
        "-=0.55",
      )
      .from(
        ".hero-logo",
        {
          autoAlpha: 0,
          y: 16,
          scale: 0.96,
          duration: 0.7,
        },
        "-=0.35",
      );

    gsap.to(".hero-code-token", {
      y: -18,
      autoAlpha: 0.55,
      duration: 2.6,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      stagger: {
        each: 0.035,
        from: "random",
      },
    });
  }, hero.value);
});

onUnmounted(() => {
  if (titleTimer) window.clearInterval(titleTimer);
  if (wordTimer) window.clearInterval(wordTimer);
  ctx?.revert();
});
</script>

<template>
  <section
    ref="hero"
    class="relative min-h-[100svh] overflow-hidden pt-28 scanline-overlay"
    aria-labelledby="hero-title"
  >
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,102,255,0.28),transparent_34%),radial-gradient(circle_at_78%_18%,rgba(0,212,255,0.12),transparent_24%),linear-gradient(135deg,rgba(10,10,10,1),rgba(10,10,10,0.72))]" />

    <div class="code-matrix absolute inset-0 grid grid-cols-3 gap-4 p-8 opacity-35 sm:grid-cols-5 lg:grid-cols-7">
      <span
        v-for="(word, index) in backgroundWords"
        :key="`${word}-${index}`"
        class="hero-code-token select-none font-mono text-xs uppercase text-lab-primary/70"
      >
        {{ word }}
      </span>
    </div>

    <div
      class="hero-stripe pointer-events-none absolute right-0 top-0 hidden h-full w-[38%] bg-[linear-gradient(105deg,transparent_0%,rgba(255,255,255,0.06)_18%,rgba(0,102,255,0.58)_38%,rgba(0,212,255,0.22)_58%,rgba(255,255,255,0.18)_78%,transparent_100%)] md:block"
      aria-hidden="true"
    />

    <div class="lab-container relative z-10 flex min-h-[calc(100svh-7rem)] items-center">
      <div class="hero-copy max-w-4xl pb-20">
        <div class="hero-logo mb-8 inline-flex items-center gap-3 rounded-full border border-lab-border bg-white/[0.06] px-4 py-2 backdrop-blur-xl">
          <Sparkles class="h-4 w-4 text-lab-primary" aria-hidden="true" />
          <span class="font-mono text-xs uppercase text-lab-muted">Development Lab · Code the Future</span>
        </div>

        <h1
          id="hero-title"
          class="font-display text-5xl font-semibold leading-tight text-white md:text-7xl lg:text-8xl"
        >
          {{ typedTitle }}
          <span class="inline-block h-[0.9em] w-1 translate-y-2 bg-lab-primary align-middle animate-caret" aria-hidden="true" />
        </h1>

        <p class="mt-7 max-w-2xl text-base leading-8 text-slate-300 md:text-xl md:leading-9">
          连接前端、后端、移动端与嵌入式技术，用工程能力把想法推进到真实可用的产品和系统。
        </p>

        <div class="mt-10 flex flex-col gap-3 sm:flex-row">
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

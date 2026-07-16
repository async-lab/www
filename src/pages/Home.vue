<script setup lang="ts">
import { ArrowRight, GitBranch, Layers3, ShieldCheck } from "@lucide/vue";
import { onMounted, onUnmounted, ref } from "vue";

import ScrollReveal from "@/components/animations/ScrollReveal.vue";
import HeroSection from "@/components/home/HeroSection.vue";
import ResearchDirections from "@/components/home/ResearchDirections.vue";
import SectionTitle from "@/components/shared/SectionTitle.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import { gsap } from "@/lib/gsap";

const page = ref<HTMLElement | null>(null);
const timelineTrack = ref<HTMLElement | null>(null);
const timelineProgress = ref<HTMLElement | null>(null);
let media: ReturnType<typeof gsap.matchMedia> | undefined;

const overview = [
  {
    value: "2013",
    label: "团队成立",
    description: "前身为 IOTU 实验室，从嵌入式开发起步。",
  },
  {
    value: "多方向",
    label: "开发团队",
    description: "覆盖 Web 前端、Java / Go 后端、C++、移动端等方向。",
  },
  {
    value: "B413",
    label: "学习空间",
    description: "在双中心拥有独立场地，一起学习、做项目与交流技术。",
  },
];

const labFacts = [
  {
    label: "正式名称",
    value: "异步开发实验室（Async Lab）",
  },
  {
    label: "所属学校",
    value: "成都信息工程大学",
  },
  {
    label: "团队前身",
    value: "IOTU 实验室",
  },
  {
    label: "共同方式",
    value: "学习 · 项目 · 技术交流",
  },
];

const values = [
  {
    title: "热爱创造",
    description: "面向全校各专业对开发感兴趣的同学，让主动学习与动手创造成为共同起点。",
    icon: Layers3,
  },
  {
    title: "异步成长",
    description: "允许不同的发展方向、学习目标和学习方式，在同一个实验室框架下交替前行。",
    icon: GitBranch,
  },
  {
    title: "同行互助",
    description: "在共同学习、项目协作和技术交流中彼此推动，也把经验留给后来加入的成员。",
    icon: ShieldCheck,
  },
];

const milestones = [
  {
    year: "2013",
    title: "IOTU 实验室成立",
    description: "团队从嵌入式开发起步，为热爱学习与创造的同学提供开发实践空间。",
  },
  {
    year: "Growth",
    title: "多方向团队成形",
    description: "随着实验室发展，逐步拓展到 Web 前端、Java / Go 后端、C++ 开发与移动端等方向。",
  },
  {
    year: "Async",
    title: "异步理念形成",
    description: "成员拥有不同方向、目标与学习方式，在共同框架下互相追赶、交替前行。",
  },
  {
    year: "Together",
    title: "学习、项目与交流",
    description: "在双中心 B413 一起学习、做项目、交流技术，让个人积累持续汇入团队成长。",
  },
];

onMounted(() => {
  if (!page.value) return;

  media = gsap.matchMedia();
  media.add(
    {
      desktop: "(min-width: 768px)",
      reduceMotion: "(prefers-reduced-motion: reduce)",
    },
    (context) => {
      const { desktop, reduceMotion } = context.conditions as {
        desktop: boolean;
        reduceMotion: boolean;
      };
      const track = timelineTrack.value;
      const progress = timelineProgress.value;
      if (!track || !progress) return;

      if (!desktop || reduceMotion) {
        gsap.set(track, { clearProps: "transform" });
        gsap.set(progress, { scaleX: 1, transformOrigin: "left center" });
        return;
      }

      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 64);
      gsap.set(progress, { scaleX: 0, transformOrigin: "left center" });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".history-scroll",
          start: "top top",
          end: () => `+=${Math.max(1200, distance() + 520)}`,
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(track, { x: () => -distance(), duration: 1, ease: "none" }, 0)
        .to(progress, { scaleX: 1, duration: 1, ease: "none" }, 0);
    },
    page.value,
  );
});

onUnmounted(() => {
  media?.revert();
});
</script>

<template>
  <div ref="page">
    <HeroSection />

    <section id="about" class="scroll-mt-28 border-b border-lab-border bg-white py-24 md:py-28">
      <div class="lab-container">
        <div class="grid gap-12 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,1.45fr)] lg:gap-20">
          <div class="pt-1">
            <p class="font-mono text-xs uppercase text-lab-primary">01 / About</p>
            <div class="mt-5 h-px w-full max-w-48 bg-lab-border" aria-hidden="true" />
          </div>

          <ScrollReveal>
            <div>
              <SectionTitle
                title="从嵌入式起步，成长为面向多方向的开发团队"
                description="异步开发实验室（Async Lab）成立于 2013 年，前身为 IOTU 实验室。团队汇聚全校各专业热爱创造、热爱学习、热爱生活的同学，在 Web 前端、后端、C++ 与嵌入式、移动端等方向持续探索。"
              />

              <dl class="mt-12 grid border-t border-lab-border sm:grid-cols-2 sm:gap-x-10">
                <div v-for="fact in labFacts" :key="fact.label" class="border-b border-lab-border py-5 sm:py-6">
                  <dt class="font-mono text-xs uppercase tracking-[0.16em] text-lab-muted">{{ fact.label }}</dt>
                  <dd class="mt-3 text-sm font-semibold leading-7 text-lab-text md:text-base">{{ fact.value }}</dd>
                </div>
              </dl>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <div class="mt-16 grid gap-8 border-l-2 border-lab-primary bg-lab-surface px-6 py-8 md:grid-cols-[0.35fr_1.65fr] md:px-10 md:py-10">
            <p class="font-mono text-xs uppercase tracking-[0.2em] text-lab-primary">Why Async</p>
            <div>
              <h3 class="max-w-3xl font-display text-2xl font-semibold leading-tight text-lab-text md:text-3xl">
                不同方向、不同目标、不同方式，
                <span class="block">在同一个框架下交替前行</span>
              </h3>
              <p class="mt-5 max-w-3xl text-sm leading-8 text-lab-muted md:text-base">
                “Async”来自计算机中的异步处理：不必阻塞当前线程等待，而是让后续操作继续推进。实验室借用这一概念，希望每位成员都能沿自己的方向成长，又在共同学习、项目协作与技术交流中彼此推动。
              </p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div class="mt-20 grid border-y border-lab-border md:grid-cols-3 md:divide-x md:divide-lab-border">
            <article
              v-for="item in overview"
              :key="item.label"
              class="border-b border-lab-border py-8 last:border-b-0 md:border-b-0 md:px-8 md:first:pl-0 md:last:pr-0"
            >
              <p class="font-display text-4xl font-semibold text-lab-text md:text-5xl">{{ item.value }}</p>
              <h3 class="mt-4 text-sm font-semibold text-lab-text">{{ item.label }}</h3>
              <p class="mt-3 max-w-xs text-sm leading-7 text-lab-muted">{{ item.description }}</p>
            </article>
          </div>
        </ScrollReveal>
      </div>
    </section>

    <ResearchDirections />

    <section
      id="history"
      class="history-scroll relative scroll-mt-28 overflow-hidden bg-lab-text py-24 text-white md:min-h-screen md:py-28"
      aria-labelledby="history-title"
    >
      <div class="lab-container">
        <div class="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p class="font-mono text-xs uppercase text-[#7cb5ff]">02 / Timeline</p>
            <h2 id="history-title" class="mt-4 font-display text-3xl font-semibold leading-tight md:text-5xl">
              从 IOTU 到 Async Lab
            </h2>
          </div>
          <p class="max-w-md text-sm leading-7 text-white/60 md:text-right">
            名称与方向不断发展，始终不变的是对创造、学习和共同成长的热爱。
          </p>
        </div>

        <div class="mt-12 hidden h-px overflow-hidden bg-white/15 md:block" aria-hidden="true">
          <div ref="timelineProgress" class="h-full w-full origin-left bg-lab-primary" />
        </div>
      </div>

      <div
        ref="timelineTrack"
        class="mt-14 flex flex-col gap-5 px-4 sm:px-6 md:w-max md:flex-row md:gap-6 md:px-[max(1rem,calc((100vw-80rem)/2+1.5rem))]"
      >
        <article
          v-for="(milestone, index) in milestones"
          :key="milestone.title"
          class="group relative min-h-[286px] w-full shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] p-8 transition-[transform,border-color,background-color] duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.07] md:w-[390px] lg:w-[420px]"
        >
          <div class="flex items-center justify-between gap-6">
            <p class="font-mono text-sm text-[#7cb5ff]">{{ milestone.year }}</p>
            <span class="font-mono text-xs text-white/35">0{{ index + 1 }} / 04</span>
          </div>
          <h3 class="mt-10 text-2xl font-semibold text-white">{{ milestone.title }}</h3>
          <p class="mt-5 max-w-sm text-sm leading-8 text-white/60">{{ milestone.description }}</p>
          <div
            class="absolute inset-x-8 bottom-8 h-px origin-left scale-x-25 bg-lab-primary transition-transform duration-300 group-hover:scale-x-100"
            aria-hidden="true"
          />
        </article>
      </div>
    </section>

    <section id="culture" class="scroll-mt-28 bg-white py-24 md:py-32" aria-labelledby="culture-title">
      <div class="lab-container">
        <ScrollReveal>
          <div id="culture-title">
            <SectionTitle
              eyebrow="03 / Lab Culture"
              title="代码即艺术，技术驱动创新"
              description="我们相信热爱创造、热爱学习、热爱生活的人可以彼此影响。不同方向不必保持同一步调，但会在分享、项目与长期陪伴中共同向前。"
            />
          </div>
        </ScrollReveal>

        <div class="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          <ScrollReveal v-for="(value, index) in values" :key="value.title">
            <article class="group h-full border-t border-lab-border pt-8">
              <div class="flex items-center justify-between gap-6">
                <div
                  class="grid h-12 w-12 place-items-center rounded-lg border border-lab-border bg-lab-surface text-lab-primary transition-transform duration-300 group-hover:-translate-y-1"
                >
                  <component :is="value.icon" class="h-6 w-6" aria-hidden="true" />
                </div>
                <span class="font-mono text-xs text-lab-muted">0{{ index + 1 }}</span>
              </div>
              <h3 class="mt-10 text-xl font-semibold text-lab-text">{{ value.title }}</h3>
              <p class="mt-4 text-sm leading-8 text-lab-muted">{{ value.description }}</p>
            </article>
          </ScrollReveal>
        </div>
      </div>
    </section>

    <section class="relative overflow-hidden border-y border-[#0052cc] bg-lab-primary py-20 text-white md:py-24">
      <div class="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/30" aria-hidden="true" />
      <div class="lab-container grid gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <ScrollReveal>
          <p class="font-mono text-xs uppercase text-white/70">Join the Track</p>
          <h2 class="mt-4 max-w-4xl font-display text-3xl font-semibold leading-tight md:text-5xl">
            用 8 周学习路径，走进真实项目
          </h2>
          <p class="mt-6 max-w-2xl text-base leading-8 text-white/75">
            从一条适合自己的技术方向开始，在持续学习、协作开发和项目复盘中，把兴趣变成真正可以交付的能力。
          </p>
        </ScrollReveal>

        <BaseButton as="RouterLink" to="/join" variant="secondary" size="lg" class="justify-self-start lg:justify-self-end">
          查看加入方式
          <ArrowRight class="h-4 w-4" aria-hidden="true" />
        </BaseButton>
      </div>
    </section>
  </div>
</template>

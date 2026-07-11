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
    value: "04",
    label: "研究方向",
    description: "覆盖前端、后端、移动端与嵌入式开发。",
  },
  {
    value: "08 周",
    label: "学习路径",
    description: "从基础训练进入项目协作与技术交流。",
  },
  {
    value: "01 套",
    label: "工程闭环",
    description: "贯穿需求、设计、开发、联调、部署与复盘。",
  },
];

const values = [
  {
    title: "工程实践优先",
    description: "从需求拆解到部署复盘，让每一次学习都沉淀为可维护、能交付的成果。",
    icon: GitBranch,
  },
  {
    title: "跨端能力融合",
    description: "让前端、后端、移动端与嵌入式在同一个项目里理解彼此、共同完成目标。",
    icon: Layers3,
  },
  {
    title: "质量贯穿始终",
    description: "把代码规范、性能、可访问性与协作习惯放进日常开发，而不是留到最后补救。",
    icon: ShieldCheck,
  },
];

const milestones = [
  {
    year: "阶段 01",
    title: "IOTU 创立",
    description: "实验室前身成立，以软件开发为起点，开始聚集对技术实践感兴趣的同学。",
  },
  {
    year: "阶段 02",
    title: "技术方向拓展",
    description: "逐步形成前端、后端、移动端与嵌入式方向，建立跨端协作的基础。",
  },
  {
    year: "阶段 03",
    title: "培养路径建设",
    description: "新生依据兴趣选择方向，从基础知识、工程工具和代码规范开始自主学习。",
  },
  {
    year: "阶段 04",
    title: "工程实践沉淀",
    description: "从技术学习走向协作开发，以真实需求、联调和复盘检验解决问题的能力。",
  },
  {
    year: "阶段 05",
    title: "更名 · 理念升级",
    description: "2021 年 Asynchronous Lab 正式启用，形成开放协作、异步成长的共同理念。",
  },
  {
    year: "阶段 06",
    title: "持续发展 · 传承",
    description: "保持开放的学习与项目平台，让每一届同学都能找到愿意长期投入的方向。",
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
            <SectionTitle
              title="在不同技术栈之间，建立同一套解决问题的能力"
              description="我们围绕真实项目组织学习：先理解需求，再选择合适的技术，把设计、编码、联调和交付连成完整过程。方向可以不同，工程判断与协作方式始终相通。"
            />
          </ScrollReveal>
        </div>

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
              实验室发展路径
            </h2>
          </div>
          <p class="max-w-md text-sm leading-7 text-white/60 md:text-right">
            从兴趣聚集到跨端协作，实验室在持续实践中形成自己的培养方式与技术文化。
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
            <span class="font-mono text-xs text-white/35">0{{ index + 1 }} / 06</span>
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
              description="我们更看重解决真实问题的过程：清楚地思考，坦诚地协作，把质量做进每一次提交，也把经验留给后来的人。"
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

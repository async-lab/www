<script setup lang="ts">
// 首页：由 Hero 首屏 + 关于我们(About) + 研究方向(ResearchDirections 子组件) +
// 发展历程(History，横向滚动时间线) + 实验室文化(Culture) + 加入我们引导条 组成。
// 页面内所有静态展示数据（overview/labFacts/values/milestones）都直接写在这里，
// 因为它们只在首页使用一次，不需要抽到 src/data 目录。
import { ArrowRight, GitBranch, Layers3, ShieldCheck } from "@lucide/vue";
import { onMounted, onUnmounted, ref } from "vue";

import ScrollReveal from "@/components/animations/ScrollReveal.vue";
import HeroSection from "@/components/home/HeroSection.vue";
import ResearchDirections from "@/components/home/ResearchDirections.vue";
import SectionTitle from "@/components/shared/SectionTitle.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import { gsap } from "@/lib/gsap";

const page = ref<HTMLElement | null>(null);
/** 发展历程区块中横向排列的卡片容器，会被 GSAP 水平位移实现横向滚动效果。 */
const timelineTrack = ref<HTMLElement | null>(null);
/** 发展历程区块顶部的进度条，随横向滚动进度从左到右填充。 */
const timelineProgress = ref<HTMLElement | null>(null);
let media: ReturnType<typeof gsap.matchMedia> | undefined;

/**
 * 为桌面端文化卡片提供轻微的指针纵深反馈。
 * quickTo 会复用 tween，避免 pointermove 时持续创建新动画；边界只在指针进入时读取一次。
 */
function setupTiltCards(cards: HTMLElement[]) {
  const cleanups = cards.map((card) => {
    let bounds: DOMRect | undefined;
    const rotateXTo = gsap.quickTo(card, "rotationX", { duration: 0.55, ease: "power3.out" });
    const rotateYTo = gsap.quickTo(card, "rotationY", { duration: 0.55, ease: "power3.out" });
    const yTo = gsap.quickTo(card, "y", { duration: 0.45, ease: "power3.out" });

    const handlePointerEnter = () => {
      bounds = card.getBoundingClientRect();
      yTo(-8);
    };
    const handlePointerMove = (event: PointerEvent) => {
      if (!bounds) return;

      const xProgress = (event.clientX - bounds.left) / bounds.width - 0.5;
      const yProgress = (event.clientY - bounds.top) / bounds.height - 0.5;
      rotateXTo(yProgress * -7);
      rotateYTo(xProgress * 9);
    };
    const handlePointerLeave = () => {
      bounds = undefined;
      rotateXTo(0);
      rotateYTo(0);
      yTo(0);
    };

    card.addEventListener("pointerenter", handlePointerEnter);
    card.addEventListener("pointermove", handlePointerMove);
    card.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      card.removeEventListener("pointerenter", handlePointerEnter);
      card.removeEventListener("pointermove", handlePointerMove);
      card.removeEventListener("pointerleave", handlePointerLeave);
      gsap.killTweensOf(card);
    };
  });

  return () => cleanups.forEach((cleanup) => cleanup());
}

// “关于我们”区块下方的三项统计数据。
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

// “关于我们”区块的实验室基本信息表格。
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

// “实验室文化”区块的三条价值观卡片。
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

// “发展历程”区块的四个里程碑卡片，按顺序排列在横向滚动轨道中。
const milestones = [
  {
    year: "2013",
    title: "IOTU 实验室成立",
    description: "团队从嵌入式开发起步，为热爱学习与创造的同学提供开发实践空间。",
    image: '/logo/透明底图标.png',
  },
  {
    year: "Growth",
    title: "多方向团队成形",
    description: "随着实验室发展，逐步拓展到 Web 前端、Java / Go 后端开发、Python、人工智能与移动端等方向。",
    image: '',
  },
  {
    year: "Async",
    title: "异步理念形成",
    description: "成员拥有不同方向、目标与学习方式，在共同框架下互相追赶、交替前行。",
    image: '/logo/黑色背景透明.svg',
  },
  {
    year: "Together",
    title: "学习、项目与交流",
    description: "在双中心 B413 一起学习、做项目、交流技术，让个人积累持续汇入团队成长。",
    image: '',
  },
];

onMounted(() => {
  if (!page.value) return;

  /**
   * “发展历程”横向滚动时间线：
   * - 仅在桌面端（≥768px）且未开启“减少动态效果”时生效；
   * - 通过 pin 固定 .history-scroll 区块，用垂直滚动距离驱动卡片轨道横向位移，
   *   同时让顶部进度条同步从 0 拉伸到 1。
   * - 移动端或减少动态效果时，直接清除 transform，让卡片轨道保持普通横向 flex 布局（可原生横滑）。
   */
  media = gsap.matchMedia();
  media.add(
    {
      desktop: "(min-width: 768px)",
      compact: "(max-width: 767px)",
      precisePointer: "(hover: hover) and (pointer: fine)",
      reduceMotion: "(prefers-reduced-motion: reduce)",
    },
    (context) => {
      const { desktop, precisePointer, reduceMotion } = context.conditions as {
        desktop: boolean;
        precisePointer: boolean;
        reduceMotion: boolean;
      };
      const root = page.value;
      const track = timelineTrack.value;
      const progress = timelineProgress.value;
      if (!root || !track || !progress) return;

      const about = root.querySelector<HTMLElement>("#about");
      const asyncManifesto = root.querySelector<HTMLElement>(".async-manifesto");
      const overviewGrid = root.querySelector<HTMLElement>(".overview-grid");
      const history = root.querySelector<HTMLElement>(".history-scroll");
      const culture = root.querySelector<HTMLElement>("#culture");
      const cultureGrid = root.querySelector<HTMLElement>(".culture-grid");
      const cta = root.querySelector<HTMLElement>(".home-cta");
      const timelineCards = Array.from(root.querySelectorAll<HTMLElement>(".timeline-card"));
      const cultureCards = Array.from(root.querySelectorAll<HTMLElement>(".culture-card"));

      if (reduceMotion) {
        gsap.set(
          root.querySelectorAll<HTMLElement>(
            ".home-motion-target, .timeline-card, .culture-card, .cta-watermark, .history-watermark",
          ),
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            xPercent: 0,
            yPercent: 0,
            scale: 1,
            scaleX: 1,
            rotationX: 0,
            rotationY: 0,
            clearProps: "transform,opacity,visibility,will-change",
          },
        );
        gsap.set(track, { clearProps: "transform" });
        gsap.set(progress, { scaleX: 1, transformOrigin: "left center" });
        return;
      }

      if (about) {
        const aboutTimeline = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: about,
            start: "top 78%",
            once: true,
          },
        });

        aboutTimeline
          .fromTo(
            ".about-kicker",
            { autoAlpha: 0, x: -36 },
            { autoAlpha: 1, x: 0, duration: 0.75, clearProps: "transform,opacity,visibility" },
            0,
          )
          .fromTo(
            ".about-kicker-line",
            { scaleX: 0 },
            { scaleX: 1, duration: 1.05, transformOrigin: "left center", ease: "expo.out" },
            0.08,
          )
          .fromTo(
            ".about-copy",
            { y: 42, rotationX: -5, transformPerspective: 1000 },
            { y: 0, rotationX: 0, duration: 0.95, clearProps: "transform" },
            0.1,
          )
          .fromTo(
            ".about-fact",
            { autoAlpha: 0, x: 32 },
            {
              autoAlpha: 1,
              x: 0,
              duration: 0.62,
              stagger: 0.09,
              clearProps: "transform,opacity,visibility",
            },
            0.28,
          );
      }

      if (asyncManifesto) {
        gsap.fromTo(
          ".async-stream",
          { xPercent: -125 },
          {
            xPercent: 235,
            stagger: 0.07,
            ease: "none",
            scrollTrigger: {
              trigger: asyncManifesto,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          },
        );

        gsap.fromTo(
          ".async-manifesto__content",
          { x: 44, y: 24 },
          {
            x: 0,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: asyncManifesto,
              start: "top 88%",
              end: "bottom 36%",
              scrub: 0.7,
            },
          },
        );
      }

      if (overviewGrid) {
        const overviewItems = Array.from(overviewGrid.querySelectorAll<HTMLElement>(".overview-item"));
        const overviewLines = Array.from(overviewGrid.querySelectorAll<HTMLElement>(".overview-item__line"));
        const overviewTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: overviewGrid,
            start: "top 82%",
            once: true,
          },
        });

        overviewTimeline
          .fromTo(
            overviewItems,
            { autoAlpha: 0, y: 72, rotationX: -12, transformPerspective: 900 },
            {
              autoAlpha: 1,
              y: 0,
              rotationX: 0,
              duration: 0.9,
              stagger: 0.12,
              ease: "expo.out",
              clearProps: "transform,opacity,visibility",
            },
          )
          .fromTo(
            overviewLines,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.72, stagger: 0.1, ease: "power3.out" },
            0.18,
          );
      }

      if (history) {
        gsap.timeline({
          scrollTrigger: {
            trigger: history,
            start: "top 76%",
            once: true,
          },
        })
          .fromTo(
            ".history-heading",
            { autoAlpha: 0, y: 46 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              stagger: 0.1,
              ease: "expo.out",
              clearProps: "transform,opacity,visibility",
            },
          )
          .fromTo(
            ".history-rule",
            { scaleX: 0 },
            { scaleX: 1, duration: 1, transformOrigin: "left center", ease: "expo.out" },
            0.24,
          );
      }

      if (culture && cultureGrid) {
        const cultureTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: cultureGrid,
            start: "top 84%",
            once: true,
          },
        });

        cultureTimeline
          .fromTo(
            cultureCards,
            { autoAlpha: 0, y: 88, rotationX: -14, scale: 0.94, transformPerspective: 1100 },
            {
              autoAlpha: 1,
              y: 0,
              rotationX: 0,
              scale: 1,
              duration: 1,
              stagger: 0.14,
              ease: "expo.out",
              clearProps: "opacity,visibility",
            },
          )
          .fromTo(
            ".culture-card__line",
            { scaleX: 0 },
            { scaleX: 1, duration: 0.72, stagger: 0.12, transformOrigin: "left center", ease: "power3.out" },
            0.2,
          )
          .fromTo(
            ".culture-card__icon",
            { scale: 0.45, rotation: -70 },
            { scale: 1, rotation: 0, duration: 0.72, stagger: 0.12, ease: "back.out(1.7)" },
            0.24,
          );
      }

      if (cta) {
        gsap.fromTo(
          ".cta-watermark",
          { xPercent: -16 },
          {
            xPercent: 14,
            ease: "none",
            scrollTrigger: {
              trigger: cta,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.9,
            },
          },
        );

        gsap.timeline({
          scrollTrigger: {
            trigger: cta,
            start: "top 82%",
            once: true,
          },
        })
          .fromTo(
            ".cta-copy",
            { autoAlpha: 0, x: -52 },
            { autoAlpha: 1, x: 0, duration: 0.9, ease: "expo.out", clearProps: "transform,opacity,visibility" },
          )
          .fromTo(
            ".cta-action",
            { autoAlpha: 0, x: 48, rotation: 2 },
            {
              autoAlpha: 1,
              x: 0,
              rotation: 0,
              duration: 0.8,
              ease: "back.out(1.4)",
              clearProps: "transform,opacity,visibility",
            },
            0.14,
          );
      }

      if (!desktop) {
        gsap.set(track, { clearProps: "transform" });
        gsap.set(progress, { scaleX: 1, transformOrigin: "left center" });
        timelineCards.forEach((card) => {
          gsap.fromTo(
            card,
            { autoAlpha: 0, y: 48, scale: 0.96 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.78,
              ease: "power3.out",
              clearProps: "transform,opacity,visibility",
              scrollTrigger: {
                trigger: card,
                start: "top 88%",
                once: true,
              },
            },
          );
        });
        return;
      }

      // 轨道需要横向滚动的总距离 = 轨道内容总宽度 - 视口宽度 + 64px 右侧留白。
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 64);
      gsap.set(progress, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(timelineCards, {
        autoAlpha: 0.42,
        y: 34,
        scale: 0.92,
        rotationY: 5,
        transformPerspective: 1200,
        transformOrigin: "center center",
      });
      gsap.set(timelineCards[0], { autoAlpha: 1, y: 0, scale: 1, rotationY: 0 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".history-scroll",
          start: "top top",
          // 需要多滚动的像素距离；额外加 520px 让固定结束后仍有一段缓冲，过渡更自然。
          end: () => `+=${Math.max(1200, distance() + 520)}`,
          // scrub 让时间线进度直接与滚动进度绑定（0.8s 平滑追赶），而非独立播放。
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      const horizontalDuration = Math.max(1, timelineCards.length - 1);

      timeline
        .to(track, { x: () => -distance(), duration: horizontalDuration, ease: "none" }, 0)
        .to(progress, { scaleX: 1, duration: horizontalDuration, ease: "none" }, 0)
        .to(".history-watermark", { xPercent: -9, duration: horizontalDuration, ease: "none" }, 0);

      timelineCards.forEach((card, index) => {
        const line = card.querySelector<HTMLElement>(".timeline-card__line");

        if (index > 0) {
          timeline.to(
            card,
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              rotationY: 0,
              duration: 0.34,
              ease: "power3.out",
            },
            Math.max(0, index - 0.28),
          );
        }

        if (line) {
          timeline.to(
            line,
            { scaleX: 1, duration: 0.34, ease: "power3.out" },
            Math.max(0, index - 0.22),
          );
        }

        if (index < timelineCards.length - 1) {
          timeline.to(
            card,
            {
              autoAlpha: 0.48,
              y: -12,
              scale: 0.94,
              rotationY: -3,
              duration: 0.42,
              ease: "power2.inOut",
            },
            Math.min(horizontalDuration - 0.42, index + 0.38),
          );
        }
      });

      const cleanupTilt = precisePointer ? setupTiltCards(cultureCards) : undefined;
      return () => cleanupTilt?.();
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

    <!-- 01 / About：实验室简介 + 基本信息表 + “Why Async” 说明 + 三项统计数据。 -->
    <section id="about" class="scroll-mt-28 border-b border-lab-border bg-white py-24 md:py-28">
      <div class="lab-container">
        <div class="grid gap-12 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,1.45fr)] lg:gap-20">
          <div class="about-kicker home-motion-target pt-1">
            <p class="font-mono text-xs uppercase text-lab-primary">01 / About</p>
            <div class="about-kicker-line mt-5 h-px w-full max-w-48 origin-left bg-lab-primary" aria-hidden="true" />
          </div>

          <ScrollReveal>
            <div class="about-copy home-motion-target">
              <SectionTitle
                title="从嵌入式起步，成长为面向多方向的开发团队"
                description="异步开发实验室（Async Lab）成立于 2013 年，前身为 IOTU 实验室。团队汇聚全校各专业热爱创造、热爱学习、热爱生活的同学，在 Web 前端、后端、Python与嵌入式、移动端等方向持续探索。"
              />

              <dl class="mt-12 grid border-t border-lab-border sm:grid-cols-2 sm:gap-x-10">
                <div
                  v-for="fact in labFacts"
                  :key="fact.label"
                  class="about-fact home-motion-target border-b border-lab-border py-5 sm:py-6"
                >
                  <dt class="font-mono text-xs uppercase tracking-[0.16em] text-lab-muted">{{ fact.label }}</dt>
                  <dd class="mt-3 text-sm font-semibold leading-7 text-lab-text md:text-base">{{ fact.value }}</dd>
                </div>
              </dl>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <div class="async-manifesto home-motion-target relative mt-16 isolate overflow-hidden border-l-2 border-lab-primary bg-lab-surface px-6 py-8 md:px-10 md:py-10">
            <div class="async-streams pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
              <span v-for="index in 3" :key="index" class="async-stream absolute h-px w-2/5 bg-lab-primary/30" />
            </div>
            <div class="async-manifesto__content relative z-10 grid gap-8 md:grid-cols-[0.35fr_1.65fr]">
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
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div class="overview-grid mt-20 grid border-y border-lab-border md:grid-cols-3 md:divide-x md:divide-lab-border">
            <article
              v-for="item in overview"
              :key="item.label"
              class="overview-item home-motion-target relative overflow-hidden border-b border-lab-border py-8 last:border-b-0 md:border-b-0 md:px-8 md:first:pl-0 md:last:pr-0"
            >
              <span class="overview-item__line absolute inset-x-0 top-0 h-px origin-left bg-lab-primary" aria-hidden="true" />
              <p class="font-display text-4xl font-semibold text-lab-text md:text-5xl">{{ item.value }}</p>
              <h3 class="mt-4 text-sm font-semibold text-lab-text">{{ item.label }}</h3>
              <p class="mt-3 max-w-xs text-sm leading-7 text-lab-muted">{{ item.description }}</p>
            </article>
          </div>
        </ScrollReveal>
      </div>
    </section>

    <!-- 独立组件：四个研究方向的桌面固定切换 / 移动端手风琴展示，详见 components/home/ResearchDirections.vue。 -->
    <ResearchDirections />

    <!-- 02 / Timeline：发展历程，桌面端为固定 + 横向滚动的时间线卡片轨道。 -->
    <section
      id="history"
      class="history-scroll relative scroll-mt-28 overflow-hidden bg-black py-24 text-white md:min-h-screen md:py-28"
      aria-labelledby="history-title"
    >
      <div
        class="history-watermark pointer-events-none absolute left-[8%] top-10 whitespace-nowrap font-display text-[8rem] font-semibold leading-none text-transparent md:top-8 md:text-[13rem]"
        aria-hidden="true"
      >
        ASYNC / ARCHIVE
      </div>

      <div class="lab-container relative z-10">
        <div class="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p class="history-heading home-motion-target font-mono text-xs uppercase text-[#7cb5ff]">02 / Timeline</p>
            <h2 id="history-title" class="history-heading home-motion-target mt-4 font-display text-3xl font-semibold leading-tight md:text-5xl">
              从 IOTU 到 Async Lab
            </h2>
          </div>
          <p class="history-heading home-motion-target max-w-md text-sm leading-7 text-white/60 md:text-right">
            名称与方向不断发展，始终不变的是对创造、学习和共同成长的热爱。
          </p>
        </div>

        <!-- 顶部进度条：scaleX 由上方 onMounted 中的 GSAP 时间线驱动，随滚动从 0 拉伸到 1。 -->
        <div class="history-rule mt-12 hidden h-px origin-left overflow-hidden bg-white/15 md:block" aria-hidden="true">
          <div ref="timelineProgress" class="h-full w-full origin-left bg-lab-primary" />
        </div>
      </div>

      <!-- 卡片横向轨道：桌面端由 GSAP 控制 x 位移模拟横向滚动；移动端/减少动态效果时为普通纵向 flex 列表。 -->
      <div
        ref="timelineTrack"
        class="mt-14 flex flex-col gap-5 px-4 sm:px-6 md:w-max md:flex-row md:gap-6 md:px-[max(1rem,calc((100vw-80rem)/2+1.5rem))]"
      >
        <article
          v-for="(milestone, index) in milestones"
          :key="milestone.title"
          class="timeline-card group relative min-h-[286px] w-full shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] p-8 transition-[border-color,background-color] duration-300 hover:border-white/25 hover:bg-white/[0.07] md:w-[390px] lg:w-[420px]"
        >
          <div class="flex items-center justify-between gap-6">
            <p class="font-mono text-sm text-[#7cb5ff]">{{ milestone.year }}</p>
            <span class="font-mono text-xs text-white/35">0{{ index + 1 }} / 04</span>
          </div>
          <h3 class="mt-10 text-2xl font-semibold text-white">{{ milestone.title }}</h3>
          <p class="mt-5 max-w-sm text-sm leading-8 text-white/60">{{ milestone.description }}</p>
          <div
            class="timeline-card__line absolute inset-x-8 bottom-8 h-px origin-left scale-x-25 bg-lab-primary"
            aria-hidden="true"
          />
          <img
            v-if="milestone.image"
            :src="milestone.image"
            :alt="milestone.title"
            class="timeline-card__mark pointer-events-none absolute -bottom-14 -right-10 h-44 w-44 object-contain opacity-[0.08] grayscale transition-[opacity,transform] duration-500 group-hover:rotate-6 group-hover:scale-105 group-hover:opacity-[0.14]"
          >
        </article>
      </div>
    </section>

    <!-- 03 / Lab Culture：三条价值观卡片，均由 ScrollReveal 包裹做进场动画。 -->
    <section id="culture" class="relative scroll-mt-28 overflow-hidden bg-white py-24 md:py-32" aria-labelledby="culture-title">
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

        <div class="culture-grid mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          <div v-for="(value, index) in values" :key="value.title" class="culture-card-shell">
            <article class="culture-card home-motion-card home-motion-target group relative h-full border-t border-lab-border pt-8">
              <span class="culture-card__line absolute inset-x-0 top-0 h-px origin-left bg-lab-primary" aria-hidden="true" />
              <div class="flex items-center justify-between gap-6">
                <div
                  class="culture-card__icon grid h-12 w-12 place-items-center rounded-lg border border-lab-border bg-lab-surface text-lab-primary"
                >
                  <component :is="value.icon" class="h-6 w-6" aria-hidden="true" />
                </div>
                <span class="font-mono text-xs text-lab-muted">0{{ index + 1 }}</span>
              </div>
              <h3 class="mt-10 text-xl font-semibold text-lab-text">{{ value.title }}</h3>
              <p class="mt-4 text-sm leading-8 text-lab-muted">{{ value.description }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- 底部引导条：跳转到 /join 加入方式页面。 -->
    <section class="home-cta relative overflow-hidden border-y border-[#0052cc] bg-lab-primary py-20 text-white md:py-24">
      <div class="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/30" aria-hidden="true" />
      <div class="pointer-events-none absolute -left-8 top-1/2 -translate-y-1/2" aria-hidden="true">
        <div class="cta-watermark whitespace-nowrap font-display text-[9rem] font-semibold leading-none text-transparent md:text-[14rem]">
          ASYNC
        </div>
      </div>
      <div class="lab-container relative z-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <ScrollReveal>
          <div class="cta-copy home-motion-target">
            <p class="font-mono text-xs uppercase text-white/70">Join the Track</p>
            <h2 class="mt-4 max-w-4xl font-display text-3xl font-semibold leading-tight md:text-5xl">
              用 8-10 周学习路径，走进真实项目
            </h2>
            <p class="mt-6 max-w-2xl text-base leading-8 text-white/75">
              从一条适合自己的技术方向开始，在持续学习、协作开发和项目复盘中，把兴趣变成真正可以交付的能力。
            </p>
          </div>
        </ScrollReveal>

        <BaseButton as="RouterLink" to="/join" variant="secondary" size="lg" class="cta-action home-motion-target justify-self-start lg:justify-self-end">
          查看加入方式
          <ArrowRight class="h-4 w-4" aria-hidden="true" />
        </BaseButton>
      </div>
    </section>
  </div>
</template>

<style scoped>
.async-manifesto {
  background-image:
    linear-gradient(rgba(0, 102, 255, 0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 102, 255, 0.055) 1px, transparent 1px);
  background-size: 32px 32px;
}

.async-stream:nth-child(1) {
  top: 24%;
}

.async-stream:nth-child(2) {
  top: 51%;
}

.async-stream:nth-child(3) {
  top: 78%;
}

.history-watermark {
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.065);
}

.cta-watermark {
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.14);
}

.culture-card-shell {
  perspective: 1100px;
}

.home-motion-card {
  backface-visibility: hidden;
  transform-style: preserve-3d;
}

.culture-card__icon {
  transform: translateZ(18px);
}

@media (prefers-reduced-motion: reduce) {
  .async-stream {
    display: none;
  }
}
</style>

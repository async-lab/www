<script setup lang="ts">
import { ArrowRight, GitBranch, Layers3, ShieldCheck } from "@lucide/vue";
import { onMounted, onUnmounted, ref } from "vue";

import ScrollReveal from "@/components/animations/ScrollReveal.vue";
import HeroSection from "@/components/home/HeroSection.vue";
import ResearchDirections from "@/components/home/ResearchDirections.vue";
import SectionTitle from "@/components/shared/SectionTitle.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import { gsap } from "@/lib/gsap";

const page = ref<HTMLElement | null>(null);
const timelineTrack = ref<HTMLElement | null>(null);
let ctx: ReturnType<typeof gsap.context> | undefined;

const values = [
  {
    title: "工程实践优先",
    description: "从需求、设计、编码到部署，强调能交付、可维护和能复盘的完整链路。",
    icon: GitBranch,
  },
  {
    title: "跨端能力融合",
    description: "前端、后端、移动端和嵌入式互相协作，减少单点技能孤岛。",
    icon: Layers3,
  },
  {
    title: "质量和可访问性",
    description: "初始化阶段就保留响应式、语义化、主题切换和动效降级的基础。",
    icon: ShieldCheck,
  },
];

const milestones = [
  {
    year: "阶段 01",
    title: "IOTU创立",
    description: "前身成立，软件开发的起点",
  },
  {
    year: "阶段 02",
    title: "技术方向拓展",
    description: "前端 / 后端(Java/Go) / 移动端(Android) / 嵌入式",
  },
  {
    year: "阶段 03",
    title: "培养路径建设",
    description: "新生根据自己的兴趣自幼学习",
  },
  {
    year: "阶段 04",
    title: "工程实践沉淀",
    description: "工程实践沉淀",
  },
  {
    year: "阶段 05",
    title: "更名 · 理念升级",
    description: "2021年Asynchronous Lab 正式启用，异步成长理念",
  },
  {
    year: "阶段 06",
    title: "持续发展 · 传承",
    description: "开放平台，助力每届同学找到所爱",
  },
];

onMounted(() => {
  if (!page.value) return;

  ctx = gsap.context(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const track = timelineTrack.value;

    if (reduceMotion || isMobile || !track) return;

    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 96);

    gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: ".history-scroll",
        start: "top top",
        end: () => `+=${Math.max(900, distance())}`,
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
      },
    });
  }, page.value);
});

onUnmounted(() => {
  ctx?.revert();
});
</script>

<template>
  <div ref="page">
    <HeroSection />
    
    <section id="about" class="lab-container scroll-mt-28 py-24">
      <ScrollReveal>
        <SectionTitle
        eyebrow="About"
        title="把软件开发拆成清楚的方向，再用项目把它们连接起来"
        description="实验室官网把定位、研究方向、发展路径和加入方式收在同一条浏览动线上，减少跳转，让第一次访问的人能连续理解我们在做什么。"
        />
      </ScrollReveal>
    </section>
    <ResearchDirections />

    <section class="history-scroll relative border-y border-lab-border bg-lab-surface py-24">
      <div class="lab-container">
        <div class="mb-12 flex items-end justify-between gap-8">
          <div>
            <p class="font-mono text-xs uppercase text-lab-primary">Timeline</p>
            <h2 class="mt-4 font-display text-3xl font-semibold md:text-5xl">实验室展路径</h2>
          </div>
          <p class="hidden max-w-sm text-sm leading-8 text-lab-muted md:block">
            桌面端会在本段固定滚动并横向推进，移动端保持自然列表。
          </p>
        </div>
      </div>

      <div ref="timelineTrack" class="flex gap-8 px-4 md:w-max md:px-[max(1rem,calc((100vw-80rem)/2+1.5rem))]">
        <article
          v-for="milestone in milestones"
          :key="milestone.title"
          class="min-h-72 w-full shrink-0 rounded-3xl border border-lab-border bg-white p-8 md:w-[432px]"
        >
          <p class="font-mono text-sm text-lab-primary">{{ milestone.year }}</p>
          <h3 class="mt-6 text-2xl font-semibold text-lab-text">{{ milestone.title }}</h3>
          <p class="mt-4 text-sm leading-8 text-lab-muted">{{ milestone.description }}</p>
          <div class="mt-8 h-px w-full bg-lab-border" />
        </article>
      </div>
    </section>

    <section class="bg-white py-32">
      <div class="lab-container">
        <ScrollReveal>
          <SectionTitle
            eyebrow="Lab Culture"
            title="代码即艺术，技术驱动创新"
            description="官网先用清晰的信息架构承接实验室定位，后续再把真实成员、成果和新闻接入静态数据。"
          />
        </ScrollReveal>

        <div class="mt-16 grid gap-8 md:grid-cols-3">
          <ScrollReveal v-for="value in values" :key="value.title">
            <BaseCard interactive class="h-full">
              <component :is="value.icon" class="h-8 w-8 text-lab-primary" aria-hidden="true" />
              <h3 class="mt-8 text-xl font-semibold text-lab-text">{{ value.title }}</h3>
              <p class="mt-4 text-sm leading-8 text-lab-muted">{{ value.description }}</p>
            </BaseCard>
          </ScrollReveal>
        </div>
      </div>
    </section>

    <section class="bg-lab-surface py-32">
      <div class="lab-container">
        <div class="rounded-3xl border border-lab-border bg-white p-8 md:p-12">
          <div class="grid gap-12 md:grid-cols-[1.1fr_auto] md:items-center">
            <div>
              <p class="font-mono text-xs uppercase text-lab-primary">Join the Track</p>
              <h2 class="mt-4 font-display text-3xl font-semibold text-lab-text md:text-5xl">
                用 8 周学习路径进入真实项目
              </h2>
              <p class="mt-6 max-w-2xl text-base leading-8 text-lab-muted">
                加入我们页面已按文档准备招生方向、申请流程和 FAQ，后续只需要替换实际要求即可上线。
              </p>
            </div>
            <BaseButton as="RouterLink" to="/join" size="lg">
              查看加入方式
              <ArrowRight class="h-4 w-4" aria-hidden="true" />
            </BaseButton>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

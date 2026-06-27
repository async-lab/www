<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

import ScrollReveal from "@/components/animations/ScrollReveal.vue";
import SectionTitle from "@/components/shared/SectionTitle.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import { researchDirections } from "@/data/researchDirections";
import { gsap } from "@/lib/gsap";

const page = ref<HTMLElement | null>(null);
const timelineTrack = ref<HTMLElement | null>(null);
let ctx: ReturnType<typeof gsap.context> | undefined;

const milestones = [
  {
    year: "阶段 01",
    title: "实验室定位确认",
    description: "明确全栈开发实验室方向，覆盖前端、后端、移动端、嵌入式四条技术线。",
  },
  {
    year: "阶段 02",
    title: "培养路径建设",
    description: "形成从基础训练、专题研讨到项目实战的连续培养节奏。",
  },
  {
    year: "阶段 03",
    title: "工程项目沉淀",
    description: "通过真实项目积累组件库、服务端模板、跨端实践和硬件接入经验。",
  },
  {
    year: "阶段 04",
    title: "成果展示上线",
    description: "接入成员、项目、新闻和成果数据，让官网成为实验室长期展示窗口。",
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
  <div ref="page" class="overflow-hidden bg-lab-bg pt-28">
    <section class="lab-container py-20">
      <ScrollReveal>
        <SectionTitle
          eyebrow="About"
          title="把全栈能力拆成清楚的方向，再用项目把它们连接起来"
          description="这是初始化版本的关于页。实验室历史先以阶段化方式呈现，等成立时间、院校和真实里程碑确认后，可以直接替换为正式内容。"
        />
      </ScrollReveal>
    </section>

    <section class="history-scroll relative border-y border-lab-border bg-lab-surface py-20">
      <div class="lab-container">
        <div class="mb-10 flex items-end justify-between gap-6">
          <div>
            <p class="font-mono text-xs uppercase text-lab-primary">Timeline</p>
            <h2 class="mt-3 font-display text-3xl font-semibold md:text-5xl">实验室发展路径</h2>
          </div>
          <p class="hidden max-w-sm text-sm leading-7 text-lab-muted md:block">
            桌面端会在本段固定滚动并横向推进，移动端保持自然列表。
          </p>
        </div>
      </div>

      <div ref="timelineTrack" class="flex gap-5 px-4 md:w-max md:px-[max(1rem,calc((100vw-80rem)/2+1.5rem))]">
        <article
          v-for="milestone in milestones"
          :key="milestone.title"
          class="min-h-72 w-full shrink-0 rounded-3xl border border-lab-border bg-lab-bg p-6 shadow-xl md:w-[430px] md:p-8"
        >
          <p class="font-mono text-sm text-lab-primary">{{ milestone.year }}</p>
          <h3 class="mt-6 text-2xl font-semibold text-lab-text">{{ milestone.title }}</h3>
          <p class="mt-4 text-sm leading-7 text-lab-muted">{{ milestone.description }}</p>
          <div class="mt-8 h-px w-full bg-gradient-to-r from-lab-primary via-direction-frontend to-transparent" />
        </article>
      </div>
    </section>

    <section class="lab-container py-24">
      <ScrollReveal>
        <SectionTitle
          eyebrow="Direction Details"
          title="四个研究方向详解"
          description="每个方向都保留文档中的核心主题和技术栈标签，便于后续接入更细的课程、项目或成员数据。"
        />
      </ScrollReveal>

      <div class="mt-12 grid gap-5 lg:grid-cols-2">
        <ScrollReveal v-for="direction in researchDirections" :key="direction.id">
          <BaseCard interactive class="h-full">
            <div class="flex items-start gap-5">
              <div
                class="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border bg-white/[0.05]"
                :style="{ borderColor: `${direction.color}66`, color: direction.color }"
              >
                <component :is="direction.icon" class="h-7 w-7" aria-hidden="true" />
              </div>
              <div>
                <p class="font-mono text-xs uppercase text-lab-muted">{{ direction.subtitle }}</p>
                <h3 class="mt-2 text-2xl font-semibold text-lab-text">{{ direction.title }}</h3>
                <p class="mt-3 text-sm leading-7 text-lab-muted">{{ direction.summary }}</p>
              </div>
            </div>

            <div class="mt-7 flex flex-wrap gap-2">
              <span
                v-for="topic in direction.topics"
                :key="topic"
                class="tech-tag"
                :style="{ borderColor: `${direction.color}55` }"
              >
                {{ topic }}
              </span>
            </div>
          </BaseCard>
        </ScrollReveal>
      </div>
    </section>

    <section class="bg-lab-surface py-24">
      <div class="lab-container">
        <div class="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <ScrollReveal>
            <SectionTitle
              eyebrow="Culture"
              title="代码即艺术"
              description="实验室文化先以简洁表达落地：重视工程质量、审美、协作和长期积累。"
            />
          </ScrollReveal>
          <ScrollReveal>
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="rounded-3xl border border-lab-border bg-lab-bg p-6">
                <p class="font-mono text-xs uppercase text-lab-primary">Create</p>
                <h3 class="mt-3 text-xl font-semibold">把想法做成作品</h3>
                <p class="mt-3 text-sm leading-7 text-lab-muted">从页面、服务到设备接入，强调真实可演示、可迭代的结果。</p>
              </div>
              <div class="rounded-3xl border border-lab-border bg-lab-bg p-6">
                <p class="font-mono text-xs uppercase text-lab-primary">Improve</p>
                <h3 class="mt-3 text-xl font-semibold">把作品做得更好</h3>
                <p class="mt-3 text-sm leading-7 text-lab-muted">关注性能、体验、可访问性和维护成本，让项目能长期生长。</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  </div>
</template>

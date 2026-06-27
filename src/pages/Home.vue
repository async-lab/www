<script setup lang="ts">
import { ArrowRight, GitBranch, Layers3, ShieldCheck } from "@lucide/vue";

import ScrollReveal from "@/components/animations/ScrollReveal.vue";
import HeroSection from "@/components/home/HeroSection.vue";
import ResearchDirections from "@/components/home/ResearchDirections.vue";
import SectionTitle from "@/components/shared/SectionTitle.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseCard from "@/components/ui/BaseCard.vue";

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
</script>

<template>
  <div>
    <HeroSection />
    <ResearchDirections />

    <section class="bg-lab-surface py-24">
      <div class="lab-container">
        <ScrollReveal>
          <SectionTitle
            eyebrow="Lab Culture"
            title="代码即艺术，技术驱动创新"
            description="官网先用清晰的信息架构承接实验室定位，后续再把真实成员、成果和新闻接入静态数据。"
          />
        </ScrollReveal>

        <div class="mt-12 grid gap-5 md:grid-cols-3">
          <ScrollReveal v-for="value in values" :key="value.title">
            <BaseCard interactive class="h-full">
              <component :is="value.icon" class="h-8 w-8 text-lab-primary" aria-hidden="true" />
              <h3 class="mt-6 text-xl font-semibold text-lab-text">{{ value.title }}</h3>
              <p class="mt-4 text-sm leading-7 text-lab-muted">{{ value.description }}</p>
            </BaseCard>
          </ScrollReveal>
        </div>
      </div>
    </section>

    <section class="relative overflow-hidden bg-lab-bg py-24">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(0,102,255,0.18),transparent_30%)]" />
      <div class="lab-container relative">
        <div class="glass-panel rounded-3xl p-8 md:p-12">
          <div class="grid gap-8 md:grid-cols-[1.1fr_auto] md:items-center">
            <div>
              <p class="font-mono text-xs uppercase text-lab-primary">Join the Track</p>
              <h2 class="mt-3 font-display text-3xl font-semibold text-lab-text md:text-5xl">
                用 8 周学习路径进入真实项目
              </h2>
              <p class="mt-5 max-w-2xl text-base leading-8 text-lab-muted">
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

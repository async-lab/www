<script setup lang="ts">
// 加入我们页面：招募信息 + 四大方向要求（复用 researchDirections 数据）+ 申请流程四步 + FAQ 手风琴。
// 页面标注了多处“占位内容”，注释中保留说明供后续接入真实数据时参考。
import { BadgeCheck, ChevronDown, Clock3, MessageSquare, Rocket } from "@lucide/vue";
import { ref } from "vue";

import ScrollReveal from "@/components/animations/ScrollReveal.vue";
import SectionTitle from "@/components/shared/SectionTitle.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import { researchDirections } from "@/data/researchDirections";

// 当前展开的 FAQ 索引；-1 表示全部收起。默认展开第一条（索引 0）。
const openFaq = ref(0);

// “申请流程”四个步骤，与下方四列布局一一对应。
const steps = [
  {
    title: "8 周学习",
    description: "完成基础知识、工程工具、代码规范和方向专题训练。",
    icon: Clock3,
  },
  {
    title: "项目实战",
    description: "进入小型真实项目，按需求、开发、联调和复盘推进。",
    icon: Rocket,
  },
  {
    title: "技术面试",
    description: "围绕项目代码、技术理解和协作习惯做结构化交流。",
    icon: MessageSquare,
  },
  {
    title: "正式加入",
    description: "确定方向、导师或负责人，进入长期项目和研究任务。",
    icon: BadgeCheck,
  },
];

// FAQ 列表，当前内容偏“网站建设说明”性质，正式上线前建议替换为面向申请者的真实问答。
const faqs = [
  {
    question: "现在是否需要填写真实导师和成员信息？",
    answer: "初始化阶段不需要。文档里成员、项目和新闻都标注了暂不需要，当前版本只保留可替换的信息结构。",
  },
  {
    question: "没有完整技术基础可以申请吗？",
    answer: "可以先按 8 周学习路径进入训练，重点看学习节奏、代码习惯和完成项目的能力。",
  },
  {
    question: "后续官网内容怎么更新？",
    answer: "建议把成员、项目、新闻等内容放到 public/data 的 JSON 文件中，页面组件只负责展示。",
  },
];
</script>

<template>
  <div class="bg-white pt-32">
    <!-- 页头：标题 + 联系方式占位按钮（邮箱地址待正式确认后替换）。 -->
    <section class="py-24">
      <div class="lab-container">
        <ScrollReveal>
          <SectionTitle
            eyebrow="Join Us"
            title="加入异步开发实验室"
            description="这里先按文档搭好招生信息、申请流程和 FAQ。具体人数、邮箱、地点确认后，可以替换占位内容。"
          />
          <div class="mt-9">
            <BaseButton as="a" href="mailto:example@example.com" size="lg">
              联系方式待确认
            </BaseButton>
          </div>
        </ScrollReveal>
      </div>
    </section>

    <!-- 四大方向招募卡片：数据来自 src/data/researchDirections.ts，与首页研究方向区块共用同一数据源。 -->
    <section class="lab-container py-24">
      <ScrollReveal>
        <SectionTitle
          eyebrow="Recruiting Tracks"
          title="四大方向招募"
          description="每个方向先放技能要求和培养目标，后续可替换为正式招新海报或报名入口。"
        />
      </ScrollReveal>

      <div class="mt-16 grid gap-8 lg:grid-cols-2">
        <ScrollReveal v-for="direction in researchDirections" :key="direction.id">
          <BaseCard interactive class="h-full">
            <div class="flex items-start justify-between gap-8">
              <div>
                <p class="font-mono text-xs uppercase text-lab-muted">{{ direction.subtitle }}</p>
                <h3 class="mt-2 text-2xl font-semibold">{{ direction.title }}</h3>
              </div>
              <div
                class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-lab-border bg-lab-surface text-lab-primary"
              >
                <component :is="direction.icon" class="h-6 w-6" aria-hidden="true" />
              </div>
            </div>

            <div class="mt-8 grid gap-8 sm:grid-cols-2">
              <div>
                <h4 class="text-sm font-semibold">技能要求</h4>
                <div class="mt-4 flex flex-wrap gap-2">
                  <span
                  v-for="stack in direction.stacks"
                  :key="stack"
                  class="tech-tag"
                >
                    {{ stack }}
                  </span>
                </div>
              </div>
              <div>
                <h4 class="text-sm font-semibold">培养目标</h4>
                <p class="mt-4 text-sm leading-8 text-lab-muted">{{ direction.summary }}</p>
              </div>
            </div>
          </BaseCard>
        </ScrollReveal>
      </div>
    </section>

    <!-- 申请流程：四步横向卡片（移动端自动纵向堆叠）。 -->
    <section class="bg-lab-surface py-32">
      <div class="lab-container">
        <ScrollReveal>
          <SectionTitle
            eyebrow="Process"
            title="申请流程"
            description="先用四步流程固定信息架构，真实报名表、面试安排和项目题目可以后续接入。"
            align="center"
          />
        </ScrollReveal>

        <div class="mt-16 grid gap-8 md:grid-cols-4">
          <ScrollReveal v-for="(step, index) in steps" :key="step.title">
            <div class="relative h-full rounded-3xl border border-lab-border bg-white p-8">
              <div class="mb-8 flex items-center justify-between">
                <span class="font-mono text-xs text-lab-primary">0{{ index + 1 }}</span>
                <component :is="step.icon" class="h-6 w-6 text-lab-primary" aria-hidden="true" />
              </div>
              <h3 class="text-xl font-semibold">{{ step.title }}</h3>
              <p class="mt-4 text-sm leading-8 text-lab-muted">{{ step.description }}</p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>

    <!-- FAQ：单选手风琴，点击已展开项会再次点击收起（openFaq 置为 -1）。 -->
    <section class="lab-container py-32">
      <div class="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <ScrollReveal>
          <SectionTitle
            eyebrow="FAQ"
            title="常见问题"
            description="FAQ 使用语义化按钮和动态 aria-expanded，方便后续补充更多问题。"
          />
        </ScrollReveal>

        <div class="grid gap-4">
          <div
            v-for="(faq, index) in faqs"
            :key="faq.question"
            class="rounded-2xl border border-lab-border bg-white"
          >
            <!-- 用真实 <button> + aria-expanded/aria-controls 实现手风琴，保证键盘和屏幕阅读器可用。 -->
            <button
              type="button"
              class="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-6 text-left font-semibold text-lab-text focus:outline-none focus-visible:ring-2 focus-visible:ring-lab-primary"
              :aria-expanded="openFaq === index"
              :aria-controls="`faq-panel-${index}`"
              @click="openFaq = openFaq === index ? -1 : index"
            >
              <span>{{ faq.question }}</span>
              <ChevronDown
                class="h-5 w-5 shrink-0 text-lab-muted transition-transform duration-200"
                :class="{ 'rotate-180': openFaq === index }"
                aria-hidden="true"
              />
            </button>
            <div
              v-show="openFaq === index"
              :id="`faq-panel-${index}`"
              class="px-6 pb-6 text-sm leading-8 text-lab-muted"
            >
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

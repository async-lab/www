<script setup lang="ts">
// 加入我们页面：招募信息 + 四大方向要求（复用 researchDirections 数据）+ 申请流程四步 + FAQ 手风琴。
// 页面标注了多处“占位内容”，注释中保留说明供后续接入真实数据时参考。
import { BadgeCheck, ChevronDown, Clock3, MessageSquare, Rocket } from "@lucide/vue";
import { onMounted, onUnmounted, ref } from "vue";

import ScrollReveal from "@/components/animations/ScrollReveal.vue";
import SectionTitle from "@/components/shared/SectionTitle.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseCard from "@/components/ui/BaseCard.vue";
import { researchDirections } from "@/data/researchDirections";
import { gsap } from "@/lib/gsap";

// 当前展开的 FAQ 索引；-1 表示全部收起。默认展开第一条（索引 0）。
const openFaq = ref(0);
const faqPanels = ref<HTMLElement[]>([]);
const reduceFaqMotion = ref(false);
let faqMotion: ReturnType<typeof gsap.matchMedia> | undefined;

const setFaqPanel = (element: unknown, index: number) => {
  if (element instanceof HTMLElement) {
    faqPanels.value[index] = element;
  }
};

const animateFaqPanel = (index: number, expanded: boolean) => {
  const panel = faqPanels.value[index];
  if (!panel) return;

  gsap.killTweensOf(panel);

  if (expanded) {
    gsap.to(panel, {
      height: panel.scrollHeight,
      autoAlpha: 1,
      duration: reduceFaqMotion.value ? 0 : 0.28,
      ease: "power2.out",
      overwrite: "auto",
      onComplete: () => gsap.set(panel, { height: "auto" }),
    });
    return;
  }

  gsap.set(panel, { height: panel.getBoundingClientRect().height });
  gsap.to(panel, {
    height: 0,
    autoAlpha: 0,
    duration: reduceFaqMotion.value ? 0 : 0.24,
    ease: "power2.inOut",
    overwrite: "auto",
  });
};

const toggleFaq = (index: number) => {
  const previous = openFaq.value;
  const next = previous === index ? -1 : index;

  if (previous >= 0) {
    animateFaqPanel(previous, false);
  }

  openFaq.value = next;

  if (next >= 0) {
    animateFaqPanel(next, true);
  }
};

onMounted(() => {
  faqMotion = gsap.matchMedia();
  faqMotion.add("(prefers-reduced-motion: reduce)", () => {
    reduceFaqMotion.value = true;
    return () => {
      reduceFaqMotion.value = false;
    };
  });

  faqPanels.value.forEach((panel, index) => {
    gsap.set(panel, index === openFaq.value ? { height: "auto", autoAlpha: 1 } : { height: 0, autoAlpha: 0 });
  });
});

onUnmounted(() => {
  faqPanels.value.forEach((panel) => gsap.killTweensOf(panel));
  faqMotion?.revert();
});

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
    question: "实验室福利？",
    answer: "实验室提供自习工位，同学们可以携带电脑显示器在实验室学习，同时还会给成员提供服务器资源进行项目部署。还会有学长学姐提供内推机会",
  },
  {
    question: "实验室团建？",
    answer: "每年固定的两个团建日期：1/1 and 1/6。期间可能也会有一些小的团建",
  },
  {
    question: "实验室项目？",
    answer: "建议把成员、项目、新闻等内容放到 public/data 的 JSON 文件中，页面组件只负责展示。",
  },
  {
    question: '学长学姐教学？',
    answer: '学长学姐们会分享他们的学习经验和项目心得，帮助新生更快地融入实验室。'
  },
  {
    question: '实验室会比赛吗？',
    answer: '实验室支持大家打比赛，指导老师可能会会指定要求参加一些比赛。'
  },
  {
    question: '实验室氛围',
    answer: '实验室氛围轻松，大家可以自由讨论技术问题，也可以分享自己的学习经验。'
  }
];
</script>

<template>
  <div class="bg-white pt-32">
    <!-- 页头：标题 + 联系方式占位按钮（邮箱地址待正式确认后替换）。 -->
    <section class="py-24">
      <div class="lab-container flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <ScrollReveal class="min-w-0 flex-1">
          <SectionTitle
          eyebrow="Join Us"
          title="加入异步开发实验室"
          description="这里先按文档搭好招生信息、申请流程和 FAQ。具体人数、邮箱、地点确认后，可以替换占位内容。"
          />
          <div class="mt-9">
            <BaseButton as="a" href="mailto:example@example.com" size="lg">
              QQ群954192337
            </BaseButton>
          </div>
        </ScrollReveal>
        <img
          src="/images/team/qrcode_1784446912550.jpg"
          alt="加入实验室 QQ 群二维码"
          width="1284"
          height="2283"
          class="mx-auto mt-0 h-auto w-full max-w-[22rem] shrink-0 object-contain lg:mx-0"
        />
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
                class="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-lab-border bg-lab-surface text-lab-primary"
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
            <div class="relative h-full rounded-xl border border-lab-border bg-white p-8">
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
            description="FREQUENTLY ASKED QUESTIONS"
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
              @click="toggleFaq(index)"
            >
              <span>{{ faq.question }}</span>
              <ChevronDown
                class="h-5 w-5 shrink-0 text-lab-muted transition-transform duration-200"
                :class="{ 'rotate-180': openFaq === index }"
                aria-hidden="true"
              />
            </button>
            <div
              :ref="(element) => setFaqPanel(element, index)"
              :id="`faq-panel-${index}`"
              :aria-hidden="openFaq !== index"
              class="faq-panel"
            >
              <div class="px-6 pb-6 text-sm leading-8 text-lab-muted">
                {{ faq.answer }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.faq-panel {
  height: 0;
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
  contain: layout paint;
  will-change: height, opacity;
}
</style>

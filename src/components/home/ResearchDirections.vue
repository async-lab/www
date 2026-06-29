<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

import SectionTitle from "@/components/shared/SectionTitle.vue";
import { researchDirections } from "@/data/researchDirections";
import { gsap } from "@/lib/gsap";

const section = ref<HTMLElement | null>(null);
let ctx: ReturnType<typeof gsap.context> | undefined;

onMounted(() => {
  if (!section.value) return;

  ctx = gsap.context(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const cards = gsap.utils.toArray<HTMLElement>(".research-card");

    if (reduceMotion || isMobile) {
      gsap.set(cards, { autoAlpha: 1, rotationX: 0, y: 0, scale: 1 });
      return;
    }

    gsap.set(cards, {
      transformPerspective: 1200,
      transformOrigin: "center bottom",
    });
    gsap.set(cards.slice(1), {
      autoAlpha: 0,
      y: -120,
      rotationX: 72,
      scale: 0.94,
    });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section.value,
        start: "top top",
        end: `+=${cards.length * 620}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    cards.forEach((card, index) => {
      if (index === cards.length - 1) return;

      timeline
        .to(card, {
          rotationX: -76,
          y: 120,
          autoAlpha: 0,
          scale: 0.92,
          duration: 1,
          ease: "power2.inOut",
        })
        .to(
          cards[index + 1],
          {
            rotationX: 0,
            y: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 1,
            ease: "power2.inOut",
          },
          "<0.12",
        );
    });
  }, section.value);
});

onUnmounted(() => {
  ctx?.revert();
});
</script>

<template>
  <section ref="section" class="relative overflow-hidden bg-white py-32 md:min-h-screen">
    <div class="lab-container">
      <SectionTitle
        eyebrow="Research Directions"
        title="四个方向，一套完整的全栈能力地图"
        description="首页先聚焦文档中明确需要的四大研究方向。桌面端滚动时固定本段，让卡片依次翻转切换；移动端保持自然纵向浏览。"
        align="center"
      />

      <div class="relative mx-auto mt-16 min-h-[560px] max-w-5xl md:min-h-[600px]">
        <article
          v-for="(direction, index) in researchDirections"
          :key="direction.id"
          class="research-card relative mb-8 overflow-hidden rounded-3xl border border-lab-border bg-white p-8 md:absolute md:inset-x-0 md:top-0 md:mb-0 md:p-12"
          :style="{ zIndex: researchDirections.length - index }"
        >
          <div class="relative grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div>
              <div
                class="mb-8 grid h-16 w-16 place-items-center rounded-2xl border border-lab-border bg-lab-surface text-lab-primary"
              >
                <component :is="direction.icon" class="h-8 w-8" aria-hidden="true" />
              </div>
              <p class="font-mono text-xs uppercase text-lab-muted">{{ direction.subtitle }}</p>
              <h3 class="mt-4 font-display text-4xl font-semibold text-lab-text md:text-6xl">
                {{ direction.title }}
              </h3>
              <p class="mt-6 max-w-xl text-base leading-8 text-lab-muted">
                {{ direction.summary }}
              </p>
            </div>

            <div class="rounded-2xl border border-lab-border bg-lab-surface p-8">
              <h4 class="text-sm font-semibold text-lab-text">技术栈标签</h4>
              <div class="mt-4 flex flex-wrap gap-4">
                <span
                  v-for="stack in direction.stacks"
                  :key="stack"
                  class="tech-tag"
                >
                  {{ stack }}
                </span>
              </div>

              <h4 class="mt-8 text-sm font-semibold text-lab-text">培养与研究主题</h4>
              <div class="mt-4 grid gap-4 sm:grid-cols-2">
                <div
                  v-for="topic in direction.topics"
                  :key="topic"
                  class="rounded-2xl border border-lab-border bg-white px-4 py-4 text-sm text-lab-muted"
                >
                  {{ topic }}
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

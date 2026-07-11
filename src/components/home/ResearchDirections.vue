<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

import SectionTitle from "@/components/shared/SectionTitle.vue";
import { researchDirections } from "@/data/researchDirections";
import { gsap } from "@/lib/gsap";

const section = ref<HTMLElement | null>(null);
const activeDirection = ref(0);
let media: ReturnType<typeof gsap.matchMedia> | undefined;

onMounted(() => {
  if (!section.value) return;

  media = gsap.matchMedia();
  media.add(
    {
      desktop: "(min-width: 1024px)",
      reduceMotion: "(prefers-reduced-motion: reduce)",
    },
    (context) => {
      const { desktop, reduceMotion } = context.conditions as {
        desktop: boolean;
        reduceMotion: boolean;
      };
      const panels = gsap.utils.toArray<HTMLElement>(".research-panel");

      if (reduceMotion) {
        gsap.set(panels, { autoAlpha: 1, y: 0, scale: 1, clearProps: "transform" });
        return;
      }

      if (!desktop) {
        panels.forEach((panel) => {
          gsap.fromTo(
            panel,
            { autoAlpha: 0, y: 26 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.72,
              ease: "power3.out",
              clearProps: "transform,opacity,visibility",
              scrollTrigger: {
                trigger: panel,
                start: "top 88%",
                once: true,
              },
            },
          );
        });
        return;
      }

      gsap.set(panels, { autoAlpha: 0, y: 44, scale: 0.985 });
      gsap.set(panels[0], { autoAlpha: 1, y: 0, scale: 1 });

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section.value,
          start: "top top",
          end: `+=${Math.max(1900, panels.length * 520)}`,
          scrub: 0.75,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const nextIndex = Math.min(
              panels.length - 1,
              Math.round(self.progress * (panels.length - 1)),
            );
            if (activeDirection.value !== nextIndex) activeDirection.value = nextIndex;
          },
        },
      });

      panels.forEach((panel, index) => {
        if (index === panels.length - 1) return;

        timeline
          .to(panel, {
            autoAlpha: 0,
            y: -34,
            scale: 0.985,
            duration: 1,
          })
          .to(
            panels[index + 1],
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 1,
            },
            "<0.18",
          );
      });

      return () => {
        activeDirection.value = 0;
      };
    },
    section.value,
  );
});

onUnmounted(() => {
  media?.revert();
});
</script>

<template>
  <section
    id="research"
    ref="section"
    class="relative scroll-mt-28 overflow-hidden bg-white py-24 lg:min-h-screen lg:py-28"
    aria-labelledby="research-title"
  >
    <div class="lab-container">
      <div
        class="research-stage grid gap-14 lg:min-h-[620px] lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-stretch lg:gap-20"
      >
        <div class="flex flex-col justify-between">
          <div>
            <div id="research-title">
              <SectionTitle
                eyebrow="Research Directions"
                title="四个方向，一套完整的全栈能力地图"
                description="从界面体验到服务架构，从移动应用到智能硬件，我们用共同的工程方法连接不同技术方向。"
              />
            </div>

            <p class="mt-10 max-w-md text-sm leading-7 text-lab-muted">
              每个方向都从基础训练进入项目协作，在真实需求、联调和复盘中建立可以持续迁移的能力。
            </p>
          </div>

          <ol class="mt-14 hidden gap-4 lg:grid" aria-label="研究方向进度">
            <li
              v-for="(direction, index) in researchDirections"
              :key="direction.id"
              class="grid grid-cols-[2rem_1fr_auto] items-center gap-4 py-2 transition-colors duration-200"
              :class="activeDirection === index ? 'text-lab-text' : 'text-lab-muted'"
              :aria-current="activeDirection === index ? 'step' : undefined"
            >
              <span class="font-mono text-xs">0{{ index + 1 }}</span>
              <span
                class="h-px origin-left transition-[transform,background-color] duration-300"
                :class="activeDirection === index ? 'scale-x-100 bg-lab-primary' : 'scale-x-75 bg-lab-border'"
                aria-hidden="true"
              />
              <span class="text-sm font-medium">{{ direction.title }}</span>
            </li>
          </ol>
        </div>

        <div
          class="research-panels relative min-h-[560px] border-t border-lab-border lg:min-h-[620px] lg:border-l lg:border-t-0 lg:pl-16"
        >
          <article
            v-for="(direction, index) in researchDirections"
            :key="direction.id"
            class="research-panel relative border-b border-lab-border py-12 last:border-b-0 lg:absolute lg:inset-0 lg:flex lg:border-b-0 lg:py-0"
          >
            <div class="my-auto w-full">
              <div class="flex items-center justify-between gap-6">
                <div
                  class="grid h-14 w-14 place-items-center rounded-lg border border-lab-border bg-lab-surface text-lab-primary"
                >
                  <component :is="direction.icon" class="h-7 w-7" aria-hidden="true" />
                </div>
                <span class="font-mono text-sm text-lab-primary">0{{ index + 1 }} / 04</span>
              </div>

              <p class="mt-10 font-mono text-xs uppercase text-lab-muted">{{ direction.subtitle }}</p>
              <h3 class="mt-4 font-display text-4xl font-semibold leading-tight text-lab-text sm:text-5xl lg:text-6xl">
                {{ direction.title }}
              </h3>
              <p class="mt-6 max-w-2xl text-base leading-8 text-lab-muted lg:text-lg">
                {{ direction.summary }}
              </p>

              <div class="mt-10 grid gap-10 border-t border-lab-border pt-8 sm:grid-cols-2">
                <div>
                  <h4 class="text-sm font-semibold text-lab-text">技术栈</h4>
                  <div class="mt-4 flex flex-wrap gap-3">
                    <span v-for="stack in direction.stacks" :key="stack" class="tech-tag">
                      {{ stack }}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 class="text-sm font-semibold text-lab-text">研究主题</h4>
                  <ul class="mt-3 divide-y divide-lab-border">
                    <li
                      v-for="topic in direction.topics"
                      :key="topic"
                      class="flex items-center gap-3 py-3 text-sm text-lab-muted"
                    >
                      <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-lab-primary" aria-hidden="true" />
                      {{ topic }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

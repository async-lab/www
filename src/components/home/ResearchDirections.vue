<script setup lang="ts">
import { ChevronDown } from "@lucide/vue";
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";

import SectionTitle from "@/components/shared/SectionTitle.vue";
import { researchDirections } from "@/data/researchDirections";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * 组件结构总览
 *
 * 1. 小于 1024px：使用普通文档流中的单选手风琴，不创建桌面端 GSAP 时间线。
 * 2. 大于等于 1024px：固定整个 section，通过一条 ScrollTrigger 时间线切换四个方向面板。
 * 3. 大于等于 1024px 且开启“减少动态效果”：跳过固定与切换动画，改为纵向展示全部面板。
 *
 * 常用修改入口
 *
 * - 研究方向数据：src/data/researchDirections.ts
 * - 桌面固定滚动距离（即每个方向的停留时长）：下方 ScrollTrigger 的 end
 * - 面板淡入淡出节奏：panels.forEach() 内的 transitionStart 和 duration
 *
 * 桌面端没有滚轮吸附：四个方向的切换完全由滚动进度线性驱动（scrub: true），
 * 滚多少切多少，停在哪个进度就停在哪个面板，不会自动吸附到最近的方向。
 */

/** 整个研究方向 section 的 DOM 引用，也是 ScrollTrigger 的 trigger 和 GSAP 选择器作用域。 */
const section = ref<HTMLElement | null>(null);

/** 桌面端当前方向索引：驱动左侧进度指示器的高亮，取值范围为 0～3。 */
const activeDirection = ref(0);

/** 移动端/平板端当前展开的手风琴索引，与桌面端 activeDirection 相互独立。 */
const selectedDirection = ref(0);

/** 保存 gsap.matchMedia() 实例，以便组件卸载时统一撤销媒体查询和其中创建的动画。 */
let media: ReturnType<typeof gsap.matchMedia> | undefined;

/**
 * 手风琴切换会改变移动端 section 高度。
 * 必须等 Vue 完成 DOM 更新后再刷新 ScrollTrigger，否则全局 ScrollSmoother 和后续区块
 * 仍可能使用切换前的页面高度计算触发位置。
 */
watch(selectedDirection, async () => {
  await nextTick();
  ScrollTrigger.refresh();
});

onMounted(() => {
  // onMounted 后 ref 才指向真实 DOM；没有根节点时不创建任何动画或事件监听。
  if (!section.value) return;

  /**
   * matchMedia 会在断点或 prefers-reduced-motion 改变时：
   * 1. 先执行当前分支返回的清理函数；
   * 2. 再根据新的媒体条件重新运行回调。
   * 第二个参数 section.value 同时作为 GSAP context 的选择器作用域。
   */
  media = gsap.matchMedia();
  media.add(
    {
      // 与模板中的 Tailwind lg 断点保持一致。
      desktop: "(min-width: 1024px)",
      // 开启减少动态效果时，不创建固定滚动叙事。
      reduceMotion: "(prefers-reduced-motion: reduce)",
    },
    (context) => {
      const { desktop, reduceMotion } = context.conditions as {
        desktop: boolean;
        reduceMotion: boolean;
      };

      // 只查询桌面版面板，避免把移动端手风琴中的 article 误加入时间线。
      const panels = Array.from(
        section.value?.querySelectorAll<HTMLElement>(".research-panel--desktop") ?? [],
      );

      // 小于 1024px 时完全交给 Vue + CSS 手风琴，不创建 ScrollTrigger。
      if (!desktop) {
        return;
      }

      /**
       * 减少动态效果模式：清除可能由上一个媒体条件留下的透明度和 transform，
       * 再由文件末尾的 CSS 把绝对定位面板改回普通纵向文档流。
       */
      if (reduceMotion) {
        gsap.set(panels, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          clearProps: "transform,opacity,visibility",
        });
        return;
      }

      // 桌面动画初始状态：除第一项外全部隐藏，并略微下移、缩小。
      gsap.set(panels, { autoAlpha: 0, y: 44, scale: 0.985 });
      gsap.set(panels[0], { autoAlpha: 1, y: 0, scale: 1 });

      /**
       * 这个对象本身不会渲染到页面。
       * 它的作用是把 timeline 的总时长固定为 panels.length - 1 个单位，
       * 让四个方向的逻辑落点稳定分布在 0、1/3、2/3、1。
       */
      const timelineState = { progress: 0 };

      /**
       * 桌面端主时间线：负责固定 section、把滚动距离映射为时间线进度、切换面板。
       * 没有滚轮吸附，onUpdate 只负责把当前滚动进度同步给左侧的进度指示器。
       */
      const timeline = gsap.timeline({
        // 时间线本身必须线性跟随滚动，面板进入/退出的节奏由各 tween 的持续时间控制。
        defaults: { ease: "none" },
        scrollTrigger: {
          // section 顶部到达视口顶部时开始固定。
          trigger: section.value,
          start: "top top",
          // 四个面板当前得到 4800px（每个方向 1200px）；修改 1200 可整体拉长或缩短每个
          // 方向的停留距离，即滚动多久才会切到下一个方向。
          end: `+=${Math.max(1200, panels.length * 500)}`,
          // true 表示时间线进度直接跟随当前滚动位置，不额外增加 scrub 追赶延迟。
          scrub: true,
          // 固定 section；GSAP 会自动创建 pin spacer 保留对应的页面滚动高度。
          pin: true,
          // 提前少量准备 pin，减少进入固定状态时的一帧跳动。
          anticipatePin: 1,
          // 窗口尺寸或布局刷新后重新计算 start/end 和依赖函数。
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            /**
             * self.progress 始终在 0～1 之间。
             * Math.round 会把当前滚动进度映射为最接近的面板索引，驱动左侧指示器高亮。
             */
            const nextIndex = Math.min(
              panels.length - 1,
              Math.round(self.progress * (panels.length - 1)),
            );
            if (activeDirection.value !== nextIndex) activeDirection.value = nextIndex;
          },
        },
      });

      // 用不可见的 timelineState tween 撑满整条时间线，保证总时长和逻辑落点均匀。
      timeline.to(
        timelineState,
        {
          progress: panels.length - 1,
          duration: panels.length - 1,
        },
        0,
      );

      /**
       * 从第二个面板开始，为每个方向建立“上一项退出 + 当前项进入”的短交叉过渡。
       * 第一个面板已经通过 gsap.set() 显示，所以 index === 0 不需要进入动画。
       */
      panels.forEach((panel, index) => {
        if (index === 0) return;

        /**
         * 每个方向占用 1 个时间单位；0.14 表示在该单位开始后稍作停留再切换。
         * 例如 index=1 时从 0.14 开始，index=2 时从 1.14 开始。
         */
        const transitionStart = index - 1 + 0.14;

        timeline
          .to(panels[index - 1], {
            autoAlpha: 0,
            y: -24,
            scale: 0.99,
            duration: 0.22,
          }, transitionStart)
          .fromTo(
            panel,
            { autoAlpha: 0, y: 24, scale: 0.99 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.28,
              immediateRender: false,
            },
            transitionStart + 0.04,
          );
      });

      // 切换媒体条件或卸载组件时，GSAP context 会自动撤销 timeline 和 pin。
      return () => {
        activeDirection.value = 0;
      };
    },
    section.value,
  );
});

onUnmounted(() => {
  // revert 会撤销 matchMedia 中创建的 ScrollTrigger、GSAP tween、内联样式及分支 cleanup。
  media?.revert();
});
</script>

<template>
  <!--
    section 是桌面 ScrollTrigger 的固定节点。
    overflow-hidden 用来裁掉桌面面板切换时上下移动产生的短暂溢出。
  -->
  <section
    id="research"
    ref="section"
    class="relative min-h-[100svh] scroll-mt-28 overflow-hidden bg-white pb-8 pt-24 sm:py-24 lg:min-h-screen lg:py-24"
    aria-labelledby="research-title"
  >
    <div class="lab-container">
      <!--
        ========================= 移动端 / 平板端布局 =========================
        lg:hidden 表示该布局只在 0～1023px 显示。
        这一部分不参与桌面 GSAP 时间线，交互完全由 selectedDirection 控制。
      -->
      <div class="lg:hidden">
        <!--
          注意：移动版和桌面版标题节点当前都保留在 DOM 中，并使用同一个 research-title id。
          如果你后续调整 aria-labelledby 或拆分语义标题，建议给两套标题分配独立 id。
        -->
        <div id="research-title">
          <p class="font-mono text-xs uppercase tracking-[0.16em] text-lab-primary">Research Directions</p>
          <h2 class="mt-3 max-w-xl font-display text-2xl font-semibold leading-tight text-lab-text sm:text-3xl">
            四个方向，选择后完整查看
          </h2>
        </div>

        <!-- 四个 article 始终存在；只有 selectedDirection 对应的详情通过 v-show 显示。 -->
        <div class="mt-6 grid gap-2" role="list" aria-label="研究方向选项">
          <article
            v-for="(direction, index) in researchDirections"
            :key="direction.id"
            class="research-option overflow-hidden rounded-lg border bg-white transition-[border-color,box-shadow] duration-200"
            :class="
              selectedDirection === index
                ? 'border-lab-primary shadow-[0_10px_30px_rgba(0,102,255,0.08)]'
                : 'border-lab-border'
            "
            role="listitem"
          >
            <!--
              点击标题只修改 selectedDirection。
              aria-expanded 与实际展开状态同步，aria-controls 指向下方对应详情容器。
            -->
            <button
              type="button"
              class="flex min-h-14 w-full touch-manipulation cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-lab-primary"
              :aria-expanded="selectedDirection === index"
              :aria-controls="`research-option-${direction.id}`"
              @click="selectedDirection = index"
            >
              <span class="flex min-w-0 items-center gap-3">
                <span
                  class="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-lab-border bg-lab-surface text-lab-primary"
                >
                  <component :is="direction.icon" class="h-5 w-5" aria-hidden="true" />
                </span>
                <span class="min-w-0">
                  <span class="block font-mono text-[10px] uppercase tracking-[0.12em] text-lab-muted">
                    0{{ index + 1 }} · {{ direction.subtitle }}
                  </span>
                  <span class="mt-0.5 block text-sm font-semibold text-lab-text sm:text-base">
                    {{ direction.title }}
                  </span>
                </span>
              </span>

              <ChevronDown
                class="h-5 w-5 shrink-0 text-lab-muted transition-transform duration-200"
                :class="selectedDirection === index ? 'rotate-180 text-lab-primary' : ''"
                aria-hidden="true"
              />
            </button>

            <!--
              v-show 只切换 display，不销毁详情 DOM；因此切换时状态简单、无进出场重建。
              展开导致的页面高度变化会由脚本顶部的 watch + ScrollTrigger.refresh() 处理。
            -->
            <div
              v-show="selectedDirection === index"
              :id="`research-option-${direction.id}`"
              class="border-t border-lab-border px-4 pb-4 pt-3"
            >
              <p class="text-xs leading-5 text-lab-muted sm:text-sm sm:leading-6">
                {{ direction.summary }}
              </p>

              <div class="mt-3 grid gap-3 sm:grid-cols-2 sm:gap-4">
                <div>
                  <h3 class="font-mono text-[10px] uppercase tracking-[0.14em] text-lab-primary">技术栈</h3>
                  <div class="mt-2 flex flex-wrap gap-1.5">
                    <span
                      v-for="stack in direction.stacks"
                      :key="stack"
                      class="rounded-full border border-lab-border bg-lab-surface px-2 py-1 font-mono text-[10px] leading-none text-lab-text sm:text-[11px]"
                    >
                      {{ stack }}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 class="font-mono text-[10px] uppercase tracking-[0.14em] text-lab-primary">研究主题</h3>
                  <ul class="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
                    <li
                      v-for="topic in direction.topics"
                      :key="topic"
                      class="flex items-center gap-1.5 text-[11px] leading-5 text-lab-muted sm:text-xs"
                    >
                      <span class="h-1 w-1 shrink-0 rounded-full bg-lab-primary" aria-hidden="true" />
                      {{ topic }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!--
        ============================== 桌面布局 ==============================
        hidden lg:grid 表示从 1024px 开始显示。
        左列是标题和方向进度，右列是四个绝对定位、相互叠放的内容面板。
      -->
      <div
        class="research-stage hidden gap-14 lg:grid lg:min-h-[620px] lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-stretch lg:gap-20"
      >
        <!-- 左列：静态介绍 + 由 activeDirection 驱动的四步进度指示器。 -->
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

          <!-- activeDirection 来自 ScrollTrigger onUpdate，也会在程序吸附开始时主动同步。 -->
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

        <!--
          右列面板容器必须保持 relative；每个 research-panel--desktop 使用 absolute inset-0
          叠在同一个位置，具体显示哪一项由 GSAP 控制 autoAlpha、y 和 scale。
        -->
        <div
          class="research-panels relative mt-10 min-h-0 border-t border-lab-border lg:mt-0 lg:min-h-[620px] lg:border-l lg:border-t-0 lg:pl-16"
        >
          <article
            v-for="(direction, index) in researchDirections"
            :key="direction.id"
            class="research-panel research-panel--desktop absolute inset-0 flex border-b-0 py-0"
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

<style scoped>
/*
 * 桌面端减少动态效果模式：
 * 脚本不会创建固定时间线，因此这里必须把原本互相叠放的绝对定位面板恢复为普通文档流，
 * 否则四个面板会重叠在同一个位置。移动端本来就是手风琴，不受这段样式影响。
 */
@media (min-width: 1024px) and (prefers-reduced-motion: reduce) {
  .research-stage,
  .research-panels {
    /* 取消桌面动画版为固定画面预留的 620px 最小高度，让内容自然撑开。 */
    min-height: 0;
  }

  .research-panel {
    /* 覆盖模板里的 absolute/inset-0，使四个方向按顺序纵向排列。 */
    position: relative;
    display: flex;
    border-bottom-width: 1px;
    padding-block: 3rem;
  }
}
</style>

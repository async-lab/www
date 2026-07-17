<script setup lang="ts">
// 应用根组件：负责搭建全站公共骨架（顶部导航 + GSAP ScrollSmoother 平滑滚动容器 + 页脚），
// 并在路由切换时把滚动位置和锚点定位对齐。
import { nextTick, onMounted, onUnmounted, watch } from "vue";
import { RouterView, useRoute } from "vue-router";

import SiteFooter from "@/components/layout/SiteFooter.vue";
import SiteHeader from "@/components/layout/SiteHeader.vue";
import { getScrollSmoother, killScrollSmoother, setupScrollSmoother, ScrollTrigger } from "@/lib/gsap";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();
const route = useRoute();

/**
 * 路由切换 / 页面挂载后，把滚动条重置到正确位置：
 * - 若 URL 带 hash（例如 /#about、/#research），滚动到对应锚点，留出顶部固定导航栏的高度（96px）。
 * - 否则回到页面顶部。
 * 由于 GSAP ScrollSmoother 只在桌面端启用（见 lib/gsap.ts 的视口判断），
 * 这里对“有 smoother”和“无 smoother（原生滚动）”两种情况分别做了处理。
 */
async function syncScrollWithRoute() {
  // 等待 Vue 完成本次路由对应的 DOM 更新，否则 querySelector 可能还找不到目标元素。
  await nextTick();
  const smoother = getScrollSmoother();
  ScrollTrigger.refresh();

  // 定位完成后再刷新一次 ScrollTrigger，确保各 section 的触发范围基于最终滚动位置重新计算。
  const refreshAfterPositioning = () => {
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      ScrollTrigger.update();
    });
  };

  if (route.hash) {
    const target = document.querySelector(route.hash);
    if (target) {
      smoother?.scrollTo(target, true, "top 96px");
      if (!smoother) {
        // 没有 ScrollSmoother（移动端 / 减少动态效果场景）时，退化为原生 window.scrollTo。
        const targetTop = target.getBoundingClientRect().top + window.scrollY - 96;
        window.scrollTo({ top: Math.max(0, targetTop), behavior: "auto" });
      }
      refreshAfterPositioning();
    }
  } else {
    if (smoother) smoother.scrollTop(0);
    else window.scrollTo({ top: 0, behavior: "auto" });
    refreshAfterPositioning();
  }
}

onMounted(() => {
  // 首次加载时：根据本地存储恢复主题、初始化平滑滚动容器，并按当前 URL 对齐一次滚动位置。
  appStore.initTheme();
  setupScrollSmoother();
  void syncScrollWithRoute();
});

// 监听完整路径（含 hash）变化，每次路由切换都重新对齐滚动位置。
watch(
  () => route.fullPath,
  () => {
    void syncScrollWithRoute();
  },
);

onUnmounted(() => {
  killScrollSmoother();
});
</script>

<template>
  <div class="min-h-screen bg-lab-bg text-lab-text">
    <SiteHeader />
    <!--
      #smooth-wrapper / #smooth-content 是 GSAP ScrollSmoother 要求的固定结构：
      wrapper 负责裁剪视口，content 是实际发生滚动位移的容器。
      桌面端由 setupScrollSmoother() 接管其滚动行为；移动端或减少动态效果时保持原生滚动。
    -->
    <div id="smooth-wrapper">
      <div id="smooth-content">
        <main id="main-content">
          <!-- mode="out-in" 保证旧页面先完全离场，新页面再进场，避免两个页面的动画叠加导致布局跳动。 -->
          <RouterView v-slot="{ Component, route }">
            <Transition name="page" mode="out-in" @after-enter="syncScrollWithRoute">
              <component :is="Component" :key="route.path" />
            </Transition>
          </RouterView>
        </main>
        <SiteFooter />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, watch } from "vue";
import { RouterView, useRoute } from "vue-router";

import SiteFooter from "@/components/layout/SiteFooter.vue";
import SiteHeader from "@/components/layout/SiteHeader.vue";
import { getScrollSmoother, killScrollSmoother, setupScrollSmoother, ScrollTrigger } from "@/lib/gsap";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();
const route = useRoute();

async function syncScrollWithRoute() {
  await nextTick();
  const smoother = getScrollSmoother();
  ScrollTrigger.refresh();

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
  appStore.initTheme();
  setupScrollSmoother();
  void syncScrollWithRoute();
});

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
    <div id="smooth-wrapper">
      <div id="smooth-content">
        <main id="main-content">
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

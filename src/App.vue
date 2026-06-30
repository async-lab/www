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

  if (route.hash) {
    const target = document.querySelector(route.hash);
    if (target) {
      smoother?.scrollTo(target, true, "top 96px");
      if (!smoother) target.scrollIntoView({ block: "start" });
    }
  } else {
    smoother?.scrollTop(0);
  }

  ScrollTrigger.refresh();
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
            <Transition name="page" mode="out-in">
              <component :is="Component" :key="route.fullPath" />
            </Transition>
          </RouterView>
        </main>
        <SiteFooter />
      </div>
    </div>
  </div>
</template>

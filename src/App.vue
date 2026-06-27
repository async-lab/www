<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView } from "vue-router";

import SiteFooter from "@/components/layout/SiteFooter.vue";
import SiteHeader from "@/components/layout/SiteHeader.vue";
import { useAppStore } from "@/stores/app";

const appStore = useAppStore();

onMounted(() => {
  appStore.initTheme();
});
</script>

<template>
  <div class="min-h-screen bg-lab-bg text-lab-text">
    <SiteHeader />
    <main id="main-content">
      <RouterView v-slot="{ Component, route }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </Transition>
      </RouterView>
    </main>
    <SiteFooter />
  </div>
</template>

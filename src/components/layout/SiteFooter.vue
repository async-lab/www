<script setup lang="ts">
import { Code2, Mail, MapPin } from "@lucide/vue";
import { contact } from "../../../public/data/site.json";
</script>

<template>
  <footer class="border-t border-lab-border bg-white">
    <div class="lab-container grid gap-12 py-16 md:grid-cols-[1.3fr_1fr_1fr]">
      <div>
        <div class="mb-6 flex items-center gap-4">
          <span
            class="grid h-10 w-10 place-items-center rounded-full border border-lab-border bg-white font-mono text-sm font-bold text-lab-text"
            aria-hidden="true"
          >
            DL
          </span>
          <div>
            <p class="font-display text-base font-semibold">异步开发实验室</p>
            <p class="font-mono text-xs uppercase text-lab-muted">Code the Future</p>
          </div>
        </div>
        <p class="max-w-xl text-sm leading-8 text-lab-muted">
          面向前端、后端、移动端和嵌入式方向的全栈开发实验室官网初始化版本。
          实验室名称、院校、成员和联系方式后续可在静态数据中替换。
        </p>
      </div>

      <div>
        <h2 class="mb-4 text-sm font-semibold">站点导航</h2>
        <div class="grid gap-2 text-sm text-lab-muted">
          <RouterLink class="transition-colors hover:text-lab-text" to="/">首页</RouterLink>
          <RouterLink class="transition-colors hover:text-lab-text" to="/#about">关于我们</RouterLink>
          <RouterLink class="transition-colors hover:text-lab-text" to="/join">加入我们</RouterLink>
        </div>
      </div>

      <div>
        <h2 class="mb-4 text-sm font-semibold">联系信息</h2>
        <div class="grid gap-4 text-sm text-lab-muted">
          <p class="flex items-center gap-2"><Mail class="h-4 w-4" aria-hidden="true" /> {{ contact.email }}</p>
          <p class="flex items-center gap-2"><Code2 class="h-4 w-4" aria-hidden="true" /> {{ contact.github }}</p>
          <p class="flex items-center gap-2"><MapPin class="h-4 w-4" aria-hidden="true" /> {{ contact.address }}</p>
        </div>
      </div>
    </div>
  </footer>
</template>

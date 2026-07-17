<script setup lang="ts">
// 全站页脚：实验室简介 + 站内导航 + 联系方式。联系信息读取自 public/data/site.json，
// 方便后续在不改代码的情况下更新邮箱、GitHub 和地址。
import { Code2, Mail, MapPin } from "@lucide/vue";
import { contact } from "../../../public/data/site.json";

// site.json 中邮箱字段可能是占位值 "待确认"，此时不渲染邮箱这一行，避免展示无意义占位符。
const hasEmail = contact.email && contact.email !== "待确认";
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
            AL
          </span>
          <div>
            <p class="font-display text-base font-semibold">异步开发实验室</p>
            <p class="font-mono text-xs uppercase text-lab-muted">Async Lab · Since 2013</p>
          </div>
        </div>
        <p class="max-w-xl text-sm leading-8 text-lab-muted">
          2013 年成立，前身为 IOTU 实验室。如今面向 Web 前端、后端、C++ 与嵌入式、移动端等方向，
          为热爱开发的同学提供共同学习、项目实践与技术交流的空间。
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
          <p v-if="hasEmail" class="flex items-center gap-2"><Mail class="h-4 w-4" aria-hidden="true" /> {{ contact.email }}</p>
          <a
            class="flex items-center gap-2 transition-colors duration-200 hover:text-lab-text focus:outline-none focus-visible:ring-2 focus-visible:ring-lab-primary"
            :href="contact.github"
            target="_blank"
            rel="noreferrer"
          >
            <Code2 class="h-4 w-4" aria-hidden="true" /> Async Lab GitHub
          </a>
          <p class="flex items-center gap-2"><MapPin class="h-4 w-4" aria-hidden="true" /> {{ contact.address }}</p>
        </div>
      </div>
    </div>
  </footer>
</template>

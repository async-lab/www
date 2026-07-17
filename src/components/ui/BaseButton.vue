<script setup lang="ts">
// 全站通用按钮组件：通过 `as` 属性可渲染为原生 <button>、<a> 或路由 <RouterLink>，
// 用同一套视觉规范覆盖“提交表单 / 外部链接 / 站内跳转”三种典型场景。
import { cva, type VariantProps } from "class-variance-authority";
import { computed } from "vue";

// cva 按 variant × size 组合生成对应的 Tailwind class 字符串，避免在模板里写大段三元表达式。
const buttonClass = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-semibold transition-[color,background-color,border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 active:translate-y-0 motion-reduce:transform-none focus:outline-none focus-visible:ring-2 focus-visible:ring-lab-primary focus-visible:ring-offset-2 focus-visible:ring-offset-lab-bg disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-lab-primary text-white hover:bg-lab-primaryLight hover:shadow-glow",
        secondary:
          "border border-lab-border bg-white text-lab-text hover:border-lab-primary hover:text-lab-primary hover:shadow-sm",
        ghost: "text-lab-text hover:text-lab-primary",
      },
      size: {
        sm: "min-h-10 px-4 text-sm",
        md: "min-h-12 px-6 text-sm",
        lg: "min-h-14 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonVariant = NonNullable<VariantProps<typeof buttonClass>["variant"]>;
type ButtonSize = NonNullable<VariantProps<typeof buttonClass>["size"]>;

const props = withDefaults(
  defineProps<{
    // as="RouterLink" 时需配合 to 使用；as="a" 时需配合 href 使用；as="button" 为默认表单按钮。
    as?: "button" | "a" | "RouterLink";
    href?: string;
    to?: string;
    type?: "button" | "submit" | "reset";
    variant?: ButtonVariant;
    size?: ButtonSize;
  }>(),
  {
    as: "button",
    href: undefined,
    to: undefined,
    type: "button",
    variant: "primary",
    size: "md",
  },
);

const classes = computed(() => buttonClass({ variant: props.variant, size: props.size }));
</script>

<template>
  <!-- <component :is="as"> 动态渲染成对应标签；type 属性只在原生 button 场景下生效，避免传给 <a>/<RouterLink> 产生无效 HTML 属性。 -->
  <component
    :is="as"
    :href="href"
    :to="to"
    :type="as === 'button' ? type : undefined"
    :class="classes"
  >
    <slot />
  </component>
</template>

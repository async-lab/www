<script setup lang="ts">
import { cva, type VariantProps } from "class-variance-authority";
import { computed } from "vue";

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

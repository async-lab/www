<script setup lang="ts">
import { cva, type VariantProps } from "class-variance-authority";
import { computed } from "vue";

const buttonClass = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-lab-primary focus-visible:ring-offset-2 focus-visible:ring-offset-lab-bg disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-lab-primary text-white shadow-glow hover:bg-lab-primaryLight",
        secondary:
          "border border-lab-primary/50 bg-lab-primary/10 text-lab-text hover:border-lab-primary hover:bg-lab-primary/20",
        ghost: "text-lab-text hover:bg-white/10",
      },
      size: {
        sm: "min-h-9 px-4 text-sm",
        md: "min-h-11 px-5 text-sm",
        lg: "min-h-12 px-6 text-base",
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

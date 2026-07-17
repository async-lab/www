<script setup lang="ts">
// 首页 Hero（首屏）区块：包含背景 Logo 水印、Canvas 粒子流动效果、打字机标题动画，
// 以及入场时间线动画。是全站视觉最复杂的组件，逻辑主要分三块：打字机、粒子动画、GSAP 入场时间线。
import { ArrowDown, ArrowRight } from "@lucide/vue";
import { onMounted, onUnmounted, ref } from "vue";

import BaseButton from "@/components/ui/BaseButton.vue";
import { gsap } from "@/lib/gsap";

const hero = ref<HTMLElement | null>(null);
const particleCanvas = ref<HTMLCanvasElement | null>(null);
const typedText = ref<HTMLElement | null>(null);
const typingCaret = ref<HTMLElement | null>(null);
const title = "异步开发实验室";
const logoSrc = "/logo/白色背景_透明.svg";

// 单个粒子（光点）的运动状态。
type SparkParticle = {
  x: number;
  y: number;
  /** 该粒子所在“光流条带”的基准 y 坐标，用于叠加正弦波动效果。 */
  originY: number;
  radius: number;
  /** 水平方向移动速度（像素/秒），只向左漂移。 */
  speed: number;
  /** 上下波动的振幅。 */
  wave: number;
  /** 正弦波相位偏移，让每个粒子的波动节奏错开，避免所有粒子同步摆动。 */
  phase: number;
  alpha: number;
  /** 闪烁频率系数，控制透明度周期性明暗变化的快慢。 */
  twinkle: number;
};

// 缓存的 Canvas 2D 上下文与当前尺寸/设备像素比，避免每帧重新读取 DOM。
type ParticleCanvasState = {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  dpr: number;
};

// 粒子动画帧率上限：1000ms / 45fps，用 requestAnimationFrame 节流实现，降低移动端/低端设备负载。
const particleFrameInterval = 1000 / 45;

let titleTimer: number | undefined;
let heroFallbackTimer: number | undefined;
let particleFrame: number | undefined;
let particleResizeFrame: number | undefined;
let particleResizeObserver: ResizeObserver | undefined;
let particleVisibilityObserver: IntersectionObserver | undefined;
let particleLastTime = 0;
let particleShouldAnimate = false;
let particleIsVisible = true;
let particleCanvasState: ParticleCanvasState | undefined;
/** 预渲染的单个光点精灵图（径向渐变），每帧用 drawImage 复用，避免重复计算渐变。 */
let particleSprite: HTMLCanvasElement | undefined;
let particles: SparkParticle[] = [];
let ctx: ReturnType<typeof gsap.context> | undefined;
let scrollCueHidden = false;

/** 滚动超过 64px 后隐藏右下角“继续滚动”提示按钮，避免遮挡下方内容。 */
function updateScrollCueVisibility() {
  const shouldHide = window.scrollY > 64;
  if (scrollCueHidden === shouldHide) return;

  scrollCueHidden = shouldHide;
  hero.value?.classList.toggle("has-left-hero", shouldHide);
}

/** 隐藏打字机光标（停止闪烁动画并设为透明）。 */
function hideTypingCaret() {
  if (!typingCaret.value) return;

  typingCaret.value.style.animation = "none";
  typingCaret.value.style.opacity = "0";
}

/** 立即完成打字机效果：清除定时器、直接显示完整标题文字并隐藏光标。用于减少动态效果或异常兜底场景。 */
function finishTypewriter() {
  if (titleTimer !== undefined) window.clearTimeout(titleTimer);
  titleTimer = undefined;

  if (typedText.value) typedText.value.textContent = title;
  hideTypingCaret();
}

/** 逐字符打出标题文字，每个字符间隔 92ms，打完后延迟 520ms 再隐藏光标（模拟真实打字结束停顿）。 */
function startTypewriter() {
  if (!typedText.value) return;
  if (titleTimer !== undefined) window.clearTimeout(titleTimer);

  typedText.value.textContent = "";
  if (typingCaret.value) {
    typingCaret.value.style.removeProperty("animation");
    typingCaret.value.style.removeProperty("opacity");
  }

  let index = 0;

  const typeNextCharacter = () => {
    index += 1;
    if (typedText.value) typedText.value.textContent = title.slice(0, index);

    if (index < title.length) {
      titleTimer = window.setTimeout(typeNextCharacter, 92);
      return;
    }

    titleTimer = window.setTimeout(() => {
      titleTimer = undefined;
      hideTypingCaret();
    }, 520);
  };

  typeNextCharacter();
}

/**
 * 创建一个新粒子。
 * @param startInView 为 true 时粒子随机出现在画布可见范围内（用于初始化）；
 *                     为 false 时粒子出现在画布右侧之外（用于粒子飞出左边界后的重生，从右侧重新进入）。
 */
function createSpark(width: number, height: number, startInView: boolean): SparkParticle {
  // 粒子只在画布中下部（48%~84% 高度）的条带内生成，形成一条“光流”视觉效果。
  const streamY = height * (0.48 + Math.random() * 0.36);

  return {
    x: startInView ? Math.random() * width : width + Math.random() * 140,
    y: streamY,
    originY: streamY,
    radius: 1.2 + Math.random() * 2.4,
    speed: 18 + Math.random() * 26,
    wave: 8 + Math.random() * 24,
    phase: Math.random() * Math.PI * 2,
    alpha: 0.28 + Math.random() * 0.42,
    twinkle: 0.0012 + Math.random() * 0.002,
  };
}

/** 预渲染一张 72×72 的径向渐变光点贴图（白心 → 蓝色 → 透明），供每帧 drawImage 复用，避免逐帧重建渐变。 */
function createParticleSprite() {
  const sprite = document.createElement("canvas");
  const size = 72;
  const center = size / 2;
  sprite.width = size;
  sprite.height = size;

  const context = sprite.getContext("2d");
  if (!context) return undefined;

  const gradient = context.createRadialGradient(center, center, 0, center, center, center);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.16, "rgba(176,214,255,0.92)");
  gradient.addColorStop(0.5, "rgba(0,102,255,0.34)");
  gradient.addColorStop(1, "rgba(0,102,255,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  return sprite;
}

/**
 * 按容器实际显示尺寸重新设置 Canvas 的物理像素尺寸（结合 devicePixelRatio），
 * 并在尺寸真正变化时重新生成粒子数组。返回 true 表示发生了实际的尺寸变更。
 */
function resizeParticleCanvas() {
  const canvas = particleCanvas.value;
  if (!canvas) return false;

  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));
  // 窄屏限制到 1.25x，宽屏限制到 1.5x，避免高 DPR 设备上 Canvas 像素过多影响性能。
  const dprLimit = width < 768 ? 1.25 : 1.5;
  const dpr = Math.min(window.devicePixelRatio || 1, dprLimit);
  const pixelWidth = Math.floor(width * dpr);
  const pixelHeight = Math.floor(height * dpr);

  // 尺寸未变化时提前返回，避免不必要地清空重建粒子。
  if (
    particleCanvasState &&
    canvas.width === pixelWidth &&
    canvas.height === pixelHeight &&
    particleCanvasState.width === width &&
    particleCanvasState.height === height
  ) {
    return false;
  }

  canvas.width = pixelWidth;
  canvas.height = pixelHeight;

  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return false;

  // 用 dpr 缩放绘图上下文，后续所有绘制坐标仍可用 CSS 像素单位书写。
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  particleCanvasState = { context, width, height, dpr };

  // 粒子数量随画布宽度自适应，限制在 30~72 个之间。
  const particleCount = Math.min(72, Math.max(30, Math.round(width / 22)));
  particles = Array.from({ length: particleCount }, () => createSpark(width, height, true));

  return true;
}

/**
 * 绘制一帧粒子：更新每个粒子的位置（水平漂移 + 正弦波动）与透明度（闪烁），并用叠加混合模式绘制光点贴图。
 * @param time 当前时间戳（来自 requestAnimationFrame）。
 * @param delta 距上一帧的秒数；为 0 时表示只重绘不更新位置（用于 resize 后的静态重绘）。
 */
function paintParticles(time: number, delta: number) {
  const state = particleCanvasState;
  const sprite = particleSprite;
  if (!state || !sprite) return;

  const { context, width, height } = state;
  context.clearRect(0, 0, width, height);
  context.save();
  // "lighter" 混合模式让重叠的光点自然叠加变亮，形成光流交汇处更亮的效果。
  context.globalCompositeOperation = "lighter";

  for (const particle of particles) {
    if (delta > 0) {
      particle.x -= particle.speed * delta;
      // y 坐标 = 基准高度 + 两层正弦波叠加（慢速大幅度 + 随水平位置变化的快速小幅度），形成自然的波浪飘动感。
      particle.y =
        particle.originY +
        Math.sin(time * 0.0008 + particle.phase) * particle.wave +
        Math.sin((particle.x + time * 0.026) * 0.011 + particle.phase) * 7;

      // 粒子飘出画布左侧后，在右侧外部重新生成一个新粒子，形成无限循环的光流。
      if (particle.x < -44) {
        Object.assign(particle, createSpark(width, height, false));
      }
    }

    // 闪烁效果：透明度在 0.32~1.0 之间按各自频率正弦波动。
    const shimmer = 0.66 + Math.sin(time * particle.twinkle + particle.phase) * 0.34;
    const spriteSize = particle.radius * 13;
    context.globalAlpha = particle.alpha * shimmer;
    context.drawImage(
      sprite,
      particle.x - spriteSize / 2,
      particle.y - spriteSize / 2,
      spriteSize,
      spriteSize,
    );
  }

  context.restore();
}

/** requestAnimationFrame 循环体：按 particleFrameInterval 节流到约 45fps，并在不可见/不应动画时自动停止循环。 */
function renderParticleFlow(time: number) {
  if (!particleShouldAnimate || !particleIsVisible || document.hidden) {
    particleFrame = undefined;
    particleLastTime = 0;
    return;
  }

  if (!particleLastTime || time - particleLastTime >= particleFrameInterval) {
    const delta = particleLastTime ? Math.min(0.05, (time - particleLastTime) / 1000) : 0;
    particleLastTime = time;
    paintParticles(time, delta);
  }

  particleFrame = window.requestAnimationFrame(renderParticleFlow);
}

/**
 * 根据“是否应该动画 / 是否在视口内 / 页面是否隐藏”三个条件的当前组合，
 * 启动或停止 requestAnimationFrame 循环。由滚动可见性、页面可见性等多个来源共同调用。
 */
function syncParticleAnimation() {
  const canAnimate = particleShouldAnimate && particleIsVisible && !document.hidden;

  if (canAnimate && particleFrame === undefined) {
    particleLastTime = 0;
    particleFrame = window.requestAnimationFrame(renderParticleFlow);
    return;
  }

  if (!canAnimate && particleFrame !== undefined) {
    window.cancelAnimationFrame(particleFrame);
    particleFrame = undefined;
    particleLastTime = 0;
  }
}

/** 浏览器标签页切到后台/切回前台时触发，用于暂停或恢复粒子动画，节省电量。 */
function handleDocumentVisibility() {
  syncParticleAnimation();
}

/**
 * 初始化粒子系统：生成精灵图、首次绘制、注册尺寸变化（ResizeObserver）和
 * 可见性变化（IntersectionObserver + visibilitychange）监听。
 * @param animate 是否允许播放动画（减少动态效果模式下传 false，只绘制静态首帧）。
 */
function startParticleFlow(animate: boolean) {
  if (!particleCanvas.value || !hero.value) return;

  particleShouldAnimate = animate;
  particleSprite = createParticleSprite();
  resizeParticleCanvas();
  paintParticles(0, 0);

  // Canvas 容器尺寸变化（如窗口缩放、响应式断点切换）时重新计算像素尺寸并重绘一帧。
  particleResizeObserver = new ResizeObserver(() => {
    if (particleResizeFrame !== undefined) window.cancelAnimationFrame(particleResizeFrame);
    particleResizeFrame = window.requestAnimationFrame(() => {
      particleResizeFrame = undefined;
      resizeParticleCanvas();
      paintParticles(performance.now(), 0);
    });
  });
  particleResizeObserver.observe(particleCanvas.value);

  // Hero 区块滚出视口（含 80px 缓冲）时暂停动画循环，避免不可见时仍消耗性能。
  particleVisibilityObserver = new IntersectionObserver(
    ([entry]) => {
      particleIsVisible = entry?.isIntersecting ?? true;
      syncParticleAnimation();
    },
    { rootMargin: "80px 0px" },
  );
  particleVisibilityObserver.observe(hero.value);

  document.addEventListener("visibilitychange", handleDocumentVisibility);
  syncParticleAnimation();
}

/** 停止并彻底清理粒子系统的所有监听器、动画帧与状态，组件卸载时调用。 */
function stopParticleFlow() {
  if (particleFrame !== undefined) window.cancelAnimationFrame(particleFrame);
  if (particleResizeFrame !== undefined) window.cancelAnimationFrame(particleResizeFrame);

  particleFrame = undefined;
  particleResizeFrame = undefined;
  particleResizeObserver?.disconnect();
  particleResizeObserver = undefined;
  particleVisibilityObserver?.disconnect();
  particleVisibilityObserver = undefined;
  document.removeEventListener("visibilitychange", handleDocumentVisibility);
  particleCanvasState = undefined;
  particleSprite = undefined;
  particles = [];
}

/**
 * 入场动画的收尾处理：无论正常播放完成还是超时兜底触发，都统一在这里
 * 立即完成打字机效果，并清除 GSAP 为动画设置的内联样式（willChange/transform/opacity/visibility），
 * 让元素回到样式表定义的最终状态，避免长期占用合成层。
 */
function finalizeHeroEntrance() {
  if (heroFallbackTimer !== undefined) window.clearTimeout(heroFallbackTimer);
  heroFallbackTimer = undefined;
  finishTypewriter();

  gsap.set(
    [
      ".hero-background-art",
      ".hero-particles",
      ".hero-kicker",
      ".hero-title-text",
      ".hero-body",
      ".hero-scroll-cue",
    ],
    { clearProps: "willChange,transform,opacity,visibility" },
  );
}

onMounted(() => {
  if (!hero.value) return;

  updateScrollCueVisibility();
  window.addEventListener("scroll", updateScrollCueVisibility, { passive: true });

  ctx = gsap.context(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    startParticleFlow(!reduceMotion);

    if (reduceMotion) {
      // 减少动态效果：跳过入场时间线，直接展示最终状态（含完整标题文字）。
      finalizeHeroEntrance();
      return;
    }

    const animatedElements = [
      ".hero-background-art",
      ".hero-particles",
      ".hero-kicker",
      ".hero-title-text",
      ".hero-body",
      ".hero-scroll-cue",
    ];
    gsap.set(animatedElements, { willChange: "transform,opacity" });

    // 首屏入场时间线：背景水印缩放淡入、粒子层横向展开、标签/标题/正文/滚动提示依次错开淡入上移。
    const timeline = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: finalizeHeroEntrance,
    });

    timeline
      .fromTo(
        ".hero-background-art",
        { autoAlpha: 0, scale: 0.94 },
        { autoAlpha: 1, scale: 1, duration: 1.12 },
        0,
      )
      .fromTo(
        ".hero-particles",
        { autoAlpha: 0, scaleX: 0.96, transformOrigin: "right center" },
        { autoAlpha: 1, scaleX: 1, duration: 0.84 },
        0,
      )
      .fromTo(
        ".hero-kicker",
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.48 },
        0.12,
      )
      // 时间线进行到 0.86s 时启动打字机效果，与标题容器淡入时机（0.84s）基本同步。
      .add(startTypewriter, 0.86)
      .fromTo(
        ".hero-title-text",
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: 0.76 },
        0.84,
      )
      .fromTo(
        ".hero-body",
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 0.68 },
        1.12,
      )
      .fromTo(
        ".hero-scroll-cue",
        { autoAlpha: 0, y: -10 },
        { autoAlpha: 1, y: 0, duration: 0.48 },
        1.34,
      );

    // 兜底定时器：若因某些原因 onComplete 未按预期触发（如时间线被中断），3.2s 后强制收尾，
    // 保证标题文字和交互元素最终一定会以完整可用状态呈现。
    heroFallbackTimer = window.setTimeout(finalizeHeroEntrance, 3200);
  }, hero.value);
});

onUnmounted(() => {
  if (titleTimer !== undefined) window.clearTimeout(titleTimer);
  if (heroFallbackTimer !== undefined) window.clearTimeout(heroFallbackTimer);
  window.removeEventListener("scroll", updateScrollCueVisibility);
  stopParticleFlow();
  ctx?.revert();
});
</script>

<template>
  <section ref="hero" class="relative min-h-[100svh] overflow-hidden bg-white" aria-labelledby="hero-title">
    <!-- 背景装饰层：右侧/居中大 Logo 水印 + 粒子流动 Canvas，均为纯装饰，不参与交互（pointer-events-none）。 -->
    <div class="hero-ribbon pointer-events-none absolute inset-0 z-0 bg-white" aria-hidden="true">
      <div
        class="absolute inset-0 flex items-center justify-center px-5 sm:px-10 lg:justify-end lg:px-0"
      >
        <div
          class="hero-background-art w-[88vw] max-w-[42rem] sm:w-[78vw] md:w-[68vw] lg:h-[100svh] lg:w-auto lg:max-w-none lg:translate-x-[8svh]"
        >
          <img
            class="h-auto w-full max-w-full object-contain opacity-[0.07] sm:opacity-[0.09] lg:h-full lg:w-auto lg:max-w-none lg:opacity-[0.12]"
            :src="logoSrc"
            alt=""
            width="500"
            height="500"
            decoding="async"
            fetchpriority="high"
          />
        </div>
      </div>

      <canvas ref="particleCanvas" class="hero-particles absolute inset-0 z-10 h-full w-full opacity-80" />
    </div>

    <div class="lab-container relative z-10 flex min-h-[100svh] items-center pb-16 pt-32 sm:pb-20 sm:pt-36">
      <div class="grid w-full items-center lg:grid-cols-[minmax(0,0.95fr)_minmax(18rem,0.55fr)] lg:gap-12">
        <div class="hero-copy max-w-4xl py-8 sm:py-12">
          <div
            class="hero-kicker mb-8 inline-flex items-center rounded-full border border-lab-border bg-white/[0.92] px-4 py-2 shadow-sm backdrop-blur-sm"
          >
            <span class="font-mono text-xs uppercase tracking-[0.12em] text-lab-muted">Async Lab · Since 2013</span>
          </div>

          <!--
            打字机标题的无障碍处理：
            - sr-only 的 span 放置完整标题文字，供屏幕阅读器直接读出；
            - aria-hidden 的可视部分先用 invisible 占位撑开完整宽度的空间（避免逐字打出时布局抖动），
              再用绝对定位叠加实际显示的 typedText + 闪烁光标。
          -->
          <h1
            id="hero-title"
            class="hero-title-text max-w-4xl font-display text-5xl font-semibold leading-[1.08] tracking-[-0.035em] text-lab-text sm:text-6xl md:text-7xl lg:text-[5.5rem]"
          >
            <span class="sr-only">{{ title }}</span>
            <span class="relative block" aria-hidden="true">
              <span class="invisible block">{{ title }}</span>
              <span class="absolute inset-0 block">
                <span ref="typedText" />
                <span
                  ref="typingCaret"
                  class="ml-1 inline-block h-[0.82em] w-1 translate-y-1 bg-lab-primary align-middle animate-caret"
                />
              </span>
            </span>
          </h1>

          <div class="hero-body max-w-2xl">
            <p class="mt-8 text-base leading-8 text-lab-muted md:text-lg md:leading-9">
              连接前端、后端、移动端与嵌入式技术，用工程能力把想法推进到真实可用的产品和系统。
            </p>

            <div class="mt-10 flex flex-col gap-4 sm:flex-row">
              <BaseButton as="RouterLink" to="/#about" size="lg">
                了解实验室
                <ArrowRight class="h-4 w-4" aria-hidden="true" />
              </BaseButton>
              <BaseButton as="RouterLink" to="/join" variant="secondary" size="lg">
                加入我们
              </BaseButton>
            </div>
          </div>
        </div>

        <div class="hidden lg:block" aria-hidden="true" />
      </div>
    </div>

    <!-- 右下角“继续滚动”提示按钮；滚动超过 64px 后通过 .has-left-hero 淡出（见下方 scoped 样式）。 -->
    <RouterLink
      to="/#about"
      class="hero-scroll-cue absolute bottom-6 right-4 z-20 grid h-12 w-12 cursor-pointer place-items-center rounded-full border border-lab-border bg-white/[0.92] text-lab-text shadow-sm backdrop-blur-sm transition-[color,border-color,transform] duration-200 hover:-translate-y-1 hover:border-lab-primary hover:text-lab-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-lab-primary sm:right-6 lg:right-8"
      aria-label="浏览下一部分"
    >
      <ArrowDown class="h-5 w-5" aria-hidden="true" />
    </RouterLink>
  </section>
</template>

<style scoped>
.has-left-hero .hero-scroll-cue {
  pointer-events: none;
  opacity: 0;
  transform: translateY(-0.5rem);
}
</style>

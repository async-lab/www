<script setup lang="ts">
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

type SparkParticle = {
  x: number;
  y: number;
  originY: number;
  radius: number;
  speed: number;
  wave: number;
  phase: number;
  alpha: number;
  twinkle: number;
};

type ParticleCanvasState = {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  dpr: number;
};

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
let particleSprite: HTMLCanvasElement | undefined;
let particles: SparkParticle[] = [];
let ctx: ReturnType<typeof gsap.context> | undefined;
let scrollCueHidden = false;

function updateScrollCueVisibility() {
  const shouldHide = window.scrollY > 64;
  if (scrollCueHidden === shouldHide) return;

  scrollCueHidden = shouldHide;
  hero.value?.classList.toggle("has-left-hero", shouldHide);
}

function hideTypingCaret() {
  if (!typingCaret.value) return;

  typingCaret.value.style.animation = "none";
  typingCaret.value.style.opacity = "0";
}

function finishTypewriter() {
  if (titleTimer !== undefined) window.clearTimeout(titleTimer);
  titleTimer = undefined;

  if (typedText.value) typedText.value.textContent = title;
  hideTypingCaret();
}

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

function createSpark(width: number, height: number, startInView: boolean): SparkParticle {
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

function resizeParticleCanvas() {
  const canvas = particleCanvas.value;
  if (!canvas) return false;

  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));
  const dprLimit = width < 768 ? 1.25 : 1.5;
  const dpr = Math.min(window.devicePixelRatio || 1, dprLimit);
  const pixelWidth = Math.floor(width * dpr);
  const pixelHeight = Math.floor(height * dpr);

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

  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  particleCanvasState = { context, width, height, dpr };

  const particleCount = Math.min(72, Math.max(30, Math.round(width / 22)));
  particles = Array.from({ length: particleCount }, () => createSpark(width, height, true));

  return true;
}

function paintParticles(time: number, delta: number) {
  const state = particleCanvasState;
  const sprite = particleSprite;
  if (!state || !sprite) return;

  const { context, width, height } = state;
  context.clearRect(0, 0, width, height);
  context.save();
  context.globalCompositeOperation = "lighter";

  for (const particle of particles) {
    if (delta > 0) {
      particle.x -= particle.speed * delta;
      particle.y =
        particle.originY +
        Math.sin(time * 0.0008 + particle.phase) * particle.wave +
        Math.sin((particle.x + time * 0.026) * 0.011 + particle.phase) * 7;

      if (particle.x < -44) {
        Object.assign(particle, createSpark(width, height, false));
      }
    }

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

function handleDocumentVisibility() {
  syncParticleAnimation();
}

function startParticleFlow(animate: boolean) {
  if (!particleCanvas.value || !hero.value) return;

  particleShouldAnimate = animate;
  particleSprite = createParticleSprite();
  resizeParticleCanvas();
  paintParticles(0, 0);

  particleResizeObserver = new ResizeObserver(() => {
    if (particleResizeFrame !== undefined) window.cancelAnimationFrame(particleResizeFrame);
    particleResizeFrame = window.requestAnimationFrame(() => {
      particleResizeFrame = undefined;
      resizeParticleCanvas();
      paintParticles(performance.now(), 0);
    });
  });
  particleResizeObserver.observe(particleCanvas.value);

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

function finalizeHeroEntrance() {
  if (heroFallbackTimer !== undefined) window.clearTimeout(heroFallbackTimer);
  heroFallbackTimer = undefined;
  finishTypewriter();

  gsap.set(
    [
      ".hero-ribbon",
      ".hero-kicker",
      ".hero-title-text",
      ".hero-logo",
      ".hero-body",
      ".hero-scroll-cue",
    ],
    { autoAlpha: 1, x: 0, y: 0, scale: 1 },
  );
  gsap.set(
    [
      ".hero-ribbon",
      ".hero-kicker",
      ".hero-title-text",
      ".hero-logo",
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
      finalizeHeroEntrance();
      return;
    }

    const animatedElements = [
      ".hero-ribbon",
      ".hero-kicker",
      ".hero-title-text",
      ".hero-logo",
      ".hero-body",
      ".hero-scroll-cue",
    ];
    gsap.set(animatedElements, { willChange: "transform,opacity" });

    const timeline = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: finalizeHeroEntrance,
    });

    timeline
      .fromTo(
        ".hero-ribbon",
        { autoAlpha: 0, scaleX: 0.96, transformOrigin: "right center" },
        { autoAlpha: 1, scaleX: 1, duration: 0.84 },
        0,
      )
      .fromTo(
        ".hero-kicker",
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.48 },
        0.08,
      )
      .add(startTypewriter, 0.18)
      .fromTo(
        ".hero-title-text",
        { autoAlpha: 0, y: 26 },
        { autoAlpha: 1, y: 0, duration: 0.72 },
        0.14,
      )
      .fromTo(
        ".hero-logo",
        { autoAlpha: 0, x: 24, y: -10, scale: 0.96 },
        { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.72 },
        0.22,
      )
      .fromTo(
        ".hero-body",
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 0.68 },
        0.46,
      )
      .fromTo(
        ".hero-scroll-cue",
        { autoAlpha: 0, y: -10 },
        { autoAlpha: 1, y: 0, duration: 0.48 },
        0.72,
      );

    heroFallbackTimer = window.setTimeout(finalizeHeroEntrance, 2400);
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
  <section
    ref="hero"
    class="relative min-h-[calc(100svh-2rem)] overflow-hidden border-b border-lab-border bg-white pt-28"
    aria-labelledby="hero-title"
  >
    <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#ffffff_56%,#f5f5f7_100%)]" />
    <div class="pointer-events-none absolute inset-x-0 top-[42%] h-px bg-lab-border/60" aria-hidden="true" />
    <div
      class="pointer-events-none absolute bottom-0 right-[16%] top-28 hidden w-px bg-lab-border/60 lg:block"
      aria-hidden="true"
    />

    <div class="hero-ribbon pointer-events-none absolute inset-0" aria-hidden="true">
      <canvas ref="particleCanvas" class="absolute inset-0 h-full w-full opacity-80" />
    </div>

    <div class="lab-container relative z-10 flex min-h-[calc(100svh-9rem)] items-center">
      <div class="hero-copy w-full max-w-6xl pb-24 pt-12 sm:pb-28">
        <div
          class="hero-kicker mb-8 inline-flex items-center rounded-full border border-lab-border bg-white/90 px-4 py-2 backdrop-blur-sm"
        >
          <span class="font-mono text-xs uppercase text-lab-muted">Async Lab · Since 2013</span>
        </div>

        <div
          class="hero-title-lockup grid w-full grid-cols-1 items-start gap-7 md:grid-cols-[minmax(0,4fr)_minmax(10rem,1fr)] md:items-center md:gap-12"
        >
          <h1
            id="hero-title"
            class="hero-title-text order-2 min-w-0 font-display text-5xl font-semibold leading-tight text-lab-text sm:text-6xl md:order-1 md:text-7xl lg:text-8xl"
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

          <img
            class="hero-logo order-1 aspect-square w-24 shrink-0 justify-self-start object-contain drop-shadow-[0_18px_32px_rgba(0,102,255,0.12)] md:order-2 md:w-full md:max-w-[220px] md:justify-self-end"
            :src="logoSrc"
            alt="异步开发实验室 Logo"
            width="500"
            height="500"
            decoding="async"
            fetchpriority="high"
          />
        </div>

        <div class="hero-body">
          <p class="mt-8 max-w-2xl text-base leading-8 text-lab-muted md:text-xl md:leading-9">
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
    </div>

    <RouterLink
      to="/#about"
      class="hero-scroll-cue absolute bottom-6 right-4 z-20 grid h-12 w-12 cursor-pointer place-items-center rounded-full border border-lab-border bg-white/90 text-lab-text shadow-sm backdrop-blur-sm transition-[color,border-color,transform] duration-200 hover:-translate-y-1 hover:border-lab-primary hover:text-lab-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-lab-primary sm:right-6 lg:right-8"
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

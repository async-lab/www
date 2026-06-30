<script setup lang="ts">
import { ArrowRight } from "@lucide/vue";
import { onMounted, onUnmounted, ref } from "vue";

import BaseButton from "@/components/ui/BaseButton.vue";
import { gsap } from "@/lib/gsap";

const hero = ref<HTMLElement | null>(null);
const particleCanvas = ref<HTMLCanvasElement | null>(null);
const title = "异步开发实验室";
const typedTitle = ref("");
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

let titleTimer: number | undefined;
let particleFrame: number | undefined;
let particleResizeObserver: ResizeObserver | undefined;
let particleLastTime = 0;
let particles: SparkParticle[] = [];
let ctx: ReturnType<typeof gsap.context> | undefined;

function startTypewriter() {
  if (titleTimer) window.clearInterval(titleTimer);

  let index = 0;
  typedTitle.value = "";

  titleTimer = window.setInterval(() => {
    typedTitle.value = title.slice(0, index + 1);
    index += 1;

    if (index >= title.length && titleTimer) {
      window.clearInterval(titleTimer);
      titleTimer = undefined;
    }
  }, 250);
}

function createSpark(width: number, height: number, startInView: boolean): SparkParticle {
  const streamY = height * (0.56 + Math.random() * 0.28);

  return {
    x: startInView ? Math.random() * width : width + Math.random() * 180,
    y: streamY,
    originY: streamY,
    radius: 1.2 + Math.random() * 2.8,
    speed: 14 + Math.random() * 28,
    wave: 10 + Math.random() * 30,
    phase: Math.random() * Math.PI * 2,
    alpha: 0.32 + Math.random() * 0.46,
    twinkle: 0.0012 + Math.random() * 0.0022,
  };
}

function resizeParticleCanvas() {
  const canvas = particleCanvas.value;
  if (!canvas) return undefined;

  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, rect.width);
  const height = Math.max(1, rect.height);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const pixelWidth = Math.floor(width * dpr);
  const pixelHeight = Math.floor(height * dpr);
  const resized = canvas.width !== pixelWidth || canvas.height !== pixelHeight;

  if (resized) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
    particles = Array.from(
      { length: Math.min(120, Math.max(56, Math.floor(width / 14))) },
      () => createSpark(width, height, true),
    );
  }

  const context = canvas.getContext("2d");
  context?.setTransform(dpr, 0, 0, dpr, 0, 0);

  return { context, width, height };
}

function paintParticles(time: number, delta: number) {
  const setup = resizeParticleCanvas();
  if (!setup?.context) return;

  const { context, width, height } = setup;
  context.clearRect(0, 0, width, height);
  context.globalCompositeOperation = "lighter";

  particles.forEach((particle) => {
    if (delta > 0) {
      particle.x -= particle.speed * delta;
      particle.y =
        particle.originY +
        Math.sin(time * 0.0009 + particle.phase) * particle.wave +
        Math.sin((particle.x + time * 0.03) * 0.012 + particle.phase) * 8;

      if (particle.x < -48) {
        Object.assign(particle, createSpark(width, height, false));
      }
    }

    const shimmer = 0.62 + Math.sin(time * particle.twinkle + particle.phase) * 0.38;
    const alpha = particle.alpha * shimmer;
    const glowRadius = particle.radius * 7.5;
    const gradient = context.createRadialGradient(
      particle.x,
      particle.y,
      0,
      particle.x,
      particle.y,
      glowRadius,
    );

    gradient.addColorStop(0, `rgba(255,255,255,${Math.min(1, alpha + 0.24)})`);
    gradient.addColorStop(0.22, `rgba(176,214,255,${alpha})`);
    gradient.addColorStop(0.55, `rgba(0,102,255,${alpha * 0.4})`);
    gradient.addColorStop(1, "rgba(0,102,255,0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(particle.x, particle.y, glowRadius, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = `rgba(255,255,255,${Math.min(0.95, alpha + 0.18)})`;
    context.beginPath();
    context.arc(particle.x, particle.y, Math.max(0.7, particle.radius * 0.42), 0, Math.PI * 2);
    context.fill();
  });

  context.globalCompositeOperation = "source-over";
}

function renderParticleFlow(time: number) {
  const delta = particleLastTime ? Math.min(0.05, (time - particleLastTime) / 1000) : 0;
  particleLastTime = time;
  paintParticles(time, delta);
  particleFrame = window.requestAnimationFrame(renderParticleFlow);
}

function startParticleFlow(animate: boolean) {
  if (!particleCanvas.value) return;

  particleLastTime = 0;
  paintParticles(0, 0);

  particleResizeObserver = new ResizeObserver(() => {
    paintParticles(performance.now(), 0);
  });
  particleResizeObserver.observe(particleCanvas.value);

  if (animate) {
    particleFrame = window.requestAnimationFrame(renderParticleFlow);
  }
}

function stopParticleFlow() {
  if (particleFrame) window.cancelAnimationFrame(particleFrame);
  particleFrame = undefined;
  particleResizeObserver?.disconnect();
  particleResizeObserver = undefined;
  particles = [];
}

onMounted(() => {
  if (!hero.value) return;

  ctx = gsap.context(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    startParticleFlow(!reduceMotion);

    if (reduceMotion) {
      typedTitle.value = title;
      gsap.set(
        [".hero-ribbon", ".hero-kicker", ".hero-title-text", ".hero-logo", ".hero-body"],
        { autoAlpha: 1 },
      );
      return;
    }

    const timeline = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
    });
    timeline
      .fromTo(
        ".hero-ribbon",
        {
          autoAlpha: 0,
          clipPath: "inset(0 0 0 72%)",
        },
        {
          autoAlpha: 1,
          clipPath: "inset(0 0 0 0%)",
          duration: 1.25,
        },
      )
      .add(startTypewriter)
      .fromTo(
        ".hero-title-text",
        {
          autoAlpha: 0,
          y: 28,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.72,
        },
      )
      .fromTo(
        ".hero-logo",
        {
          autoAlpha: 0,
          x: 24,
          y: -12,
          scale: 0.96,
        },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.72,
        },
        "<0.12",
      )
      .fromTo(
        ".hero-kicker",
        {
          autoAlpha: 0,
          y: 16,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.56,
        },
        "-=0.4",
      )
      .fromTo(
        ".hero-body",
        {
          autoAlpha: 0,
          y: 24,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
        },
        "-=0.28",
      );
  }, hero.value);
});

onUnmounted(() => {
  if (titleTimer) window.clearInterval(titleTimer);
  stopParticleFlow();
  ctx?.revert();
});
</script>

<template>
  <section
    ref="hero"
    class="relative min-h-[100svh] overflow-hidden bg-white pt-28"
    aria-labelledby="hero-title"
  >
    <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#ffffff_58%,#f5f5f7_100%)]" />

    <div class="hero-ribbon pointer-events-none absolute inset-0" aria-hidden="true">
      <canvas
        ref="particleCanvas"
        class="absolute inset-0 h-full w-full opacity-90"
      />
    </div>

    <div
      class="lab-container relative z-10 flex min-h-[calc(100svh-7rem)] items-center"
    >
      <div class="hero-copy w-full max-w-6xl pb-32 pt-16">
        <div
          class="hero-kicker mb-8 inline-flex items-center rounded-full border border-lab-border bg-white px-4 py-2"
        >
          <span class="font-mono text-xs uppercase text-lab-muted"
            >Development Lab · Code the Future</span
          >
        </div>

        <div class="hero-title-lockup grid w-full grid-cols-1 items-start gap-6 md:grid-cols-[minmax(0,4fr)_minmax(0,1fr)] md:items-center md:gap-10">
          <h1
            id="hero-title"
            class="hero-title-text order-2 min-w-0 font-display text-5xl font-semibold leading-tight text-lab-text md:order-1 md:text-7xl lg:text-8xl"
          >
            {{ typedTitle }}
            <span
              class="inline-block h-[0.9em] w-1 translate-y-2 bg-lab-primary align-middle animate-caret"
              aria-hidden="true"
            />
          </h1>
          <img
            class="hero-logo order-1 aspect-square w-1/5 shrink-0 justify-self-start object-contain md:order-2 md:w-full md:justify-self-end"
            :src="logoSrc"
            alt="异步开发实验室 Logo"
            decoding="async"
          />
        </div>

        <div class="hero-body">
          <p
            class="mt-8 max-w-2xl text-base leading-8 text-lab-muted md:text-xl md:leading-9"
          >
            连接前端、后端、移动端与嵌入式技术，用工程能力把想法推进到真实可用的产品和系统。
          </p>

          <div class="mt-12 flex flex-col gap-4 sm:flex-row">
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
  </section>
</template>

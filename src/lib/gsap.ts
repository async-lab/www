// GSAP 动画库的统一封装入口：全站禁止直接从 "gsap" 导入，一律从这里导入 gsap / ScrollTrigger /
// ScrollSmoother，保证插件只注册一次，并集中管理平滑滚动容器（ScrollSmoother）的生命周期。
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let configured = false;
let smoother: ReturnType<typeof ScrollSmoother.create> | undefined;

/**
 * 注册 ScrollTrigger / ScrollSmoother 插件并设置全局动画默认时长/缓动。
 * 由 main.ts 在应用挂载前调用一次；configured 标记避免热更新等场景下重复注册插件。
 */
export function setupGsap() {
  if (configured) return;

  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
  gsap.defaults({
    duration: 0.7,
    ease: "power3.out",
  });

  configured = true;
}

/**
 * 创建（或重建）全局 ScrollSmoother 实例，由 App.vue 在挂载时调用。
 * 仅在“非减少动态效果”且“非移动端窄屏（<768px）”时启用平滑滚动；
 * 否则保持浏览器原生滚动行为，并移除 <html> 上的 has-smooth-scroll 标记类（供全局样式判断）。
 */
export function setupScrollSmoother() {
  if (typeof window === "undefined") return undefined;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isCompactViewport = window.matchMedia("(max-width: 767px)").matches;
  if (reduceMotion || isCompactViewport) {
    document.documentElement.classList.remove("has-smooth-scroll");
    return undefined;
  }

  // 先杀掉可能已存在的旧实例（例如窗口尺寸跨越断点后重新调用），避免重复绑定。
  smoother?.kill();
  smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 0.82,
    smoothTouch: 0,
  });
  document.documentElement.classList.add("has-smooth-scroll");

  return smoother;
}

/** 获取当前全局 ScrollSmoother 实例；未启用时返回 undefined，调用方需自行降级为原生滚动。 */
export function getScrollSmoother() {
  return smoother;
}

/** 销毁全局 ScrollSmoother 实例，由 App.vue 在卸载时调用，防止内存泄漏和残留的滚动监听。 */
export function killScrollSmoother() {
  smoother?.kill();
  smoother = undefined;
  if (typeof document !== "undefined") {
    document.documentElement.classList.remove("has-smooth-scroll");
  }
}

export { gsap, ScrollSmoother, ScrollTrigger };

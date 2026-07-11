import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let configured = false;
let smoother: ReturnType<typeof ScrollSmoother.create> | undefined;

export function setupGsap() {
  if (configured) return;

  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
  gsap.defaults({
    duration: 0.7,
    ease: "power3.out",
  });

  configured = true;
}

export function setupScrollSmoother() {
  if (typeof window === "undefined") return undefined;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isCompactViewport = window.matchMedia("(max-width: 767px)").matches;
  if (reduceMotion || isCompactViewport) {
    document.documentElement.classList.remove("has-smooth-scroll");
    return undefined;
  }

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

export function getScrollSmoother() {
  return smoother;
}

export function killScrollSmoother() {
  smoother?.kill();
  smoother = undefined;
  if (typeof document !== "undefined") {
    document.documentElement.classList.remove("has-smooth-scroll");
  }
}

export { gsap, ScrollSmoother, ScrollTrigger };

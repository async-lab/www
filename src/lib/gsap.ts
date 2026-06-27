import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let configured = false;

export function setupGsap() {
  if (configured) return;

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({
    duration: 0.7,
    ease: "power3.out",
  });

  configured = true;
}

export { gsap, ScrollTrigger };

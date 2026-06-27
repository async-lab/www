import { Code2, Cpu, Server, Smartphone } from "@lucide/vue";
import type { Component } from "vue";

export interface ResearchDirection {
  id: "frontend" | "backend" | "mobile" | "embedded";
  title: string;
  subtitle: string;
  summary: string;
  color: string;
  icon: Component;
  stacks: string[];
  topics: string[];
}

export const researchDirections: ResearchDirection[] = [
  {
    id: "frontend",
    title: "前端开发",
    subtitle: "Frontend Development",
    summary: "聚焦现代 Web 应用、跨平台小程序、性能优化和工程化体系。",
    color: "#00D4FF",
    icon: Code2,
    stacks: ["Vue", "Nuxt", "Vite", "小程序"],
    topics: ["Web 应用", "跨平台小程序", "性能优化", "现代 UI/UX"],
  },
  {
    id: "backend",
    title: "后端开发",
    subtitle: "Backend Development",
    summary: "构建稳定的服务端系统，覆盖微服务、分布式、数据库与 DevOps。",
    color: "#00FF88",
    icon: Server,
    stacks: ["Node.js", "Java", "Python", "DevOps"],
    topics: ["微服务架构", "分布式系统", "数据库优化", "云原生实践"],
  },
  {
    id: "mobile",
    title: "移动端开发",
    subtitle: "Mobile Development",
    summary: "研究原生与跨平台应用开发，兼顾性能调优与用户体验设计。",
    color: "#FF00FF",
    icon: Smartphone,
    stacks: ["uni-app", "Flutter", "iOS", "Android"],
    topics: ["跨平台应用", "原生开发", "性能调优", "体验设计"],
  },
  {
    id: "embedded",
    title: "嵌入式开发",
    subtitle: "Embedded Systems",
    summary: "面向物联网、智能硬件、实时系统和边缘计算场景开展实践。",
    color: "#FFB800",
    icon: Cpu,
    stacks: ["ARM", "STM32", "FreeRTOS", "IoT"],
    topics: ["物联网", "智能硬件", "实时系统", "边缘计算"],
  },
];

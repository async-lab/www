import { fileURLToPath, URL } from "node:url";

import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    allowedHosts: ["127.0.0.1", "localhost", "192.168.1.100", "test.glqcatai.asia"],
    host: "0.0.0.0",
    port: 2778,
  },
});

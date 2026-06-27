import "./styles/globals.css";

import { createPinia } from "pinia";
import { createApp } from "vue";

import App from "./App.vue";
import { setupGsap } from "./lib/gsap";
import router from "./router";

setupGsap();

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");

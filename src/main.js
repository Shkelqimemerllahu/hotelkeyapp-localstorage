import { createApp } from "vue";
import App from "./App.vue";
import router from "../src/router/router";
// import "./assets/main.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
const app = createApp(App);
app.use(router);
app.mount("#app");

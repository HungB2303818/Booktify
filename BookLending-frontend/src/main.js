import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";

import { createNotivue } from "notivue";
import "notivue/notification.css";
import "notivue/animations.css";
import "notivue/notification-progress.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const app = createApp(App);
const notivue = createNotivue({
  position: "top-right",
  limit: 5,
  notifications: {
    global: {
      duration: 2000,
    },
  },
});

app.use(notivue);
app.use(router);
app.mount("#app");

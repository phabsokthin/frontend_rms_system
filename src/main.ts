
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./index.css";
import { createPinia } from "pinia";
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ToastPlugin from 'vue-toast-notification';    
import 'vue-toast-notification/dist/theme-bootstrap.css';


// Solid icons
import { faHome, faTable, faChartPie, faBars, faTimes } from '@fortawesome/free-solid-svg-icons'

// Add icons to library
library.add(faHome, faTable, faChartPie, faBars, faTimes)


const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(ToastPlugin);

app.use(createPinia());

app.use(router);

app.mount("#app");

import './css/tailwind.css';
import './css/global.css'
import '@fortawesome/fontawesome-free/css/all.css';
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const app = createApp(App)
app.use(Toast, {
    position: POSITION.TOP_RIGHT,
    timeout: 3000,
    closeOnClick: true,
    pauseOnHover: true,
})
app.use(createPinia())
app.use(router)

app.mount('#app')

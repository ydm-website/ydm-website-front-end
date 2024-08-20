import '@/styles/styles.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from '@/stores/AuthStore'
import Toast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-default.css';
import App from './App.vue'
import router from './router'
import YoutubeIframe from '@techassi/vue-youtube-iframe';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Toast);
app.use(YoutubeIframe);

app.mount('#app');

const authStore = useAuthStore()
const token = localStorage.getItem('token')
const user = localStorage.getItem('user')

if (token) {
    authStore.setToken(JSON.parse(token))
}

if (user) {
    authStore.setUser(JSON.parse(user))
}

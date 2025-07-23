import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VCalendar from 'v-calendar'

import App from './App.vue'
import router from './router'

// CSS를 마지막에 로드하여 우선순위 보장
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VCalendar, {})

app.mount('#app')

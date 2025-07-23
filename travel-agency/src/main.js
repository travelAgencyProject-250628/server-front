import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VCalendar from 'v-calendar'
import { createHead } from '@unhead/vue'

import App from './App.vue'
import router from './router'

// CSS를 마지막에 로드하여 우선순위 보장
import './assets/main.css'

const app = createApp(App)
const head = createHead()

app.use(createPinia())
app.use(router)
app.use(VCalendar, {})
app.use(head)

app.mount('#app')

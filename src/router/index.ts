// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/setup',
    name: 'setup',
    component: () => import('@/views/Settings.vue'),
  },
  {
    path: '/game',
    name: 'game',
    component: () => import('@/views/Game.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router

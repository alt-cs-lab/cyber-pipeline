import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProfileView from '../views/ProfileView.vue'
import DistrictView from '../views/DistrictView.vue'
import TeacherView from '../views/TeacherView.vue'
import UserView from '../views/UserView.vue'

// Stores
import { useTokenStore } from '@/stores/Token'

// Route Guard - Confirm User Is Admin
const requireAdmin = () => {
  const tokenStore = useTokenStore()
  return tokenStore.is_admin
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/teachers',
      name: 'teachers',
      component: TeacherView,
      beforeEnter: requireAdmin
    },
    {
      path: '/districts',
      name: 'districts',
      component: DistrictView,
      beforeEnter: requireAdmin
    },
    {
      path: '/users',
      name: 'users',
      component: UserView,
      beforeEnter: requireAdmin
    }
  ]
})

// Global Route Guard - User Must Log In!
router.beforeEach(async function (to) {
  if (to.name !== 'home') {
    const tokenStore = useTokenStore()
    if (!tokenStore.token) {
      await tokenStore.getToken()
    }
    if (!tokenStore.token) {
      return '/'
    }
  }
})

export default router

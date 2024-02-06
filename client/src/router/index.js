// Imports
import { createRouter, createWebHistory } from 'vue-router'

// Views
import HomeView from '../views/HomeView.vue'
import ProfileView from '../views/ProfileView.vue'
import AdminView from '../views/AdminView.vue'
import UserEditView from '../views/UserEditView.vue'
import TeacherListView from '../views/TeacherListView.vue'

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
      component: HomeView,
      // beforeEnter: async () => {
      //   const tokenStore = useTokenStore()
      //   await tokenStore.tryToken()

      //   if (tokenStore.token) {
      //     return '/queues'
      //   }
      // },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
    },
    {
      path: '/teachers',
      name: 'teachers',
      component: TeacherListView,
    },
    {
      path: '/admin',
      name: 'admin',
      // TODO add code splitting?
      component: AdminView,
      beforeEnter: requireAdmin,
    },
    {
      path: '/admin/user/:id/edit',
      name: 'admin_useredit',
      // TODO add code splitting
      component: UserEditView,
      props: true,
      beforeEnter: requireAdmin,
    },
  ],
})

// Global Route Guard - User Must Log In!
router.beforeEach(async function (to) {
  if (to.name !== 'home' && to.name !== 'about') {
    const tokenStore = useTokenStore()

    if (!tokenStore.token) {
      await tokenStore.tryToken()
    }
    if (!tokenStore.token) {
      return '/'
    }
  }
})

export default router

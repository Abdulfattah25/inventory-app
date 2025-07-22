import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Lazy load components
const Login = () => import('@/views/Login.vue')
const Dashboard = () => import('@/views/Dashboard.vue')
const Transactions = () => import('@/views/Transactions.vue')
const Products = () => import('@/views/Products.vue')
const Categories = () => import('@/views/Categories.vue')
const Reports = () => import('@/views/Reports.vue')

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      requiresAuth: false,
      title: 'Masuk',
      hideNavigation: true
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true,
      title: 'Dashboard',
      icon: 'bi-speedometer2'
    }
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: Transactions,
    meta: {
      requiresAuth: true,
      title: 'Transaksi',
      icon: 'bi-receipt'
    }
  },
  {
    path: '/products',
    name: 'Products',
    component: Products,
    meta: {
      requiresAuth: true,
      title: 'Produk',
      icon: 'bi-box-seam'
    }
  },
  {
    path: '/categories',
    name: 'Categories',
    component: Categories,
    meta: {
      requiresAuth: true,
      title: 'Kategori',
      icon: 'bi-tags'
    }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: Reports,
    meta: {
      requiresAuth: true,
      title: 'Laporan',
      icon: 'bi-graph-up'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: 'Halaman Tidak Ditemukan'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Global navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialize auth store if not already done
  if (!authStore.initialized) {
    await authStore.initialize()
  }

  // Set page title
  document.title = to.meta.title 
    ? `${to.meta.title} - Cash Flow App` 
    : 'Cash Flow App'

  // Check authentication requirements
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login if authentication required but user not authenticated
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
  } else if (to.name === 'Login' && authStore.isAuthenticated) {
    // Redirect to dashboard if user is already authenticated and trying to access login
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  // You can add analytics tracking here
  console.log(`Navigated from ${from.name} to ${to.name}`)
})

export default router

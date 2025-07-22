<template>
  <div id="app" :class="{ 'theme-dark': isDarkMode }">
    <!-- Loading Screen -->
    <div v-if="isInitializing" class="loading-screen">
      <div class="loading-content">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 text-muted">Memuat aplikasi...</p>
      </div>
    </div>

    <!-- Main App -->
    <div v-else class="app-container">
      <!-- Layout with Sidebar (for authenticated users) -->
      <Layout v-if="isAuthenticated && !$route.meta.hideNavigation">
        <router-view />
      </Layout>

      <!-- Full Screen Layout (for login, etc.) -->
      <div v-else class="full-screen-layout">
        <router-view />
      </div>
    </div>

    <!-- Global Notifications -->
    <NotificationContainer />

    <!-- Global Modals -->
    <GlobalModals />
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCategoriesStore } from '@/stores/categories'
import { useNotificationStore } from '@/stores/notifications'
import Layout from '@/components/Layout.vue'
import NotificationContainer from '@/components/NotificationContainer.vue'
import GlobalModals from '@/components/GlobalModals.vue'

export default {
  name: 'App',
  components: {
    Layout,
    NotificationContainer,
    GlobalModals
  },
  setup() {
    const authStore = useAuthStore()
    const categoriesStore = useCategoriesStore()
    const notificationStore = useNotificationStore()
    
    const isInitializing = ref(true)
    const isDarkMode = ref(false)

    const isAuthenticated = computed(() => authStore.isAuthenticated)

    const initializeApp = async () => {
      try {
        // Initialize auth
        await authStore.initialize()

        // Initialize default categories if user is authenticated
        if (authStore.isAuthenticated) {
          await categoriesStore.initializeDefaultCategories()
        }

        // Load theme preference
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme === 'dark' || 
            (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          isDarkMode.value = true
          document.documentElement.setAttribute('data-bs-theme', 'dark')
        }

      } catch (error) {
        console.error('App initialization error:', error)
        notificationStore.addNotification({
          type: 'error',
          title: 'Initialization Error',
          message: 'Terjadi kesalahan saat memuat aplikasi'
        })
      } finally {
        isInitializing.value = false
      }
    }

    const toggleTheme = () => {
      isDarkMode.value = !isDarkMode.value
      const theme = isDarkMode.value ? 'dark' : 'light'
      
      localStorage.setItem('theme', theme)
      document.documentElement.setAttribute('data-bs-theme', theme)
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        isDarkMode.value = e.matches
        document.documentElement.setAttribute('data-bs-theme', e.matches ? 'dark' : 'light')
      }
    })

    onMounted(() => {
      initializeApp()
    })

    return {
      isInitializing,
      isAuthenticated,
      isDarkMode,
      toggleTheme
    }
  }
}
</script>

<style>
/* Global Styles */
:root {
  --primary-color: #0d6efd;
  --secondary-color: #6c757d;
  --success-color: #198754;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  --info-color: #0dcaf0;
  --light-color: #f8f9fa;
  --dark-color: #212529;
  
  --sidebar-width: 250px;
  --header-height: 60px;
  
  --border-radius: 0.375rem;
  --box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  --box-shadow-lg: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  
  --transition: all 0.3s ease;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--bs-body-bg);
  color: var(--bs-body-color);
}

#app {
  min-height: 100vh;
  transition: var(--transition);
}

/* Loading Screen */
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--bs-body-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  text-align: center;
}

/* App Container */
.app-container {
  min-height: 100vh;
}

.full-screen-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--bs-primary) 0%, var(--bs-info) 100%);
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bs-gray-100);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: var(--bs-gray-400);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--bs-gray-500);
}

/* Dark theme scrollbar */
[data-bs-theme="dark"] ::-webkit-scrollbar-track {
  background: var(--bs-gray-800);
}

[data-bs-theme="dark"] ::-webkit-scrollbar-thumb {
  background: var(--bs-gray-600);
}

[data-bs-theme="dark"] ::-webkit-scrollbar-thumb:hover {
  background: var(--bs-gray-500);
}

/* Utility Classes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(-100%);
}

.slide-leave-to {
  transform: translateX(100%);
}

/* Custom Bootstrap Overrides */
.btn {
  border-radius: var(--border-radius);
  font-weight: 500;
  transition: var(--transition);
}

.card {
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  border: 1px solid var(--bs-border-color);
}

.form-control,
.form-select {
  border-radius: var(--border-radius);
  transition: var(--transition);
}

.form-control:focus,
.form-select:focus {
  box-shadow: 0 0 0 0.2rem rgba(var(--bs-primary-rgb), 0.25);
}

/* Animation Classes */
.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.shake {
  animation: shake 0.5s;
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(5px);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  :root {
    --sidebar-width: 100%;
    --header-height: 56px;
  }
}

/* Print Styles */
@media print {
  .no-print {
    display: none !important;
  }
  
  .print-break {
    page-break-after: always;
  }
  
  .print-break-inside {
    page-break-inside: avoid;
  }
}
</style>

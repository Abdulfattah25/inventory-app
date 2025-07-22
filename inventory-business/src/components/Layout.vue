<template>
  <div class="app-layout">
    <!-- Sidebar -->
    <Sidebar 
      :collapsed="sidebarCollapsed"
      :show="sidebarShow"
      @toggle="toggleSidebar"
      @close="closeSidebar"
    />

    <!-- Main Content Area -->
    <div 
      class="main-content"
      :class="{ 
        'expanded': sidebarCollapsed,
        'mobile-expanded': !sidebarShow 
      }"
    >
      <!-- Top Header -->
      <header class="header d-flex align-items-center justify-content-between px-3 px-lg-4">
        <!-- Left side - Menu toggle and breadcrumb -->
        <div class="d-flex align-items-center">
          <button
            class="btn btn-link d-lg-none p-2 me-2"
            @click="toggleSidebar"
            aria-label="Toggle sidebar"
          >
            <i class="bi bi-list fs-5"></i>
          </button>
          
          <button
            class="btn btn-link d-none d-lg-block p-2 me-3"
            @click="toggleSidebar"
            aria-label="Toggle sidebar"
          >
            <i class="bi" :class="sidebarCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'"></i>
          </button>

          <!-- Breadcrumb -->
          <nav aria-label="breadcrumb" class="d-none d-md-block">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item">
                <router-link to="/dashboard" class="text-decoration-none">
                  <i class="bi bi-house-door me-1"></i>
                  Dashboard
                </router-link>
              </li>
              <li 
                v-if="currentRoute.name !== 'Dashboard'"
                class="breadcrumb-item active"
                aria-current="page"
              >
                {{ currentRoute.meta.title }}
              </li>
            </ol>
          </nav>
        </div>

        <!-- Right side - User menu and actions -->
        <div class="d-flex align-items-center gap-2">
          <!-- Notifications -->
          <div class="dropdown">
            <button
              class="btn btn-link position-relative p-2"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="bi bi-bell fs-5"></i>
              <span 
                v-if="unreadNotifications > 0"
                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              >
                {{ unreadNotifications > 99 ? '99+' : unreadNotifications }}
              </span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end notification-dropdown">
              <li class="dropdown-header d-flex justify-content-between align-items-center">
                <span>Notifikasi</span>
                <button 
                  v-if="notifications.length > 0"
                  class="btn btn-sm btn-link p-0"
                  @click="markAllAsRead"
                >
                  Tandai semua dibaca
                </button>
              </li>
              <li><hr class="dropdown-divider"></li>
              
              <div v-if="notifications.length === 0" class="px-3 py-2 text-muted text-center">
                Tidak ada notifikasi
              </div>
              
              <li 
                v-for="notification in notifications.slice(0, 5)" 
                :key="notification.id"
                class="notification-item"
                :class="{ 'unread': !notification.read }"
              >
                <a class="dropdown-item py-2" href="#" @click.prevent="markAsRead(notification.id)">
                  <div class="d-flex">
                    <div class="flex-shrink-0 me-2">
                      <i class="bi" :class="getNotificationIcon(notification.type)"></i>
                    </div>
                    <div class="flex-grow-1">
                      <div class="fw-semibold">{{ notification.title }}</div>
                      <div class="small text-muted">{{ notification.message }}</div>
                      <div class="small text-muted">{{ formatDate(notification.createdAt) }}</div>
                    </div>
                  </div>
                </a>
              </li>
              
              <li v-if="notifications.length > 5"><hr class="dropdown-divider"></li>
              <li v-if="notifications.length > 5">
                <a class="dropdown-item text-center" href="#" @click.prevent="showAllNotifications">
                  Lihat semua notifikasi
                </a>
              </li>
            </ul>
          </div>

          <!-- Theme Toggle -->
          <button
            class="btn btn-link p-2"
            @click="toggleTheme"
            :title="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <i class="bi fs-5" :class="isDarkMode ? 'bi-sun' : 'bi-moon'"></i>
          </button>

          <!-- User Menu -->
          <div class="dropdown">
            <button
              class="btn btn-link d-flex align-items-center p-2"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <div class="user-avatar me-2">
                <img 
                  v-if="user?.avatar_url"
                  :src="user.avatar_url"
                  :alt="user.full_name || user.email"
                  class="rounded-circle"
                  width="32"
                  height="32"
                >
                <div 
                  v-else
                  class="avatar-placeholder rounded-circle d-flex align-items-center justify-content-center"
                >
                  {{ getInitials(user?.full_name || user?.email) }}
                </div>
              </div>
              <div class="d-none d-md-block text-start">
                <div class="fw-semibold">{{ user?.full_name || 'User' }}</div>
                <div class="small text-muted">{{ user?.email }}</div>
              </div>
              <i class="bi bi-chevron-down ms-2"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li class="dropdown-header">
                <div class="fw-semibold">{{ user?.full_name || 'User' }}</div>
                <div class="small text-muted">{{ user?.email }}</div>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <a class="dropdown-item" href="#" @click.prevent="showProfile">
                  <i class="bi bi-person me-2"></i>
                  Profil
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#" @click.prevent="showSettings">
                  <i class="bi bi-gear me-2"></i>
                  Pengaturan
                </a>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <a class="dropdown-item text-danger" href="#" @click.prevent="logout">
                  <i class="bi bi-box-arrow-right me-2"></i>
                  Keluar
                </a>
              </li>
            </ul>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="content-area p-3 p-lg-4">
        <slot />
      </main>
    </div>

    <!-- Mobile Sidebar Overlay -->
    <div 
      v-if="sidebarShow"
      class="sidebar-overlay d-lg-none"
      @click="closeSidebar"
    ></div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notifications'
import Sidebar from './Sidebar.vue'
import { dateHelpers } from '@/utils/helpers'

export default {
  name: 'Layout',
  components: {
    Sidebar
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const authStore = useAuthStore()
    const notificationStore = useNotificationStore()

    // Reactive state
    const sidebarCollapsed = ref(false)
    const sidebarShow = ref(false)
    const isDarkMode = ref(false)

    // Computed properties
    const currentRoute = computed(() => route)
    const user = computed(() => authStore.user)
    const notifications = computed(() => notificationStore.notifications)
    const unreadNotifications = computed(() => 
      notifications.value.filter(n => !n.read).length
    )

    // Methods
    const toggleSidebar = () => {
      if (window.innerWidth >= 992) {
        // Desktop: toggle collapsed state
        sidebarCollapsed.value = !sidebarCollapsed.value
        localStorage.setItem('sidebarCollapsed', sidebarCollapsed.value.toString())
      } else {
        // Mobile: toggle show state
        sidebarShow.value = !sidebarShow.value
      }
    }

    const closeSidebar = () => {
      sidebarShow.value = false
    }

    const toggleTheme = () => {
      isDarkMode.value = !isDarkMode.value
      const theme = isDarkMode.value ? 'dark' : 'light'
      
      localStorage.setItem('theme', theme)
      document.documentElement.setAttribute('data-bs-theme', theme)
    }

    const getInitials = (name) => {
      if (!name) return 'U'
      return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }

    const getNotificationIcon = (type) => {
      const icons = {
        success: 'bi-check-circle text-success',
        error: 'bi-exclamation-circle text-danger',
        warning: 'bi-exclamation-triangle text-warning',
        info: 'bi-info-circle text-info'
      }
      return icons[type] || 'bi-bell'
    }

    const formatDate = (date) => {
      return dateHelpers.formatRelativeTime(date)
    }

    const markAsRead = (notificationId) => {
      // Implementation for marking notification as read
      console.log('Mark as read:', notificationId)
    }

    const markAllAsRead = () => {
      // Implementation for marking all notifications as read
      console.log('Mark all as read')
    }

    const showAllNotifications = () => {
      // Navigate to notifications page or show modal
      console.log('Show all notifications')
    }

    const showProfile = () => {
      // Show profile modal or navigate to profile page
      console.log('Show profile')
    }

    const showSettings = () => {
      // Show settings modal or navigate to settings page
      console.log('Show settings')
    }

    const logout = async () => {
      try {
        await authStore.logout()
        router.push('/login')
      } catch (error) {
        console.error('Logout error:', error)
        notificationStore.error('Gagal logout')
      }
    }

    const handleResize = () => {
      if (window.innerWidth >= 992) {
        sidebarShow.value = false
      }
    }

    // Lifecycle
    onMounted(() => {
      // Load sidebar state
      const savedCollapsed = localStorage.getItem('sidebarCollapsed')
      if (savedCollapsed !== null) {
        sidebarCollapsed.value = savedCollapsed === 'true'
      }

      // Load theme
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme === 'dark' || 
          (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        isDarkMode.value = true
        document.documentElement.setAttribute('data-bs-theme', 'dark')
      }

      // Add resize listener
      window.addEventListener('resize', handleResize)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
    })

    return {
      // State
      sidebarCollapsed,
      sidebarShow,
      isDarkMode,
      
      // Computed
      currentRoute,
      user,
      notifications,
      unreadNotifications,
      
      // Methods
      toggleSidebar,
      closeSidebar,
      toggleTheme,
      getInitials,
      getNotificationIcon,
      formatDate,
      markAsRead,
      markAllAsRead,
      showAllNotifications,
      showProfile,
      showSettings,
      logout
    }
  }
}
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}

.user-avatar {
  width: 32px;
  height: 32px;
}

.avatar-placeholder {
  width: 32px;
  height: 32px;
  background: var(--bs-primary);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
}

.notification-dropdown {
  width: 350px;
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  border-left: 3px solid transparent;
}

.notification-item.unread {
  background-color: var(--bs-primary-bg-subtle);
  border-left-color: var(--bs-primary);
}

.notification-item:hover {
  background-color: var(--bs-gray-100);
}

.content-area {
  min-height: calc(100vh - var(--header-height));
}

@media (max-width: 991.98px) {
  .notification-dropdown {
    width: 300px;
  }
}
</style>

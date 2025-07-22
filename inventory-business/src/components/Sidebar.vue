<template>
  <aside 
    class="sidebar"
    :class="{ 
      'collapsed': collapsed,
      'show': show 
    }"
  >
    <!-- Brand/Logo -->
    <div class="nav-brand">
      <i class="bi bi-cash-coin"></i>
      <span class="nav-text">Cash Flow</span>
    </div>

    <!-- Navigation Menu -->
    <nav class="nav-menu">
      <ul class="nav flex-column">
        <li 
          v-for="item in menuItems" 
          :key="item.name"
          class="nav-item"
        >
          <router-link
            :to="item.path"
            class="nav-link"
            :class="{ 'active': isActiveRoute(item.name) }"
            @click="handleNavClick"
          >
            <i class="nav-icon bi" :class="item.icon"></i>
            <span class="nav-text">{{ item.title }}</span>
            <span 
              v-if="item.badge"
              class="badge bg-danger ms-auto"
            >
              {{ item.badge }}
            </span>
          </router-link>
        </li>
      </ul>

      <!-- Divider -->
      <hr class="nav-divider">

      <!-- User Section -->
      <div class="nav-user" v-if="user">
        <div class="user-info" :class="{ 'collapsed': collapsed }">
          <div class="user-avatar">
            <img 
              v-if="user.avatar_url"
              :src="user.avatar_url"
              :alt="user.full_name || user.email"
              class="rounded-circle"
            >
            <div 
              v-else
              class="avatar-placeholder rounded-circle d-flex align-items-center justify-content-center"
            >
              {{ getInitials(user.full_name || user.email) }}
            </div>
          </div>
          <div class="user-details" v-if="!collapsed">
            <div class="user-name">{{ user.full_name || 'User' }}</div>
            <div class="user-email">{{ user.email }}</div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Collapse Toggle (Desktop) -->
    <button
      class="collapse-toggle d-none d-lg-block"
      @click="$emit('toggle')"
      :title="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
    >
      <i class="bi" :class="collapsed ? 'bi-chevron-right' : 'bi-chevron-left'"></i>
    </button>
  </aside>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTransactionsStore } from '@/stores/transactions'

export default {
  name: 'Sidebar',
  props: {
    collapsed: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['toggle', 'close'],
  setup(props, { emit }) {
    const route = useRoute()
    const authStore = useAuthStore()
    const transactionsStore = useTransactionsStore()

    // Computed properties
    const user = computed(() => authStore.user)
    const pendingTransactions = computed(() => 
      transactionsStore.transactions.filter(t => t.status === 'pending').length
    )

    // Menu items configuration
    const menuItems = computed(() => [
      {
        name: 'Dashboard',
        title: 'Dashboard',
        path: '/dashboard',
        icon: 'bi-speedometer2'
      },
      {
        name: 'Transactions',
        title: 'Transaksi',
        path: '/transactions',
        icon: 'bi-receipt',
        badge: pendingTransactions.value > 0 ? pendingTransactions.value : null
      },
      {
        name: 'Products',
        title: 'Produk',
        path: '/products',
        icon: 'bi-box-seam'
      },
      {
        name: 'Categories',
        title: 'Kategori',
        path: '/categories',
        icon: 'bi-tags'
      },
      {
        name: 'Reports',
        title: 'Laporan',
        path: '/reports',
        icon: 'bi-graph-up'
      }
    ])

    // Methods
    const isActiveRoute = (routeName) => {
      return route.name === routeName
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

    const handleNavClick = () => {
      // Close sidebar on mobile after navigation
      if (window.innerWidth < 992) {
        emit('close')
      }
    }

    return {
      user,
      menuItems,
      isActiveRoute,
      getInitials,
      handleNavClick
    }
  }
}
</script>

<style scoped>
.nav-brand {
  padding: 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  color: white;
  font-weight: 600;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: var(--transition);
}

.nav-menu {
  flex: 1;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
}

.nav-item {
  margin: 0.125rem 0;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: rgba(255,255,255,0.8);
  text-decoration: none;
  border-radius: 0.5rem;
  margin: 0 0.75rem;
  transition: var(--transition);
  position: relative;
}

.nav-link:hover {
  background: rgba(255,255,255,0.1);
  color: white;
  transform: translateX(4px);
}

.nav-link.active {
  background: rgba(255,255,255,0.2);
  color: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.nav-link.active::before {
  content: '';
  position: absolute;
  left: -0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 60%;
  background: white;
  border-radius: 0 2px 2px 0;
}

.nav-icon {
  width: 20px;
  margin-right: 0.75rem;
  text-align: center;
  font-size: 1.1rem;
}

.nav-text {
  flex: 1;
  transition: var(--transition);
}

.badge {
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
}

.nav-divider {
  border-color: rgba(255,255,255,0.1);
  margin: 1rem 0.75rem;
}

.nav-user {
  margin-top: auto;
  padding: 1rem;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: var(--transition);
}

.user-info.collapsed {
  justify-content: center;
}

.user-avatar {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.2);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  color: white;
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.7);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.collapse-toggle {
  position: absolute;
  top: 50%;
  right: -12px;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  background: white;
  color: var(--bs-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: var(--transition);
  z-index: 10;
}

.collapse-toggle:hover {
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* Collapsed state */
.sidebar.collapsed .nav-text {
  opacity: 0;
  width: 0;
  margin: 0;
  overflow: hidden;
}

.sidebar.collapsed .nav-link {
  justify-content: center;
  padding: 0.75rem;
  margin: 0.125rem 0.5rem;
}

.sidebar.collapsed .nav-icon {
  margin-right: 0;
}

.sidebar.collapsed .badge {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  transform: scale(0.8);
}

.sidebar.collapsed .user-details {
  display: none;
}

.sidebar.collapsed .nav-brand .nav-text {
  display: none;
}

.sidebar.collapsed .nav-brand {
  justify-content: center;
  padding: 1rem 0.5rem;
}

/* Mobile styles */
@media (max-width: 991.98px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .sidebar.show {
    transform: translateX(0);
  }
  
  .collapse-toggle {
    display: none;
  }
}

/* Tooltip for collapsed items */
.sidebar.collapsed .nav-link {
  position: relative;
}

.sidebar.collapsed .nav-link:hover::after {
  content: attr(title);
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  background: var(--bs-dark);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  white-space: nowrap;
  z-index: 1000;
  margin-left: 0.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.sidebar.collapsed .nav-link:hover::before {
  content: '';
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  border: 6px solid transparent;
  border-right-color: var(--bs-dark);
  margin-left: -6px;
  z-index: 1000;
}
</style>

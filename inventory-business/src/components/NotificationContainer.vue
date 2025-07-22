<template>
  <teleport to="body">
    <div class="notification-container">
      <transition-group name="notification" tag="div">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="notification"
          :class="[
            `notification-${notification.type}`,
            { 'notification-persistent': notification.persistent }
          ]"
        >
          <!-- Notification Content -->
          <div class="notification-content">
            <!-- Icon -->
            <div class="notification-icon">
              <i class="bi" :class="getNotificationIcon(notification.type)"></i>
            </div>

            <!-- Text Content -->
            <div class="notification-text">
              <div v-if="notification.title" class="notification-title">
                {{ notification.title }}
              </div>
              <div class="notification-message">
                {{ notification.message }}
              </div>
            </div>

            <!-- Actions -->
            <div v-if="notification.actions && notification.actions.length" class="notification-actions">
              <button
                v-for="action in notification.actions"
                :key="action.label"
                class="btn btn-sm"
                :class="action.class || 'btn-outline-secondary'"
                @click="handleAction(action, notification)"
              >
                {{ action.label }}
              </button>
            </div>

            <!-- Close Button -->
            <button
              class="notification-close"
              @click="removeNotification(notification.id)"
              aria-label="Close notification"
            >
              <i class="bi bi-x"></i>
            </button>
          </div>

          <!-- Progress Bar (for timed notifications) -->
          <div
            v-if="!notification.persistent && notification.duration > 0"
            class="notification-progress"
            :style="{ animationDuration: `${notification.duration}ms` }"
          ></div>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script>
import { computed } from 'vue'
import { useNotificationStore } from '@/stores/notifications'

export default {
  name: 'NotificationContainer',
  setup() {
    const notificationStore = useNotificationStore()

    // Computed
    const notifications = computed(() => notificationStore.notifications)

    // Methods
    const getNotificationIcon = (type) => {
      const icons = {
        success: 'bi-check-circle-fill',
        error: 'bi-exclamation-circle-fill',
        warning: 'bi-exclamation-triangle-fill',
        info: 'bi-info-circle-fill'
      }
      return icons[type] || 'bi-bell-fill'
    }

    const removeNotification = (id) => {
      notificationStore.removeNotification(id)
    }

    const handleAction = (action, notification) => {
      if (action.handler) {
        action.handler(notification)
      }
      
      if (action.closeOnClick !== false) {
        removeNotification(notification.id)
      }
    }

    return {
      notifications,
      getNotificationIcon,
      removeNotification,
      handleAction
    }
  }
}
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  max-width: 400px;
  pointer-events: none;
}

.notification {
  background: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  margin-bottom: 1rem;
  overflow: hidden;
  pointer-events: auto;
  position: relative;
  border-left: 4px solid var(--bs-primary);
}

.notification-success {
  border-left-color: var(--bs-success);
}

.notification-error {
  border-left-color: var(--bs-danger);
}

.notification-warning {
  border-left-color: var(--bs-warning);
}

.notification-info {
  border-left-color: var(--bs-info);
}

.notification-content {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  gap: 0.75rem;
}

.notification-icon {
  flex-shrink: 0;
  font-size: 1.25rem;
}

.notification-success .notification-icon {
  color: var(--bs-success);
}

.notification-error .notification-icon {
  color: var(--bs-danger);
}

.notification-warning .notification-icon {
  color: var(--bs-warning);
}

.notification-info .notification-icon {
  color: var(--bs-info);
}

.notification-text {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--bs-body-color);
}

.notification-message {
  font-size: 0.875rem;
  color: var(--bs-secondary);
  line-height: 1.4;
}

.notification-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.notification-close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  color: var(--bs-secondary);
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: var(--transition);
}

.notification-close:hover {
  background: var(--bs-gray-100);
  color: var(--bs-body-color);
}

.notification-progress {
  height: 3px;
  background: var(--bs-primary);
  animation: progress-shrink linear forwards;
}

.notification-success .notification-progress {
  background: var(--bs-success);
}

.notification-error .notification-progress {
  background: var(--bs-danger);
}

.notification-warning .notification-progress {
  background: var(--bs-warning);
}

.notification-info .notification-progress {
  background: var(--bs-info);
}

@keyframes progress-shrink {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

/* Transitions */
.notification-enter-active {
  transition: all 0.3s ease-out;
}

.notification-leave-active {
  transition: all 0.3s ease-in;
}

.notification-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.notification-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.notification-move {
  transition: transform 0.3s ease;
}

/* Dark theme */
[data-bs-theme="dark"] .notification {
  background: var(--bs-gray-800);
  color: var(--bs-gray-100);
}

[data-bs-theme="dark"] .notification-title {
  color: var(--bs-gray-100);
}

[data-bs-theme="dark"] .notification-message {
  color: var(--bs-gray-300);
}

[data-bs-theme="dark"] .notification-close:hover {
  background: var(--bs-gray-700);
  color: var(--bs-gray-100);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .notification-container {
    left: 1rem;
    right: 1rem;
    max-width: none;
  }
  
  .notification-content {
    padding: 0.75rem;
    gap: 0.5rem;
  }
  
  .notification-actions {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>

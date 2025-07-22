import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notifications', () => {
  // State
  const notifications = ref([])
  const maxNotifications = ref(5)
  const defaultDuration = ref(5000) // 5 seconds

  // Actions
  const addNotification = (notification) => {
    const id = Date.now() + Math.random()
    
    const newNotification = {
      id,
      type: notification.type || 'info', // success, error, warning, info
      title: notification.title || '',
      message: notification.message || '',
      duration: notification.duration ?? defaultDuration.value,
      persistent: notification.persistent || false,
      actions: notification.actions || [],
      createdAt: new Date(),
      ...notification
    }

    notifications.value.unshift(newNotification)

    // Remove oldest notifications if exceeding max
    if (notifications.value.length > maxNotifications.value) {
      notifications.value = notifications.value.slice(0, maxNotifications.value)
    }

    // Auto remove notification after duration (if not persistent)
    if (!newNotification.persistent && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }

    return id
  }

  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearAll = () => {
    notifications.value = []
  }

  const success = (message, options = {}) => {
    return addNotification({
      type: 'success',
      title: options.title || 'Berhasil',
      message,
      ...options
    })
  }

  const error = (message, options = {}) => {
    return addNotification({
      type: 'error',
      title: options.title || 'Error',
      message,
      duration: options.duration ?? 8000, // Longer duration for errors
      ...options
    })
  }

  const warning = (message, options = {}) => {
    return addNotification({
      type: 'warning',
      title: options.title || 'Peringatan',
      message,
      ...options
    })
  }

  const info = (message, options = {}) => {
    return addNotification({
      type: 'info',
      title: options.title || 'Informasi',
      message,
      ...options
    })
  }

  return {
    // State
    notifications,
    maxNotifications,
    defaultDuration,
    
    // Actions
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info
  }
})

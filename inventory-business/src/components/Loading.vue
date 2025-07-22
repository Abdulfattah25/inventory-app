<template>
  <div class="loading-container" :class="containerClass">
    <div class="loading-content">
      <!-- Spinner -->
      <div class="loading-spinner">
        <div v-if="type === 'spinner'" class="spinner-border" :class="spinnerClass" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        
        <div v-else-if="type === 'dots'" class="loading-dots">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
        
        <div v-else-if="type === 'pulse'" class="loading-pulse">
          <div class="pulse-circle"></div>
        </div>
        
        <div v-else-if="type === 'bars'" class="loading-bars">
          <div class="bar"></div>
          <div class="bar"></div>
          <div class="bar"></div>
          <div class="bar"></div>
        </div>
      </div>

      <!-- Text -->
      <div v-if="text" class="loading-text">
        {{ text }}
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'Loading',
  props: {
    type: {
      type: String,
      default: 'spinner',
      validator: (value) => ['spinner', 'dots', 'pulse', 'bars'].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    color: {
      type: String,
      default: 'primary'
    },
    text: {
      type: String,
      default: ''
    },
    overlay: {
      type: Boolean,
      default: false
    },
    fullscreen: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const containerClass = computed(() => ({
      'loading-overlay': props.overlay,
      'loading-fullscreen': props.fullscreen,
      [`loading-${props.size}`]: true
    }))

    const spinnerClass = computed(() => ({
      [`text-${props.color}`]: true,
      'spinner-border-sm': props.size === 'sm',
      'spinner-border-lg': props.size === 'lg'
    }))

    return {
      containerClass,
      spinnerClass
    }
  }
}
</script>

<style scoped>
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  z-index: 1000;
}

.loading-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  z-index: 9999;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loading-text {
  color: var(--bs-secondary);
  font-size: 0.875rem;
  text-align: center;
}

/* Spinner sizes */
.loading-sm .loading-text {
  font-size: 0.75rem;
}

.loading-lg .loading-text {
  font-size: 1rem;
}

/* Dots animation */
.loading-dots {
  display: flex;
  gap: 0.25rem;
}

.loading-dots .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--bs-primary);
  animation: dots-bounce 1.4s infinite ease-in-out both;
}

.loading-sm .loading-dots .dot {
  width: 6px;
  height: 6px;
}

.loading-lg .loading-dots .dot {
  width: 12px;
  height: 12px;
}

.loading-dots .dot:nth-child(1) { animation-delay: -0.32s; }
.loading-dots .dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes dots-bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* Pulse animation */
.loading-pulse {
  position: relative;
}

.loading-pulse .pulse-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bs-primary);
  animation: pulse-scale 1s infinite ease-in-out;
}

.loading-sm .loading-pulse .pulse-circle {
  width: 30px;
  height: 30px;
}

.loading-lg .loading-pulse .pulse-circle {
  width: 60px;
  height: 60px;
}

@keyframes pulse-scale {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

/* Bars animation */
.loading-bars {
  display: flex;
  gap: 0.25rem;
  align-items: end;
}

.loading-bars .bar {
  width: 4px;
  height: 20px;
  background: var(--bs-primary);
  animation: bars-stretch 1.2s infinite ease-in-out;
}

.loading-sm .loading-bars .bar {
  width: 3px;
  height: 15px;
}

.loading-lg .loading-bars .bar {
  width: 6px;
  height: 30px;
}

.loading-bars .bar:nth-child(1) { animation-delay: -1.1s; }
.loading-bars .bar:nth-child(2) { animation-delay: -1.0s; }
.loading-bars .bar:nth-child(3) { animation-delay: -0.9s; }
.loading-bars .bar:nth-child(4) { animation-delay: -0.8s; }

@keyframes bars-stretch {
  0%, 40%, 100% {
    transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
  }
}

/* Dark theme */
[data-bs-theme="dark"] .loading-overlay {
  background: rgba(0, 0, 0, 0.8);
}

[data-bs-theme="dark"] .loading-fullscreen {
  background: rgba(0, 0, 0, 0.9);
}

[data-bs-theme="dark"] .loading-text {
  color: var(--bs-gray-300);
}
</style>

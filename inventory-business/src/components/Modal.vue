<template>
  <teleport to="body">
    <div
      v-if="show"
      class="modal fade show"
      :class="{ 'd-block': show }"
      tabindex="-1"
      role="dialog"
      :aria-labelledby="titleId"
      aria-modal="true"
      @click="handleBackdropClick"
    >
      <div
        class="modal-dialog"
        :class="[
          sizeClass,
          { 'modal-dialog-centered': centered },
          { 'modal-dialog-scrollable': scrollable }
        ]"
        role="document"
      >
        <div class="modal-content">
          <!-- Header -->
          <div v-if="!hideHeader" class="modal-header">
            <h5 :id="titleId" class="modal-title">
              <slot name="title">{{ title }}</slot>
            </h5>
            <button
              v-if="!hideCloseButton"
              type="button"
              class="btn-close"
              @click="close"
              aria-label="Close"
            ></button>
          </div>

          <!-- Body -->
          <div class="modal-body" :class="bodyClass">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="!hideFooter" class="modal-footer">
            <slot name="footer">
              <button
                v-if="!hideCancelButton"
                type="button"
                class="btn btn-secondary"
                @click="cancel"
              >
                {{ cancelText }}
              </button>
              <button
                v-if="!hideConfirmButton"
                type="button"
                class="btn"
                :class="confirmButtonClass"
                :disabled="confirmDisabled"
                @click="confirm"
              >
                <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                {{ confirmText }}
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>

    <!-- Backdrop -->
    <div
      v-if="show"
      class="modal-backdrop fade show"
    ></div>
  </teleport>
</template>

<script>
import { computed, watch, nextTick } from 'vue'

export default {
  name: 'Modal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
    },
    centered: {
      type: Boolean,
      default: false
    },
    scrollable: {
      type: Boolean,
      default: false
    },
    hideHeader: {
      type: Boolean,
      default: false
    },
    hideFooter: {
      type: Boolean,
      default: false
    },
    hideCloseButton: {
      type: Boolean,
      default: false
    },
    hideCancelButton: {
      type: Boolean,
      default: false
    },
    hideConfirmButton: {
      type: Boolean,
      default: false
    },
    cancelText: {
      type: String,
      default: 'Batal'
    },
    confirmText: {
      type: String,
      default: 'Simpan'
    },
    confirmButtonClass: {
      type: String,
      default: 'btn-primary'
    },
    confirmDisabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    bodyClass: {
      type: String,
      default: ''
    },
    closeOnBackdrop: {
      type: Boolean,
      default: true
    },
    closeOnEscape: {
      type: Boolean,
      default: true
    }
  },
  emits: ['close', 'cancel', 'confirm', 'show', 'hide'],
  setup(props, { emit }) {
    // Computed
    const titleId = computed(() => `modal-title-${Math.random().toString(36).substr(2, 9)}`)
    
    const sizeClass = computed(() => {
      const sizeMap = {
        sm: 'modal-sm',
        md: '',
        lg: 'modal-lg',
        xl: 'modal-xl'
      }
      return sizeMap[props.size] || ''
    })

    // Methods
    const close = () => {
      emit('close')
      emit('hide')
    }

    const cancel = () => {
      emit('cancel')
      close()
    }

    const confirm = () => {
      emit('confirm')
    }

    const handleBackdropClick = (event) => {
      if (props.closeOnBackdrop && event.target === event.currentTarget) {
        close()
      }
    }

    const handleEscapeKey = (event) => {
      if (props.closeOnEscape && event.key === 'Escape' && props.show) {
        close()
      }
    }

    // Watch for show changes
    watch(() => props.show, async (newValue) => {
      if (newValue) {
        emit('show')
        await nextTick()
        document.addEventListener('keydown', handleEscapeKey)
        document.body.classList.add('modal-open')
      } else {
        document.removeEventListener('keydown', handleEscapeKey)
        document.body.classList.remove('modal-open')
      }
    })

    return {
      titleId,
      sizeClass,
      close,
      cancel,
      confirm,
      handleBackdropClick
    }
  }
}
</script>

<style scoped>
.modal {
  display: block;
}

.modal-content {
  border: none;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
}

.modal-header {
  border-bottom: 1px solid var(--bs-border-color);
  padding: 1.25rem;
}

.modal-title {
  font-weight: 600;
  color: var(--bs-body-color);
}

.modal-body {
  padding: 1.25rem;
}

.modal-footer {
  border-top: 1px solid var(--bs-border-color);
  padding: 1rem 1.25rem;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.15s ease-in-out;
}

.btn-close:hover {
  opacity: 0.75;
}

/* Dark theme */
[data-bs-theme="dark"] .modal-content {
  background-color: var(--bs-gray-800);
  color: var(--bs-gray-100);
}

[data-bs-theme="dark"] .modal-header,
[data-bs-theme="dark"] .modal-footer {
  border-color: var(--bs-gray-600);
}

[data-bs-theme="dark"] .modal-title {
  color: var(--bs-gray-100);
}
</style>

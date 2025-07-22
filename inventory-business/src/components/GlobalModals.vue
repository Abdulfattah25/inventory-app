<template>
  <!-- Confirmation Modal -->
  <div
    class="modal fade"
    id="confirmationModal"
    tabindex="-1"
    aria-labelledby="confirmationModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="confirmationModalLabel">
            {{ confirmationModal.title }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          {{ confirmationModal.message }}
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Batal
          </button>
          <button
            type="button"
            class="btn"
            :class="confirmationModal.type === 'danger' ? 'btn-danger' : 'btn-primary'"
            @click="handleConfirm"
          >
            {{ confirmationModal.confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading Modal -->
  <div
    class="modal fade"
    id="loadingModal"
    tabindex="-1"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
  >
    <div class="modal-dialog modal-sm modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body text-center py-4">
          <div class="spinner-border text-primary mb-3" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mb-0">{{ loadingModal.message }}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Alert Modal -->
  <div
    class="modal fade"
    id="alertModal"
    tabindex="-1"
    aria-labelledby="alertModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="alertModalLabel">
            <i :class="alertModal.icon" class="me-2"></i>
            {{ alertModal.title }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          {{ alertModal.message }}
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-primary"
            data-bs-dismiss="modal"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
  name: 'GlobalModals',
  setup() {
    // Confirmation Modal
    const confirmationModal = reactive({
      title: '',
      message: '',
      type: 'primary',
      confirmText: 'Konfirmasi',
      onConfirm: null
    })

    // Loading Modal
    const loadingModal = reactive({
      message: 'Memuat...'
    })

    // Alert Modal
    const alertModal = reactive({
      title: '',
      message: '',
      type: 'info',
      icon: 'bi-info-circle'
    })

    const handleConfirm = () => {
      if (confirmationModal.onConfirm) {
        confirmationModal.onConfirm()
      }
      // Close modal
      const modal = document.getElementById('confirmationModal')
      const bsModal = bootstrap.Modal.getInstance(modal)
      if (bsModal) {
        bsModal.hide()
      }
    }

    // Global methods to show modals
    window.showConfirmationModal = (options) => {
      confirmationModal.title = options.title || 'Konfirmasi'
      confirmationModal.message = options.message || 'Apakah Anda yakin?'
      confirmationModal.type = options.type || 'primary'
      confirmationModal.confirmText = options.confirmText || 'Konfirmasi'
      confirmationModal.onConfirm = options.onConfirm

      const modal = new bootstrap.Modal(document.getElementById('confirmationModal'))
      modal.show()
    }

    window.showLoadingModal = (message = 'Memuat...') => {
      loadingModal.message = message
      const modal = new bootstrap.Modal(document.getElementById('loadingModal'))
      modal.show()
    }

    window.hideLoadingModal = () => {
      const modal = document.getElementById('loadingModal')
      const bsModal = bootstrap.Modal.getInstance(modal)
      if (bsModal) {
        bsModal.hide()
      }
    }

    window.showAlertModal = (options) => {
      alertModal.title = options.title || 'Informasi'
      alertModal.message = options.message || ''
      alertModal.type = options.type || 'info'
      
      // Set icon based on type
      switch (options.type) {
        case 'success':
          alertModal.icon = 'bi-check-circle text-success'
          break
        case 'error':
          alertModal.icon = 'bi-exclamation-circle text-danger'
          break
        case 'warning':
          alertModal.icon = 'bi-exclamation-triangle text-warning'
          break
        default:
          alertModal.icon = 'bi-info-circle text-info'
      }

      const modal = new bootstrap.Modal(document.getElementById('alertModal'))
      modal.show()
    }

    return {
      confirmationModal,
      loadingModal,
      alertModal,
      handleConfirm
    }
  }
}
</script>

<style scoped>
.modal-content {
  border-radius: 0.75rem;
  border: none;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
}

.modal-header {
  border-bottom: 1px solid #e9ecef;
  padding: 1.25rem;
}

.modal-body {
  padding: 1.25rem;
}

.modal-footer {
  border-top: 1px solid #e9ecef;
  padding: 1.25rem;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>

<template>
  <div class="transaction-form">
    <form @submit.prevent="handleSubmit">
      <!-- Transaction Type -->
      <div class="mb-3">
        <label class="form-label">Jenis Transaksi</label>
        <div class="btn-group w-100" role="group">
          <input
            id="income"
            v-model="form.type"
            type="radio"
            class="btn-check"
            value="income"
          >
          <label class="btn btn-outline-success" for="income">
            <i class="bi bi-arrow-down-circle me-2"></i>Pemasukan
          </label>
          
          <input
            id="expense"
            v-model="form.type"
            type="radio"
            class="btn-check"
            value="expense"
          >
          <label class="btn btn-outline-danger" for="expense">
            <i class="bi bi-arrow-up-circle me-2"></i>Pengeluaran
          </label>
        </div>
      </div>

      <!-- Amount -->
      <div class="mb-3">
        <label for="amount" class="form-label">Jumlah</label>
        <div class="input-group">
          <span class="input-group-text">Rp</span>
          <input
            id="amount"
            v-model="form.amount"
            type="number"
            class="form-control"
            :class="{ 'is-invalid': errors.amount }"
            placeholder="0"
            min="0"
            step="1000"
            required
          >
          <div v-if="errors.amount" class="invalid-feedback">
            {{ errors.amount }}
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="mb-3">
        <label for="description" class="form-label">Deskripsi</label>
        <input
          id="description"
          v-model="form.description"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.description }"
          placeholder="Masukkan deskripsi transaksi"
          required
        >
        <div v-if="errors.description" class="invalid-feedback">
          {{ errors.description }}
        </div>
      </div>

      <!-- Category -->
      <div class="mb-3">
        <label for="category" class="form-label">Kategori</label>
        <select
          id="category"
          v-model="form.category_id"
          class="form-select"
          :class="{ 'is-invalid': errors.category_id }"
          required
        >
          <option value="">Pilih kategori</option>
          <option
            v-for="category in filteredCategories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
        <div v-if="errors.category_id" class="invalid-feedback">
          {{ errors.category_id }}
        </div>
      </div>

      <!-- Date -->
      <div class="mb-3">
        <label for="date" class="form-label">Tanggal</label>
        <input
          id="date"
          v-model="form.date"
          type="date"
          class="form-control"
          :class="{ 'is-invalid': errors.date }"
          required
        >
        <div v-if="errors.date" class="invalid-feedback">
          {{ errors.date }}
        </div>
      </div>

      <!-- Payment Method -->
      <div class="mb-3">
        <label for="payment_method" class="form-label">Metode Pembayaran</label>
        <select
          id="payment_method"
          v-model="form.payment_method"
          class="form-select"
        >
          <option value="cash">Tunai</option>
          <option value="bank_transfer">Transfer Bank</option>
          <option value="credit_card">Kartu Kredit</option>
          <option value="debit_card">Kartu Debit</option>
          <option value="e_wallet">E-Wallet</option>
        </select>
      </div>

      <!-- Notes -->
      <div class="mb-4">
        <label for="notes" class="form-label">Catatan (Opsional)</label>
        <textarea
          id="notes"
          v-model="form.notes"
          class="form-control"
          rows="3"
          placeholder="Tambahkan catatan jika diperlukan"
        ></textarea>
      </div>

      <!-- Action Buttons -->
      <div class="d-flex gap-2">
        <button
          type="button"
          class="btn btn-secondary"
          @click="$emit('cancel')"
        >
          Batal
        </button>
        <button
          type="submit"
          class="btn btn-primary flex-fill"
          :disabled="loading"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          {{ loading ? 'Menyimpan...' : 'Simpan Transaksi' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue'

export default {
  name: 'TransactionForm',
  props: {
    type: {
      type: String,
      default: 'expense'
    },
    transaction: {
      type: Object,
      default: null
    }
  },
  emits: ['success', 'cancel'],
  setup(props, { emit }) {
    const loading = ref(false)
    const errors = reactive({})

    const form = reactive({
      type: props.type,
      amount: '',
      description: '',
      category_id: '',
      date: new Date().toISOString().split('T')[0],
      payment_method: 'cash',
      notes: ''
    })

    // Mock categories - replace with actual store later
    const categories = ref([
      { id: '1', name: 'Makanan', type: 'expense' },
      { id: '2', name: 'Transport', type: 'expense' },
      { id: '3', name: 'Gaji', type: 'income' },
      { id: '4', name: 'Bonus', type: 'income' }
    ])

    const filteredCategories = computed(() => {
      return categories.value.filter(cat => cat.type === form.type)
    })

    const validateForm = () => {
      const newErrors = {}

      if (!form.amount || form.amount <= 0) {
        newErrors.amount = 'Jumlah harus lebih dari 0'
      }

      if (!form.description.trim()) {
        newErrors.description = 'Deskripsi wajib diisi'
      }

      if (!form.category_id) {
        newErrors.category_id = 'Kategori wajib dipilih'
      }

      if (!form.date) {
        newErrors.date = 'Tanggal wajib diisi'
      }

      Object.assign(errors, newErrors)
      return Object.keys(newErrors).length === 0
    }

    const clearErrors = () => {
      Object.keys(errors).forEach(key => {
        delete errors[key]
      })
    }

    const handleSubmit = async () => {
      clearErrors()
      
      if (!validateForm()) return

      loading.value = true

      try {
        const transactionData = {
          type: form.type,
          amount: parseFloat(form.amount),
          description: form.description.trim(),
          category_id: form.category_id,
          date: form.date,
          payment_method: form.payment_method,
          notes: form.notes.trim() || null
        }

        // Mock success - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        console.log('Transaction saved:', transactionData)
        emit('success')

      } catch (error) {
        console.error('Submit error:', error)
      } finally {
        loading.value = false
      }
    }

    // Watch type changes to reset category
    watch(() => form.type, () => {
      form.category_id = ''
    })

    // Initialize form if editing
    onMounted(() => {
      if (props.transaction) {
        Object.assign(form, {
          type: props.transaction.type,
          amount: props.transaction.amount,
          description: props.transaction.description,
          category_id: props.transaction.category_id,
          date: props.transaction.date,
          payment_method: props.transaction.payment_method || 'cash',
          notes: props.transaction.notes || ''
        })
      }
    })

    return {
      loading,
      errors,
      form,
      filteredCategories,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.transaction-form {
  max-width: 500px;
}

.btn-check:checked + .btn-outline-success {
  background-color: var(--bs-success);
  border-color: var(--bs-success);
  color: white;
}

.btn-check:checked + .btn-outline-danger {
  background-color: var(--bs-danger);
  border-color: var(--bs-danger);
  color: white;
}
</style>

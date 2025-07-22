<template>
  <div class="category-form">
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label for="name" class="form-label">Nama Kategori</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          class="form-control"
          placeholder="Masukkan nama kategori"
          required
        >
      </div>

      <div class="mb-3">
        <label for="type" class="form-label">Tipe Kategori</label>
        <select
          id="type"
          v-model="form.type"
          class="form-select"
          required
          :disabled="!!defaultType"
        >
          <option value="">Pilih tipe kategori</option>
          <option value="income">Pemasukan</option>
          <option value="expense">Pengeluaran</option>
        </select>
      </div>

      <div class="mb-3">
        <label for="description" class="form-label">Deskripsi</label>
        <textarea
          id="description"
          v-model="form.description"
          class="form-control"
          rows="3"
          placeholder="Masukkan deskripsi kategori (opsional)"
        ></textarea>
      </div>

      <div class="d-flex justify-content-end gap-2">
        <button type="button" class="btn btn-secondary" @click="$emit('cancel')">
          Batal
        </button>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          {{ category ? 'Update' : 'Simpan' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'

export default {
  name: 'CategoryForm',
  props: {
    category: { type: Object, default: null },
    defaultType: { type: String, default: null }
  },
  emits: ['success', 'cancel'],
  setup(props, { emit }) {
    const loading = ref(false)
    const form = reactive({
      name: '',
      type: props.defaultType || '',
      description: '',
      color: '#6c757d',
      icon: 'bi-tag'
    })

    const handleSubmit = async () => {
      loading.value = true
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        emit('success')
      } catch (error) {
        console.error('Error saving category:', error)
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      if (props.category) {
        Object.assign(form, props.category)
      }
    })

    return {
      loading,
      form,
      handleSubmit
    }
  }
}
</script>

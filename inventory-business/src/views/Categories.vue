<template>
  <div class="categories-page">
    <!-- Page Header -->
    <div class="page-header mb-4">
      <div class="row align-items-center">
        <div class="col">
          <h1 class="page-title">Kategori</h1>
          <p class="page-subtitle text-muted">
            Kelola kategori untuk mengorganisir transaksi Anda
          </p>
        </div>
        <div class="col-auto">
          <button
            class="btn btn-primary"
            @click="openCategoryModal()"
          >
            <i class="bi bi-plus-circle me-2"></i>
            Tambah Kategori
          </button>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="card stats-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-subtitle mb-1 text-muted">Total Kategori</h6>
                <h3 class="card-title mb-0">{{ categories.length }}</h3>
              </div>
              <i class="bi bi-tags fs-2 text-primary"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card stats-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-subtitle mb-1 text-muted">Kategori Pemasukan</h6>
                <h3 class="card-title mb-0">{{ incomeCategories.length }}</h3>
              </div>
              <i class="bi bi-arrow-down-circle fs-2 text-success"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card stats-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-subtitle mb-1 text-muted">Kategori Pengeluaran</h6>
                <h3 class="card-title mb-0">{{ expenseCategories.length }}</h3>
              </div>
              <i class="bi bi-arrow-up-circle fs-2 text-danger"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card stats-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-subtitle mb-1 text-muted">Paling Sering Digunakan</h6>
                <h3 class="card-title mb-0">{{ mostUsedCategory?.name || '-' }}</h3>
              </div>
              <i class="bi bi-star fs-2 text-warning"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label">Tipe Kategori</label>
            <select v-model="filters.type" class="form-select">
              <option value="">Semua Tipe</option>
              <option value="income">Pemasukan</option>
              <option value="expense">Pengeluaran</option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label">Status</label>
            <select v-model="filters.status" class="form-select">
              <option value="">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label">Cari Kategori</label>
            <div class="input-group">
              <input
                v-model="filters.search"
                type="text"
                class="form-control"
                placeholder="Cari nama kategori..."
              >
              <button
                v-if="filters.search"
                class="btn btn-outline-secondary"
                type="button"
                @click="filters.search = ''"
              >
                <i class="bi bi-x"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Categories Grid -->
    <div class="row">
      <!-- Income Categories -->
      <div class="col-lg-6 mb-4">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0 text-success">
              <i class="bi bi-arrow-down-circle me-2"></i>
              Kategori Pemasukan ({{ filteredIncomeCategories.length }})
            </h5>
            <button
              class="btn btn-sm btn-success"
              @click="openCategoryModal('income')"
            >
              <i class="bi bi-plus"></i>
            </button>
          </div>
          <div class="card-body p-0">
            <div v-if="loading" class="text-center py-4">
              <div class="spinner-border text-success" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else-if="filteredIncomeCategories.length === 0" class="text-center py-4 text-muted">
              <i class="bi bi-tags display-4"></i>
              <p class="mt-2">Belum ada kategori pemasukan</p>
            </div>
            <div v-else class="list-group list-group-flush">
              <div
                v-for="category in filteredIncomeCategories"
                :key="category.id"
                class="list-group-item category-item"
              >
                <div class="d-flex justify-content-between align-items-center">
                  <div class="d-flex align-items-center">
                    <div
                      class="category-icon me-3"
                      :style="{ backgroundColor: category.color || '#28a745' }"
                    >
                      <i :class="category.icon || 'bi bi-tag'"></i>
                    </div>
                    <div>
                      <h6 class="mb-1">{{ category.name }}</h6>
                      <small class="text-muted">
                        {{ category.description || 'Tidak ada deskripsi' }}
                      </small>
                      <div class="mt-1">
                        <small class="text-muted">
                          {{ getCategoryUsageCount(category.id) }} transaksi
                        </small>
                        <span
                          class="badge ms-2"
                          :class="category.is_active ? 'bg-success' : 'bg-secondary'"
                        >
                          {{ category.is_active ? 'Aktif' : 'Tidak Aktif' }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="btn-group btn-group-sm">
                    <button
                      class="btn btn-outline-primary"
                      @click="editCategory(category)"
                      title="Edit"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button
                      class="btn btn-outline-secondary"
                      @click="toggleCategoryStatus(category)"
                      :title="category.is_active ? 'Nonaktifkan' : 'Aktifkan'"
                    >
                      <i :class="category.is_active ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                    <button
                      class="btn btn-outline-danger"
                      @click="confirmDelete(category)"
                      title="Hapus"
                      :disabled="getCategoryUsageCount(category.id) > 0"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Expense Categories -->
      <div class="col-lg-6 mb-4">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0 text-danger">
              <i class="bi bi-arrow-up-circle me-2"></i>
              Kategori Pengeluaran ({{ filteredExpenseCategories.length }})
            </h5>
            <button
              class="btn btn-sm btn-danger"
              @click="openCategoryModal('expense')"
            >
              <i class="bi bi-plus"></i>
            </button>
          </div>
          <div class="card-body p-0">
            <div v-if="loading" class="text-center py-4">
              <div class="spinner-border text-danger" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else-if="filteredExpenseCategories.length === 0" class="text-center py-4 text-muted">
              <i class="bi bi-tags display-4"></i>
              <p class="mt-2">Belum ada kategori pengeluaran</p>
            </div>
            <div v-else class="list-group list-group-flush">
              <div
                v-for="category in filteredExpenseCategories"
                :key="category.id"
                class="list-group-item category-item"
              >
                <div class="d-flex justify-content-between align-items-center">
                  <div class="d-flex align-items-center">
                    <div
                      class="category-icon me-3"
                      :style="{ backgroundColor: category.color || '#dc3545' }"
                    >
                      <i :class="category.icon || 'bi bi-tag'"></i>
                    </div>
                    <div>
                      <h6 class="mb-1">{{ category.name }}</h6>
                      <small class="text-muted">
                        {{ category.description || 'Tidak ada deskripsi' }}
                      </small>
                      <div class="mt-1">
                        <small class="text-muted">
                          {{ getCategoryUsageCount(category.id) }} transaksi
                        </small>
                        <span
                          class="badge ms-2"
                          :class="category.is_active ? 'bg-success' : 'bg-secondary'"
                        >
                          {{ category.is_active ? 'Aktif' : 'Tidak Aktif' }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="btn-group btn-group-sm">
                    <button
                      class="btn btn-outline-primary"
                      @click="editCategory(category)"
                      title="Edit"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button
                      class="btn btn-outline-secondary"
                      @click="toggleCategoryStatus(category)"
                      :title="category.is_active ? 'Nonaktifkan' : 'Aktifkan'"
                    >
                      <i :class="category.is_active ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                    <button
                      class="btn btn-outline-danger"
                      @click="confirmDelete(category)"
                      title="Hapus"
                      :disabled="getCategoryUsageCount(category.id) > 0"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Usage Chart -->
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Penggunaan Kategori</h5>
          </div>
          <div class="card-body">
            <Chart
              v-if="categoryUsageData.labels.length > 0"
              type="bar"
              :data="categoryUsageData"
              :options="chartOptions"
              height="300"
            />
            <div v-else class="text-center py-5 text-muted">
              <i class="bi bi-bar-chart display-4"></i>
              <p class="mt-2">Belum ada data penggunaan kategori</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Modal -->
    <Modal
      v-if="showCategoryModal"
      :show="showCategoryModal"
      :title="editingCategory ? 'Edit Kategori' : 'Tambah Kategori'"
      @close="closeCategoryModal"
    >
      <CategoryForm
        :category="editingCategory"
        :default-type="defaultType"
        @success="handleCategorySuccess"
        @cancel="closeCategoryModal"
      />
    </Modal>

    <!-- Delete Confirmation Modal -->
    <Modal
      v-if="showDeleteModal"
      :show="showDeleteModal"
      title="Konfirmasi Hapus"
      @close="showDeleteModal = false"
    >
      <div class="text-center">
        <i class="bi bi-exclamation-triangle display-4 text-warning"></i>
        <h5 class="mt-3">Hapus Kategori?</h5>
        <p class="text-muted">
          Apakah Anda yakin ingin menghapus kategori "{{ categoryToDelete?.name }}"?
          Tindakan ini tidak dapat dibatalkan.
        </p>
        <div v-if="getCategoryUsageCount(categoryToDelete?.id) > 0" class="alert alert-warning">
          <i class="bi bi-exclamation-triangle me-2"></i>
          Kategori ini digunakan pada {{ getCategoryUsageCount(categoryToDelete?.id) }} transaksi.
          Hapus atau ubah kategori transaksi tersebut terlebih dahulu.
        </div>
      </div>
      
      <template #footer>
        <button
          class="btn btn-secondary"
          @click="showDeleteModal = false"
        >
          Batal
        </button>
        <button
          class="btn btn-danger"
          @click="deleteCategory"
          :disabled="loading || getCategoryUsageCount(categoryToDelete?.id) > 0"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          Hapus
        </button>
      </template>
    </Modal>
  </div>
</template>

<script>
import { ref, computed, reactive, onMounted } from 'vue'
import { useCategoriesStore } from '@/stores/categories'
import { useTransactionsStore } from '@/stores/transactions'
import { useNotificationStore } from '@/stores/notifications'
import Modal from '@/components/Modal.vue'
import CategoryForm from '@/components/CategoryForm.vue'
import Chart from '@/components/Chart.vue'

export default {
  name: 'Categories',
  components: {
    Modal,
    CategoryForm,
    Chart
  },
  setup() {
    const categoriesStore = useCategoriesStore()
    const transactionsStore = useTransactionsStore()
    const notifications = useNotificationStore()

    // Reactive data
    const loading = ref(false)
    const showCategoryModal = ref(false)
    const showDeleteModal = ref(false)
    const editingCategory = ref(null)
    const categoryToDelete = ref(null)
    const defaultType = ref(null)

    // Filters
    const filters = reactive({
      type: '',
      status: '',
      search: ''
    })

    // Computed properties
    const categories = computed(() => categoriesStore.categories)
    const transactions = computed(() => transactionsStore.transactions)

    const incomeCategories = computed(() => 
      categories.value.filter(c => c.type === 'income')
    )

    const expenseCategories = computed(() => 
      categories.value.filter(c => c.type === 'expense')
    )

    const filteredCategories = computed(() => {
      let filtered = [...categories.value]

      if (filters.type) {
        filtered = filtered.filter(c => c.type === filters.type)
      }

      if (filters.status) {
        const isActive = filters.status === 'active'
        filtered = filtered.filter(c => c.is_active === isActive)
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        filtered = filtered.filter(c =>
          c.name.toLowerCase().includes(searchTerm) ||
          c.description?.toLowerCase().includes(searchTerm)
        )
      }

      return filtered
    })

    const filteredIncomeCategories = computed(() =>
      filteredCategories.value.filter(c => c.type === 'income')
    )

    const filteredExpenseCategories = computed(() =>
      filteredCategories.value.filter(c => c.type === 'expense')
    )

    const mostUsedCategory = computed(() => {
      const categoryUsage = {}
      
      transactions.value.forEach(transaction => {
        if (transaction.category_id) {
          categoryUsage[transaction.category_id] = (categoryUsage[transaction.category_id] || 0) + 1
        }
      })

      const mostUsedId = Object.keys(categoryUsage).reduce((a, b) => 
        categoryUsage[a] > categoryUsage[b] ? a : b, null
      )

      return categories.value.find(c => c.id === mostUsedId)
    })

    const categoryUsageData = computed(() => {
      const categoryUsage = {}
      
      transactions.value.forEach(transaction => {
        if (transaction.category_id) {
          const category = categories.value.find(c => c.id === transaction.category_id)
          if (category) {
            categoryUsage[category.name] = (categoryUsage[category.name] || 0) + 1
          }
        }
      })

      const labels = Object.keys(categoryUsage)
      const data = Object.values(categoryUsage)
      const colors = labels.map((_, index) => {
        const hue = (index * 137.508) % 360
        return `hsl(${hue}, 70%, 60%)`
      })

      return {
        labels,
        datasets: [{
          label: 'Jumlah Transaksi',
          data,
          backgroundColor: colors,
          borderColor: colors.map(color => color.replace('60%', '50%')),
          borderWidth: 1
        }]
      }
    })

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }

    // Methods
    const getCategoryUsageCount = (categoryId) => {
      return transactions.value.filter(t => t.category_id === categoryId).length
    }

    const openCategoryModal = (type = null) => {
      defaultType.value = type
      editingCategory.value = null
      showCategoryModal.value = true
    }

    const closeCategoryModal = () => {
      showCategoryModal.value = false
      editingCategory.value = null
      defaultType.value = null
    }

    const editCategory = (category) => {
      editingCategory.value = category
      defaultType.value = null
      showCategoryModal.value = true
    }

    const confirmDelete = (category) => {
      categoryToDelete.value = category
      showDeleteModal.value = true
    }

    const deleteCategory = async () => {
      if (!categoryToDelete.value) return

      loading.value = true
      try {
        await categoriesStore.deleteCategory(categoryToDelete.value.id)
        notifications.success('Kategori berhasil dihapus')
        showDeleteModal.value = false
        categoryToDelete.value = null
      } catch (error) {
        notifications.error('Gagal menghapus kategori')
        console.error('Error deleting category:', error)
      } finally {
        loading.value = false
      }
    }

    const toggleCategoryStatus = async (category) => {
      loading.value = true
      try {
        await categoriesStore.updateCategory(category.id, {
          ...category,
          is_active: !category.is_active
        })
        notifications.success(
          `Kategori berhasil ${category.is_active ? 'dinonaktifkan' : 'diaktifkan'}`
        )
      } catch (error) {
        notifications.error('Gagal mengubah status kategori')
        console.error('Error toggling category status:', error)
      } finally {
        loading.value = false
      }
    }

    const handleCategorySuccess = () => {
      closeCategoryModal()
      loadData()
    }

    const loadData = async () => {
      loading.value = true
      try {
        await Promise.all([
          categoriesStore.fetchCategories(),
          transactionsStore.fetchTransactions()
        ])
      } catch (error) {
        notifications.error('Gagal memuat data')
        console.error('Error loading data:', error)
      } finally {
        loading.value = false
      }
    }

    // Lifecycle
    onMounted(() => {
      loadData()
    })

    return {
      loading,
      showCategoryModal,
      showDeleteModal,
      editingCategory,
      categoryToDelete,
      defaultType,
      filters,
      categories,
      incomeCategories,
      expenseCategories,
      filteredCategories,
      filteredIncomeCategories,
      filteredExpenseCategories,
      mostUsedCategory,
      categoryUsageData,
      chartOptions,
      getCategoryUsageCount,
      openCategoryModal,
      closeCategoryModal,
      editCategory,
      confirmDelete,
      deleteCategory,
      toggleCategoryStatus,
      handleCategorySuccess
    }
  }
}
</script>

<style scoped>
.categories-page {
  padding: 1.5rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 600;
  color: var(--bs-gray-900);
  margin-bottom: 0.25rem;
}

.page-subtitle {
  font-size: 1rem;
  margin-bottom: 0;
}

.stats-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border-radius: 0.75rem;
  transition: transform 0.2s ease;
}

.stats-card:hover {
  transform: translateY(-2px);
}

.category-item {
  border: none;
  border-bottom: 1px solid var(--bs-gray-200);
  padding: 1rem;
  transition: background-color 0.2s ease;
}

.category-item:hover {
  background-color: var(--bs-gray-50);
}

.category-item:last-child {
  border-bottom: none;
}

.category-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.list-group-flush .list-group-item:first-child {
  border-top: none;
}

.list-group-flush .list-group-item:last-child {
  border-bottom: none;
}

/* Responsive */
@media (max-width: 768px) {
  .categories-page {
    padding: 1rem;
  }
  
  .page-header .row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .stats-card .card-body {
    padding: 1rem;
  }
  
  .stats-card .card-title {
    font-size: 1.5rem;
  }
  
  .category-item {
    padding: 0.75rem;
  }
  
  .category-icon {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
  
  .btn-group-sm .btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }
}
</style>


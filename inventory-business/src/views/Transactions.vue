<template>
  <div class="transactions-page">
    <!-- Page Header -->
    <div class="page-header mb-4">
      <div class="row align-items-center">
        <div class="col">
          <h1 class="page-title">Transaksi</h1>
          <p class="page-subtitle text-muted">
            Kelola semua transaksi keuangan Anda
          </p>
        </div>
        <div class="col-auto">
          <button
            class="btn btn-primary"
            @click="openTransactionModal()"
          >
            <i class="bi bi-plus-circle me-2"></i>
            Tambah Transaksi
          </button>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <label class="form-label">Periode</label>
            <select v-model="filters.period" class="form-select">
              <option value="">Semua Periode</option>
              <option value="today">Hari Ini</option>
              <option value="week">Minggu Ini</option>
              <option value="month">Bulan Ini</option>
              <option value="year">Tahun Ini</option>
              <option value="custom">Kustom</option>
            </select>
          </div>

          <div class="col-md-3">
            <label class="form-label">Tipe</label>
            <select v-model="filters.type" class="form-select">
              <option value="">Semua Tipe</option>
              <option value="income">Pemasukan</option>
              <option value="expense">Pengeluaran</option>
            </select>
          </div>

          <div class="col-md-3">
            <label class="form-label">Kategori</label>
            <select v-model="filters.category" class="form-select">
              <option value="">Semua Kategori</option>
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>

          <div class="col-md-3">
            <label class="form-label">Cari</label>
            <div class="input-group">
              <input
                v-model="filters.search"
                type="text"
                class="form-control"
                placeholder="Cari transaksi..."
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

          <!-- Custom Date Range -->
          <template v-if="filters.period === 'custom'">
            <div class="col-md-3">
              <label class="form-label">Dari Tanggal</label>
              <input
                v-model="filters.startDate"
                type="date"
                class="form-control"
              >
            </div>
            <div class="col-md-3">
              <label class="form-label">Sampai Tanggal</label>
              <input
                v-model="filters.endDate"
                type="date"
                class="form-control"
              >
            </div>
          </template>

          <div class="col-12">
            <button
              class="btn btn-outline-secondary me-2"
              @click="resetFilters"
            >
              <i class="bi bi-arrow-clockwise me-2"></i>
              Reset Filter
            </button>
            <button
              class="btn btn-outline-success"
              @click="exportTransactions"            >
              <i class="bi bi-download me-2"></i>
              Export Excel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="row mb-4">
      <div class="col-md-4">
        <div class="card summary-card income">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-subtitle mb-1">Total Pemasukan</h6>
                <h4 class="card-title mb-0">{{ formatCurrency(summary.totalIncome) }}</h4>
              </div>
              <i class="bi bi-arrow-down-circle fs-2"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card summary-card expense">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-subtitle mb-1">Total Pengeluaran</h6>
                <h4 class="card-title mb-0">{{ formatCurrency(summary.totalExpense) }}</h4>
              </div>
              <i class="bi bi-arrow-up-circle fs-2"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card summary-card balance">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-subtitle mb-1">Saldo Bersih</h6>
                <h4 class="card-title mb-0">{{ formatCurrency(summary.balance) }}</h4>
              </div>
              <i class="bi bi-wallet2 fs-2"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Transactions Table -->
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="card-title mb-0">
          Daftar Transaksi ({{ filteredTransactions.length }})
        </h5>
        <div class="d-flex gap-2">
          <div class="btn-group btn-group-sm">
            <button
              class="btn"
              :class="viewMode === 'table' ? 'btn-primary' : 'btn-outline-primary'"
              @click="viewMode = 'table'"
            >
              <i class="bi bi-table"></i>
            </button>
            <button
              class="btn"
              :class="viewMode === 'card' ? 'btn-primary' : 'btn-outline-primary'"
              @click="viewMode = 'card'"
            >
              <i class="bi bi-grid"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="card-body p-0">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2 text-muted">Memuat transaksi...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredTransactions.length === 0" class="text-center py-5">
          <i class="bi bi-receipt display-1 text-muted"></i>
          <h5 class="mt-3">Tidak ada transaksi</h5>
          <p class="text-muted">
            {{ hasFilters ? 'Tidak ada transaksi yang sesuai dengan filter' : 'Belum ada transaksi yang ditambahkan' }}
          </p>
          <button
            v-if="!hasFilters"
            class="btn btn-primary"
            @click="openTransactionModal()"
          >
            <i class="bi bi-plus-circle me-2"></i>
            Tambah Transaksi Pertama
          </button>
        </div>

        <!-- Table View -->
        <div v-else-if="viewMode === 'table'" class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>
                  <button
                    class="btn btn-sm btn-link p-0 text-decoration-none"
                    @click="sortBy('date')"
                  >
                    Tanggal
                    <i
                      class="bi"
                      :class="getSortIcon('date')"
                    ></i>
                  </button>
                </th>
                <th>Deskripsi</th>
                <th>Kategori</th>
                <th>
                  <button
                    class="btn btn-sm btn-link p-0 text-decoration-none"
                    @click="sortBy('amount')"
                  >
                    Jumlah
                    <i
                      class="bi"
                      :class="getSortIcon('amount')"
                    ></i>
                  </button>
                </th>
                <th>Tipe</th>
                <th width="100">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="transaction in paginatedTransactions"
                :key="transaction.id"
                class="transaction-row"
              >
                <td>
                  <div class="fw-medium">{{ formatDate(transaction.date) }}</div>
                  <small class="text-muted">{{ formatTime(transaction.date) }}</small>
                </td>
                <td>
                  <div class="fw-medium">{{ transaction.description }}</div>
                  <small v-if="transaction.notes" class="text-muted">
                    {{ transaction.notes }}
                  </small>
                </td>
                <td>
                  <span class="badge bg-light text-dark">
                    {{ transaction.category?.name || 'Tidak ada kategori' }}
                  </span>
                </td>
                <td>
                  <span
                    class="fw-bold"
                    :class="transaction.type === 'income' ? 'text-success' : 'text-danger'"
                  >
                    {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
                  </span>
                </td>
                <td>
                  <span
                    class="badge"
                    :class="transaction.type === 'income' ? 'bg-success' : 'bg-danger'"
                  >
                    {{ transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran' }}
                  </span>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button
                      class="btn btn-outline-primary"
                      @click="editTransaction(transaction)"
                      title="Edit"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button
                      class="btn btn-outline-danger"
                      @click="confirmDelete(transaction)"
                      title="Hapus"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Card View -->
        <div v-else class="p-3">
          <div class="row">
            <div
              v-for="transaction in paginatedTransactions"
              :key="transaction.id"
              class="col-md-6 col-lg-4 mb-3"
            >
              <div class="card transaction-card h-100">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <span
                      class="badge"
                      :class="transaction.type === 'income' ? 'bg-success' : 'bg-danger'"
                    >
                      {{ transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran' }}
                    </span>
                    <div class="dropdown">
                      <button
                        class="btn btn-sm btn-outline-secondary"
                        data-bs-toggle="dropdown"
                      >
                        <i class="bi bi-three-dots"></i>
                      </button>
                      <ul class="dropdown-menu">
                        <li>
                          <button
                            class="dropdown-item"
                            @click="editTransaction(transaction)"
                          >
                            <i class="bi bi-pencil me-2"></i>
                            Edit
                          </button>
                        </li>
                        <li>
                          <button
                            class="dropdown-item text-danger"
                            @click="confirmDelete(transaction)"
                          >
                            <i class="bi bi-trash me-2"></i>
                            Hapus
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <h6 class="card-title">{{ transaction.description }}</h6>
                  
                  <p
                    class="card-text fw-bold fs-5"
                    :class="transaction.type === 'income' ? 'text-success' : 'text-danger'"
                  >
                    {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
                  </p>
                  
                  <div class="d-flex justify-content-between align-items-center">
                    <small class="text-muted">
                      {{ transaction.category?.name || 'Tidak ada kategori' }}
                    </small>
                    <small class="text-muted">
                      {{ formatDate(transaction.date) }}
                    </small>
                  </div>
                  
                  <div v-if="transaction.notes" class="mt-2">
                    <small class="text-muted">{{ transaction.notes }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="card-footer">
          <nav>
            <ul class="pagination pagination-sm justify-content-center mb-0">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button
                  class="page-link"
                  @click="currentPage = 1"
                  :disabled="currentPage === 1"
                >
                  <i class="bi bi-chevron-double-left"></i>
                </button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button
                  class="page-link"
                  @click="currentPage--"
                  :disabled="currentPage === 1"
                >
                  <i class="bi bi-chevron-left"></i>
                </button>
              </li>
              
              <li
                v-for="page in visiblePages"
                :key="page"
                class="page-item"
                :class="{ active: page === currentPage }"
              >
                <button
                  class="page-link"
                  @click="currentPage = page"
                >
                  {{ page }}
                </button>
              </li>
              
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button
                  class="page-link"
                  @click="currentPage++"
                  :disabled="currentPage === totalPages"
                >
                  <i class="bi bi-chevron-right"></i>
                </button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button
                  class="page-link"
                  @click="currentPage = totalPages"
                  :disabled="currentPage === totalPages"
                >
                  <i class="bi bi-chevron-double-right"></i>
                </button>
              </li>
            </ul>
          </nav>
          
          <div class="text-center mt-2">
            <small class="text-muted">
              Menampilkan {{ ((currentPage - 1) * itemsPerPage) + 1 }} - 
              {{ Math.min(currentPage * itemsPerPage, filteredTransactions.length) }} 
              dari {{ filteredTransactions.length }} transaksi
            </small>
          </div>
        </div>
      </div>
    </div>

    <!-- Transaction Modal -->
    <Modal
      v-if="showTransactionModal"
      :show="showTransactionModal"
      :title="editingTransaction ? 'Edit Transaksi' : 'Tambah Transaksi'"
      size="lg"
      @close="closeTransactionModal"
    >
      <TransactionForm
        :transaction="editingTransaction"
        @success="handleTransactionSuccess"
        @cancel="closeTransactionModal"
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
        <h5 class="mt-3">Hapus Transaksi?</h5>
        <p class="text-muted">
          Apakah Anda yakin ingin menghapus transaksi "{{ transactionToDelete?.description }}"?
          Tindakan ini tidak dapat dibatalkan.
        </p>
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
          @click="deleteTransaction"
          :disabled="loading"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          Hapus
        </button>
      </template>
    </Modal>
  </div>
</template>

<script>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { useTransactionsStore } from '@/stores/transactions'
import { useCategoriesStore } from '@/stores/categories'
import { useNotificationStore } from '@/stores/notifications'
import Modal from '@/components/Modal.vue'
import TransactionForm from '@/components/TransactionForm.vue'

export default {
  name: 'Transactions',
  components: {
    Modal,
    TransactionForm
  },
  setup() {
    const transactionsStore = useTransactionsStore()
    const categoriesStore = useCategoriesStore()
    const notifications = useNotificationStore()

    // Reactive data
    const loading = ref(false)
    const viewMode = ref('table')
    const currentPage = ref(1)
    const itemsPerPage = ref(10)
    const sortField = ref('date')
    const sortDirection = ref('desc')
    
    const showTransactionModal = ref(false)
    const showDeleteModal = ref(false)
    const editingTransaction = ref(null)
    const transactionToDelete = ref(null)

    // Filters
    const filters = reactive({
      period: '',
      type: '',
      category: '',
      search: '',
      startDate: '',
      endDate: ''
    })

    // Computed properties
    const categories = computed(() => categoriesStore.categories)

    const filteredTransactions = computed(() => {
      let transactions = [...transactionsStore.transactions]

      // Filter by period
      if (filters.period && filters.period !== 'custom') {
        transactions = transactionsStore.getTransactionsByPeriod(filters.period)
      }

      // Filter by custom date range
      if (filters.period === 'custom' && filters.startDate && filters.endDate) {
        transactions = transactions.filter(t => {
          const transactionDate = new Date(t.date).toISOString().split('T')[0]
          return transactionDate >= filters.startDate && transactionDate <= filters.endDate
        })
      }

      // Filter by type
      if (filters.type) {
        transactions = transactions.filter(t => t.type === filters.type)
      }

      // Filter by category
      if (filters.category) {
        transactions = transactions.filter(t => t.category_id === filters.category)
      }

      // Filter by search
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        transactions = transactions.filter(t =>
          t.description.toLowerCase().includes(searchTerm) ||
          t.notes?.toLowerCase().includes(searchTerm) ||
          t.category?.name.toLowerCase().includes(searchTerm)
        )
      }

      // Sort transactions
      transactions.sort((a, b) => {
        let aValue = a[sortField.value]
        let bValue = b[sortField.value]

        if (sortField.value === 'date') {
          aValue = new Date(aValue)
          bValue = new Date(bValue)
        }

        if (sortDirection.value === 'asc') {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })

      return transactions
    })

    const paginatedTransactions = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredTransactions.value.slice(start, end)
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredTransactions.value.length / itemsPerPage.value)
    })

    const visiblePages = computed(() => {
      const pages = []
      const total = totalPages.value
      const current = currentPage.value
      
      if (total <= 7) {
        for (let i = 1; i <= total; i++) {
          pages.push(i)
        }
      } else {
        if (current <= 4) {
          for (let i = 1; i <= 5; i++) {
            pages.push(i)
          }
          pages.push('...')
          pages.push(total)
        } else if (current >= total - 3) {
          pages.push(1)
          pages.push('...')
          for (let i = total - 4; i <= total; i++) {
            pages.push(i)
          }
        } else {
          pages.push(1)
          pages.push('...')
          for (let i = current - 1; i <= current + 1; i++) {
            pages.push(i)
          }
          pages.push('...')
          pages.push(total)
        }
      }
      
      return pages.filter(page => page !== '...' || pages.indexOf(page) === pages.lastIndexOf(page))
    })

    const summary = computed(() => {
      const transactions = filteredTransactions.value
      const income = transactions.filter(t => t.type === 'income')
      const expense = transactions.filter(t => t.type === 'expense')

      const totalIncome = income.reduce((sum, t) => sum + t.amount, 0)
      const totalExpense = expense.reduce((sum, t) => sum + t.amount, 0)
      const balance = totalIncome - totalExpense

      return {
        totalIncome,
        totalExpense,
        balance
      }
    })

    const hasFilters = computed(() => {
      return filters.period || filters.type || filters.category || filters.search
    })

    // Methods
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(amount)
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    }

    const formatTime = (date) => {
      return new Date(date).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const sortBy = (field) => {
      if (sortField.value === field) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
      } else {
        sortField.value = field
        sortDirection.value = 'desc'
      }
      currentPage.value = 1
    }

    const getSortIcon = (field) => {
      if (sortField.value !== field) {
        return 'bi-arrow-down-up'
      }
      return sortDirection.value === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down'
    }

    const resetFilters = () => {
      Object.keys(filters).forEach(key => {
        filters[key] = ''
      })
      currentPage.value = 1
    }

    const openTransactionModal = (transaction = null) => {
      editingTransaction.value = transaction
      showTransactionModal.value = true
    }

    const closeTransactionModal = () => {
      showTransactionModal.value = false
      editingTransaction.value = null
    }

    const editTransaction = (transaction) => {
      openTransactionModal(transaction)
    }

    const confirmDelete = (transaction) => {
      transactionToDelete.value = transaction
      showDeleteModal.value = true
    }

    const deleteTransaction = async () => {
      if (!transactionToDelete.value) return

      loading.value = true
      try {
        await transactionsStore.deleteTransaction(transactionToDelete.value.id)
        notifications.success('Transaksi berhasil dihapus')
        showDeleteModal.value = false
        transactionToDelete.value = null
      } catch (error) {
        notifications.error('Gagal menghapus transaksi')
        console.error('Error deleting transaction:', error)
      } finally {
        loading.value = false
      }
    }

    const handleTransactionSuccess = () => {
      closeTransactionModal()
      loadData()
    }

    const exportTransactions = () => {
      // Implementation for exporting transactions to Excel
      const data = filteredTransactions.value.map(t => ({
        Tanggal: formatDate(t.date),
        Deskripsi: t.description,
        Kategori: t.category?.name || 'Tidak ada kategori',
        Tipe: t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
        Jumlah: t.amount,
        Catatan: t.notes || ''
      }))

      // Simple CSV export (you can use a library like xlsx for better Excel support)
      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n')

      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `transaksi_${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)

      notifications.success('Data transaksi berhasil diekspor')
    }

    const loadData = async () => {
      loading.value = true
      try {
        await Promise.all([
          transactionsStore.fetchTransactions(),
          categoriesStore.fetchCategories()
        ])
      } catch (error) {
        notifications.error('Gagal memuat data')
        console.error('Error loading data:', error)
      } finally {
        loading.value = false
      }
    }

    // Watchers
    watch(
      () => [filters.period, filters.type, filters.category, filters.search, filters.startDate, filters.endDate],
      () => {
        currentPage.value = 1
      }
    )

    // Lifecycle
    onMounted(() => {
      loadData()
    })

    return {
      loading,
      viewMode,
      currentPage,
      itemsPerPage,
      sortField,
      sortDirection,
      showTransactionModal,
      showDeleteModal,
      editingTransaction,
      transactionToDelete,
      filters,
      categories,
      filteredTransactions,
      paginatedTransactions,
      totalPages,
      visiblePages,
      summary,
      hasFilters,
      formatCurrency,
      formatDate,
      formatTime,
      sortBy,
      getSortIcon,
      resetFilters,
      openTransactionModal,
      closeTransactionModal,
      editTransaction,
      confirmDelete,
      deleteTransaction,
      handleTransactionSuccess,
      exportTransactions
    }
  }
}
</script>

<style scoped>
.transactions-page {
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

.summary-card {
  border: none;
  border-radius: 1rem;
  overflow: hidden;
  transition: transform 0.2s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
}

.summary-card.income {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
}

.summary-card.expense {
  background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);
  color: white;
}

.summary-card.balance {
  background: linear-gradient(135deg, #007bff 0%, #6f42c1 100%);
  color: white;
}

.transaction-row {
  transition: background-color 0.2s ease;
}

.transaction-row:hover {
  background-color: var(--bs-gray-50);
}

.transaction-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border-radius: 0.75rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.transaction-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
}

.btn-link {
  color: var(--bs-gray-700);
  text-decoration: none;
}

.btn-link:hover {
  color: var(--bs-primary);
}

.pagination .page-link {
  border-radius: 0.5rem;
  margin: 0 0.125rem;
  border: 1px solid var(--bs-gray-300);
}

.pagination .page-item.active .page-link {
  background: var(--bs-primary);
  border-color: var(--bs-primary);
}

/* Responsive */
@media (max-width: 768px) {
  .transactions-page {
    padding: 1rem;
  }
  
  .page-header .row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .btn-group {
    width: 100%;
  }
  
  .table-responsive {
    font-size: 0.875rem;
  }
  
  .transaction-card {
    margin-bottom: 1rem;
  }
}

@media (max-width: 576px) {
  .summary-card .card-body {
    padding: 1rem;
  }
  
  .summary-card .card-title {
    font-size: 1.25rem;
  }
  
  .btn-group-sm .btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }
}
</style>


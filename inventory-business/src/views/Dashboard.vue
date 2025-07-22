<template>
  <div class="dashboard">
    <!-- Page Header -->
    <div class="page-header mb-4">
      <div class="row align-items-center">
        <div class="col">
          <h1 class="page-title">Dashboard</h1>
          <p class="page-subtitle text-muted">
            Ringkasan keuangan Anda hari ini
          </p>
        </div>
        <div class="col-auto">
          <div class="btn-group">
            <button
              v-for="period in periods"
              :key="period.value"
              class="btn"
              :class="selectedPeriod === period.value ? 'btn-primary' : 'btn-outline-primary'"
              @click="selectedPeriod = period.value"
            >
              {{ period.label }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="row mb-4">
      <div class="col-md-3 mb-3">
        <div class="card summary-card income">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h6 class="card-subtitle mb-2">Total Pemasukan</h6>
                <h3 class="card-title mb-0">{{ formatCurrency(summaryData.totalIncome) }}</h3>
                <small class="text-success">
                  <i class="bi bi-arrow-up"></i>
                  {{ summaryData.incomeGrowth }}% dari periode sebelumnya
                </small>
              </div>
              <div class="summary-icon">
                <i class="bi bi-arrow-down-circle"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3 mb-3">
        <div class="card summary-card expense">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h6 class="card-subtitle mb-2">Total Pengeluaran</h6>
                <h3 class="card-title mb-0">{{ formatCurrency(summaryData.totalExpense) }}</h3>
                <small class="text-danger">
                  <i class="bi bi-arrow-up"></i>
                  {{ summaryData.expenseGrowth }}% dari periode sebelumnya
                </small>
              </div>
              <div class="summary-icon">
                <i class="bi bi-arrow-up-circle"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3 mb-3">
        <div class="card summary-card balance">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h6 class="card-subtitle mb-2">Saldo</h6>
                <h3 class="card-title mb-0">{{ formatCurrency(summaryData.balance) }}</h3>
                <small :class="summaryData.balanceGrowth >= 0 ? 'text-success' : 'text-danger'">
                  <i :class="summaryData.balanceGrowth >= 0 ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
                  {{ Math.abs(summaryData.balanceGrowth) }}% dari periode sebelumnya
                </small>
              </div>
              <div class="summary-icon">
                <i class="bi bi-wallet2"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3 mb-3">
        <div class="card summary-card transactions">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h6 class="card-subtitle mb-2">Total Transaksi</h6>
                <h3 class="card-title mb-0">{{ summaryData.totalTransactions }}</h3>
                <small class="text-info">
                  <i class="bi bi-arrow-up"></i>
                  {{ summaryData.transactionGrowth }}% dari periode sebelumnya
                </small>
              </div>
              <div class="summary-icon">
                <i class="bi bi-receipt"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="row mb-4">
      <!-- Cash Flow Chart -->
      <div class="col-lg-8 mb-4">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0">Arus Kas</h5>
            <div class="btn-group btn-group-sm">
              <button
                v-for="chartPeriod in chartPeriods"
                :key="chartPeriod.value"
                class="btn"
                :class="selectedChartPeriod === chartPeriod.value ? 'btn-primary' : 'btn-outline-primary'"
                @click="selectedChartPeriod = chartPeriod.value"
              >
                {{ chartPeriod.label }}
              </button>
            </div>
          </div>
          <div class="card-body">
            <Chart
              v-if="cashFlowData.labels.length > 0"
              type="line"
              :data="cashFlowData"
              :options="cashFlowOptions"
              height="300"
            />
            <div v-else class="text-center py-5 text-muted">
              <i class="bi bi-graph-up display-4"></i>
              <p class="mt-2">Belum ada data untuk ditampilkan</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Category Distribution -->
      <div class="col-lg-4 mb-4">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Distribusi Kategori</h5>
          </div>
          <div class="card-body">
            <Chart
              v-if="categoryData.labels.length > 0"
              type="doughnut"
              :data="categoryData"
              :options="categoryOptions"
              height="300"
            />
            <div v-else class="text-center py-5 text-muted">
              <i class="bi bi-pie-chart display-4"></i>
              <p class="mt-2">Belum ada data untuk ditampilkan</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Transactions & Quick Actions -->
    <div class="row">
      <!-- Recent Transactions -->
      <div class="col-lg-8 mb-4">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0">Transaksi Terbaru</h5>
            <router-link to="/transactions" class="btn btn-sm btn-outline-primary">
              Lihat Semua
            </router-link>
          </div>
          <div class="card-body p-0">
            <div v-if="loading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else-if="recentTransactions.length === 0" class="text-center py-4 text-muted">
              <i class="bi bi-receipt display-4"></i>
              <p class="mt-2">Belum ada transaksi</p>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-hover mb-0">
                <tbody>
                  <tr v-for="transaction in recentTransactions" :key="transaction.id">
                    <td class="ps-3">
                      <div class="d-flex align-items-center">
                        <div
                          class="transaction-icon me-3"
                          :class="transaction.type === 'income' ? 'bg-success' : 'bg-danger'"
                        >
                          <i
                            :class="transaction.type === 'income' ? 'bi bi-arrow-down' : 'bi bi-arrow-up'"
                          ></i>
                        </div>
                        <div>
                          <div class="fw-medium">{{ transaction.description }}</div>
                          <small class="text-muted">{{ transaction.category?.name }}</small>
                        </div>
                      </div>
                    </td>
                    <td class="text-end">
                      <div
                        class="fw-medium"
                        :class="transaction.type === 'income' ? 'text-success' : 'text-danger'"
                      >
                        {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
                      </div>
                      <small class="text-muted">{{ formatDate(transaction.date) }}</small>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="col-lg-4 mb-4">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Aksi Cepat</h5>
          </div>
          <div class="card-body">
            <div class="d-grid gap-2">
              <button
                class="btn btn-success d-flex align-items-center justify-content-center"
                @click="openTransactionModal('income')"
              >
                <i class="bi bi-plus-circle me-2"></i>
                Tambah Pemasukan
              </button>
              <button
                class="btn btn-danger d-flex align-items-center justify-content-center"
                @click="openTransactionModal('expense')"
              >
                <i class="bi bi-dash-circle me-2"></i>
                Tambah Pengeluaran
              </button>
              <router-link
                to="/categories"
                class="btn btn-outline-primary d-flex align-items-center justify-content-center"
              >
                <i class="bi bi-tags me-2"></i>
                Kelola Kategori
              </router-link>
              <router-link
                to="/reports"
                class="btn btn-outline-info d-flex align-items-center justify-content-center"
              >
                <i class="bi bi-graph-up me-2"></i>
                Lihat Laporan
              </router-link>
            </div>
          </div>
        </div>

        <!-- Monthly Budget Progress -->
        <div class="card mt-3">
          <div class="card-header">
            <h5 class="card-title mb-0">Budget Bulanan</h5>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <div class="d-flex justify-content-between mb-1">
                <small class="text-muted">Pengeluaran</small>
                <small class="text-muted">
                  {{ formatCurrency(budgetData.spent) }} / {{ formatCurrency(budgetData.limit) }}
                </small>
              </div>
              <div class="progress">
                <div
                  class="progress-bar"
                  :class="budgetData.percentage > 80 ? 'bg-danger' : budgetData.percentage > 60 ? 'bg-warning' : 'bg-success'"
                  :style="{ width: Math.min(budgetData.percentage, 100) + '%' }"
                ></div>
              </div>
              <small
                class="text-muted"
                :class="budgetData.percentage > 100 ? 'text-danger' : ''"
              >
                {{ budgetData.percentage.toFixed(1) }}% terpakai
              </small>
            </div>
            <div v-if="budgetData.percentage > 80" class="alert alert-warning alert-sm">
              <i class="bi bi-exclamation-triangle me-2"></i>
              <small>Budget hampir habis!</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Transaction Modal -->
    <Modal
      v-if="showTransactionModal"
      :show="showTransactionModal"
      title="Tambah Transaksi"
      size="lg"
      @close="closeTransactionModal"
    >
      <TransactionForm
        :type="transactionType"
        @success="handleTransactionSuccess"
        @cancel="closeTransactionModal"
      />
    </Modal>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useTransactionsStore } from '@/stores/transactions'
import { useCategoriesStore } from '@/stores/categories'
import Chart from '@/components/Chart.vue'
import Modal from '@/components/Modal.vue'
import TransactionForm from '@/components/TransactionForm.vue'

export default {
  name: 'Dashboard',
  components: {
    Chart,
    Modal,
    TransactionForm
  },
  setup() {
    const transactionsStore = useTransactionsStore()
    const categoriesStore = useCategoriesStore()

    // Reactive data
    const loading = ref(false)
    const selectedPeriod = ref('month')
    const selectedChartPeriod = ref('week')
    const showTransactionModal = ref(false)
    const transactionType = ref('income')

    // Period options
    const periods = [
      { label: 'Hari Ini', value: 'today' },
      { label: 'Minggu Ini', value: 'week' },
      { label: 'Bulan Ini', value: 'month' },
      { label: 'Tahun Ini', value: 'year' }
    ]

    const chartPeriods = [
      { label: '7 Hari', value: 'week' },
      { label: '30 Hari', value: 'month' },
      { label: '90 Hari', value: 'quarter' }
    ]

    // Computed properties
    const summaryData = computed(() => {
      const transactions = transactionsStore.getTransactionsByPeriod(selectedPeriod.value)
      const income = transactions.filter(t => t.type === 'income')
      const expense = transactions.filter(t => t.type === 'expense')

      const totalIncome = income.reduce((sum, t) => sum + t.amount, 0)
      const totalExpense = expense.reduce((sum, t) => sum + t.amount, 0)
      const balance = totalIncome - totalExpense

      return {
        totalIncome,
        totalExpense,
        balance,
        totalTransactions: transactions.length,
        incomeGrowth: 12.5, // Mock data - should be calculated
        expenseGrowth: 8.3,
        balanceGrowth: 15.2,
        transactionGrowth: 5.7
      }
    })

    const recentTransactions = computed(() => {
      return transactionsStore.transactions
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
    })

    const cashFlowData = computed(() => {
      const transactions = transactionsStore.getTransactionsByPeriod(selectedChartPeriod.value)
      const groupedData = groupTransactionsByDate(transactions)
      
      const labels = Object.keys(groupedData).sort()
      const incomeData = []
      const expenseData = []

      labels.forEach(date => {
        const dayTransactions = groupedData[date]
        const income = dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
        const expense = dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
        
        incomeData.push(income)
        expenseData.push(expense)
      })

      return {
        labels: labels.map(date => formatDateLabel(date)),
        datasets: [
          {
            label: 'Pemasukan',
            data: incomeData,
            borderColor: '#28a745',
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Pengeluaran',
            data: expenseData,
            borderColor: '#dc3545',
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      }
    })

    const categoryData = computed(() => {
      const transactions = transactionsStore.getTransactionsByPeriod(selectedPeriod.value)
      const expenseTransactions = transactions.filter(t => t.type === 'expense')
      
      const categoryTotals = {}
      expenseTransactions.forEach(transaction => {
        const categoryName = transaction.category?.name || 'Lainnya'
        categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + transaction.amount
      })

      const labels = Object.keys(categoryTotals)
      const data = Object.values(categoryTotals)
      const colors = generateColors(labels.length)

      return {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderWidth: 0
        }]
      }
    })

    const budgetData = computed(() => {
      const monthlyExpense = summaryData.value.totalExpense
      const budgetLimit = 5000000 // Mock budget limit
      const percentage = (monthlyExpense / budgetLimit) * 100

      return {
        spent: monthlyExpense,
        limit: budgetLimit,
        percentage
      }
    })

    // Chart options
    const cashFlowOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return formatCurrency(value)
            }
          }
        }
      }
    }

    const categoryOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }

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
        month: 'short'
      })
    }

    const formatDateLabel = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short'
      })
    }

    const groupTransactionsByDate = (transactions) => {
      return transactions.reduce((groups, transaction) => {
        const date = transaction.date.split('T')[0] // Get date part only
        if (!groups[date]) {
          groups[date] = []
        }
        groups[date].push(transaction)
        return groups
      }, {})
    }

    const generateColors = (count) => {
      const colors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
        '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
      ]
      return Array.from({ length: count }, (_, i) => colors[i % colors.length])
    }

    const openTransactionModal = (type) => {
      transactionType.value = type
      showTransactionModal.value = true
    }

    const closeTransactionModal = () => {
      showTransactionModal.value = false
    }

    const handleTransactionSuccess = () => {
      closeTransactionModal()
      loadData()
    }

    const loadData = async () => {
      loading.value = true
      try {
        await Promise.all([
          transactionsStore.fetchTransactions(),
          categoriesStore.fetchCategories()
        ])
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        loading.value = false
      }
    }

    // Watchers
    watch(selectedPeriod, () => {
      // Refresh data when period changes
    })

    watch(selectedChartPeriod, () => {
      // Refresh chart data when chart period changes
    })

    // Lifecycle
    onMounted(() => {
      loadData()
    })

    return {
      loading,
      selectedPeriod,
      selectedChartPeriod,
      showTransactionModal,
      transactionType,
      periods,
      chartPeriods,
      summaryData,
      recentTransactions,
      cashFlowData,
      categoryData,
      budgetData,
      cashFlowOptions,
      categoryOptions,
      formatCurrency,
      formatDate,
      openTransactionModal,
      closeTransactionModal,
      handleTransactionSuccess
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 1.5rem;
}

.page-header {
  margin-bottom: 2rem;
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

.summary-card.transactions {
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
  color: white;
}

.summary-icon {
  font-size: 2rem;
  opacity: 0.7;
}

.transaction-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.alert-sm {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}

.btn-group .btn {
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }
  
  .page-header .row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .btn-group {
    width: 100%;
  }
  
  .btn-group .btn {
    flex: 1;
  }
}
</style>


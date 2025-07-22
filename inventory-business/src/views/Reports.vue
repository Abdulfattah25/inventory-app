<template>
  <div class="reports-page">
    <!-- Page Header -->
    <div class="page-header mb-4">
      <div class="row align-items-center">
        <div class="col">
          <h1 class="page-title">Laporan</h1>
          <p class="page-subtitle text-muted">
            Analisis dan laporan keuangan bisnis Anda
          </p>
        </div>
        <div class="col-auto">
          <div class="btn-group">
            <button
              class="btn btn-outline-secondary"
              @click="exportReport"
            >
              <i class="bi bi-download me-2"></i>
              Export PDF
            </button>
            <button
              class="btn btn-primary"
              @click="refreshData"
              :disabled="loading"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="bi bi-arrow-clockwise me-2"></i>
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Period Filter -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <label class="form-label">Periode</label>
            <select v-model="selectedPeriod" class="form-select">
              <option value="today">Hari Ini</option>
              <option value="yesterday">Kemarin</option>
              <option value="this_week">Minggu Ini</option>
              <option value="last_week">Minggu Lalu</option>
              <option value="this_month">Bulan Ini</option>
              <option value="last_month">Bulan Lalu</option>
              <option value="this_year">Tahun Ini</option>
              <option value="custom">Kustom</option>
            </select>
          </div>
          <div v-if="selectedPeriod === 'custom'" class="col-md-3">
            <label class="form-label">Tanggal Mulai</label>
            <input
              v-model="customDateRange.start"
              type="date"
              class="form-control"
            >
          </div>
          <div v-if="selectedPeriod === 'custom'" class="col-md-3">
            <label class="form-label">Tanggal Akhir</label>
            <input
              v-model="customDateRange.end"
              type="date"
              class="form-control"
            >
          </div>
          <div class="col-md-3">
            <label class="form-label">Tipe Laporan</label>
            <select v-model="reportType" class="form-select">
              <option value="summary">Ringkasan</option>
              <option value="detailed">Detail</option>
              <option value="category">Per Kategori</option>
              <option value="trend">Tren</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="card summary-card income">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>                 <h6 class="card-subtitle mb-1 text-white-50">Total Pemasukan</h6>
                <h3 class="card-title mb-0 text-white">{{ formatCurrency(reportData.totalIncome) }}</h3>
                <small class="text-white-50">
                  <i class="bi bi-arrow-up me-1"></i>
                  {{ reportData.incomeGrowth }}% dari periode sebelumnya
                </small>
              </div>
              <i class="bi bi-arrow-down-circle fs-2 text-white-50"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card summary-card expense">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-subtitle mb-1 text-white-50">Total Pengeluaran</h6>
                <h3 class="card-title mb-0 text-white">{{ formatCurrency(reportData.totalExpense) }}</h3>
                <small class="text-white-50">
                  <i class="bi bi-arrow-down me-1"></i>
                  {{ reportData.expenseGrowth }}% dari periode sebelumnya
                </small>
              </div>
              <i class="bi bi-arrow-up-circle fs-2 text-white-50"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card summary-card" :class="reportData.netIncome >= 0 ? 'income' : 'expense'">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-subtitle mb-1 text-white-50">Keuntungan Bersih</h6>
                <h3 class="card-title mb-0 text-white">{{ formatCurrency(reportData.netIncome) }}</h3>
                <small class="text-white-50">
                  <i :class="reportData.netIncome >= 0 ? 'bi bi-arrow-up' : 'bi bi-arrow-down'" class="me-1"></i>
                  {{ Math.abs(reportData.netGrowth) }}% dari periode sebelumnya
                </small>
              </div>
              <i class="bi bi-graph-up fs-2 text-white-50"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card summary-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-subtitle mb-1 text-white-50">Total Transaksi</h6>
                <h3 class="card-title mb-0 text-white">{{ reportData.totalTransactions }}</h3>
                <small class="text-white-50">
                  <i class="bi bi-arrow-up me-1"></i>
                  {{ reportData.transactionGrowth }}% dari periode sebelumnya
                </small>
              </div>
              <i class="bi bi-receipt fs-2 text-white-50"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="row mb-4">
      <!-- Income vs Expense Chart -->
      <div class="col-lg-8">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0">Tren Pemasukan vs Pengeluaran</h5>
            <div class="btn-group btn-group-sm">
              <button
                class="btn"
                :class="chartPeriod === 'daily' ? 'btn-primary' : 'btn-outline-primary'"
                @click="chartPeriod = 'daily'"
              >
                Harian
              </button>
              <button
                class="btn"
                :class="chartPeriod === 'weekly' ? 'btn-primary' : 'btn-outline-primary'"
                @click="chartPeriod = 'weekly'"
              >
                Mingguan
              </button>
              <button
                class="btn"
                :class="chartPeriod === 'monthly' ? 'btn-primary' : 'btn-outline-primary'"
                @click="chartPeriod = 'monthly'"
              >
                Bulanan
              </button>
            </div>
          </div>
          <div class="card-body">
            <Chart
              v-if="trendChartData.labels.length > 0"
              type="line"
              :data="trendChartData"
              :options="trendChartOptions"
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
      <div class="col-lg-4">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0">Distribusi Kategori</h5>
            <div class="btn-group btn-group-sm">
              <button
                class="btn"
                :class="categoryChartType === 'income' ? 'btn-success' : 'btn-outline-success'"
                @click="categoryChartType = 'income'"
              >
                Pemasukan
              </button>
              <button
                class="btn"
                :class="categoryChartType === 'expense' ? 'btn-danger' : 'btn-outline-danger'"
                @click="categoryChartType = 'expense'"
              >
                Pengeluaran
              </button>
            </div>
          </div>
          <div class="card-body">
            <Chart
              v-if="categoryChartData.labels.length > 0"
              type="doughnut"
              :data="categoryChartData"
              :options="categoryChartOptions"
              height="300"
            />
            <div v-else class="text-center py-5 text-muted">
              <i class="bi bi-pie-chart display-4"></i>
              <p class="mt-2">Belum ada data kategori</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Reports -->
    <div class="row">
      <!-- Top Categories -->
      <div class="col-lg-6">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Kategori Teratas</h5>
          </div>
          <div class="card-body p-0">
            <div v-if="topCategories.length === 0" class="text-center py-4 text-muted">
              <i class="bi bi-tags display-4"></i>
              <p class="mt-2">Belum ada data kategori</p>
            </div>
            <div v-else class="list-group list-group-flush">
              <div
                v-for="(category, index) in topCategories"
                :key="category.id"
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                <div class="d-flex align-items-center">
                  <div class="ranking-badge me-3">
                    {{ index + 1 }}
                  </div>
                  <div>
                    <h6 class="mb-1">{{ category.name }}</h6>
                    <small class="text-muted">
                      {{ category.transaction_count }} transaksi
                    </small>
                  </div>
                </div>
                <div class="text-end">
                  <div class="fw-bold" :class="category.type === 'income' ? 'text-success' : 'text-danger'">
                    {{ formatCurrency(category.total_amount) }}
                  </div>
                  <small class="text-muted">
                    {{ ((category.total_amount / (reportData.totalIncome + reportData.totalExpense)) * 100).toFixed(1) }}%
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Large Transactions -->
      <div class="col-lg-6">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Transaksi Besar Terbaru</h5>
          </div>
          <div class="card-body p-0">
            <div v-if="largeTransactions.length === 0" class="text-center py-4 text-muted">
              <i class="bi bi-receipt display-4"></i>
              <p class="mt-2">Belum ada transaksi besar</p>
            </div>
            <div v-else class="list-group list-group-flush">
              <div
                v-for="transaction in largeTransactions"
                :key="transaction.id"
                class="list-group-item"
              >
                <div class="d-flex justify-content-between align-items-start">
                  <div class="d-flex align-items-center">
                    <div
                      class="transaction-icon me-3"
                      :class="transaction.type === 'income' ? 'bg-success' : 'bg-danger'"
                    >
                      <i :class="transaction.type === 'income' ? 'bi bi-arrow-down' : 'bi bi-arrow-up'"></i>
                    </div>
                    <div>
                      <h6 class="mb-1">{{ transaction.description }}</h6>
                      <small class="text-muted">
                        {{ transaction.category?.name }} • {{ formatDate(transaction.date) }}
                      </small>
                    </div>
                  </div>
                  <div class="text-end">
                    <div class="fw-bold" :class="transaction.type === 'income' ? 'text-success' : 'text-danger'">
                      {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(transaction.amount) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Monthly Comparison -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Perbandingan Bulanan</h5>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Bulan</th>
                    <th class="text-end">Pemasukan</th>
                    <th class="text-end">Pengeluaran</th>
                    <th class="text-end">Keuntungan</th>
                    <th class="text-end">Transaksi</th>
                    <th class="text-end">Pertumbuhan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="month in monthlyComparison"
                    :key="month.month"
                    class="month-row"
                  >
                    <td>
                      <div class="fw-medium">{{ month.monthName }}</div>
                      <small class="text-muted">{{ month.year }}</small>
                    </td>
                    <td class="text-end text-success">
                      {{ formatCurrency(month.income) }}
                    </td>
                    <td class="text-end text-danger">
                      {{ formatCurrency(month.expense) }}
                    </td>
                    <td class="text-end" :class="month.profit >= 0 ? 'text-success' : 'text-danger'">
                      {{ formatCurrency(month.profit) }}
                    </td>
                    <td class="text-end">
                      {{ month.transactions }}
                    </td>
                    <td class="text-end">
                      <span
                        class="badge"
                        :class="month.growth >= 0 ? 'bg-success' : 'bg-danger'"
                      >
                        {{ month.growth >= 0 ? '+' : '' }}{{ month.growth.toFixed(1) }}%
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { useTransactionsStore } from '@/stores/transactions'
import { useCategoriesStore } from '@/stores/categories'
import { useNotificationStore } from '@/stores/notifications'
import Chart from '@/components/Chart.vue'

export default {
  name: 'Reports',
  components: {
    Chart
  },
  setup() {
    const transactionsStore = useTransactionsStore()
    const categoriesStore = useCategoriesStore()
    const notifications = useNotificationStore()

    // Reactive data
    const loading = ref(false)
    const selectedPeriod = ref('this_month')
    const reportType = ref('summary')
    const chartPeriod = ref('daily')
    const categoryChartType = ref('expense')

    const customDateRange = reactive({
      start: '',
      end: ''
    })

    // Computed properties
    const transactions = computed(() => transactionsStore.transactions)
    const categories = computed(() => categoriesStore.categories)

    const filteredTransactions = computed(() => {
      const now = new Date()
      let startDate, endDate

      switch (selectedPeriod.value) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
          break
        case 'yesterday':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
          endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case 'this_week':
          const startOfWeek = now.getDate() - now.getDay()
          startDate = new Date(now.getFullYear(), now.getMonth(), startOfWeek)
          endDate = new Date(now.getFullYear(), now.getMonth(), startOfWeek + 7)
          break
                case 'last_week':
          const lastWeekStart = now.getDate() - now.getDay() - 7
          startDate = new Date(now.getFullYear(), now.getMonth(), lastWeekStart)
          endDate = new Date(now.getFullYear(), now.getMonth(), lastWeekStart + 7)
          break
        case 'this_month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1)
          break
        case 'last_month':
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
          endDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        case 'this_year':
          startDate = new Date(now.getFullYear(), 0, 1)
          endDate = new Date(now.getFullYear() + 1, 0, 1)
          break
        case 'custom':
          if (customDateRange.start && customDateRange.end) {
            startDate = new Date(customDateRange.start)
            endDate = new Date(customDateRange.end)
            endDate.setDate(endDate.getDate() + 1) // Include end date
          } else {
            return []
          }
          break
        default:
          return transactions.value
      }

      return transactions.value.filter(t => {
        const transactionDate = new Date(t.date)
        return transactionDate >= startDate && transactionDate < endDate
      })
    })

    const reportData = computed(() => {
      const filtered = filteredTransactions.value
      const totalIncome = filtered
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)
      
      const totalExpense = filtered
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

      const netIncome = totalIncome - totalExpense
      const totalTransactions = filtered.length

      // Calculate growth (simplified - comparing with previous period)
      const incomeGrowth = Math.random() * 20 - 10 // Mock data
      const expenseGrowth = Math.random() * 20 - 10 // Mock data
      const netGrowth = Math.random() * 30 - 15 // Mock data
      const transactionGrowth = Math.random() * 25 - 5 // Mock data

      return {
        totalIncome,
        totalExpense,
        netIncome,
        totalTransactions,
        incomeGrowth: incomeGrowth.toFixed(1),
        expenseGrowth: expenseGrowth.toFixed(1),
        netGrowth: netGrowth.toFixed(1),
        transactionGrowth: transactionGrowth.toFixed(1)
      }
    })

    const trendChartData = computed(() => {
      const filtered = filteredTransactions.value
      const groupedData = {}

      // Group transactions by period
      filtered.forEach(transaction => {
        const date = new Date(transaction.date)
        let key

        switch (chartPeriod.value) {
          case 'daily':
            key = date.toISOString().split('T')[0]
            break
          case 'weekly':
            const weekStart = new Date(date)
            weekStart.setDate(date.getDate() - date.getDay())
            key = weekStart.toISOString().split('T')[0]
            break
          case 'monthly':
            key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
            break
        }

        if (!groupedData[key]) {
          groupedData[key] = { income: 0, expense: 0 }
        }

        if (transaction.type === 'income') {
          groupedData[key].income += transaction.amount
        } else {
          groupedData[key].expense += transaction.amount
        }
      })

      const sortedKeys = Object.keys(groupedData).sort()
      const labels = sortedKeys.map(key => {
        const date = new Date(key)
        switch (chartPeriod.value) {
          case 'daily':
            return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
          case 'weekly':
            return `Minggu ${date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}`
          case 'monthly':
            return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
          default:
            return key
        }
      })

      const incomeData = sortedKeys.map(key => groupedData[key].income)
      const expenseData = sortedKeys.map(key => groupedData[key].expense)

      return {
        labels,
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

    const trendChartOptions = {
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
              return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
              }).format(value)
            }
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }

    const categoryChartData = computed(() => {
      const filtered = filteredTransactions.value.filter(t => t.type === categoryChartType.value)
      const categoryTotals = {}

      filtered.forEach(transaction => {
        const category = categories.value.find(c => c.id === transaction.category_id)
        const categoryName = category ? category.name : 'Tanpa Kategori'
        
        categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + transaction.amount
      })

      const labels = Object.keys(categoryTotals)
      const data = Object.values(categoryTotals)
      const colors = labels.map((_, index) => {
        const hue = (index * 137.508) % 360
        return `hsl(${hue}, 70%, 60%)`
      })

      return {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderColor: colors.map(color => color.replace('60%', '50%')),
          borderWidth: 2
        }]
      }
    })

    const categoryChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true
          }
        }
      }
    }

    const topCategories = computed(() => {
      const categoryTotals = {}
      
      filteredTransactions.value.forEach(transaction => {
        const category = categories.value.find(c => c.id === transaction.category_id)
        if (category) {
          if (!categoryTotals[category.id]) {
            categoryTotals[category.id] = {
              ...category,
              total_amount: 0,
              transaction_count: 0
            }
          }
          categoryTotals[category.id].total_amount += transaction.amount
          categoryTotals[category.id].transaction_count += 1
        }
      })

      return Object.values(categoryTotals)
        .sort((a, b) => b.total_amount - a.total_amount)
        .slice(0, 5)
    })

    const largeTransactions = computed(() => {
      return filteredTransactions.value
        .map(transaction => ({
          ...transaction,
          category: categories.value.find(c => c.id === transaction.category_id)
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5)
    })

    const monthlyComparison = computed(() => {
      const monthlyData = {}
      const now = new Date()
      
      // Get last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        monthlyData[key] = {
          month: key,
          monthName: date.toLocaleDateString('id-ID', { month: 'long' }),
          year: date.getFullYear(),
          income: 0,
          expense: 0,
          transactions: 0
        }
      }

      transactions.value.forEach(transaction => {
        const date = new Date(transaction.date)
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        
        if (monthlyData[key]) {
          if (transaction.type === 'income') {
            monthlyData[key].income += transaction.amount
          } else {
            monthlyData[key].expense += transaction.amount
          }
          monthlyData[key].transactions += 1
        }
      })

      const months = Object.values(monthlyData)
      
      // Calculate profit and growth
      return months.map((month, index) => {
        const profit = month.income - month.expense
        let growth = 0
        
        if (index > 0) {
          const prevMonth = months[index - 1]
          const prevProfit = prevMonth.income - prevMonth.expense
          if (prevProfit !== 0) {
            growth = ((profit - prevProfit) / Math.abs(prevProfit)) * 100
          }
        }

        return {
          ...month,
          profit,
          growth
        }
      })
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

    const refreshData = async () => {
      loading.value = true
      try {
        await Promise.all([
          transactionsStore.fetchTransactions(),
          categoriesStore.fetchCategories()
        ])
        notifications.success('Data berhasil diperbarui')
      } catch (error) {
        notifications.error('Gagal memperbarui data')
        console.error('Error refreshing data:', error)
      } finally {
        loading.value = false
      }
    }

    const exportReport = () => {
      // Simple implementation - in real app, you'd generate a proper PDF
      const reportContent = {
        period: selectedPeriod.value,
        summary: reportData.value,
        topCategories: topCategories.value,
        largeTransactions: largeTransactions.value.slice(0, 10)
      }

      const dataStr = JSON.stringify(reportContent, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `laporan_${selectedPeriod.value}_${new Date().toISOString().split('T')[0]}.json`
      link.click()
      URL.revokeObjectURL(url)

      notifications.success('Laporan berhasil diekspor')
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
    watch(selectedPeriod, () => {
      if (selectedPeriod.value === 'custom') {
        const now = new Date()
        customDateRange.start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
        customDateRange.end = now.toISOString().split('T')[0]
      }
    })

    // Lifecycle
    onMounted(() => {
      loadData()
    })

    return {
      loading,
      selectedPeriod,
      reportType,
      chartPeriod,
      categoryChartType,
      customDateRange,
      reportData,
      trendChartData,
      trendChartOptions,
      categoryChartData,
      categoryChartOptions,
      topCategories,
      largeTransactions,
      monthlyComparison,
      formatCurrency,
      formatDate,
      refreshData,
      exportReport
    }
  }
}
</script>

<style scoped>
.reports-page {
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
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border-radius: 0.75rem;
  transition: transform 0.2s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
}

.summary-card.income {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.summary-card.expense {
  background: linear-gradient(135deg, #fc466b 0%, #3f5efb 100%);
}

.summary-card:not(.income):not(.expense) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.ranking-badge {
  width: 32px;
  height: 32px;
  background: var(--bs-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
    font-size: 0.875rem;
}

.transaction-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.month-row {
  transition: background-color 0.2s ease;
}

.month-row:hover {
  background-color: var(--bs-gray-50);
}

.card {
  border: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border-radius: 0.75rem;
}

.card-header {
  background: var(--bs-gray-50);
  border-bottom: 1px solid var(--bs-gray-200);
  border-radius: 0.75rem 0.75rem 0 0 !important;
}

.list-group-item {
  border-left: none;
  border-right: none;
  padding: 1rem;
}

.list-group-item:first-child {
  border-top: none;
}

.list-group-item:last-child {
  border-bottom: none;
}

/* Responsive */
@media (max-width: 768px) {
  .reports-page {
    padding: 1rem;
  }
  
  .page-header .row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .summary-card .card-body {
    padding: 1rem;
  }
  
  .summary-card .card-title {
    font-size: 1.5rem;
  }
  
  .btn-group {
    flex-direction: column;
  }
  
  .btn-group .btn {
    border-radius: 0.375rem !important;
    margin-bottom: 0.25rem;
  }
  
  .table-responsive {
    font-size: 0.875rem;
  }
  
  .ranking-badge {
    width: 28px;
    height: 28px;
    font-size: 0.75rem;
  }
  
  .transaction-icon {
    width: 36px;
    height: 36px;
  }
}

@media (max-width: 576px) {
  .summary-card .card-title {
    font-size: 1.25rem;
  }
  
  .card-body {
    padding: 0.75rem;
  }
  
  .list-group-item {
    padding: 0.75rem;
  }
}
</style>




import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTransactionsStore = defineStore('transactions', () => {
  // State
  const transactions = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Mock data untuk testing
  const initializeMockData = () => {
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    const yesterday = new Date(now.getTime() - 86400000).toISOString().split('T')[0]
    const lastWeek = new Date(now.getTime() - 7 * 86400000).toISOString().split('T')[0]
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).toISOString().split('T')[0]

    return [
      {
        id: '1',
        type: 'income',
        amount: 5000000,
        description: 'Gaji Bulanan',
        category: { id: '1', name: 'Gaji' },
        date: today,
        payment_method: 'bank_transfer',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        type: 'expense',
        amount: 150000,
        description: 'Belanja Groceries',
        category: { id: '4', name: 'Makanan' },
        date: today,
        payment_method: 'cash',
        created_at: new Date().toISOString()
      },
      {
        id: '3',
        type: 'expense',
        amount: 50000,
        description: 'Bensin Motor',
        category: { id: '5', name: 'Transport' },
        date: yesterday,
        payment_method: 'cash',
        created_at: new Date().toISOString()
      },
      {
        id: '4',
        type: 'income',
        amount: 500000,
        description: 'Freelance Project',
        category: { id: '2', name: 'Freelance' },
        date: lastWeek,
        payment_method: 'bank_transfer',
        created_at: new Date().toISOString()
      },
      {
        id: '5',
        type: 'expense',
        amount: 200000,
        description: 'Makan di Restaurant',
        category: { id: '4', name: 'Makanan' },
        date: lastWeek,
        payment_method: 'credit_card',
        created_at: new Date().toISOString()
      },
      {
        id: '6',
        type: 'expense',
        amount: 75000,
        description: 'Bioskop',
        category: { id: '7', name: 'Hiburan' },
        date: lastMonth,
        payment_method: 'cash',
        created_at: new Date().toISOString()
      }
    ]
  }

  // Getters
  const totalIncome = computed(() => {
    return transactions.value
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
  })

  const totalExpense = computed(() => {
    return transactions.value
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  })

  const balance = computed(() => totalIncome.value - totalExpense.value)

  // Actions
  const fetchTransactions = async () => {
    loading.value = true
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Initialize with mock data if empty
      if (transactions.value.length === 0) {
        transactions.value = initializeMockData()
      }
      
      return transactions.value
    } catch (err) {
      error.value = err.message
      console.error('Error fetching transactions:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getTransactionsByPeriod = (period) => {
    const now = new Date()
    let startDate
    let endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)

    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      default:
        startDate = new Date(0) // All time
    }

    return transactions.value.filter(transaction => {
      const transactionDate = new Date(transaction.date)
      return transactionDate >= startDate && transactionDate <= endDate
    })
  }

  const getTransactionsByDateRange = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    return transactions.value.filter(transaction => {
      const transactionDate = new Date(transaction.date)
      return transactionDate >= start && transactionDate <= end
    })
  }

  const getTransactionsByType = (type) => {
    return transactions.value.filter(transaction => transaction.type === type)
  }

  const getTransactionsByCategory = (categoryId) => {
    return transactions.value.filter(transaction => transaction.category?.id === categoryId)
  }

  const createTransaction = async (transactionData) => {
    try {
      loading.value = true
      error.value = null

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newTransaction = {
        id: Date.now().toString(),
        ...transactionData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      transactions.value.unshift(newTransaction)
      
      return { success: true, data: newTransaction }
    } catch (err) {
      error.value = err.message
      console.error('Error creating transaction:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const updateTransaction = async (id, transactionData) => {
    try {
      loading.value = true
      error.value = null

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = transactions.value.findIndex(t => t.id === id)
      if (index !== -1) {
        transactions.value[index] = {
          ...transactions.value[index],
          ...transactionData,
          updated_at: new Date().toISOString()
        }
        return { success: true, data: transactions.value[index] }
      }
      
      return { success: false, error: 'Transaction not found' }
    } catch (err) {
      error.value = err.message
      console.error('Error updating transaction:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const deleteTransaction = async (id) => {
    try {
      loading.value = true
      error.value = null

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const index = transactions.value.findIndex(t => t.id === id)
      if (index !== -1) {
        transactions.value.splice(index, 1)
        return { success: true }
      }
      
      return { success: false, error: 'Transaction not found' }
    } catch (err) {
      error.value = err.message
      console.error('Error deleting transaction:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  const getRecentTransactions = (limit = 5) => {
    return transactions.value
      .slice()
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit)
  }

  const getTransactionStats = (period = 'month') => {
    const periodTransactions = getTransactionsByPeriod(period)
    const income = periodTransactions.filter(t => t.type === 'income')
    const expense = periodTransactions.filter(t => t.type === 'expense')

    return {
      totalTransactions: periodTransactions.length,
      totalIncome: income.reduce((sum, t) => sum + t.amount, 0),
      totalExpense: expense.reduce((sum, t) => sum + t.amount, 0),
      balance: income.reduce((sum, t) => sum + t.amount, 0) - expense.reduce((sum, t) => sum + t.amount, 0),
      incomeCount: income.length,
      expenseCount: expense.length
    }
  }

  const searchTransactions = (searchTerm) => {
    if (!searchTerm) return transactions.value

    const term = searchTerm.toLowerCase()
    return transactions.value.filter(transaction => 
      transaction.description.toLowerCase().includes(term) ||
      transaction.category?.name.toLowerCase().includes(term) ||
      transaction.payment_method.toLowerCase().includes(term)
    )
  }

  const clearError = () => {
    error.value = null
  }

  const reset = () => {
    transactions.value = []
    loading.value = false
    error.value = null
  }

  // Initialize mock data on store creation
  if (transactions.value.length === 0) {
    transactions.value = initializeMockData()
  }

  return {
    // State
    transactions,
    loading,
    error,
    
    // Getters
    totalIncome,
    totalExpense,
    balance,
    
    // Actions
    fetchTransactions,
    getTransactionsByPeriod,
    getTransactionsByDateRange,
    getTransactionsByType,
    getTransactionsByCategory,
    getRecentTransactions,
    getTransactionStats,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    searchTransactions,
    clearError,
    reset
  }
})

import { format, parseISO, isValid, startOfDay, endOfDay, subDays, subMonths } from 'date-fns'
import { id as localeId } from 'date-fns/locale'

// ===== CURRENCY HELPERS =====
export const currency = {
  // Format number to Indonesian Rupiah
  format(amount, options = {}) {
    const {
      showSymbol = true,
      minimumFractionDigits = 0,
      maximumFractionDigits = 0
    } = options

    const formatter = new Intl.NumberFormat('id-ID', {
      style: showSymbol ? 'currency' : 'decimal',
      currency: 'IDR',
      minimumFractionDigits,
      maximumFractionDigits
    })

    return formatter.format(amount || 0)
  },

  // Parse currency string to number
  parse(currencyString) {
    if (!currencyString) return 0
    
    // Remove currency symbols and spaces
    const cleanString = currencyString
      .replace(/[Rp\s.,]/g, '')
      .replace(/[^\d]/g, '')
    
    return parseInt(cleanString) || 0
  },

  // Format for input fields (without symbol)
  formatInput(amount) {
    if (!amount) return ''
    return new Intl.NumberFormat('id-ID').format(amount)
  }
}

// ===== DATE HELPERS =====
export const dateHelpers = {
  // Format date for display
  format(date, formatString = 'dd MMM yyyy') {
    if (!date) return ''
    
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return ''
    
    return format(dateObj, formatString, { locale: localeId })
  },

  // Format date for input fields
  formatForInput(date) {
    if (!date) return ''
    
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return ''
    
    return format(dateObj, 'yyyy-MM-dd')
  },

  // Format datetime
  formatDateTime(date) {
    return this.format(date, 'dd MMM yyyy HH:mm')
  },

  // Get relative time
  getRelativeTime(date) {
    if (!date) return ''
    
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    const now = new Date()
    const diffInHours = (now - dateObj) / (1000 * 60 * 60)
    
    if (diffInHours < 1) return 'Baru saja'
    if (diffInHours < 24) return `${Math.floor(diffInHours)} jam yang lalu`
    if (diffInHours < 48) return 'Kemarin'
    
    return this.format(dateObj)
  },

  // Get date ranges
  getDateRange(period) {
    const now = new Date()
    
    switch (period) {
      case 'today':
        return {
          start: startOfDay(now),
          end: endOfDay(now)
        }
      case 'yesterday':
        const yesterday = subDays(now, 1)
        return {
          start: startOfDay(yesterday),
          end: endOfDay(yesterday)
        }
      case 'last7days':
        return {
          start: startOfDay(subDays(now, 6)),
          end: endOfDay(now)
        }
      case 'last30days':
        return {
          start: startOfDay(subDays(now, 29)),
          end: endOfDay(now)
        }
      case 'thisMonth':
        return {
          start: startOfDay(new Date(now.getFullYear(), now.getMonth(), 1)),
          end: endOfDay(now)
        }
      case 'lastMonth':
        const lastMonth = subMonths(now, 1)
        return {
          start: startOfDay(new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1)),
          end: endOfDay(new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0))
        }
      default:
        return {
          start: startOfDay(now),
          end: endOfDay(now)
        }
    }
  }
}

// ===== NUMBER HELPERS =====
export const numberHelpers = {
  // Format number with thousand separators
  format(number, decimals = 0) {
    if (number === null || number === undefined) return '0'
    
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(number)
  },

  // Parse formatted number string
  parse(numberString) {
    if (!numberString) return 0
    
    const cleanString = numberString.replace(/[^\d,-]/g, '').replace(',', '.')
    return parseFloat(cleanString) || 0
  },

  // Calculate percentage
  percentage(value, total) {
    if (!total || total === 0) return 0
    return Math.round((value / total) * 100)
  },

  // Round to specific decimal places
  round(number, decimals = 2) {
    return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals)
  }
}

// ===== STRING HELPERS =====
export const stringHelpers = {
  // Capitalize first letter
  capitalize(str) {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  },

  // Convert to title case
  titleCase(str) {
    if (!str) return ''
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )
  },

  // Generate random string
  random(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  },

  // Truncate string
  truncate(str, length = 50) {
    if (!str) return ''
    if (str.length <= length) return str
    return str.substring(0, length) + '...'
  },

  // Slugify string
  slugify(str) {
    if (!str) return ''
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
}

// ===== VALIDATION HELPERS =====
export const validation = {
  // Email validation
  isEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // Phone number validation (Indonesian format)
  isPhoneNumber(phone) {
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  },

  // Required field validation
  isRequired(value) {
    if (value === null || value === undefined) return false
    if (typeof value === 'string') return value.trim().length > 0
    if (Array.isArray(value)) return value.length > 0
    return true
  },

  // Minimum length validation
  minLength(value, min) {
    if (!value) return false
    return value.toString().length >= min
  },

  // Maximum length validation
  maxLength(value, max) {
    if (!value) return true
    return value.toString().length <= max
  },

  // Number validation
  isNumber(value) {
    return !isNaN(value) && !isNaN(parseFloat(value))
  },

  // Positive number validation
  isPositiveNumber(value) {
    return this.isNumber(value) && parseFloat(value) > 0
  }
}

// ===== DEVICE HELPERS =====
export const deviceHelpers = {
  // Check if mobile device
  isMobile() {
    return window.innerWidth < 768
  },

  // Check if tablet device
  isTablet() {
    return window.innerWidth >= 768 && window.innerWidth < 1024
  },

  // Check if desktop device
  isDesktop() {
    return window.innerWidth >= 1024
  },

  // Check if touch device
  isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  }
}

// ===== STORAGE HELPERS =====
export const storage = {
  // Local storage helpers
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  },

  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return defaultValue
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing from localStorage:', error)
    }
  },

  clear() {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  }
}

// ===== ARRAY HELPERS ===== (lanjutan)
export const arrayHelpers = {
  // Group array by key
  groupBy(array, key) {
    return array.reduce((groups, item) => {
      const group = item[key]
      groups[group] = groups[group] || []
      groups[group].push(item)
      return groups
    }, {})
  },

  // Sort array by key
  sortBy(array, key, direction = 'asc') {
    return [...array].sort((a, b) => {
      const aVal = a[key]
      const bVal = b[key]
      
      if (direction === 'desc') {
        return bVal > aVal ? 1 : -1
      }
      return aVal > bVal ? 1 : -1
    })
  },

  // Remove duplicates from array
  unique(array, key = null) {
    if (!key) {
      return [...new Set(array)]
    }
    
    const seen = new Set()
    return array.filter(item => {
      const value = item[key]
      if (seen.has(value)) {
        return false
      }
      seen.add(value)
      return true
    })
  },

  // Sum array values
  sum(array, key = null) {
    if (!key) {
      return array.reduce((sum, item) => sum + (parseFloat(item) || 0), 0)
    }
    
    return array.reduce((sum, item) => sum + (parseFloat(item[key]) || 0), 0)
  },

  // Get average of array values
  average(array, key = null) {
    if (array.length === 0) return 0
    return this.sum(array, key) / array.length
  },

  // Chunk array into smaller arrays
  chunk(array, size) {
    const chunks = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  }
}

// ===== ERROR HELPERS =====
export const errorHelpers = {
  // Parse Supabase error
  parseSupabaseError(error) {
    if (!error) return 'Terjadi kesalahan yang tidak diketahui'
    
    // Common Supabase error messages
    const errorMessages = {
      'Invalid login credentials': 'Email atau password salah',
      'User already registered': 'Email sudah terdaftar',
      'Password should be at least 6 characters': 'Password minimal 6 karakter',
      'Unable to validate email address: invalid format': 'Format email tidak valid',
      'Email not confirmed': 'Email belum dikonfirmasi',
      'Token has expired or is invalid': 'Token sudah kadaluarsa',
      'new row violates row-level security policy': 'Tidak memiliki izin untuk melakukan aksi ini'
    }
    
    return errorMessages[error.message] || error.message || 'Terjadi kesalahan'
  },

  // Handle async errors
  async handleAsync(asyncFn) {
    try {
      const result = await asyncFn()
      return [null, result]
    } catch (error) {
      return [error, null]
    }
  }
}

// ===== DEBOUNCE & THROTTLE =====
export const performanceHelpers = {
  // Debounce function
  debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  },

  // Throttle function
  throttle(func, limit) {
    let inThrottle
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }
}

// ===== EXPORT ALL HELPERS =====
export default {
  currency,
  dateHelpers,
  numberHelpers,
  stringHelpers,
  validation,
  deviceHelpers,
  storage,
  arrayHelpers,
  errorHelpers,
  performanceHelpers
}


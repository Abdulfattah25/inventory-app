// ===== APPLICATION CONSTANTS =====
export const APP_CONFIG = {
  NAME: 'Inventory App',
  VERSION: '1.0.0',
  DESCRIPTION: 'Aplikasi Pencatatan Keuangan & Inventory untuk Bisnis Kecil',
  AUTHOR: 'Your Name',
  CONTACT: 'your-email@example.com'
}

// ===== TRANSACTION TYPES =====
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense'
}

export const TRANSACTION_TYPE_LABELS = {
  [TRANSACTION_TYPES.INCOME]: 'Pemasukan',
  [TRANSACTION_TYPES.EXPENSE]: 'Pengeluaran'
}

// ===== DEFAULT CATEGORIES =====
export const DEFAULT_CATEGORIES = {
  INCOME: [
    { name: 'Penjualan Produk', color: '#10b981', icon: 'bi-cart-check' },
    { name: 'Jasa', color: '#3b82f6', icon: 'bi-tools' },
    { name: 'Investasi', color: '#8b5cf6', icon: 'bi-graph-up-arrow' },
    { name: 'Lain-lain', color: '#6b7280', icon: 'bi-plus-circle' }
  ],
  EXPENSE: [
    { name: 'Pembelian Stok', color: '#ef4444', icon: 'bi-box-seam' },
    { name: 'Operasional', color: '#f59e0b', icon: 'bi-gear' },
    { name: 'Marketing', color: '#ec4899', icon: 'bi-megaphone' },
    { name: 'Transport', color: '#06b6d4', icon: 'bi-truck' },
    { name: 'Utilitas', color: '#84cc16', icon: 'bi-lightning' },
    { name: 'Lain-lain', color: '#6b7280', icon: 'bi-dash-circle' }
  ]
}

// ===== PRODUCT UNITS =====
export const PRODUCT_UNITS = [
  { value: 'pcs', label: 'Pieces (pcs)' },
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'gram', label: 'Gram (g)' },
  { value: 'liter', label: 'Liter (L)' },
  { value: 'ml', label: 'Mililiter (ml)' },
  { value: 'meter', label: 'Meter (m)' },
  { value: 'cm', label: 'Centimeter (cm)' },
  { value: 'box', label: 'Box' },
  { value: 'pack', label: 'Pack' },
  { value: 'dozen', label: 'Dozen' },
  { value: 'set', label: 'Set' },
  { value: 'roll', label: 'Roll' },
  { value: 'bottle', label: 'Bottle' },
  { value: 'can', label: 'Can' },
  { value: 'bag', label: 'Bag' }
]

// ===== STATUS CONSTANTS =====
export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

export const STATUS_LABELS = {
  [STATUS.ACTIVE]: 'Aktif',
  [STATUS.INACTIVE]: 'Tidak Aktif',
  [STATUS.PENDING]: 'Menunggu',
  [STATUS.COMPLETED]: 'Selesai',
  [STATUS.CANCELLED]: 'Dibatalkan'
}

// ===== INVENTORY MOVEMENT TYPES =====
export const INVENTORY_MOVEMENT_TYPES = {
  IN: 'in',
  OUT: 'out',
  ADJUSTMENT: 'adjustment'
}

export const INVENTORY_MOVEMENT_LABELS = {
  [INVENTORY_MOVEMENT_TYPES.IN]: 'Stok Masuk',
  [INVENTORY_MOVEMENT_TYPES.OUT]: 'Stok Keluar',
  [INVENTORY_MOVEMENT_TYPES.ADJUSTMENT]: 'Penyesuaian'
}

// ===== DATE RANGE OPTIONS =====
export const DATE_RANGES = [
  { value: 'today', label: 'Hari Ini' },
  { value: 'yesterday', label: 'Kemarin' },
  { value: 'last7days', label: '7 Hari Terakhir' },
  { value: 'last30days', label: '30 Hari Terakhir' },
  { value: 'thisMonth', label: 'Bulan Ini' },
  { value: 'lastMonth', label: 'Bulan Lalu' },
  { value: 'custom', label: 'Rentang Kustom' }
]

// ===== PAGINATION =====
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_PAGE_SIZE: 100
}

// ===== VALIDATION RULES =====
export const VALIDATION_RULES = {
  EMAIL: {
    REQUIRED: 'Email wajib diisi',
    INVALID: 'Format email tidak valid'
  },
  PASSWORD: {
    REQUIRED: 'Password wajib diisi',
    MIN_LENGTH: 'Password minimal 6 karakter',
    WEAK: 'Password terlalu lemah'
  },
  NAME: {
    REQUIRED: 'Nama wajib diisi',
    MIN_LENGTH: 'Nama minimal 2 karakter',
    MAX_LENGTH: 'Nama maksimal 50 karakter'
  },
  AMOUNT: {
    REQUIRED: 'Jumlah wajib diisi',
    POSITIVE: 'Jumlah harus lebih dari 0',
    MAX_VALUE: 'Jumlah terlalu besar'
  },
  STOCK: {
    REQUIRED: 'Stok wajib diisi',
    NON_NEGATIVE: 'Stok tidak boleh negatif'
  },
  PRICE: {
    REQUIRED: 'Harga wajib diisi',
    POSITIVE: 'Harga harus lebih dari 0'
  }
}

// ===== UI CONSTANTS =====
export const UI = {
  BREAKPOINTS: {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1200
  },
  SIDEBAR: {
    WIDTH: 280,
    COLLAPSED_WIDTH: 80
  },
  HEADER: {
    HEIGHT: 70
  },
  COLORS: {
    PRIMARY: '#3b82f6',
    SECONDARY: '#64748b',
    SUCCESS: '#10b981',
    DANGER: '#ef4444',
    WARNING: '#f59e0b',
    INFO: '#06b6d4'
  }
}

// ===== CHART COLORS =====
export const CHART_COLORS = [
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Yellow
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#ec4899', // Pink
  '#84cc16', // Lime
  '#f97316', // Orange
  '#6366f1'  // Indigo
]

// ===== NOTIFICATION TYPES =====
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
}

// ===== LOCAL STORAGE KEYS =====
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'inventory_app_user_preferences',
  SIDEBAR_STATE: 'inventory_app_sidebar_state',
  THEME: 'inventory_app_theme',
  LANGUAGE: 'inventory_app_language',
  RECENT_SEARCHES: 'inventory_app_recent_searches'
}

// ===== API ENDPOINTS (if needed for external APIs) =====
export const API_ENDPOINTS = {
  CURRENCY_RATES: 'https://api.exchangerate-api.com/v4/latest/USD',
  BARCODE_LOOKUP: 'https://api.barcodelookup.com/v3/products'
}

// ===== EXPORT FORMATS =====
export const EXPORT_FORMATS = [
  { value: 'pdf', label: 'PDF', icon: 'bi-file-pdf' },
  { value: 'excel', label: 'Excel', icon: 'bi-file-excel' },
  { value: 'csv', label: 'CSV', icon: 'bi-file-csv' }
]

// ===== REPORT TYPES =====
export const REPORT_TYPES = {
  PROFIT_LOSS: 'profit_loss',
  CASH_FLOW: 'cash_flow',
  INVENTORY: 'inventory',
  SALES: 'sales',
  EXPENSES: 'expenses'
}

export const REPORT_TYPE_LABELS = {
  [REPORT_TYPES.PROFIT_LOSS]: 'Laporan Laba Rugi',
  [REPORT_TYPES.CASH_FLOW]: 'Laporan Arus Kas',
  [REPORT_TYPES.INVENTORY]: 'Laporan Inventory',
  [REPORT_TYPES.SALES]: 'Laporan Penjualan',
  [REPORT_TYPES.EXPENSES]: 'Laporan Pengeluaran'
}

// ===== DASHBOARD WIDGETS =====
export const DASHBOARD_WIDGETS = {
  TOTAL_BALANCE: 'total_balance',
  MONTHLY_INCOME: 'monthly_income',
  MONTHLY_EXPENSE: 'monthly_expense',
  LOW_STOCK_ALERT: 'low_stock_alert',
  RECENT_TRANSACTIONS: 'recent_transactions',
  TOP_PRODUCTS: 'top_products',
  INCOME_CHART: 'income_chart',
  EXPENSE_CHART: 'expense_chart'
}

// ===== ERROR MESSAGES =====
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
  UNAUTHORIZED: 'Anda tidak memiliki izin untuk mengakses halaman ini.',
  NOT_FOUND: 'Data yang dicari tidak ditemukan.',
  VALIDATION_ERROR: 'Data yang dimasukkan tidak valid.',
  SERVER_ERROR: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
  UNKNOWN_ERROR: 'Terjadi kesalahan yang tidak diketahui.'
}

// ===== SUCCESS MESSAGES =====
export const SUCCESS_MESSAGES = {
  LOGIN: 'Berhasil masuk ke aplikasi',
  LOGOUT: 'Berhasil keluar dari aplikasi',
  REGISTER: 'Akun berhasil dibuat',
  PASSWORD_RESET: 'Link reset password telah dikirim ke email Anda',
  PASSWORD_UPDATED: 'Password berhasil diperbarui',
  PROFILE_UPDATED: 'Profil berhasil diperbarui',
  
  // Categories
  CATEGORY_CREATED: 'Kategori berhasil dibuat',
  CATEGORY_UPDATED: 'Kategori berhasil diperbarui',
  CATEGORY_DELETED: 'Kategori berhasil dihapus',
  
  // Products
  PRODUCT_CREATED: 'Produk berhasil dibuat',
  PRODUCT_UPDATED: 'Produk berhasil diperbarui',
  PRODUCT_DELETED: 'Produk berhasil dihapus',
  STOCK_UPDATED: 'Stok berhasil diperbarui',
  
  // Transactions
  TRANSACTION_CREATED: 'Transaksi berhasil dibuat',
  TRANSACTION_UPDATED: 'Transaksi berhasil diperbarui',
  TRANSACTION_DELETED: 'Transaksi berhasil dihapus',
  
  // General
  DATA_SAVED: 'Data berhasil disimpan',
  DATA_DELETED: 'Data berhasil dihapus',
  DATA_EXPORTED: 'Data berhasil diekspor',
  DATA_IMPORTED: 'Data berhasil diimpor'
}

// ===== LOADING MESSAGES =====
export const LOADING_MESSAGES = {
  LOADING: 'Memuat...',
  SAVING: 'Menyimpan...',
  DELETING: 'Menghapus...',
  UPDATING: 'Memperbarui...',
  UPLOADING: 'Mengunggah...',
  PROCESSING: 'Memproses...',
  EXPORTING: 'Mengekspor...',
  IMPORTING: 'Mengimpor...'
}

// ===== CONFIRMATION MESSAGES =====
export const CONFIRMATION_MESSAGES = {
  DELETE_CATEGORY: 'Apakah Anda yakin ingin menghapus kategori ini?',
  DELETE_PRODUCT: 'Apakah Anda yakin ingin menghapus produk ini?',
  DELETE_TRANSACTION: 'Apakah Anda yakin ingin menghapus transaksi ini?',
  LOGOUT: 'Apakah Anda yakin ingin keluar?',
  RESET_DATA: 'Apakah Anda yakin ingin mereset semua data? Tindakan ini tidak dapat dibatalkan.',
  CLEAR_FILTERS: 'Apakah Anda yakin ingin menghapus semua filter?'
}

// ===== EMPTY STATE MESSAGES =====
export const EMPTY_STATE_MESSAGES = {
  NO_CATEGORIES: {
    title: 'Belum Ada Kategori',
    description: 'Buat kategori pertama Anda untuk mengorganisir transaksi',
    action: 'Buat Kategori'
  },
  NO_PRODUCTS: {
    title: 'Belum Ada Produk',
    description: 'Tambahkan produk untuk mulai mengelola inventory',
    action: 'Tambah Produk'
  },
  NO_TRANSACTIONS: {
    title: 'Belum Ada Transaksi',
    description: 'Catat transaksi pertama Anda untuk mulai melacak keuangan',
    action: 'Buat Transaksi'
  },
  NO_SEARCH_RESULTS: {
    title: 'Tidak Ada Hasil',
    description: 'Coba ubah kata kunci pencarian Anda',
    action: 'Reset Pencarian'
  },
  NO_DATA: {
    title: 'Tidak Ada Data',
    description: 'Data akan muncul di sini setelah Anda menambahkannya',
    action: null
  }
}

// ===== MENU ITEMS =====
export const MENU_ITEMS = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: 'bi-speedometer2',
    route: '/dashboard',
    badge: null
  },
  {
    id: 'transactions',
    title: 'Transaksi',
    icon: 'bi-receipt',
    route: '/transactions',
    badge: null
  },
  {
    id: 'products',
    title: 'Produk',
    icon: 'bi-box-seam',
    route: '/products',
    badge: null
  },
  {
    id: 'categories',
    title: 'Kategori',
    icon: 'bi-tags',
    route: '/categories',
    badge: null
  },
  {
    id: 'reports',
    title: 'Laporan',
    icon: 'bi-graph-up',
    route: '/reports',
    badge: null
  }
]

// ===== QUICK ACTIONS =====
export const QUICK_ACTIONS = [
  {
    id: 'add_income',
    title: 'Tambah Pemasukan',
    icon: 'bi-plus-circle',
    color: 'success',
    action: 'openTransactionModal',
    params: { type: 'income' }
  },
  {
    id: 'add_expense',
    title: 'Tambah Pengeluaran',
    icon: 'bi-dash-circle',
    color: 'danger',
    action: 'openTransactionModal',
    params: { type: 'expense' }
  },
  {
    id: 'add_product',
    title: 'Tambah Produk',
    icon: 'bi-box',
    color: 'primary',
    action: 'openProductModal'
  },
  {
    id: 'view_reports',
    title: 'Lihat Laporan',
    icon: 'bi-file-text',
    color: 'info',
    action: 'navigateToReports'
  }
]

// ===== DASHBOARD STATS =====
export const DASHBOARD_STATS = {
  TOTAL_BALANCE: {
    title: 'Saldo Total',
    icon: 'bi-wallet2',
    color: 'primary',
    format: 'currency'
  },
  MONTHLY_INCOME: {
    title: 'Pemasukan Bulan Ini',
    icon: 'bi-arrow-up-circle',
    color: 'success',
    format: 'currency'
  },
  MONTHLY_EXPENSE: {
    title: 'Pengeluaran Bulan Ini',
    icon: 'bi-arrow-down-circle',
    color: 'danger',
    format: 'currency'
  },
  TOTAL_PRODUCTS: {
    title: 'Total Produk',
    icon: 'bi-box-seam',
    color: 'info',
    format: 'number'
  },
  LOW_STOCK_COUNT: {
    title: 'Stok Menipis',
    icon: 'bi-exclamation-triangle',
    color: 'warning',
    format: 'number'
  },
  TRANSACTIONS_TODAY: {
    title: 'Transaksi Hari Ini',
    icon: 'bi-receipt',
    color: 'secondary',
    format: 'number'
  }
}

// ===== CHART CONFIGURATIONS =====
export const CHART_CONFIG = {
  INCOME_EXPENSE: {
    type: 'line',
    title: 'Pemasukan vs Pengeluaran',
    colors: ['#10b981', '#ef4444'],
    height: 300
  },
  CATEGORY_DISTRIBUTION: {
    type: 'doughnut',
    title: 'Distribusi Kategori',
    colors: CHART_COLORS,
    height: 300
  },
  MONTHLY_TREND: {
    type: 'bar',
    title: 'Tren Bulanan',
    colors: ['#3b82f6'],
    height: 350
  },
  TOP_PRODUCTS: {
    type: 'horizontalBar',
    title: 'Produk Terlaris',
    colors: ['#8b5cf6'],
    height: 400
  }
}

// ===== FILE UPLOAD =====
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: {
    IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    SPREADSHEETS: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv']
  },
  ERROR_MESSAGES: {
    FILE_TOO_LARGE: 'Ukuran file terlalu besar. Maksimal 5MB.',
    INVALID_TYPE: 'Tipe file tidak didukung.',
    UPLOAD_FAILED: 'Gagal mengunggah file. Silakan coba lagi.'
  }
}

// ===== KEYBOARD SHORTCUTS =====
export const KEYBOARD_SHORTCUTS = {
  GLOBAL: {
    'ctrl+k': 'Buka pencarian',
    'ctrl+n': 'Tambah transaksi baru',
    'ctrl+shift+p': 'Tambah produk baru',
    'ctrl+shift+c': 'Tambah kategori baru',
    'esc': 'Tutup modal/dialog'
  },
  NAVIGATION: {
    'g d': 'Ke Dashboard',
    'g t': 'Ke Transaksi',
    'g p': 'Ke Produk',
    'g c': 'Ke Kategori',
    'g r': 'Ke Laporan'
  }
}

// ===== THEMES =====
export const THEMES = {
  LIGHT: {
    id: 'light',
    name: 'Terang',
    icon: 'bi-sun'
  },
  DARK: {
    id: 'dark',
    name: 'Gelap',
    icon: 'bi-moon'
  },
  AUTO: {
    id: 'auto',
    name: 'Otomatis',
    icon: 'bi-circle-half'
  }
}

// ===== LANGUAGES =====
export const LANGUAGES = [
  {
    code: 'id',
    name: 'Bahasa Indonesia',
    flag: '🇮🇩'
  },
  {
    code: 'en',
    name: 'English',
    flag: '🇺🇸'
  }
]

// ===== REGEX PATTERNS =====
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_ID: /^(\+62|62|0)8[1-9][0-9]{6,9}$/,
  CURRENCY: /^\d{1,3}(,\d{3})*(\.\d{2})?$/,
  BARCODE: /^[0-9]{8,13}$/,
  SKU: /^[A-Z0-9-]{3,20}$/,
  PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
}

// ===== DEFAULT VALUES =====
export const DEFAULT_VALUES = {
  PAGINATION_SIZE: 20,
  LOW_STOCK_THRESHOLD: 10,
  CURRENCY_SYMBOL: 'Rp',
  DATE_FORMAT: 'dd/MM/yyyy',
  TIME_FORMAT: 'HH:mm',
  DECIMAL_PLACES: 0,
  TAX_RATE: 0.11, // PPN 11%
  
  // New user defaults
  NEW_USER: {
    AVATAR: '/images/default-avatar.png',
    THEME: 'light',
    LANGUAGE: 'id',
    TIMEZONE: 'Asia/Jakarta'
  },
  
  // Product defaults
  PRODUCT: {
    UNIT: 'pcs',
    MIN_STOCK: 5,
    STATUS: 'active'
  },
  
  // Transaction defaults
  TRANSACTION: {
    TYPE: 'expense',
    STATUS: 'completed'
  }
}

// ===== FEATURE FLAGS =====
export const FEATURES = {
  MULTI_CURRENCY: false,
  BARCODE_SCANNER: false,
  ADVANCED_REPORTS: true,
  EXPORT_DATA: true,
  IMPORT_DATA: true,
  NOTIFICATIONS: true,
  DARK_MODE: true,
  OFFLINE_MODE: false,
  MULTI_LANGUAGE: false,
  TAX_CALCULATION: true,
  INVENTORY_TRACKING: true,
  USER_ROLES: false
}

// ===== SOCIAL LINKS =====
export const SOCIAL_LINKS = {
  WEBSITE: 'https://your-website.com',
  SUPPORT: 'mailto:support@your-website.com',
  DOCUMENTATION: 'https://docs.your-website.com',
  GITHUB: 'https://github.com/your-username/inventory-app',
  TWITTER: 'https://twitter.com/your-username',
  FACEBOOK: 'https://facebook.com/your-page'
}

// ===== VERSION INFO =====
export const VERSION_INFO = {
  CURRENT: '1.0.0',
  RELEASE_DATE: '2024-01-01',
  CHANGELOG_URL: 'https://your-website.com/changelog',
  UPDATE_CHECK_URL: 'https://api.your-website.com/version'
}

// Export all constants as default
export default {
  APP_CONFIG,
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_LABELS,
  DEFAULT_CATEGORIES,
  PRODUCT_UNITS,
  STATUS,
  STATUS_LABELS,
  INVENTORY_MOVEMENT_TYPES,
  INVENTORY_MOVEMENT_LABELS,
  DATE_RANGES,
  PAGINATION,
  VALIDATION_RULES,
  UI,
  CHART_COLORS,
  NOTIFICATION_TYPES,
  STORAGE_KEYS,
  API_ENDPOINTS,
  EXPORT_FORMATS,
  REPORT_TYPES,
  REPORT_TYPE_LABELS,
  DASHBOARD_WIDGETS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  LOADING_MESSAGES,
  CONFIRMATION_MESSAGES,
  EMPTY_STATE_MESSAGES,
  MENU_ITEMS,
  QUICK_ACTIONS,
  DASHBOARD_STATS,
  CHART_CONFIG,
  FILE_UPLOAD,
  KEYBOARD_SHORTCUTS,
  THEMES,
  LANGUAGES,
  REGEX_PATTERNS,
  DEFAULT_VALUES,
  FEATURES,
  SOCIAL_LINKS,
  VERSION_INFO
}


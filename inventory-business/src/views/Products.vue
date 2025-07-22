<template>
  <div class="products-page">
    <!-- Page Header -->
    <div class="page-header mb-4">
      <div class="row align-items-center">
        <div class="col">
          <h1 class="page-title">Produk</h1>
          <p class="page-subtitle text-muted">
            Kelola produk dan layanan untuk transaksi bisnis Anda
          </p>
        </div>
        <div class="col-auto">
          <div class="btn-group">
            <button
              class="btn btn-outline-secondary"
              @click="exportProducts"
            >
              <i class="bi bi-download me-2"></i>
              Export
            </button>
            <button
              class="btn btn-primary"
              @click="openProductModal()"
            >
              <i class="bi bi-plus-circle me-2"></i>
              Tambah Produk
            </button>
          </div>
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
                <h6 class="card-subtitle mb-1 text-muted">Total Produk</h6>
                <h3 class="card-title mb-0">{{ products.length }}</h3>
              </div>
              <i class="bi bi-box-seam fs-2 text-primary"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card stats-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-subtitle mb-1 text-muted">Produk Aktif</h6>
                <h3 class="card-title mb-0">{{ activeProducts.length }}</h3>
              </div>
              <i class="bi bi-check-circle fs-2 text-success"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card stats-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-subtitle mb-1 text-muted">Stok Rendah</h6>
                <h3 class="card-title mb-0">{{ lowStockProducts.length }}</h3>
              </div>
              <i class="bi bi-exclamation-triangle fs-2 text-warning"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card stats-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="card-subtitle mb-1 text-muted">Total Nilai Stok</h6>
                <h3 class="card-title mb-0">{{ formatCurrency(totalStockValue) }}</h3>
              </div>
              <i class="bi bi-currency-dollar fs-2 text-info"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <label class="form-label">Status</label>
            <select v-model="filters.status" class="form-select">
              <option value="">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Stok</label>
            <select v-model="filters.stock" class="form-select">
              <option value="">Semua Stok</option>
              <option value="available">Tersedia</option>
              <option value="low">Stok Rendah</option>
              <option value="out">Habis</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Urutkan</label>
            <select v-model="sortBy" class="form-select">
              <option value="name">Nama</option>
              <option value="price">Harga</option>
              <option value="stock">Stok</option>
              <option value="created_at">Tanggal Dibuat</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Cari Produk</label>
            <div class="input-group">
              <input
                v-model="filters.search"
                type="text"
                class="form-control"
                placeholder="Cari nama atau kode produk..."
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

    <!-- Products Grid/Table -->
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="card-title mb-0">
          Daftar Produk ({{ filteredProducts.length }})
        </h5>
        <div class="btn-group btn-group-sm">
          <button
            class="btn"
            :class="viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'"
            @click="viewMode = 'grid'"
          >
            <i class="bi bi-grid"></i>
          </button>
          <button
            class="btn"
            :class="viewMode === 'table' ? 'btn-primary' : 'btn-outline-primary'"
            @click="viewMode = 'table'"
          >
            <i class="bi bi-table"></i>
          </button>
        </div>
      </div>

      <div class="card-body p-0">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-5">
                    <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2 text-muted">Memuat produk...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredProducts.length === 0" class="text-center py-5">
          <i class="bi bi-box-seam display-1 text-muted"></i>
          <h5 class="mt-3">Tidak ada produk</h5>
          <p class="text-muted">
            {{ hasFilters ? 'Tidak ada produk yang sesuai dengan filter' : 'Belum ada produk yang ditambahkan' }}
          </p>
          <button
            v-if="!hasFilters"
            class="btn btn-primary"
            @click="openProductModal()"
          >
            <i class="bi bi-plus-circle me-2"></i>
            Tambah Produk Pertama
          </button>
        </div>

        <!-- Grid View -->
        <div v-else-if="viewMode === 'grid'" class="p-3">
          <div class="row">
            <div
              v-for="product in paginatedProducts"
              :key="product.id"
              class="col-md-6 col-lg-4 col-xl-3 mb-4"
            >
              <div class="card product-card h-100">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-start mb-3">
                    <span
                      class="badge"
                      :class="product.is_active ? 'bg-success' : 'bg-secondary'"
                    >
                      {{ product.is_active ? 'Aktif' : 'Tidak Aktif' }}
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
                            @click="editProduct(product)"
                          >
                            <i class="bi bi-pencil me-2"></i>
                            Edit
                          </button>
                        </li>
                        <li>
                          <button
                            class="dropdown-item"
                            @click="toggleProductStatus(product)"
                          >
                            <i :class="product.is_active ? 'bi bi-eye-slash' : 'bi bi-eye'" class="me-2"></i>
                            {{ product.is_active ? 'Nonaktifkan' : 'Aktifkan' }}
                          </button>
                        </li>
                        <li><hr class="dropdown-divider"></li>
                        <li>
                          <button
                            class="dropdown-item text-danger"
                            @click="confirmDelete(product)"
                          >
                            <i class="bi bi-trash me-2"></i>
                            Hapus
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div class="text-center mb-3">
                    <div class="product-image-placeholder">
                      <i class="bi bi-box-seam display-4 text-muted"></i>
                    </div>
                  </div>

                  <h6 class="card-title">{{ product.name }}</h6>
                  <p class="text-muted small mb-2">{{ product.code }}</p>
                  
                  <div class="mb-2">
                    <span class="fw-bold text-primary fs-5">
                      {{ formatCurrency(product.price) }}
                    </span>
                  </div>

                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <small class="text-muted">Stok:</small>
                    <span
                      class="badge"
                      :class="getStockBadgeClass(product.stock, product.min_stock)"
                    >
                      {{ product.stock }} {{ product.unit || 'pcs' }}
                    </span>
                  </div>

                  <div v-if="product.description" class="mt-2">
                    <small class="text-muted">
                      {{ truncateText(product.description, 60) }}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Table View -->
        <div v-else class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>
                  <button
                    class="btn btn-sm btn-link p-0 text-decoration-none"
                    @click="toggleSort('name')"
                  >
                    Produk
                    <i class="bi" :class="getSortIcon('name')"></i>
                  </button>
                </th>
                <th>Kode</th>
                <th>
                  <button
                    class="btn btn-sm btn-link p-0 text-decoration-none"
                    @click="toggleSort('price')"
                  >
                    Harga
                    <i class="bi" :class="getSortIcon('price')"></i>
                  </button>
                </th>
                <th>
                  <button
                    class="btn btn-sm btn-link p-0 text-decoration-none"
                    @click="toggleSort('stock')"
                  >
                    Stok
                    <i class="bi" :class="getSortIcon('stock')"></i>
                  </button>
                </th>
                <th>Status</th>
                <th width="120">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="product in paginatedProducts"
                :key="product.id"
                class="product-row"
              >
                <td>
                  <div class="d-flex align-items-center">
                    <div class="product-avatar me-3">
                      <i class="bi bi-box-seam"></i>
                    </div>
                    <div>
                      <div class="fw-medium">{{ product.name }}</div>
                      <small v-if="product.description" class="text-muted">
                        {{ truncateText(product.description, 40) }}
                      </small>
                    </div>
                  </div>
                </td>
                <td>
                  <code class="text-muted">{{ product.code }}</code>
                </td>
                <td>
                  <span class="fw-bold text-primary">
                    {{ formatCurrency(product.price) }}
                  </span>
                </td>
                <td>
                  <div class="d-flex align-items-center">
                    <span
                      class="badge me-2"
                      :class="getStockBadgeClass(product.stock, product.min_stock)"
                    >
                      {{ product.stock }}
                    </span>
                    <small class="text-muted">{{ product.unit || 'pcs' }}</small>
                  </div>
                </td>
                <td>
                  <span
                    class="badge"
                    :class="product.is_active ? 'bg-success' : 'bg-secondary'"
                  >
                    {{ product.is_active ? 'Aktif' : 'Tidak Aktif' }}
                  </span>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button
                      class="btn btn-outline-primary"
                      @click="editProduct(product)"
                      title="Edit"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button
                      class="btn btn-outline-secondary"
                      @click="toggleProductStatus(product)"
                      :title="product.is_active ? 'Nonaktifkan' : 'Aktifkan'"
                    >
                      <i :class="product.is_active ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                    <button
                      class="btn btn-outline-danger"
                      @click="confirmDelete(product)"
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
              {{ Math.min(currentPage * itemsPerPage, filteredProducts.length) }} 
              dari {{ filteredProducts.length }} produk
            </small>
          </div>
        </div>
      </div>
    </div>

    <!-- Product Modal -->
    <Modal
      v-if="showProductModal"
      :show="showProductModal"
      :title="editingProduct ? 'Edit Produk' : 'Tambah Produk'"
      size="lg"
      @close="closeProductModal"
    >
      <ProductForm
        :product="editingProduct"
        @success="handleProductSuccess"
        @cancel="closeProductModal"
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
        <h5 class="mt-3">Hapus Produk?</h5>
        <p class="text-muted">
          Apakah Anda yakin ingin menghapus produk "{{ productToDelete?.name }}"?
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
          @click="deleteProduct"
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
import { useProductsStore } from '@/stores/products'
import { useNotificationStore } from '@/stores/notifications'
import Modal from '@/components/Modal.vue'
import ProductForm from '@/components/ProductForm.vue'

export default {
  name: 'Products',
  components: {
    Modal,
    ProductForm
  },
  setup() {
    const productsStore = useProductsStore()
    const notifications = useNotificationStore()

    // Reactive data
    const loading = ref(false)
    const viewMode = ref('grid')
    const currentPage = ref(1)
    const itemsPerPage = ref(12)
    const sortBy = ref('name')
    const sortDirection = ref('asc')
    
    const showProductModal = ref(false)
    const showDeleteModal = ref(false)
    const editingProduct = ref(null)
    const productToDelete = ref(null)

    // Filters
    const filters = reactive({
      status: '',
      stock: '',
      search: ''
    })

    // Computed properties
    const products = computed(() => productsStore.products)

    const activeProducts = computed(() => 
      products.value.filter(p => p.is_active)
    )

    const lowStockProducts = computed(() =>
      products.value.filter(p => p.stock <= (p.min_stock || 5))
    )

    const totalStockValue = computed(() =>
      products.value.reduce((total, product) => total + (product.price * product.stock), 0)
    )

    const filteredProducts = computed(() => {
      let filtered = [...products.value]

      // Filter by status
      if (filters.status) {
        const isActive = filters.status === 'active'
        filtered = filtered.filter(p => p.is_active === isActive)
      }

      // Filter by stock
      if (filters.stock) {
        switch (filters.stock) {
          case 'available':
            filtered = filtered.filter(p => p.stock > (p.min_stock || 5))
            break
          case 'low':
            filtered = filtered.filter(p => p.stock <= (p.min_stock || 5) && p.stock > 0)
            break
          case 'out':
            filtered = filtered.filter(p => p.stock === 0)
            break
        }
      }

      // Filter by search
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
                filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.code.toLowerCase().includes(searchTerm) ||
          p.description?.toLowerCase().includes(searchTerm)
        )
      }

      // Sort products
      filtered.sort((a, b) => {
        let aValue = a[sortBy.value]
        let bValue = b[sortBy.value]

        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase()
          bValue = bValue.toLowerCase()
        }

        if (sortDirection.value === 'asc') {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })

      return filtered
    })

    const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredProducts.value.slice(start, end)
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredProducts.value.length / itemsPerPage.value)
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

    const hasFilters = computed(() => {
      return filters.status || filters.stock || filters.search
    })

    // Methods
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(amount)
    }

    const truncateText = (text, length) => {
      if (!text) return ''
      return text.length > length ? text.substring(0, length) + '...' : text
    }

    const getStockBadgeClass = (stock, minStock = 5) => {
      if (stock === 0) return 'bg-danger'
      if (stock <= minStock) return 'bg-warning'
      return 'bg-success'
    }

    const toggleSort = (field) => {
      if (sortBy.value === field) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
      } else {
        sortBy.value = field
        sortDirection.value = 'asc'
      }
      currentPage.value = 1
    }

    const getSortIcon = (field) => {
      if (sortBy.value !== field) {
        return 'bi-arrow-down-up'
      }
      return sortDirection.value === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down'
    }

    const openProductModal = () => {
      editingProduct.value = null
      showProductModal.value = true
    }

    const closeProductModal = () => {
      showProductModal.value = false
      editingProduct.value = null
    }

    const editProduct = (product) => {
      editingProduct.value = product
      showProductModal.value = true
    }

    const confirmDelete = (product) => {
      productToDelete.value = product
      showDeleteModal.value = true
    }

    const deleteProduct = async () => {
      if (!productToDelete.value) return

      loading.value = true
      try {
        await productsStore.deleteProduct(productToDelete.value.id)
        notifications.success('Produk berhasil dihapus')
        showDeleteModal.value = false
        productToDelete.value = null
      } catch (error) {
        notifications.error('Gagal menghapus produk')
        console.error('Error deleting product:', error)
      } finally {
        loading.value = false
      }
    }

    const toggleProductStatus = async (product) => {
      loading.value = true
      try {
        await productsStore.updateProduct(product.id, {
          ...product,
          is_active: !product.is_active
        })
        notifications.success(
          `Produk berhasil ${product.is_active ? 'dinonaktifkan' : 'diaktifkan'}`
        )
      } catch (error) {
        notifications.error('Gagal mengubah status produk')
        console.error('Error toggling product status:', error)
      } finally {
        loading.value = false
      }
    }

    const handleProductSuccess = () => {
      closeProductModal()
      loadData()
    }

    const exportProducts = () => {
      const data = filteredProducts.value.map(p => ({
        Kode: p.code,
        Nama: p.name,
        Deskripsi: p.description || '',
        Harga: p.price,
        Stok: p.stock,
        'Stok Minimum': p.min_stock || '',
        Satuan: p.unit || '',
        Status: p.is_active ? 'Aktif' : 'Tidak Aktif'
      }))

      // Simple CSV export
      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n')

      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `produk_${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)

      notifications.success('Data produk berhasil diekspor')
    }

    const loadData = async () => {
      loading.value = true
      try {
        await productsStore.fetchProducts()
      } catch (error) {
        notifications.error('Gagal memuat data produk')
        console.error('Error loading products:', error)
      } finally {
        loading.value = false
      }
    }

    // Watchers
    watch(
      () => [filters.status, filters.stock, filters.search],
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
      sortBy,
      sortDirection,
      showProductModal,
      showDeleteModal,
      editingProduct,
      productToDelete,
      filters,
      products,
      activeProducts,
      lowStockProducts,
      totalStockValue,
      filteredProducts,
      paginatedProducts,
      totalPages,
      visiblePages,
      hasFilters,
      formatCurrency,
      truncateText,
      getStockBadgeClass,
      toggleSort,
      getSortIcon,
      openProductModal,
      closeProductModal,
      editProduct,
      confirmDelete,
      deleteProduct,
      toggleProductStatus,
      handleProductSuccess,
      exportProducts
    }
  }
}
</script>

<style scoped>
.products-page {
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

.product-card {
  border: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border-radius: 0.75rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
}

.product-image-placeholder {
  width: 80px;
  height: 80px;
  background: var(--bs-gray-100);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.product-avatar {
  width: 40px;
  height: 40px;
  background: var(--bs-gray-100);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--bs-gray-600);
}

.product-row {
  transition: background-color 0.2s ease;
}

.product-row:hover {
  background-color: var(--bs-gray-50);
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
  .products-page {
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
  
  .product-card .card-body {
    padding: 1rem;
  }
  
  .table-responsive {
    font-size: 0.875rem;
  }
  
  .btn-group-sm .btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }
}

@media (max-width: 576px) {
  
  .product-image-placeholder {
    width: 60px;
    height: 60px;
  }
  
  .product-avatar {
    width: 32px;
    height: 32px;
  }
}
</style>



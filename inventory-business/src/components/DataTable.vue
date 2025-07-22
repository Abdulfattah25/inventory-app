<template>
  <div class="data-table-container">
    <!-- Table Header Actions -->
    <div v-if="showHeader" class="table-header d-flex justify-content-between align-items-center mb-3">
      <div class="table-info">
        <h5 v-if="title" class="mb-0">{{ title }}</h5>
        <small v-if="subtitle" class="text-muted">{{ subtitle }}</small>
      </div>
      
      <div class="table-actions d-flex gap-2">
        <!-- Search -->
        <div v-if="searchable" class="search-box">
          <div class="input-group">
            <span class="input-group-text">
              <i class="bi bi-search"></i>
            </span>
            <input
              v-model="searchQuery"
              type="text"
              class="form-control"
              :placeholder="searchPlaceholder"
            >
          </div>
        </div>

        <!-- Filter -->
        <div v-if="filterable && filterOptions.length" class="filter-box">
          <select v-model="selectedFilter" class="form-select">
            <option value="">Semua</option>
            <option
              v-for="option in filterOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- Actions slot -->
        <slot name="actions" />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="table-loading">
      <Loading type="spinner" text="Memuat data..." />
    </div>

    <!-- Table -->
    <div v-else class="table-responsive">
      <table class="table" :class="tableClass">
        <!-- Table Head -->
        <thead>
          <tr>
            <!-- Select All Checkbox -->
            <th v-if="selectable" class="select-column">
              <div class="form-check">
                <input
                  id="select-all"
                  v-model="selectAll"
                  class="form-check-input"
                  type="checkbox"
                  @change="toggleSelectAll"
                >
                <label for="select-all" class="form-check-label visually-hidden">
                  Select All
                </label>
              </div>
            </th>

            <!-- Column Headers -->
            <th
              v-for="column in columns"
              :key="column.key"
              :class="[
                column.class,
                { 'sortable': column.sortable },
                { 'text-center': column.align === 'center' },
                { 'text-end': column.align === 'right' }
              ]"
              @click="column.sortable ? sort(column.key) : null"
            >
              {{ column.label }}
              <i
                v-if="column.sortable"
                class="bi ms-1"
                :class="getSortIcon(column.key)"
              ></i>
            </th>

            <!-- Actions Column -->
            <th v-if="hasActions" class="actions-column text-center">
              Aksi
            </th>
          </tr>
        </thead>

        <!-- Table Body -->
        <tbody>
          <!-- Empty State -->
          <tr v-if="filteredData.length === 0">
            <td :colspan="totalColumns" class="text-center py-4">
              <div class="empty-state">
                <i class="bi bi-inbox fs-1 text-muted"></i>
                <div class="mt-2 text-muted">{{ emptyMessage }}</div>
              </div>
            </td>
          </tr>

          <!-- Data Rows -->
          <tr
            v-for="(item, index) in paginatedData"
            :key="getRowKey(item, index)"
            :class="getRowClass(item, index)"
            @click="handleRowClick(item, index)"
          >
            <!-- Select Checkbox -->
            <td v-if="selectable" class="select-column">
              <div class="form-check">
                <input
                  :id="`select-${getRowKey(item, index)}`"
                  v-model="selectedItems"
                  class="form-check-input"
                  type="checkbox"
                  :value="item"
                >
                <label
                  :for="`select-${getRowKey(item, index)}`"
                  class="form-check-label visually-hidden"
                >
                  Select Row
                </label>
              </div>
            </td>

            <!-- Data Columns -->
            <td
              v-for="column in columns"
              :key="column.key"
              :class="[
                column.class,
                { 'text-center': column.align === 'center' },
                { 'text-end': column.align === 'right' }
              ]"
            >
              <slot
                :name="`column-${column.key}`"
                :item="item"
                :value="getColumnValue(item, column.key)"
                :index="index"
              >
                {{ formatColumnValue(item, column) }}
              </slot>
            </td>

            <!-- Actions Column -->
            <td v-if="hasActions" class="actions-column text-center">
              <slot name="actions" :item="item" :index="index">
                <div class="btn-group btn-group-sm">
                  <button
                    v-if="!hideEdit"
                    class="btn btn-outline-primary"
                    @click.stop="$emit('edit', item, index)"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button
                    v-if="!hideDelete"
                    class="btn btn-outline-danger"
                    @click.stop="$emit('delete', item, index)"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      v-if="paginated && filteredData.length > 0"
      class="table-footer d-flex justify-content-between align-items-center mt-3"
    >
      <div class="table-info">
        <small class="text-muted">
          Menampilkan {{ startIndex + 1 }} - {{ endIndex }} dari {{ filteredData.length }} data
        </small>
      </div>

      <nav aria-label="Table pagination">
        <ul class="pagination pagination-sm mb-0">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button
              class="page-link"
              @click="goToPage(currentPage - 1)"
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
            <button class="page-link" @click="goToPage(page)">
              {{ page }}
            </button>
          </li>

          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button
              class="page-link"
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
            >
              <i class="bi bi-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import Loading from './Loading.vue'

export default {
  name: 'DataTable',
  components: {
    Loading
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    searchable: {
      type: Boolean,
      default: true
    },
    searchPlaceholder: {
      type: String,
      default: 'Cari data...'
    },
    filterable: {
      type: Boolean,
      default: false
    },
    filterOptions: {
      type: Array,
      default: () => []
    },
    selectable: {
      type: Boolean,
      default: false
    },
    paginated: {
      type: Boolean,
      default: true
    },
    perPage: {
      type: Number,
      default: 10
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    tableClass: {
      type: String,
      default: 'table-hover'
    },
    emptyMessage: {
      type: String,
      default: 'Tidak ada data untuk ditampilkan'
    },
    rowKey: {
      type: String,
      default: 'id'
    },
    hideEdit: {
      type: Boolean,
      default: false
    },
    hideDelete: {
      type: Boolean,
      default: false
    }
  },
  emits: ['edit', 'delete', 'row-click', 'selection-change'],
  setup(props, { emit, slots }) {
    // Reactive data
    const searchQuery = ref('')
    const selectedFilter = ref('')
    const currentPage = ref(1)
    const sortKey = ref('')
    const sortOrder = ref('asc')
    const selectedItems = ref([])

    // Computed properties
    const hasActions = computed(() => {
      return slots.actions || (!props.hideEdit || !props.hideDelete)
    })

    const totalColumns = computed(() => {
      let count = props.columns.length
      if (props.selectable) count++
      if (hasActions.value) count++
      return count
    })

    const filteredData = computed(() => {
      let filtered = [...props.data]

      // Apply search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(item => {
          return props.columns.some(column => {
            const value = getColumnValue(item, column.key)
            return String(value).toLowerCase().includes(query)
          })
        })
      }

      // Apply column filter
      if (selectedFilter.value) {
        filtered = filtered.filter(item => {
          const filterOption = props.filterOptions.find(opt => opt.value === selectedFilter.value)
          if (filterOption && filterOption.filter) {
            return filterOption.filter(item)
          }
          return true
        })
      }

      // Apply sorting
      if (sortKey.value) {
        filtered.sort((a, b) => {
          const aVal = getColumnValue(a, sortKey.value)
          const bVal = getColumnValue(b, sortKey.value)
          
          let result = 0
          if (aVal < bVal) result = -1
          else if (aVal > bVal) result = 1
          
          return sortOrder.value === 'desc' ? -result : result
        })
      }

      return filtered
    })

    const totalPages = computed(() => {
      if (!props.paginated) return 1
      return Math.ceil(filteredData.value.length / props.perPage)
    })

    const startIndex = computed(() => {
      if (!props.paginated) return 0
      return (currentPage.value - 1) * props.perPage
    })

    const endIndex = computed(() => {
      if (!props.paginated) return filteredData.value.length
      return Math.min(startIndex.value + props.perPage, filteredData.value.length)
    })

    const paginatedData = computed(() => {
      if (!props.paginated) return filteredData.value
      return filteredData.value.slice(startIndex.value, endIndex.value)
    })

    const visiblePages = computed(() => {
      const pages = []
      const total = totalPages.value
      const current = currentPage.value
      const delta = 2

      for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
        pages.push(i)
      }

      if (current - delta > 2) {
        pages.unshift('...')
      }
      if (current + delta < total - 1) {
        pages.push('...')
      }

      pages.unshift(1)
      if (total !== 1) {
        pages.push(total)
      }

      return pages.filter((page, index, arr) => arr.indexOf(page) === index)
    })

    const selectAll = computed({
      get() {
        return paginatedData.value.length > 0 && 
               paginatedData.value.every(item => selectedItems.value.includes(item))
      },
      set(value) {
        // Handled by toggleSelectAll method
      }
    })

    // Methods
    const getColumnValue = (item, key) => {
      return key.split('.').reduce((obj, k) => obj?.[k], item)
    }

    const formatColumnValue = (item, column) => {
      const value = getColumnValue(item, column.key)
      
      if (column.formatter && typeof column.formatter === 'function') {
        return column.formatter(value, item)
      }
      
      if (column.type === 'currency') {
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0
        }).format(value || 0)
      }
      
      if (column.type === 'date') {
        return value ? new Date(value).toLocaleDateString('id-ID') : '-'
      }
      
      if (column.type === 'datetime') {
        return value ? new Date(value).toLocaleString('id-ID') : '-'
      }
      
      return value ?? '-'
    }

    const getRowKey = (item, index) => {
      return item[props.rowKey] || index
    }

    const getRowClass = (item, index) => {
      const classes = []
      
      if (props.selectable && selectedItems.value.includes(item)) {
        classes.push('table-active')
      }
      
      return classes
    }

    const sort = (key) => {
      if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
      } else {
        sortKey.value = key
        sortOrder.value = 'asc'
      }
      currentPage.value = 1
    }

    const getSortIcon = (key) => {
      if (sortKey.value !== key) return 'bi-arrow-down-up'
      return sortOrder.value === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down'
    }

    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
      }
    }

    const toggleSelectAll = () => {
      if (selectAll.value) {
        // Deselect all current page items
        paginatedData.value.forEach(item => {
          const index = selectedItems.value.indexOf(item)
          if (index > -1) {
            selectedItems.value.splice(index, 1)
          }
        })
      } else {
        // Select all current page items
        paginatedData.value.forEach(item => {
          if (!selectedItems.value.includes(item)) {
            selectedItems.value.push(item)
          }
        })
      }
    }

    const handleRowClick = (item, index) => {
      emit('row-click', item, index)
    }

    // Watchers
    watch(searchQuery, () => {
      currentPage.value = 1
    })

    watch(selectedFilter, () => {
      currentPage.value = 1
    })

    watch(selectedItems, (newValue) => {
      emit('selection-change', newValue)
    }, { deep: true })

    return {
      searchQuery,
      selectedFilter,
      currentPage,
      sortKey,
      sortOrder,
      selectedItems,
      hasActions,
      totalColumns,
      filteredData,
      totalPages,
      startIndex,
      endIndex,
      paginatedData,
      visiblePages,
      selectAll,
      getColumnValue,
      formatColumnValue,
      getRowKey,
      getRowClass,
      sort,
      getSortIcon,
      goToPage,
      toggleSelectAll,
      handleRowClick
    }
  }
}
</script>

<style scoped>
.data-table-container {
  background: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 1.5rem;
}

.table-header {
  border-bottom: 1px solid var(--bs-border-color);
  padding-bottom: 1rem;
  margin-bottom: 1.5rem !important;
}

.search-box .input-group {
  width: 250px;
}

.filter-box .form-select {
  width: 150px;
}

.table {
  margin-bottom: 0;
}

.table th {
  border-top: none;
  font-weight: 600;
  color: var(--bs-body-color);
  background-color: var(--bs-gray-50);
}

.table th.sortable {
  cursor: pointer;
  user-select: none;
  transition: background-color 0.15s ease-in-out;
}

.table th.sortable:hover {
  background-color: var(--bs-gray-100);
}

.select-column,
.actions-column {
  width: 1%;
  white-space: nowrap;
}

.empty-state {
  padding: 2rem;
}

.table-loading {
  padding: 3rem;
  text-align: center;
}

.pagination {
  margin: 0;
}

.page-link {
  border-color: var(--bs-border-color);
  color: var(--bs-body-color);
}

.page-link:hover {
  background-color: var(--bs-gray-100);
  border-color: var(--bs-border-color);
}

.page-item.active .page-link {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
}

/* Dark theme */
[data-bs-theme="dark"] .data-table-container {
  background: var(--bs-gray-800);
  color: var(--bs-gray-100);
}

[data-bs-theme="dark"] .table th {
  background-color: var(--bs-gray-700);
  color: var(--bs-gray-100);
}

[data-bs-theme="dark"] .table th.sortable:hover {
  background-color: var(--bs-gray-600);
}

[data-bs-theme="dark"] .table-header {
  border-color: var(--bs-gray-600);
}

/* Responsive */
@media (max-width: 768px) {
  .table-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch !important;
  }
  
  .table-actions {
    flex-direction: column;
    gap: 0.5rem !important;
  }
  
  .search-box .input-group,
  .filter-box .form-select {
    width: 100%;
  }
  
  .table-footer {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>


import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase, dbHelpers, TABLES } from '@/services/supabase'
import { INVENTORY_MOVEMENT_TYPES, STATUS } from '@/utils/constants'
import { useAuthStore } from './auth'

export const useProductsStore = defineStore('products', () => {
  // State
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)
  const inventoryMovements = ref([])

  // Getters
  const activeProducts = computed(() => 
    products.value.filter(product => product.status === STATUS.ACTIVE)
  )
  
  const lowStockProducts = computed(() => 
    products.value.filter(product => 
      product.status === STATUS.ACTIVE && 
      product.current_stock <= product.min_stock
    )
  )
  
  const totalProductsValue = computed(() => 
    products.value.reduce((total, product) => 
      total + (product.current_stock * product.cost_price), 0
    )
  )
  
  const totalProducts = computed(() => products.value.length)
  
  const getProductById = computed(() => (id) => 
    products.value.find(product => product.id === id)
  )
  
  const getProductsByCategory = computed(() => (categoryId) => 
    products.value.filter(product => 
      product.category_id === categoryId && product.status === STATUS.ACTIVE
    )
  )

  // Actions
  const fetchProducts = async (options = {}) => {
    try {
      loading.value = true
      error.value = null

      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) {
        throw new Error('User not authenticated')
      }

      const queryOptions = {
        filters: {
          user_id: authStore.user.id,
          ...options.filters
        },
        orderBy: {
          column: options.orderBy || 'name',
          ascending: options.ascending ?? true
        },
        limit: options.limit,
        offset: options.offset
      }

      const data = await dbHelpers.getAll(TABLES.PRODUCTS, queryOptions)
      
      if (options.append) {
        products.value = [...products.value, ...data]
      } else {
        products.value = data
      }

      return data
    } catch (err) {
      error.value = err.message
      console.error('Fetch products error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createProduct = async (productData) => {
    try {
      loading.value = true
      error.value = null

      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) {
        throw new Error('User not authenticated')
      }

      const newProduct = {
        ...productData,
        user_id: authStore.user.id,
        current_stock: productData.initial_stock || 0,
        status: STATUS.ACTIVE,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const createdProduct = await dbHelpers.create(TABLES.PRODUCTS, newProduct)
      
      // Create initial inventory movement if there's initial stock
      if (productData.initial_stock > 0) {
        await createInventoryMovement({
          product_id: createdProduct.id,
          type: INVENTORY_MOVEMENT_TYPES.IN,
          quantity: productData.initial_stock,
          notes: 'Stok awal produk',
          reference_type: 'initial_stock'
        })
      }

      products.value.push(createdProduct)
      return createdProduct
    } catch (err) {
      error.value = err.message
      console.error('Create product error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateProduct = async (id, productData) => {
    try {
      loading.value = true
      error.value = null

      const updateData = {
        ...productData,
        updated_at: new Date().toISOString()
      }

      const updatedProduct = await dbHelpers.update(TABLES.PRODUCTS, id, updateData)
      
      const index = products.value.findIndex(product => product.id === id)
      if (index !== -1) {
        products.value[index] = updatedProduct
      }

      return updatedProduct
    } catch (err) {
      error.value = err.message
      console.error('Update product error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteProduct = async (id) => {
    try {
      loading.value = true
      error.value = null

      // Check if product is being used in transactions
      const { data: transactions } = await supabase
        .from(TABLES.TRANSACTIONS)
        .select('id')
        .eq('product_id', id)
        .limit(1)

      if (transactions && transactions.length > 0) {
        throw new Error('Produk tidak dapat dihapus karena masih digunakan dalam transaksi')
      }

      await dbHelpers.delete(TABLES.PRODUCTS, id)
      
      // Also delete related inventory movements
      await supabase
        .from(TABLES.INVENTORY_MOVEMENTS)
        .delete()
        .eq('product_id', id)
      
      products.value = products.value.filter(product => product.id !== id)
      return true
    } catch (err) {
      error.value = err.message
      console.error('Delete product error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateStock = async (productId, newStock, notes = '') => {
    try {
      loading.value = true
      error.value = null

      const product = products.value.find(p => p.id === productId)
      if (!product) throw new Error('Product not found')

      const oldStock = product.current_stock
      const difference = newStock - oldStock

      // Update product stock
      const updatedProduct = await updateProduct(productId, {
        current_stock: newStock
      })

      // Create inventory movement record
      if (difference !== 0) {
        await createInventoryMovement({
          product_id: productId,
          type: difference > 0 ? INVENTORY_MOVEMENT_TYPES.IN : INVENTORY_MOVEMENT_TYPES.OUT,
          quantity: Math.abs(difference),
          notes: notes || 'Penyesuaian stok manual',
          reference_type: 'manual_adjustment'
        })
      }

      return updatedProduct
    } catch (err) {
      error.value = err.message
      console.error('Update stock error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const adjustStock = async (productId, quantity, type, notes = '', referenceType = 'manual_adjustment', referenceId = null) => {
    try {
      loading.value = true
      error.value = null

      const product = products.value.find(p => p.id === productId)
      if (!product) throw new Error('Product not found')

      let newStock = product.current_stock

      if (type === INVENTORY_MOVEMENT_TYPES.IN) {
        newStock += quantity
      } else if (type === INVENTORY_MOVEMENT_TYPES.OUT) {
        newStock -= quantity
        if (newStock < 0) {
          throw new Error('Stok tidak mencukupi')
        }
      }

      // Update product stock
      const updatedProduct = await updateProduct(productId, {
        current_stock: newStock
      })

      // Create inventory movement record
      await createInventoryMovement({
        product_id: productId,
        type,
        quantity,
        notes,
        reference_type: referenceType,
        reference_id: referenceId
      })

      return updatedProduct
    } catch (err) {
      error.value = err.message
      console.error('Adjust stock error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createInventoryMovement = async (movementData) => {
    try {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) {
        throw new Error('User not authenticated')
      }

      const newMovement = {
        ...movementData,
        user_id: authStore.user.id,
        created_at: new Date().toISOString()
      }

      const createdMovement = await dbHelpers.create(TABLES.INVENTORY_MOVEMENTS, newMovement)
      inventoryMovements.value.unshift(createdMovement)
      
      return createdMovement
    } catch (err) {
      console.error('Create inventory movement error:', err)
      throw err
    }
  }

  const fetchInventoryMovements = async (productId = null, options = {}) => {
    try {
      loading.value = true
      error.value = null

      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) {
        throw new Error('User not authenticated')
      }

      const filters = {
        user_id: authStore.user.id,
        ...options.filters
      }

      if (productId) {
        filters.product_id = productId
      }

      const queryOptions = {
        filters,
        orderBy: {
          column: 'created_at',
          ascending: false
        },
        limit: options.limit || 50
      }

      const data = await dbHelpers.getAll(TABLES.INVENTORY_MOVEMENTS, queryOptions)
      inventoryMovements.value = data

      return data
    } catch (err) {
      error.value = err.message
      console.error('Fetch inventory movements error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const searchProducts = async (searchTerm) => {
    try {
      loading.value = true
      error.value = null

      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) {
        throw new Error('User not authenticated')
      }

      const { data, error: searchError } = await supabase
        .from(TABLES.PRODUCTS)
        .select(`
          *,
          categories (
            id,
            name,
            color
          )
        `)
        .eq('user_id', authStore.user.id)
        .or(`name.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%,barcode.ilike.%${searchTerm}%`)
        .order('name')

      if (searchError) throw searchError

      return data || []
    } catch (err) {
      error.value = err.message
      console.error('Search products error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getProductsWithLowStock = async (threshold = null) => {
    try {
      const authStore = useAuthStore()
      if (!authStore.isAuthenticated) {
        throw new Error('User not authenticated')
      }

      let query = supabase
        .from(TABLES.PRODUCTS)
        .select('*')
        .eq('user_id', authStore.user.id)
        .eq('status', STATUS.ACTIVE)

      if (threshold) {
        query = query.lte('current_stock', threshold)
      } else {
        // Use product's individual min_stock threshold
        query = query.filter('current_stock', 'lte', 'min_stock')
      }

      const { data, error: queryError } = await query.order('current_stock')

      if (queryError) throw queryError

      return data || []
    } catch (err) {
      error.value = err.message
      console.error('Get low stock products error:', err)
      throw err
    }
  }

  const toggleProductStatus = async (id) => {
    try {
      const product = products.value.find(p => p.id === id)
      if (!product) throw new Error('Product not found')

      const newStatus = product.status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE

      return await updateProduct(id, { status: newStatus })
    } catch (err) {
      error.value = err.message
      console.error('Toggle product status error:', err)
      throw err
    }
  }

  const getProductStats = computed(() => {
    const stats = {
      total: products.value.length,
      active: activeProducts.value.length,
      lowStock: lowStockProducts.value.length,
      totalValue: totalProductsValue.value,
      outOfStock: products.value.filter(p => p.current_stock === 0).length
    }

    return stats
  })

  const clearError = () => {
    error.value = null
  }

  const reset = () => {
    products.value = []
    inventoryMovements.value = []
    loading.value = false
    error.value = null
  }

  // Return store interface
  return {
    // State
    products,
    loading,
    error,
    inventoryMovements,
    
    // Getters
    activeProducts,
    lowStockProducts,
    totalProductsValue,
    totalProducts,
    getProductById,
    getProductsByCategory,
    getProductStats,
    
    // Actions
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    adjustStock,
    createInventoryMovement,
    fetchInventoryMovements,
    searchProducts,
    getProductsWithLowStock,
    toggleProductStatus,
    clearError,
    reset
  }
})

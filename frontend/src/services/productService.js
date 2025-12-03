import api from './api'

export const productService = {
  // Get all products with filters (Laravel pagination)
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params })
    return response.data // Laravel returns { data: [], current_page, last_page, etc }
  },

  // Get product by ID
  getProductById: async (id) => {
    try {
      console.log('Fetching product with ID:', id)
      const response = await api.get(`/products/${id}`)
      console.log('Product response:', response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching product:', {
        id,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      throw error
    }
  },

  // Search products
  searchProducts: async (query) => {
    const response = await api.get('/products', { params: { search: query } })
    return response.data
  },

  // Get products by category
  getProductsByCategory: async (categoryId, params = {}) => {
    const response = await api.get('/products', { 
      params: { category_id: categoryId, ...params } 
    })
    return response.data
  },

  // Get sale products
  getSaleProducts: async (limit = 8) => {
    const response = await api.get('/products', { 
      params: { has_sale: true, per_page: limit } 
    })
    return response.data
  },

  // Get categories
  getCategories: async () => {
    const response = await api.get('/product-categories')
    return response.data
  },

  // Get category by ID
  getCategoryById: async (id) => {
    const response = await api.get(`/product-categories/${id}`)
    return response.data
  },

  // Add product review
  addReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData)
    return response.data
  },

  // Get product reviews
  getReviews: async (productId) => {
    const response = await api.get(`/products/${productId}/reviews`)
    return response.data
  },

  // Admin: Create product
  createProduct: async (productData) => {
    const response = await api.post('/admin/products', productData)
    return response.data
  },

  // Admin: Update product
  updateProduct: async (id, productData) => {
    const response = await api.put(`/admin/products/${id}`, productData)
    return response.data
  },

  // Admin: Delete product
  deleteProduct: async (id) => {
    const response = await api.delete(`/admin/products/${id}`)
    return response.data
  },
}


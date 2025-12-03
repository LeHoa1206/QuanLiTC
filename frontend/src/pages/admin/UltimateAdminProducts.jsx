import { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash, FaSearch, FaImage, FaBox } from 'react-icons/fa'
import { productService } from '../../services/productService'
import { toast } from 'react-toastify'

const UltimateAdminProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    sale_price: '',
    stock_quantity: '',
    description: '',
    category_id: '1',
    main_image: '',
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await productService.getProducts()
      setProducts(data.data || data)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Không thể tải sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return

    try {
      await productService.deleteProduct(id)
      toast.success('Xóa sản phẩm thành công!')
      fetchProducts()
    } catch (error) {
      toast.error('Xóa sản phẩm thất bại')
    }
  }

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        price: product.price,
        sale_price: product.sale_price || '',
        stock_quantity: product.stock_quantity,
        description: product.description || '',
        category_id: product.category_id || '1',
        main_image: product.main_image || '',
      })
    } else {
      setEditingProduct(null)
      setFormData({
        name: '',
        price: '',
        sale_price: '',
        stock_quantity: '',
        description: '',
        category_id: '1',
        main_image: '',
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingProduct(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Chuẩn bị data với đầy đủ fields
      const submitData = {
        name: formData.name,
        category_id: parseInt(formData.category_id),
        price: parseFloat(formData.price),
        sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
        stock_quantity: parseInt(formData.stock_quantity),
        description: formData.description || '',
        main_image: formData.main_image || '',
        status: 'active',
      }

      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, submitData)
        toast.success('Cập nhật sản phẩm thành công!')
      } else {
        await productService.createProduct(submitData)
        toast.success('Thêm sản phẩm thành công!')
      }
      handleCloseModal()
      fetchProducts()
    } catch (error) {
      console.error('Submit error:', error.response?.data || error)
      const errorMsg = error.response?.data?.message || (editingProduct ? 'Cập nhật thất bại' : 'Thêm sản phẩm thất bại')
      toast.error(errorMsg)
    }
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-5xl font-black text-gray-900 mb-2 bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            Quản Lý Sản Phẩm
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            Tổng số: {products.length} sản phẩm
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold rounded-xl hover:from-pink-600 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <FaPlus />
          Thêm Sản Phẩm
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl p-6 shadow-xl mb-6 border-2 border-gray-100">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none text-gray-900 font-medium"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-6 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none text-gray-900 font-medium"
          >
            <option value="all">Tất cả danh mục</option>
            <option value="food">Thức ăn</option>
            <option value="toy">Đồ chơi</option>
            <option value="accessory">Phụ kiện</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 mt-4 font-medium">Đang tải...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 group">
              {/* Image */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                {product.main_image ? (
                  <img
                    src={product.main_image.startsWith('http') 
                      ? product.main_image 
                      : `http://localhost:8000/storage/${product.main_image}`}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-16 h-16 text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path></svg></div>'
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaImage className="text-6xl text-gray-300" />
                  </div>
                )}
                <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-bold text-gray-900">
                  #{product.id}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-black text-pink-600">
                    {parseInt(product.price).toLocaleString('vi-VN')}đ
                  </span>
                  <span className="text-sm font-semibold text-gray-600">
                    Kho: {product.stock_quantity}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleOpenModal(product)}
                    className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all flex items-center justify-center gap-2"
                  >
                    <FaEdit />
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold rounded-lg hover:from-red-600 hover:to-rose-700 transition-all flex items-center justify-center gap-2"
                  >
                    <FaTrash />
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-20">
          <FaBox className="text-8xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-xl font-medium">Không tìm thấy sản phẩm</p>
        </div>
      )}

      {/* Modal Thêm/Sửa */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-pink-500 to-rose-600 text-white p-6 rounded-t-2xl">
              <h2 className="text-2xl font-black">
                {editingProduct ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-900 font-bold mb-2">Tên sản phẩm *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none"
                  placeholder="Nhập tên sản phẩm"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-900 font-bold mb-2">Giá *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-gray-900 font-bold mb-2">Giá khuyến mãi</label>
                  <input
                    type="number"
                    value={formData.sale_price}
                    onChange={(e) => setFormData({...formData, sale_price: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-900 font-bold mb-2">Số lượng *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-gray-900 font-bold mb-2">Danh mục</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none"
                  >
                    <option value="1">Thức ăn</option>
                    <option value="2">Đồ chơi</option>
                    <option value="3">Phụ kiện</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-900 font-bold mb-2">URL Hình ảnh</label>
                <input
                  type="text"
                  value={formData.main_image}
                  onChange={(e) => setFormData({...formData, main_image: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-gray-900 font-bold mb-2">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none"
                  placeholder="Mô tả sản phẩm..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-900 font-bold rounded-xl hover:bg-gray-300 transition-all"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold rounded-xl hover:from-pink-600 hover:to-rose-700 transition-all"
                >
                  {editingProduct ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UltimateAdminProducts

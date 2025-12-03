import { useNavigate } from 'react-router-dom'
import { FaBalanceScale, FaTimes, FaShoppingCart, FaStar, FaCheck, FaTimes as FaX } from 'react-icons/fa'
import { useCompare } from '../contexts/CompareContext'
import { useCart } from '../contexts/CartContext'
import { toast } from 'react-toastify'

const UltimateCompare = () => {
  const navigate = useNavigate()
  const { compareList, removeFromCompare, clearCompare } = useCompare()
  const { addToCart } = useCart()

  if (compareList.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-9xl mb-6 animate-bounce">📊</div>
            <h1 className="text-4xl font-black text-gray-800 mb-4">
              Chưa Có Sản Phẩm Để So Sánh
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Thêm sản phẩm vào danh sách để so sánh chi tiết!
            </p>
            <button
              onClick={() => navigate('/products')}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              🛍️ Khám Phá Sản Phẩm
            </button>
          </div>
        </div>
      </div>
    )
  }

  const compareAttributes = [
    { key: 'image', label: 'Hình Ảnh', type: 'image' },
    { key: 'name', label: 'Tên Sản Phẩm', type: 'text' },
    { key: 'price', label: 'Giá Gốc', type: 'price' },
    { key: 'sale_price', label: 'Giá Khuyến Mãi', type: 'price' },
    { key: 'rating', label: 'Đánh Giá', type: 'rating' },
    { key: 'stock_quantity', label: 'Tồn Kho', type: 'stock' },
    { key: 'category', label: 'Danh Mục', type: 'category' },
    { key: 'description', label: 'Mô Tả', type: 'description' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-gray-800 mb-2 flex items-center gap-3">
              <FaBalanceScale className="text-blue-500" />
              So Sánh Sản Phẩm
            </h1>
            <p className="text-gray-600">
              Đang so sánh {compareList.length} sản phẩm
            </p>
          </div>
          <button
            onClick={clearCompare}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg transition-all hover:scale-105"
          >
            Xóa Tất Cả
          </button>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody>
                {compareAttributes.map((attr, index) => (
                  <tr
                    key={attr.key}
                    className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                  >
                    {/* Attribute Label */}
                    <td className="p-4 font-bold text-gray-700 border-r-2 border-gray-200 sticky left-0 bg-gradient-to-r from-blue-100 to-purple-100 min-w-[150px]">
                      {attr.label}
                    </td>

                    {/* Product Values */}
                    {compareList.map((product) => (
                      <td key={product.id} className="p-4 text-center min-w-[250px] relative">
                        {attr.type === 'image' && (
                          <div className="relative group">
                            <img
                              src={product.main_image || product.image}
                              alt={product.name}
                              className="w-full aspect-square object-cover rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-all"
                              onClick={() => navigate(`/products/${product.id}`)}
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400'
                              }}
                            />
                            {/* Remove Button */}
                            <button
                              onClick={() => removeFromCompare(product.id)}
                              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
                            >
                              <FaTimes />
                            </button>
                            {/* Add to Cart Button */}
                            <button
                              onClick={() => {
                                const success = addToCart(product, 1)
                                if (success) {
                                  toast.success('Đã thêm vào giỏ hàng! 🛒')
                                }
                              }}
                              className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full font-bold shadow-lg transition-all hover:scale-105 opacity-0 group-hover:opacity-100 flex items-center gap-2"
                            >
                              <FaShoppingCart /> Thêm
                            </button>
                          </div>
                        )}

                        {attr.type === 'text' && (
                          <div
                            className="font-bold text-gray-800 cursor-pointer hover:text-orange-500 transition-colors"
                            onClick={() => navigate(`/products/${product.id}`)}
                          >
                            {product[attr.key]}
                          </div>
                        )}

                        {attr.type === 'price' && (
                          <div>
                            {product[attr.key] ? (
                              <span className="text-2xl font-black text-orange-500">
                                {parseFloat(product[attr.key]).toLocaleString('vi-VN')}₫
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </div>
                        )}

                        {attr.type === 'rating' && (
                          <div className="flex items-center justify-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={
                                  i < (product.rating || 0)
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                }
                              />
                            ))}
                            <span className="ml-2 font-bold text-gray-700">
                              {product.rating || 0}
                            </span>
                          </div>
                        )}

                        {attr.type === 'stock' && (
                          <div>
                            {product.stock_quantity > 0 ? (
                              <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full font-bold">
                                <FaCheck /> {product.stock_quantity} sản phẩm
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full font-bold">
                                <FaX /> Hết hàng
                              </span>
                            )}
                          </div>
                        )}

                        {attr.type === 'category' && (
                          <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-bold">
                            {product.category?.name || 'Chưa phân loại'}
                          </span>
                        )}

                        {attr.type === 'description' && (
                          <div className="text-sm text-gray-600 line-clamp-3 text-left">
                            {product.description || 'Không có mô tả'}
                          </div>
                        )}
                      </td>
                    ))}

                    {/* Empty columns if less than 4 products */}
                    {[...Array(4 - compareList.length)].map((_, i) => (
                      <td key={`empty-${i}`} className="p-4 min-w-[250px] bg-gray-100">
                        <div className="text-gray-400 text-center">
                          {attr.type === 'image' && '📦'}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center text-gray-600">
          <p>💡 Bạn có thể so sánh tối đa 4 sản phẩm cùng lúc</p>
        </div>
      </div>
    </div>
  )
}

export default UltimateCompare

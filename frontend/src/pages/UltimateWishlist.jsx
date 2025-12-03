import { useNavigate } from 'react-router-dom'
import { FaHeart, FaShoppingCart, FaTimes, FaBalanceScale } from 'react-icons/fa'
import { useWishlist } from '../contexts/WishlistContext'
import { useCompare } from '../contexts/CompareContext'
import { useCart } from '../contexts/CartContext'
import { toast } from 'react-toastify'

const UltimateWishlist = () => {
  const navigate = useNavigate()
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCompare, isInCompare } = useCompare()
  const { addToCart } = useCart()

  const handleAddToCart = (product) => {
    const success = addToCart(product, 1)
    if (success) {
      toast.success('Đã thêm vào giỏ hàng! 🛒')
    }
  }

  const handleAddToCompare = (product) => {
    addToCompare(product)
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-9xl mb-6 animate-bounce">💔</div>
            <h1 className="text-4xl font-black text-gray-800 mb-4">
              Danh Sách Yêu Thích Trống
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Hãy thêm những sản phẩm yêu thích của bạn vào đây!
            </p>
            <button
              onClick={() => navigate('/products')}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              🛍️ Khám Phá Sản Phẩm
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-gray-800 mb-2 flex items-center gap-3">
              <FaHeart className="text-red-500 animate-pulse" />
              Danh Sách Yêu Thích
            </h1>
            <p className="text-gray-600">
              Bạn có {wishlist.length} sản phẩm yêu thích
            </p>
          </div>
          <button
            onClick={clearWishlist}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg transition-all hover:scale-105"
          >
            Xóa Tất Cả
          </button>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all group"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.main_image || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500 cursor-pointer"
                  onClick={() => navigate(`/products/${product.id}`)}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400'
                  }}
                />
                
                {/* Remove Button */}
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-3 right-3 bg-white/90 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-full shadow-lg transition-all hover:scale-110"
                >
                  <FaTimes />
                </button>

                {/* Sale Badge */}
                {product.sale_price && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                    -{Math.round((1 - parseFloat(product.sale_price) / parseFloat(product.price)) * 100)}%
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3
                  className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 cursor-pointer hover:text-orange-500 transition-colors"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  {product.name}
                </h3>

                {/* Price */}
                <div className="mb-4">
                  {product.sale_price ? (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-red-500">
                        {parseFloat(product.sale_price).toLocaleString('vi-VN')}₫
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        {parseFloat(product.price).toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-black text-orange-500">
                      {parseFloat(product.price).toLocaleString('vi-VN')}₫
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <FaShoppingCart /> Thêm
                  </button>
                  <button
                    onClick={() => handleAddToCompare(product)}
                    disabled={isInCompare(product.id)}
                    className={`p-2 rounded-lg font-bold transition-all ${
                      isInCompare(product.id)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105'
                    }`}
                    title="So sánh"
                  >
                    <FaBalanceScale />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UltimateWishlist

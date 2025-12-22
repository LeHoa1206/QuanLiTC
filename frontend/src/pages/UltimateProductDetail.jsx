import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaStar, FaShoppingCart, FaMinus, FaPlus, FaHeart, FaShare, FaTruck, FaShieldAlt, FaUndo, FaExpand, FaTimes, FaChevronLeft, FaChevronRight, FaSearchPlus, FaBalanceScale } from 'react-icons/fa'
import { productService } from '../services/productService'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { useWishlist } from '../contexts/WishlistContext'
import { useCompare } from '../contexts/CompareContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const UltimateProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('description')
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { addToCompare, isInCompare } = useCompare()

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const data = await productService.getProductById(id)
      setProduct(data)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Không thể tải sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (quantity > product.stock_quantity) {
      toast.error(`Chỉ còn ${product.stock_quantity} sản phẩm trong kho`)
      return
    }
    
    const success = addToCart({ ...product, quantity })
    if (success) {
      toast.success('Đã thêm vào giỏ hàng! 🛒')
    }
  }

  const handleBuyNow = () => {
    if (quantity > product.stock_quantity) {
      toast.error(`Chỉ còn ${product.stock_quantity} sản phẩm trong kho`)
      return
    }
    
    const success = addToCart({ ...product, quantity })
    if (success) {
      navigate('/cart')
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    
    if (!user) {
      toast.warning('Vui lòng đăng nhập để đánh giá!')
      navigate('/login')
      return
    }

    if (!newReview.comment.trim()) {
      toast.error('Vui lòng nhập nội dung đánh giá!')
      return
    }

    try {
      setSubmittingReview(true)
      const token = localStorage.getItem('auth_token')
      
      await axios.post(
        `http://localhost:8000/api/reviews`,
        {
          reviewable_type: 'product',
          reviewable_id: parseInt(id),
          rating: newReview.rating,
          comment: newReview.comment
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      toast.success('Đánh giá của bạn đã được gửi! ⭐')
      setNewReview({ rating: 5, comment: '' })
      fetchProduct() // Reload to show new review
    } catch (error) {
      console.error('Review error:', error)
      if (error.response?.status === 401) {
        toast.error('Vui lòng đăng nhập để đánh giá sản phẩm! 🔐')
      } else {
        toast.error(error.response?.data?.message || 'Không thể gửi đánh giá')
      }
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-semibold">⏳ Đang tải sản phẩm...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😿</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy sản phẩm</h2>
          <button 
            onClick={() => navigate('/products')}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg"
          >
            ← Quay lại cửa hàng
          </button>
        </div>
      </div>
    )
  }

  const isNewProduct = (createdAt) => {
    const productDate = new Date(createdAt)
    const now = new Date()
    const diffDays = (now - productDate) / (1000 * 60 * 60 * 24)
    return diffDays <= 7
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Animated Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 py-8">
        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-float"
              style={{
                width: `${Math.random() * 15 + 5}px`,
                height: `${Math.random() * 15 + 5}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 10}s`
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-3 text-white">
            <button onClick={() => navigate('/products')} className="hover:underline font-semibold">
              🏪 Cửa hàng
            </button>
            <span>/</span>
            <span className="font-bold">{product.name}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-30px) translateX(20px); }
        }
        .animate-float { animation: float linear infinite; }
      `}</style>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Product Image */}
          <div className="relative">
            <div className="sticky top-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-all"></div>
                <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-white">
                  <img 
                    src={product.main_image || product.image} 
                    alt={product.name} 
                    className="w-full aspect-square object-cover transform group-hover:scale-110 transition-all duration-500"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800'
                    }}
                  />
                  
                  {/* Badges */}
                  {isNewProduct(product.created_at) && (
                    <div className="absolute top-4 left-4">
                      <div className="relative">
                        <img 
                          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cg%3E%3Ccircle cx='50' cy='50' r='45' fill='%23ff6b00'/%3E%3Cpath d='M50 10 L60 40 L90 40 L65 60 L75 90 L50 70 L25 90 L35 60 L10 40 L40 40 Z' fill='%23ffed00'/%3E%3C/g%3E%3C/svg%3E" 
                          alt="NEW" 
                          className="w-20 h-20 animate-bounce"
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-red-600 font-black text-sm transform -rotate-12">
                          NEW!
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {product.sale_price && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full font-black text-lg shadow-lg animate-pulse">
                      🔥 -{Math.round((1 - parseFloat(product.sale_price) / parseFloat(product.price)) * 100)}%
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button 
                  onClick={() => isInWishlist(product.id) ? removeFromWishlist(product.id) : addToWishlist(product)}
                  className={`flex-1 py-3 rounded-xl shadow-md font-bold transition-all flex items-center justify-center gap-2 hover:scale-105 ${
                    isInWishlist(product.id)
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                      : 'bg-white hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <FaHeart className={isInWishlist(product.id) ? 'text-white' : 'text-red-500'} /> 
                  {isInWishlist(product.id) ? 'Đã thích' : 'Yêu thích'}
                </button>
                <button 
                  onClick={() => addToCompare(product)}
                  disabled={isInCompare(product.id)}
                  className={`flex-1 py-3 rounded-xl shadow-md font-bold transition-all flex items-center justify-center gap-2 ${
                    isInCompare(product.id)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-white hover:bg-gray-50 text-gray-700 hover:scale-105'
                  }`}
                >
                  <FaBalanceScale className={isInCompare(product.id) ? 'text-gray-500' : 'text-blue-500'} /> 
                  {isInCompare(product.id) ? 'Đã thêm' : 'So sánh'}
                </button>
                <button className="py-3 px-4 bg-white hover:bg-gray-50 rounded-xl shadow-md font-bold text-gray-700 transition-all hover:scale-105">
                  <FaShare className="text-blue-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <h1 className="text-4xl font-black text-gray-800 mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={`text-2xl ${i < Math.floor(product.rating_average || 0) ? 'text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="text-xl font-bold text-gray-700">
                  {parseFloat(product.rating_average || 0).toFixed(1)}
                </span>
                <span className="text-gray-500">
                  ({product.reviews?.length || 0} đánh giá)
                </span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600 font-semibold">
                  Đã bán: <span className="text-orange-600 font-bold">{product.sold_count || 0}</span>
                </span>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 mb-6">
                {product.sale_price ? (
                  <div>
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                        {parseFloat(product.sale_price).toLocaleString('vi-VN')}đ
                      </span>
                      <span className="text-2xl text-gray-400 line-through">
                        {parseFloat(product.price).toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                    <div className="text-red-600 font-bold text-lg">
                      💰 Tiết kiệm: {(parseFloat(product.price) - parseFloat(product.sale_price)).toLocaleString('vi-VN')}đ
                    </div>
                  </div>
                ) : (
                  <span className="text-5xl font-black text-orange-600">
                    {parseFloat(product.price).toLocaleString('vi-VN')}đ
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
                  <p className="text-gray-600 text-sm mb-1">Tồn kho</p>
                  <p className="text-3xl font-black text-green-600">{product.stock_quantity || 0}</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200">
                  <p className="text-gray-600 text-sm mb-1">Đã bán</p>
                  <p className="text-3xl font-black text-blue-600">{product.sold_count || 0}</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-200">
                  <p className="text-gray-600 text-sm mb-1">Đánh giá</p>
                  <p className="text-3xl font-black text-yellow-600">{parseFloat(product.rating_average || 0).toFixed(1)}</p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-3 text-lg">Số lượng:</label>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all hover:scale-110 font-bold text-xl"
                  >
                    <FaMinus />
                  </button>
                  <span className="text-3xl font-black text-gray-800 w-16 text-center">{quantity}</span>
                  <button 
                    onClick={() => {
                      if (quantity >= product.stock_quantity) {
                        toast.error(`Chỉ còn ${product.stock_quantity} sản phẩm trong kho`)
                        return
                      }
                      setQuantity(quantity + 1)
                    }}
                    className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all hover:scale-110 font-bold text-xl"
                  >
                    <FaPlus />
                  </button>
                  <span className="text-gray-500 ml-4">
                    {product.stock_quantity > 0 ? (
                      <span className="text-green-600 font-semibold">✓ Còn {product.stock_quantity} sản phẩm</span>
                    ) : (
                      <span className="text-red-600 font-semibold">✗ Hết hàng</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                  className="flex-1 py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-black rounded-2xl transition-all hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-3 text-lg"
                >
                  <FaShoppingCart className="text-xl" />
                  Thêm vào giỏ
                </button>
                <button 
                  onClick={handleBuyNow}
                  disabled={product.stock_quantity === 0}
                  className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-black rounded-2xl transition-all hover:shadow-2xl hover:scale-105 text-lg"
                >
                  🚀 Mua ngay
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-gray-200">
                <div className="text-center p-3 bg-blue-50 rounded-xl">
                  <FaTruck className="text-2xl text-blue-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-700">Miễn phí ship</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-xl">
                  <FaShieldAlt className="text-2xl text-green-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-700">Bảo hành 12 tháng</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-xl">
                  <FaUndo className="text-2xl text-orange-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-700">Đổi trả 7 ngày</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          {/* Tab Headers */}
          <div className="flex gap-4 mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-6 py-3 font-bold text-lg transition-all ${
                activeTab === 'description'
                  ? 'text-orange-600 border-b-4 border-orange-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📝 Mô tả sản phẩm
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-3 font-bold text-lg transition-all ${
                activeTab === 'reviews'
                  ? 'text-orange-600 border-b-4 border-orange-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              ⭐ Đánh giá ({product.reviews?.length || 0})
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              {product.description ? (
                <div className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                  {product.description}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-xl">Chưa có mô tả cho sản phẩm này</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              {/* Review Form */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 mb-8 border-2 border-orange-200">
                <h3 className="text-2xl font-black text-gray-800 mb-4">✍️ Viết đánh giá của bạn</h3>
                
                {!user ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">Bạn cần đăng nhập để đánh giá sản phẩm</p>
                    <button
                      onClick={() => navigate('/login')}
                      className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-xl transition-all hover:shadow-lg"
                    >
                      🔐 Đăng nhập ngay
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded-r-xl">
                      <p className="text-blue-800 text-sm font-semibold flex items-center gap-2">
                        <span>ℹ️</span>
                        Bạn chỉ có thể đánh giá sản phẩm đã mua và đơn hàng đã hoàn thành
                      </p>
                    </div>
                    
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div>
                        <label className="block text-gray-700 font-bold mb-2">Đánh giá của bạn:</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewReview({ ...newReview, rating: star })}
                              className="text-4xl transition-all hover:scale-110"
                            >
                              <FaStar className={star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-bold mb-2">Nhận xét:</label>
                        <textarea
                          value={newReview.comment}
                          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                          placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 resize-none"
                          rows="4"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold rounded-xl transition-all hover:shadow-lg disabled:cursor-not-allowed"
                      >
                        {submittingReview ? '⏳ Đang gửi...' : '📤 Gửi đánh giá'}
                      </button>
                    </form>
                  </>
                )}
              </div>

              {/* Reviews List */}
              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-6">
                  {product.reviews.map((review) => {
                    const customerName = review.user?.name || review.customer_name || 'Khách hàng'
                    return (
                      <div key={review.id} className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-orange-300 transition-all">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-black text-xl">
                              {customerName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-black text-gray-800 text-lg">
                                  {customerName}
                                </h4>
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full mt-1">
                                  ✓ Đã mua hàng
                                </span>
                              </div>
                              <span className="text-gray-500 text-sm">
                                {new Date(review.created_at).toLocaleDateString('vi-VN', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mb-3">
                              {[...Array(5)].map((_, i) => (
                                <FaStar 
                                  key={i} 
                                  className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                            
                            {review.reply_text && (
                              <div className="mt-4 pl-4 border-l-4 border-orange-500 bg-orange-50 rounded-r-2xl p-4">
                                <p className="text-orange-600 font-bold mb-2 flex items-center gap-2">
                                  <span>💬</span> Phản hồi từ Shop:
                                </p>
                                <p className="text-gray-700">{review.reply_text}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-6xl mb-4">💭</div>
                  <p className="text-xl font-semibold">Chưa có đánh giá nào</p>
                  <p className="text-gray-500 mt-2">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UltimateProductDetail

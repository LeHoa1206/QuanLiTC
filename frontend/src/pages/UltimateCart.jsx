import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaTrash, FaMinus, FaPlus, FaShoppingBag, FaArrowRight, FaGift, FaTruck, FaShieldAlt, FaUndo, FaStar } from 'react-icons/fa'
import { useCart } from '../contexts/CartContext'

import { toast } from 'react-toastify'

const UltimateCart = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart()
  const [removingId, setRemovingId] = useState(null)
  const [selectedItems, setSelectedItems] = useState([])
  const navigate = useNavigate()

  // Select all items by default when cart changes
  useEffect(() => {
    setSelectedItems(cart.map(item => item.id))
  }, [cart])

  const toggleSelectItem = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === cart.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(cart.map(item => item.id))
    }
  }

  const getSelectedTotal = () => {
    return cart
      .filter(item => selectedItems.includes(item.id))
      .reduce((total, item) => {
        const price = item.sale_price || item.price
        return total + price * item.quantity
      }, 0)
  }

  const getSelectedCount = () => {
    return cart.filter(item => selectedItems.includes(item.id)).length
  }

  const handleRemove = (id) => {
    setRemovingId(id)
    setTimeout(() => {
      removeFromCart(id)
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng')
    }, 300)
  }

  const finalTotal = getSelectedTotal()

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center relative overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-pink-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        {/* Floating Pets */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-6xl opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`
            }}
          >
            {['🐕', '🐈', '🐾', '🦴'][Math.floor(Math.random() * 4)]}
          </div>
        ))}

        <div className="text-center max-w-2xl mx-auto px-4 relative z-10">
          <div className="relative inline-block mb-8">
            <div className="w-48 h-48 bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 rounded-full flex items-center justify-center animate-bounce-slow shadow-2xl">
              <FaShoppingBag className="text-8xl text-white" />
            </div>
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center animate-spin-slow shadow-xl">
              <span className="text-4xl">🐾</span>
            </div>
          </div>
          
          <h2 className="text-6xl font-black text-gray-800 mb-6 animate-fade-in">
            Giỏ Hàng Trống
          </h2>
          <p className="text-2xl text-gray-600 mb-12 animate-fade-in" style={{animationDelay: '0.2s'}}>
            Hãy thêm những sản phẩm tuyệt vời cho thú cưng của bạn! 🐶🐱
          </p>
          
          <Link
            to="/products"
            className="inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white text-xl font-bold rounded-full hover:shadow-2xl hover:scale-110 transition-all duration-300 animate-fade-in group"
            style={{animationDelay: '0.4s'}}
          >
            <FaShoppingBag className="text-2xl group-hover:rotate-12 transition-transform" />
            Khám Phá Sản Phẩm
            <FaArrowRight className="text-2xl group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    )
  }

  const savings = cart.reduce((sum, item) => {
    if (item.sale_price) {
      return sum + ((item.price - item.sale_price) * item.quantity)
    }
    return sum
  }, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-black text-gray-800 mb-3">
            Giỏ Hàng
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500"> Của Bạn</span>
          </h1>
          <p className="text-xl text-gray-600">
            {cart.length} sản phẩm • Đã chọn {getSelectedCount()} • Tiết kiệm {savings.toLocaleString('vi-VN')}đ
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Select All */}
            <div className="bg-white rounded-2xl p-4 shadow-md flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedItems.length === cart.length && cart.length > 0}
                onChange={toggleSelectAll}
                className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
              <span className="font-semibold text-gray-700">
                Chọn tất cả ({cart.length} sản phẩm)
              </span>
            </div>

            {cart.map((item, index) => (
              <div
                key={item.id}
                className={`bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 ${selectedItems.includes(item.id) ? 'border-purple-400' : 'border-transparent hover:border-purple-200'} animate-slide-in ${removingId === item.id ? 'animate-slide-out' : ''}`}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="flex gap-6">
                  {/* Checkbox */}
                  <div className="flex items-start pt-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                      className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                  </div>

                  {/* Image */}
                  <Link
                    to={`/products/${item.id}`}
                    className="relative w-32 h-32 flex-shrink-0 rounded-2xl overflow-hidden group"
                  >
                    <img
                      src={item.main_image || item.image || 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200'}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {item.sale_price && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{Math.round((1 - item.sale_price / item.price) * 100)}%
                      </div>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${item.id}`}
                      className="text-xl font-bold text-gray-800 hover:text-purple-600 transition-colors line-clamp-2 mb-2 block"
                    >
                      {item.name}
                    </Link>

                    {/* Rating */}
                    {item.rating_average > 0 && (
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < Math.floor(item.rating_average) ? '' : 'opacity-30'} />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">({item.rating_average})</span>
                      </div>
                    )}

                    <div className="flex items-center gap-4 mb-4">
                      <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                        {((item.sale_price || item.price) * item.quantity).toLocaleString('vi-VN')}đ
                      </p>
                      {item.sale_price && (
                        <div className="flex flex-col">
                          <p className="text-sm text-gray-400 line-through">
                            {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                          </p>
                          <p className="text-xs text-green-600 font-semibold">
                            Tiết kiệm {((item.price - item.sale_price) * item.quantity).toLocaleString('vi-VN')}đ
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 bg-gray-100 rounded-full p-2">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-10 h-10 bg-white hover:bg-purple-100 rounded-full flex items-center justify-center transition-all shadow-md hover:shadow-lg active:scale-95"
                        >
                          <FaMinus className="text-purple-600" />
                        </button>
                        <span className="text-2xl font-bold text-gray-800 w-12 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-10 h-10 bg-white hover:bg-purple-100 rounded-full flex items-center justify-center transition-all shadow-md hover:shadow-lg active:scale-95"
                        >
                          <FaPlus className="text-purple-600" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-3 bg-red-50 hover:bg-red-100 rounded-full transition-all group active:scale-95"
                      >
                        <FaTrash className="text-red-500 group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            <button
              onClick={() => {
                if (window.confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
                  clearCart()
                  toast.success('Đã xóa toàn bộ giỏ hàng')
                }
              }}
              className="w-full py-4 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <FaTrash />
              Xóa toàn bộ giỏ hàng
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-purple-100 sticky top-24 animate-fade-in">
              <h3 className="text-3xl font-black text-gray-800 mb-6 flex items-center gap-3">
                <FaGift className="text-purple-500" />
                Tóm Tắt Đơn
              </h3>

              {/* Progress to Free Shipping */}
              <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-green-700">Miễn phí vận chuyển</span>
                  <FaTruck className="text-green-600 text-xl" />
                </div>
                <div className="w-full h-3 bg-green-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
                    style={{width: '100%'}}
                  ></div>
                </div>
                <p className="text-xs text-green-600 mt-2 font-semibold">
                  ✓ Bạn được miễn phí vận chuyển!
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính ({getSelectedCount()} sản phẩm đã chọn):</span>
                  <span className="font-bold text-gray-800">{getSelectedTotal().toLocaleString('vi-VN')}đ</span>
                </div>
                
                {savings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Tiết kiệm:</span>
                    <span className="font-bold">-{savings.toLocaleString('vi-VN')}đ</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span className="font-bold text-green-600">Miễn phí</span>
                </div>

                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-800">Tổng cộng:</span>
                    <div className="text-right">
                      <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                        {finalTotal.toLocaleString('vi-VN')}đ
                      </p>
                      {savings > 0 && (
                        <p className="text-sm text-green-600 font-semibold">
                          Đã tiết kiệm {savings.toLocaleString('vi-VN')}đ
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>



              {/* Checkout Button */}
              <Link
                to="/checkout"
                onClick={(e) => {
                  if (getSelectedCount() === 0) {
                    e.preventDefault()
                    toast.warning('Vui lòng chọn ít nhất 1 sản phẩm để thanh toán')
                  }
                }}
                className={`block w-full py-5 ${getSelectedCount() === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 hover:shadow-2xl hover:scale-105'} text-white text-xl font-black rounded-2xl transition-all text-center flex items-center justify-center gap-3 mb-4 group`}
              >
                <FaShoppingBag className="text-2xl group-hover:rotate-12 transition-transform" />
                Thanh Toán Ngay
                <FaArrowRight className="text-2xl group-hover:translate-x-2 transition-transform" />
              </Link>

              <Link
                to="/products"
                className="block w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-2xl transition-all text-center"
              >
                ← Tiếp tục mua sắm
              </Link>

              {/* Trust Badges */}
              <div className="mt-8 pt-8 border-t-2 border-gray-200 space-y-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                    <FaTruck className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="font-bold">Miễn phí vận chuyển</p>
                    <p className="text-sm text-gray-500">Giao hàng toàn quốc</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                    <FaShieldAlt className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="font-bold">Thanh toán an toàn</p>
                    <p className="text-sm text-gray-500">Bảo mật 100%</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <FaUndo className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="font-bold">Đổi trả dễ dàng</p>
                    <p className="text-sm text-gray-500">Trong vòng 7 ngày</p>
                  </div>
                </div>
              </div>

              {/* Support */}
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl text-center">
                <p className="text-sm text-gray-700 mb-2">Cần hỗ trợ?</p>
                <a href="tel:1900xxxx" className="text-lg font-bold text-purple-600 hover:text-purple-700">
                  📞 1900.xxxx
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UltimateCart

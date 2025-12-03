import { useState } from 'react'
import { FaSearch, FaPlus, FaMinus, FaTrash, FaPrint, FaMoneyBillWave, FaCreditCard } from 'react-icons/fa'

const SalesCreateOrder = () => {
  const [customer, setCustomer] = useState(null)
  const [searchCustomer, setSearchCustomer] = useState('')
  const [cart, setCart] = useState([])
  const [paymentMethod, setPaymentMethod] = useState('cash')

  const products = [
    { id: 1, name: 'Thức ăn Royal Canin 2kg', price: 350000, stock: 50, category: 'Thức ăn' },
    { id: 2, name: 'Balo vận chuyển cao cấp', price: 450000, stock: 20, category: 'Phụ kiện' },
    { id: 3, name: 'Cát vệ sinh 5kg', price: 120000, stock: 100, category: 'Vệ sinh' },
    { id: 4, name: 'Đồ chơi cho mèo', price: 80000, stock: 75, category: 'Đồ chơi' },
  ]

  const customers = [
    { id: 1, name: 'Nguyễn Văn A', phone: '0901234567' },
    { id: 2, name: 'Trần Thị B', phone: '0912345678' },
  ]

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id)
    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const updateQuantity = (id, change) => {
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
    ))
  }

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-black mb-2">🛒 Tạo đơn hàng tại quầy</h1>
          <p className="text-green-100">Tạo đơn hàng nhanh cho khách mua tại cửa hàng</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Selection */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-black text-gray-800 mb-4">Chọn khách hàng</h2>
              <div className="relative mb-4">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm khách hàng theo tên hoặc SĐT..."
                  value={searchCustomer}
                  onChange={(e) => setSearchCustomer(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                />
              </div>
              {customer ? (
                <div className="p-4 bg-green-50 border-2 border-green-500 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-800">{customer.name}</p>
                    <p className="text-sm text-gray-600">{customer.phone}</p>
                  </div>
                  <button
                    onClick={() => setCustomer(null)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600"
                  >
                    Xóa
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {customers.filter(c =>
                    c.name.toLowerCase().includes(searchCustomer.toLowerCase()) ||
                    c.phone.includes(searchCustomer)
                  ).map(c => (
                    <button
                      key={c.id}
                      onClick={() => setCustomer(c)}
                      className="p-3 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all text-left"
                    >
                      <p className="font-bold text-gray-800">{c.name}</p>
                      <p className="text-sm text-gray-600">{c.phone}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Products List */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-black text-gray-800 mb-4">Chọn sản phẩm</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map(product => (
                  <div key={product.id} className="border-2 border-gray-200 rounded-xl p-4 hover:border-purple-500 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 mb-1">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                        <p className="text-xl font-black text-green-600">{product.price.toLocaleString()}đ</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Kho: {product.stock}</span>
                      <button
                        onClick={() => addToCart(product)}
                        className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                      >
                        <FaPlus /> Thêm
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cart & Checkout */}
          <div className="space-y-6">
            {/* Cart */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-4">
              <h2 className="text-xl font-black text-gray-800 mb-4">Giỏ hàng ({cart.length})</h2>

              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>Chưa có sản phẩm nào</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto">
                    {cart.map(item => (
                      <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold text-gray-800 text-sm flex-1">{item.name}</h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300"
                            >
                              <FaMinus className="text-xs" />
                            </button>
                            <span className="w-8 text-center font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300"
                            >
                              <FaPlus className="text-xs" />
                            </button>
                          </div>
                          <span className="font-bold text-green-600">
                            {(item.price * item.quantity).toLocaleString()}đ
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Payment Method */}
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-800 mb-3">Phương thức thanh toán</h3>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition-all">
                        <input
                          type="radio"
                          name="payment"
                          value="cash"
                          checked={paymentMethod === 'cash'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-4 h-4"
                        />
                        <FaMoneyBillWave className="text-green-600 text-xl" />
                        <span className="font-semibold">Tiền mặt</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-purple-500 transition-all">
                        <input
                          type="radio"
                          name="payment"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-4 h-4"
                        />
                        <FaCreditCard className="text-blue-600 text-xl" />
                        <span className="font-semibold">Chuyển khoản</span>
                      </label>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t-2 border-gray-200 pt-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Tạm tính:</span>
                      <span className="font-bold">{total.toLocaleString()}đ</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-black text-gray-800">Tổng cộng:</span>
                      <span className="text-2xl font-black text-green-600">{total.toLocaleString()}đ</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <button className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-black text-lg hover:shadow-lg transition-all">
                      Thanh toán
                    </button>
                    <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                      <FaPrint /> In hóa đơn
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SalesCreateOrder

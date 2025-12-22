import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaBox, FaClock, FaCheck, FaTimes, FaTruck, FaShoppingBag, FaReceipt, FaMapMarkerAlt, FaPhone, FaRedo, FaMoneyBill, FaCheckCircle, FaClipboardList, FaHourglassHalf, FaBoxOpen, FaTimesCircle } from 'react-icons/fa'
import { orderService } from '../services/orderService'
import { useCart } from '../contexts/CartContext'
import { toast } from 'react-toastify'

const UltimateOrders = () => {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const data = await orderService.getOrders()
      setOrders(data.data || data)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Không thể tải đơn hàng')
    } finally {
      setLoading(false)
    }
  }

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: 'from-yellow-400 to-orange-400',
        bg: 'bg-gradient-to-r from-yellow-50 to-orange-50',
        border: 'border-yellow-300',
        text: 'text-yellow-700',
        icon: FaClock,
        label: 'Chờ xác nhận'
      },
      confirmed: {
        color: 'from-blue-400 to-cyan-400',
        bg: 'bg-gradient-to-r from-blue-50 to-cyan-50',
        border: 'border-blue-300',
        text: 'text-blue-700',
        icon: FaCheck,
        label: 'Đã xác nhận'
      },
      processing: {
        color: 'from-purple-400 to-pink-400',
        bg: 'bg-gradient-to-r from-purple-50 to-pink-50',
        border: 'border-purple-300',
        text: 'text-purple-700',
        icon: FaBox,
        label: 'Đang xử lý'
      },
      delivered: {
        color: 'from-green-400 to-emerald-400',
        bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
        border: 'border-green-300',
        text: 'text-green-700',
        icon: FaTruck,
        label: 'Đã giao'
      },
      cancelled: {
        color: 'from-red-400 to-rose-400',
        bg: 'bg-gradient-to-r from-red-50 to-rose-50',
        border: 'border-red-300',
        text: 'text-red-700',
        icon: FaTimes,
        label: 'Đã hủy'
      },
    }
    return configs[status] || configs.pending
  }

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.order_status === filter)

  const handleViewDetail = (order) => {
    setSelectedOrder(order)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setTimeout(() => setSelectedOrder(null), 300)
  }

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      return
    }

    try {
      await orderService.cancelOrder(orderId)
      toast.success('Đã hủy đơn hàng thành công!')
      closeModal()
      fetchOrders() // Reload orders
    } catch (error) {
      console.error('Cancel order error:', error)
      toast.error(error.response?.data?.message || 'Không thể hủy đơn hàng')
    }
  }

  const handleReorder = (order) => {
    if (!order.items || order.items.length === 0) {
      toast.error('Đơn hàng không có sản phẩm!')
      return
    }

    let addedCount = 0
    order.items.forEach(item => {
      if (item.product) {
        const success = addToCart({
          ...item.product,
          quantity: item.quantity
        })
        if (success) addedCount++
      }
    })

    if (addedCount > 0) {
      toast.success(`Đã thêm ${addedCount} sản phẩm vào giỏ hàng! 🛒`)
      closeModal()
      navigate('/cart')
    } else {
      toast.error('Không thể thêm sản phẩm vào giỏ hàng')
    }
  }

  const getProgressSteps = (status) => {
    const steps = [
      { label: 'Đơn hàng đã tạo', sub: 'Tạo đơn hàng', icon: FaReceipt },
      { label: 'Đã thanh toán', sub: 'Thanh toán khách hàng', icon: FaMoneyBill },
      { label: 'Đã giao hàng', sub: 'Đang giao', icon: FaTruck },
      { label: 'Hoàn thành', sub: 'Đơn hàng hoàn tất', icon: FaCheckCircle },
    ]

    let currentIndex = 0
    switch (status) {
      case 'pending':
        currentIndex = 0
        break
      case 'confirmed':
        currentIndex = 1
        break
      case 'processing':
        currentIndex = 2
        break
      case 'delivered':
        currentIndex = 3
        break
      default:
        currentIndex = -1
    }

    return { steps, currentIndex }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 py-16 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-400 rounded-3xl blur-2xl opacity-50 animate-pulse"></div>
            <div className="relative p-6 bg-gradient-to-br from-orange-500 to-pink-500 rounded-3xl shadow-2xl">
              <FaShoppingBag className="text-6xl text-white" />
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-gray-800 mb-4">
            Đơn Hàng Của Tôi
          </h1>
          <p className="text-xl text-gray-600">
            Theo dõi và quản lý tất cả đơn hàng của bạn
          </p>
        </div>

{/* PHẦN 1: Stats Summary - Màu đậm */}
<div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
  {[
    { 
      label: 'Tất cả', 
      value: orders.length, 
      icon: FaClipboardList,  
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-300',
      textColor: 'text-gray-800',
      countColor: 'text-gray-900',
      iconColor: 'text-gray-600'
    },
    { 
      label: 'Chờ xác nhận', 
      value: orders.filter(o => o.order_status === 'pending').length, 
      icon: FaHourglassHalf, 
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-300',
      textColor: 'text-orange-800',
      countColor: 'text-orange-900',
      iconColor: 'text-orange-600'
    },
    { 
      label: 'Đang xử lý', 
      value: orders.filter(o => o.order_status === 'processing').length, 
      icon: FaBox, 
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-300',
      textColor: 'text-indigo-800',
      countColor: 'text-indigo-900',
      iconColor: 'text-indigo-600'
    },
    { 
      label: 'Đã giao', 
      value: orders.filter(o => o.order_status === 'delivered').length, 
      icon: FaTruck,  
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-300',
      textColor: 'text-emerald-800',
      countColor: 'text-emerald-900',
      iconColor: 'text-emerald-600'
    },
    { 
      label: 'Đã hủy', 
      value: orders.filter(o => o.order_status === 'cancelled').length, 
      icon: FaTimes, 
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-300',
      textColor: 'text-rose-800',
      countColor: 'text-rose-900',
      iconColor: 'text-rose-600'
    },
  ].map((stat, i) => {
    const IconComponent = stat.icon
    
    return (
      <div 
        key={i} 
        className={`${stat.bgColor} rounded-xl p-4 border-2 ${stat.borderColor} hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className={`text-2xl ${stat.iconColor} transition-transform group-hover:scale-110`}>
            <IconComponent />
          </div>
          <div className={`text-3xl font-black ${stat.countColor}`}>
            {stat.value}
          </div>
        </div>
        <div className={`text-sm font-bold ${stat.textColor}`}>
          {stat.label}
        </div>
        {stat.sub && (
          <div className={`text-xs ${stat.textColor} opacity-80 mt-1`}>
            {stat.sub}
          </div>
        )}
      </div>
    )
  })}
</div>
{/* Filters - Vertical Design with Red Square Icon */}
<div className="flex flex-wrap gap-3 mb-10 justify-center">
  {[
    { 
      value: 'all', 
      label: 'All', 
      sub: 'Tất cả đơn hàng', 
      icon: FaClipboardList, 
      gradient: 'from-gray-500 to-gray-600',
      bgColor: 'from-gray-100 to-gray-200'
    },
    { 
      value: 'pending', 
      label: 'Pending confirmation', 
      sub: 'Đang chờ xác nhận', 
      icon: FaHourglassHalf, 
      gradient: 'from-yellow-500 to-orange-500',
      bgColor: 'from-yellow-100 to-orange-100'
    },
    { 
      value: 'processing', 
      label: 'Processing', 
      sub: 'Đang chuẩn bị hàng', 
      icon: FaBox, 
      gradient: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-100 to-pink-100'
    },
    { 
      value: 'delivered', 
      label: 'Delivered', 
      sub: 'Đã giao thành công', 
      icon: FaTruck, 
      gradient: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-100 to-emerald-100'
    },
    { 
      value: 'cancelled', 
      label: 'Cancelled', 
      sub: 'Đơn hàng đã hủy', 
      icon: FaTimes, 
      gradient: 'from-red-500 to-rose-500',
      bgColor: 'from-red-100 to-rose-100'
    },
  ].map((tab) => {
    const isActive = filter === tab.value;
    
    return (
      <button
        key={tab.value}
        onClick={() => setFilter(tab.value)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-base min-w-[180px] ${
          isActive
            ? `bg-gradient-to-r ${tab.gradient} text-white shadow-xl`
            : `bg-gradient-to-r ${tab.bgColor} text-gray-700 hover:bg-white border border-gray-200 hover:shadow-lg`
        }`}
      >
        {/* Icon trong hình vuông màu đỏ */}
        <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${
          isActive 
            ? 'bg-white/20' 
            : 'bg-gradient-to-br from-red-500 to-red-600'
        }`}>
          <tab.icon className={`text-lg ${isActive ? 'text-white' : 'text-white'}`} />
        </div>
        
        {/* Nội dung bên phải */}
        <div className="flex-1 text-left">
          <div className={`font-bold text-sm ${isActive ? 'text-white' : 'text-gray-800'}`}>
            {tab.label}
          </div>
          <div className={`text-xs ${isActive ? 'text-white/90' : 'text-gray-600'}`}>
            {tab.sub}
          </div>
        </div>

      </button>
    )
  })}
</div>


        {/* Orders List */}
        {loading ? (
          <div className="text-center py-32">
            <div className="inline-block w-20 h-20 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
            <p className="text-xl text-gray-600 font-semibold">Đang tải đơn hàng...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-8">
            {filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.order_status)
              const StatusIcon = statusConfig.icon
              
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 overflow-hidden hover:shadow-3xl transition-all hover:scale-[1.01]"
                >
                  {/* Order Header with Gradient */}
                  <div className={`${statusConfig.bg} p-6 border-b-2 ${statusConfig.border}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 bg-gradient-to-br ${statusConfig.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                          <FaReceipt className="text-3xl text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-gray-800 mb-1">
                            #{order.order_number}
                          </h3>
                          <p className="text-gray-600 text-sm font-medium">
                            📅 {new Date(order.created_at).toLocaleDateString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                      <div className={`px-6 py-3 rounded-2xl font-bold border-2 flex items-center gap-3 shadow-lg ${statusConfig.bg} ${statusConfig.border} ${statusConfig.text}`}>
                        <StatusIcon className="text-xl" />
                        {statusConfig.label}
                      </div>
                    </div>
                  </div>

                  {/* Order Body */}
                  <div className="p-8">
                    {/* Products Grid */}
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      {order.items?.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl hover:from-orange-50 hover:to-pink-50 transition-all group">
                          <div className="relative">
                            <img
                              src={item.product?.main_image || item.product?.image || 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=150'}
                              alt={item.product?.name || 'Product'}
                              className="w-24 h-24 rounded-xl object-cover shadow-lg group-hover:scale-110 transition-transform"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=150'
                              }}
                            />
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                              {item.quantity}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-800 font-bold text-base line-clamp-2 mb-2">
                              {item.product?.name || 'Sản phẩm'}
                            </p>
                            <p className="text-orange-600 font-black text-xl">
                              {item.price?.toLocaleString('vi-VN')}đ
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Info */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-100">
                      <div className="flex items-start gap-3">
                        <FaMapMarkerAlt className="text-2xl text-blue-600 mt-1" />
                        <div>
                          <p className="text-sm font-bold text-gray-600 mb-1">Địa chỉ giao hàng</p>
                          <p className="text-gray-800 font-medium">{order.shipping_address}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <FaPhone className="text-2xl text-blue-600 mt-1" />
                        <div>
                          <p className="text-sm font-bold text-gray-600 mb-1">Số điện thoại</p>
                          <p className="text-gray-800 font-medium">{order.phone}</p>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-6 border-t-2 border-gray-200">
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-gray-600 text-sm font-semibold mb-1">Tổng sản phẩm</p>
                          <p className="text-2xl font-black text-gray-800">
                            {order.items?.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm
                          </p>
                        </div>
                        <div className="h-12 w-px bg-gray-300"></div>
                        <div>
                          <p className="text-gray-600 text-sm font-semibold mb-1">Tổng tiền</p>
                          <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600">
                            {order.total_amount?.toLocaleString('vi-VN')}đ
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleViewDetail(order)}
                          className="px-10 py-5 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-black rounded-2xl transition-all hover:shadow-2xl hover:scale-110 text-lg flex items-center gap-3 group"
                        >
                          <FaReceipt className="text-xl group-hover:rotate-12 transition-transform" />
                          Xem chi tiết
                        </button>
                        {order.order_status === 'cancelled' && (
                          <button
                            onClick={() => handleReorder(order)}
                            className="px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-black rounded-2xl transition-all hover:shadow-2xl hover:scale-110 text-lg flex items-center gap-3 group"
                          >
                            <FaRedo className="text-xl group-hover:rotate-180 transition-transform" />
                            Mua lại
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-3xl shadow-2xl border-2 border-gray-100">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <div className="relative w-40 h-40 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center">
                <FaBox className="text-7xl text-orange-500" />
              </div>
            </div>
            <h3 className="text-4xl font-black text-gray-800 mb-4">
              Chưa có đơn hàng nào
            </h3>
            <p className="text-gray-600 mb-10 text-xl">
              Hãy khám phá và mua sắm những sản phẩm tuyệt vời cho thú cưng của bạn!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-black rounded-2xl hover:shadow-2xl hover:scale-110 transition-all text-xl"
            >
              <FaShoppingBag className="text-2xl" />
              Mua sắm ngay
            </Link>
          </div>
        )}
      </div>

      {/* Modal Chi Tiết Đơn Hàng */}
      {showModal && selectedOrder && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`${getStatusConfig(selectedOrder.order_status).bg} p-8 border-b-2 ${getStatusConfig(selectedOrder.order_status).border} sticky top-0 z-10`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${getStatusConfig(selectedOrder.order_status).color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <FaReceipt className="text-3xl text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-800">
                      Chi Tiết Đơn Hàng
                    </h2>
                    <p className="text-gray-600 font-semibold">
                      #{selectedOrder.order_number}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="w-12 h-12 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                >
                  <FaTimes className="text-2xl text-gray-600" />
                </button>
              </div>
              
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <div className={`px-6 py-3 rounded-2xl font-bold border-2 flex items-center gap-3 shadow-lg ${getStatusConfig(selectedOrder.order_status).bg} ${getStatusConfig(selectedOrder.order_status).border} ${getStatusConfig(selectedOrder.order_status).text}`}>
                  {(() => {
                    const StatusIcon = getStatusConfig(selectedOrder.order_status).icon
                    return <StatusIcon className="text-xl" />
                  })()}
                  {getStatusConfig(selectedOrder.order_status).label}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 font-semibold mb-1">Ngày đặt hàng</p>
                  <p className="text-lg font-black text-gray-800">
                    {new Date(selectedOrder.created_at).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              {/* Thông tin khách hàng */}
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-100">
                <h3 className="text-2xl font-black text-gray-800 mb-4 flex items-center gap-3">
                  <FaMapMarkerAlt className="text-blue-600" />
                  Thông Tin Giao Hàng
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-2">Người nhận</p>
                    <p className="text-lg font-semibold text-gray-800">{selectedOrder.customer_name || 'Khách hàng'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-2">Số điện thoại</p>
                    <p className="text-lg font-semibold text-gray-800">{selectedOrder.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-bold text-gray-600 mb-2">Địa chỉ giao hàng</p>
                    <p className="text-lg font-semibold text-gray-800">{selectedOrder.shipping_address}</p>
                  </div>
                  {selectedOrder.notes && (
                    <div className="md:col-span-2">
                      <p className="text-sm font-bold text-gray-600 mb-2">Ghi chú</p>
                      <p className="text-lg font-semibold text-gray-800">{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Danh sách sản phẩm */}
              <div className="mb-8">
                <h3 className="text-2xl font-black text-gray-800 mb-4 flex items-center gap-3">
                  <FaBox className="text-orange-600" />
                  Sản Phẩm Đã Đặt
                </h3>
                <div className="space-y-4">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl hover:from-orange-50 hover:to-pink-50 transition-all group">
                      <div className="relative">
                        <img
                          src={item.product?.main_image || item.product?.image || 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=150'}
                          alt={item.product?.name || 'Product'}
                          className="w-24 h-24 rounded-xl object-cover shadow-lg group-hover:scale-110 transition-transform"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=150'
                          }}
                        />
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-bold text-lg mb-2">
                          {item.product?.name || 'Sản phẩm'}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-gray-600 font-semibold">
                            Đơn giá: <span className="text-orange-600 font-black">{item.price?.toLocaleString('vi-VN')}đ</span>
                          </p>
                          <p className="text-gray-600 font-semibold">
                            Thành tiền: <span className="text-pink-600 font-black text-xl">{(item.price * item.quantity)?.toLocaleString('vi-VN')}đ</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tổng tiền */}
              <div className="p-6 bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl border-2 border-orange-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-lg">
                    <span className="text-gray-700 font-semibold">Tổng sản phẩm:</span>
                    <span className="text-gray-800 font-black">
                      {selectedOrder.items?.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-lg">
                    <span className="text-gray-700 font-semibold">Tạm tính:</span>
                    <span className="text-gray-800 font-black">
                      {selectedOrder.total_amount?.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-lg">
                    <span className="text-gray-700 font-semibold">Phí vận chuyển:</span>
                    <span className="text-green-600 font-black">Miễn phí</span>
                  </div>
                  <div className="h-px bg-gradient-to-r from-orange-300 to-pink-300 my-4"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-gray-800">Tổng cộng:</span>
                    <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600">
                      {selectedOrder.total_amount?.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8">
                {selectedOrder.order_status === 'pending' && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4 rounded-r-xl">
                    <p className="text-yellow-800 text-sm font-semibold flex items-center gap-2">
                      <span>⚠️</span>
                      Bạn chỉ có thể hủy đơn hàng khi đang ở trạng thái "Chờ xác nhận"
                    </p>
                  </div>
                )}

                {selectedOrder.order_status === 'cancelled' && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded-r-xl">
                    <p className="text-blue-800 text-sm font-semibold flex items-center gap-2">
                      <span>💡</span>
                      Đơn hàng đã bị hủy. Bạn có thể mua lại các sản phẩm này bất cứ lúc nào!
                    </p>
                  </div>
                )}
                
                <div className="flex gap-4">
                  {selectedOrder.order_status === 'pending' ? (
                    <>
                      <button
                        onClick={closeModal}
                        className="flex-1 px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-black rounded-2xl transition-all hover:shadow-xl text-lg"
                      >
                        Đóng
                      </button>
                      <button
                        onClick={() => handleCancelOrder(selectedOrder.id)}
                        className="flex-1 px-8 py-4 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-black rounded-2xl transition-all hover:shadow-xl text-lg flex items-center justify-center gap-2"
                      >
                        <FaTimes className="text-xl" />
                        Hủy đơn hàng
                      </button>
                    </>
                  ) : selectedOrder.order_status === 'cancelled' ? (
                    <>
                      <button
                        onClick={closeModal}
                        className="flex-1 px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-black rounded-2xl transition-all hover:shadow-xl text-lg"
                      >
                        Đóng
                      </button>
                      <button
                        onClick={() => handleReorder(selectedOrder)}
                        className="flex-1 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-black rounded-2xl transition-all hover:shadow-xl text-lg flex items-center justify-center gap-2"
                      >
                        <FaRedo className="text-xl" />
                        Mua lại
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={closeModal}
                      className="w-full px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-black rounded-2xl transition-all hover:shadow-xl text-lg"
                    >
                      Đóng
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UltimateOrders

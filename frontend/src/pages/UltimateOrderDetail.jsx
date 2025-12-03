import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  FaArrowLeft, FaBox, FaTruck, FaCheckCircle, FaTimesCircle, 
  FaPhone, FaMapMarkerAlt, FaCreditCard, FaCalendar,
  FaPrint
} from 'react-icons/fa'
import { toast } from 'react-toastify'
import api from '../services/api'

const UltimateOrderDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    fetchOrderDetail()
  }, [id])

  const fetchOrderDetail = async () => {
    try {
      const response = await api.get(`/orders/${id}`)
      setOrder(response.data.order)
    } catch (error) {
      toast.error('Không thể tải thông tin đơn hàng')
      navigate('/orders')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async () => {
    if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) return
    
    setCancelling(true)
    try {
      await api.put(`/orders/${id}/cancel`)
      toast.success('Đã hủy đơn hàng thành công')
      fetchOrderDetail()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể hủy đơn hàng')
    } finally {
      setCancelling(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
      processing: 'bg-purple-100 text-purple-800 border-purple-300',
      delivered: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status) => {
    const texts = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      processing: 'Đang xử lý',
      delivered: 'Đã giao hàng',
      cancelled: 'Đã hủy'
    }
    return texts[status] || status
  }

  const getPaymentMethodText = (method) => {
    const methods = {
      cash: 'Tiền mặt (COD)',
      card: 'Thẻ tín dụng',
      bank_transfer: 'Chuyển khoản',
      vnpay: 'VNPay',
      momo: 'MoMo'
    }
    return methods[method] || method
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!order) return null

  const canCancel = ['pending', 'confirmed'].includes(order.order_status)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold mb-4 transition-colors"
          >
            <FaArrowLeft />
            Quay lại đơn hàng
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-800 mb-2">
                Đơn Hàng
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500"> #{order.order_number}</span>
              </h1>
              <p className="text-gray-600">
                Đặt ngày {new Date(order.created_at).toLocaleDateString('vi-VN')}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePrint}
                className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl border-2 border-gray-200 transition-all flex items-center gap-2"
              >
                <FaPrint />
                In đơn
              </button>
              
              {canCancel && (
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <FaTimesCircle />
                  {cancelling ? 'Đang hủy...' : 'Hủy đơn'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-purple-100 animate-fade-in">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <FaBox className="text-purple-500" />
                Trạng Thái Đơn Hàng
              </h3>
              
              <div className="flex items-center gap-4 mb-6">
                <span className={`px-6 py-3 rounded-full font-bold text-lg border-2 ${getStatusColor(order.order_status)}`}>
                  {getStatusText(order.order_status)}
                </span>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                {['pending', 'confirmed', 'processing', 'delivered'].map((status, index) => {
                  const isActive = ['pending', 'confirmed', 'processing', 'delivered'].indexOf(order.order_status) >= index
                  const isCurrent = order.order_status === status
                  
                  return (
                    <div key={status} className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isActive ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                        {isActive ? <FaCheckCircle /> : <div className="w-3 h-3 rounded-full bg-gray-400"></div>}
                      </div>
                      <div className="flex-1">
                        <p className={`font-bold ${isCurrent ? 'text-purple-600' : isActive ? 'text-gray-800' : 'text-gray-400'}`}>
                          {getStatusText(status)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Products */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-purple-100 animate-fade-in" style={{animationDelay: '0.1s'}}>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Sản Phẩm</h3>
              
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all">
                    <img
                      src={item.product?.main_image || 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200'}
                      alt={item.product_name}
                      className="w-24 h-24 rounded-xl object-cover shadow-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-1">{item.product_name}</h4>
                      <p className="text-gray-600 text-sm mb-2">Số lượng: {item.quantity}</p>
                      <p className="text-purple-600 font-bold">
                        {item.unit_price.toLocaleString('vi-VN')}đ x {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                        {item.total_price.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-purple-100 sticky top-24 animate-fade-in" style={{animationDelay: '0.2s'}}>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Tóm Tắt</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính:</span>
                  <span className="font-bold">{order.subtotal.toLocaleString('vi-VN')}đ</span>
                </div>
                
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá:</span>
                    <span className="font-bold">-{order.discount_amount.toLocaleString('vi-VN')}đ</span>
                  </div>
                )}
                
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển:</span>
                  <span className="font-bold text-green-600">Miễn phí</span>
                </div>
                
                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-800">Tổng cộng:</span>
                    <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                      {order.total_amount.toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="pt-6 border-t-2 border-gray-200">
                <div className="flex items-center gap-3 text-gray-700 mb-3">
                  <FaCreditCard className="text-purple-500 text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">Thanh toán</p>
                    <p className="font-bold">{getPaymentMethodText(order.payment_method)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-gray-700">
                  <FaCalendar className="text-purple-500 text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">Ngày đặt</p>
                    <p className="font-bold">{new Date(order.created_at).toLocaleString('vi-VN')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-purple-100 animate-fade-in" style={{animationDelay: '0.3s'}}>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <FaTruck className="text-purple-500" />
                Giao Hàng
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-purple-500 text-xl mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Địa chỉ</p>
                    <p className="font-semibold text-gray-800">{order.shipping_address}</p>
                  </div>
                </div>
                
                {order.phone && (
                  <div className="flex items-start gap-3">
                    <FaPhone className="text-purple-500 text-xl mt-1" />
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Số điện thoại</p>
                      <p className="font-semibold text-gray-800">{order.phone}</p>
                    </div>
                  </div>
                )}
                
                {order.notes && (
                  <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Ghi chú</p>
                    <p className="text-gray-700">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UltimateOrderDetail

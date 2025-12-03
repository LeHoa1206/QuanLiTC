import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  FaArrowLeft, FaBox, FaTruck, FaCheckCircle, FaTimesCircle, 
  FaPhone, FaMapMarkerAlt, FaCreditCard, FaCalendar,
  FaPrint, FaEdit, FaStickyNote, FaUser
} from 'react-icons/fa'
import { toast } from 'react-toastify'
import api from '../../services/api'

const SalesOrderDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [notes, setNotes] = useState('')
  const [showNotesModal, setShowNotesModal] = useState(false)

  useEffect(() => {
    fetchOrderDetail()
  }, [id])

  const fetchOrderDetail = async () => {
    try {
      const response = await api.get(`/sales/orders/${id}`)
      setOrder(response.data.order)
      setNotes(response.data.order.internal_notes || '')
    } catch (error) {
      toast.error('Không thể tải thông tin đơn hàng')
      navigate('/sales/orders')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus) => {
    if (!window.confirm(`Bạn có chắc muốn chuyển trạng thái thành "${getStatusText(newStatus)}"?`)) return
    
    setUpdating(true)
    try {
      await api.put(`/sales/orders/${id}/status`, { status: newStatus })
      toast.success('Cập nhật trạng thái thành công')
      fetchOrderDetail()
    } catch (error) {
      toast.error('Không thể cập nhật trạng thái')
    } finally {
      setUpdating(false)
    }
  }

  const handleSaveNotes = async () => {
    try {
      await api.put(`/sales/orders/${id}/notes`, { notes })
      toast.success('Lưu ghi chú thành công')
      setShowNotesModal(false)
      fetchOrderDetail()
    } catch (error) {
      toast.error('Không thể lưu ghi chú')
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Link
            to="/sales/orders"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold mb-4 transition-colors"
          >
            <FaArrowLeft />
            Quay lại danh sách
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
                onClick={() => setShowNotesModal(true)}
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
              >
                <FaStickyNote />
                Ghi chú
              </button>
              
              <button
                onClick={handlePrint}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
              >
                <FaPrint />
                In đơn
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status & Actions */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-purple-100 animate-fade-in">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <FaBox className="text-purple-500" />
                Trạng Thái & Hành Động
              </h3>
              
              <div className="flex items-center gap-4 mb-6">
                <span className={`px-6 py-3 rounded-full font-bold text-lg border-2 ${getStatusColor(order.order_status)}`}>
                  {getStatusText(order.order_status)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {order.order_status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusChange('confirmed')}
                      disabled={updating}
                      className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      <FaCheckCircle />
                      Xác nhận đơn
                    </button>
                    <button
                      onClick={() => handleStatusChange('cancelled')}
                      disabled={updating}
                      className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      <FaTimesCircle />
                      Hủy đơn
                    </button>
                  </>
                )}

                {order.order_status === 'confirmed' && (
                  <button
                    onClick={() => handleStatusChange('processing')}
                    disabled={updating}
                    className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <FaBox />
                    Bắt đầu xử lý
                  </button>
                )}

                {order.order_status === 'processing' && (
                  <button
                    onClick={() => handleStatusChange('delivered')}
                    disabled={updating}
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <FaTruck />
                    Đánh dấu đã giao
                  </button>
                )}
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-purple-100 animate-fade-in" style={{animationDelay: '0.1s'}}>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <FaUser className="text-purple-500" />
                Thông Tin Khách Hàng
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tên khách hàng</p>
                  <p className="font-bold text-gray-800 text-lg">{order.customer?.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="font-semibold text-gray-800">{order.customer?.email}</p>
                </div>
                
                {order.phone && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Số điện thoại</p>
                    <p className="font-semibold text-gray-800">{order.phone}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tổng đã mua</p>
                  <p className="font-bold text-purple-600">
                    {order.customer?.customer_profile?.total_spent?.toLocaleString('vi-VN')}đ
                  </p>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-purple-100 animate-fade-in" style={{animationDelay: '0.2s'}}>
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
            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-purple-100 sticky top-24 animate-fade-in" style={{animationDelay: '0.3s'}}>
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

              {/* Payment & Date Info */}
              <div className="pt-6 border-t-2 border-gray-200 space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
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
            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-purple-100 animate-fade-in" style={{animationDelay: '0.4s'}}>
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
                
                {order.notes && (
                  <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Ghi chú khách hàng</p>
                    <p className="text-gray-700">{order.notes}</p>
                  </div>
                )}
                
                {order.internal_notes && (
                  <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Ghi chú nội bộ</p>
                    <p className="text-gray-700">{order.internal_notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Ghi Chú Nội Bộ</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="4"
              placeholder="Thêm ghi chú nội bộ..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 resize-none"
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveNotes}
                className="flex-1 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl transition-all"
              >
                Lưu
              </button>
              <button
                onClick={() => setShowNotesModal(false)}
                className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition-all"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SalesOrderDetail

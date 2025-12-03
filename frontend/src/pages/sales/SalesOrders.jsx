import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  FaSearch, FaFilter, FaBox, FaEye, FaPrint, FaEdit,
  FaCheckCircle, FaTruck, FaTimesCircle, FaClock
} from 'react-icons/fa'
import { toast } from 'react-toastify'
import api from '../../services/api'

const SalesOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  useEffect(() => {
    fetchOrders()
  }, [statusFilter, dateFilter])

  const fetchOrders = async () => {
    try {
      const params = {}
      if (statusFilter !== 'all') params.status = statusFilter
      if (dateFilter !== 'all') params.date = dateFilter
      
      const response = await api.get('/sales/orders', { params })
      setOrders(response.data.orders || [])
    } catch (error) {
      toast.error('Không thể tải danh sách đơn hàng')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/sales/orders/${orderId}/status`, { status: newStatus })
      toast.success('Cập nhật trạng thái thành công')
      fetchOrders()
    } catch (error) {
      toast.error('Không thể cập nhật trạng thái')
    }
  }

  const handlePrint = (orderId) => {
    window.open(`/sales/orders/${orderId}/print`, '_blank')
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Chờ xác nhận', icon: FaClock },
      confirmed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Đã xác nhận', icon: FaCheckCircle },
      processing: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Đang xử lý', icon: FaBox },
      delivered: { bg: 'bg-green-100', text: 'text-green-800', label: 'Đã giao', icon: FaTruck },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Đã hủy', icon: FaTimesCircle }
    }
    return badges[status] || badges.pending
  }

  const filteredOrders = orders.filter(order => {
    const matchSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       order.customer?.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchSearch
  })

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-black text-gray-800 mb-2">
            Quản Lý
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500"> Đơn Hàng</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Tổng {filteredOrders.length} đơn hàng
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-purple-100 mb-8 animate-fade-in">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm mã đơn, tên khách..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-all"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-all"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="processing">Đang xử lý</option>
              <option value="delivered">Đã giao</option>
              <option value="cancelled">Đã hủy</option>
            </select>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 transition-all"
            >
              <option value="all">Tất cả thời gian</option>
              <option value="today">Hôm nay</option>
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order, index) => {
            const badge = getStatusBadge(order.order_status)
            const StatusIcon = badge.icon
            
            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-6 shadow-xl border-2 border-purple-100 hover:shadow-2xl transition-all animate-slide-in"
                style={{animationDelay: `${index * 0.05}s`}}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">
                        #{order.order_number}
                      </h3>
                      <span className={`px-4 py-1 rounded-full text-sm font-bold ${badge.bg} ${badge.text} flex items-center gap-2`}>
                        <StatusIcon />
                        {badge.label}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-1">
                      Khách hàng: <span className="font-semibold">{order.customer?.name}</span>
                    </p>
                    <p className="text-gray-600 mb-1">
                      Ngày đặt: {new Date(order.created_at).toLocaleString('vi-VN')}
                    </p>
                    <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                      {order.total_amount.toLocaleString('vi-VN')}đ
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/sales/orders/${order.id}`}
                      className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
                    >
                      <FaEye />
                      Chi tiết
                    </Link>

                    <button
                      onClick={() => handlePrint(order.id)}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
                    >
                      <FaPrint />
                      In
                    </button>

                    {order.order_status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'confirmed')}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
                      >
                        <FaCheckCircle />
                        Xác nhận
                      </button>
                    )}

                    {order.order_status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'processing')}
                        className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
                      >
                        <FaBox />
                        Xử lý
                      </button>
                    )}

                    {order.order_status === 'processing' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'delivered')}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
                      >
                        <FaTruck />
                        Đã giao
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {filteredOrders.length === 0 && (
            <div className="text-center py-20">
              <FaBox className="text-8xl text-gray-300 mx-auto mb-4" />
              <p className="text-2xl text-gray-500 font-bold">Không có đơn hàng nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SalesOrders

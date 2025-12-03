import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaShoppingBag, FaCalendarAlt, FaEye, FaFilter, FaDownload } from 'react-icons/fa'

const CustomerHistory = () => {
  const [activeTab, setActiveTab] = useState('orders') // orders, appointments
  const [filterStatus, setFilterStatus] = useState('all')

  const orders = [
    { id: 'ORD001', date: '2024-01-15', items: 3, total: 850000, status: 'delivered', products: ['Thức ăn Royal Canin', 'Balo vận chuyển', 'Đồ chơi'] },
    { id: 'ORD002', date: '2024-01-10', items: 2, total: 450000, status: 'delivered', products: ['Cát vệ sinh', 'Khay đựng cát'] },
    { id: 'ORD003', date: '2024-01-05', items: 1, total: 350000, status: 'cancelled', products: ['Balo vận chuyển'] },
    { id: 'ORD004', date: '2023-12-28', items: 5, total: 1200000, status: 'delivered', products: ['Thức ăn Pedigree', 'Xương gặm', 'Dây dắt', 'Vòng cổ', 'Bát ăn'] },
  ]

  const appointments = [
    { id: 'APT001', date: '2024-01-12', time: '14:00', service: 'Cắt tỉa lông', pet: 'Lucky', status: 'completed', price: 200000 },
    { id: 'APT002', date: '2024-01-08', time: '10:00', service: 'Tắm spa', pet: 'Miu', status: 'completed', price: 150000 },
    { id: 'APT003', date: '2023-12-20', time: '15:00', service: 'Khám sức khỏe', pet: 'Lucky', status: 'completed', price: 300000 },
    { id: 'APT004', date: '2023-12-15', time: '09:00', service: 'Cắt tỉa lông', pet: 'Miu', status: 'cancelled', price: 200000 },
  ]

  const getOrderStatusBadge = (status) => {
    const badges = {
      delivered: { bg: 'bg-green-100', text: 'text-green-700', label: 'Đã giao' },
      processing: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Đang xử lý' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Đã hủy' },
    }
    const badge = badges[status]
    return (
      <span className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-sm font-semibold`}>
        {badge.label}
      </span>
    )
  }

  const getAppointmentStatusBadge = (status) => {
    const badges = {
      completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Hoàn thành' },
      confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Đã xác nhận' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Đã hủy' },
    }
    const badge = badges[status]
    return (
      <span className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-sm font-semibold`}>
        {badge.label}
      </span>
    )
  }

  const filteredOrders = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus)
  const filteredAppointments = filterStatus === 'all' ? appointments : appointments.filter(a => a.status === filterStatus)

  const totalSpent = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0)
  const totalAppointments = appointments.filter(a => a.status === 'completed').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-black mb-2">📊 Lịch sử của tôi</h1>
          <p className="text-blue-100">Xem lại lịch sử mua hàng và đặt lịch dịch vụ</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
            <p className="text-gray-600 text-sm font-semibold">Tổng chi tiêu</p>
            <p className="text-3xl font-black text-green-600 mt-2">
              {(totalSpent / 1000000).toFixed(1)}M đ
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm font-semibold">Đơn hàng</p>
            <p className="text-3xl font-black text-blue-600 mt-2">{orders.length}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
            <p className="text-gray-600 text-sm font-semibold">Dịch vụ đã dùng</p>
            <p className="text-3xl font-black text-purple-600 mt-2">{totalAppointments}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-pink-500">
            <p className="text-gray-600 text-sm font-semibold">Điểm tích lũy</p>
            <p className="text-3xl font-black text-pink-600 mt-2">1,250</p>
          </div>
        </div>

        {/* Tabs & Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'orders'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaShoppingBag />
                Đơn hàng ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'appointments'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaCalendarAlt />
                Lịch hẹn ({appointments.length})
              </button>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-3">
              <FaFilter className="text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
              >
                <option value="all">Tất cả</option>
                {activeTab === 'orders' ? (
                  <>
                    <option value="delivered">Đã giao</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="cancelled">Đã hủy</option>
                  </>
                ) : (
                  <>
                    <option value="completed">Hoàn thành</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="cancelled">Đã hủy</option>
                  </>
                )}
              </select>
              <button className="px-4 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center gap-2">
                <FaDownload />
                Xuất Excel
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'orders' ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-black text-blue-600">#{order.id}</h3>
                      {getOrderStatusBadge(order.status)}
                    </div>
                    <p className="text-gray-600">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">{order.items} sản phẩm</p>
                    <p className="text-2xl font-black text-green-600">{order.total.toLocaleString()}đ</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {order.products.map((product, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                      {product}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Link
                    to={`/orders/${order.id}`}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-center hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <FaEye />
                    Xem chi tiết
                  </Link>
                  {order.status === 'delivered' && (
                    <button className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all">
                      Mua lại
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-black text-purple-600">#{appointment.id}</h3>
                      {getAppointmentStatusBadge(appointment.status)}
                    </div>
                    <p className="text-gray-600">{appointment.date} - {appointment.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-green-600">{appointment.price.toLocaleString()}đ</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Dịch vụ</p>
                    <p className="font-bold text-gray-800">{appointment.service}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Thú cưng</p>
                    <p className="font-bold text-gray-800">{appointment.pet}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link
                    to={`/appointments/${appointment.id}`}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-center hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <FaEye />
                    Xem chi tiết
                  </Link>
                  {appointment.status === 'completed' && (
                    <button className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all">
                      Đặt lại
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {((activeTab === 'orders' && filteredOrders.length === 0) ||
          (activeTab === 'appointments' && filteredAppointments.length === 0)) && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-xl">
            {activeTab === 'orders' ? (
              <>
                <FaShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Không tìm thấy đơn hàng nào</p>
              </>
            ) : (
              <>
                <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Không tìm thấy lịch hẹn nào</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerHistory

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaSearch, FaFilter, FaPaw, FaCheckCircle, FaTimesCircle, FaEye, FaClock } from 'react-icons/fa'

const StaffAppointments = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const appointments = [
    { id: 1, date: '2024-01-15', time: '09:00', customer: 'Nguyễn Văn A', phone: '0901234567', pet: 'Mèo Anh Lông Ngắn', petName: 'Miu', service: 'Cắt tỉa lông', status: 'pending', price: 200000 },
    { id: 2, date: '2024-01-15', time: '10:30', customer: 'Trần Thị B', phone: '0912345678', pet: 'Chó Golden', petName: 'Lucky', service: 'Tắm spa', status: 'confirmed', price: 350000 },
    { id: 3, date: '2024-01-15', time: '14:00', customer: 'Lê Văn C', phone: '0923456789', pet: 'Mèo Ba Tư', petName: 'Kitty', service: 'Khám sức khỏe', status: 'in-progress', price: 150000 },
    { id: 4, date: '2024-01-16', time: '09:30', customer: 'Phạm Thị D', phone: '0934567890', pet: 'Chó Poodle', petName: 'Coco', service: 'Cắt tỉa + Nhuộm', status: 'pending', price: 450000 },
    { id: 5, date: '2024-01-16', time: '11:00', customer: 'Hoàng Văn E', phone: '0945678901', pet: 'Chó Husky', petName: 'Max', service: 'Spa cao cấp', status: 'confirmed', price: 500000 },
    { id: 6, date: '2024-01-14', time: '15:00', customer: 'Vũ Thị F', phone: '0956789012', pet: 'Mèo Munchkin', petName: 'Momo', service: 'Tắm + Cắt móng', status: 'completed', price: 180000 },
  ]

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Chờ xác nhận', icon: FaClock },
      confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Đã xác nhận', icon: FaCheckCircle },
      'in-progress': { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Đang thực hiện', icon: FaClock },
      completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Hoàn thành', icon: FaCheckCircle },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Đã hủy', icon: FaTimesCircle },
    }
    const badge = badges[status]
    const Icon = badge.icon
    return (
      <span className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 w-fit`}>
        <Icon />
        {badge.label}
      </span>
    )
  }

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.phone.includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
            <FaPaw />
            Quản lý đơn dịch vụ
          </h1>
          <p className="text-purple-100">Xem, xác nhận và quản lý các đơn đăng ký dịch vụ</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo tên khách hàng, thú cưng, SĐT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none appearance-none bg-white"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="in-progress">Đang thực hiện</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Tất cả', count: appointments.length, color: 'gray' },
            { label: 'Chờ xác nhận', count: appointments.filter(a => a.status === 'pending').length, color: 'orange' },
            { label: 'Đã xác nhận', count: appointments.filter(a => a.status === 'confirmed').length, color: 'blue' },
            { label: 'Đang thực hiện', count: appointments.filter(a => a.status === 'in-progress').length, color: 'purple' },
            { label: 'Hoàn thành', count: appointments.filter(a => a.status === 'completed').length, color: 'green' },
          ].map((stat, index) => (
            <div key={index} className={`bg-white rounded-xl p-4 shadow-lg border-l-4 border-${stat.color}-500`}>
              <p className="text-gray-600 text-sm font-semibold">{stat.label}</p>
              <p className={`text-3xl font-black text-${stat.color}-600 mt-1`}>{stat.count}</p>
            </div>
          ))}
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">Ngày & Giờ</th>
                  <th className="px-6 py-4 text-left font-bold">Khách hàng</th>
                  <th className="px-6 py-4 text-left font-bold">Thú cưng</th>
                  <th className="px-6 py-4 text-left font-bold">Dịch vụ</th>
                  <th className="px-6 py-4 text-left font-bold">Giá</th>
                  <th className="px-6 py-4 text-left font-bold">Trạng thái</th>
                  <th className="px-6 py-4 text-center font-bold">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-purple-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">{appointment.date}</div>
                      <div className="text-sm text-gray-600">{appointment.time}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">{appointment.customer}</div>
                      <div className="text-sm text-gray-600">{appointment.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaPaw className="text-pink-500" />
                        <div>
                          <div className="font-bold text-gray-800">{appointment.petName}</div>
                          <div className="text-sm text-gray-600">{appointment.pet}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-800 font-semibold">{appointment.service}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-purple-600 font-bold">{appointment.price.toLocaleString()}đ</span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(appointment.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/staff/appointments/${appointment.id}`}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                          title="Xem chi tiết"
                        >
                          <FaEye />
                        </Link>
                        {appointment.status === 'pending' && (
                          <>
                            <button
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all"
                              title="Xác nhận"
                            >
                              <FaCheckCircle />
                            </button>
                            <button
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                              title="Từ chối"
                            >
                              <FaTimesCircle />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAppointments.length === 0 && (
            <div className="text-center py-12">
              <FaPaw className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Không tìm thấy đơn dịch vụ nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StaffAppointments

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaCalendarAlt, FaCheckCircle, FaClock, FaBell, FaPaw, FaComments, FaChartLine } from 'react-icons/fa'

const StaffDashboard = () => {
  const [stats, setStats] = useState({
    todayAppointments: 8,
    pending: 3,
    completed: 12,
    messages: 5
  })

  const [todaySchedule, setTodaySchedule] = useState([
    { id: 1, time: '09:00', customer: 'Nguyễn Văn A', pet: 'Mèo Anh Lông Ngắn', service: 'Cắt tỉa lông', status: 'pending' },
    { id: 2, time: '10:30', customer: 'Trần Thị B', pet: 'Chó Golden', service: 'Tắm spa', status: 'in-progress' },
    { id: 3, time: '14:00', customer: 'Lê Văn C', pet: 'Mèo Ba Tư', service: 'Khám sức khỏe', status: 'pending' },
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-black mb-2">👋 Xin chào, Nhân viên!</h1>
          <p className="text-purple-100">Chào mừng bạn đến với bảng điều khiển chăm sóc thú cưng</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Lịch hôm nay</p>
                <p className="text-3xl font-black text-blue-600 mt-2">{stats.todayAppointments}</p>
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <FaCalendarAlt className="text-3xl text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Chờ xác nhận</p>
                <p className="text-3xl font-black text-orange-600 mt-2">{stats.pending}</p>
              </div>
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <FaClock className="text-3xl text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Đã hoàn thành</p>
                <p className="text-3xl font-black text-green-600 mt-2">{stats.completed}</p>
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-3xl text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-l-4 border-pink-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Tin nhắn mới</p>
                <p className="text-3xl font-black text-pink-600 mt-2">{stats.messages}</p>
              </div>
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                <FaComments className="text-3xl text-pink-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today Schedule */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                  <FaCalendarAlt className="text-purple-600" />
                  Lịch hôm nay
                </h2>
                <Link to="/staff/schedule" className="text-purple-600 hover:text-purple-700 font-semibold">
                  Xem tất cả →
                </Link>
              </div>

              <div className="space-y-4">
                {todaySchedule.map((appointment) => (
                  <div key={appointment.id} className="border-l-4 border-purple-500 bg-gradient-to-r from-purple-50 to-transparent p-4 rounded-lg hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-black text-purple-600">{appointment.time}</div>
                          <div className="text-xs text-gray-500">Giờ hẹn</div>
                        </div>
                        <div className="h-12 w-px bg-gray-300"></div>
                        <div>
                          <h3 className="font-bold text-gray-800">{appointment.customer}</h3>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <FaPaw className="text-pink-500" />
                            {appointment.pet} - {appointment.service}
                          </p>
                        </div>
                      </div>
                      <div>
                        {appointment.status === 'pending' && (
                          <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                            Chờ xử lý
                          </span>
                        )}
                        {appointment.status === 'in-progress' && (
                          <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                            Đang thực hiện
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/staff/appointments" className="mt-6 block w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-center hover:shadow-lg transition-all">
                Xem tất cả lịch hẹn
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Pending Requests */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-black text-gray-800 mb-4 flex items-center gap-2">
                <FaBell className="text-orange-500" />
                Yêu cầu mới
              </h3>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-sm font-semibold text-gray-800">Đặt lịch mới từ khách hàng</p>
                    <p className="text-xs text-gray-600 mt-1">5 phút trước</p>
                    <div className="flex gap-2 mt-2">
                      <button className="flex-1 py-1 bg-green-500 text-white rounded text-xs font-semibold hover:bg-green-600">
                        Chấp nhận
                      </button>
                      <button className="flex-1 py-1 bg-red-500 text-white rounded text-xs font-semibold hover:bg-red-600">
                        Từ chối
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-xl font-black mb-4">Truy cập nhanh</h3>
              <div className="space-y-3">
                <Link to="/staff/schedule" className="block p-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all">
                  <div className="flex items-center gap-3">
                    <FaCalendarAlt className="text-xl" />
                    <span className="font-semibold">Xem lịch làm việc</span>
                  </div>
                </Link>
                <Link to="/staff/appointments" className="block p-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all">
                  <div className="flex items-center gap-3">
                    <FaPaw className="text-xl" />
                    <span className="font-semibold">Quản lý đơn dịch vụ</span>
                  </div>
                </Link>
                <Link to="/staff/chat" className="block p-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all">
                  <div className="flex items-center gap-3">
                    <FaComments className="text-xl" />
                    <span className="font-semibold">Chat với khách hàng</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaffDashboard

import { useState } from 'react'
import { FaCalendarAlt, FaClock, FaPaw, FaUser, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'

const StaffSchedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState('day') // day, week, month

  const appointments = [
    { id: 1, time: '08:00', duration: 60, customer: 'Nguyễn Văn A', phone: '0901234567', pet: 'Mèo Anh Lông Ngắn', service: 'Cắt tỉa lông', status: 'confirmed', color: 'blue' },
    { id: 2, time: '09:30', duration: 90, customer: 'Trần Thị B', phone: '0912345678', pet: 'Chó Golden Retriever', service: 'Tắm spa + Cắt tỉa', status: 'in-progress', color: 'green' },
    { id: 3, time: '11:30', duration: 45, customer: 'Lê Văn C', phone: '0923456789', pet: 'Mèo Ba Tư', service: 'Khám sức khỏe', status: 'confirmed', color: 'purple' },
    { id: 4, time: '14:00', duration: 60, customer: 'Phạm Thị D', phone: '0934567890', pet: 'Chó Poodle', service: 'Cắt tỉa + Nhuộm', status: 'pending', color: 'orange' },
    { id: 5, time: '15:30', duration: 120, customer: 'Hoàng Văn E', phone: '0945678901', pet: 'Chó Husky', service: 'Spa cao cấp', status: 'confirmed', color: 'pink' },
  ]

  const timeSlots = Array.from({ length: 12 }, (_, i) => `${8 + i}:00`)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
            <FaCalendarAlt />
            Lịch làm việc
          </h1>
          <p className="text-blue-100">Quản lý lịch hẹn và thời gian làm việc của bạn</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Calendar Controls */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">
                Hôm nay
              </button>
              <div className="flex gap-2">
                <button className="p-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50">←</button>
                <button className="p-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50">→</button>
              </div>
              <div className="text-2xl font-black text-gray-800">
                {selectedDate.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setView('day')}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${view === 'day' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Ngày
              </button>
              <button 
                onClick={() => setView('week')}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${view === 'week' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Tuần
              </button>
              <button 
                onClick={() => setView('month')}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${view === 'month' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Tháng
              </button>
            </div>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Timeline */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="space-y-4">
                {timeSlots.map((time) => {
                  const appointment = appointments.find(a => a.time === time)
                  return (
                    <div key={time} className="flex gap-4">
                      <div className="w-20 text-right">
                        <span className="text-sm font-bold text-gray-600">{time}</span>
                      </div>
                      <div className="flex-1 min-h-[80px] border-l-2 border-gray-200 pl-4">
                        {appointment ? (
                          <div className={`bg-gradient-to-r from-${appointment.color}-100 to-${appointment.color}-50 border-l-4 border-${appointment.color}-500 rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer`}>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <FaClock className={`text-${appointment.color}-600`} />
                                  <span className="font-bold text-gray-800">{appointment.time} - {appointment.duration} phút</span>
                                  {appointment.status === 'confirmed' && (
                                    <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-full font-semibold">Đã xác nhận</span>
                                  )}
                                  {appointment.status === 'pending' && (
                                    <span className="px-3 py-1 bg-orange-500 text-white text-xs rounded-full font-semibold">Chờ xác nhận</span>
                                  )}
                                  {appointment.status === 'in-progress' && (
                                    <span className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full font-semibold">Đang thực hiện</span>
                                  )}
                                </div>
                                <div className="space-y-1">
                                  <p className="font-bold text-gray-800 flex items-center gap-2">
                                    <FaUser className="text-gray-600" />
                                    {appointment.customer}
                                  </p>
                                  <p className="text-sm text-gray-600 flex items-center gap-2">
                                    <FaPhone className="text-gray-500" />
                                    {appointment.phone}
                                  </p>
                                  <p className="text-sm text-gray-600 flex items-center gap-2">
                                    <FaPaw className={`text-${appointment.color}-600`} />
                                    {appointment.pet} - {appointment.service}
                                  </p>
                                </div>
                              </div>
                              <button className="px-4 py-2 bg-white rounded-lg font-semibold text-sm hover:shadow-md transition-all">
                                Chi tiết
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="h-full flex items-center text-gray-400 text-sm">
                            Trống
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            {/* Today Summary */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-black text-gray-800 mb-4">Tổng quan hôm nay</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-semibold text-gray-700">Tổng lịch hẹn</span>
                  <span className="text-2xl font-black text-blue-600">{appointments.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-semibold text-gray-700">Đã xác nhận</span>
                  <span className="text-2xl font-black text-green-600">
                    {appointments.filter(a => a.status === 'confirmed').length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm font-semibold text-gray-700">Chờ xác nhận</span>
                  <span className="text-2xl font-black text-orange-600">
                    {appointments.filter(a => a.status === 'pending').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-xl font-black mb-4">Chú thích</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-400 rounded"></div>
                  <span className="text-sm">Đã xác nhận</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-orange-400 rounded"></div>
                  <span className="text-sm">Chờ xác nhận</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-400 rounded"></div>
                  <span className="text-sm">Đang thực hiện</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gray-400 rounded"></div>
                  <span className="text-sm">Đã hoàn thành</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaffSchedule

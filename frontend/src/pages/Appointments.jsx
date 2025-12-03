import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaCalendarAlt, FaClock, FaPaw, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { appointmentService } from '../services/appointmentService'
import { APPOINTMENT_STATUS_LABELS } from '../utils/constants'

const Appointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const data = await appointmentService.getAppointments()
      setAppointments(data.data || data)
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      in_progress: 'bg-purple-100 text-purple-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      rejected: 'bg-gray-100 text-gray-700',
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === 'all') return true
    return apt.status === filter
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Lịch hẹn của tôi
            </h1>
            <p className="text-gray-600">
              Quản lý các lịch hẹn dịch vụ chăm sóc thú cưng
            </p>
          </div>
          <Link
            to="/services"
            className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-xl transform hover:scale-105 transition-all"
          >
            + Đặt lịch mới
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { value: 'all', label: 'Tất cả', icon: '📋' },
            { value: 'pending', label: 'Chờ xác nhận', icon: '⏳' },
            { value: 'confirmed', label: 'Đã xác nhận', icon: '✅' },
            { value: 'completed', label: 'Hoàn thành', icon: '🎉' },
            { value: 'cancelled', label: 'Đã hủy', icon: '❌' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-5 py-2 rounded-full font-semibold transition-all ${
                filter === tab.value
                  ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:shadow-md'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Appointments List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500"></div>
            <p className="mt-4 text-gray-600">Đang tải lịch hẹn...</p>
          </div>
        ) : filteredAppointments.length > 0 ? (
          <div className="space-y-6">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Service Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                          {appointment.service?.name}
                        </h3>
                        <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${getStatusColor(appointment.status)}`}>
                          {APPOINTMENT_STATUS_LABELS[appointment.status]}
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-3 text-gray-600">
                        <FaCalendarAlt className="text-pink-500" />
                        <span>{new Date(appointment.appointment_date).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <FaClock className="text-orange-500" />
                        <span>{appointment.appointment_time}</span>
                      </div>
                      {appointment.pet && (
                        <div className="flex items-center gap-3 text-gray-600">
                          <FaPaw className="text-purple-500" />
                          <span>{appointment.pet.name}</span>
                        </div>
                      )}
                      {appointment.staff && (
                        <div className="flex items-center gap-3 text-gray-600">
                          <span>👨‍⚕️</span>
                          <span>{appointment.staff.name}</span>
                        </div>
                      )}
                    </div>

                    {appointment.notes && (
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-gray-600 text-sm">
                          <strong>Ghi chú:</strong> {appointment.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col gap-3">
                    <Link
                      to={`/appointments/${appointment.id}`}
                      className="flex-1 md:flex-none bg-blue-500 text-white px-6 py-3 rounded-full font-semibold text-center hover:bg-blue-600 transition-all"
                    >
                      Chi tiết
                    </Link>
                    {['pending', 'confirmed'].includes(appointment.status) && (
                      <button
                        className="flex-1 md:flex-none bg-red-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-600 transition-all"
                      >
                        Hủy lịch
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Chưa có lịch hẹn nào
            </h3>
            <p className="text-gray-600 mb-6">
              Đặt lịch dịch vụ chăm sóc thú cưng ngay hôm nay
            </p>
            <Link
              to="/services"
              className="inline-block bg-gradient-to-r from-pink-500 to-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-xl transform hover:scale-105 transition-all"
            >
              Xem dịch vụ
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Appointments

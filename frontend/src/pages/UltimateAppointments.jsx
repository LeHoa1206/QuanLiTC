import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  FaCalendarAlt, FaClock, FaPaw, FaCheckCircle, FaTimesCircle,
  FaHourglassHalf, FaSpinner, FaEye, FaTimes, FaPlus, FaUser,
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaStickyNote, FaDollarSign,
  FaWeight, FaBirthdayCake, FaEdit, FaTrash
} from 'react-icons/fa'
import { appointmentService } from '../services/appointmentService'
import { toast } from 'react-toastify'

const UltimateAppointments = () => {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const data = await appointmentService.getAppointments()
      setAppointments(data.data || data)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Không thể tải lịch hẹn')
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
        icon: FaHourglassHalf,
        label: 'Chờ xác nhận'
      },
      confirmed: {
        color: 'from-blue-400 to-cyan-400',
        bg: 'bg-gradient-to-r from-blue-50 to-cyan-50',
        border: 'border-blue-300',
        text: 'text-blue-700',
        icon: FaCheckCircle,
        label: 'Đã xác nhận'
      },
      in_progress: {
        color: 'from-purple-400 to-pink-400',
        bg: 'bg-gradient-to-r from-purple-50 to-pink-50',
        border: 'border-purple-300',
        text: 'text-purple-700',
        icon: FaSpinner,
        label: 'Đang thực hiện'
      },
      completed: {
        color: 'from-green-400 to-emerald-400',
        bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
        border: 'border-green-300',
        text: 'text-green-700',
        icon: FaCheckCircle,
        label: 'Hoàn thành'
      },
      cancelled: {
        color: 'from-red-400 to-rose-400',
        bg: 'bg-gradient-to-r from-red-50 to-rose-50',
        border: 'border-red-300',
        text: 'text-red-700',
        icon: FaTimes,
        label: 'Đã hủy'
      },
      rejected: {
        color: 'from-gray-400 to-slate-400',
        bg: 'bg-gradient-to-r from-gray-50 to-slate-50',
        border: 'border-gray-300',
        text: 'text-gray-700',
        icon: FaTimesCircle,
        label: 'Bị từ chối'
      }
    }
    return configs[status] || configs.pending
  }

  const filteredAppointments = filter === 'all' 
    ? appointments 
    : appointments.filter(apt => apt.status === filter)

  const handleViewDetail = (appointment) => {
    setSelectedAppointment(appointment)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setTimeout(() => setSelectedAppointment(null), 300)
  }

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này?')) {
      return
    }

    try {
      await appointmentService.cancelAppointment(id)
      toast.success('Đã hủy lịch hẹn thành công!')
      closeModal()
      fetchAppointments()
    } catch (error) {
      console.error('Error:', error)
      toast.error(error.response?.data?.message || 'Không thể hủy lịch hẹn')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Floating Icons */}
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="absolute text-5xl opacity-5 pointer-events-none animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${8 + Math.random() * 4}s`
          }}
        >
          {['📅', '🐕', '🐈', '✂️', '💆', '⏰'][Math.floor(Math.random() * 6)]}
        </div>
      ))}

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Hero Section - Vừa Đẹp Vừa Động */}
        <div className="relative mb-12">
          <div className="relative text-center">
            {/* Animated Icon Group */}
            <div className="flex justify-center gap-3 mb-6">
              {['📅', '🐕', '🐈', '✂️', '💆'].map((emoji, i) => (
                <div
                  key={i}
                  className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center text-3xl transform hover:scale-125 transition-all hover:rotate-12 cursor-pointer"
                  style={{
                    animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                    animationDelay: `${i * 0.2}s`
                  }}
                >
                  {emoji}
                </div>
              ))}
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 animate-gradient">
                Lịch Hẹn Của Tôi
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Quản lý và theo dõi tất cả lịch hẹn dịch vụ cho thú cưng của bạn
            </p>

            {/* Compact Stats Cards */}
            <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
              {[
                { 
                  icon: '📋', 
                  value: appointments.length, 
                  label: 'Tổng', 
                  gradient: 'from-indigo-500 to-purple-500',
                },
                { 
                  icon: '⏳', 
                  value: appointments.filter(a => a.status === 'pending').length, 
                  label: 'Chờ', 
                  gradient: 'from-yellow-500 to-orange-500',
                },
                { 
                  icon: '✅', 
                  value: appointments.filter(a => a.status === 'completed').length, 
                  label: 'Xong', 
                  gradient: 'from-green-500 to-emerald-500',
                },
              ].map((stat, i) => (
                <div 
                  key={i} 
                  className="relative bg-white rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all hover:scale-110 border border-gray-100 overflow-hidden group cursor-pointer"
                  style={{
                    animation: `slideInUp 0.5s ease-out ${i * 0.1}s both`
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  <div className="relative">
                    <div className="text-4xl mb-2 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">{stat.icon}</div>
                    <div className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${stat.gradient} mb-1`}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-600 font-bold">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button - Compact & Animated */}
            <Link
              to="/services"
              className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white font-black rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-110 text-lg relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <FaPlus className="text-xl relative z-10 group-hover:rotate-180 transition-transform duration-500" />
              <span className="relative z-10">Đặt Lịch Mới</span>
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
            </Link>
          </div>
        </div>

        <style jsx>{`
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-gradient {
            background-size: 200% auto;
            animation: gradient 3s ease infinite;
          }
        `}</style>

        {/* Filters - Siêu Đẹp */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-12 border-2 border-gray-100">
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { value: 'all', label: 'Tất cả', icon: '📋', gradient: 'from-gray-500 via-slate-500 to-gray-600', count: appointments.length },
              { value: 'pending', label: 'Chờ xác nhận', icon: '⏳', gradient: 'from-yellow-500 via-orange-500 to-amber-600', count: appointments.filter(a => a.status === 'pending').length },
              { value: 'confirmed', label: 'Đã xác nhận', icon: '✓', gradient: 'from-blue-500 via-cyan-500 to-sky-600', count: appointments.filter(a => a.status === 'confirmed').length },
              { value: 'completed', label: 'Hoàn thành', icon: '✅', gradient: 'from-green-500 via-emerald-500 to-teal-600', count: appointments.filter(a => a.status === 'completed').length },
              { value: 'cancelled', label: 'Đã hủy', icon: '❌', gradient: 'from-red-500 via-rose-500 to-pink-600', count: appointments.filter(a => a.status === 'cancelled').length },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`relative px-10 py-5 rounded-2xl font-black transition-all text-lg overflow-hidden group ${
                  filter === tab.value
                    ? `bg-gradient-to-r ${tab.gradient} text-white shadow-2xl scale-110`
                    : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:from-gray-100 hover:to-gray-200 shadow-lg hover:shadow-xl hover:scale-105'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                <div className="relative flex items-center gap-3">
                  <span className="text-3xl">{tab.icon}</span>
                  <div className="text-left">
                    <div className="text-base">{tab.label}</div>
                    <div className={`text-xs ${filter === tab.value ? 'text-white/80' : 'text-gray-500'}`}>
                      {tab.count} lịch hẹn
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Appointments List */}
        {loading ? (
          <div className="text-center py-32">
            <div className="inline-block w-24 h-24 border-8 border-purple-200 border-t-purple-500 rounded-full animate-spin mb-6"></div>
            <p className="text-2xl text-gray-600 font-bold">Đang tải lịch hẹn...</p>
          </div>
        ) : filteredAppointments.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAppointments.map((appointment, index) => {
              const statusConfig = getStatusConfig(appointment.status)
              const StatusIcon = statusConfig.icon
              
              return (
                <div
                  key={appointment.id}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all hover:scale-105 hover:-translate-y-2 border border-gray-200 group"
                  style={{
                    animation: `slideInUp 0.5s ease-out ${index * 0.1}s both`
                  }}
                >
                  {/* Header */}
                  <div className={`${statusConfig.bg} p-5 border-b ${statusConfig.border} relative overflow-hidden`}>
                    <div className={`absolute inset-0 bg-gradient-to-r ${statusConfig.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${statusConfig.color} rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                          <StatusIcon className="text-xl text-white" />
                        </div>
                        <div>
                          <h3 className="text-base font-black text-gray-800 line-clamp-1">
                            {appointment.service?.name || 'Dịch vụ'}
                          </h3>
                          <p className="text-xs text-gray-600 font-semibold">
                            #{appointment.id}
                          </p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-lg font-bold text-xs border ${statusConfig.border} ${statusConfig.text} ${statusConfig.bg}`}>
                        {statusConfig.label}
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    {/* Date & Time - Compact */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl transform group-hover:scale-105 transition-all">
                        <FaCalendarAlt className="text-xl text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-600 font-semibold">Ngày</p>
                          <p className="text-sm font-black text-gray-800">
                            {new Date(appointment.appointment_date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl transform group-hover:scale-105 transition-all">
                        <FaClock className="text-xl text-purple-600" />
                        <div>
                          <p className="text-xs text-gray-600 font-semibold">Giờ</p>
                          <p className="text-sm font-black text-gray-800">
                            {appointment.appointment_time}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Pet Info - Compact */}
                    {appointment.pet_name && (
                      <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl mb-4 transform group-hover:scale-105 transition-all">
                        <FaPaw className="text-xl text-orange-600" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-600 font-semibold">Thú cưng</p>
                          <p className="text-sm font-black text-gray-800 truncate">
                            {appointment.pet_name}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Price - Compact */}
                    {(appointment.price || appointment.service?.price) && (
                      <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl mb-4 text-center transform group-hover:scale-105 transition-all">
                        <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                          {(appointment.price || appointment.service?.price)?.toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                    )}

                    {/* Action Button */}
                    <button
                      onClick={() => handleViewDetail(appointment)}
                      className="block w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-black rounded-xl transition-all hover:shadow-xl text-center flex items-center justify-center gap-2 transform hover:scale-105"
                    >
                      <FaEye className="text-lg" />
                      Chi tiết
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-3xl shadow-2xl border-2 border-gray-100">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <div className="relative w-40 h-40 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                <FaCalendarAlt className="text-7xl text-purple-500" />
              </div>
            </div>
            <h3 className="text-4xl font-black text-gray-800 mb-4">
              Chưa có lịch hẹn nào
            </h3>
            <p className="text-gray-600 mb-10 text-xl">
              Hãy đặt lịch để trải nghiệm dịch vụ chăm sóc thú cưng tuyệt vời!
            </p>
            <Link
              to="/services"
              className="inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black rounded-2xl hover:shadow-2xl hover:scale-110 transition-all text-xl"
            >
              <FaPlus className="text-2xl" />
              Đặt lịch ngay
            </Link>
          </div>
        )}
      </div>

      {/* Modal Chi Tiết Lịch Hẹn */}
      {showModal && selectedAppointment && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`${getStatusConfig(selectedAppointment.status).bg} p-8 border-b-2 ${getStatusConfig(selectedAppointment.status).border} sticky top-0 z-10`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${getStatusConfig(selectedAppointment.status).color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <FaCalendarAlt className="text-3xl text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-800">
                      Chi Tiết Lịch Hẹn
                    </h2>
                    <p className="text-gray-600 font-semibold">
                      ID: #{selectedAppointment.id}
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
                <div className={`px-6 py-3 rounded-2xl font-bold border-2 flex items-center gap-3 shadow-lg ${getStatusConfig(selectedAppointment.status).bg} ${getStatusConfig(selectedAppointment.status).border} ${getStatusConfig(selectedAppointment.status).text}`}>
                  {(() => {
                    const StatusIcon = getStatusConfig(selectedAppointment.status).icon
                    return <StatusIcon className="text-xl" />
                  })()}
                  {getStatusConfig(selectedAppointment.status).label}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 font-semibold mb-1">Ngày tạo</p>
                  <p className="text-lg font-black text-gray-800">
                    {new Date(selectedAppointment.created_at).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              {/* Dịch vụ */}
              <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
                <h3 className="text-2xl font-black text-gray-800 mb-4 flex items-center gap-3">
                  <FaCalendarAlt className="text-purple-600" />
                  Thông Tin Dịch Vụ
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-2">Tên dịch vụ</p>
                    <p className="text-xl font-black text-gray-800">{selectedAppointment.service?.name || 'Dịch vụ'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-2">Giá dịch vụ</p>
                    <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                      {selectedAppointment.service?.price?.toLocaleString('vi-VN') || selectedAppointment.price?.toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-2">Ngày hẹn</p>
                    <p className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <FaCalendarAlt className="text-blue-600" />
                      {new Date(selectedAppointment.appointment_date).toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-600 mb-2">Giờ hẹn</p>
                    <p className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <FaClock className="text-purple-600" />
                      {selectedAppointment.appointment_time}
                    </p>
                  </div>
                </div>
              </div>

              {/* Thông tin thú cưng */}
              {selectedAppointment.pet_name && (
                <div className="mb-8 p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border-2 border-orange-200">
                  <h3 className="text-2xl font-black text-gray-800 mb-4 flex items-center gap-3">
                    <FaPaw className="text-orange-600" />
                    Thông Tin Thú Cưng
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-bold text-gray-600 mb-2">Tên thú cưng</p>
                      <p className="text-xl font-black text-gray-800">{selectedAppointment.pet_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-600 mb-2">Loại</p>
                      <p className="text-lg font-bold text-gray-800 capitalize">{selectedAppointment.pet_type}</p>
                    </div>
                    {selectedAppointment.pet_age && (
                      <div>
                        <p className="text-sm font-bold text-gray-600 mb-2">Tuổi</p>
                        <p className="text-lg font-bold text-gray-800 flex items-center gap-2">
                          <FaBirthdayCake className="text-pink-600" />
                          {selectedAppointment.pet_age} tháng
                        </p>
                      </div>
                    )}
                    {selectedAppointment.pet_weight && (
                      <div>
                        <p className="text-sm font-bold text-gray-600 mb-2">Cân nặng</p>
                        <p className="text-lg font-bold text-gray-800 flex items-center gap-2">
                          <FaWeight className="text-orange-600" />
                          {selectedAppointment.pet_weight} kg
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Thông tin khách hàng */}
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200">
                <h3 className="text-2xl font-black text-gray-800 mb-4 flex items-center gap-3">
                  <FaUser className="text-blue-600" />
                  Thông Tin Liên Hệ
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {selectedAppointment.customer_name && (
                    <div>
                      <p className="text-sm font-bold text-gray-600 mb-2">Họ và tên</p>
                      <p className="text-lg font-bold text-gray-800">{selectedAppointment.customer_name}</p>
                    </div>
                  )}
                  {selectedAppointment.phone && (
                    <div>
                      <p className="text-sm font-bold text-gray-600 mb-2">Số điện thoại</p>
                      <p className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <FaPhone className="text-green-600" />
                        {selectedAppointment.phone}
                      </p>
                    </div>
                  )}
                  {selectedAppointment.email && (
                    <div>
                      <p className="text-sm font-bold text-gray-600 mb-2">Email</p>
                      <p className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <FaEnvelope className="text-blue-600" />
                        {selectedAppointment.email}
                      </p>
                    </div>
                  )}
                  {selectedAppointment.address && (
                    <div className="md:col-span-2">
                      <p className="text-sm font-bold text-gray-600 mb-2">Địa chỉ</p>
                      <p className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-red-600" />
                        {selectedAppointment.address}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Ghi chú */}
              {selectedAppointment.notes && (
                <div className="mb-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-200">
                  <h3 className="text-2xl font-black text-gray-800 mb-4 flex items-center gap-3">
                    <FaStickyNote className="text-yellow-600" />
                    Ghi Chú
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">{selectedAppointment.notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={closeModal}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-black rounded-2xl transition-all hover:shadow-xl text-lg"
                >
                  Đóng
                </button>
                {(selectedAppointment.status === 'pending' || selectedAppointment.status === 'confirmed') && (
                  <button
                    onClick={() => handleCancelAppointment(selectedAppointment.id)}
                    className="flex-1 px-8 py-4 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-black rounded-2xl transition-all hover:shadow-xl text-lg flex items-center justify-center gap-2"
                  >
                    <FaTimes className="text-xl" />
                    Hủy lịch hẹn
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UltimateAppointments

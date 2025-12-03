import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  FaCalendar, FaSearch, FaFilter, FaEye, FaCheckCircle, 
  FaTimesCircle, FaClock, FaUser, FaPaw, FaEdit, FaUserMd
} from 'react-icons/fa'
import { toast } from 'react-toastify'
import api from '../../services/api'

const UltimateAdminAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [serviceFilter, setServiceFilter] = useState('all')
  const [services, setServices] = useState([])
  const [staff, setStaff] = useState([])

  useEffect(() => {
    fetchData()
  }, [statusFilter, dateFilter, serviceFilter])

  const fetchData = async () => {
    try {
      const params = {}
      if (statusFilter !== 'all') params.status = statusFilter
      if (dateFilter !== 'all') params.date = dateFilter
      if (serviceFilter !== 'all') params.service_id = serviceFilter
      
      const [appointmentsRes, servicesRes, staffRes] = await Promise.all([
        api.get('/admin/appointments', { params }),
        api.get('/services'),
        api.get('/admin/users', { params: { role: 'staff' } })
      ])
      
      setAppointments(appointmentsRes.data.appointments || [])
      setServices(servicesRes.data.services || [])
      setStaff(staffRes.data.users || [])
    } catch (error) {
      toast.error('Không thể tải danh sách lịch hẹn')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await api.put(`/admin/appointments/${appointmentId}/status`, { status: newStatus })
      toast.success('Cập nhật trạng thái thành công')
      fetchData()
    } catch (error) {
      toast.error('Không thể cập nhật trạng thái')
    }
  }

  const handleAssignStaff = async (appointmentId, staffId) => {
    try {
      await api.put(`/admin/appointments/${appointmentId}/assign`, { staff_id: staffId })
      toast.success('Phân công nhân viên thành công')
      fetchData()
    } catch (error) {
      toast.error('Không thể phân công nhân viên')
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Chờ xác nhận', icon: FaClock },
      confirmed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Đã xác nhận', icon: FaCheckCircle },
      in_progress: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Đang thực hiện', icon: FaPaw },
      completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Hoàn thành', icon: FaCheckCircle },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Đã hủy', icon: FaTimesCircle },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Từ chối', icon: FaTimesCircle }
    }
    return badges[status] || badges.pending
  }

  const filteredAppointments = appointments.filter(appointment => {
    const matchSearch = appointment.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       appointment.service?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       appointment.pet?.name.toLowerCase().includes(searchTerm.toLowerCase())
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
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-black text-gray-800 mb-2">
            Quản Lý
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500"> Lịch Hẹn</span>
          </h1>
          <p className="text-gray-600 text-lg">Quản lý tất cả lịch hẹn dịch vụ</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-purple-100 mb-8 animate-fade-in" style={{animationDelay: '0.1s'}}>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm khách hàng, dịch vụ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="in_progress">Đang thực hiện</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400"
            >
              <option value="all">Tất cả thời gian</option>
              <option value="today">Hôm nay</option>
              <option value="tomorrow">Ngày mai</option>
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
            </select>

            {/* Service Filter */}
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400"
            >
              <option value="all">Tất cả dịch vụ</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>{service.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-6 text-white shadow-xl animate-fade-in" style={{animationDelay: '0.2s'}}>
            <FaClock className="text-4xl mb-3 opacity-80" />
            <p className="text-3xl font-black mb-1">
              {appointments.filter(a => a.status === 'pending').length}
            </p>
            <p className="text-yellow-100">Chờ xác nhận</p>
          </div>

          <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl p-6 text-white shadow-xl animate-fade-in" style={{animationDelay: '0.3s'}}>
            <FaCheckCircle className="text-4xl mb-3 opacity-80" />
            <p className="text-3xl font-black mb-1">
              {appointments.filter(a => a.status === 'confirmed').length}
            </p>
            <p className="text-blue-100">Đã xác nhận</p>
          </div>

          <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-3xl p-6 text-white shadow-xl animate-fade-in" style={{animationDelay: '0.4s'}}>
            <FaPaw className="text-4xl mb-3 opacity-80" />
            <p className="text-3xl font-black mb-1">
              {appointments.filter(a => a.status === 'in_progress').length}
            </p>
            <p className="text-purple-100">Đang thực hiện</p>
          </div>

          <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-3xl p-6 text-white shadow-xl animate-fade-in" style={{animationDelay: '0.5s'}}>
            <FaCheckCircle className="text-4xl mb-3 opacity-80" />
            <p className="text-3xl font-black mb-1">
              {appointments.filter(a => a.status === 'completed').length}
            </p>
            <p className="text-green-100">Hoàn thành</p>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-xl border-2 border-purple-100">
              <FaCalendar className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Không có lịch hẹn nào</p>
            </div>
          ) : (
            filteredAppointments.map((appointment, index) => {
              const badge = getStatusBadge(appointment.status)
              const StatusIcon = badge.icon
              
              return (
                <div
                  key={appointment.id}
                  className="bg-white rounded-3xl p-6 shadow-xl border-2 border-purple-100 hover:shadow-2xl transition-all animate-fade-in"
                  style={{animationDelay: `${0.6 + index * 0.05}s`}}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Left: Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg">
                          {appointment.id}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-800">{appointment.service?.name}</h3>
                            <span className={`px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2 ${badge.bg} ${badge.text}`}>
                              <StatusIcon />
                              {badge.label}
                            </span>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-3 text-gray-600">
                            <div className="flex items-center gap-2">
                              <FaUser className="text-purple-500" />
                              <span className="font-semibold">{appointment.customer?.name}</span>
                            </div>
                            
                            {appointment.pet && (
                              <div className="flex items-center gap-2">
                                <FaPaw className="text-pink-500" />
                                <span>{appointment.pet.name} ({appointment.pet.species})</span>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-2">
                              <FaCalendar className="text-blue-500" />
                              <span>{new Date(appointment.appointment_date).toLocaleDateString('vi-VN')}</span>
                              <span className="font-bold">{appointment.appointment_time}</span>
                            </div>
                            
                            {appointment.staff && (
                              <div className="flex items-center gap-2">
                                <FaUserMd className="text-green-500" />
                                <span>NV: {appointment.staff.name}</span>
                              </div>
                            )}
                          </div>

                          {appointment.notes && (
                            <div className="mt-3 p-3 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                              <p className="text-sm text-gray-700">{appointment.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col gap-3 lg:w-64">
                      {/* Assign Staff */}
                      {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                        <select
                          value={appointment.staff_id || ''}
                          onChange={(e) => handleAssignStaff(appointment.id, e.target.value)}
                          className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 text-sm"
                        >
                          <option value="">Chọn nhân viên</option>
                          {staff.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      )}

                      {/* Status Actions */}
                      <div className="flex gap-2">
                        {appointment.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                              className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all text-sm"
                            >
                              Xác nhận
                            </button>
                            <button
                              onClick={() => handleStatusChange(appointment.id, 'rejected')}
                              className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all text-sm"
                            >
                              Từ chối
                            </button>
                          </>
                        )}

                        {appointment.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusChange(appointment.id, 'in_progress')}
                            className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl transition-all text-sm"
                          >
                            Bắt đầu
                          </button>
                        )}

                        {appointment.status === 'in_progress' && (
                          <button
                            onClick={() => handleStatusChange(appointment.id, 'completed')}
                            className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all text-sm"
                          >
                            Hoàn thành
                          </button>
                        )}
                      </div>

                      {/* View Detail */}
                      <Link
                        to={`/admin/appointments/${appointment.id}`}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                      >
                        <FaEye />
                        Chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default UltimateAdminAppointments

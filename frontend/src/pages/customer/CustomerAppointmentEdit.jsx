import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  FaArrowLeft, FaCalendar, FaClock, FaPaw, FaEdit, 
  FaSave, FaTimesCircle, FaCheckCircle 
} from 'react-icons/fa'
import { toast } from 'react-toastify'
import api from '../../services/api'

const CustomerAppointmentEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [appointment, setAppointment] = useState(null)
  const [services, setServices] = useState([])
  const [pets, setPets] = useState([])
  
  const [formData, setFormData] = useState({
    service_id: '',
    pet_id: '',
    appointment_date: '',
    appointment_time: '',
    notes: ''
  })

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      const [appointmentRes, servicesRes, petsRes] = await Promise.all([
        api.get(`/appointments/${id}`),
        api.get('/services'),
        api.get('/pets')
      ])
      
      const apt = appointmentRes.data.appointment
      setAppointment(apt)
      setServices(servicesRes.data.services || [])
      setPets(petsRes.data.pets || [])
      
      setFormData({
        service_id: apt.service_id,
        pet_id: apt.pet_id || '',
        appointment_date: apt.appointment_date,
        appointment_time: apt.appointment_time,
        notes: apt.notes || ''
      })
    } catch (error) {
      toast.error('Không thể tải thông tin lịch hẹn')
      navigate('/appointments')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      await api.put(`/appointments/${id}`, formData)
      toast.success('Cập nhật lịch hẹn thành công!')
      navigate('/appointments')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể cập nhật lịch hẹn')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = async () => {
    if (!window.confirm('Bạn có chắc muốn hủy lịch hẹn này?')) return
    
    try {
      await api.put(`/appointments/${id}/cancel`)
      toast.success('Đã hủy lịch hẹn')
      navigate('/appointments')
    } catch (error) {
      toast.error('Không thể hủy lịch hẹn')
    }
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

  const canEdit = ['pending', 'confirmed'].includes(appointment?.status)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Link
            to="/appointments"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold mb-4 transition-colors"
          >
            <FaArrowLeft />
            Quay lại lịch hẹn
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-black text-gray-800 mb-2">
            Chỉnh Sửa
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500"> Lịch Hẹn</span>
          </h1>
          <p className="text-gray-600">
            Cập nhật thông tin lịch hẹn của bạn
          </p>
        </div>

        {!canEdit && (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-6 mb-6 animate-fade-in">
            <p className="text-yellow-800 font-semibold">
              ⚠️ Lịch hẹn này không thể chỉnh sửa vì đã {appointment.status === 'completed' ? 'hoàn thành' : appointment.status === 'cancelled' ? 'bị hủy' : 'đang được xử lý'}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-xl border-2 border-purple-100 animate-fade-in">
          <div className="space-y-6">
            {/* Service */}
            <div>
              <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                <FaPaw className="text-purple-500" />
                Dịch vụ *
              </label>
              <select
                name="service_id"
                value={formData.service_id}
                onChange={handleChange}
                required
                disabled={!canEdit}
                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-800 focus:outline-none focus:border-purple-400 focus:bg-white transition-all text-lg disabled:opacity-50"
              >
                <option value="">Chọn dịch vụ</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name} - {service.price.toLocaleString('vi-VN')}đ
                  </option>
                ))}
              </select>
            </div>

            {/* Pet */}
            <div>
              <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                🐾 Thú cưng
              </label>
              <select
                name="pet_id"
                value={formData.pet_id}
                onChange={handleChange}
                disabled={!canEdit}
                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-800 focus:outline-none focus:border-purple-400 focus:bg-white transition-all text-lg disabled:opacity-50"
              >
                <option value="">Chọn thú cưng (tùy chọn)</option>
                {pets.map(pet => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name} - {pet.type}
                  </option>
                ))}
              </select>
            </div>

            {/* Date & Time */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                  <FaCalendar className="text-purple-500" />
                  Ngày hẹn *
                </label>
                <input
                  type="date"
                  name="appointment_date"
                  value={formData.appointment_date}
                  onChange={handleChange}
                  required
                  disabled={!canEdit}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-800 focus:outline-none focus:border-purple-400 focus:bg-white transition-all text-lg disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                  <FaClock className="text-purple-500" />
                  Giờ hẹn *
                </label>
                <input
                  type="time"
                  name="appointment_time"
                  value={formData.appointment_time}
                  onChange={handleChange}
                  required
                  disabled={!canEdit}
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-800 focus:outline-none focus:border-purple-400 focus:bg-white transition-all text-lg disabled:opacity-50"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                📝 Ghi chú
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                disabled={!canEdit}
                placeholder="Thêm ghi chú về lịch hẹn..."
                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-800 focus:outline-none focus:border-purple-400 focus:bg-white transition-all resize-none text-lg disabled:opacity-50"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              {canEdit && (
                <>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white text-xl font-black rounded-2xl transition-all hover:shadow-2xl hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    <FaSave />
                    {saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white text-xl font-black rounded-2xl transition-all hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-3"
                  >
                    <FaTimesCircle />
                    Hủy Lịch Hẹn
                  </button>
                </>
              )}

              <Link
                to="/appointments"
                className="flex-1 py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xl font-black rounded-2xl transition-all text-center"
              >
                Quay Lại
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CustomerAppointmentEdit

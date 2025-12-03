import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  FaCalendarAlt, FaClock, FaUser, FaPhone, FaEnvelope, 
  FaPaw, FaMapMarkerAlt, FaStickyNote, FaCheckCircle,
  FaArrowLeft, FaInfoCircle
} from 'react-icons/fa'
import { getServices } from '../services/laravelServiceApi'
import { appointmentService } from '../services/appointmentService'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'

const UltimateBookAppointment = () => {
  const { serviceId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [step, setStep] = useState(1)
  const [bookedTimes, setBookedTimes] = useState([])
  const [loadingTimes, setLoadingTimes] = useState(false)
  
  // Form data
  const [formData, setFormData] = useState({
    service_id: serviceId,
    pet_name: '',
    pet_type: 'dog',
    pet_age: '',
    pet_weight: '',
    appointment_date: '',
    appointment_time: '',
    customer_name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    notes: ''
  })

  useEffect(() => {
    if (!user) {
      toast.warning('Vui lòng đăng nhập để đặt lịch!')
      navigate('/login')
      return
    }
    fetchService()
  }, [serviceId, user])

  const fetchService = async () => {
    try {
      setLoading(true)
      const data = await getServices()
      const foundService = (data.data || data).find(s => s.id === parseInt(serviceId))
      setService(foundService)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Không thể tải thông tin dịch vụ')
    } finally {
      setLoading(false)
    }
  }

  // Generate available time slots
  const getTimeSlots = () => {
    const slots = []
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute of ['00', '30']) {
        if (hour === 18 && minute === '30') break
        const time = `${hour.toString().padStart(2, '0')}:${minute}`
        slots.push(time)
      }
    }
    return slots
  }

  // Get next 30 days
  const getAvailableDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      // Skip Sundays (0)
      if (date.getDay() !== 0) {
        dates.push(date.toISOString().split('T')[0])
      }
    }
    return dates
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (step < 3) {
      setStep(step + 1)
      return
    }

    try {
      setSubmitting(true)
      await appointmentService.createAppointment(formData)
      toast.success('Đặt lịch thành công! 🎉')
      navigate('/appointments')
    } catch (error) {
      console.error('Error:', error)
      toast.error(error.response?.data?.message || 'Không thể đặt lịch')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = async (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })

    // Khi chọn ngày, fetch giờ đã đặt
    if (name === 'appointment_date' && value) {
      await fetchBookedTimes(value)
    }
  }

  const fetchBookedTimes = async (date) => {
    try {
      setLoadingTimes(true)
      const data = await appointmentService.getBookedTimes(serviceId, date)
      setBookedTimes(data.booked_times || [])
    } catch (error) {
      console.error('Error fetching booked times:', error)
      setBookedTimes([])
    } finally {
      setLoadingTimes(false)
    }
  }

  const isTimeBooked = (time) => {
    return bookedTimes.includes(time)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 border-8 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-2xl text-gray-600 font-bold">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6">😿</div>
          <h2 className="text-4xl font-black text-gray-800 mb-4">Không tìm thấy dịch vụ</h2>
          <button
            onClick={() => navigate('/services')}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-black rounded-2xl hover:shadow-2xl transition-all"
          >
            Quay lại dịch vụ
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/services')}
          className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-800 font-semibold transition-all hover:gap-3"
        >
          <FaArrowLeft />
          Quay lại dịch vụ
        </button>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            {[
              { num: 1, label: 'Thông tin thú cưng', icon: <FaPaw /> },
              { num: 2, label: 'Chọn ngày & giờ', icon: <FaCalendarAlt /> },
              { num: 3, label: 'Thông tin liên hệ', icon: <FaUser /> }
            ].map((s, i) => (
              <div key={i} className="flex items-center">
                <div className={`flex flex-col items-center ${step >= s.num ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black transition-all ${
                    step >= s.num
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-2xl scale-110'
                      : 'bg-white text-gray-400 shadow-lg'
                  }`}>
                    {step > s.num ? <FaCheckCircle /> : s.icon}
                  </div>
                  <span className={`mt-2 text-sm font-semibold ${step >= s.num ? 'text-gray-800' : 'text-gray-400'}`}>
                    {s.label}
                  </span>
                </div>
                {i < 2 && (
                  <div className={`w-24 h-1 mx-4 rounded-full transition-all ${
                    step > s.num ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Service Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-2xl p-6 sticky top-4 border-2 border-gray-100">
              <h3 className="text-2xl font-black text-gray-800 mb-4">Dịch vụ đã chọn</h3>
              
              <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
                <img
                  src={service.image || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800'}
                  alt={service.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800'
                  }}
                />
              </div>

              <h4 className="text-xl font-bold text-gray-800 mb-3">{service.name}</h4>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                  <span className="text-gray-600 font-semibold">Giá dịch vụ:</span>
                  <span className="text-2xl font-black text-blue-600">
                    {service.price?.toLocaleString('vi-VN')}đ
                  </span>
                </div>
                
                {service.duration && (
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                    <span className="text-gray-600 font-semibold">Thời gian:</span>
                    <span className="text-lg font-bold text-purple-600">
                      {service.duration} phút
                    </span>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border-2 border-blue-200">
                <div className="flex items-start gap-3">
                  <FaInfoCircle className="text-blue-600 text-xl mt-1 flex-shrink-0" />
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold mb-2">Lưu ý quan trọng:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Vui lòng đến đúng giờ hẹn</li>
                      <li>• Mang theo sổ tiêm chủng (nếu có)</li>
                      <li>• Thông báo trước nếu cần hủy/đổi lịch</li>
                      <li>• Liên hệ hotline: 1900-xxxx</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-gray-100">
              {/* Step 1: Pet Info */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🐾</div>
                    <h2 className="text-4xl font-black text-gray-800 mb-2">
                      Thông Tin Thú Cưng
                    </h2>
                    <p className="text-gray-600">Cho chúng tôi biết về bé cưng của bạn</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-bold mb-2">
                        Tên thú cưng <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="pet_name"
                        value={formData.pet_name}
                        onChange={handleChange}
                        required
                        placeholder="VD: Milo"
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 text-lg font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-2">
                        Loại thú cưng <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="pet_type"
                        value={formData.pet_type}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 text-lg font-semibold appearance-none bg-white cursor-pointer"
                      >
                        <option value="dog">🐕 Chó</option>
                        <option value="cat">🐈 Mèo</option>
                        <option value="other">🐾 Khác</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-2">
                        Tuổi (tháng)
                      </label>
                      <input
                        type="number"
                        name="pet_age"
                        value={formData.pet_age}
                        onChange={handleChange}
                        placeholder="VD: 12"
                        min="1"
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 text-lg font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-2">
                        Cân nặng (kg)
                      </label>
                      <input
                        type="number"
                        name="pet_weight"
                        value={formData.pet_weight}
                        onChange={handleChange}
                        placeholder="VD: 5.5"
                        step="0.1"
                        min="0.1"
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 text-lg font-semibold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Date & Time */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="text-6xl mb-4">📅</div>
                    <h2 className="text-4xl font-black text-gray-800 mb-2">
                      Chọn Ngày & Giờ
                    </h2>
                    <p className="text-gray-600">Chọn thời gian phù hợp với bạn</p>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-3 text-lg">
                      Ngày hẹn <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="appointment_date"
                      value={formData.appointment_date}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 text-lg font-semibold appearance-none bg-white cursor-pointer"
                    >
                      <option value="">Chọn ngày...</option>
                      {getAvailableDates().map(date => {
                        const d = new Date(date)
                        const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
                        return (
                          <option key={date} value={date}>
                            {dayNames[d.getDay()]} - {d.toLocaleDateString('vi-VN')}
                          </option>
                        )
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-3 text-lg">
                      Giờ hẹn <span className="text-red-500">*</span>
                    </label>
                    {loadingTimes ? (
                      <div className="text-center py-8">
                        <div className="inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                        <p className="mt-2 text-gray-600">Đang kiểm tra giờ trống...</p>
                      </div>
                    ) : !formData.appointment_date ? (
                      <div className="text-center py-8 bg-yellow-50 rounded-2xl border-2 border-yellow-200">
                        <p className="text-yellow-700 font-semibold">Vui lòng chọn ngày trước</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 gap-3">
                        {getTimeSlots().map(time => {
                          const isBooked = isTimeBooked(time)
                          return (
                            <button
                              key={time}
                              type="button"
                              onClick={() => !isBooked && setFormData({ ...formData, appointment_time: time })}
                              disabled={isBooked}
                              className={`py-3 rounded-xl font-bold transition-all relative ${
                                isBooked
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                                  : formData.appointment_time === time
                                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl scale-105'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              }`}
                            >
                              {time}
                              {isBooked && (
                                <span className="absolute top-0 right-0 text-xs bg-red-500 text-white px-2 py-1 rounded-bl-lg rounded-tr-lg">
                                  Đã đặt
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Contact Info */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="text-6xl mb-4">📞</div>
                    <h2 className="text-4xl font-black text-gray-800 mb-2">
                      Thông Tin Liên Hệ
                    </h2>
                    <p className="text-gray-600">Xác nhận thông tin của bạn</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-bold mb-2">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="customer_name"
                        value={formData.customer_name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 text-lg font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-2">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 text-lg font-semibold"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-gray-700 font-bold mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 text-lg font-semibold"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-gray-700 font-bold mb-2">
                        Địa chỉ
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Địa chỉ của bạn"
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 text-lg font-semibold"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-gray-700 font-bold mb-2">
                        Ghi chú
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Thông tin thêm về thú cưng hoặc yêu cầu đặc biệt..."
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 text-lg resize-none"
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8 pt-8 border-t-2 border-gray-200">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="flex-1 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-black rounded-2xl transition-all text-lg"
                  >
                    Quay lại
                  </button>
                )}
                
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-black rounded-2xl transition-all hover:shadow-2xl text-lg disabled:cursor-not-allowed"
                >
                  {submitting ? '⏳ Đang xử lý...' : step === 3 ? '✅ Xác nhận đặt lịch' : 'Tiếp tục →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UltimateBookAppointment

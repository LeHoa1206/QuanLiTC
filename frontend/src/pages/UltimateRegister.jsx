import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaPaw, FaCheck, FaEye, FaEyeSlash, FaDog, FaCat, FaHeart, FaBone } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'
import { authService } from '../services/authService'
import { addressService } from '../services/addressService'
import api from '../services/api'
import { toast } from 'react-toastify'

const UltimateRegister = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    ward: '',
    ward_code: '',
    district: '',
    district_code: '',
    city: '',
    city_code: '',
    password: '',
    password_confirmation: '',
  })
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [loadingAddress, setLoadingAddress] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    loadProvinces()
  }, [])

  const loadProvinces = async () => {
    try {
      const data = await addressService.getProvinces()
      setProvinces(data)
    } catch (error) {
      console.error('Error loading provinces:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleProvinceChange = async (e) => {
    const provinceCode = e.target.value
    const provinceName = e.target.options[e.target.selectedIndex].text
    
    setFormData({
      ...formData,
      city_code: provinceCode,
      city: provinceName,
      district_code: '',
      district: '',
      ward_code: '',
      ward: ''
    })
    
    setDistricts([])
    setWards([])
    
    if (provinceCode) {
      try {
        setLoadingAddress(true)
        const data = await addressService.getDistricts(provinceCode)
        setDistricts(data)
      } catch (error) {
        console.error('Error loading districts:', error)
      } finally {
        setLoadingAddress(false)
      }
    }
  }

  const handleDistrictChange = async (e) => {
    const districtCode = e.target.value
    const districtName = e.target.options[e.target.selectedIndex].text
    
    setFormData({
      ...formData,
      district_code: districtCode,
      district: districtName,
      ward_code: '',
      ward: ''
    })
    
    setWards([])
    
    if (districtCode) {
      try {
        setLoadingAddress(true)
        const data = await addressService.getWards(districtCode)
        setWards(data)
      } catch (error) {
        console.error('Error loading wards:', error)
      } finally {
        setLoadingAddress(false)
      }
    }
  }

  const handleWardChange = (e) => {
    const wardCode = e.target.value
    const wardName = e.target.options[e.target.selectedIndex].text
    
    setFormData({
      ...formData,
      ward_code: wardCode,
      ward: wardName
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.password_confirmation) {
      toast.error('Mật khẩu không khớp!')
      return
    }

    setLoading(true)
    try {
      // Đăng ký user
      const response = await authService.register(formData)
      login(response.user, response.token)
      
      // Tự động tạo địa chỉ mặc định
      try {
        await api.post('/addresses', {
          label: 'Home',
          full_name: formData.name,
          phone: formData.phone,
          address: formData.address,
          ward: formData.ward,
          ward_code: formData.ward_code,
          district: formData.district,
          district_code: formData.district_code,
          city: formData.city,
          city_code: formData.city_code,
          is_default: true
        })
      } catch (addressError) {
        console.error('Error creating default address:', addressError)
      }
      
      toast.success('Đăng ký thành công! 🎉')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng ký thất bại')
    } finally {
      setLoading(false)
    }
  }

  const nextStep = async () => {
    if (step === 1 && (!formData.name || !formData.email)) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }
    
    // Kiểm tra email đã tồn tại khi chuyển từ bước 1 sang bước 2
    if (step === 1) {
      try {
        setLoading(true)
        const response = await api.post('/check-email', { email: formData.email })
        if (response.data.exists) {
          toast.error('Email này đã được sử dụng. Vui lòng chọn email khác!')
          return
        }
      } catch (error) {
        toast.error('Không thể kiểm tra email. Vui lòng thử lại!')
        return
      } finally {
        setLoading(false)
      }
    }
    
    if (step === 2 && (!formData.phone || !formData.city || !formData.district || !formData.ward || !formData.address)) {
      toast.error('Vui lòng điền đầy đủ địa chỉ')
      return
    }
    setStep(step + 1)
  }

  const prevStep = () => setStep(step - 1)

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 py-20">
      {/* Multi-layer Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 animate-gradient-xy"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-orange-500 via-pink-500 to-purple-500 opacity-50 animate-gradient-xy" style={{ animationDelay: '1s' }}></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '50px 50px',
          }}></div>
        </div>
      </div>

      {/* Floating Elements */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute text-white/10"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${20 + Math.random() * 30}px`,
            animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        >
          {['🐕', '🐈', '🐾', '❤️', '⭐'][Math.floor(Math.random() * 5)]}
        </div>
      ))}

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-2xl scale-in">
        <div className="glass-dark rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 backdrop-blur-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-block relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-400 rounded-3xl blur-xl opacity-75 animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-orange-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                <FaPaw className="text-white text-4xl paw-animation" />
              </div>
            </div>
            <h1 className="text-4xl font-black text-white mb-2">
              Tham Gia Cùng Chúng Tôi
            </h1>
            <p className="text-white/70">Bắt đầu hành trình yêu thương thú cưng</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-10">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= s 
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white scale-110' 
                    : 'bg-white/10 text-white/50'
                }`}>
                  {step > s ? <FaCheck /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-20 h-1 mx-2 rounded-full transition-all ${
                    step > s ? 'bg-gradient-to-r from-orange-500 to-pink-500' : 'bg-white/20'
                  }`}></div>
                )}
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-6 fade-in-up">
                <div>
                  <label className="text-white/90 font-semibold text-sm mb-2 block">Họ và tên</label>
                  <div className="relative group">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-orange-400 transition-colors" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nguyễn Văn A"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-orange-400 focus:bg-white/20 transition-all backdrop-blur-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/90 font-semibold text-sm mb-2 block">Email</label>
                  <div className="relative group">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-orange-400 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-orange-400 focus:bg-white/20 transition-all backdrop-blur-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Contact Info */}
            {step === 2 && (
              <div className="space-y-6 fade-in-up">
                <div>
                  <label className="text-white/90 font-semibold text-sm mb-2 block">Số điện thoại</label>
                  <div className="relative group">
                    <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-orange-400 transition-colors" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0123456789"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-orange-400 focus:bg-white/20 transition-all backdrop-blur-xl"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-white/90 font-semibold text-sm mb-2 block">Tỉnh/Thành phố *</label>
                    <select
                      name="city_code"
                      value={formData.city_code}
                      onChange={handleProvinceChange}
                      required
                      disabled={loadingAddress}
                      className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:border-orange-400 focus:bg-white/20 transition-all backdrop-blur-xl disabled:opacity-50"
                    >
                      <option value="">-- Chọn --</option>
                      {provinces.map(p => (
                        <option key={p.code} value={p.code}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-white/90 font-semibold text-sm mb-2 block">Quận/Huyện *</label>
                    <select
                      name="district_code"
                      value={formData.district_code}
                      onChange={handleDistrictChange}
                      required
                      disabled={!formData.city_code || loadingAddress}
                      className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:border-orange-400 focus:bg-white/20 transition-all backdrop-blur-xl disabled:opacity-50"
                    >
                      <option value="">-- Chọn --</option>
                      {districts.map(d => (
                        <option key={d.code} value={d.code}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-white/90 font-semibold text-sm mb-2 block">Phường/Xã *</label>
                    <select
                      name="ward_code"
                      value={formData.ward_code}
                      onChange={handleWardChange}
                      required
                      disabled={!formData.district_code || loadingAddress}
                      className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:border-orange-400 focus:bg-white/20 transition-all backdrop-blur-xl disabled:opacity-50"
                    >
                      <option value="">-- Chọn --</option>
                      {wards.map(w => (
                        <option key={w.code} value={w.code}>{w.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-white/90 font-semibold text-sm mb-2 block">Địa chỉ chi tiết (Số nhà, tên đường)</label>
                  <div className="relative group">
                    <FaMapMarkerAlt className="absolute left-4 top-6 text-white/50 group-focus-within:text-orange-400 transition-colors" />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="VD: 123 Đường Lê Lợi"
                      required
                      rows="2"
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-orange-400 focus:bg-white/20 transition-all backdrop-blur-xl resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Password */}
            {step === 3 && (
              <div className="space-y-6 fade-in-up">
                <div>
                  <label className="text-white/90 font-semibold text-sm mb-2 block">Mật khẩu</label>
                  <div className="relative group">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-orange-400 transition-colors z-10" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      minLength="6"
                      className="w-full pl-12 pr-14 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-orange-400 focus:bg-white/20 transition-all backdrop-blur-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-orange-400 transition-all duration-300 hover:scale-125 z-10"
                    >
                      {showPassword ? <FaEyeSlash className="text-xl" /> : <FaEye className="text-xl" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-white/90 font-semibold text-sm mb-2 block">Xác nhận mật khẩu</label>
                  <div className="relative group">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-orange-400 transition-colors z-10" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      minLength="6"
                      className="w-full pl-12 pr-14 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-orange-400 focus:bg-white/20 transition-all backdrop-blur-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-orange-400 transition-all duration-300 hover:scale-125 z-10"
                    >
                      {showConfirmPassword ? <FaEyeSlash className="text-xl" /> : <FaEye className="text-xl" />}
                    </button>
                  </div>
                </div>

                <label className="flex items-start gap-3 text-white/90 cursor-pointer group">
                  <input
                    type="checkbox"
                    required
                    className="w-5 h-5 mt-1 rounded border-white/20 bg-white/10 checked:bg-orange-500 focus:ring-2 focus:ring-orange-400 transition-all"
                  />
                  <span className="text-sm group-hover:text-white transition-colors">
                    Tôi đồng ý với{' '}
                    <Link to="/terms" className="text-orange-400 hover:text-orange-300 font-semibold">
                      Điều khoản dịch vụ
                    </Link>
                    {' '}và{' '}
                    <Link to="/privacy" className="text-orange-400 hover:text-orange-300 font-semibold">
                      Chính sách bảo mật
                    </Link>
                  </span>
                </label>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-2xl transition-all"
                >
                  Quay lại
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={loading}
                  className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold rounded-2xl transition-all transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading && step === 1 ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Đang kiểm tra...
                    </div>
                  ) : (
                    'Tiếp tục'
                  )}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold rounded-2xl transition-all transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Đang xử lý...
                    </div>
                  ) : (
                    'Hoàn tất đăng ký'
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-white/70">
              Đã có tài khoản?{' '}
              <Link
                to="/login"
                className="text-orange-400 hover:text-orange-300 font-bold transition-colors"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UltimateRegister

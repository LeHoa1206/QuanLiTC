import { useState, useEffect } from 'react'
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock, FaEdit, FaSave, FaPlus, FaTrash, FaStar, FaTimes } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'
import { authService } from '../services/authService'
import { addressService } from '../services/addressService'
import api from '../services/api'
import { toast } from 'react-toastify'

const UltimateProfile = () => {
  const { user, updateUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [loadingAddress, setLoadingAddress] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  })
  
  const [passwordData, setPasswordData] = useState({
    password: '',
    password_confirmation: '',
  })
  
  const [addressForm, setAddressForm] = useState({
    label: 'Home',
    full_name: '',
    phone: '',
    address: '',
    city: '',
    city_code: '',
    district: '',
    district_code: '',
    ward: '',
    ward_code: '',
    postal_code: '',
    is_default: false
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
      })
      loadAddresses()
      loadProvinces()
    }
  }, [user])

  const loadAddresses = async () => {
    try {
      const response = await api.get('/addresses')
      setAddresses(response.data)
    } catch (error) {
      console.error('Error loading addresses:', error)
    }
  }

  const loadProvinces = async () => {
    try {
      const data = await addressService.getProvinces()
      setProvinces(data)
    } catch (error) {
      console.error('Error loading provinces:', error)
      toast.error('Không thể tải danh sách tỉnh/thành phố')
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await authService.updateProfile(formData)
      updateUser(response.user)
      toast.success('Cập nhật thông tin thành công! ✅')
      setEditing(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cập nhật thất bại')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    
    if (passwordData.password !== passwordData.password_confirmation) {
      toast.error('Mật khẩu không khớp!')
      return
    }

    setLoading(true)
    try {
      await authService.changePassword(passwordData)
      toast.success('Đổi mật khẩu thành công! ✅')
      setPasswordData({ password: '', password_confirmation: '' })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đổi mật khẩu thất bại')
    } finally {
      setLoading(false)
    }
  }

  const handleProvinceChange = async (e) => {
    const provinceCode = e.target.value
    const provinceName = e.target.options[e.target.selectedIndex].text
    
    setAddressForm({
      ...addressForm,
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
        toast.error('Không thể tải danh sách quận/huyện')
      } finally {
        setLoadingAddress(false)
      }
    }
  }

  const handleDistrictChange = async (e) => {
    const districtCode = e.target.value
    const districtName = e.target.options[e.target.selectedIndex].text
    
    setAddressForm({
      ...addressForm,
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
        toast.error('Không thể tải danh sách phường/xã')
      } finally {
        setLoadingAddress(false)
      }
    }
  }

  const handleWardChange = (e) => {
    const wardCode = e.target.value
    const wardName = e.target.options[e.target.selectedIndex].text
    
    setAddressForm({
      ...addressForm,
      ward_code: wardCode,
      ward: wardName
    })
  }

  const handleAddressFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setAddressForm({
      ...addressForm,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleAddAddress = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      await api.post('/addresses', addressForm)
      toast.success('Thêm địa chỉ thành công! ✅')
      await loadAddresses()
      setShowAddressForm(false)
      resetAddressForm()
    } catch (error) {
      console.error('Error adding address:', error)
      toast.error(error.response?.data?.message || 'Không thể thêm địa chỉ')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateAddress = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      await api.put(`/addresses/${editingAddressId}`, addressForm)
      toast.success('Cập nhật địa chỉ thành công! ✅')
      await loadAddresses()
      setShowAddressForm(false)
      setEditingAddressId(null)
      resetAddressForm()
    } catch (error) {
      console.error('Error updating address:', error)
      toast.error(error.response?.data?.message || 'Không thể cập nhật địa chỉ')
    } finally {
      setLoading(false)
    }
  }

  const handleEditAddress = async (address) => {
    setEditingAddressId(address.id)
    setAddressForm({
      label: address.label || 'Home',
      full_name: address.full_name || '',
      phone: address.phone || '',
      address: address.address || '',
      city: address.city || '',
      city_code: address.city_code || '',
      district: address.district || '',
      district_code: address.district_code || '',
      ward: address.ward || '',
      ward_code: address.ward_code || '',
      postal_code: address.postal_code || '',
      is_default: address.is_default || false
    })
    
    if (address.city_code) {
      try {
        setLoadingAddress(true)
        const distData = await addressService.getDistricts(address.city_code)
        setDistricts(distData)
        
        if (address.district_code) {
          const wardData = await addressService.getWards(address.district_code)
          setWards(wardData)
        }
      } catch (error) {
        console.error('Error loading address data:', error)
      } finally {
        setLoadingAddress(false)
      }
    }
    
    setShowAddressForm(true)
  }

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) return
    
    try {
      setLoading(true)
      await api.delete(`/addresses/${addressId}`)
      toast.success('Xóa địa chỉ thành công! ✅')
      await loadAddresses()
    } catch (error) {
      console.error('Error deleting address:', error)
      toast.error(error.response?.data?.message || 'Không thể xóa địa chỉ')
    } finally {
      setLoading(false)
    }
  }

  const handleSetDefaultAddress = async (addressId) => {
    try {
      setLoading(true)
      await api.post(`/addresses/${addressId}/set-default`)
      toast.success('Đã đặt địa chỉ mặc định! ✅')
      await loadAddresses()
    } catch (error) {
      console.error('Error setting default address:', error)
      toast.error(error.response?.data?.message || 'Không thể đặt địa chỉ mặc định')
    } finally {
      setLoading(false)
    }
  }

  const resetAddressForm = () => {
    setAddressForm({
      label: 'Home',
      full_name: user?.name || '',
      phone: user?.phone || '',
      address: '',
      city: '',
      city_code: '',
      district: '',
      district_code: '',
      ward: '',
      ward_code: '',
      postal_code: '',
      is_default: addresses.length === 0
    })
    setDistricts([])
    setWards([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 fade-in-up">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
            Tài Khoản
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400"> Của Tôi</span>
          </h1>
          <p className="text-xl text-white/70">
            Quản lý thông tin cá nhân và bảo mật
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="glass-dark rounded-3xl p-6 border border-white/10 text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
                <span className="text-5xl font-black text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{user?.name}</h3>
              <p className="text-white/60 mb-4">{user?.email}</p>
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-full text-pink-400 text-sm font-semibold">
                {user?.role === 'customer' ? 'Khách hàng' : user?.role}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Profile Info */}
            <div className="glass-dark rounded-3xl p-8 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <FaUser className="text-purple-400" />
                  Thông Tin Cá Nhân
                </h3>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold rounded-full transition-all flex items-center gap-2"
                  >
                    <FaEdit />
                    Chỉnh sửa
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-white/90 font-semibold text-sm mb-2 block">
                    Họ và tên
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/90 font-semibold text-sm mb-2 block">
                    Email
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white/50 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/90 font-semibold text-sm mb-2 block">
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                {editing && (
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold rounded-2xl transition-all hover:shadow-xl hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <FaSave />
                      {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold rounded-2xl transition-all"
                    >
                      Hủy
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Change Password */}
            <div className="glass-dark rounded-3xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <FaLock className="text-purple-400" />
                Đổi Mật Khẩu
              </h3>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="text-white/90 font-semibold text-sm mb-2 block">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={passwordData.password}
                    onChange={handlePasswordChange}
                    minLength="6"
                    placeholder="Nhập mật khẩu mới"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-all"
                  />
                </div>

                <div>
                  <label className="text-white/90 font-semibold text-sm mb-2 block">
                    Xác nhận mật khẩu
                  </label>
                  <input
                    type="password"
                    name="password_confirmation"
                    value={passwordData.password_confirmation}
                    onChange={handlePasswordChange}
                    minLength="6"
                    placeholder="Nhập lại mật khẩu mới"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !passwordData.password}
                  className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold rounded-2xl transition-all hover:shadow-xl hover:scale-105 disabled:opacity-50"
                >
                  {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                </button>
              </form>
            </div>

            {/* Addresses Section */}
            <div className="glass-dark rounded-3xl p-8 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <FaMapMarkerAlt className="text-purple-400" />
                  Địa Chỉ Giao Hàng
                </h3>
                {!showAddressForm && (
                  <button
                    onClick={() => {
                      resetAddressForm()
                      setShowAddressForm(true)
                    }}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold rounded-full transition-all flex items-center gap-2"
                  >
                    <FaPlus />
                    Thêm địa chỉ
                  </button>
                )}
              </div>

              {showAddressForm ? (
                <form onSubmit={editingAddressId ? handleUpdateAddress : handleAddAddress} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/90 font-semibold text-sm mb-2 block">Loại địa chỉ</label>
                      <select
                        name="label"
                        value={addressForm.label}
                        onChange={handleAddressFormChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-purple-400"
                      >
                        <option value="Home">🏠 Nhà riêng</option>
                        <option value="Work">🏢 Cơ quan</option>
                        <option value="Other">📍 Khác</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-white/90 font-semibold text-sm mb-2 block">Họ tên người nhận</label>
                      <input
                        type="text"
                        name="full_name"
                        value={addressForm.full_name}
                        onChange={handleAddressFormChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-white/90 font-semibold text-sm mb-2 block">Số điện thoại</label>
                    <input
                      type="tel"
                      name="phone"
                      value={addressForm.phone}
                      onChange={handleAddressFormChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-white/90 font-semibold text-sm mb-2 block">Tỉnh/Thành phố *</label>
                      <select
                        name="city_code"
                        value={addressForm.city_code}
                        onChange={handleProvinceChange}
                        required
                        disabled={loadingAddress}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-purple-400 disabled:opacity-50"
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
                        value={addressForm.district_code}
                        onChange={handleDistrictChange}
                        required
                        disabled={!addressForm.city_code || loadingAddress}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-purple-400 disabled:opacity-50"
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
                        value={addressForm.ward_code}
                        onChange={handleWardChange}
                        required
                        disabled={!addressForm.district_code || loadingAddress}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-purple-400 disabled:opacity-50"
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
                    <input
                      type="text"
                      name="address"
                      value={addressForm.address}
                      onChange={handleAddressFormChange}
                      required
                      placeholder="VD: 123 Đường Lê Lợi"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="is_default"
                      checked={addressForm.is_default}
                      onChange={handleAddressFormChange}
                      className="w-4 h-4 rounded"
                    />
                    <label className="text-white/90 text-sm">Đặt làm địa chỉ mặc định</label>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold rounded-2xl transition-all hover:shadow-xl hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <FaSave />
                      {loading ? 'Đang lưu...' : editingAddressId ? 'Cập nhật' : 'Thêm địa chỉ'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddressForm(false)
                        setEditingAddressId(null)
                        resetAddressForm()
                      }}
                      className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold rounded-2xl transition-all flex items-center gap-2"
                    >
                      <FaTimes />
                      Hủy
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  {addresses.length === 0 ? (
                    <div className="text-center py-12">
                      <FaMapMarkerAlt className="w-16 h-16 text-white/20 mx-auto mb-4" />
                      <p className="text-white/50 mb-4">Chưa có địa chỉ nào</p>
                      <button
                        onClick={() => {
                          resetAddressForm()
                          setShowAddressForm(true)
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold rounded-2xl transition-all hover:shadow-xl hover:scale-105"
                      >
                        Thêm địa chỉ đầu tiên
                      </button>
                    </div>
                  ) : (
                    addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`p-4 rounded-2xl border-2 transition-all ${
                          addr.is_default 
                            ? 'border-purple-400 bg-purple-500/10' 
                            : 'border-white/10 bg-white/5'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {addr.is_default && <FaStar className="text-yellow-400" />}
                            <h4 className="font-bold text-white">
                              {addr.label === 'Home' ? '🏠 Nhà riêng' : 
                               addr.label === 'Work' ? '🏢 Cơ quan' : '📍 Khác'}
                            </h4>
                            {addr.is_default && (
                              <span className="px-2 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full">
                                Mặc định
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {!addr.is_default && (
                              <button
                                onClick={() => handleSetDefaultAddress(addr.id)}
                                disabled={loading}
                                className="p-2 text-yellow-400 hover:bg-white/10 rounded-lg transition-all"
                                title="Đặt làm mặc định"
                              >
                                <FaStar />
                              </button>
                            )}
                            <button
                              onClick={() => handleEditAddress(addr)}
                              className="p-2 text-blue-400 hover:bg-white/10 rounded-lg transition-all"
                              title="Sửa"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(addr.id)}
                              disabled={loading}
                              className="p-2 text-red-400 hover:bg-white/10 rounded-lg transition-all"
                              title="Xóa"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                        <div className="text-sm text-white/70 space-y-1">
                          <p className="font-semibold text-white">{addr.full_name}</p>
                          <p>{addr.phone}</p>
                          <p>{addr.address}</p>
                          <p>
                            {[addr.ward, addr.district, addr.city]
                              .filter(Boolean)
                              .join(', ')}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UltimateProfile

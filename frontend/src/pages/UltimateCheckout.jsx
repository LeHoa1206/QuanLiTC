import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FaCreditCard, FaMoneyBillWave, FaLock, FaCheck, FaShoppingBag, FaTruck, FaShieldAlt, FaUndo, FaArrowLeft, FaPlus, FaMapMarkerAlt, FaTags, FaPercent, FaShippingFast, FaGift } from 'react-icons/fa'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { orderService } from '../services/orderService'
import { addressService } from '../services/addressService'
import { voucherService } from '../services/voucherService'
import api from '../services/api'
import { toast } from 'react-toastify'

const UltimateCheckout = () => {
  const navigate = useNavigate()
  const { cart, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [loadingAddress, setLoadingAddress] = useState(false)
  
  // Voucher state
  const [appliedVoucher, setAppliedVoucher] = useState(null)
  const [discount, setDiscount] = useState(0)
  const [couponCode, setCouponCode] = useState('')
  const [showCoupons, setShowCoupons] = useState(false)
  const [availableVouchers, setAvailableVouchers] = useState([])
  
  const [formData, setFormData] = useState({
    shipping_address: '',
    phone: '',
    payment_method: 'cash',
    notes: '',
  })

  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    full_name: '',
    phone: '',
    address: '',
    ward: '',
    ward_code: '',
    district: '',
    district_code: '',
    city: '',
    city_code: '',
    is_default: false
  })

  // Load addresses and provinces
  useEffect(() => {
    loadAddresses()
    loadProvinces()
    loadAvailableVouchers()
  }, [])

  // Calculate discount based on voucher type
  const calculateDiscount = (voucher, orderAmount) => {
    if (!voucher) return 0
    
    let discountAmount = 0
    switch (voucher.type) {
      case 'percentage':
        discountAmount = orderAmount * (voucher.value / 100)
        break
      case 'fixed_amount':
        discountAmount = voucher.value
        break
      case 'free_shipping':
        return 0 // Free shipping discount is handled separately
      default:
        return 0
    }
    
    // Apply max discount limit
    if (voucher.max_discount_amount && discountAmount > voucher.max_discount_amount) {
      discountAmount = voucher.max_discount_amount
    }
    
    return discountAmount
  }

  // Load available vouchers
  const loadAvailableVouchers = async () => {
    try {
      const subtotal = getCartTotal()
      const response = await voucherService.getAvailableVouchers(subtotal)
      setAvailableVouchers(response.data || [])
    } catch (error) {
      console.error('Error loading vouchers:', error)
      setAvailableVouchers([])
      // Don't show error toast for voucher loading failure
      // User can still manually enter voucher codes
    }
  }

  // Apply voucher by code (manual input)
  const applyVoucherByCode = async () => {
    if (!couponCode.trim()) {
      toast.error('Vui lòng nhập mã giảm giá')
      return
    }

    try {
      const response = await voucherService.validateVoucher(couponCode, getCartTotal())
      if (response.valid) {
        const voucher = response.voucher
        const discountAmount = calculateDiscount(voucher, getCartTotal())
        
        setAppliedVoucher(voucher)
        setDiscount(discountAmount)
        toast.success('🎉 Áp dụng mã giảm giá thành công!')
      } else {
        toast.error(response.message || 'Mã giảm giá không hợp lệ')
      }
    } catch (error) {
      console.error('Error validating voucher:', error)
      toast.error('Không thể áp dụng mã giảm giá. Vui lòng thử lại!')
    }
  }

  // Apply voucher from selection
  const applyCoupon = (coupon) => {
    const discountAmount = calculateDiscount(coupon, getCartTotal())
    setAppliedVoucher(coupon)
    setDiscount(discountAmount)
    setCouponCode(coupon.code)
    setShowCoupons(false)
    toast.success('🎉 Áp dụng mã giảm giá thành công!')
  }

  // Remove voucher
  const removeCoupon = () => {
    setAppliedVoucher(null)
    setDiscount(0)
    setCouponCode('')
    toast.info('Đã hủy mã giảm giá')
  }

  // Update discount when cart total changes
  useEffect(() => {
    if (appliedVoucher) {
      const newDiscount = calculateDiscount(appliedVoucher, getCartTotal())
      setDiscount(newDiscount)
    }
  }, [cart, appliedVoucher])

  const loadAddresses = async () => {
    try {
      const response = await api.get('/addresses')
      const addressList = Array.isArray(response.data) ? response.data : []
      setAddresses(addressList)
      
      // Tự động chọn địa chỉ mặc định
      const defaultAddr = addressList.find(addr => addr.is_default)
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id)
        fillFormWithAddress(defaultAddr)
      } else if (addressList.length > 0) {
        // Nếu không có địa chỉ mặc định, chọn địa chỉ đầu tiên
        setSelectedAddressId(addressList[0].id)
        fillFormWithAddress(addressList[0])
      } else {
        // Không có địa chỉ nào, hiển thị form thêm mới
        setShowNewAddressForm(true)
      }
    } catch (error) {
      console.error('Error loading addresses:', error)
      setShowNewAddressForm(true)
    }
  }

  const loadProvinces = async () => {
    try {
      const data = await addressService.getProvinces()
      setProvinces(data)
    } catch (error) {
      console.error('Error loading provinces:', error)
    }
  }

  const fillFormWithAddress = (address) => {
    const fullAddress = `${address.address}, ${address.ward}, ${address.district}, ${address.city}`
    setFormData(prev => ({
      ...prev,
      phone: address.phone || user?.phone || '',
      shipping_address: fullAddress,
    }))
  }

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId)
    const address = addresses.find(a => a.id === addressId)
    if (address) {
      fillFormWithAddress(address)
    }
    setShowNewAddressForm(false)
  }

  // Auto-fill user info when component mounts
  useEffect(() => {
    if (user && !selectedAddressId) {
      setFormData(prev => ({
        ...prev,
        phone: user.phone || '',
      }))
      setNewAddress(prev => ({
        ...prev,
        full_name: user.name || '',
        phone: user.phone || '',
      }))
    }
  }, [user, selectedAddressId])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleNewAddressChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value })
  }

  const handleProvinceChange = async (e) => {
    const provinceCode = e.target.value
    const provinceName = e.target.options[e.target.selectedIndex].text
    
    setNewAddress({
      ...newAddress,
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
    
    setNewAddress({
      ...newAddress,
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
    
    setNewAddress({
      ...newAddress,
      ward_code: wardCode,
      ward: wardName
    })
  }

  const handleSaveNewAddress = async () => {
    try {
      if (!newAddress.address || !newAddress.ward || !newAddress.district || !newAddress.city) {
        toast.error('Vui lòng điền đầy đủ thông tin địa chỉ')
        return
      }

      const response = await api.post('/addresses', newAddress)
      const savedAddress = response.data.address || response.data
      
      setAddresses([...addresses, savedAddress])
      setSelectedAddressId(savedAddress.id)
      fillFormWithAddress(savedAddress)
      setShowNewAddressForm(false)
      toast.success('Đã lưu địa chỉ mới!')
      
      // Reset form
      setNewAddress({
        label: 'Home',
        full_name: user?.name || '',
        phone: user?.phone || '',
        address: '',
        ward: '',
        ward_code: '',
        district: '',
        district_code: '',
        city: '',
        city_code: '',
        is_default: false
      })
      setDistricts([])
      setWards([])
    } catch (error) {
      toast.error('Không thể lưu địa chỉ. Vui lòng thử lại!')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate
    if (!formData.shipping_address || !formData.phone) {
      toast.error('Vui lòng chọn địa chỉ giao hàng!')
      return
    }

    setLoading(true)

    try {
      // Chuẩn bị items từ giỏ hàng
      const items = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.sale_price || item.price
      }))

      const orderData = {
        shipping_address: formData.shipping_address,
        phone: formData.phone,
        payment_method: formData.payment_method,
        notes: formData.notes || '',
        total_amount: getCartTotal(),  // Thêm total_amount để backend kiểm tra
        coupon_code: appliedVoucher?.code || null,
        discount: discount,
        items,

      }

      console.log('Order data:', orderData)

      if (formData.payment_method === 'vnpay') {
        // Gọi API backend để tạo URL thanh toán VNPay
        const response = await api.post('/vnpay/create', orderData)
        if (response.data.payment_url) {
          window.location.href = response.data.payment_url  // Redirect đến VNPay
        } else {
          throw new Error('Không nhận được URL thanh toán')
        }
      } else {
        // Xử lý các phương thức khác (cash, bank_transfer, momo)
        const response = await orderService.createOrder(orderData)
        clearCart()
        toast.success('Đặt hàng thành công! 🎉')
        navigate('/order-success', { state: { order: response.order } })
      }
    } catch (error) {
      console.error('Order error:', error.response?.data || error.message)
      toast.error(error.response?.data?.message || 'Đặt hàng thất bại')
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Floating Pets */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute text-5xl opacity-10 pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${5 + Math.random() * 5}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`
          }}
        >
          {['🐕', '🐈', '🐾', '🦴'][Math.floor(Math.random() * 4)]}
        </div>
      ))}

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold mb-4 transition-colors"
          >
            <FaArrowLeft />
            Quay lại giỏ hàng
          </Link>
          <h1 className="text-5xl md:text-6xl font-black text-gray-800 mb-3">
            Thanh Toán
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500"> Đơn Hàng</span>
          </h1>
          <p className="text-xl text-gray-600">
            Chỉ còn một bước nữa để hoàn tất đơn hàng! 🎉
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Info */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-purple-100 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <span className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg shadow-lg">
                      1
                    </span>
                    Thông tin giao hàng
                  </h3>
                  {!showNewAddressForm && addresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowNewAddressForm(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
                    >
                      <FaPlus /> Thêm địa chỉ mới
                    </button>
                  )}
                </div>

                {/* Danh sách địa chỉ đã lưu */}
                {!showNewAddressForm && addresses.length > 0 && (
                  <div className="space-y-3 mb-6">
                    {addresses.map((address) => (
                      <label
                        key={address.id}
                        className={`block p-5 rounded-2xl border-2 cursor-pointer transition-all hover:scale-102 ${
                          selectedAddressId === address.id
                            ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg'
                            : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <input
                            type="radio"
                            name="selected_address"
                            checked={selectedAddressId === address.id}
                            onChange={() => handleAddressSelect(address.id)}
                            className="w-5 h-5 mt-1 accent-purple-500"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <FaMapMarkerAlt className="text-purple-500" />
                              <span className="font-bold text-gray-800">{address.full_name}</span>
                              {address.is_default && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                  Mặc định
                                </span>
                              )}
                            </div>
                            <p className="text-gray-700 mb-1">📱 {address.phone}</p>
                            <p className="text-gray-600 text-sm">
                              {address.address}, {address.ward}, {address.district}, {address.city}
                            </p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {/* Form thêm địa chỉ mới */}
                {showNewAddressForm && (
                  <div className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-gray-700 font-bold text-sm mb-2 block">
                          Họ và tên *
                        </label>
                        <input
                          type="text"
                          name="full_name"
                          value={newAddress.full_name}
                          onChange={handleNewAddressChange}
                          required
                          placeholder="Nguyễn Văn A"
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-gray-700 font-bold text-sm mb-2 block">
                          Số điện thoại *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={newAddress.phone}
                          onChange={handleNewAddressChange}
                          required
                          placeholder="0123456789"
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-gray-700 font-bold text-sm mb-2 block">
                          Tỉnh/Thành phố *
                        </label>
                        <select
                          name="city_code"
                          value={newAddress.city_code}
                          onChange={handleProvinceChange}
                          required
                          disabled={loadingAddress}
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-purple-400 focus:bg-white transition-all disabled:opacity-50"
                        >
                          <option value="">-- Chọn --</option>
                          {provinces.map(p => (
                            <option key={p.code} value={p.code}>{p.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-gray-700 font-bold text-sm mb-2 block">
                          Quận/Huyện *
                        </label>
                        <select
                          name="district_code"
                          value={newAddress.district_code}
                          onChange={handleDistrictChange}
                          required
                          disabled={!newAddress.city_code || loadingAddress}
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-purple-400 focus:bg-white transition-all disabled:opacity-50"
                        >
                          <option value="">-- Chọn --</option>
                          {districts.map(d => (
                            <option key={d.code} value={d.code}>{d.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-gray-700 font-bold text-sm mb-2 block">
                          Phường/Xã *
                        </label>
                        <select
                          name="ward_code"
                          value={newAddress.ward_code}
                          onChange={handleWardChange}
                          required
                          disabled={!newAddress.district_code || loadingAddress}
                          className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-purple-400 focus:bg-white transition-all disabled:opacity-50"
                        >
                          <option value="">-- Chọn --</option>
                          {wards.map(w => (
                            <option key={w.code} value={w.code}>{w.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-700 font-bold text-sm mb-2 block">
                        Địa chỉ chi tiết (Số nhà, tên đường) *
                      </label>
                      <textarea
                        name="address"
                        value={newAddress.address}
                        onChange={handleNewAddressChange}
                        required
                        rows="2"
                        placeholder="VD: 123 Đường Lê Lợi"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white transition-all resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="is_default"
                        checked={newAddress.is_default}
                        onChange={(e) => setNewAddress({...newAddress, is_default: e.target.checked})}
                        className="w-5 h-5 accent-purple-500"
                      />
                      <label className="text-gray-700 font-semibold">
                        Đặt làm địa chỉ mặc định
                      </label>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleSaveNewAddress}
                        className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg transition-all hover:scale-105"
                      >
                        Lưu địa chỉ
                      </button>
                      {addresses.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setShowNewAddressForm(false)}
                          className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-all"
                        >
                          Hủy
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Ghi chú */}
                {!showNewAddressForm && (
                  <div className="mt-6">
                    <label className="text-gray-700 font-bold text-sm mb-2 block flex items-center gap-2">
                      📝 Ghi chú (tùy chọn)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows="2"
                      placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn"
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white transition-all resize-none text-lg"
                    />
                  </div>
                )}
              </div>

              {/* Voucher Section */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-purple-100 animate-fade-in" style={{animationDelay: '0.1s'}}>
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <span className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg shadow-lg">
                    2
                  </span>
                  Mã giảm giá
                </h3>

                {/* Manual Input */}
                <div className="mb-6">
                  <label className="text-gray-700 font-bold text-sm mb-2 block">
                    Nhập mã giảm giá
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Nhập mã giảm giá"
                      className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={applyVoucherByCode}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg transition-all hover:scale-105"
                    >
                      Áp dụng
                    </button>
                  </div>
                </div>

                {/* Applied Voucher Display */}
                {appliedVoucher && (
                  <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FaCheck className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-bold text-green-900">{appliedVoucher.code}</p>
                        <p className="text-sm text-green-700">{appliedVoucher.description}</p>
                        <p className="text-sm text-green-600 font-semibold">
                          {appliedVoucher.type === 'free_shipping' ? 'Miễn phí vận chuyển' : `Giảm ${discount.toLocaleString('vi-VN')}đ`}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-red-500 hover:text-red-700 text-sm font-semibold px-3 py-1 rounded-lg hover:bg-red-50 transition-all"
                    >
                      Xóa
                    </button>
                  </div>
                )}

                {/* Available Vouchers */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowCoupons(!showCoupons)}
                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-xl transition-all duration-300"
                  >
                    <div className="flex items-center gap-2">
                      <FaTags className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-gray-900">
                        Chọn mã giảm giá khả dụng ({availableVouchers.length})
                      </span>
                    </div>
                    <span className="text-purple-600 font-bold">
                      {showCoupons ? '▲' : '▼'}
                    </span>
                  </button>

                  {showCoupons && (
                    <div className="mt-4 space-y-3 max-h-64 overflow-y-auto">
                      {availableVouchers.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                          <FaGift className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p className="font-semibold">Không có voucher khả dụng</p>
                          <p className="text-sm mt-1">Bạn vẫn có thể nhập mã giảm giá ở trên</p>
                        </div>
                      ) : (
                        availableVouchers.map((voucher) => {
                          const discountAmount = calculateDiscount(voucher, getCartTotal())
                          const isSelected = appliedVoucher?.code === voucher.code
                          
                          return (
                            <button
                              key={voucher.code}
                              type="button"
                              onClick={() => applyCoupon(voucher)}
                              disabled={isSelected}
                              className={`w-full p-4 border-2 rounded-xl text-left transition-all duration-300 ${
                                isSelected
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-purple-200 hover:border-purple-400 bg-white hover:bg-purple-50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <p className="font-bold text-purple-900 text-lg">{voucher.code}</p>
                                    {voucher.type === 'percentage' && (
                                      <FaPercent className="w-4 h-4 text-purple-600" />
                                    )}
                                    {voucher.type === 'fixed_amount' && (
                                      <FaMoneyBillWave className="w-4 h-4 text-green-600" />
                                    )}
                                    {voucher.type === 'free_shipping' && (
                                      <FaShippingFast className="w-4 h-4 text-blue-600" />
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{voucher.description}</p>
                                  {voucher.min_order_amount > 0 && (
                                    <p className="text-xs text-gray-500">
                                      Đơn tối thiểu: {voucher.min_order_amount.toLocaleString('vi-VN')}đ
                                    </p>
                                  )}
                                </div>
                                <div className="text-right ml-4">
                                  {voucher.type === 'percentage' && (
                                    <div>
                                      <p className="text-2xl font-black text-purple-600">-{voucher.value}%</p>
                                      <p className="text-sm text-gray-600">≈ {discountAmount.toLocaleString('vi-VN')}đ</p>
                                    </div>
                                  )}
                                  {voucher.type === 'fixed_amount' && (
                                    <p className="text-2xl font-black text-green-600">-{voucher.value.toLocaleString('vi-VN')}đ</p>
                                  )}
                                  {voucher.type === 'free_shipping' && (
                                    <p className="text-lg font-black text-blue-600">FREESHIP</p>
                                  )}
                                </div>
                              </div>
                              {isSelected && (
                                <div className="mt-2 flex items-center gap-2 text-green-600">
                                  <FaCheck className="w-4 h-4" />
                                  <span className="text-sm font-semibold">Đã áp dụng</span>
                                </div>
                              )}
                            </button>
                          )
                        })
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-purple-100 animate-fade-in" style={{animationDelay: '0.2s'}}>
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <span className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg shadow-lg">
                    3
                  </span>
                  Phương thức thanh toán
                </h3>

                <div className="space-y-4">
                  {[
                    { value: 'cash', label: 'Thanh toán khi nhận hàng (COD)', icon: FaMoneyBillWave, emoji: '💵' },
                    { value: 'bank_transfer', label: 'Chuyển khoản ngân hàng', icon: FaCreditCard, emoji: '🏦' },
                    { value: 'vnpay', label: 'Ví điện tử VNPay', icon: FaCreditCard, emoji: '💳' },
                    { value: 'momo', label: 'Ví điện tử MoMo', icon: FaCreditCard, emoji: '📱' },
                  ].map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all hover:scale-102 ${
                        formData.payment_method === method.value
                          ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg'
                          : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-purple-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        value={method.value}
                        checked={formData.payment_method === method.value}
                        onChange={handleChange}
                        className="w-5 h-5 accent-purple-500"
                      />
                      <span className="text-3xl">{method.emoji}</span>
                      <span className="text-gray-800 font-semibold flex-1 text-lg">{method.label}</span>
                      {formData.payment_method === method.value && (
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <FaCheck className="text-white" />
                        </div>
                      )}
                    </label>
                  ))}
                </div>

                <div className="mt-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl flex items-start gap-3">
                  <FaLock className="text-green-600 text-xl mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-green-800 mb-1">
                      Thanh toán an toàn 100%
                    </p>
                    <p className="text-sm text-green-700">
                      Thông tin thanh toán của bạn được bảo mật và mã hóa
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-purple-100 sticky top-24 animate-fade-in" style={{animationDelay: '0.2s'}}>
                <h3 className="text-3xl font-black text-gray-800 mb-6 flex items-center gap-3">
                  <FaShoppingBag className="text-purple-500 text-2xl" />
                  Đơn Hàng
                </h3>

                {/* Products */}
                <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all">
                      <img
                        src={item.main_image || item.image || 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=200'}
                        alt={item.name}
                        className="w-20 h-20 rounded-xl object-cover shadow-md"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-800 font-bold text-sm line-clamp-2 mb-1">
                          {item.name}
                        </p>
                        <p className="text-gray-600 text-sm mb-1">
                          Số lượng: {item.quantity}
                        </p>
                        <p className="text-purple-600 font-bold">
                          {((item.sale_price || item.price) * item.quantity).toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="space-y-4 mb-6 pt-6 border-t-2 border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính ({cart.length} sản phẩm):</span>
                    <span className="font-bold text-gray-800">{getCartTotal().toLocaleString('vi-VN')}đ</span>
                  </div>
                  
                  {appliedVoucher && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center gap-2">
                        <FaTags className="w-4 h-4" />
                        {appliedVoucher.type === 'percentage' && `Giảm giá (${appliedVoucher.value}%)`}
                        {appliedVoucher.type === 'fixed_amount' && 'Giảm giá cố định'}
                        {appliedVoucher.type === 'free_shipping' && 'Miễn phí vận chuyển'}
                      </span>
                      <span className="font-bold">
                        {appliedVoucher.type === 'free_shipping' ? 'FREESHIP' : `-${discount.toLocaleString('vi-VN')}đ`}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center gap-2">
                      Phí vận chuyển
                      {appliedVoucher?.type === 'free_shipping' && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          Voucher
                        </span>
                      )}
                    </span>
                    <span className="font-bold text-green-600">Miễn phí</span>
                  </div>
                  
                  <div className="border-t-2 border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-800">Tổng cộng:</span>
                      <div className="text-right">
                        <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                          {Math.max(0, getCartTotal() - discount).toLocaleString('vi-VN')}đ
                        </p>
                        {discount > 0 && (
                          <p className="text-sm text-green-600 font-semibold">
                            Tiết kiệm {discount.toLocaleString('vi-VN')}đ
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white text-xl font-black rounded-2xl transition-all hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mb-4 group"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <FaShoppingBag className="text-2xl group-hover:rotate-12 transition-transform" />
                      Hoàn Tất Đặt Hàng
                      <FaCheck className="text-2xl group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </button>

                {/* Trust Badges */}
                <div className="pt-6 border-t-2 border-gray-200 space-y-4">
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                      <FaTruck className="text-white text-xl" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Miễn phí vận chuyển</p>
                      <p className="text-xs text-gray-500">Giao hàng toàn quốc</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                      <FaShieldAlt className="text-white text-xl" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Thanh toán an toàn</p>
                      <p className="text-xs text-gray-500">Bảo mật 100%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                      <FaUndo className="text-white text-xl" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Đổi trả dễ dàng</p>
                      <p className="text-xs text-gray-500">Trong vòng 7 ngày</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UltimateCheckout
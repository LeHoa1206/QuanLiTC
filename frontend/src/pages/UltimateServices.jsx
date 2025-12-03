import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  FaCut, FaSpa, FaHeart, FaStar, FaCalendarAlt, FaClock, 
  FaCheckCircle, FaShieldAlt, FaAward, FaUserMd, FaSearch,
  FaFilter, FaDog, FaCat, FaPaw, FaStethoscope
} from 'react-icons/fa'
import { getServices, getServiceCategories } from '../services/laravelServiceApi'
import { toast } from 'react-toastify'

const UltimateServices = () => {
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [priceFilter, setPriceFilter] = useState('all')

  useEffect(() => {
    fetchData()
  }, [selectedCategory])

  const fetchData = async () => {
    try {
      setLoading(true)
      const params = selectedCategory !== 'all' ? { category_id: selectedCategory } : {}
      const servicesData = await getServices(params)
      const categoriesData = await getServiceCategories()
      
      setServices(servicesData.data || servicesData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Không thể tải dịch vụ')
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (slug) => {
    const icons = {
      'grooming': <FaCut className="text-3xl" />,
      'spa': <FaSpa className="text-3xl" />,
      'health': <FaStethoscope className="text-3xl" />,
      'training': <FaAward className="text-3xl" />,
    }
    return icons[slug] || <FaPaw className="text-3xl" />
  }

  const getCategoryColor = (slug) => {
    const colors = {
      'grooming': 'from-pink-400 to-rose-400',
      'spa': 'from-purple-400 to-indigo-400',
      'health': 'from-green-400 to-emerald-400',
      'training': 'from-blue-400 to-cyan-400',
    }
    return colors[slug] || 'from-orange-400 to-amber-400'
  }

  // Filter services
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    let matchesPrice = true
    if (priceFilter === 'low') matchesPrice = service.price < 200000
    else if (priceFilter === 'medium') matchesPrice = service.price >= 200000 && service.price < 500000
    else if (priceFilter === 'high') matchesPrice = service.price >= 500000

    return matchesSearch && matchesPrice
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Floating Pets */}
      {[...Array(12)].map((_, i) => (
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
          {['🐕', '🐈', '✂️', '🛁', '💆', '🎀'][Math.floor(Math.random() * 6)]}
        </div>
      ))}

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl opacity-50 animate-pulse"></div>
            <div className="relative p-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full shadow-2xl">
              <FaSpa className="text-8xl text-white" />
            </div>
          </div>
          
          <h1 className="text-7xl md:text-8xl font-black text-gray-800 mb-6 leading-tight">
            Dịch Vụ Spa
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              Đẳng Cấp 5 Sao
            </span>
          </h1>
          
          <p className="text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Chăm sóc thú cưng của bạn với dịch vụ chuyên nghiệp, tận tâm và yêu thương
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 flex-wrap">
            {[
              { icon: '🏆', value: '10+', label: 'Năm kinh nghiệm' },
              { icon: '😊', value: '5000+', label: 'Khách hàng hài lòng' },
              { icon: '⭐', value: '4.9/5', label: 'Đánh giá trung bình' },
              { icon: '🎯', value: '99%', label: 'Tỷ lệ quay lại' },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-12 border-2 border-gray-100">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Tìm kiếm dịch vụ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 text-lg font-semibold"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 text-lg font-semibold appearance-none bg-white cursor-pointer"
              >
                <option value="all">Tất cả danh mục</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">💰</span>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 text-lg font-semibold appearance-none bg-white cursor-pointer"
              >
                <option value="all">Tất cả mức giá</option>
                <option value="low">Dưới 200K</option>
                <option value="medium">200K - 500K</option>
                <option value="high">Trên 500K</option>
              </select>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`p-6 rounded-3xl transition-all hover:scale-105 ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-2xl scale-105'
                : 'bg-white hover:bg-gray-50 text-gray-700 shadow-lg'
            }`}
          >
            <FaPaw className="text-4xl mx-auto mb-3" />
            <div className="font-black text-lg">Tất cả</div>
            <div className="text-sm opacity-80">{services.length} dịch vụ</div>
          </button>
          
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-6 rounded-3xl transition-all hover:scale-105 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-2xl scale-105'
                  : 'bg-white hover:bg-gray-50 text-gray-700 shadow-lg'
              }`}
            >
              <div className="mx-auto mb-3 flex justify-center">
                {getCategoryIcon(category.slug)}
              </div>
              <div className="font-black text-lg">{category.name}</div>
              <div className="text-sm opacity-80">
                {services.filter(s => s.category_id === category.id).length} dịch vụ
              </div>
            </button>
          ))}
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="text-center py-32">
            <div className="inline-block w-24 h-24 border-8 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-6"></div>
            <p className="text-2xl text-gray-600 font-bold">Đang tải dịch vụ tuyệt vời...</p>
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-3xl transition-all hover:scale-105 group border-2 border-gray-100"
              >
                {/* Service Image */}
                <div className="relative h-64 overflow-hidden">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800'
                      }}
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getCategoryColor(service.category?.slug)} flex items-center justify-center`}>
                      <div className="text-white text-8xl">
                        {getCategoryIcon(service.category?.slug)}
                      </div>
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <div className={`px-4 py-2 bg-gradient-to-r ${getCategoryColor(service.category?.slug)} text-white rounded-full font-bold shadow-lg`}>
                      {service.category?.name}
                    </div>
                  </div>

                  {/* Price Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-white px-5 py-3 rounded-full shadow-2xl">
                      <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                        {service.price?.toLocaleString('vi-VN')}đ
                      </div>
                    </div>
                  </div>

                  {/* Duration Badge */}
                  {service.duration && (
                    <div className="absolute bottom-4 left-4">
                      <div className="bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full text-white font-bold flex items-center gap-2">
                        <FaClock />
                        {service.duration} phút
                      </div>
                    </div>
                  )}
                </div>

                {/* Service Info */}
                <div className="p-6">
                  <h3 className="text-2xl font-black text-gray-800 mb-3 line-clamp-2 min-h-[64px] group-hover:text-blue-600 transition-colors">
                    {service.name}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {service.description || 'Dịch vụ chăm sóc thú cưng chuyên nghiệp với đội ngũ giàu kinh nghiệm'}
                  </p>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaCheckCircle className="text-green-500" />
                      <span>Chuyên nghiệp</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaShieldAlt className="text-blue-500" />
                      <span>An toàn</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaHeart className="text-red-500" />
                      <span>Tận tâm</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaAward className="text-yellow-500" />
                      <span>Chất lượng</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-6 pb-6 border-b border-gray-200">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 text-lg" />
                      ))}
                    </div>
                    <span className="text-gray-600 font-semibold">5.0</span>
                    <span className="text-gray-400">(100+ đánh giá)</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Link
                      to={`/services/${service.id}`}
                      className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-black rounded-2xl transition-all hover:shadow-2xl text-center text-lg"
                    >
                      Xem chi tiết
                    </Link>
                    <button
                      onClick={() => navigate(`/appointments/book/${service.id}`)}
                      className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-black rounded-2xl transition-all hover:shadow-2xl flex items-center justify-center gap-2 text-lg"
                    >
                      <FaCalendarAlt />
                      Đặt lịch
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-3xl shadow-2xl">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-4xl font-black text-gray-800 mb-4">
              Không tìm thấy dịch vụ
            </h3>
            <p className="text-xl text-gray-600 mb-8">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
                setPriceFilter('all')
              }}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-black rounded-2xl hover:shadow-2xl transition-all text-lg"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}

        {/* Why Choose Us */}
        <div className="mt-20 bg-white rounded-3xl p-12 shadow-2xl border-2 border-gray-100">
          <h2 className="text-5xl font-black text-center text-gray-800 mb-4">
            Tại Sao Chọn Chúng Tôi?
          </h2>
          <p className="text-center text-gray-600 text-xl mb-12">
            Cam kết mang đến trải nghiệm tốt nhất cho thú cưng của bạn
          </p>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: <FaUserMd />, title: 'Đội Ngũ Chuyên Nghiệp', desc: 'Được đào tạo bài bản, giàu kinh nghiệm', color: 'from-blue-400 to-cyan-400' },
              { icon: <FaHeart />, title: 'Yêu Thương & Tận Tâm', desc: 'Chăm sóc như thú cưng của chính mình', color: 'from-pink-400 to-rose-400' },
              { icon: <FaShieldAlt />, title: 'An Toàn Tuyệt Đối', desc: 'Quy trình chuẩn, thiết bị hiện đại', color: 'from-green-400 to-emerald-400' },
              { icon: <FaAward />, title: 'Chất Lượng 5 Sao', desc: 'Được hàng nghìn khách hàng tin tưởng', color: 'from-yellow-400 to-orange-400' },
            ].map((item, i) => (
              <div key={i} className="text-center group hover:scale-105 transition-all">
                <div className={`w-24 h-24 mx-auto mb-4 bg-gradient-to-br ${item.color} rounded-3xl flex items-center justify-center text-white text-4xl shadow-xl group-hover:shadow-2xl transition-all group-hover:rotate-6`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-black text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UltimateServices

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaCut, FaHome, FaHeart, FaStar } from 'react-icons/fa'
import { getServices, getServiceCategories } from '../services/laravelServiceApi'

const Services = () => {
  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)

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
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const serviceIcons = {
    'grooming': '✂️',
    'care': '🏠',
    'health': '🏥',
    'training': '🎓'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-black text-white mb-2">
            DỊCH VỤ CHĂM SÓC THÚ CƯNG CHUYÊN NGHIỆP
          </h1>
          <p className="text-white/90">
            Chuyên nghiệp - Tận tâm - Yêu thương | Hơn {services.length}+ dịch vụ
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <h3 className="font-bold text-gray-800 mb-4">DANH MỤC DỊCH VỤ</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  Tất cả dịch vụ
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {serviceIcons[category.slug] || '🐾'} {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">

            {/* Services Grid */}
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                <p className="mt-4 text-gray-600">Đang tải dịch vụ...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all overflow-hidden group"
                  >
                    {/* Service Image */}
                    <Link to={`/services/${service.id}`} className="relative block h-48 overflow-hidden">
                      {service.image ? (
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-400 to-purple-400 text-6xl">
                          {serviceIcons[service.category?.slug] || '🐾'}
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-white px-4 py-2 rounded-full font-bold text-blue-600 shadow-lg">
                        {service.price?.toLocaleString('vi-VN')}đ
                      </div>
                    </Link>

                    {/* Service Info */}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
                          {service.category?.name}
                        </span>
                        {service.duration && (
                          <span className="text-gray-500 text-xs">
                            ⏱️ {service.duration} phút
                          </span>
                        )}
                      </div>

                      <Link to={`/services/${service.id}`}>
                        <h3 className="text-lg font-bold text-gray-800 mb-2 hover:text-blue-600 transition-colors line-clamp-2 min-h-[56px]">
                          {service.name}
                        </h3>
                      </Link>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {service.description || 'Dịch vụ chăm sóc thú cưng chuyên nghiệp'}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className="text-yellow-400 text-sm" />
                        ))}
                        <span className="text-gray-500 text-sm ml-1">(5.0)</span>
                      </div>

                      <Link
                        to={`/services/${service.id}`}
                        className="block w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all"
                      >
                        Đặt lịch ngay
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && services.length === 0 && (
              <div className="text-center py-20 bg-white rounded-lg">
                <div className="text-6xl mb-4">🐾</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Chưa có dịch vụ nào
                </h3>
                <p className="text-gray-600">
                  Vui lòng quay lại sau hoặc chọn danh mục khác
                </p>
              </div>
            )}

            {/* Why Choose Us */}
            <div className="mt-12 bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
                Tại sao chọn chúng tôi?
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-5xl mb-3">👨‍⚕️</div>
                  <h3 className="font-bold text-gray-800 mb-2">Chuyên nghiệp</h3>
                  <p className="text-gray-600 text-sm">Đội ngũ có kinh nghiệm</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-3">❤️</div>
                  <h3 className="font-bold text-gray-800 mb-2">Tận tâm</h3>
                  <p className="text-gray-600 text-sm">Yêu thương từng bé</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-3">🏆</div>
                  <h3 className="font-bold text-gray-800 mb-2">Chất lượng</h3>
                  <p className="text-gray-600 text-sm">Dịch vụ 5 sao</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-3">💰</div>
                  <h3 className="font-bold text-gray-800 mb-2">Giá tốt</h3>
                  <p className="text-gray-600 text-sm">Ưu đãi hấp dẫn</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Services

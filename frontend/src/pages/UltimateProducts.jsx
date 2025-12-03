import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaFilter, FaSearch, FaStar, FaHeart, FaShoppingCart, FaThLarge, FaList, FaBalanceScale } from 'react-icons/fa'
import { productService } from '../services/productService'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../contexts/WishlistContext'
import { useCompare } from '../contexts/CompareContext'
import { toast } from 'react-toastify'

const UltimateProducts = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [priceRange, setPriceRange] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const { addToCart } = useCart()
  const { addToWishlist, isInWishlist } = useWishlist()
  const { addToCompare, isInCompare } = useCompare()

  useEffect(() => {
    fetchData()
  }, [selectedCategory, sortBy, priceRange])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData()
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const fetchData = async () => {
    try {
      setLoading(true)
      const params = {
        category_id: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: searchQuery || undefined,
        sort_by: sortBy === 'price_asc' ? 'price' : sortBy === 'price_desc' ? 'price' : 'created_at',
        sort_order: sortBy === 'price_desc' ? 'desc' : sortBy === 'price_asc' ? 'asc' : 'desc',
        per_page: 50
      }
      
      const [productsData, categoriesData] = await Promise.all([
        productService.getProducts(params),
        productService.getCategories()
      ])
      
      let filteredProducts = productsData.data || productsData
      
      // Debug: Log first product to check image
      if (filteredProducts.length > 0) {
        console.log('First 3 products images:', filteredProducts.slice(0, 3).map(p => ({
          id: p.id,
          name: p.name,
          main_image: p.main_image,
          image: p.image
        })))
      }
      
      // Filter by price range (client-side)
      if (priceRange !== 'all') {
        filteredProducts = filteredProducts.filter(product => {
          const price = parseFloat(product.sale_price || product.price)
          switch(priceRange) {
            case '0-100': return price < 100000
            case '100-200': return price >= 100000 && price < 200000
            case '200-300': return price >= 200000 && price < 300000
            case '300-500': return price >= 300000 && price < 500000
            case '500-1000': return price >= 500000 && price < 1000000
            case '1000+': return price >= 1000000
            default: return true
          }
        })
      }
      
      setProducts(filteredProducts)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Không thể tải sản phẩm')
    } finally {
      setLoading(false)
    }
  }
  
  const isNewProduct = (createdAt) => {
    const productDate = new Date(createdAt)
    const now = new Date()
    const diffDays = (now - productDate) / (1000 * 60 * 60 * 24)
    return diffDays <= 7 // Products created within 7 days are "NEW"
  }

  const handleAddToCart = (product) => {
    const success = addToCart(product)
    if (success) {
      toast.success('Đã thêm vào giỏ hàng! 🛒')
    }
  }

  const categoryIcons = {
    food: '🍖',
    toy: '🧸',
    accessory: '🎀',
    health: '💊',
    grooming: '🛁',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 3D/4D Epic Header Banner */}
      <div className="relative overflow-hidden" style={{ height: '400px' }}>
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 animate-gradient-xy"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/20 animate-float"
              style={{
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 20 + 10}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 10}s`
              }}
            />
          ))}
        </div>

        {/* Animated Paw Prints */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute text-6xl animate-bounce-slow"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 5 + 5}s`
              }}
            >
              🐾
            </div>
          ))}
        </div>

        {/* 3D Rotating Border */}
        <div className="absolute inset-0 border-8 border-white/20 animate-pulse"></div>
        
        {/* Main Content with 3D Transform */}
        <div className="container mx-auto px-4 h-full flex items-center justify-center relative z-20">
          <div className="text-center transform hover:scale-105 transition-transform duration-500">
            {/* Glowing Title */}
            <div className="relative inline-block mb-6">
              <h1 className="text-7xl font-black text-white mb-0 drop-shadow-2xl animate-pulse-slow relative z-10"
                  style={{
                    textShadow: '0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(255,255,255,0.3), 0 0 60px rgba(255,255,255,0.2)',
                    transform: 'perspective(500px) rotateX(10deg)'
                  }}>
                🐾 CỬA HÀNG SẢN PHẨM 🐾
              </h1>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 blur-3xl opacity-50 animate-pulse"></div>
            </div>

            {/* Subtitle with 3D Effect */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-4 border-2 border-white/30 shadow-2xl transform hover:scale-105 transition-all duration-300"
                 style={{ transform: 'perspective(1000px) rotateY(0deg)' }}>
              <p className="text-3xl text-white font-black mb-3 animate-bounce-subtle">
                🎉 {products.length}+ SẢN PHẨM CHẤT LƯỢNG CAO 🎉
              </p>
              <p className="text-xl text-yellow-300 font-bold">
                💰 GIÁ TỐT NHẤT THỊ TRƯỜNG - CAM KẾT CHÍNH HÃNG 100%
              </p>
            </div>

            {/* Feature Tags with Animation */}
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: '🚚', text: 'Miễn phí ship 500K+', color: 'from-blue-500 to-cyan-500' },
                { icon: '🎁', text: 'Tích điểm đổi quà', color: 'from-pink-500 to-rose-500' },
                { icon: '💯', text: 'Bảo hành 12 tháng', color: 'from-green-500 to-emerald-500' },
                { icon: '⚡', text: 'Giao hàng nhanh 2H', color: 'from-orange-500 to-red-500' }
              ].map((tag, i) => (
                <div
                  key={i}
                  className={`bg-gradient-to-r ${tag.color} px-6 py-3 rounded-full text-white font-bold shadow-lg transform hover:scale-110 hover:rotate-3 transition-all duration-300 cursor-pointer animate-slide-up`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <span className="text-2xl mr-2">{tag.icon}</span>
                  {tag.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Wave Effect */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-20">
            <path
              fill="#f9fafb"
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
              className="animate-wave"
            />
          </svg>
        </div>
      </div>

      {/* Add Custom Animations to CSS */}
      <style>{`
        @keyframes gradient-xy {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-30px) translateX(20px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes wave {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-gradient-xy { animation: gradient-xy 15s ease infinite; background-size: 400% 400%; }
        .animate-float { animation: float linear infinite; }
        .animate-bounce-slow { animation: bounce-slow ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-bounce-subtle { animation: bounce-subtle 2s ease-in-out infinite; }
        .animate-slide-up { animation: slide-up 0.6s ease-out forwards; }
        .animate-wave { animation: wave 10s linear infinite; }
      `}</style>

      {/* Animated Cute Pets */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Chó vui vẻ chạy quanh */}
        <div className="absolute bottom-10 left-0 animate-dog-walk text-7xl">🐕</div>
        <div className="absolute top-1/3 right-0 animate-cat-walk text-6xl">🐱</div>
        <div className="absolute top-20 left-20 animate-bounce-cute text-6xl">🐶</div>
        <div className="absolute bottom-32 right-32 animate-wiggle-cute text-6xl">😺</div>
        <div className="absolute top-1/2 left-1/3 animate-float-pet text-7xl">🐩</div>
        <div className="absolute bottom-1/2 right-1/4 animate-spin-pet text-6xl">😸</div>
      </div>

      <style>{`
        @keyframes dog-walk {
          0% { transform: translateX(-100px); }
          100% { transform: translateX(calc(100vw + 100px)); }
        }
        @keyframes cat-walk {
          0% { transform: translateX(100px) scaleX(-1); }
          100% { transform: translateX(calc(-100vw - 100px)) scaleX(-1); }
        }
        @keyframes bounce-cute {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-30px); }
        }
        @keyframes wiggle-cute {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }
        @keyframes float-pet {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-40px) rotate(10deg); }
        }
        @keyframes spin-pet {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.2); }
          100% { transform: rotate(360deg) scale(1); }
        }
        .animate-dog-walk { animation: dog-walk 25s linear infinite; }
        .animate-cat-walk { animation: cat-walk 20s linear infinite; }
        .animate-bounce-cute { animation: bounce-cute 2s ease-in-out infinite; }
        .animate-wiggle-cute { animation: wiggle-cute 3s ease-in-out infinite; }
        .animate-float-pet { animation: float-pet 4s ease-in-out infinite; }
        .animate-spin-pet { animation: spin-pet 6s ease-in-out infinite; }
      `}</style>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            {/* Categories */}
            <div className="bg-white rounded-xl shadow-md p-5 mb-4 border border-gray-100">
              <h3 className="font-black text-gray-800 mb-4 flex items-center gap-2 text-lg">
                <FaFilter className="text-orange-500" /> DANH MỤC
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all font-semibold ${
                    selectedCategory === 'all'
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                      : 'hover:bg-orange-50 text-gray-700 border border-gray-200'
                  }`}
                >
                  🏪 Tất cả sản phẩm
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all font-semibold ${
                      selectedCategory === cat.id
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                        : 'hover:bg-orange-50 text-gray-700 border border-gray-200'
                    }`}
                  >
                    {categoryIcons[cat.slug] || '🐾'} {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="bg-white rounded-xl shadow-md p-5 mb-4 border border-gray-100">
              <h3 className="font-black text-gray-800 mb-4 text-lg">💰 KHOẢNG GIÁ</h3>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'Tất cả', icon: '💵' },
                  { value: '0-100', label: 'Dưới 100K', icon: '💸' },
                  { value: '100-200', label: '100K - 200K', icon: '💴' },
                  { value: '200-300', label: '200K - 300K', icon: '💶' },
                  { value: '300-500', label: '300K - 500K', icon: '💷' },
                  { value: '500-1000', label: '500K - 1M', icon: '💰' },
                  { value: '1000+', label: 'Trên 1M', icon: '💎' }
                ].map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setPriceRange(range.value)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg transition-all text-sm font-semibold ${
                      priceRange === range.value
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
                        : 'hover:bg-green-50 text-gray-700 border border-gray-200'
                    }`}
                  >
                    {range.icon} {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-md p-5 mb-6 border border-gray-100">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                {/* Search */}
                <div className="flex-1 min-w-[300px]">
                  <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 text-lg" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="🔍 Tìm kiếm sản phẩm theo tên..."
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 font-medium transition-all"
                    />
                  </div>
                </div>

                {/* Sort */}
                <div className="flex items-center gap-3">
                  <span className="text-gray-700 font-semibold">Sắp xếp:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 font-semibold bg-white cursor-pointer"
                  >
                    <option value="newest">🆕 Mới nhất</option>
                    <option value="price_asc">💰 Giá thấp → cao</option>
                    <option value="price_desc">💎 Giá cao → thấp</option>
                  </select>
                </div>

                {/* View Mode */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200'}`}
                    title="Xem dạng lưới"
                  >
                    <FaThLarge />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 rounded-lg transition-all ${viewMode === 'list' ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200'}`}
                    title="Xem dạng danh sách"
                  >
                    <FaList />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block w-16 h-16 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Đang tải sản phẩm...</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-4'}>
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100"
                  >
                    {/* Image */}
                    <Link to={`/products/${product.id}`} className="relative block aspect-square overflow-hidden bg-gray-50">
                      <img
                        src={product.main_image || product.image || 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400'
                        }}
                      />
                      
                      {/* NEW Badge */}
                      {isNewProduct(product.created_at) && (
                        <div className="absolute top-2 left-2">
                          <div className="relative">
                            <img 
                              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cg%3E%3Ccircle cx='50' cy='50' r='45' fill='%23ff6b00'/%3E%3Cpath d='M50 10 L60 40 L90 40 L65 60 L75 90 L50 70 L25 90 L35 60 L10 40 L40 40 Z' fill='%23ffed00'/%3E%3C/g%3E%3C/svg%3E" 
                              alt="NEW" 
                              className="w-16 h-16"
                            />
                            <span className="absolute inset-0 flex items-center justify-center text-red-600 font-black text-xs transform -rotate-12">
                              NEW!
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* Sale Badge */}
                      {product.sale_price && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg">
                          -{Math.round((1 - product.sale_price / product.price) * 100)}%
                        </div>
                      )}
                      
                      {/* Quick Actions */}
                      <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={(e) => {
                            e.preventDefault()
                            addToWishlist(product)
                          }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md ${
                            isInWishlist(product.id)
                              ? 'bg-red-500 text-white'
                              : 'bg-white hover:bg-red-50 text-red-500'
                          }`}
                          title="Thêm vào yêu thích"
                        >
                          <FaHeart />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.preventDefault()
                            addToCompare(product)
                          }}
                          disabled={isInCompare(product.id)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md ${
                            isInCompare(product.id)
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-white hover:bg-blue-50 text-blue-500'
                          }`}
                          title="So sánh sản phẩm"
                        >
                          <FaBalanceScale />
                        </button>
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="p-3">
                      <Link to={`/products/${product.id}`}>
                        <h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-orange-500 transition-colors min-h-[40px]">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className="text-yellow-400 text-xs" />
                        ))}
                        <span className="text-gray-500 text-xs ml-1">(0)</span>
                      </div>

                      {/* Price */}
                      <div className="mb-3">
                        {product.sale_price ? (
                          <div className="flex items-baseline gap-2">
                            <p className="text-xl font-black text-red-600">
                              {parseFloat(product.sale_price).toLocaleString('vi-VN')}đ
                            </p>
                            <p className="text-sm text-gray-400 line-through">
                              {parseFloat(product.price).toLocaleString('vi-VN')}đ
                            </p>
                          </div>
                        ) : (
                          <p className="text-xl font-black text-orange-600">
                            {parseFloat(product.price).toLocaleString('vi-VN')}đ
                          </p>
                        )}
                      </div>

                      {/* Stock Status */}
                      <div className="mb-3">
                        {product.stock_quantity > 0 ? (
                          <span className="text-xs text-green-600 font-semibold">
                            ✓ Còn {product.stock_quantity} sản phẩm
                          </span>
                        ) : (
                          <span className="text-xs text-red-600 font-semibold">
                            ✗ Hết hàng
                          </span>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock_quantity === 0}
                        className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        <FaShoppingCart />
                        {product.stock_quantity > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && products.length === 0 && (
              <div className="text-center py-20 bg-white rounded-lg">
                <div className="text-6xl mb-4">🐾</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-gray-600">
                  Thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UltimateProducts

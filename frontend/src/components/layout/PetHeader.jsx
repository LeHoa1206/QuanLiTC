import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  FaSearch, FaShoppingCart, FaUser, FaBars, FaTimes, 
  FaPaw, FaCalendarAlt, FaHeart, FaBell, FaSignOutAlt 
} from 'react-icons/fa'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'

const PetHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const { getCartCount } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`)
    }
  }

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-pink-500 via-orange-500 to-pink-500 text-white py-2.5 text-center text-sm font-medium gradient-animate overflow-hidden">
        <div className="container mx-auto px-4 flex items-center justify-center gap-2">
          <span className="bounce-animation inline-block">🐾</span>
          <p>
            Chào mừng đến với Pet Management - Nơi yêu thương thú cưng của bạn!
          </p>
          <span className="bounce-animation inline-block" style={{animationDelay: '0.2s'}}>❤️</span>
        </div>
      </div>

      {/* Main Header */}
      <header 
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'backdrop-blur-xl bg-white/90 shadow-2xl shadow-pink-100' 
            : 'bg-white shadow-lg'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <FaPaw className="text-white text-2xl paw-animation" />
                </div>
              </div>
              <div className="hidden md:block">
                <h1 className="text-2xl font-bold text-gradient">
                  Pet Management
                </h1>
                <p className="text-xs text-gray-500 font-medium">Yêu thương từng bé</p>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm sản phẩm, dịch vụ cho thú cưng..."
                  className="w-full pl-12 pr-32 py-4 border-2 border-gray-200 rounded-full focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all bg-gray-50 focus:bg-white text-sm"
                />
                <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-2.5 rounded-full hover:shadow-xl hover:scale-105 transition-all font-semibold text-sm"
                >
                  Tìm kiếm
                </button>
              </div>
            </form>

            {/* Navigation Links - Desktop */}
            <nav className="hidden lg:flex items-center gap-2">
              <Link
                to="/products"
                className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-pink-500 hover:bg-pink-50 rounded-full transition-all font-medium group"
              >
                <FaShoppingCart className="group-hover:scale-110 transition-transform" />
                <span>Sản phẩm</span>
              </Link>
              <Link
                to="/services"
                className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-all font-medium group"
              >
                <FaPaw className="group-hover:scale-110 transition-transform" />
                <span>Dịch vụ</span>
              </Link>
              {isAuthenticated() && (
                <Link
                  to="/appointments"
                  className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-purple-500 hover:bg-purple-50 rounded-full transition-all font-medium group"
                >
                  <FaCalendarAlt className="group-hover:scale-110 transition-transform" />
                  <span>Lịch hẹn</span>
                </Link>
              )}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-3 hover:bg-pink-50 rounded-full transition-all group"
              >
                <FaShoppingCart className="text-gray-700 group-hover:text-pink-500 text-xl transition-colors" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-lg pulse-animation">
                    {getCartCount()}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {isAuthenticated() ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 rounded-full transition-all"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {(user?.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700">
                      {user?.name || 'User'}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-3xl shadow-2xl py-3 z-50 border border-gray-100 scale-in">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-bold text-gray-800">{user?.name}</p>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-pink-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <FaUser className="text-pink-500" />
                          <span className="text-sm font-medium">Tài khoản</span>
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <FaShoppingCart className="text-orange-500" />
                          <span className="text-sm font-medium">Đơn hàng</span>
                        </Link>
                        <Link
                          to="/appointments"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <FaCalendarAlt className="text-purple-500" />
                          <span className="text-sm font-medium">Lịch hẹn</span>
                        </Link>
                        {user?.role === 'admin' && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors border-t border-gray-100"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <span className="text-sm font-bold text-blue-600">⚡ Quản trị</span>
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            logout()
                            setShowUserMenu(false)
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600 border-t border-gray-100"
                        >
                          <FaSignOutAlt />
                          <span className="text-sm font-medium">Đăng xuất</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full hover:shadow-xl hover:scale-105 transition-all font-semibold"
                >
                  <FaUser />
                  <span className="hidden md:block">Đăng nhập</span>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-3 hover:bg-gray-50 rounded-full transition-all"
              >
                {isMenuOpen ? (
                  <FaTimes className="text-2xl text-gray-700" />
                ) : (
                  <FaBars className="text-2xl text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="lg:hidden pb-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:border-pink-400 bg-gray-50"
              />
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden fade-in-up"
              onClick={() => setIsMenuOpen(false)}
            />
            <div className="fixed top-0 right-0 h-full w-80 max-w-full bg-white shadow-2xl z-50 lg:hidden slide-in-right overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gradient">Menu</h2>
                  <button 
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <FaTimes className="text-2xl" />
                  </button>
                </div>
                <nav className="space-y-2">
                  <Link
                    to="/products"
                    className="flex items-center gap-3 px-4 py-4 hover:bg-pink-50 rounded-2xl transition-all group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaShoppingCart className="text-pink-500 text-xl group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Sản phẩm</span>
                  </Link>
                  <Link
                    to="/services"
                    className="flex items-center gap-3 px-4 py-4 hover:bg-orange-50 rounded-2xl transition-all group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaPaw className="text-orange-500 text-xl group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Dịch vụ</span>
                  </Link>
                  {isAuthenticated() && (
                    <Link
                      to="/appointments"
                      className="flex items-center gap-3 px-4 py-4 hover:bg-purple-50 rounded-2xl transition-all group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaCalendarAlt className="text-purple-500 text-xl group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Lịch hẹn</span>
                    </Link>
                  )}
                </nav>
              </div>
            </div>
          </>
        )}
      </header>
    </>
  )
}

export default PetHeader

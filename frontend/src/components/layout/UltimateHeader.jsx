import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  FaSearch, FaShoppingCart, FaUser, FaBars, FaTimes, 
  FaPaw, FaCalendarAlt, FaSignOutAlt, FaBell, FaHeart, FaBalanceScale, FaComments
} from 'react-icons/fa'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { useWishlist } from '../../contexts/WishlistContext'
import { useCompare } from '../../contexts/CompareContext'

const UltimateHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const { getCartCount } = useCart()
  const { wishlistCount } = useWishlist()
  const { compareCount } = useCompare()
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
      {/* Top Bar - Animated */}
      <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white py-3 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-center gap-3 text-sm font-semibold">
            <span className="animate-bounce">🎉</span>
            <p className="text-center">
              <span className="hidden md:inline">Chào mừng đến với Pet Management - </span>
              Giảm giá 50% cho khách hàng mới!
            </p>
            <span className="animate-bounce" style={{animationDelay: '0.2s'}}>✨</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header 
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'glass-dark shadow-2xl shadow-purple-500/20' 
            : 'bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Enhanced */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
                
                {/* Logo Container */}
                <div className="relative w-14 h-14 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <FaPaw className="text-white text-2xl animate-pulse" />
                </div>
              </div>
              
              <div className="hidden md:block">
                <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">
                  Pet Management
                </h1>
                <p className="text-xs text-gray-400 font-semibold">Yêu thương không giới hạn</p>
              </div>
            </Link>

            {/* Search Bar - Futuristic */}
            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full group">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur opacity-25 group-hover:opacity-50 transition-opacity"></div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm, dịch vụ..."
                  className="relative w-full pl-12 pr-32 py-4 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:border-purple-400 focus:bg-white/10 transition-all text-white placeholder-white/50 backdrop-blur-xl"
                />
                <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-purple-400 transition-colors" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2.5 rounded-full hover:shadow-xl hover:scale-105 transition-all font-semibold"
                >
                  Tìm
                </button>
              </div>
            </form>

            {/* Navigation - Desktop */}
            <nav className="hidden lg:flex items-center gap-2">
              <Link
                to="/products"
                className="flex items-center gap-2 px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all font-medium group"
              >
                <FaShoppingCart className="group-hover:scale-110 transition-transform" />
                <span>Sản phẩm</span>
              </Link>
              <Link
                to="/services"
                className="flex items-center gap-2 px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all font-medium group"
              >
                <FaPaw className="group-hover:scale-110 transition-transform" />
                <span>Dịch vụ</span>
              </Link>
              {isAuthenticated() && (
                <Link
                  to="/appointments"
                  className="flex items-center gap-2 px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all font-medium group"
                >
                  <FaCalendarAlt className="group-hover:scale-110 transition-transform" />
                  <span>Lịch hẹn</span>
                </Link>
              )}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative p-3 hover:bg-white/10 rounded-full transition-all group"
                title="Danh sách yêu thích"
              >
                <FaHeart className="text-white text-xl group-hover:scale-110 transition-transform" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Compare */}
              <Link
                to="/compare"
                className="relative p-3 hover:bg-white/10 rounded-full transition-all group"
                title="So sánh sản phẩm"
              >
                <FaBalanceScale className="text-white text-xl group-hover:scale-110 transition-transform" />
                {compareCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
                    {compareCount}
                  </span>
                )}
              </Link>

              {/* Cart - Enhanced */}
              <Link
                to="/cart"
                className="relative p-3 hover:bg-white/10 rounded-full transition-all group"
                title="Giỏ hàng"
              >
                <FaShoppingCart className="text-white text-xl group-hover:scale-110 transition-transform" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
                    {getCartCount()}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {isAuthenticated() ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-4 py-2.5 hover:bg-white/10 rounded-full transition-all"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white/20">
                      {(user?.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:block text-sm font-medium text-white">
                      {user?.name || 'User'}
                    </span>
                  </button>

                  {/* Dropdown */}
                  {showUserMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-64 glass-dark rounded-2xl shadow-2xl py-3 z-50 border border-white/10 scale-in">
                        <div className="px-4 py-3 border-b border-white/10">
                          <p className="font-bold text-white">{user?.name}</p>
                          <p className="text-sm text-white/60">{user?.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-white"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <FaUser className="text-pink-400" />
                          <span className="text-sm font-medium">Tài khoản</span>
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-white"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <FaShoppingCart className="text-purple-400" />
                          <span className="text-sm font-medium">Đơn hàng</span>
                        </Link>
                        <Link
                          to="/appointments"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-white"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <FaCalendarAlt className="text-blue-400" />
                          <span className="text-sm font-medium">Lịch hẹn</span>
                        </Link>
                        <Link
                          to="/chat"
                          className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-white"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <FaComments className="text-green-400" />
                          <span className="text-sm font-medium">Chat hỗ trợ</span>
                        </Link>
                        {user?.role === 'admin' && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors border-t border-white/10 text-white"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <span className="text-sm font-bold text-yellow-400">⚡ Quản trị</span>
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            logout()
                            setShowUserMenu(false)
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/20 transition-colors text-red-400 border-t border-white/10"
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
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-full hover:shadow-xl hover:scale-105 transition-all font-semibold"
                >
                  <FaUser />
                  <span className="hidden md:block">Đăng nhập</span>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-3 hover:bg-white/10 rounded-full transition-all"
              >
                {isMenuOpen ? (
                  <FaTimes className="text-2xl text-white" />
                ) : (
                  <FaBars className="text-2xl text-white" />
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
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-purple-400 backdrop-blur-xl"
              />
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
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
            <div className="fixed top-0 right-0 h-full w-80 max-w-full glass-dark shadow-2xl z-50 lg:hidden slide-in-right overflow-y-auto border-l border-white/10">
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Menu</h2>
                  <button 
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-full transition-all"
                  >
                    <FaTimes className="text-2xl text-white" />
                  </button>
                </div>
                <nav className="space-y-2">
                  <Link
                    to="/products"
                    className="flex items-center gap-3 px-4 py-4 hover:bg-white/10 rounded-2xl transition-all group text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaShoppingCart className="text-pink-400 text-xl group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Sản phẩm</span>
                  </Link>
                  <Link
                    to="/services"
                    className="flex items-center gap-3 px-4 py-4 hover:bg-white/10 rounded-2xl transition-all group text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaPaw className="text-purple-400 text-xl group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Dịch vụ</span>
                  </Link>
                  {isAuthenticated() && (
                    <Link
                      to="/appointments"
                      className="flex items-center gap-3 px-4 py-4 hover:bg-white/10 rounded-2xl transition-all group text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FaCalendarAlt className="text-blue-400 text-xl group-hover:scale-110 transition-transform" />
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

export default UltimateHeader

  import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaUsers, FaBox, FaShoppingCart, FaDollarSign, FaChartLine, FaPaw, FaCalendarAlt, FaBell } from 'react-icons/fa'
import { getDashboardStats } from '../../services/adminService'
import { notificationService } from '../../services/notificationService'

const UltimateAdminDashboard = () => {
  const [stats, setStats] = useState({
    total_revenue: 0,
    total_orders: 0,
    total_customers: 0,
    total_products: 0,
  })
  const [recentNotifications, setRecentNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    fetchRecentNotifications()
  }, [])

  const fetchStats = async () => {
    try {
      // Tạm thời dùng mock data vì backend chưa có API statistics
      // TODO: Implement backend API /admin/statistics
      const mockData = {
        total_revenue: 125000000,
        total_orders: 156,
        total_customers: 89,
        total_products: 45,
      }
      setStats(mockData)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentNotifications = async () => {
    try {
      const response = await notificationService.getRecent()
      setRecentNotifications(response.notifications || [])
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  // Format time ago
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Vừa xong'
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} giờ trước`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} ngày trước`
    
    return date.toLocaleDateString('vi-VN')
  }

  // Get notification icon and color
  const getNotificationStyle = (type) => {
    switch (type) {
      case 'order':
        return { color: 'bg-blue-500', icon: '🛒' }
      case 'appointment':
        return { color: 'bg-green-500', icon: '📅' }
      case 'message':
        return { color: 'bg-purple-500', icon: '💬' }
      case 'review':
        return { color: 'bg-yellow-500', icon: '⭐' }
      case 'system':
        return { color: 'bg-gray-500', icon: '⚙️' }
      default:
        return { color: 'bg-blue-500', icon: '🔔' }
    }
  }

  const statCards = [
    {
      title: 'Doanh Thu',
      value: `${(stats.total_revenue || 0).toLocaleString('vi-VN')}đ`,
      icon: FaDollarSign,
      gradient: 'from-green-400 to-emerald-400',
      bg: 'bg-gradient-to-br from-green-500 to-emerald-600',
      change: '+12%',
    },
    {
      title: 'Đơn Hàng',
      value: stats.total_orders || 0,
      icon: FaShoppingCart,
      gradient: 'from-blue-400 to-cyan-400',
      bg: 'bg-gradient-to-br from-blue-500 to-cyan-600',
      change: '+8%',
    },
    {
      title: 'Khách Hàng',
      value: stats.total_customers || 0,
      icon: FaUsers,
      gradient: 'from-purple-400 to-pink-400',
      bg: 'bg-gradient-to-br from-purple-500 to-pink-600',
      change: '+15%',
    },
    {
      title: 'Sản Phẩm',
      value: stats.total_products || 0,
      icon: FaBox,
      gradient: 'from-orange-400 to-red-400',
      bg: 'bg-gradient-to-br from-orange-500 to-red-600',
      change: '+5%',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      {/* Header - RÕ RÀNG HƠN */}
      <div className="mb-8">
        <h1 className="text-5xl font-black text-gray-900 mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-gray-600 text-lg font-medium">
          Quản lý hệ thống TechMart - Admin Panel
        </p>
      </div>

      {/* Stats Grid - RÕ RÀNG HƠN */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 border-gray-100"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-16 h-16 ${stat.bg} rounded-xl flex items-center justify-center shadow-lg`}>
                <stat.icon className="text-3xl text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
            <p className="text-3xl font-black text-gray-900 mb-3">{stat.value}</p>
            <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
              <FaChartLine />
              <span>{stat.change} tháng này</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions - RÕ RÀNG HƠN */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Quản lý Sản phẩm', icon: FaBox, link: '/admin/products', color: 'bg-gradient-to-br from-pink-500 to-rose-600', hover: 'hover:from-pink-600 hover:to-rose-700' },
          { title: 'Quản lý Đơn hàng', icon: FaShoppingCart, link: '/admin/orders', color: 'bg-gradient-to-br from-blue-500 to-cyan-600', hover: 'hover:from-blue-600 hover:to-cyan-700' },
          { title: 'Quản lý Users', icon: FaUsers, link: '/admin/users', color: 'bg-gradient-to-br from-purple-500 to-pink-600', hover: 'hover:from-purple-600 hover:to-pink-700' },
          { title: 'Quản lý Dịch vụ', icon: FaPaw, link: '/admin/services', color: 'bg-gradient-to-br from-orange-500 to-amber-600', hover: 'hover:from-orange-600 hover:to-amber-700' },
        ].map((action, index) => (
          <Link
            key={index}
            to={action.link}
            className={`${action.color} ${action.hover} rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group`}
          >
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all">
              <action.icon className="text-3xl text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {action.title}
            </h3>
          </Link>
        ))}
      </div>

      {/* Recent Orders & Activity - RÕ RÀNG HƠN */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <FaShoppingCart className="text-white text-lg" />
            </div>
            Đơn Hàng Gần Đây
          </h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                    #{i}
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold">Đơn hàng #ORD-2024-000{i}</p>
                    <p className="text-gray-600 text-sm">Khách hàng {i} • 10:30 AM</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-900 font-bold text-lg">{(Math.random() * 1000000).toFixed(0).toLocaleString('vi-VN')}đ</p>
                  <span className="text-xs px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-semibold">Chờ xử lý</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all shadow-lg">
            Xem tất cả đơn hàng
          </button>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 ms-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <FaCalendarAlt className="text-white text-lg" />
            </div>
            Hoạt Động Gần Đây
          </h3>
          <div className="space-y-3">
            {recentNotifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FaBell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Chưa có hoạt động nào</p>
              </div>
            ) : (
              recentNotifications.slice(0, 5).map((notification) => {
                const style = getNotificationStyle(notification.type)
                return (
                  <div key={notification.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border border-gray-200">
                    <div className={`w-3 h-3 ${style.color} rounded-full mt-1.5 animate-pulse shadow-lg`}></div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-bold">{notification.title}</p>
                      <p className="text-gray-600 text-sm line-clamp-2">{notification.content}</p>
                      <p className="text-gray-400 text-xs mt-1">{formatTimeAgo(notification.created_at)}</p>
                    </div>
                    <span className="text-lg">{style.icon}</span>
                  </div>
                )
              })
            )}
          </div>
          <Link 
            to="/notifications" 
            className="block w-full mt-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg text-center"
          >
            Xem tất cả thông báo
          </Link>
        </div>
      </div>
    </div>
  )
}

export default UltimateAdminDashboard

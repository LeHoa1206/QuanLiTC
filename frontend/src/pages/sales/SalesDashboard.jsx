import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaShoppingCart, FaUsers, FaDollarSign, FaChartLine, FaBox, FaComments, FaStar, FaArrowUp } from 'react-icons/fa'

const SalesDashboard = () => {
  const [stats] = useState({
    todayOrders: 24,
    todayRevenue: 15600000,
    totalCustomers: 156,
    pendingOrders: 8,
    monthRevenue: 125000000,
    monthOrders: 342,
    avgRating: 4.8,
    newMessages: 12
  })

  const recentOrders = [
    { id: 'ORD001', customer: 'Nguyễn Văn A', items: 3, total: 850000, status: 'pending', time: '10 phút trước' },
    { id: 'ORD002', customer: 'Trần Thị B', items: 2, total: 450000, status: 'processing', time: '25 phút trước' },
    { id: 'ORD003', customer: 'Lê Văn C', items: 5, total: 1200000, status: 'completed', time: '1 giờ trước' },
  ]

  const topProducts = [
    { name: 'Thức ăn Royal Canin', sold: 45, revenue: 12500000 },
    { name: 'Balo vận chuyển', sold: 32, revenue: 8900000 },
    { name: 'Đồ chơi cho mèo', sold: 28, revenue: 3200000 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-black mb-2">🛍️ Dashboard Bán Hàng</h1>
          <p className="text-blue-100">Quản lý đơn hàng, khách hàng và doanh thu</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Đơn hàng hôm nay</p>
                <p className="text-3xl font-black text-blue-600 mt-2">{stats.todayOrders}</p>
                <p className="text-xs text-green-600 font-semibold mt-1 flex items-center gap-1">
                  <FaArrowUp /> +12% so với hôm qua
                </p>
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <FaShoppingCart className="text-3xl text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Doanh thu hôm nay</p>
                <p className="text-3xl font-black text-green-600 mt-2">
                  {(stats.todayRevenue / 1000000).toFixed(1)}M
                </p>
                <p className="text-xs text-green-600 font-semibold mt-1 flex items-center gap-1">
                  <FaArrowUp /> +8% so với hôm qua
                </p>
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <FaDollarSign className="text-3xl text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Tổng khách hàng</p>
                <p className="text-3xl font-black text-purple-600 mt-2">{stats.totalCustomers}</p>
                <p className="text-xs text-green-600 font-semibold mt-1 flex items-center gap-1">
                  <FaArrowUp /> +5 khách mới
                </p>
              </div>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <FaUsers className="text-3xl text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Đơn chờ xử lý</p>
                <p className="text-3xl font-black text-orange-600 mt-2">{stats.pendingOrders}</p>
                <p className="text-xs text-orange-600 font-semibold mt-1">Cần xử lý ngay</p>
              </div>
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <FaBox className="text-3xl text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                  <FaShoppingCart className="text-blue-600" />
                  Đơn hàng gần đây
                </h2>
                <Link to="/sales/orders" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Xem tất cả →
                </Link>
              </div>

              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-transparent p-4 rounded-lg hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-black text-blue-600">#{order.id}</span>
                          <span className="text-gray-600">•</span>
                          <span className="font-bold text-gray-800">{order.customer}</span>
                          {order.status === 'pending' && (
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-semibold">
                              Chờ xử lý
                            </span>
                          )}
                          {order.status === 'processing' && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
                              Đang xử lý
                            </span>
                          )}
                          {order.status === 'completed' && (
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
                              Hoàn thành
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{order.items} sản phẩm</span>
                          <span>•</span>
                          <span className="font-bold text-green-600">{order.total.toLocaleString()}đ</span>
                          <span>•</span>
                          <span>{order.time}</span>
                        </div>
                      </div>
                      <Link
                        to={`/sales/orders/${order.id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
                      >
                        Chi tiết
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <Link
                  to="/sales/orders/create"
                  className="py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-center hover:shadow-lg transition-all"
                >
                  + Tạo đơn mới
                </Link>
                <Link
                  to="/sales/orders"
                  className="py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-center hover:shadow-lg transition-all"
                >
                  Quản lý đơn hàng
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Monthly Stats */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-black text-gray-800 mb-4 flex items-center gap-2">
                <FaChartLine className="text-purple-600" />
                Thống kê tháng này
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Doanh thu</p>
                  <p className="text-2xl font-black text-purple-600">
                    {(stats.monthRevenue / 1000000).toFixed(1)}M đ
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Đơn hàng</p>
                  <p className="text-2xl font-black text-blue-600">{stats.monthOrders}</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Đánh giá TB</p>
                  <p className="text-2xl font-black text-yellow-600 flex items-center gap-2">
                    <FaStar /> {stats.avgRating}
                  </p>
                </div>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-black text-gray-800 mb-4">🏆 Sản phẩm bán chạy</h3>
              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <div key={index} className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                    <p className="font-bold text-gray-800 text-sm">{product.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-600">Đã bán: {product.sold}</span>
                      <span className="text-xs font-bold text-green-600">
                        {(product.revenue / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-xl font-black mb-4">Truy cập nhanh</h3>
              <div className="space-y-3">
                <Link to="/sales/customers" className="block p-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all">
                  <div className="flex items-center gap-3">
                    <FaUsers className="text-xl" />
                    <span className="font-semibold">Quản lý khách hàng</span>
                  </div>
                </Link>
                <Link to="/sales/chat" className="block p-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FaComments className="text-xl" />
                      <span className="font-semibold">Tin nhắn</span>
                    </div>
                    {stats.newMessages > 0 && (
                      <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-bold">
                        {stats.newMessages}
                      </span>
                    )}
                  </div>
                </Link>
                <Link to="/sales/reviews" className="block p-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all">
                  <div className="flex items-center gap-3">
                    <FaStar className="text-xl" />
                    <span className="font-semibold">Đánh giá & Phản hồi</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SalesDashboard

import { useState, useEffect } from 'react'
import { FaDollarSign, FaShoppingCart, FaUsers, FaBox, FaChartLine, FaChartBar, FaArrowUp } from 'react-icons/fa'

const UltimateAdminStatistics = () => {
  const [timeRange, setTimeRange] = useState('month')

  const stats = {
    revenue: 125000000,
    orders: 1234,
    customers: 567,
    products: 89,
  }

  const revenueData = [
    { month: 'T1', value: 85000000 },
    { month: 'T2', value: 92000000 },
    { month: 'T3', value: 78000000 },
    { month: 'T4', value: 105000000 },
    { month: 'T5', value: 98000000 },
    { month: 'T6', value: 125000000 },
  ]

  const topProducts = [
    { name: 'Thức ăn cho chó Royal Canin', sold: 234, revenue: 45000000 },
    { name: 'Cát vệ sinh cho mèo', sold: 189, revenue: 28000000 },
    { name: 'Đồ chơi cho chó', sold: 156, revenue: 18000000 },
    { name: 'Sữa tắm cho thú cưng', sold: 145, revenue: 15000000 },
    { name: 'Vòng cổ cho chó', sold: 123, revenue: 12000000 },
  ]

  const maxRevenue = Math.max(...revenueData.map(d => d.value))

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-5xl font-black text-gray-900 mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Thống Kê & Báo Cáo
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            Phân tích dữ liệu kinh doanh
          </p>
        </div>
        <div className="flex gap-3">
          {['week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                timeRange === range
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
              }`}
            >
              {range === 'week' ? 'Tuần' : range === 'month' ? 'Tháng' : 'Năm'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Doanh Thu', value: `${stats.revenue.toLocaleString('vi-VN')}đ`, icon: FaDollarSign, color: 'from-green-500 to-emerald-600', change: '+15%' },
          { title: 'Đơn Hàng', value: stats.orders, icon: FaShoppingCart, color: 'from-blue-500 to-cyan-600', change: '+8%' },
          { title: 'Khách Hàng', value: stats.customers, icon: FaUsers, color: 'from-purple-500 to-pink-600', change: '+12%' },
          { title: 'Sản Phẩm', value: stats.products, icon: FaBox, color: 'from-orange-500 to-red-600', change: '+5%' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-100 hover:shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <stat.icon className="text-3xl text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
            <p className="text-3xl font-black text-gray-900 mb-3">{stat.value}</p>
            <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
              <FaArrowUp />
              <span>{stat.change} so với tháng trước</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <FaChartLine className="text-white text-lg" />
            </div>
            Biểu Đồ Doanh Thu
          </h3>
          <div className="space-y-4">
            {revenueData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-gray-900">{item.month}</span>
                  <span className="font-bold text-green-600">{item.value.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: `${(item.value / maxRevenue) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <FaChartBar className="text-white text-lg" />
            </div>
            Top Sản Phẩm Bán Chạy
          </h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border border-gray-200">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg">
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-bold line-clamp-1">{product.name}</p>
                  <p className="text-gray-600 text-sm">Đã bán: {product.sold} sản phẩm</p>
                </div>
                <div className="text-right">
                  <p className="text-orange-600 font-black text-lg">{product.revenue.toLocaleString('vi-VN')}đ</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-100">
          <h4 className="text-lg font-bold text-gray-900 mb-4">Tỷ lệ chuyển đổi</h4>
          <div className="text-center">
            <div className="text-5xl font-black text-green-600 mb-2">68%</div>
            <p className="text-gray-600">Khách hàng quay lại</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-100">
          <h4 className="text-lg font-bold text-gray-900 mb-4">Giá trị đơn TB</h4>
          <div className="text-center">
            <div className="text-5xl font-black text-blue-600 mb-2">850K</div>
            <p className="text-gray-600">Trung bình mỗi đơn</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-100">
          <h4 className="text-lg font-bold text-gray-900 mb-4">Đánh giá TB</h4>
          <div className="text-center">
            <div className="text-5xl font-black text-yellow-600 mb-2">4.8</div>
            <p className="text-gray-600">Trên 5 sao</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UltimateAdminStatistics

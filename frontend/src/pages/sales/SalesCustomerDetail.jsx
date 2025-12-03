import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaShoppingBag, FaStickyNote, FaEdit, FaSave, FaArrowLeft, FaPaw } from 'react-icons/fa'

const SalesCustomerDetail = () => {
  const { id } = useParams()
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [notes, setNotes] = useState('Khách VIP, thường mua thức ăn cao cấp. Thú cưng dị ứng với hạt hướng dương.')

  const customer = {
    id: 1,
    name: 'Nguyễn Văn A',
    phone: '0901234567',
    email: 'nguyenvana@email.com',
    address: 'Số 123, Đường ABC, Quận 1, TP.HCM',
    joinDate: '2023-06-15',
    totalOrders: 15,
    totalSpent: 12500000,
    avgOrderValue: 833333,
    lastOrder: '2024-01-10',
    pets: [
      { name: 'Miu', type: 'Mèo Anh Lông Ngắn', age: '2 tuổi', allergies: 'Hạt hướng dương' },
      { name: 'Lucky', type: 'Chó Golden', age: '3 tuổi', allergies: '' }
    ]
  }

  const orderHistory = [
    { id: 'ORD015', date: '2024-01-10', items: 3, total: 850000, status: 'completed', products: ['Thức ăn Royal Canin', 'Balo vận chuyển', 'Đồ chơi'] },
    { id: 'ORD012', date: '2024-01-05', items: 2, total: 450000, status: 'completed', products: ['Cát vệ sinh', 'Khay đựng cát'] },
    { id: 'ORD008', date: '2023-12-28', items: 5, total: 1200000, status: 'completed', products: ['Thức ăn Pedigree', 'Xương gặm', 'Dây dắt', 'Vòng cổ', 'Bát ăn'] },
    { id: 'ORD005', date: '2023-12-15', items: 1, total: 350000, status: 'returned', products: ['Balo vận chuyển'] },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-8">
        <div className="container mx-auto px-4">
          <Link to="/sales/customers" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
            <FaArrowLeft /> Quay lại danh sách
          </Link>
          <h1 className="text-4xl font-black mb-2">Chi tiết khách hàng</h1>
          <p className="text-blue-100">Thông tin chi tiết và lịch sử mua hàng</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Info */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-800">Thông tin cơ bản</h2>
                <button className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-all">
                  <FaEdit />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-3xl font-black">
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-800">{customer.name}</h3>
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs rounded-full font-bold">
                    ⭐ VIP
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <FaPhone className="text-blue-500 text-xl" />
                  <div>
                    <p className="text-xs text-gray-500">Số điện thoại</p>
                    <p className="font-bold">{customer.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <FaEnvelope className="text-purple-500 text-xl" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-bold text-sm">{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <FaMapMarkerAlt className="text-red-500 text-xl" />
                  <div>
                    <p className="text-xs text-gray-500">Địa chỉ</p>
                    <p className="font-bold text-sm">{customer.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <FaUser className="text-green-500 text-xl" />
                  <div>
                    <p className="text-xs text-gray-500">Ngày tham gia</p>
                    <p className="font-bold">{customer.joinDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-black text-gray-800 mb-4">Thống kê</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Tổng đơn hàng</p>
                  <p className="text-3xl font-black text-blue-600">{customer.totalOrders}</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Tổng chi tiêu</p>
                  <p className="text-3xl font-black text-green-600">
                    {(customer.totalSpent / 1000000).toFixed(1)}M đ
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Giá trị TB/đơn</p>
                  <p className="text-3xl font-black text-purple-600">
                    {(customer.avgOrderValue / 1000).toFixed(0)}K đ
                  </p>
                </div>
              </div>
            </div>

            {/* Pets */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-black text-gray-800 mb-4 flex items-center gap-2">
                <FaPaw className="text-pink-500" />
                Thú cưng
              </h3>
              <div className="space-y-3">
                {customer.pets.map((pet, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border-l-4 border-pink-500">
                    <h4 className="font-bold text-gray-800 mb-2">{pet.name}</h4>
                    <p className="text-sm text-gray-600">{pet.type} • {pet.age}</p>
                    {pet.allergies && (
                      <p className="text-xs text-red-600 font-semibold mt-2">⚠️ Dị ứng: {pet.allergies}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Notes */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                  <FaStickyNote className="text-yellow-500" />
                  Ghi chú khách hàng
                </h2>
                {!isEditingNotes ? (
                  <button
                    onClick={() => setIsEditingNotes(true)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all flex items-center gap-2"
                  >
                    <FaEdit /> Chỉnh sửa
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditingNotes(false)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center gap-2"
                  >
                    <FaSave /> Lưu
                  </button>
                )}
              </div>

              {isEditingNotes ? (
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  rows="5"
                  placeholder="Nhập ghi chú về khách hàng..."
                />
              ) : (
                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{notes}</p>
                </div>
              )}
            </div>

            {/* Order History */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-2">
                <FaShoppingBag className="text-blue-500" />
                Lịch sử mua hàng
              </h2>

              <div className="space-y-4">
                {orderHistory.map((order) => (
                  <div key={order.id} className="border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-transparent p-4 rounded-lg hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-black text-blue-600">#{order.id}</span>
                          <span className="text-gray-600">•</span>
                          <span className="text-gray-600">{order.date}</span>
                          {order.status === 'completed' && (
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
                              Hoàn thành
                            </span>
                          )}
                          {order.status === 'returned' && (
                            <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full font-semibold">
                              Đã trả hàng
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {order.products.map((product, index) => (
                            <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                              {product}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{order.items} sản phẩm</p>
                        <p className="text-xl font-black text-green-600">{order.total.toLocaleString()}đ</p>
                      </div>
                    </div>
                    <Link
                      to={`/sales/orders/${order.id}`}
                      className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all text-sm"
                    >
                      Xem chi tiết đơn hàng
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SalesCustomerDetail

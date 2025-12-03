import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaSearch, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaShoppingBag, FaStickyNote, FaEye, FaEdit } from 'react-icons/fa'

const SalesCustomers = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const customers = [
    { id: 1, name: 'Nguyễn Văn A', phone: '0901234567', email: 'nguyenvana@email.com', address: 'Hà Nội', totalOrders: 15, totalSpent: 12500000, lastOrder: '2024-01-10', notes: 'Khách VIP, thường mua thức ăn cao cấp', petAllergy: 'Hạt hướng dương' },
    { id: 2, name: 'Trần Thị B', phone: '0912345678', email: 'tranthib@email.com', address: 'TP.HCM', totalOrders: 8, totalSpent: 5600000, lastOrder: '2024-01-12', notes: 'Thích sản phẩm organic', petAllergy: '' },
    { id: 3, name: 'Lê Văn C', phone: '0923456789', email: 'levanc@email.com', address: 'Đà Nẵng', totalOrders: 22, totalSpent: 18900000, lastOrder: '2024-01-14', notes: 'Khách hàng thân thiết, mua hàng thường xuyên', petAllergy: 'Sữa' },
    { id: 4, name: 'Phạm Thị D', phone: '0934567890', email: 'phamthid@email.com', address: 'Hải Phòng', totalOrders: 5, totalSpent: 3200000, lastOrder: '2024-01-08', notes: '', petAllergy: '' },
  ]

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
            <FaUser />
            Quản lý khách hàng
          </h1>
          <p className="text-blue-100">Xem thông tin, lịch sử và ghi chú khách hàng</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search & Actions */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[300px] relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo tên, SĐT, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
              />
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transition-all">
              + Thêm khách hàng
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm font-semibold">Tổng khách hàng</p>
            <p className="text-3xl font-black text-blue-600 mt-2">{customers.length}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500">
            <p className="text-gray-600 text-sm font-semibold">Khách VIP</p>
            <p className="text-3xl font-black text-green-600 mt-2">
              {customers.filter(c => c.totalOrders >= 15).length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
            <p className="text-gray-600 text-sm font-semibold">Có ghi chú</p>
            <p className="text-3xl font-black text-purple-600 mt-2">
              {customers.filter(c => c.notes).length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-orange-500">
            <p className="text-gray-600 text-sm font-semibold">Có dị ứng</p>
            <p className="text-3xl font-black text-orange-600 mt-2">
              {customers.filter(c => c.petAllergy).length}
            </p>
          </div>
        </div>

        {/* Customers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCustomers.map((customer) => (
            <div key={customer.id} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-2xl font-black">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-800">{customer.name}</h3>
                    {customer.totalOrders >= 15 && (
                      <span className="inline-block px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs rounded-full font-bold">
                        ⭐ VIP
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/sales/customers/${customer.id}`}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                  >
                    <FaEye />
                  </Link>
                  <button className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-all">
                    <FaEdit />
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <FaPhone className="text-blue-500" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <FaEnvelope className="text-purple-500" />
                  <span className="text-sm">{customer.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <FaMapMarkerAlt className="text-red-500" />
                  <span>{customer.address}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-black text-blue-600">{customer.totalOrders}</p>
                  <p className="text-xs text-gray-600">Đơn hàng</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-green-600">
                    {(customer.totalSpent / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-xs text-gray-600">Tổng chi</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-700">{customer.lastOrder}</p>
                  <p className="text-xs text-gray-600">Mua gần nhất</p>
                </div>
              </div>

              {customer.notes && (
                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg mb-3">
                  <p className="text-xs font-semibold text-yellow-800 flex items-center gap-2 mb-1">
                    <FaStickyNote /> Ghi chú:
                  </p>
                  <p className="text-sm text-gray-700">{customer.notes}</p>
                </div>
              )}

              {customer.petAllergy && (
                <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded-lg">
                  <p className="text-xs font-semibold text-red-800 mb-1">⚠️ Dị ứng:</p>
                  <p className="text-sm text-gray-700">{customer.petAllergy}</p>
                </div>
              )}

              <Link
                to={`/sales/customers/${customer.id}`}
                className="mt-4 block w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-center hover:shadow-lg transition-all"
              >
                Xem chi tiết & Lịch sử
              </Link>
            </div>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-xl">
            <FaUser className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Không tìm thấy khách hàng nào</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SalesCustomers

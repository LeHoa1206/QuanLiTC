import { useState, useEffect } from 'react'
import { FaEye, FaCheck, FaTimes, FaTruck, FaShoppingCart, FaBox, FaTrash } from 'react-icons/fa'
import { toast } from 'react-toastify'
import api from '../../services/api'

const UltimateAdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [selectedOrders, setSelectedOrders] = useState([])
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [filter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = {}
      if (filter !== 'all') {
        params.status = filter
      }
      const response = await api.get('/admin/orders', { params })
      console.log('Orders response:', response.data)
      setOrders(response.data.data || response.data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Không thể tải đơn hàng')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrders(orders.map(o => o.id))
    } else {
      setSelectedOrders([])
    }
  }

  const handleSelectOne = (id) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter(oid => oid !== id))
    } else {
      setSelectedOrders([...selectedOrders, id])
    }
  }

  const handleViewDetail = async (id) => {
    try {
      const response = await api.get(`/admin/orders/${id}`)
      setSelectedOrder(response.data)
      setShowDetailModal(true)
    } catch (error) {
      toast.error('Không thể tải chi tiết đơn hàng')
    }
  }

  const handleChangeStatus = async (id, newStatus) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { status: newStatus })
      toast.success('Cập nhật trạng thái thành công!')
      fetchOrders()
    } catch (error) {
      toast.error('Cập nhật trạng thái thất bại')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa đơn hàng này?')) return

    try {
      await api.delete(`/admin/orders/${id}`)
      toast.success('Xóa đơn hàng thành công!')
      fetchOrders()
    } catch (error) {
      toast.error('Xóa đơn hàng thất bại')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedOrders.length === 0) {
      toast.warning('Vui lòng chọn đơn hàng cần xóa')
      return
    }

    if (!window.confirm(`Bạn có chắc muốn xóa ${selectedOrders.length} đơn hàng?`)) return

    try {
      await api.post('/admin/orders/bulk-delete', { ids: selectedOrders })
      toast.success(`Xóa ${selectedOrders.length} đơn hàng thành công!`)
      setSelectedOrders([])
      fetchOrders()
    } catch (error) {
      toast.error('Xóa đơn hàng thất bại')
    }
  }

  const statusConfig = {
    pending: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-700', icon: FaBox },
    confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-700', icon: FaCheck },
    processing: { label: 'Đang xử lý', color: 'bg-purple-100 text-purple-700', icon: FaTruck },
    delivered: { label: 'Hoàn thành', color: 'bg-green-100 text-green-700', icon: FaCheck },
    cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-700', icon: FaTimes },
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 mt-4 font-medium">Đang tải đơn hàng...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-5xl font-black text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Quản Lý Đơn Hàng
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            Tổng số: {orders.length} đơn hàng
          </p>
        </div>
        {selectedOrders.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-rose-700 transition-all shadow-lg flex items-center gap-2"
          >
            <FaTrash />
            Xóa {selectedOrders.length} đơn hàng
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        {[
          { value: 'all', label: 'Tất cả' },
          { value: 'pending', label: 'Chờ xử lý' },
          { value: 'confirmed', label: 'Đã xác nhận' },
          { value: 'processing', label: 'Đang xử lý' },
          { value: 'delivered', label: 'Hoàn thành' },
          { value: 'cancelled', label: 'Đã hủy' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${
              filter === tab.value
                ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <th className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === orders.length && orders.length > 0}
                    onChange={handleSelectAll}
                    className="w-5 h-5 rounded border-gray-300"
                  />
                </th>
                <th className="text-left p-4 text-gray-900 font-bold">Mã đơn</th>
                <th className="text-left p-4 text-gray-900 font-bold">Khách hàng</th>
                <th className="text-left p-4 text-gray-900 font-bold">Ngày đặt</th>
                <th className="text-left p-4 text-gray-900 font-bold">Tổng tiền</th>
                <th className="text-left p-4 text-gray-900 font-bold">Trạng thái</th>
                <th className="text-left p-4 text-gray-900 font-bold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const StatusIcon = statusConfig[order.order_status]?.icon || FaBox
                const statusInfo = statusConfig[order.order_status] || statusConfig.pending
                return (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => handleSelectOne(order.id)}
                        className="w-5 h-5 rounded border-gray-300"
                      />
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-gray-900">#{order.id}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-700 font-medium">{order.customer?.name || 'Khách vãng lai'}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-600 text-sm">{new Date(order.created_at).toLocaleString('vi-VN')}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-pink-600 font-bold text-lg">
                        {parseInt(order.total_amount || order.total || 0).toLocaleString('vi-VN')}đ
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={order.order_status}
                        onChange={(e) => handleChangeStatus(order.id, e.target.value)}
                        className={`px-4 py-2 rounded-full text-sm font-bold ${statusInfo.color} border-none outline-none cursor-pointer`}
                      >
                        <option value="pending">Chờ xử lý</option>
                        <option value="confirmed">Đã xác nhận</option>
                        <option value="processing">Đang xử lý</option>
                        <option value="delivered">Hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetail(order.id)}
                          className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all"
                          title="Xem chi tiết"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="p-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg hover:from-red-600 hover:to-rose-700 transition-all"
                          title="Xóa"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {orders.length === 0 && !loading && (
        <div className="text-center py-20">
          <FaShoppingCart className="text-8xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-xl font-medium">Không có đơn hàng nào</p>
        </div>
      )}

      {/* Modal Chi tiết */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-2xl font-black">Chi Tiết Đơn Hàng #{selectedOrder.id}</h2>
              <button onClick={() => setShowDetailModal(false)} className="text-white hover:bg-white/20 p-2 rounded-lg">
                <FaTimes size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Thông tin khách hàng */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-3">Thông tin khách hàng</h3>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div><span className="font-semibold">Tên:</span> {selectedOrder.customer?.name}</div>
                  <div><span className="font-semibold">Email:</span> {selectedOrder.customer?.email}</div>
                  <div><span className="font-semibold">SĐT:</span> {selectedOrder.phone}</div>
                  <div><span className="font-semibold">Địa chỉ:</span> {selectedOrder.shipping_address}</div>
                </div>
              </div>

              {/* Sản phẩm */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Sản phẩm</h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{item.product?.name || 'Sản phẩm'}</p>
                        <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-pink-600">{parseInt(item.price).toLocaleString('vi-VN')}đ</p>
                        <p className="text-sm text-gray-600">Tổng: {(item.price * item.quantity).toLocaleString('vi-VN')}đ</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tổng tiền */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Tổng cộng:</span>
                  <span className="text-2xl font-black text-blue-600">
                    {parseInt(selectedOrder.total_amount).toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UltimateAdminOrders

import { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash, FaEye, FaToggleOn, FaToggleOff, FaGift, FaPercent, FaDollarSign, FaShippingFast, FaCalendarAlt, FaUsers, FaChartLine } from 'react-icons/fa'
import { voucherService } from '../../services/voucherService'
import { toast } from 'react-toastify'

const AdminVouchers = () => {
  const [vouchers, setVouchers] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingVoucher, setEditingVoucher] = useState(null)
  const [selectedVouchers, setSelectedVouchers] = useState([])
  const [statistics, setStatistics] = useState({})
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    search: '',
    sort_by: 'created_at',
    sort_order: 'desc'
  })

  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    min_order_amount: '',
    max_discount_amount: '',
    usage_limit: '',
    valid_from: '',
    valid_until: '',
    status: 'active'
  })

  useEffect(() => {
    loadVouchers()
    loadStatistics()
  }, [filters])

  const loadVouchers = async () => {
    try {
      setLoading(true)
      const response = await voucherService.getVouchers(filters)
      const vouchersData = response.data || response || []
      setVouchers(vouchersData)
    } catch (error) {
      console.error('Error loading vouchers:', error)
      toast.error('Không thể tải danh sách voucher')
    } finally {
      setLoading(false)
    }
  }

  const loadStatistics = async () => {
    try {
      const data = await voucherService.getStatistics()
      setStatistics(data)
    } catch (error) {
      console.error('Error loading statistics:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingVoucher) {
        await voucherService.updateVoucher(editingVoucher.id, formData)
        toast.success('Cập nhật voucher thành công!')
      } else {
        await voucherService.createVoucher(formData)
        toast.success('Tạo voucher thành công!')
      }
      
      setShowModal(false)
      resetForm()
      loadVouchers()
      loadStatistics()
    } catch (error) {
      console.error('Error saving voucher:', error)
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra')
    }
  }

  const handleEdit = (voucher) => {
    setEditingVoucher(voucher)
    setFormData({
      code: voucher.code,
      type: voucher.type,
      value: voucher.value,
      min_order_amount: voucher.min_order_amount || '',
      max_discount_amount: voucher.max_discount_amount || '',
      usage_limit: voucher.usage_limit || '',
      valid_from: voucher.valid_from ? voucher.valid_from.split('T')[0] : '',
      valid_until: voucher.valid_until ? voucher.valid_until.split('T')[0] : '',
      status: voucher.status
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa voucher này?')) return
    
    try {
      await voucherService.deleteVoucher(id)
      toast.success('Xóa voucher thành công!')
      loadVouchers()
      loadStatistics()
    } catch (error) {
      console.error('Error deleting voucher:', error)
      toast.error(error.response?.data?.message || 'Không thể xóa voucher')
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      await voucherService.toggleVoucherStatus(id)
      toast.success('Cập nhật trạng thái thành công!')
      loadVouchers()
    } catch (error) {
      console.error('Error toggling status:', error)
      toast.error('Không thể cập nhật trạng thái')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedVouchers.length === 0) {
      toast.warning('Vui lòng chọn voucher để xóa')
      return
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa ${selectedVouchers.length} voucher?`)) return

    try {
      await voucherService.bulkDeleteVouchers(selectedVouchers)
      toast.success('Xóa voucher thành công!')
      setSelectedVouchers([])
      loadVouchers()
      loadStatistics()
    } catch (error) {
      console.error('Error bulk deleting:', error)
      toast.error('Có lỗi xảy ra khi xóa voucher')
    }
  }

  const generateCode = async () => {
    try {
      const data = await voucherService.generateCode()
      setFormData(prev => ({ ...prev, code: data.code }))
    } catch (error) {
      console.error('Error generating code:', error)
      toast.error('Không thể tạo mã voucher')
    }
  }

  const resetForm = () => {
    setFormData({
      code: '',
      type: 'percentage',
      value: '',
      min_order_amount: '',
      max_discount_amount: '',
      usage_limit: '',
      valid_from: '',
      valid_until: '',
      status: 'active'
    })
    setEditingVoucher(null)
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'percentage': return <FaPercent className="text-blue-500" />
      case 'fixed_amount': return <FaDollarSign className="text-green-500" />
      case 'free_shipping': return <FaShippingFast className="text-purple-500" />
      default: return <FaGift />
    }
  }

  const getStatusBadge = (voucher) => {
    if (voucher.is_expired) {
      return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">Hết hạn</span>
    }
    
    switch (voucher.status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Hoạt động</span>
      case 'inactive':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full">Tạm dừng</span>
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full">{voucher.status}</span>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Voucher</h1>
          <p className="text-gray-600 mt-1">Tạo và quản lý mã giảm giá</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center gap-2 font-semibold"
        >
          <FaPlus />
          Tạo Voucher
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng Voucher</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.total || 0}</p>
            </div>
            <FaGift className="text-3xl text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đang Hoạt Động</p>
              <p className="text-2xl font-bold text-green-600">{statistics.active || 0}</p>
            </div>
            <FaToggleOn className="text-3xl text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sử dụng hôm nay</p>
              <p className="text-2xl font-bold text-purple-600">{statistics.used_today || 0}</p>
            </div>
            <FaUsers className="text-3xl text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng Giảm Giá</p>
              <p className="text-2xl font-bold text-orange-600">
                {new Intl.NumberFormat('vi-VN').format(statistics.total_discount_amount || 0)}đ
              </p>
            </div>
            <FaChartLine className="text-3xl text-orange-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
            >
              <option value="">Tất cả</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Tạm dừng</option>
              <option value="expired">Hết hạn</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Loại</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
            >
              <option value="">Tất cả</option>
              <option value="percentage">Giảm %</option>
              <option value="fixed_amount">Giảm tiền</option>
              <option value="free_shipping">Miễn phí ship</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Tìm theo mã voucher..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
            />
          </div>

          <div className="flex items-end">
            {selectedVouchers.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <FaTrash />
                Xóa ({selectedVouchers.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Vouchers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedVouchers(vouchers.map(v => v.id))
                      } else {
                        setSelectedVouchers([])
                      }
                    }}
                    checked={selectedVouchers.length === vouchers.length && vouchers.length > 0}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã Voucher
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại & Giá trị
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Điều kiện
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sử dụng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời hạn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      <span className="ml-2">Đang tải...</span>
                    </div>
                  </td>
                </tr>
              ) : vouchers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    Không có voucher nào
                  </td>
                </tr>
              ) : (
                vouchers.map((voucher) => (
                  <tr key={voucher.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedVouchers.includes(voucher.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedVouchers(prev => [...prev, voucher.id])
                          } else {
                            setSelectedVouchers(prev => prev.filter(id => id !== voucher.id))
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono font-bold text-lg text-blue-600">
                        {voucher.code}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(voucher.type)}
                        <div>
                          <div className="font-semibold">{voucher.type_display}</div>
                          <div className="text-sm text-gray-600">{voucher.value_display}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {voucher.min_order_amount > 0 && (
                          <div>Đơn tối thiểu: {new Intl.NumberFormat('vi-VN').format(voucher.min_order_amount)}đ</div>
                        )}
                        {voucher.max_discount_amount && (
                          <div>Giảm tối đa: {new Intl.NumberFormat('vi-VN').format(voucher.max_discount_amount)}đ</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div>{voucher.used_count} / {voucher.usage_limit || '∞'}</div>
                        {voucher.remaining_uses !== null && (
                          <div className="text-gray-500">Còn: {voucher.remaining_uses}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div>Từ: {new Date(voucher.valid_from).toLocaleDateString('vi-VN')}</div>
                        {voucher.valid_until && (
                          <div>Đến: {new Date(voucher.valid_until).toLocaleDateString('vi-VN')}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(voucher)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(voucher)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="Chỉnh sửa"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(voucher.id)}
                          className={`p-1 ${voucher.status === 'active' ? 'text-green-600 hover:text-green-800' : 'text-gray-600 hover:text-gray-800'}`}
                          title={voucher.status === 'active' ? 'Tạm dừng' : 'Kích hoạt'}
                        >
                          {voucher.status === 'active' ? <FaToggleOn /> : <FaToggleOff />}
                        </button>
                        <button
                          onClick={() => handleDelete(voucher.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Xóa"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingVoucher ? 'Chỉnh sửa Voucher' : 'Tạo Voucher Mới'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã Voucher *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="VD: SALE20"
                      required
                    />
                    <button
                      type="button"
                      onClick={generateCode}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Tạo mã
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại Voucher *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="percentage">Giảm theo phần trăm (%)</option>
                    <option value="fixed_amount">Giảm số tiền cố định (đ)</option>
                    <option value="free_shipping">Miễn phí vận chuyển</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá trị *
                  </label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={formData.type === 'percentage' ? 'VD: 20' : 'VD: 50000'}
                    min="0"
                    max={formData.type === 'percentage' ? '100' : undefined}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.type === 'percentage' && 'Nhập số từ 0-100 (%)'}
                    {formData.type === 'fixed_amount' && 'Nhập số tiền (VNĐ)'}
                    {formData.type === 'free_shipping' && 'Nhập 0 cho miễn phí ship'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đơn hàng tối thiểu
                  </label>
                  <input
                    type="number"
                    value={formData.min_order_amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, min_order_amount: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: 100000"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giảm tối đa
                  </label>
                  <input
                    type="number"
                    value={formData.max_discount_amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_discount_amount: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: 200000"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giới hạn sử dụng
                  </label>
                  <input
                    type="number"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData(prev => ({ ...prev, usage_limit: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Để trống = không giới hạn"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="date"
                    value={formData.valid_from}
                    onChange={(e) => setFormData(prev => ({ ...prev, valid_from: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày kết thúc
                  </label>
                  <input
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) => setFormData(prev => ({ ...prev, valid_until: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Tạm dừng</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  {editingVoucher ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminVouchers
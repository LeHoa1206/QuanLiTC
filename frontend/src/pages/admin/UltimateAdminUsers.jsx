import { useState, useEffect } from 'react'
import { FaUserPlus, FaEdit, FaLock, FaUnlock, FaUsers, FaUserShield, FaUserTie, FaTrash, FaEye, FaTimes } from 'react-icons/fa'
import { toast } from 'react-toastify'
import api from '../../services/api'

const UltimateAdminUsers = () => {
  const [users, setUsers] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [selectedUsers, setSelectedUsers] = useState([])
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [filter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = {}
      if (filter !== 'all') {
        params.role = filter
      }
      const response = await api.get('/admin/users', { params })
      
      let usersData = []
      if (Array.isArray(response.data)) {
        usersData = response.data
      } else if (response.data.data && Array.isArray(response.data.data)) {
        usersData = response.data.data
      }
      
      setUsers(usersData)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Không thể tải danh sách users')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(users.map(u => u.id))
    } else {
      setSelectedUsers([])
    }
  }

  const handleSelectOne = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(uid => uid !== id))
    } else {
      setSelectedUsers([...selectedUsers, id])
    }
  }

  const handleViewDetail = async (id) => {
    try {
      const response = await api.get(`/admin/users/${id}`)
      setSelectedUser(response.data)
      setShowDetailModal(true)
    } catch (error) {
      toast.error('Không thể tải chi tiết user')
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      await api.post(`/admin/users/${id}/toggle-status`)
      toast.success('Cập nhật trạng thái thành công!')
      fetchUsers()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cập nhật trạng thái thất bại')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa user này?')) return

    try {
      await api.delete(`/admin/users/${id}`)
      toast.success('Xóa user thành công!')
      fetchUsers()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Xóa user thất bại')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) {
      toast.warning('Vui lòng chọn users cần xóa')
      return
    }

    if (!window.confirm(`Bạn có chắc muốn xóa ${selectedUsers.length} users?`)) return

    try {
      await api.post('/admin/users/bulk-delete', { ids: selectedUsers })
      toast.success(`Xóa ${selectedUsers.length} users thành công!`)
      setSelectedUsers([])
      fetchUsers()
    } catch (error) {
      toast.error('Xóa users thất bại')
    }
  }

  const roleConfig = {
    admin: { label: 'Admin', color: 'bg-red-100 text-red-700', icon: FaUserShield },
    staff: { label: 'Nhân viên', color: 'bg-blue-100 text-blue-700', icon: FaUserTie },
    sales: { label: 'Sales', color: 'bg-purple-100 text-purple-700', icon: FaUserTie },
    customer: { label: 'Khách hàng', color: 'bg-green-100 text-green-700', icon: FaUsers },
  }

  const filteredUsers = filter === 'all' ? users : users.filter(u => u.role === filter)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 mt-4 font-medium">Đang tải users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-5xl font-black text-gray-900 mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Quản Lý Users
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            Tổng số: {users.length} users
          </p>
        </div>
        <div className="flex gap-3">
          {selectedUsers.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-rose-700 transition-all shadow-lg flex items-center gap-2"
            >
              <FaTrash />
              Xóa {selectedUsers.length} users
            </button>
          )}
          <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg flex items-center gap-2">
            <FaUserPlus />
            Thêm User
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        {[
          { value: 'all', label: 'Tất cả' },
          { value: 'customer', label: 'Khách hàng' },
          { value: 'admin', label: 'Admin' },
          { value: 'staff', label: 'Nhân viên' },
          { value: 'sales', label: 'Sales' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${
              filter === tab.value
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <th className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={handleSelectAll}
                    className="w-5 h-5 rounded border-gray-300"
                  />
                </th>
                <th className="text-left p-4 text-gray-900 font-bold">ID</th>
                <th className="text-left p-4 text-gray-900 font-bold">Tên</th>
                <th className="text-left p-4 text-gray-900 font-bold">Email</th>
                <th className="text-left p-4 text-gray-900 font-bold">Số điện thoại</th>
                <th className="text-left p-4 text-gray-900 font-bold">Vai trò</th>
                <th className="text-left p-4 text-gray-900 font-bold">Trạng thái</th>
                <th className="text-left p-4 text-gray-900 font-bold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const RoleIcon = roleConfig[user.role]?.icon || FaUsers
                const roleInfo = roleConfig[user.role] || roleConfig.customer
                return (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectOne(user.id)}
                        className="w-5 h-5 rounded border-gray-300"
                      />
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-gray-900">#{user.id}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <span className="text-gray-900 font-bold">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-700 font-medium">{user.email}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-600">{user.phone || 'N/A'}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-bold ${roleInfo.color} inline-flex items-center gap-2`}>
                        <RoleIcon />
                        {roleInfo.label}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetail(user.id)}
                          className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all"
                          title="Xem chi tiết"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          className="p-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg hover:from-orange-600 hover:to-amber-700 transition-all"
                          title={user.status === 'active' ? 'Khóa' : 'Mở khóa'}
                        >
                          {user.status === 'active' ? <FaLock /> : <FaUnlock />}
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
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

      {filteredUsers.length === 0 && !loading && (
        <div className="text-center py-20">
          <FaUsers className="text-8xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-xl font-medium">Không có user nào</p>
        </div>
      )}

      {/* Modal Chi tiết */}
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-2xl font-black">Chi Tiết User #{selectedUser.id}</h2>
              <button onClick={() => setShowDetailModal(false)} className="text-white hover:bg-white/20 p-2 rounded-lg">
                <FaTimes size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h3>
                  <p className="text-gray-600">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Số điện thoại</p>
                  <p className="font-bold text-gray-900">{selectedUser.phone || 'Chưa cập nhật'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Vai trò</p>
                  <p className="font-bold text-gray-900">{roleConfig[selectedUser.role]?.label}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Trạng thái</p>
                  <p className="font-bold text-gray-900">{selectedUser.status === 'active' ? 'Hoạt động' : 'Đã khóa'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Ngày tạo</p>
                  <p className="font-bold text-gray-900">{new Date(selectedUser.created_at).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UltimateAdminUsers

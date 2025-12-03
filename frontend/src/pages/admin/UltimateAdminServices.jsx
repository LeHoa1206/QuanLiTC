import { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash, FaPaw, FaTimes } from 'react-icons/fa'
import { serviceService } from '../../services/serviceService'
import { toast } from 'react-toastify'

const UltimateAdminServices = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: '',
    description: '',
    image: '',
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const data = await serviceService.getServices()
      setServices(data.data || data)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Không thể tải dịch vụ')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa dịch vụ này?')) return

    try {
      await serviceService.deleteService(id)
      toast.success('Xóa dịch vụ thành công!')
      fetchServices()
    } catch (error) {
      toast.error('Xóa dịch vụ thất bại')
    }
  }

  const handleOpenModal = (service = null) => {
    if (service) {
      setEditingService(service)
      setFormData({
        name: service.name,
        price: service.price,
        duration: service.duration || '',
        description: service.description || '',
        image: service.image || '',
      })
    } else {
      setEditingService(null)
      setFormData({
        name: '',
        price: '',
        duration: '',
        description: '',
        image: '',
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingService(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingService) {
        await serviceService.updateService(editingService.id, formData)
        toast.success('Cập nhật dịch vụ thành công!')
      } else {
        await serviceService.createService(formData)
        toast.success('Thêm dịch vụ thành công!')
      }
      handleCloseModal()
      fetchServices()
    } catch (error) {
      toast.error(editingService ? 'Cập nhật thất bại' : 'Thêm dịch vụ thất bại')
    }
  }

  const serviceIcons = ['✂️', '🛁', '🏠', '💊', '🎓', '❤️', '🐕', '🐈']

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-5xl font-black text-gray-900 mb-2 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Quản Lý Dịch Vụ
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            Tổng số: {services.length} dịch vụ
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <FaPlus />
          Thêm Dịch Vụ
        </button>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 mt-4 font-medium">Đang tải...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div key={service.id} className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 group">
              <div className="aspect-video bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl mb-4 flex items-center justify-center text-6xl">
                {serviceIcons[index % serviceIcons.length]}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                {service.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {service.description || 'Dịch vụ chăm sóc thú cưng chuyên nghiệp'}
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-black text-orange-600">
                  {parseInt(service.price).toLocaleString('vi-VN')}đ
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                  Hoạt động
                </span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleOpenModal(service)}
                  className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all flex items-center justify-center gap-2"
                >
                  <FaEdit />
                  Sửa
                </button>
                <button 
                  onClick={() => handleDelete(service.id)}
                  className="flex-1 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold rounded-lg hover:from-red-600 hover:to-rose-700 transition-all flex items-center justify-center gap-2"
                >
                  <FaTrash />
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {services.length === 0 && !loading && (
        <div className="text-center py-20">
          <FaPaw className="text-8xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-xl font-medium">Chưa có dịch vụ nào</p>
        </div>
      )}

      {/* Modal Thêm/Sửa */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-amber-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-2xl font-black">
                {editingService ? 'Sửa Dịch Vụ' : 'Thêm Dịch Vụ Mới'}
              </h2>
              <button onClick={handleCloseModal} className="text-white hover:bg-white/20 p-2 rounded-lg">
                <FaTimes size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-900 font-bold mb-2">Tên dịch vụ *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                  placeholder="Nhập tên dịch vụ"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-900 font-bold mb-2">Giá *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-gray-900 font-bold mb-2">Thời gian (phút)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                    placeholder="60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-900 font-bold mb-2">URL Hình ảnh</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-gray-900 font-bold mb-2">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                  placeholder="Mô tả dịch vụ..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-900 font-bold rounded-xl hover:bg-gray-300 transition-all"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-amber-700 transition-all"
                >
                  {editingService ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UltimateAdminServices

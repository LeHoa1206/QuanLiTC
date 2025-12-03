import { useParams, Link } from 'react-router-dom'
import { FaCalendarAlt, FaClock, FaPaw, FaUser, FaMapMarkerAlt, FaPhone } from 'react-icons/fa'

const UltimateAppointmentDetail = () => {
  const { id } = useParams()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="glass-dark rounded-3xl p-8 border border-white/10 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-4xl font-black text-white mb-2">Chi Tiết Lịch Hẹn</h1>
                <p className="text-white/70">Mã lịch hẹn: #APT-2024-0001</p>
              </div>
              <span className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-sm font-semibold">
                Đã xác nhận
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white/70">
                  <FaCalendarAlt className="text-purple-400 text-xl" />
                  <div>
                    <p className="text-sm text-white/50">Ngày hẹn</p>
                    <p className="text-white font-semibold">15/11/2024</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-white/70">
                  <FaClock className="text-blue-400 text-xl" />
                  <div>
                    <p className="text-sm text-white/50">Giờ hẹn</p>
                    <p className="text-white font-semibold">10:00 AM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-white/70">
                  <FaPaw className="text-pink-400 text-xl" />
                  <div>
                    <p className="text-sm text-white/50">Thú cưng</p>
                    <p className="text-white font-semibold">Milu (Chó Golden)</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white/70">
                  <FaUser className="text-green-400 text-xl" />
                  <div>
                    <p className="text-sm text-white/50">Nhân viên</p>
                    <p className="text-white font-semibold">Nguyễn Văn A</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-white/70">
                  <FaMapMarkerAlt className="text-red-400 text-xl" />
                  <div>
                    <p className="text-sm text-white/50">Địa điểm</p>
                    <p className="text-white font-semibold">123 Đường ABC, Q.1</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-white/70">
                  <FaPhone className="text-orange-400 text-xl" />
                  <div>
                    <p className="text-sm text-white/50">Liên hệ</p>
                    <p className="text-white font-semibold">0123 456 789</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Service Info */}
          <div className="glass-dark rounded-3xl p-8 border border-white/10 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6">Thông Tin Dịch Vụ</h3>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center text-4xl">
                ✂️
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-white mb-2">Spa & Grooming</h4>
                <p className="text-white/70 mb-3">Dịch vụ spa và cắt tỉa lông chuyên nghiệp</p>
                <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                  350,000đ
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Link
              to="/appointments"
              className="flex-1 py-4 glass hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl text-center transition-all"
            >
              Quay lại
            </Link>
            <button className="flex-1 py-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-bold rounded-2xl transition-all">
              Hủy lịch hẹn
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UltimateAppointmentDetail

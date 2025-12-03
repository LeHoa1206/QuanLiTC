import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaStar, FaClock, FaDollarSign, FaCalendarAlt, FaCheck } from 'react-icons/fa'

const UltimateServiceDetail = () => {
  const { id } = useParams()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="glass-dark rounded-3xl overflow-hidden border border-white/10 aspect-square">
            <img
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800"
              alt="Service"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-black text-white mb-4">Dịch Vụ Spa & Grooming</h1>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-xl" />
                  ))}
                </div>
                <span className="text-white/70">(4.9 - 256 đánh giá)</span>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FaDollarSign className="text-green-400 text-2xl" />
                  <span className="text-white/70">Giá dịch vụ:</span>
                </div>
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                  350,000đ
                </span>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <FaClock className="text-blue-400" />
                <span>Thời gian: 60 phút</span>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Mô tả dịch vụ</h3>
              <p className="text-white/70 leading-relaxed">
                Dịch vụ spa và grooming chuyên nghiệp cho thú cưng của bạn. 
                Bao gồm tắm rửa, cắt tỉa lông, vệ sinh tai, cắt móng và massage thư giãn.
              </p>
            </div>

            <div className="glass rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Dịch vụ bao gồm</h3>
              <ul className="space-y-3">
                {[
                  'Tắm rửa với sản phẩm cao cấp',
                  'Cắt tỉa lông theo yêu cầu',
                  'Vệ sinh tai và cắt móng',
                  'Massage thư giãn',
                  'Kiểm tra sức khỏe cơ bản',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/70">
                    <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                      <FaCheck className="text-white text-xs" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              to="/appointments"
              className="block w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-2xl text-center hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3"
            >
              <FaCalendarAlt />
              Đặt Lịch Ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UltimateServiceDetail

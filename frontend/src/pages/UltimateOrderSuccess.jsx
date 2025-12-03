import { useLocation, Link } from 'react-router-dom'
import { FaCheckCircle, FaBox, FaHome } from 'react-icons/fa'

const UltimateOrderSuccess = () => {
  const location = useLocation()
  const order = location.state?.order

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="glass-dark rounded-3xl p-8 md:p-12 border border-white/10 text-center scale-in">
          {/* Success Icon */}
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <div className="relative w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <FaCheckCircle className="text-6xl text-white animate-bounce" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Đặt Hàng Thành Công!
          </h1>
          <p className="text-xl text-white/70 mb-8">
            Cảm ơn bạn đã tin tưởng và mua sắm tại Pet Management
          </p>

          {/* Order Info */}
          {order && (
            <div className="glass rounded-2xl p-6 mb-8 border border-white/10">
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div>
                  <p className="text-white/60 text-sm mb-1">Mã đơn hàng:</p>
                  <p className="text-white font-bold text-lg">{order.order_number}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Tổng tiền:</p>
                  <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                    {order.total_amount?.toLocaleString('vi-VN')}đ
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="glass rounded-2xl p-6 mb-8 border border-white/10 text-left">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaBox className="text-purple-400" />
              Bước tiếp theo
            </h3>
            <ul className="space-y-3">
              {[
                'Chúng tôi sẽ xác nhận đơn hàng trong vòng 24h',
                'Bạn sẽ nhận được email/SMS thông báo khi đơn hàng được xử lý',
                'Đơn hàng sẽ được giao trong 2-3 ngày làm việc',
                'Vui lòng kiểm tra kỹ sản phẩm khi nhận hàng',
              ].map((step, index) => (
                <li key={index} className="flex items-start gap-3 text-white/70">
                  <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                  {step}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/orders"
              className="flex-1 py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold rounded-2xl transition-all hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
            >
              <FaBox />
              Xem đơn hàng
            </Link>
            <Link
              to="/"
              className="flex-1 py-4 glass hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <FaHome />
              Về trang chủ
            </Link>
          </div>

          {/* Support */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-white/60 text-sm">
              Cần hỗ trợ? Liên hệ:{' '}
              <a href="tel:0123456789" className="text-purple-400 hover:text-purple-300 font-semibold">
                0123 456 789
              </a>
              {' '}hoặc{' '}
              <a href="mailto:support@petmanagement.com" className="text-purple-400 hover:text-purple-300 font-semibold">
                support@petmanagement.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UltimateOrderSuccess

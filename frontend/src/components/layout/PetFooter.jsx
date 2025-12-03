import { Link } from 'react-router-dom'
import { 
  FaFacebook, FaInstagram, FaTwitter, FaYoutube, 
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaw, FaHeart 
} from 'react-icons/fa'

const PetFooter = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl">
                <FaPaw className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Pet Management</h3>
                <p className="text-sm text-gray-400">Yêu thương từng bé</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Chúng tôi cung cấp sản phẩm chất lượng cao và dịch vụ chăm sóc thú cưng chuyên nghiệp, 
              mang đến sự hài lòng tuyệt đối cho bạn và người bạn bốn chân.
            </p>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 hover:bg-pink-500 rounded-full flex items-center justify-center transition-all hover:scale-110"
              >
                <FaFacebook className="text-lg" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 hover:bg-pink-500 rounded-full flex items-center justify-center transition-all hover:scale-110"
              >
                <FaInstagram className="text-lg" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 hover:bg-orange-500 rounded-full flex items-center justify-center transition-all hover:scale-110"
              >
                <FaTwitter className="text-lg" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 hover:bg-orange-500 rounded-full flex items-center justify-center transition-all hover:scale-110"
              >
                <FaYoutube className="text-lg" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-pink-500 to-orange-500 rounded-full"></span>
              Liên kết nhanh
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-pink-400 transition-colors flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-pink-400 transition-all"></span>
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-pink-400 transition-colors flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-pink-400 transition-all"></span>
                  Dịch vụ
                </Link>
              </li>
              <li>
                <Link to="/appointments" className="text-gray-400 hover:text-pink-400 transition-colors flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-pink-400 transition-all"></span>
                  Đặt lịch
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-pink-400 transition-colors flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-pink-400 transition-all"></span>
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-pink-400 transition-colors flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-pink-400 transition-all"></span>
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-pink-500 to-orange-500 rounded-full"></span>
              Hỗ trợ khách hàng
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-pink-400 transition-colors flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-pink-400 transition-all"></span>
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-400 hover:text-pink-400 transition-colors flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-pink-400 transition-all"></span>
                  Chính sách vận chuyển
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-400 hover:text-pink-400 transition-colors flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-pink-400 transition-all"></span>
                  Đổi trả hàng
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-pink-400 transition-colors flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-pink-400 transition-all"></span>
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-pink-400 transition-colors flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-pink-400 transition-all"></span>
                  Điều khoản sử dụng
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-pink-500 to-orange-500 rounded-full"></span>
              Liên hệ
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400">
                <FaMapMarkerAlt className="text-pink-400 mt-1 flex-shrink-0" />
                <span className="text-sm">
                  123 Đường ABC, Quận XYZ<br />
                  TP. Hồ Chí Minh, Việt Nam
                </span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FaPhone className="text-orange-400 flex-shrink-0" />
                <a href="tel:0123456789" className="text-sm hover:text-pink-400 transition-colors">
                  0123 456 789
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FaEnvelope className="text-pink-400 flex-shrink-0" />
                <a href="mailto:info@petmanagement.com" className="text-sm hover:text-pink-400 transition-colors">
                  info@petmanagement.com
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-3">Đăng ký nhận tin tức</p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm focus:outline-none focus:border-pink-400 transition-all"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full hover:shadow-xl hover:scale-105 transition-all font-semibold text-sm"
                >
                  Gửi
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Pet Management. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Made with</span>
              <FaHeart className="text-pink-500 pulse-animation" />
              <span>for pet lovers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default PetFooter

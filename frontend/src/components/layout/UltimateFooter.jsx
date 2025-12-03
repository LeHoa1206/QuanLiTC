import { Link } from 'react-router-dom'
import { 
  FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaTiktok,
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaw, FaHeart, FaArrowUp
} from 'react-icons/fa'
import { useState } from 'react'

const UltimateFooter = () => {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState('')

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    // Handle newsletter subscription
    setEmail('')
  }

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}></div>
      </div>

      {/* Decorative Gradients */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Newsletter Section */}
        <div className="glass-dark rounded-3xl p-8 md:p-12 mb-16 border border-white/10 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
                <FaPaw className="text-3xl paw-animation" />
              </div>
            </div>
            <h3 className="text-3xl md:text-4xl font-black mb-4">
              Đăng Ký Nhận Tin Tức
            </h3>
            <p className="text-white/70 mb-8 text-lg">
              Nhận thông tin về sản phẩm mới, ưu đãi đặc biệt và mẹo chăm sóc thú cưng
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn..."
                required
                className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-all backdrop-blur-xl"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full font-bold hover:shadow-2xl hover:scale-105 transition-all"
              >
                Đăng Ký Ngay
              </button>
            </form>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl">
                <FaPaw className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Pet Management</h3>
                <p className="text-sm text-white/60">Yêu thương không giới hạn</p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Nền tảng chăm sóc thú cưng hàng đầu Việt Nam với công nghệ AI, 
              dịch vụ 5 sao và sản phẩm chất lượng cao từ các thương hiệu uy tín.
            </p>
            
            {/* Social Media */}
            <div className="flex gap-3">
              {[
                { icon: FaFacebook, color: 'from-blue-500 to-blue-600', link: '#' },
                { icon: FaInstagram, color: 'from-pink-500 to-purple-600', link: '#' },
                { icon: FaTwitter, color: 'from-blue-400 to-blue-500', link: '#' },
                { icon: FaYoutube, color: 'from-red-500 to-red-600', link: '#' },
                { icon: FaTiktok, color: 'from-gray-800 to-gray-900', link: '#' },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  className={`w-11 h-11 bg-gradient-to-br ${social.color} rounded-xl flex items-center justify-center hover:scale-110 hover:shadow-xl transition-all`}
                >
                  <social.icon className="text-lg" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full"></span>
              Liên Kết Nhanh
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Sản phẩm', link: '/products' },
                { label: 'Dịch vụ', link: '/services' },
                { label: 'Đặt lịch', link: '/appointments' },
                { label: 'Về chúng tôi', link: '/about' },
                { label: 'Blog', link: '/blog' },
                { label: 'Liên hệ', link: '/contact' },
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.link}
                    className="text-white/70 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 transition-all"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full"></span>
              Hỗ Trợ Khách Hàng
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Câu hỏi thường gặp', link: '/faq' },
                { label: 'Hướng dẫn mua hàng', link: '/guide' },
                { label: 'Chính sách vận chuyển', link: '/shipping' },
                { label: 'Chính sách đổi trả', link: '/returns' },
                { label: 'Chính sách bảo mật', link: '/privacy' },
                { label: 'Điều khoản sử dụng', link: '/terms' },
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.link}
                    className="text-white/70 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 transition-all"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full"></span>
              Liên Hệ
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/70 group hover:text-white transition-colors">
                <FaMapMarkerAlt className="text-pink-400 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-sm">
                  123 Đường ABC, Quận XYZ<br />
                  TP. Hồ Chí Minh, Việt Nam
                </span>
              </li>
              <li className="flex items-center gap-3 text-white/70 group hover:text-white transition-colors">
                <FaPhone className="text-purple-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <a href="tel:0123456789" className="text-sm hover:text-purple-400 transition-colors">
                  0123 456 789
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/70 group hover:text-white transition-colors">
                <FaEnvelope className="text-blue-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <a href="mailto:info@petmanagement.com" className="text-sm hover:text-blue-400 transition-colors">
                  info@petmanagement.com
                </a>
              </li>
            </ul>

            {/* Working Hours */}
            <div className="mt-6 p-4 glass rounded-2xl border border-white/10">
              <h5 className="font-bold mb-2 text-sm">Giờ Làm Việc</h5>
              <p className="text-white/70 text-sm">
                Thứ 2 - Thứ 7: 8:00 - 20:00<br />
                Chủ nhật: 9:00 - 18:00
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/60 text-sm text-center md:text-left">
              © {currentYear} Pet Management. All rights reserved.
            </p>
            
            <div className="flex items-center gap-2 text-sm">
              <span className="text-white/60">Made with</span>
              <FaHeart className="text-pink-500 animate-pulse" />
              <span className="text-white/60">for pet lovers</span>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/privacy" className="text-white/60 hover:text-white text-sm transition-colors">
                Privacy
              </Link>
              <span className="text-white/30">•</span>
              <Link to="/terms" className="text-white/60 hover:text-white text-sm transition-colors">
                Terms
              </Link>
              <span className="text-white/30">•</span>
              <Link to="/sitemap" className="text-white/60 hover:text-white text-sm transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all z-50 group"
      >
        <FaArrowUp className="text-white text-xl group-hover:animate-bounce" />
      </button>
    </footer>
  )
}

export default UltimateFooter

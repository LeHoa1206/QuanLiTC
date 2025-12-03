Ximport { Link } from 'react-router-dom'
import { FaDog, FaCat, FaShoppingCart, FaCut, FaCalendarAlt, FaHeart } from 'react-icons/fa'

const PetHome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 float-animation">
              <div className="inline-block">
                <span className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                  🐾 Chăm sóc thú cưng chuyên nghiệp
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight">
                Yêu thương
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">
                  {' '}thú cưng{' '}
                </span>
                của bạn
              </h1>
              
              <p className="text-xl text-gray-600">
                Cung cấp sản phẩm chất lượng và dịch vụ chăm sóc tốt nhất cho những người bạn bốn chân của bạn
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-2xl transform hover:scale-105 transition-all"
                >
                  Mua sắm ngay 🛒
                </Link>
                <Link
                  to="/services"
                  className="bg-white text-gray-800 px-8 py-4 rounded-full font-semibold border-2 border-gray-200 hover:border-pink-500 hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  Đặt lịch dịch vụ 📅
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600"
                  alt="Happy Pets"
                  className="rounded-3xl shadow-2xl"
                />
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-300 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-300 rounded-full opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Dịch vụ của chúng tôi
            </h2>
            <p className="text-gray-600 text-lg">
              Mọi thứ thú cưng của bạn cần, tất cả ở một nơi
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-pink-50 to-orange-50 p-8 rounded-3xl card-hover">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6">
                <FaShoppingCart className="text-3xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Sản phẩm chất lượng
              </h3>
              <p className="text-gray-600 mb-6">
                Đồ ăn, phụ kiện, đồ chơi và nhiều hơn nữa cho thú cưng của bạn
              </p>
              <Link
                to="/products"
                className="text-pink-500 font-semibold hover:text-orange-500"
              >
                Xem sản phẩm →
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-3xl card-hover">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                <FaCut className="text-3xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Dịch vụ chăm sóc
              </h3>
              <p className="text-gray-600 mb-6">
                Cắt tỉa lông, tắm rửa, trông giữ thú cưng chuyên nghiệp
              </p>
              <Link
                to="/services"
                className="text-blue-500 font-semibold hover:text-cyan-500"
              >
                Xem dịch vụ →
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-3xl card-hover">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                <FaCalendarAlt className="text-3xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Đặt lịch dễ dàng
              </h3>
              <p className="text-gray-600 mb-6">
                Đặt lịch hẹn online nhanh chóng, tiện lợi
              </p>
              <Link
                to="/appointments"
                className="text-purple-500 font-semibold hover:text-pink-500"
              >
                Đặt lịch ngay →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Danh mục sản phẩm
            </h2>
            <p className="text-gray-600 text-lg">
              Chọn danh mục phù hợp với thú cưng của bạn
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link
              to="/products?category=food"
              className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl text-center card-hover"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                🍖
              </div>
              <h3 className="text-xl font-bold text-gray-800">Đồ ăn</h3>
            </Link>

            <Link
              to="/products?category=toy"
              className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl text-center card-hover"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                🧸
              </div>
              <h3 className="text-xl font-bold text-gray-800">Đồ chơi</h3>
            </Link>

            <Link
              to="/products?category=accessory"
              className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl text-center card-hover"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                🎀
              </div>
              <h3 className="text-xl font-bold text-gray-800">Phụ kiện</h3>
            </Link>

            <Link
              to="/products?category=health"
              className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl text-center card-hover"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                💊
              </div>
              <h3 className="text-xl font-bold text-gray-800">Sức khỏe</h3>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-pink-500 to-orange-500">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Sẵn sàng chăm sóc thú cưng của bạn?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Đăng ký ngay để nhận ưu đãi đặc biệt cho khách hàng mới
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-pink-500 px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all"
          >
            Đăng ký miễn phí 🎉
          </Link>
        </div>
      </section>
    </div>
  )
}

export default PetHome

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaShoppingCart, FaCut, FaCalendarAlt, FaArrowRight, FaPlay, FaPaw } from 'react-icons/fa'

const UltimatePetHome = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [stats, setStats] = useState({ customers: 0, pets: 0, services: 0, products: 0 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Track mouse for 3D effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Hero Images Carousel
  const heroImages = [
    'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1920&q=80',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1920&q=80',
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=1920&q=80',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1920&q=80',
  ]

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  // Animated counter
  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = {
      customers: 5000 / steps,
      pets: 10000 / steps,
      services: 50 / steps,
      products: 500 / steps,
    }

    let step = 0
    const timer = setInterval(() => {
      step++
      setStats({
        customers: Math.floor(increment.customers * step),
        pets: Math.floor(increment.pets * step),
        services: Math.floor(increment.services * step),
        products: Math.floor(increment.products * step),
      })
      if (step >= steps) clearInterval(timer)
    }, duration / steps)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* HERO SECTION - Video Background Style */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image Slider */}
        <div className="absolute inset-0">
          {heroImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={img}
                alt={`Hero ${index + 1}`}
                className="w-full h-full object-cover scale-110 animate-slow-zoom"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-purple-900/50 to-pink-900/50"></div>
            </div>
          ))}
        </div>

        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float-particle ${5 + Math.random() * 10}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            >
              <FaPaw className="text-white/20 text-xl" />
            </div>
          ))}
        </div>

        {/* 🐱 REAL CAT - Left Side - Running Animation */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <div 
            className="cat-running-container"
            style={{
              transform: `perspective(1000px) rotateY(${mousePosition.x * 0.5}deg) rotateX(${-mousePosition.y * 0.3}deg)`,
              transition: 'transform 0.3s ease-out',
            }}
          >
            {/* Real Cat Image with 3D Effects */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&q=80"
                alt="Cute Cat"
                className="cat-image-3d w-64 h-64 object-cover rounded-full"
                style={{
                  filter: 'drop-shadow(0 30px 60px rgba(255, 100, 200, 0.6)) brightness(1.1) contrast(1.1)',
                }}
              />
              
              {/* Glowing Ring */}
              <div className="absolute inset-0 rounded-full border-4 border-pink-400/50 animate-ping-slow"></div>
              <div className="absolute inset-0 rounded-full border-2 border-pink-300/70 animate-spin-slow"></div>
              
              {/* Sparkles */}
              <div className="absolute -top-4 -right-4 text-4xl animate-sparkle">✨</div>
              <div className="absolute -bottom-4 -left-4 text-3xl animate-sparkle" style={{ animationDelay: '0.5s' }}>💫</div>
              <div className="absolute top-1/2 -right-8 text-2xl animate-sparkle" style={{ animationDelay: '1s' }}>⭐</div>
              
              {/* Paw Trail */}
              <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 flex gap-6">
                {[0, 1, 2, 3].map((i) => (
                  <FaPaw 
                    key={i}
                    className="text-pink-400 text-3xl animate-paw-fade"
                    style={{ 
                      animationDelay: `${i * 0.3}s`,
                      opacity: 1 - (i * 0.2)
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 🐶 REAL DOG - Right Side - Running Animation */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <div 
            className="dog-running-container"
            style={{
              transform: `perspective(1000px) rotateY(${-mousePosition.x * 0.5}deg) rotateX(${-mousePosition.y * 0.3}deg)`,
              transition: 'transform 0.3s ease-out',
            }}
          >
            {/* Real Dog Image with 3D Effects */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80"
                alt="Happy Dog"
                className="dog-image-3d w-72 h-72 object-cover rounded-full"
                style={{
                  filter: 'drop-shadow(0 30px 60px rgba(100, 150, 255, 0.6)) brightness(1.1) contrast(1.1)',
                }}
              />
              
              {/* Glowing Ring */}
              <div className="absolute inset-0 rounded-full border-4 border-blue-400/50 animate-ping-slow" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute inset-0 rounded-full border-2 border-blue-300/70 animate-spin-slow-reverse"></div>
              
              {/* Sparkles */}
              <div className="absolute -top-4 -left-4 text-4xl animate-sparkle" style={{ animationDelay: '0.3s' }}>✨</div>
              <div className="absolute -bottom-4 -right-4 text-3xl animate-sparkle" style={{ animationDelay: '0.8s' }}>💫</div>
              <div className="absolute top-1/2 -left-8 text-2xl animate-sparkle" style={{ animationDelay: '1.3s' }}>⭐</div>
              
              {/* Paw Trail */}
              <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 flex gap-6">
                {[0, 1, 2, 3].map((i) => (
                  <FaPaw 
                    key={i}
                    className="text-blue-400 text-3xl animate-paw-fade"
                    style={{ 
                      animationDelay: `${i * 0.3 + 0.15}s`,
                      opacity: 1 - (i * 0.2)
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="space-y-8 fade-in-up">
            {/* Badge */}
            <div className="inline-block">
              <div className="glass px-8 py-3 rounded-full border border-white/20 backdrop-blur-xl">
                <span className="text-white font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Hệ thống quản lý thú cưng #1 Việt Nam
                </span>
              </div>
            </div>

            {/* Main Title */}
            <h1 className="text-6xl md:text-8xl font-black text-white leading-tight animate-title-glow">
              Yêu Thương
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 animate-gradient">
                Không Giới Hạn
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Nền tảng chăm sóc thú cưng toàn diện với công nghệ AI, 
              dịch vụ 5 sao và sản phẩm chất lượng cao
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-6 justify-center items-center">
              <Link
                to="/products"
                className="group relative px-10 py-5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full font-bold text-lg text-white overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-pink-500/50"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <FaShoppingCart className="text-2xl" />
                  Khám Phá Ngay
                  <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>

              <button className="group px-10 py-5 glass border-2 border-white/30 rounded-full font-bold text-lg text-white backdrop-blur-xl hover:bg-white/10 transition-all duration-300 flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FaPlay className="text-white ml-1" />
                </div>
                Xem Video
              </button>
            </div>

            {/* Slide Indicators */}
            <div className="flex gap-3 justify-center pt-8">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'w-12 bg-gradient-to-r from-pink-400 to-purple-400' 
                      : 'w-8 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce z-30">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* STATS SECTION - Animated Numbers */}
      <section className="relative py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: '👥', label: 'Khách hàng', value: stats.customers, suffix: '+' },
              { icon: '🐾', label: 'Thú cưng', value: stats.pets, suffix: '+' },
              { icon: '⭐', label: 'Dịch vụ', value: stats.services, suffix: '+' },
              { icon: '🛍️', label: 'Sản phẩm', value: stats.products, suffix: '+' },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center space-y-4 scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-6xl">{stat.icon}</div>
                <div className="text-5xl font-black text-white">
                  {stat.value.toLocaleString()}{stat.suffix}
                </div>
                <div className="text-gray-400 font-semibold text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* FEATURES SECTION  */}
      <section className="relative py-32 bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Dịch Vụ
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400"> Đẳng Cấp</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Trải nghiệm công nghệ tiên tiến kết hợp chăm sóc tận tâm
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaShoppingCart className="text-3xl text-white" />,
                title: 'Sản Phẩm Premium',
                desc: 'Hơn 500+ sản phẩm chất lượng cao từ các thương hiệu hàng đầu thế giới.',
                // Màu nền và gradient cho thẻ hồng
                cardBg: 'bg-gradient-to-br from-pink-900/20 via-pink-800/10 to-rose-900/20',
                gradient: 'from-pink-500 to-rose-500',
                borderColor: 'border-pink-400/40',
                textColor: 'text-pink-300',
                descColor: 'text-pink-200/90',
                btnGradient: 'from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500',
                btnShadow: 'shadow-pink-500/40',
                glowColor: 'bg-pink-500/10',
                image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80',
                circleColor: 'bg-yellow-500',
                circleBorder: 'border-yellow-300/80',
              },
              {
                icon: <FaCut className="text-3xl text-white" />,
                title: 'Spa & Grooming',
                desc: 'Dịch vụ spa 5 sao với đội ngũ chuyên gia giàu kinh nghiệm.',
                // Màu nền và gradient cho thẻ tím
                cardBg: 'bg-gradient-to-br from-purple-900/20 via-purple-800/10 to-indigo-900/20',
                gradient: 'from-purple-500 to-indigo-500',
                borderColor: 'border-purple-400/40',
                textColor: 'text-purple-300',
                descColor: 'text-purple-200/90',
                btnGradient: 'from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500',
                btnShadow: 'shadow-purple-500/40',
                glowColor: 'bg-purple-500/10',
                image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80',
                circleColor: 'bg-teal-500',
                circleBorder: 'border-teal-300/80',
              },
              {
                icon: <FaCalendarAlt className="text-3xl text-white" />,
                title: 'Đặt Lịch Thông Minh',
                desc: 'Hệ thống AI tự động sắp xếp lịch hẹn tối ưu cho bạn.',
                // Màu nền và gradient cho thẻ xanh
                cardBg: 'bg-gradient-to-br from-blue-900/20 via-blue-800/10 to-cyan-900/20',
                gradient: 'from-blue-500 to-cyan-500',
                borderColor: 'border-blue-400/40',
                textColor: 'text-blue-300',
                descColor: 'text-blue-200/90',
                btnGradient: 'from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500',
                btnShadow: 'shadow-blue-500/40',
                glowColor: 'bg-blue-500/10',
                image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
                circleColor: 'bg-orange-500',
                circleBorder: 'border-orange-300/80',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative transform transition-all duration-300 hover:scale-105"
              >
                {/* Hiệu ứng glow xung quanh thẻ */}
                <div className={`absolute -inset-3 rounded-3xl ${feature.glowColor} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300`}></div>
                
                {/* Thẻ chính - ĐÃ BO THÊM GÓC rounded-3xl và LOẠI BỎ overflow-hidden để hình tròn hiển thị đầy đủ */}
                <div className={`
                  relative ${feature.cardBg}
                  border ${feature.borderColor} rounded-3xl 
                  pt-16 pb-8 px-6 h-full 
                  transition-all duration-300 
                  group-hover:shadow-xl group-hover:shadow-current/20
                  group-hover:border-white/50
                `}>
                  
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-50">
                    <div className={`
                      w-24 h-24 rounded-full 
                      ${feature.circleColor}
                      border-4 ${feature.circleBorder}
                      flex items-center justify-center
                      shadow-2xl shadow-black/50
                      relative overflow-hidden
                      group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-current/50
                      transition-all duration-300
                    `}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-30"></div>
                      
                      <div className="relative z-10">
                        {feature.icon}
                      </div>
                      
                      <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute inset-0 rounded-full bg-white/30 blur-sm"></div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-0 overflow-hidden rounded-3xl z-0">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-80 group-hover:opacity-70 transition-opacity duration-300`}></div>
                  </div>

                  <div className="relative z-10 text-center">
                    <h3 className={`
                      text-2xl font-bold mb-4 ${feature.textColor} group-hover:text-white transition-colors duration-300
                    `}>
                      {feature.title}
                    </h3>

                    <p className={`${feature.descColor} mb-8 leading-relaxed font-medium group-hover:text-white/90 transition-colors duration-300`}>
                      {feature.desc}
                    </p>
                    <button className="self-start px-6 py-3 bg-white/20 backdrop-blur-sm  flex items-center gap-2 mx-auto rounded-full font-semibold hover:bg-white/30 transition-all flex items-center gap-2 group-hover:gap-4 text-white">
                    Tìm hiểu thêm
                    <FaArrowRight className="transition-all" />
                   </button>
                  </div>
                  
                  {/* Hiệu ứng góc sáng đơn giản */}
                  <div className="absolute top-4 left-4 w-2 h-2 bg-white/50 rounded-full opacity-0 group-hover:opacity-100"></div>
                  <div className="absolute top-4 right-4 w-2 h-2 bg-white/50 rounded-full opacity-0 group-hover:opacity-100"></div>
                </div>
                
                {/* Hiệu ứng đổ bóng khi hover */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-4/5 h-6 bg-black/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
              </div>
            ))}
          </div>

          {/* Nút xem tất cả dịch vụ */}
          <div className="text-center mt-16">
            <Link
              to="/services"
              className="group inline-flex items-center gap-3 px-10 py-4 
              bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-blue-900/40 
              border-2 border-purple-400/60 rounded-full font-bold text-lg text-white 
              hover:from-purple-900/60 hover:via-pink-900/50 hover:to-blue-900/60 
              hover:border-purple-300 hover:shadow-2xl hover:shadow-purple-500/40 
              transition-all duration-300 hover:scale-105"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300">
                Xem Tất Cả Dịch Vụ
              </span>
              <FaArrowRight className="text-sm text-purple-300 group-hover:translate-x-2 group-hover:scale-110 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA SECTION - Futuristic */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-600 via-purple-600 to-blue-600"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-10">
            <h2 className="text-5xl md:text-7xl font-black text-white leading-tight">
              Sẵn Sàng Bắt Đầu
              <br />
              Hành Trình Yêu Thương?
            </h2>
            <p className="text-2xl text-white/90">
              Đăng ký ngay để nhận ưu đãi 50% cho lần đầu sử dụng dịch vụ
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              <Link
                to="/register"
                className="px-12 py-6 bg-white text-purple-600 rounded-full font-black text-xl hover:scale-105 hover:shadow-2xl transition-all"
              >
                Đăng Ký Miễn Phí 🎉
              </Link>
              <Link
                to="/services"
                className="px-12 py-6 glass border-2 border-white/50 text-white rounded-full font-black text-xl hover:bg-white/10 transition-all backdrop-blur-xl"
              >
                Xem Dịch Vụ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Add ULTRA custom animations
const style = document.createElement('style')
style.textContent = `
  @keyframes slow-zoom {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  .animate-slow-zoom {
    animation: slow-zoom 20s ease-in-out infinite;
  }
  
  @keyframes gradient {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  .animate-gradient {
    background-size: 200% 200%;
    animation: gradient 3s ease infinite;
  }
  
  @keyframes float-particle {
    0%, 100% { 
      transform: translateY(0) translateX(0) rotate(0deg); 
      opacity: 0.2;
    }
    25% { 
      transform: translateY(-30px) translateX(20px) rotate(90deg); 
      opacity: 0.4;
    }
    50% { 
      transform: translateY(-60px) translateX(-20px) rotate(180deg); 
      opacity: 0.6;
    }
    75% { 
      transform: translateY(-30px) translateX(20px) rotate(270deg); 
      opacity: 0.4;
    }
  }
  
  /* CAT ANIMATIONS - 3D/4D/5D */
  .cat-running-container {
    animation: cat-run 8s ease-in-out infinite;
  }
  
  @keyframes cat-run {
    0% { 
      transform: translateX(-100vw) translateY(0) scale(0.8) rotateY(0deg);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    45% { 
      transform: translateX(20vw) translateY(-20px) scale(1.2) rotateY(10deg);
    }
    50% { 
      transform: translateX(25vw) translateY(0) scale(1) rotateY(0deg);
    }
    55% { 
      transform: translateX(20vw) translateY(-20px) scale(1.2) rotateY(-10deg);
    }
    90% {
      opacity: 1;
    }
    100% { 
      transform: translateX(-100vw) translateY(0) scale(0.8) rotateY(0deg);
      opacity: 0;
    }
  }
  
  .cat-image-3d {
    animation: cat-bounce 1s ease-in-out infinite;
    transform-style: preserve-3d;
  }
  
  @keyframes cat-bounce {
    0%, 100% { 
      transform: translateY(0) rotateZ(0deg) scale(1);
    }
    25% { 
      transform: translateY(-15px) rotateZ(-3deg) scale(1.05);
    }
    50% { 
      transform: translateY(0) rotateZ(0deg) scale(1);
    }
    75% { 
      transform: translateY(-10px) rotateZ(3deg) scale(1.05);
    }
  }
  
  /* DOG ANIMATIONS - 3D/4D/5D */
  .dog-running-container {
    animation: dog-run 10s ease-in-out infinite;
    animation-delay: 2s;
  }
  
  @keyframes dog-run {
    0% { 
      transform: translateX(100vw) translateY(0) scale(0.8) rotateY(0deg);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    45% { 
      transform: translateX(-20vw) translateY(-30px) scale(1.3) rotateY(-10deg);
    }
    50% { 
      transform: translateX(-25vw) translateY(0) scale(1.1) rotateY(0deg);
    }
    55% { 
      transform: translateX(-20vw) translateY(-30px) scale(1.3) rotateY(10deg);
    }
    90% {
      opacity: 1;
    }
    100% { 
      transform: translateX(100vw) translateY(0) scale(0.8) rotateY(0deg);
      opacity: 0;
    }
  }
  
  .dog-image-3d {
    animation: dog-jump 0.8s ease-in-out infinite;
    transform-style: preserve-3d;
  }
  
  @keyframes dog-jump {
    0%, 100% { 
      transform: translateY(0) rotateZ(0deg) scale(1);
    }
    30% { 
      transform: translateY(-25px) rotateZ(5deg) scale(1.1);
    }
    50% { 
      transform: translateY(0) rotateZ(0deg) scale(1);
    }
    80% { 
      transform: translateY(-15px) rotateZ(-5deg) scale(1.1);
    }
  }
  
  /* GLOWING EFFECTS */
  @keyframes ping-slow {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.3);
      opacity: 0.5;
    }
    100% {
      transform: scale(1.6);
      opacity: 0;
    }
  }
  .animate-ping-slow {
    animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
  
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .animate-spin-slow {
    animation: spin-slow 8s linear infinite;
  }
  
  @keyframes spin-slow-reverse {
    from { transform: rotate(360deg); }
    to { transform: rotate(0deg); }
  }
  .animate-spin-slow-reverse {
    animation: spin-slow-reverse 10s linear infinite;
  }
  
  /* SPARKLE EFFECTS */
  @keyframes sparkle {
    0%, 100% { 
      transform: scale(0) rotate(0deg);
      opacity: 0;
    }
    50% { 
      transform: scale(1.5) rotate(180deg);
      opacity: 1;
    }
  }
  .animate-sparkle {
    animation: sparkle 2s ease-in-out infinite;
  }
  
  /* PAW FADE */
  @keyframes paw-fade {
    0% { 
      transform: translateY(0) scale(1);
      opacity: 1;
    }
    100% { 
      transform: translateY(20px) scale(0.5);
      opacity: 0;
    }
  }
  .animate-paw-fade {
    animation: paw-fade 1.5s ease-out infinite;
  }
  
  /* TITLE GLOW */
  @keyframes title-glow {
    0%, 100% {
      text-shadow: 0 0 20px rgba(255, 255, 255, 0.5),
                   0 0 40px rgba(255, 100, 255, 0.3);
    }
    50% {
      text-shadow: 0 0 30px rgba(255, 255, 255, 0.8),
                   0 0 60px rgba(255, 100, 255, 0.6),
                   0 0 80px rgba(100, 100, 255, 0.4);
    }
  }
  .animate-title-glow {
    animation: title-glow 3s ease-in-out infinite;
  }
`
document.head.appendChild(style)

export default UltimatePetHome

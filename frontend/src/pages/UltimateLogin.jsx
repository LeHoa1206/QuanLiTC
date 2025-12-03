
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaEnvelope, FaLock, FaPaw, FaEye, FaEyeSlash, FaDog, FaCat, FaHeart, FaBone } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'
import { authService } from '../services/authService'
import { toast } from 'react-toastify'

const UltimateLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await authService.login(formData)
      login(response.user, response.token)
      toast.success(`Chào mừng ${response.user.name}! 🎉`)
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Multi-layer Animated Background */}
      <div className="absolute inset-0">
        {/* Layer 1: Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 animate-gradient-xy"></div>
        
        {/* Layer 2: Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-tl from-orange-500 via-pink-500 to-purple-500 opacity-50 animate-gradient-xy" style={{ animationDelay: '1s' }}></div>
        
        {/* Layer 3: Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.3' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {/* Layer 4: Animated Orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Pets with 3D effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white/15 animate-float-3d"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${25 + Math.random() * 45}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 12}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          >
            {[<FaDog key="dog" />, <FaCat key="cat" />, <FaPaw key="paw" />, <FaHeart key="heart" />, <FaBone key="bone" />][i % 5]}
          </div>
        ))}
      </div>

      {/* Login Card with Glass Effect */}
      <div className="relative z-10 w-full max-w-md">
        <div className="relative group">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          
          {/* Main Card */}
          <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 md:p-10 border-2 border-white/50 transform hover:scale-[1.02] transition-all duration-500">
            
            {/* Logo & Title */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-6">
                {/* Pulsing Rings */}
                <div className="absolute inset-0 rounded-full">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-ping opacity-20"></div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse opacity-30"></div>
                </div>
                
                {/* Logo */}
                <div className="relative w-28 h-28 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-2xl transform hover:rotate-12 transition-transform duration-500">
                  <div className="absolute inset-2 bg-white/20 rounded-full backdrop-blur-sm"></div>
                  <FaPaw className="relative text-white text-6xl animate-bounce drop-shadow-2xl" />
                </div>
              </div>
              
              <h1 className="text-5xl font-black mb-3">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 animate-gradient-x">
                  Chào Mừng! 🐾
                </span>
              </h1>
              <p className="text-gray-600 font-semibold text-lg">
                Đăng nhập để chăm sóc thú cưng yêu quý
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="group">
                <label className="block text-gray-700 font-bold text-sm mb-2 flex items-center gap-2">
                  <FaEnvelope className="text-purple-500" />
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                    className="w-full px-5 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:from-purple-50 focus:to-pink-50 transition-all duration-300 font-medium shadow-inner hover:shadow-lg"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-focus-within:opacity-10 transition-opacity pointer-events-none"></div>
                </div>
              </div>

              {/* Password */}
              <div className="group">
                <label className="block text-gray-700 font-bold text-sm mb-2 flex items-center gap-2">
                  <FaLock className="text-purple-500" />
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    minLength="6"
                    className="w-full px-5 py-4 pr-14 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:from-purple-50 focus:to-pink-50 transition-all duration-300 font-medium shadow-inner hover:shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-all duration-300 hover:scale-125 active:scale-95"
                  >
                    {showPassword ? 
                      <FaEyeSlash className="text-2xl" /> : 
                      <FaEye className="text-2xl" />
                    }
                  </button>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-focus-within:opacity-10 transition-opacity pointer-events-none"></div>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Quên mật khẩu? 🔑
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="relative w-full py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white font-black text-xl rounded-2xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden group"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                <span className="relative flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang đăng nhập...
                    </>
                  ) : (
                    <>
                      Đăng Nhập
                      <span className="text-2xl animate-bounce">🚀</span>
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-6 bg-white text-gray-500 font-bold text-sm">
                  Chưa có tài khoản?
                </span>
              </div>
            </div>

            {/* Register Link */}
          <Link
  to="/register"
  className="block w-full py-5 bg-white hover:bg-gray-50 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 font-black text-xl rounded-2xl text-center shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 border-4 border-purple-500 hover:border-pink-500"
>
  Đăng Ký Ngay 🎉
</Link>


            {/* Pet Decoration */}
            <div className="mt-8 flex justify-center gap-6 text-5xl">
              <span className="animate-bounce hover:scale-125 transition-transform cursor-pointer" style={{ animationDelay: '0s' }}>🐶</span>
              <span className="animate-bounce hover:scale-125 transition-transform cursor-pointer" style={{ animationDelay: '0.2s' }}>🐱</span>
              <span className="animate-bounce hover:scale-125 transition-transform cursor-pointer" style={{ animationDelay: '0.4s' }}>🐰</span>
              <span className="animate-bounce hover:scale-125 transition-transform cursor-pointer" style={{ animationDelay: '0.6s' }}>🐹</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes gradient-xy {
          0%, 100% {
            background-position: 0% 0%;
            background-size: 400% 400%;
          }
          50% {
            background-position: 100% 100%;
            background-size: 200% 200%;
          }
        }
        
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes float-3d {
          0%, 100% {
            transform: translateY(0) translateX(0) rotateZ(0deg) scale(1);
          }
          25% {
            transform: translateY(-30px) translateX(10px) rotateZ(5deg) scale(1.1);
          }
          50% {
            transform: translateY(-20px) translateX(-10px) rotateZ(-5deg) scale(0.9);
          }
          75% {
            transform: translateY(-40px) translateX(5px) rotateZ(3deg) scale(1.05);
          }
        }
        
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }
        
        @keyframes tilt {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(1deg);
          }
          75% {
            transform: rotate(-1deg);
          }
        }
        
        .animate-gradient-xy {
          animation: gradient-xy 15s ease infinite;
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
          background-size: 200% auto;
        }
        
        .animate-float-3d {
          animation: float-3d 10s ease-in-out infinite;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-tilt {
          animation: tilt 10s infinite linear;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

export default UltimateLogin
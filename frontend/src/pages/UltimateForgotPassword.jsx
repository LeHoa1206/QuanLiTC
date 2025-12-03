import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa'
import { toast } from 'react-toastify'

const UltimateForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    setTimeout(() => {
      setSent(true)
      setLoading(false)
      toast.success('Email khôi phục đã được gửi!')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="glass-dark rounded-3xl p-8 md:p-12 border border-white/10 scale-in">
          {!sent ? (
            <>
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <FaEnvelope className="text-4xl text-white" />
                </div>
                <h1 className="text-4xl font-black text-white mb-2">Quên Mật Khẩu?</h1>
                <p className="text-white/70">Nhập email để nhận link khôi phục</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-white/90 font-semibold text-sm mb-2 block">Email</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="your@email.com"
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-2xl hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50"
                >
                  {loading ? 'Đang gửi...' : 'Gửi Link Khôi Phục'}
                </button>
              </form>

              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-white/70 hover:text-white transition-colors mt-6"
              >
                <FaArrowLeft />
                Quay lại đăng nhập
              </Link>
            </>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <span className="text-4xl">✓</span>
              </div>
              <h2 className="text-3xl font-black text-white mb-4">Email Đã Gửi!</h2>
              <p className="text-white/70 mb-8">
                Vui lòng kiểm tra email của bạn để nhận link khôi phục mật khẩu
              </p>
              <Link
                to="/login"
                className="inline-block px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-full hover:shadow-xl hover:scale-105 transition-all"
              >
                Về trang đăng nhập
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UltimateForgotPassword

import React, { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'
import { toast } from 'react-toastify'
// Đổi sang thư viện mới ổn định hơn
import QRCode from 'react-qr-code'

const MomoQrModal = ({ payUrl, orderId, amount, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(600)
  const [copied, setCopied] = useState(false)

  // Đếm ngược thời gian
  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  // Format thời gian mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Copy link thanh toán
  const handleCopyLink = () => {
    navigator.clipboard.writeText(payUrl)
    setCopied(true)
    toast.success('Đã sao chép link!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all"
        >
          <FaTimes className="text-gray-600" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-black text-gray-800 mb-2">
            💳 Thanh Toán MoMo
          </h2>
          <p className="text-gray-600">Quét mã QR để thanh toán</p>
        </div>

        {/* Order Info */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Đơn hàng:</span>
            <span className="font-bold text-purple-600">#{orderId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Số tiền:</span>
            <span className="text-xl font-black text-pink-600">
              {typeof amount === 'number' ? amount.toLocaleString('vi-VN') : amount}đ
            </span>
          </div>
        </div>

        {/* QR Code Area */}
        <div className="bg-white border-2 border-purple-100 rounded-2xl p-4 flex flex-col items-center justify-center mb-6 shadow-sm">
           <div className="bg-white p-2">
             {/* Sử dụng component QRCode mới */}
             <QRCode 
                value={payUrl || ""}
                size={200}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                viewBox={`0 0 256 256`}
             />
           </div>
           <p className="text-gray-500 text-xs mt-3">
              Sử dụng App MoMo để quét mã
           </p>
        </div>

        {/* Countdown Timer */}
        {timeLeft > 0 && (
          <div className="text-center mb-4 text-sm text-orange-600 font-bold bg-orange-50 py-2 rounded-lg">
            ⏰ Hết hạn trong: {formatTime(timeLeft)}
          </div>
        )}

        {/* Buttons */}
        <div className="space-y-3">
          <a
            href={payUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 bg-[#A50064] text-white font-bold rounded-xl text-center hover:bg-[#8d0055] transition-all shadow-lg shadow-pink-200"
          >
            🔗 Mở App MoMo (Mobile)
          </a>

          <div className="flex gap-3">
            <button
                onClick={handleCopyLink}
                className={`flex-1 py-3 font-bold rounded-xl transition-all border-2 ${
                copied
                    ? 'bg-green-50 border-green-500 text-green-600'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
            >
                {copied ? '✓ Đã chép' : 'Sao chép Link'}
            </button>
            <button
                onClick={onClose}
                className="flex-1 py-3 bg-gray-200 text-gray-800 font-bold rounded-xl hover:bg-gray-300 transition-all"
            >
                Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MomoQrModal
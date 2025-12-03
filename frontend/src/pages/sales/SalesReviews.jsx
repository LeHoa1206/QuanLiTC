import { useState } from 'react'
import { FaStar, FaReply, FaThumbsUp, FaFilter, FaSearch } from 'react-icons/fa'

const SalesReviews = () => {
  const [filterRating, setFilterRating] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const reviews = [
    { id: 1, customer: 'Nguyễn Văn A', product: 'Thức ăn Royal Canin', rating: 5, comment: 'Sản phẩm rất tốt, chó nhà mình rất thích ăn!', date: '2024-01-15', replied: true, likes: 12 },
    { id: 2, customer: 'Trần Thị B', product: 'Balo vận chuyển', rating: 4, comment: 'Balo đẹp, chất lượng tốt. Nhưng hơi nhỏ với chó lớn.', date: '2024-01-14', replied: false, likes: 8 },
    { id: 3, customer: 'Lê Văn C', product: 'Cát vệ sinh', rating: 5, comment: 'Cát khử mùi rất tốt, không bụi. Sẽ mua lại!', date: '2024-01-13', replied: true, likes: 15 },
    { id: 4, customer: 'Phạm Thị D', product: 'Đồ chơi cho mèo', rating: 3, comment: 'Đồ chơi bình thường, mèo chơi được vài ngày thôi.', date: '2024-01-12', replied: false, likes: 3 },
    { id: 5, customer: 'Hoàng Văn E', product: 'Thức ăn Pedigree', rating: 2, comment: 'Chó nhà mình không thích ăn loại này lắm.', date: '2024-01-11', replied: false, likes: 1 },
  ]

  const filteredReviews = reviews.filter(review => {
    const matchesRating = filterRating === 'all' || review.rating === parseInt(filterRating)
    const matchesSearch = review.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesRating && matchesSearch
  })

  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
  const ratingCounts = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: (reviews.filter(r => r.rating === rating).length / reviews.length * 100).toFixed(0)
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 via-orange-600 to-pink-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-black mb-2">⭐ Quản lý đánh giá & phản hồi</h1>
          <p className="text-yellow-100">Xem và phản hồi đánh giá của khách hàng</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Stats */}
          <div className="space-y-6">
            {/* Overall Rating */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-black text-gray-800 mb-4">Đánh giá tổng quan</h3>
              <div className="text-center mb-6">
                <div className="text-6xl font-black text-yellow-500 mb-2">{avgRating}</div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar key={star} className="text-2xl text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600">Dựa trên {reviews.length} đánh giá</p>
              </div>

              {/* Rating Breakdown */}
              <div className="space-y-3">
                {ratingCounts.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      <span className="font-bold text-gray-700">{rating}</span>
                      <FaStar className="text-yellow-400 text-sm" />
                    </div>
                    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-400"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-black text-gray-800 mb-4">Thống kê</h3>
              <div className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Đã phản hồi</p>
                  <p className="text-2xl font-black text-green-600">
                    {reviews.filter(r => r.replied).length}
                  </p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Chờ phản hồi</p>
                  <p className="text-2xl font-black text-orange-600">
                    {reviews.filter(r => !r.replied).length}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Tổng lượt thích</p>
                  <p className="text-2xl font-black text-blue-600">
                    {reviews.reduce((sum, r) => sum + r.likes, 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Reviews */}
          <div className="lg:col-span-3 space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm đánh giá..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none"
                  />
                </div>
                <div className="relative">
                  <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none appearance-none bg-white"
                  >
                    <option value="all">Tất cả đánh giá</option>
                    <option value="5">5 sao</option>
                    <option value="4">4 sao</option>
                    <option value="3">3 sao</option>
                    <option value="2">2 sao</option>
                    <option value="1">1 sao</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white text-xl font-black">
                        {review.customer.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{review.customer}</h3>
                        <p className="text-sm text-gray-600">{review.product}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={`${
                              star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">{review.date}</p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all">
                        <FaThumbsUp />
                        <span className="text-sm font-semibold">{review.likes} thích</span>
                      </button>
                      {review.replied ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-semibold">
                          ✓ Đã phản hồi
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full font-semibold">
                          Chờ phản hồi
                        </span>
                      )}
                    </div>
                    {!review.replied && (
                      <button className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2">
                        <FaReply />
                        Phản hồi
                      </button>
                    )}
                  </div>

                  {review.replied && (
                    <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                      <p className="text-sm font-semibold text-blue-800 mb-2">Phản hồi của shop:</p>
                      <p className="text-gray-700">Cảm ơn bạn đã tin tưởng và sử dụng sản phẩm của shop! ❤️</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredReviews.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl shadow-xl">
                <FaStar className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Không tìm thấy đánh giá nào</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SalesReviews

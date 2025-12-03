import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const WishlistContext = createContext()

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider')
  }
  return context
}

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([])

  // Load wishlist from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('wishlist')
    if (saved) {
      setWishlist(JSON.parse(saved))
    }
  }, [])

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const addToWishlist = (product) => {
    if (wishlist.find(item => item.id === product.id)) {
      toast.info('Sản phẩm đã có trong danh sách yêu thích! 💝')
      return
    }
    setWishlist([...wishlist, product])
    toast.success('Đã thêm vào danh sách yêu thích! ❤️')
  }

  const removeFromWishlist = (productId) => {
    setWishlist(wishlist.filter(item => item.id !== productId))
    toast.success('Đã xóa khỏi danh sách yêu thích! 💔')
  }

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId)
  }

  const clearWishlist = () => {
    setWishlist([])
    toast.success('Đã xóa toàn bộ danh sách yêu thích!')
  }

  return (
    <WishlistContext.Provider value={{
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
      wishlistCount: wishlist.length
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

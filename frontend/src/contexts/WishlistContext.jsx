import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from './AuthContext'

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
  const { user } = useAuth()

  // Get storage key based on user
  const getStorageKey = () => {
    return user ? `wishlist_user_${user.id}` : 'wishlist_guest'
  }

  // Load wishlist from localStorage when user changes
  useEffect(() => {
    const storageKey = getStorageKey()
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      setWishlist(JSON.parse(saved))
    } else {
      setWishlist([]) // Clear wishlist if no data for this user
    }
  }, [user])

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    const storageKey = getStorageKey()
    localStorage.setItem(storageKey, JSON.stringify(wishlist))
  }, [wishlist, user])

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
    // Also clear from localStorage
    const storageKey = getStorageKey()
    localStorage.removeItem(storageKey)
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

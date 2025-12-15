// Utility functions for localStorage management

export const cleanupUserData = (userId) => {
  if (!userId) return
  
  const keysToRemove = [
    `cart_items_user_${userId}`,
    `wishlist_user_${userId}`,
    `compareList_user_${userId}`,
  ]
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key)
  })
}

export const cleanupGuestData = () => {
  const keysToRemove = [
    'cart_items',
    'wishlist_guest',
    'compareList_guest',
  ]
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key)
  })
}

export const cleanupAllUserData = () => {
  // Get all localStorage keys
  const keys = Object.keys(localStorage)
  
  // Remove all user-specific data
  keys.forEach(key => {
    if (key.includes('_user_') || key.includes('_guest')) {
      localStorage.removeItem(key)
    }
  })
}

export const migrateGuestDataToUser = (userId) => {
  if (!userId) return
  
  // Migrate guest cart to user cart
  const guestCart = localStorage.getItem('cart_items')
  if (guestCart) {
    localStorage.setItem(`cart_items_user_${userId}`, guestCart)
    localStorage.removeItem('cart_items')
  }
  
  // Migrate guest wishlist to user wishlist
  const guestWishlist = localStorage.getItem('wishlist_guest')
  if (guestWishlist) {
    localStorage.setItem(`wishlist_user_${userId}`, guestWishlist)
    localStorage.removeItem('wishlist_guest')
  }
  
  // Migrate guest compare list to user compare list
  const guestCompare = localStorage.getItem('compareList_guest')
  if (guestCompare) {
    localStorage.setItem(`compareList_user_${userId}`, guestCompare)
    localStorage.removeItem('compareList_guest')
  }
}
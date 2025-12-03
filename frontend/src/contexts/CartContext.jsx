import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { STORAGE_KEYS, TOAST_MESSAGES } from '../utils/constants'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Get cart key based on user (different cart for each user)
  const getCartKey = () => {
    if (user && user.id) {
      return `${STORAGE_KEYS.CART}_user_${user.id}`
    }
    return null // No guest cart allowed
  }

  useEffect(() => {
    // Load cart from localStorage when user changes
    if (!user) {
      // Không có user = giỏ hàng trống
      setCartItems([])
      setIsLoaded(true)
      return
    }

    const cartKey = getCartKey()
    if (!cartKey) {
      setCartItems([])
      setIsLoaded(true)
      return
    }

    const storedCart = localStorage.getItem(cartKey)
    
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart))
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
        localStorage.removeItem(cartKey)
        setCartItems([])
      }
    } else {
      setCartItems([])
    }
    setIsLoaded(true)
  }, [user]) // Reload cart when user changes

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    if (isLoaded && user) {
      const cartKey = getCartKey()
      if (cartKey) {
        localStorage.setItem(cartKey, JSON.stringify(cartItems))
      }
    }
  }, [cartItems, isLoaded, user])

  const addToCart = (product, quantity = 1, selectedSize = null, selectedColor = null) => {
    // Kiểm tra đăng nhập
    if (!user) {
      toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!')
      return false
    }

    const existingItemIndex = cartItems.findIndex(
      (item) =>
        item.id === product.id &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    )

    if (existingItemIndex !== -1) {
      // Update quantity if item already exists
      const newCart = [...cartItems]
      newCart[existingItemIndex].quantity += quantity
      setCartItems(newCart)
    } else {
      // Add new item
      setCartItems([
        ...cartItems,
        {
          ...product,
          quantity,
          selectedSize,
          selectedColor,
          addedAt: new Date().toISOString(),
        },
      ])
    }
    
    return true
  }

  const removeFromCart = (productId, selectedSize = null, selectedColor = null) => {
    setCartItems(
      cartItems.filter(
        (item) =>
          !(
            item.id === productId &&
            item.selectedSize === selectedSize &&
            item.selectedColor === selectedColor
          )
      )
    )
    toast.info(TOAST_MESSAGES.REMOVE_FROM_CART)
  }

  const updateQuantity = (productId, quantity, selectedSize = null, selectedColor = null) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize, selectedColor)
      return
    }

    setCartItems(
      cartItems.map((item) =>
        item.id === productId &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
    if (user) {
      const cartKey = getCartKey()
      if (cartKey) {
        localStorage.removeItem(cartKey)
      }
    }
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.sale_price || item.salePrice || item.price
      return total + price * item.quantity
    }, 0)
  }

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  const value = {
    cart: cartItems, // Alias for compatibility
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}


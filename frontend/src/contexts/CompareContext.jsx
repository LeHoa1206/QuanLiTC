import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from './AuthContext'

const CompareContext = createContext()

export const useCompare = () => {
  const context = useContext(CompareContext)
  if (!context) {
    throw new Error('useCompare must be used within CompareProvider')
  }
  return context
}

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([])
  const MAX_COMPARE = 4 // Tối đa 4 sản phẩm để so sánh
  const { user } = useAuth()

  // Get storage key based on user
  const getStorageKey = () => {
    return user ? `compareList_user_${user.id}` : 'compareList_guest'
  }

  // Load from localStorage when user changes
  useEffect(() => {
    const storageKey = getStorageKey()
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      setCompareList(JSON.parse(saved))
    } else {
      setCompareList([]) // Clear compare list if no data for this user
    }
  }, [user])

  // Save to localStorage
  useEffect(() => {
    const storageKey = getStorageKey()
    localStorage.setItem(storageKey, JSON.stringify(compareList))
  }, [compareList, user])

  const addToCompare = (product) => {
    if (compareList.find(item => item.id === product.id)) {
      toast.info('Sản phẩm đã có trong danh sách so sánh! 📊')
      return
    }
    
    if (compareList.length >= MAX_COMPARE) {
      toast.warning(`Chỉ có thể so sánh tối đa ${MAX_COMPARE} sản phẩm! ⚠️`)
      return
    }
    
    setCompareList([...compareList, product])
    toast.success('Đã thêm vào danh sách so sánh! 📊')
  }

  const removeFromCompare = (productId) => {
    setCompareList(compareList.filter(item => item.id !== productId))
    toast.success('Đã xóa khỏi danh sách so sánh!')
  }

  const isInCompare = (productId) => {
    return compareList.some(item => item.id === productId)
  }

  const clearCompare = () => {
    setCompareList([])
    // Also clear from localStorage
    const storageKey = getStorageKey()
    localStorage.removeItem(storageKey)
    toast.success('Đã xóa toàn bộ danh sách so sánh!')
  }

  return (
    <CompareContext.Provider value={{
      compareList,
      addToCompare,
      removeFromCompare,
      isInCompare,
      clearCompare,
      compareCount: compareList.length,
      maxCompare: MAX_COMPARE
    }}>
      {children}
    </CompareContext.Provider>
  )
}

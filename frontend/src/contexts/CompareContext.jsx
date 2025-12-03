import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'

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

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('compareList')
    if (saved) {
      setCompareList(JSON.parse(saved))
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('compareList', JSON.stringify(compareList))
  }, [compareList])

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

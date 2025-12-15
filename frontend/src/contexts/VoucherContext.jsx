import { createContext, useContext, useState, useEffect } from 'react'
import { STORAGE_KEYS } from '../utils/constants'

const VoucherContext = createContext(null)

export const useVoucher = () => {
  const context = useContext(VoucherContext)
  if (!context) {
    throw new Error('useVoucher must be used within VoucherProvider')
  }
  return context
}

export const VoucherProvider = ({ children }) => {
  const [appliedVoucher, setAppliedVoucher] = useState(null)
  const [discount, setDiscount] = useState(0)

  // Load voucher from localStorage on mount
  useEffect(() => {
    const savedVoucher = localStorage.getItem(STORAGE_KEYS.APPLIED_VOUCHER)
    const savedDiscount = localStorage.getItem(STORAGE_KEYS.VOUCHER_DISCOUNT)
    
    if (savedVoucher) {
      try {
        setAppliedVoucher(JSON.parse(savedVoucher))
        setDiscount(parseFloat(savedDiscount) || 0)
      } catch (error) {
        console.error('Error parsing saved voucher:', error)
        localStorage.removeItem(STORAGE_KEYS.APPLIED_VOUCHER)
        localStorage.removeItem(STORAGE_KEYS.VOUCHER_DISCOUNT)
      }
    }
  }, [])

  // Calculate discount based on voucher type
  const calculateDiscount = (voucher, orderAmount) => {
    if (!voucher) return 0
    
    let discountAmount = 0
    switch (voucher.type) {
      case 'percentage':
        discountAmount = orderAmount * (voucher.value / 100)
        break
      case 'fixed_amount':
        discountAmount = voucher.value
        break
      case 'free_shipping':
        return 0 // Free shipping discount is handled separately
      default:
        return 0
    }
    
    // Apply max discount limit
    if (voucher.max_discount_amount && discountAmount > voucher.max_discount_amount) {
      discountAmount = voucher.max_discount_amount
    }
    
    return discountAmount
  }

  const applyVoucher = (voucher, orderAmount) => {
    const discountAmount = calculateDiscount(voucher, orderAmount)
    
    setAppliedVoucher(voucher)
    setDiscount(discountAmount)
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEYS.APPLIED_VOUCHER, JSON.stringify(voucher))
    localStorage.setItem(STORAGE_KEYS.VOUCHER_DISCOUNT, discountAmount.toString())
    
    return discountAmount
  }

  const removeVoucher = () => {
    setAppliedVoucher(null)
    setDiscount(0)
    
    // Remove from localStorage
    localStorage.removeItem(STORAGE_KEYS.APPLIED_VOUCHER)
    localStorage.removeItem(STORAGE_KEYS.VOUCHER_DISCOUNT)
  }

  const updateDiscount = (orderAmount) => {
    if (appliedVoucher) {
      const newDiscount = calculateDiscount(appliedVoucher, orderAmount)
      setDiscount(newDiscount)
      localStorage.setItem(STORAGE_KEYS.VOUCHER_DISCOUNT, newDiscount.toString())
      return newDiscount
    }
    return 0
  }

  const value = {
    appliedVoucher,
    discount,
    applyVoucher,
    removeVoucher,
    updateDiscount,
    calculateDiscount,
    hasVoucher: !!appliedVoucher,
    isFreeShipping: appliedVoucher?.type === 'free_shipping'
  }

  return (
    <VoucherContext.Provider value={value}>
      {children}
    </VoucherContext.Provider>
  )
}
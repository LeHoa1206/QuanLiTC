// API Base URL - Laravel Backend
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Routes - Pet Management System
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  ORDERS: '/orders',
  SERVICES: '/services',
  SERVICE_DETAIL: '/services/:id',
  APPOINTMENTS: '/appointments',
  PETS: '/pets',
  
  // Admin
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_SERVICES: '/admin/services',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_USERS: '/admin/users',
  ADMIN_STATISTICS: '/admin/statistics',
  
  // Care Staff
  CARE_STAFF: '/care-staff',
  CARE_STAFF_APPOINTMENTS: '/care-staff/appointments',
  CARE_STAFF_MESSAGES: '/care-staff/messages',
  
  // Sales Staff
  SALES_STAFF: '/sales-staff',
  SALES_STAFF_CUSTOMERS: '/sales-staff/customers',
  SALES_STAFF_ORDERS: '/sales-staff/orders',
  SALES_STAFF_MESSAGES: '/sales-staff/messages',
}

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
}

// Order Status Labels
export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Chờ xác nhận',
  [ORDER_STATUS.CONFIRMED]: 'Đã xác nhận',
  [ORDER_STATUS.PROCESSING]: 'Đang xử lý',
  [ORDER_STATUS.SHIPPED]: 'Đang giao hàng',
  [ORDER_STATUS.DELIVERED]: 'Đã giao hàng',
  [ORDER_STATUS.CANCELLED]: 'Đã hủy',
}

// Payment Methods
export const PAYMENT_METHODS = {
  COD: 'cod',
  CARD: 'card',
  MOMO: 'momo',
  VNPAY: 'vnpay',
}

// Payment Method Labels
export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.COD]: 'Thanh toán khi nhận hàng (COD)',
  [PAYMENT_METHODS.CARD]: 'Thẻ tín dụng/ghi nợ',
  [PAYMENT_METHODS.MOMO]: 'Ví MoMo',
  [PAYMENT_METHODS.VNPAY]: 'VNPAY',
}

// Product Categories - Pet Management
export const CATEGORIES = [
  { id: 'food', name: 'Đồ ăn thú cưng', icon: '🍖' },
  { id: 'backpack', name: 'Balo thú cưng', icon: '🎒' },
  { id: 'toy', name: 'Đồ chơi', icon: '🧸' },
  { id: 'accessory', name: 'Phụ kiện', icon: '🎀' },
  { id: 'health', name: 'Sức khỏe', icon: '💊' },
  { id: 'grooming', name: 'Vệ sinh', icon: '🛁' },
]

// Service Categories
export const SERVICE_CATEGORIES = [
  { id: 'grooming', name: 'Cắt tỉa lông', icon: '✂️' },
  { id: 'care', name: 'Trông giữ', icon: '🏠' },
  { id: 'health', name: 'Chăm sóc sức khỏe', icon: '🏥' },
  { id: 'training', name: 'Huấn luyện', icon: '🎓' },
]

// Pet Types
export const PET_TYPES = [
  { value: 'dog', label: 'Chó', icon: '🐕' },
  { value: 'cat', label: 'Mèo', icon: '🐈' },
  { value: 'bird', label: 'Chim', icon: '🐦' },
  { value: 'other', label: 'Khác', icon: '🐾' },
]

// Sort Options
export const SORT_OPTIONS = [
  { value: 'default', label: 'Mặc định' },
  { value: 'price_asc', label: 'Giá thấp đến cao' },
  { value: 'price_desc', label: 'Giá cao đến thấp' },
  { value: 'name_asc', label: 'Tên A-Z' },
  { value: 'name_desc', label: 'Tên Z-A' },
  { value: 'newest', label: 'Mới nhất' },
  { value: 'rating', label: 'Đánh giá cao nhất' },
]

// Pagination
export const ITEMS_PER_PAGE = 12

// User Roles - Pet Management System
export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  CARE_STAFF: 'care_staff',
  SALES_STAFF: 'sales_staff',
}

// Appointment Status
export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected',
}

// Appointment Status Labels
export const APPOINTMENT_STATUS_LABELS = {
  [APPOINTMENT_STATUS.PENDING]: 'Chờ xác nhận',
  [APPOINTMENT_STATUS.CONFIRMED]: 'Đã xác nhận',
  [APPOINTMENT_STATUS.IN_PROGRESS]: 'Đang thực hiện',
  [APPOINTMENT_STATUS.COMPLETED]: 'Hoàn thành',
  [APPOINTMENT_STATUS.CANCELLED]: 'Đã hủy',
  [APPOINTMENT_STATUS.REJECTED]: 'Từ chối',
}

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  CART: 'cart_items',
  WISHLIST: 'wishlist_items',
}

// Toast Messages
export const TOAST_MESSAGES = {
  LOGIN_SUCCESS: 'Đăng nhập thành công!',
  LOGOUT_SUCCESS: 'Đăng xuất thành công!',
  REGISTER_SUCCESS: 'Đăng ký thành công! Vui lòng đăng nhập.',
  ADD_TO_CART: 'Đã thêm vào giỏ hàng',
  REMOVE_FROM_CART: 'Đã xóa khỏi giỏ hàng',
  ADD_TO_WISHLIST: 'Đã thêm vào yêu thích',
  REMOVE_FROM_WISHLIST: 'Đã xóa khỏi yêu thích',
  ORDER_SUCCESS: 'Đặt hàng thành công!',
  ERROR: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
}


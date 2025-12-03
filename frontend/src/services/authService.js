import api from './api'

export const authService = {
  // Register new customer
  register: async (userData) => {
    console.log('🔐 Registering user:', userData);
    const response = await api.post('/register', {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      password: userData.password,
      password_confirmation: userData.password_confirmation,
    })
    console.log('✅ Registration response:', response.data);
    return response.data
  },

  // Login
  login: async (credentials) => {
    console.log('🔐 Logging in:', credentials.email);
    const response = await api.post('/login', {
      email: credentials.email,
      password: credentials.password,
    })
    console.log('✅ Login response:', response.data);
    console.log('🔑 Token from backend:', response.data.token);
    console.log('👤 User from backend:', response.data.user);
    return response.data
  },

  // Logout
  logout: async () => {
    const response = await api.post('/logout')
    return response.data
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/me')
    return response.data
  },

  // Update profile
  updateProfile: async (userData) => {
    const response = await api.put('/profile', userData)
    return response.data
  },

  // Change password (included in updateProfile)
  changePassword: async (passwords) => {
    const response = await api.put('/profile', {
      password: passwords.newPassword,
      password_confirmation: passwords.newPassword,
    })
    return response.data
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/forgot-password', { email })
    return response.data
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    const response = await api.post('/reset-password', {
      token,
      password: newPassword,
      password_confirmation: newPassword,
    })
    return response.data
  },
}


import { createContext, useContext, useState, useEffect } from 'react'
import { notificationService } from '../services/notificationService'
import { useAuth } from './AuthContext'

const NotificationContext = createContext(null)

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  // Load recent notifications
  const loadRecentNotifications = async () => {
    if (!isAuthenticated()) return

    try {
      setLoading(true)
      const response = await notificationService.getRecent()
      setNotifications(response.notifications || [])
      setUnreadCount(response.unread_count || 0)
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load unread count only
  const loadUnreadCount = async () => {
    if (!isAuthenticated()) return

    try {
      const response = await notificationService.getUnreadCount()
      setUnreadCount(response.count || 0)
    } catch (error) {
      console.error('Error loading unread count:', error)
    }
  }

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id)
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id 
            ? { ...notif, is_read: true, read_at: new Date().toISOString() }
            : notif
        )
      )
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => ({ 
          ...notif, 
          is_read: true, 
          read_at: new Date().toISOString() 
        }))
      )
      
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  // Delete notification
  const deleteNotification = async (id) => {
    try {
      await notificationService.deleteNotification(id)
      
      // Update local state
      const deletedNotification = notifications.find(n => n.id === id)
      setNotifications(prev => prev.filter(notif => notif.id !== id))
      
      // Update unread count if deleted notification was unread
      if (deletedNotification && !deletedNotification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  // Auto-refresh notifications every 30 seconds
  useEffect(() => {
    if (!isAuthenticated()) return

    // Initial load
    loadRecentNotifications()

    // Set up polling
    const interval = setInterval(() => {
      loadUnreadCount()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [user, isAuthenticated])

  // Listen for order placed events to refresh notifications
  useEffect(() => {
    const handleOrderPlaced = () => {
      setTimeout(() => {
        loadRecentNotifications()
      }, 1000) // Delay to ensure notification is created
    }

    window.addEventListener('orderPlaced', handleOrderPlaced)
    return () => window.removeEventListener('orderPlaced', handleOrderPlaced)
  }, [])

  const value = {
    notifications,
    unreadCount,
    loading,
    loadRecentNotifications,
    loadUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh: loadRecentNotifications
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}
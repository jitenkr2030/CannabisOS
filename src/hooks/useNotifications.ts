'use client'

import { useState, useEffect, useCallback } from 'react'

export interface Notification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info' | 'order' | 'inventory' | 'delivery' | 'system'
  title: string
  message: string
  timestamp: Date
  read: boolean
  action?: {
    label: string
    url: string
  }
  metadata?: Record<string, any>
  priority?: 'low' | 'medium' | 'high' | 'urgent'
}

interface UseNotificationsReturn {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  clearAll: () => void
  subscribeToNotifications: (callback: (notifications: Notification[]) => void) => () => void
}

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [subscribers, setSubscribers] = useState<Set<(notifications: Notification[]) => void>>(new Set())

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
      priority: notification.priority || 'medium'
    }

    setNotifications(prev => {
      const updated = [newNotification, ...prev]
      // Notify subscribers
      subscribers.forEach(callback => callback(updated))
      return updated
    })
  }, [subscribers])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n)
      subscribers.forEach(callback => callback(updated))
      return updated
    })
  }, [subscribers])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }))
      subscribers.forEach(callback => callback(updated))
      return updated
    })
  }, [subscribers])

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id)
      subscribers.forEach(callback => callback(updated))
      return updated
    })
  }, [subscribers])

  const clearAll = useCallback(() => {
    setNotifications([])
    subscribers.forEach(callback => callback([]))
  }, [subscribers])

  const subscribeToNotifications = useCallback((callback: (notifications: Notification[]) => void) => {
    setSubscribers(prev => new Set(prev).add(callback))
    return () => {
      setSubscribers(prev => {
        const newSet = new Set(prev)
        newSet.delete(callback)
        return newSet
      })
    }
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    subscribeToNotifications
  }
}

// Global notification store
let globalNotifications: Notification[] = []
let globalSubscribers: Set<(notifications: Notification[]) => void> = new Set()

export const notificationStore = {
  getNotifications: () => globalNotifications,
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
      priority: notification.priority || 'medium'
    }
    globalNotifications = [newNotification, ...globalNotifications]
    globalSubscribers.forEach(callback => callback(globalNotifications))
  },
  markAsRead: (id: string) => {
    globalNotifications = globalNotifications.map(n => n.id === id ? { ...n, read: true } : n)
    globalSubscribers.forEach(callback => callback(globalNotifications))
  },
  markAllAsRead: () => {
    globalNotifications = globalNotifications.map(n => ({ ...n, read: true }))
    globalSubscribers.forEach(callback => callback(globalNotifications))
  },
  deleteNotification: (id: string) => {
    globalNotifications = globalNotifications.filter(n => n.id !== id)
    globalSubscribers.forEach(callback => callback(globalNotifications))
  },
  clearAll: () => {
    globalNotifications = []
    globalSubscribers.forEach(callback => callback([]))
  },
  subscribe: (callback: (notifications: Notification[]) => void) => {
    globalSubscribers.add(callback)
    return () => {
      globalSubscribers.delete(callback)
    }
  }
}

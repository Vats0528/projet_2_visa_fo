import React, { useState } from 'react'

export const useNotification = () => {
  const [notification, setNotification] = useState(null)

  const notify = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 4000)
  }

  return { notification, notify }
}

export const Notification = ({ notification }) => {
  if (!notification) return null

  const bgColor = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700'
  }[notification.type] || 'bg-blue-100'

  return (
    <div className={`fixed top-4 right-4 border px-4 py-3 rounded ${bgColor}`}>
      {notification.message}
    </div>
  )
}

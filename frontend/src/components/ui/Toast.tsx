'use client'

import { useEffect } from 'react'
import { FiCheckCircle, FiX } from 'react-icons/fi'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  onClose: () => void
  duration?: number
}

export default function Toast({ message, type = 'success', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'

  return (
    <div 
      className="fixed top-4 right-4 animate-slide-in-right"
      style={{
        animation: 'slideInRight 0.3s ease-out',
        zIndex: 9999
      }}
    >
      <div className={`${bgColor} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px]`}>
        <FiCheckCircle className="text-2xl flex-shrink-0" />
        <p className="flex-1 font-semibold">{message}</p>
        <button 
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <FiX className="text-xl" />
        </button>
      </div>
      
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

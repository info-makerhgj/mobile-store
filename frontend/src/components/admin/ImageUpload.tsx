'use client'

import { useState, useRef } from 'react'
import { FiUpload, FiX, FiImage } from 'react-icons/fi'

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
}

export default function ImageUpload({ value, onChange, label, placeholder }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(value)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('الرجاء اختيار صورة فقط')
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الصورة يجب أن يكون أقل من 5 ميجابايت')
      return
    }

    setUploading(true)

    try {
      // Convert to base64
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setPreview(base64String)
        onChange(base64String)
        setUploading(false)
      }
      reader.onerror = () => {
        alert('حدث خطأ أثناء قراءة الصورة')
        setUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('حدث خطأ أثناء رفع الصورة')
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview('')
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const isEmoji = (str: string) => {
    return str && str.length <= 4 && !str.startsWith('http') && !str.startsWith('data:')
  }

  return (
    <div>
      {label && <label className="block text-sm font-bold mb-2">{label}</label>}

      <div className="space-y-3">
        {/* Preview */}
        {preview && (
          <div className="relative bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
            <button
              onClick={handleRemove}
              className="absolute top-2 left-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg z-10"
              type="button"
            >
              <FiX size={16} />
            </button>
            <div className="flex items-center justify-center min-h-[200px]">
              {isEmoji(preview) ? (
                <span className="text-8xl">{preview}</span>
              ) : preview.startsWith('data:image') || preview.startsWith('http') ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full max-h-[300px] object-contain rounded-lg"
                />
              ) : (
                <span className="text-6xl">{preview}</span>
              )}
            </div>
          </div>
        )}

        {/* Upload Button */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>جاري الرفع...</span>
              </>
            ) : (
              <>
                <FiUpload size={20} />
                <span>{preview ? 'تغيير الصورة' : 'رفع صورة'}</span>
              </>
            )}
          </button>

          {/* Emoji Input */}
          <input
            type="text"
            value={isEmoji(value) ? value : ''}
            onChange={(e) => {
              const val = e.target.value
              if (val.length <= 4) {
                setPreview(val)
                onChange(val)
              }
            }}
            placeholder="أو emoji 📱"
            className="w-32 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-600 text-center text-2xl"
          />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <p className="text-xs text-gray-500 text-center">
          يمكنك رفع صورة (حتى 5 ميجابايت) أو استخدام emoji
        </p>
      </div>
    </div>
  )
}

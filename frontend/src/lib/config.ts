// 🔧 ملف التكوين المركزي للـ API
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

// Helper function to get API URL
export const getApiUrl = (endpoint: string) => {
  // Remove leading slash if exists
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  return `${API_URL}/${cleanEndpoint}`
}

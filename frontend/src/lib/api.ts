const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// Helper function for API calls
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token')
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'حدث خطأ' }))
    throw new Error(error.message || 'حدث خطأ')
  }

  return response.json()
}

// Auth APIs
export const authAPI = {
  login: (email: string, password: string) =>
    fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getProfile: () => fetchAPI('/auth/profile'),
}

// Products APIs
export const productsAPI = {
  getAll: (params?: { category?: string; minPrice?: number; maxPrice?: number }) => {
    const query = new URLSearchParams()
    if (params?.category) query.append('category', params.category)
    if (params?.minPrice) query.append('minPrice', params.minPrice.toString())
    if (params?.maxPrice) query.append('maxPrice', params.maxPrice.toString())
    
    return fetchAPI(`/products?${query.toString()}`)
  },

  getById: (id: string) => fetchAPI(`/products/${id}`),

  create: (data: any) =>
    fetchAPI('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    fetchAPI(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchAPI(`/products/${id}`, {
      method: 'DELETE',
    }),
}

// Orders APIs
export const ordersAPI = {
  getAll: () => fetchAPI('/orders'),

  getById: (id: string) => fetchAPI(`/orders/${id}`),

  create: (data: any) =>
    fetchAPI('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateStatus: (id: string, status: string) =>
    fetchAPI(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
}

// Cart APIs (local storage for now)
export const cartAPI = {
  getCart: () => {
    if (typeof window === 'undefined') return []
    const cart = localStorage.getItem('cart')
    return cart ? JSON.parse(cart) : []
  },

  addToCart: (product: any) => {
    const cart = cartAPI.getCart()
    const existingItem = cart.find((item: any) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({ ...product, quantity: 1 })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    return cart
  },

  updateQuantity: (productId: string, quantity: number) => {
    const cart = cartAPI.getCart()
    const item = cart.find((item: any) => item.id === productId)
    
    if (item) {
      item.quantity = quantity
      localStorage.setItem('cart', JSON.stringify(cart))
    }
    
    return cart
  },

  removeFromCart: (productId: string) => {
    const cart = cartAPI.getCart().filter((item: any) => item.id !== productId)
    localStorage.setItem('cart', JSON.stringify(cart))
    return cart
  },

  clearCart: () => {
    localStorage.removeItem('cart')
    return []
  },
}

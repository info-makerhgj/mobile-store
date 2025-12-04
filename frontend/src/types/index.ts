export interface Product {
  id: string
  name: string
  nameAr: string
  nameEn: string
  description: string
  descriptionAr: string
  descriptionEn: string
  price: number
  originalPrice?: number
  brand: string
  category: string
  images: string[]
  specifications: Specification[]
  stock: number
  condition: 'new' | 'refurbished' | 'used'
  warranty: string
  rating: number
  reviewsCount: number
}

export interface Specification {
  key: string
  value: string
  keyAr: string
  keyEn: string
}

export interface Category {
  id: string
  name: string
  nameAr: string
  nameEn: string
  slug: string
  image: string
}

export interface Filter {
  brand?: string[]
  category?: string[]
  priceMin?: number
  priceMax?: number
  ram?: string[]
  storage?: string[]
  condition?: string[]
  color?: string[]
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress: Address
  paymentMethod: string
  createdAt: string
}

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface Address {
  fullName: string
  phone: string
  city: string
  district: string
  street: string
  building: string
  postalCode?: string
}

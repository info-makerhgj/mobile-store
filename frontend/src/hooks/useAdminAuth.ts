'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useAdminAuth() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem('token')
      
      if (!token) {
        router.push('/admin/login')
        return
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) {
          throw new Error('Unauthorized')
        }

        const data = await res.json()

        if (data.user.role !== 'ADMIN') {
          localStorage.removeItem('token')
          localStorage.removeItem('userRole')
          router.push('/admin/login')
          return
        }

        setIsAdmin(true)
      } catch (error) {
        localStorage.removeItem('token')
        localStorage.removeItem('userRole')
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    checkAdmin()
  }, [router])

  return { loading, isAdmin }
}

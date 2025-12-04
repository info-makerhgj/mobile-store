import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  user?: any
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret')
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
}

export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(403).json({ message: 'Access denied' })
    }
    
    // Convert both to uppercase for comparison
    const userRole = req.user.role?.toUpperCase()
    const allowedRoles = roles.map(r => r.toUpperCase())
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Access denied' })
    }
    
    next()
  }
}

// Middleware للسماح بالطلبات مع أو بدون تسجيل دخول
export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (token) {
      // إذا كان هناك توكن، نتحقق منه
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret')
      req.user = decoded
    }
    // إذا لم يكن هناك توكن، نكمل بدون user (زائر)
    next()
  } catch (error) {
    // إذا كان التوكن غير صحيح، نكمل بدون user
    next()
  }
}

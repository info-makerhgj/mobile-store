import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { AuthRequest } from '../middleware/auth'
import { MongoClient } from 'mongodb'
import { MONGODB_URI } from '../config/database'

const mongoUrl = MONGODB_URI

export const register = async (req: Request, res: Response) => {
  const client = new MongoClient(mongoUrl)
  
  try {
    const { email, password, name, phone } = req.body
    
    await client.connect()
    const db = client.db()
    const usersCollection = db.collection('User')
    
    // Check if user exists
    const existingUser = await usersCollection.findOne({ email })
    
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'البريد الإلكتروني مستخدم بالفعل' })
    }
    
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Check if this is the first user (make them admin)
    const userCount = await usersCollection.countDocuments()
    const isFirstUser = userCount === 0
    
    const user = {
      email,
      password: hashedPassword,
      name,
      phone: phone || null,
      role: isFirstUser ? 'ADMIN' : 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    const result = await usersCollection.insertOne(user)
    
    const token = jwt.sign(
      { userId: result.insertedId.toString(), role: user.role },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '7d' }
    )
    
    res.status(201).json({
      token,
      user: {
        id: result.insertedId.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ success: false, message: 'حدث خطأ في الخادم' })
  } finally {
    await client.close()
  }
}

export const login = async (req: Request, res: Response) => {
  const client = new MongoClient(mongoUrl)
  
  try {
    const { email, password } = req.body
    
    console.log('🔍 Login attempt:', { email, passwordLength: password?.length })
    
    await client.connect()
    const db = client.db()
    const usersCollection = db.collection('User')
    
    const user = await usersCollection.findOne({ email })
    
    console.log('👤 User found:', user ? 'YES' : 'NO')
    
    if (!user) {
      console.log('❌ User not found in database')
      return res.status(401).json({ success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' })
    }
    
    console.log('🔐 Comparing passwords...')
    const isValidPassword = await bcrypt.compare(password, user.password)
    console.log('🔐 Password valid:', isValidPassword)
    
    if (!isValidPassword) {
      console.log('❌ Password mismatch')
      return res.status(401).json({ success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' })
    }
    
    console.log('✅ Login successful for:', email)
    
    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '7d' }
    )
    
    res.json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('❌ Login error:', error)
    res.status(500).json({ success: false, message: 'حدث خطأ في الخادم' })
  } finally {
    await client.close()
  }
}

export const getProfile = async (req: AuthRequest, res: Response) => {
  const client = new MongoClient(mongoUrl)
  
  try {
    await client.connect()
    const db = client.db()
    const usersCollection = db.collection('User')
    
    const { ObjectId } = require('mongodb')
    const user = await usersCollection.findOne(
      { _id: new ObjectId(req.user?.userId) },
      { projection: { password: 0 } }
    )
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'المستخدم غير موجود' })
    }
    
    res.json({ 
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      }
    })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ success: false, message: 'حدث خطأ في الخادم' })
  } finally {
    await client.close()
  }
}

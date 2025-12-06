import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { AuthRequest } from '../middleware/auth'

const prisma = new PrismaClient()

const MONGODB_URI = process.env.DATABASE_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/mobile-store'

// Register new user
export const register = async (req: Request, res: Response) => {
  const { MongoClient } = require('mongodb')
  const client = new MongoClient(MONGODB_URI)

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

    // Hash password
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

    res.json({
      success: true,
      token,
      user: {
        id: result.insertedId.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Error registering user:', error)
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء التسجيل' })
  } finally {
    await client.close()
  }
}

// Login user
export const login = async (req: Request, res: Response) => {
  const { MongoClient } = require('mongodb')
  const client = new MongoClient(MONGODB_URI)

  try {
    const { email, password } = req.body

    await client.connect()
    const db = client.db()
    const usersCollection = db.collection('User')

    // Find user
    const user = await usersCollection.findOne({ email })

    if (!user) {
      return res.status(400).json({ success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' })
    }

    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Error logging in:', error)
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء تسجيل الدخول' })
  } finally {
    await client.close()
  }
}

// Get current user
export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  const { MongoClient, ObjectId } = require('mongodb')
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    const db = client.db()
    const usersCollection = db.collection('User')

    const user = await usersCollection.findOne({ _id: new ObjectId(req.userId) })

    if (!user) {
      return res.status(404).json({ success: false, message: 'المستخدم غير موجود' })
    }

    res.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
      },
    })
  } catch (error) {
    console.error('Error getting current user:', error)
    res.status(500).json({ success: false, message: 'حدث خطأ' })
  } finally {
    await client.close()
  }
}

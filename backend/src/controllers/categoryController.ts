import { Request, Response } from 'express'
import { MongoClient } from 'mongodb'
import { MONGODB_URI } from '../config/database'

const mongoUrl = MONGODB_URI;

async function getDb() {
  const client = new MongoClient(MONGODB_URI)
  await client.connect()
  return client.db()
}

// Get all categories
export const getCategories = async (req: Request, res: Response) => {
  let client: MongoClient | null = null
  try {
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    const db = client.db()
    const categories = await db.collection('categories').find({}).sort({ order: 1 }).toArray()
    
    res.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    res.status(500).json({ message: 'خطأ في جلب الفئات' })
  } finally {
    if (client) await client.close()
  }
}

// Get single category
export const getCategory = async (req: Request, res: Response) => {
  let client: MongoClient | null = null
  try {
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    const db = client.db()
    const { slug } = req.params
    
    const category = await db.collection('categories').findOne({ slug })
    
    if (!category) {
      return res.status(404).json({ message: 'الفئة غير موجودة' })
    }
    
    res.json(category)
  } catch (error) {
    console.error('Error fetching category:', error)
    res.status(500).json({ message: 'خطأ في جلب الفئة' })
  } finally {
    if (client) await client.close()
  }
}

// Create category (Admin only)
export const createCategory = async (req: Request, res: Response) => {
  let client: MongoClient | null = null
  try {
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    const db = client.db()
    const { name, slug, icon, order } = req.body
    
    // Check if slug already exists
    const existing = await db.collection('categories').findOne({ slug })
    if (existing) {
      return res.status(400).json({ message: 'الرابط المختصر موجود مسبقاً' })
    }
    
    const category = {
      name,
      slug,
      icon: icon || '📱',
      order: order || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection('categories').insertOne(category)
    
    res.status(201).json({
      message: 'تم إضافة الفئة بنجاح',
      category: { ...category, _id: result.insertedId }
    })
  } catch (error) {
    console.error('Error creating category:', error)
    res.status(500).json({ message: 'خطأ في إضافة الفئة' })
  } finally {
    if (client) await client.close()
  }
}

// Update category (Admin only)
export const updateCategory = async (req: Request, res: Response) => {
  let client: MongoClient | null = null
  try {
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    const db = client.db()
    const { id } = req.params
    const { name, slug, icon, order } = req.body
    
    const updateData: any = {
      updatedAt: new Date()
    }
    
    if (name) updateData.name = name
    if (slug) updateData.slug = slug
    if (icon) updateData.icon = icon
    if (order !== undefined) updateData.order = order
    
    const { ObjectId } = require('mongodb')
    const result = await db.collection('categories').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'الفئة غير موجودة' })
    }
    
    res.json({ message: 'تم تحديث الفئة بنجاح' })
  } catch (error) {
    console.error('Error updating category:', error)
    res.status(500).json({ message: 'خطأ في تحديث الفئة' })
  } finally {
    if (client) await client.close()
  }
}

// Delete category (Admin only)
export const deleteCategory = async (req: Request, res: Response) => {
  let client: MongoClient | null = null
  try {
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    const db = client.db()
    const { id } = req.params
    
    const { ObjectId } = require('mongodb')
    const result = await db.collection('categories').deleteOne({
      _id: new ObjectId(id)
    })
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'الفئة غير موجودة' })
    }
    
    res.json({ message: 'تم حذف الفئة بنجاح' })
  } catch (error) {
    console.error('Error deleting category:', error)
    res.status(500).json({ message: 'خطأ في حذف الفئة' })
  } finally {
    if (client) await client.close()
  }
}


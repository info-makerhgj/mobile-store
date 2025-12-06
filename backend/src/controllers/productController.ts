import { Request, Response } from 'express'
import { MongoClient, ObjectId } from 'mongodb'

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { brand, category, minPrice, maxPrice, condition, page = 1, limit = 20 } = req.query
    
    // Use MongoDB directly to get all fields
    const client = new MongoClient(process.env.DATABASE_URL || '')
    
    await client.connect()
    const db = client.db()
    const productsCollection = db.collection('Product')
    
    const query: any = {}
    
    if (brand) query.brand = brand
    if (category) query.category = category
    if (condition) query.condition = condition
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }
    
    const products = await productsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .toArray()
    
    await client.close()
    
    // Convert _id to id for frontend
    const productsData = products.map(p => ({
      ...p,
      id: p._id.toString(),
    }))
    
    res.json(productsData)
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

export const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    // Use MongoDB directly to get all fields
    const client = new MongoClient(process.env.DATABASE_URL || '')
    
    await client.connect()
    const db = client.db()
    const productsCollection = db.collection('Product')
    
    const product = await productsCollection.findOne({ _id: new ObjectId(id) })
    
    await client.close()
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }
    
    // Convert _id to id for frontend
    const productData: any = {
      ...product,
      id: product._id.toString(),
    }
    
    console.log('📤 Sending product:', productData.nameAr)
    console.log('  - Colors:', productData.colors)
    console.log('  - Storage:', productData.storage)
    
    res.json(productData)
  } catch (error) {
    console.error('Error fetching product:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

export const createProduct = async (req: Request, res: Response) => {
  try {
    // Use MongoDB directly to avoid transaction issues
    const client = new MongoClient(process.env.DATABASE_URL || '')
    
    await client.connect()
    const db = client.db()
    const productsCollection = db.collection('Product')
    
    const productData = {
      ...req.body,
      rating: 0,
      reviewsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    const result = await productsCollection.insertOne(productData)
    const product = await productsCollection.findOne({ _id: result.insertedId })
    
    await client.close()
    
    res.status(201).json(product)
  } catch (error: any) {
    console.error('Error creating product:', error)
    res.status(500).json({ success: false, message: 'Server error', error: error?.message })
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    console.log('🔄 Updating product:', id)
    console.log('📦 Received data:')
    console.log('  - Colors:', req.body.colors)
    console.log('  - Storage:', req.body.storage)
    console.log('  - Quick Features:', req.body.quickFeatures?.length || 0)
    console.log('  - Features:', req.body.features?.length || 0)
    console.log('  - Specifications:', req.body.specifications ? Object.keys(req.body.specifications) : 'none')
    
    // Use MongoDB directly to avoid transaction issues
    const client = new MongoClient(process.env.DATABASE_URL || '')
    
    await client.connect()
    const db = client.db()
    const productsCollection = db.collection('Product')
    
    const updateData = {
      ...req.body,
      updatedAt: new Date(),
    }
    
    const result = await productsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )
    
    console.log('✅ Update result:', result.modifiedCount, 'document(s) modified')
    
    const product = await productsCollection.findOne({ _id: new ObjectId(id) })
    
    console.log('📤 Returning product with:')
    console.log('  - Colors:', product?.colors)
    console.log('  - Storage:', product?.storage)
    console.log('  - Features:', product?.features?.length || 0)
    
    await client.close()
    
    res.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    // Use MongoDB directly to avoid transaction issues
    const client = new MongoClient(process.env.DATABASE_URL || '')
    
    await client.connect()
    const db = client.db()
    const productsCollection = db.collection('Product')
    
    await productsCollection.deleteOne({ _id: new ObjectId(id) })
    
    await client.close()
    
    res.json({ success: true, message: 'Product deleted' })
  } catch (error) {
    console.error('Error deleting product:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}


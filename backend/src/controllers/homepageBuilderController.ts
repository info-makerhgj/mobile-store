import { Request, Response } from 'express'
import { MongoClient, ObjectId } from 'mongodb'

// Save homepage sections
export const saveHomepageSections = async (req: Request, res: Response) => {
  try {
    const { sections } = req.body
    const client = new MongoClient(process.env.DATABASE_URL || '')

    await client.connect()
    const db = client.db()
    const homepageCollection = db.collection('HomepageConfig')

    // Check if homepage exists
    const existing = await homepageCollection.findOne({ active: true })

    if (existing) {
      // Update existing
      await homepageCollection.updateOne(
        { active: true },
        {
          $set: {
            sections,
            updatedAt: new Date(),
          },
        } as any
      )
    } else {
      // Create new
      await homepageCollection.insertOne({
        active: true,
        sections,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    const config = await homepageCollection.findOne({ active: true })
    await client.close()

    res.json({ success: true, data: config })
  } catch (error) {
    console.error('Error saving homepage sections:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// Upload image (convert to base64)
export const uploadImage = async (req: Request, res: Response) => {
  try {
    const { image } = req.body

    if (!image) {
      return res.status(400).json({ success: false, message: 'No image provided' })
    }

    // Image is already in base64 format from frontend
    res.json({ success: true, imageUrl: image })
  } catch (error) {
    console.error('Error uploading image:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

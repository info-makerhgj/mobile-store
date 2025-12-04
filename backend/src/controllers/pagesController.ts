import { Request, Response } from 'express';
import { MongoClient } from 'mongodb';

const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/mobile-store';

// Get page by slug
export const getPage = async (req: Request, res: Response) => {
  const client = new MongoClient(mongoUrl);
  const { slug } = req.params;

  try {
    await client.connect();
    const db = client.db();

    const page = await db.collection('Pages').findOne({ slug });

    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }

    res.json({ success: true, page });
  } catch (error: any) {
    console.error('Get page error:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await client.close();
  }
};

// Get all pages (Admin)
export const getAllPages = async (req: Request, res: Response) => {
  const client = new MongoClient(mongoUrl);

  try {
    await client.connect();
    const db = client.db();

    const pages = await db.collection('Pages').find({}).toArray();

    res.json({ success: true, pages });
  } catch (error: any) {
    console.error('Get all pages error:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await client.close();
  }
};

// Update page (Admin)
export const updatePage = async (req: Request, res: Response) => {
  const client = new MongoClient(mongoUrl);
  const { slug } = req.params;
  const { title, content } = req.body;

  try {
    await client.connect();
    const db = client.db();

    await db.collection('Pages').updateOne(
      { slug },
      {
        $set: {
          title,
          content,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    const page = await db.collection('Pages').findOne({ slug });

    console.log(`✅ Page ${slug} updated`);
    res.json({ success: true, page });
  } catch (error: any) {
    console.error('Update page error:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await client.close();
  }
};

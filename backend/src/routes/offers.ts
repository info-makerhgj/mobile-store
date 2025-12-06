import { Router } from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import { authenticate, authorize } from '../middleware/auth';
import { MONGODB_URI } from '../config/database';

const router = Router();
const mongoUrl = MONGODB_URI;

// Get all offers (Public)
router.get('/', async (req, res) => {
  const client = new MongoClient(mongoUrl);
  
  try {
    await client.connect();
    const db = client.db();
    const offersCollection = db.collection('Offer');
    
    const offers = await offersCollection
      .find({ isActive: true })
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json(offers);
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ error: 'Failed to fetch offers' });
  } finally {
    await client.close();
  }
});

// Get offer by ID (Public)
router.get('/:id', async (req, res) => {
  const client = new MongoClient(mongoUrl);
  
  try {
    await client.connect();
    const db = client.db();
    const offersCollection = db.collection('Offer');
    
    const offer = await offersCollection.findOne({
      _id: new ObjectId(req.params.id),
    });
    
    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }
    
    res.json(offer);
  } catch (error) {
    console.error('Error fetching offer:', error);
    res.status(500).json({ error: 'Failed to fetch offer' });
  } finally {
    await client.close();
  }
});

// Create offer (Admin only)
router.post('/', authenticate, authorize(['ADMIN']), async (req, res) => {
  const client = new MongoClient(mongoUrl);
  
  try {
    await client.connect();
    const db = client.db();
    const offersCollection = db.collection('Offer');
    
    const offer = {
      ...req.body,
      isActive: req.body.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await offersCollection.insertOne(offer);
    
    res.status(201).json({
      ...offer,
      _id: result.insertedId,
    });
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(500).json({ error: 'Failed to create offer' });
  } finally {
    await client.close();
  }
});

// Update offer (Admin only)
router.put('/:id', authenticate, authorize(['ADMIN']), async (req, res) => {
  const client = new MongoClient(mongoUrl);
  
  try {
    await client.connect();
    const db = client.db();
    const offersCollection = db.collection('Offer');
    
    const { _id, ...updateData } = req.body;
    
    const result = await offersCollection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );
    
    if (!result) {
      return res.status(404).json({ error: 'Offer not found' });
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error updating offer:', error);
    res.status(500).json({ error: 'Failed to update offer' });
  } finally {
    await client.close();
  }
});

// Delete offer (Admin only)
router.delete('/:id', authenticate, authorize(['ADMIN']), async (req, res) => {
  const client = new MongoClient(mongoUrl);
  
  try {
    await client.connect();
    const db = client.db();
    const offersCollection = db.collection('Offer');
    
    const result = await offersCollection.deleteOne({
      _id: new ObjectId(req.params.id),
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Offer not found' });
    }
    
    res.json({ message: 'Offer deleted successfully' });
  } catch (error) {
    console.error('Error deleting offer:', error);
    res.status(500).json({ error: 'Failed to delete offer' });
  } finally {
    await client.close();
  }
});

export default router;

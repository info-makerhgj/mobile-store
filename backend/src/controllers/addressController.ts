import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { MongoClient, ObjectId } from 'mongodb';

const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/abaad_store';

export const getAddresses = async (req: AuthRequest, res: Response) => {
  const client = new MongoClient(mongoUrl);
  
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'غير مصرح' });
    }

    await client.connect();
    const db = client.db();
    
    const addresses = await db.collection('Address').find({ 
      userId: new ObjectId(userId) 
    }).toArray();

    res.json({ 
      success: true, 
      addresses: addresses.map(addr => ({ ...addr, id: addr._id.toString() }))
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await client.close();
  }
};

export const createAddress = async (req: AuthRequest, res: Response) => {
  const client = new MongoClient(mongoUrl);
  
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'غير مصرح' });
    }

    const { fullName, phone, city, district, street, building, postalCode, isDefault } = req.body;

    // التحقق من البيانات
    if (!fullName || !phone || !city || !district || !street) {
      return res.status(400).json({ success: false, error: 'جميع الحقول مطلوبة' });
    }

    await client.connect();
    const db = client.db();

    // إذا كان العنوان افتراضي، إلغاء الافتراضي من العناوين الأخرى
    if (isDefault) {
      await db.collection('Address').updateMany(
        { userId: new ObjectId(userId) },
        { $set: { isDefault: false } }
      );
    }

    const result = await db.collection('Address').insertOne({
      userId: new ObjectId(userId),
      fullName,
      phone,
      city,
      district,
      street,
      building: building || '',
      postalCode: postalCode || '',
      isDefault: isDefault || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const address = await db.collection('Address').findOne({ _id: result.insertedId });

    res.status(201).json({ 
      success: true, 
      address: { ...address, id: address?._id.toString() }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await client.close();
  }
};

export const updateAddress = async (req: AuthRequest, res: Response) => {
  const client = new MongoClient(mongoUrl);
  
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'غير مصرح' });
    }

    const { id } = req.params;
    const updates = req.body;

    await client.connect();
    const db = client.db();

    // التحقق من ملكية العنوان
    const address = await db.collection('Address').findOne({ 
      _id: new ObjectId(id),
      userId: new ObjectId(userId)
    });

    if (!address) {
      return res.status(404).json({ success: false, error: 'العنوان غير موجود' });
    }

    // إذا كان العنوان افتراضي، إلغاء الافتراضي من العناوين الأخرى
    if (updates.isDefault) {
      await db.collection('Address').updateMany(
        { userId: new ObjectId(userId), _id: { $ne: new ObjectId(id) } },
        { $set: { isDefault: false } }
      );
    }

    await db.collection('Address').updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } }
    );

    const updatedAddress = await db.collection('Address').findOne({ _id: new ObjectId(id) });

    res.json({ 
      success: true, 
      address: { ...updatedAddress, id: updatedAddress?._id.toString() }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await client.close();
  }
};

export const deleteAddress = async (req: AuthRequest, res: Response) => {
  const client = new MongoClient(mongoUrl);
  
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'غير مصرح' });
    }

    const { id } = req.params;

    await client.connect();
    const db = client.db();

    // التحقق من ملكية العنوان
    const address = await db.collection('Address').findOne({ 
      _id: new ObjectId(id),
      userId: new ObjectId(userId)
    });

    if (!address) {
      return res.status(404).json({ success: false, error: 'العنوان غير موجود' });
    }

    await db.collection('Address').deleteOne({ _id: new ObjectId(id) });

    res.json({ success: true, message: 'تم حذف العنوان' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await client.close();
  }
};

export const setDefaultAddress = async (req: AuthRequest, res: Response) => {
  const client = new MongoClient(mongoUrl);
  
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'غير مصرح' });
    }

    const { id } = req.params;

    await client.connect();
    const db = client.db();

    // التحقق من ملكية العنوان
    const address = await db.collection('Address').findOne({ 
      _id: new ObjectId(id),
      userId: new ObjectId(userId)
    });

    if (!address) {
      return res.status(404).json({ success: false, error: 'العنوان غير موجود' });
    }

    // إلغاء الافتراضي من جميع العناوين
    await db.collection('Address').updateMany(
      { userId: new ObjectId(userId) },
      { $set: { isDefault: false } }
    );

    // تعيين العنوان الحالي كافتراضي
    await db.collection('Address').updateOne(
      { _id: new ObjectId(id) },
      { $set: { isDefault: true, updatedAt: new Date() } }
    );

    res.json({ success: true, message: 'تم تعيين العنوان الافتراضي' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await client.close();
  }
};

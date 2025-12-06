import { Router } from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/mobile_store';

// Get all customers (Admin only)
router.get('/', authenticate, authorize(['ADMIN']), async (req, res) => {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db();
    const { search, status } = req.query;

    const query: any = {
      role: 'USER', // Only get customers, not admins
    };

    // Search by name, email, or phone
    if (search) {
      query.$or = [
        { name: { $regex: search as string, $options: 'i' } },
        { email: { $regex: search as string, $options: 'i' } },
        { phone: { $regex: search as string, $options: 'i' } },
      ];
    }

    const customers = await db.collection('users').find(query).sort({ createdAt: -1 }).toArray();
    const orders = await db.collection('orders').find({}).toArray();

    // Calculate stats for each customer
    const customersWithStats = customers.map((customer: any) => {
      const customerOrders = orders.filter((order: any) => order.userId === customer._id.toString());
      const totalSpent = customerOrders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
      const completedOrders = customerOrders.filter((order: any) => order.status === 'DELIVERED').length;
      
      // Consider active if they have orders in the last 90 days
      const lastOrderDate = customerOrders.length > 0 
        ? new Date(Math.max(...customerOrders.map((o: any) => new Date(o.createdAt).getTime())))
        : null;
      const isActive = lastOrderDate 
        ? (Date.now() - lastOrderDate.getTime()) < 90 * 24 * 60 * 60 * 1000
        : false;

      return {
        id: customer._id.toString(),
        name: customer.name,
        email: customer.email,
        phone: customer.phone || '',
        orders: customerOrders.length,
        completedOrders,
        totalSpent,
        joinDate: customer.createdAt,
        lastOrderDate,
        status: isActive ? 'active' : 'inactive',
      };
    });

    // Filter by status if provided
    const filteredCustomers = status && status !== 'all'
      ? customersWithStats.filter((c: any) => c.status === status)
      : customersWithStats;

    res.json({
      customers: filteredCustomers,
      total: filteredCustomers.length,
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  } finally {
    await client.close();
  }
});

// Get customer by ID (Admin only)
router.get('/:id', authenticate, authorize(['ADMIN']), async (req, res) => {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db();
    const { id } = req.params;

    const customer = await db.collection('users').findOne({ _id: new ObjectId(id) });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const orders = await db.collection('orders').find({ userId: id }).sort({ createdAt: -1 }).toArray();
    const addresses = await db.collection('addresses').find({ userId: id }).toArray();

    const totalSpent = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
    const completedOrders = orders.filter((order: any) => order.status === 'DELIVERED').length;

    res.json({
      id: customer._id.toString(),
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
      orders: orders.map((order: any) => ({
        id: order._id.toString(),
        total: order.total,
        status: order.status,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
        items: order.items || [],
      })),
      addresses: addresses.map((addr: any) => ({
        id: addr._id.toString(),
        fullName: addr.fullName,
        phone: addr.phone,
        city: addr.city,
        district: addr.district,
        street: addr.street,
        building: addr.building,
        postalCode: addr.postalCode,
        isDefault: addr.isDefault,
      })),
      totalSpent,
      completedOrders,
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  } finally {
    await client.close();
  }
});

// Get customer stats (Admin only)
router.get('/stats/overview', authenticate, authorize(['ADMIN']), async (req, res) => {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db();

    const totalCustomers = await db.collection('users').countDocuments({ role: 'USER' });
    const customers = await db.collection('users').find({ role: 'USER' }).toArray();
    const orders = await db.collection('orders').find({}).toArray();

    // Calculate active customers (ordered in last 90 days)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    
    const activeCustomers = customers.filter((customer: any) => {
      const customerOrders = orders.filter((order: any) => order.userId === customer._id.toString());
      return customerOrders.some((order: any) => new Date(order.createdAt) > ninetyDaysAgo);
    }).length;

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);

    res.json({
      totalCustomers,
      activeCustomers,
      inactiveCustomers: totalCustomers - activeCustomers,
      totalOrders,
      totalRevenue,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      averageCustomerValue: totalCustomers > 0 ? totalRevenue / totalCustomers : 0,
    });
  } catch (error) {
    console.error('Error fetching customer stats:', error);
    res.status(500).json({ error: 'Failed to fetch customer stats' });
  } finally {
    await client.close();
  }
});

export default router;

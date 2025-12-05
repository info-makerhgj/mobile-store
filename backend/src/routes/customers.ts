import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all customers (Admin only)
router.get('/', authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    const { search, status } = req.query;

    const where: any = {
      role: 'USER', // Only get customers, not admins
    };

    // Search by name, email, or phone
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { phone: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const customers = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            orders: true,
          },
        },
        orders: {
          select: {
            total: true,
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate stats for each customer
    const customersWithStats = customers.map((customer) => {
      const totalSpent = customer.orders.reduce((sum, order) => sum + order.total, 0);
      const completedOrders = customer.orders.filter(
        (order) => order.status === 'DELIVERED'
      ).length;
      
      // Consider active if they have orders in the last 90 days
      const lastOrderDate = customer.orders.length > 0 
        ? new Date(Math.max(...customer.orders.map(o => new Date(o.createdAt).getTime())))
        : null;
      const isActive = lastOrderDate 
        ? (Date.now() - lastOrderDate.getTime()) < 90 * 24 * 60 * 60 * 1000
        : false;

      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone || '',
        orders: customer._count.orders,
        completedOrders,
        totalSpent,
        joinDate: customer.createdAt,
        lastOrderDate,
        status: isActive ? 'active' : 'inactive',
      };
    });

    // Filter by status if provided
    const filteredCustomers = status && status !== 'all'
      ? customersWithStats.filter(c => c.status === status)
      : customersWithStats;

    res.json({
      customers: filteredCustomers,
      total: filteredCustomers.length,
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Get customer by ID (Admin only)
router.get('/:id', authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        orders: {
          select: {
            id: true,
            total: true,
            status: true,
            paymentStatus: true,
            createdAt: true,
            items: {
              select: {
                quantity: true,
                price: true,
                product: {
                  select: {
                    nameAr: true,
                    nameEn: true,
                    images: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        addresses: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            city: true,
            district: true,
            street: true,
            building: true,
            postalCode: true,
            isDefault: true,
          },
        },
      },
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const totalSpent = customer.orders.reduce((sum, order) => sum + order.total, 0);
    const completedOrders = customer.orders.filter(
      (order) => order.status === 'DELIVERED'
    ).length;

    res.json({
      ...customer,
      totalSpent,
      completedOrders,
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// Get customer stats (Admin only)
router.get('/stats/overview', authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    const totalCustomers = await prisma.user.count({
      where: { role: 'USER' },
    });

    const customers = await prisma.user.findMany({
      where: { role: 'USER' },
      select: {
        createdAt: true,
        orders: {
          select: {
            total: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    // Calculate active customers (ordered in last 90 days)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    
    const activeCustomers = customers.filter((customer) => {
      return customer.orders.some(
        (order) => new Date(order.createdAt) > ninetyDaysAgo
      );
    }).length;

    const totalOrders = customers.reduce(
      (sum, customer) => sum + customer.orders.length,
      0
    );

    const totalRevenue = customers.reduce(
      (sum, customer) =>
        sum + customer.orders.reduce((orderSum, order) => orderSum + order.total, 0),
      0
    );

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
  }
});

export default router;

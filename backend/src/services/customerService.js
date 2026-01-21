const prisma = require('../../prisma/db');
const { createError } = require('../utils/errors');

const createCustomer = async (customerData) => {
  try {
    // Check if email already exists (if provided)
    if (customerData.email) {
      const existingCustomer = await prisma.customer.findUnique({
        where: { email: customerData.email }
      });

      if (existingCustomer) {
        throw createError('DUPLICATE_ERROR', 'Customer with this email already exists', 409);
      }
    }

    const customer = await prisma.customer.create({
      data: customerData
    });

    return customer;
  } catch (error) {
    throw error;
  }
};

const getAllCustomers = async (filters = {}) => {
  try {
    const { search, page = 1, limit = 10 } = filters;

    const where = {};

    // Search filter (name, email, or phone)
    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          email: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          phone: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ];
    }

    const skip = (page - 1) * limit;

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          _count: {
            select: {
              transactions: true,
              feedback: true
            }
          }
        }
      }),
      prisma.customer.count({ where })
    ]);

    return {
      customers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    };
  } catch (error) {
    throw error;
  }
};

const getCustomerById = async (customerId) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        transactions: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 10, // Last 10 transactions
          include: {
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    category: true
                  }
                }
              }
            }
          }
        },
        feedback: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 5 // Last 5 feedback entries
        },
        _count: {
          select: {
            transactions: true,
            feedback: true
          }
        }
      }
    });

    if (!customer) {
      throw createError('NOT_FOUND', 'Customer not found', 404);
    }

    return customer;
  } catch (error) {
    throw error;
  }
};

const updateCustomer = async (customerId, updateData) => {
  try {
    // Check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { id: customerId }
    });

    if (!existingCustomer) {
      throw createError('NOT_FOUND', 'Customer not found', 404);
    }

    // Check if email already exists (if being updated)
    if (updateData.email && updateData.email !== existingCustomer.email) {
      const emailExists = await prisma.customer.findUnique({
        where: { email: updateData.email }
      });

      if (emailExists) {
        throw createError('DUPLICATE_ERROR', 'Customer with this email already exists', 409);
      }
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id: customerId },
      data: updateData
    });

    return updatedCustomer;
  } catch (error) {
    throw error;
  }
};

const deleteCustomer = async (customerId) => {
  try {
    // Check if customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: customerId }
    });

    if (!customer) {
      throw createError('NOT_FOUND', 'Customer not found', 404);
    }

    // Check if customer has transaction history
    const transactionCount = await prisma.transaction.count({
      where: { customerId }
    });

    if (transactionCount > 0) {
      throw createError('CONSTRAINT_ERROR', 'Cannot delete customer with transaction history', 409);
    }

    // Delete customer
    await prisma.customer.delete({
      where: { id: customerId }
    });

    return { message: 'Customer deleted successfully' };
  } catch (error) {
    throw error;
  }
};

const getCustomerStats = async () => {
  try {
    const [
      totalCustomers,
      topCustomers,
      averageSpending,
      repeatCustomers
    ] = await Promise.all([
      // Total customers
      prisma.customer.count(),
      
      // Top customers by spending
      prisma.customer.findMany({
        orderBy: {
          totalSpending: 'desc'
        },
        take: 10,
        select: {
          id: true,
          name: true,
          email: true,
          totalSpending: true,
          _count: {
            select: {
              transactions: true
            }
          }
        }
      }),
      
      // Average customer spending
      prisma.customer.aggregate({
        _avg: {
          totalSpending: true
        }
      }),
      
      // Repeat customers (more than 1 transaction)
      prisma.customer.count({
        where: {
          transactions: {
            some: {}
          }
        }
      })
    ]);

    return {
      totalCustomers,
      topCustomers,
      averageSpending: averageSpending._avg.totalSpending || 0,
      repeatCustomers
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  getCustomerStats
};
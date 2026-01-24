const prisma = require('../../prisma/db');
const { createError } = require('../utils/errors');

const createTransaction = async (transactionData, userId, employeeId) => {
  const { items, paymentMode, customerId } = transactionData;

  try {
    // 1. Validate and get product details OUTSIDE the transaction
    const productDetails = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        throw createError('NOT_FOUND', `Product with ID ${item.productId} not found`, 404);
      }

      if (product.quantity < item.quantity) {
        throw createError('INVENTORY_ERROR', 
          `Insufficient stock for ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}`, 
          400
        );
      }

      const subtotal = product.sellingPrice * item.quantity;
      totalAmount += Number(subtotal);

      productDetails.push({
        ...item,
        product,
        priceAtSale: product.sellingPrice,
        subtotal
      });
    }

    // 2. Validate customer if provided OUTSIDE the transaction
    if (customerId) {
      const customer = await prisma.customer.findUnique({
        where: { id: customerId }
      });

      if (!customer) {
        throw createError('NOT_FOUND', 'Customer not found', 404);
      }
    }

    // 3. Start a database transaction with increased timeout
    const result = await prisma.$transaction(async (tx) => {
      // Create the transaction
      const transaction = await tx.transaction.create({
        data: {
          total: totalAmount,
          paymentMode,
          status: 'COMPLETED',
          customerId,
          employeeId,
          userId
        }
      });

      // Create transaction items and update inventory in parallel
      const transactionItemPromises = productDetails.map(async (detail) => {
        // Create transaction item
        const transactionItem = await tx.transactionItem.create({
          data: {
            transactionId: transaction.id,
            productId: detail.productId,
            quantity: detail.quantity,
            priceAtSale: detail.priceAtSale,
            subtotal: detail.subtotal
          }
        });

        // Update product inventory
        await tx.product.update({
          where: { id: detail.productId },
          data: {
            quantity: {
              decrement: detail.quantity
            }
          }
        });

        return transactionItem;
      });

      await Promise.all(transactionItemPromises);

      // Update customer total spending if customer exists
      if (customerId) {
        await tx.customer.update({
          where: { id: customerId },
          data: {
            totalSpending: {
              increment: totalAmount
            }
          }
        });
      }

      return transaction.id;
    }, {
      timeout: 10000 // 10 seconds timeout
    });

    // 4. Return complete transaction with items OUTSIDE the transaction
    return await prisma.transaction.findUnique({
      where: { id: result },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sellingPrice: true,
                costPrice: true,
                category: true
              }
            }
          }
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            isNewCustomer: true
          }
        },
        employee: {
          select: {
            id: true,
            name: true,
            role: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    });
  } catch (error) {
    throw error;
  }
};

const getAllTransactions = async (filters = {}) => {
  try {
    const { 
      startDate, 
      endDate, 
      paymentMode, 
      status, 
      customerId, 
      employeeId,
      page = 1, 
      limit = 10 
    } = filters;

    const where = {};

    // Date range filter
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    // Other filters
    if (paymentMode) where.paymentMode = paymentMode;
    if (status) where.status = status;
    if (customerId) where.customerId = customerId;
    if (employeeId) where.employeeId = employeeId;

    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  sellingPrice: true,
                  costPrice: true,
                  category: true
                }
              }
            }
          },
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              isNewCustomer: true
            }
          },
          employee: {
            select: {
              id: true,
              name: true,
              role: true
            }
          },
          user: {
            select: {
              id: true,
              name: true,
              role: true
            }
          }
        }
      }),
      prisma.transaction.count({ where })
    ]);

    return {
      transactions,
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

const getTransactionById = async (transactionId) => {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                sellingPrice: true,
                costPrice: true,
                category: true,
                imageUrls: true
              }
            }
          }
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            isNewCustomer: true
          }
        },
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    if (!transaction) {
      throw createError('NOT_FOUND', 'Transaction not found', 404);
    }

    return transaction;
  } catch (error) {
    throw error;
  }
};

const updateTransactionStatus = async (transactionId, statusData) => {
  try {
    const { status } = statusData;

    // Check if transaction exists
    const existingTransaction = await getTransactionById(transactionId);

    // Business logic for status transitions
    if (existingTransaction.status === 'COMPLETED' && status === 'REFUNDED') {
      // Handle refund - restore inventory and reduce customer spending
      await prisma.$transaction(async (tx) => {
        // Update transaction status
        await tx.transaction.update({
          where: { id: transactionId },
          data: { status }
        });

        // Restore inventory for each item
        for (const item of existingTransaction.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              quantity: {
                increment: item.quantity
              }
            }
          });
        }

        // Reduce customer spending if customer exists
        if (existingTransaction.customerId) {
          await tx.customer.update({
            where: { id: existingTransaction.customerId },
            data: {
              totalSpending: {
                decrement: Number(existingTransaction.total)
              }
            }
          });
        }
      }, {
        timeout: 10000 // 10 seconds timeout
      });
    } else {
      // Simple status update
      await prisma.transaction.update({
        where: { id: transactionId },
        data: { status }
      });
    }

    // Return updated transaction
    return await getTransactionById(transactionId);
  } catch (error) {
    throw error;
  }
};

const getTransactionStats = async (filters = {}) => {
  try {
    const { startDate, endDate } = filters;
    
    const where = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [
      totalTransactions,
      completedTransactions,
      totalRevenue,
      averageOrderValue,
      paymentModeStats
    ] = await Promise.all([
      // Total transactions
      prisma.transaction.count({ where }),
      
      // Completed transactions
      prisma.transaction.count({ 
        where: { ...where, status: 'COMPLETED' } 
      }),
      
      // Total revenue
      prisma.transaction.aggregate({
        where: { ...where, status: 'COMPLETED' },
        _sum: { total: true }
      }),
      
      // Average order value
      prisma.transaction.aggregate({
        where: { ...where, status: 'COMPLETED' },
        _avg: { total: true }
      }),
      
      // Payment mode breakdown
      prisma.transaction.groupBy({
        by: ['paymentMode'],
        where: { ...where, status: 'COMPLETED' },
        _count: { paymentMode: true },
        _sum: { total: true }
      })
    ]);

    return {
      totalTransactions,
      completedTransactions,
      totalRevenue: totalRevenue._sum.total || 0,
      averageOrderValue: averageOrderValue._avg.total || 0,
      paymentModeStats: paymentModeStats.map(stat => ({
        paymentMode: stat.paymentMode,
        count: stat._count.paymentMode,
        revenue: stat._sum.total || 0
      }))
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransactionStatus,
  getTransactionStats
};
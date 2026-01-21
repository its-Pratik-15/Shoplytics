const prisma = require('../../prisma/db');
const { createError } = require('../utils/errors');

// Most selling products by quantity
const getMostSellingProducts = async (filters = {}) => {
  try {
    const { startDate, endDate, limit = 10 } = filters;
    
    const where = {};
    if (startDate || endDate) {
      where.transaction = {
        createdAt: {}
      };
      if (startDate) where.transaction.createdAt.gte = startDate;
      if (endDate) where.transaction.createdAt.lte = endDate;
      
      // Only completed transactions
      where.transaction.status = 'COMPLETED';
    } else {
      where.transaction = { status: 'COMPLETED' };
    }

    const products = await prisma.transactionItem.groupBy({
      by: ['productId'],
      where,
      _sum: {
        quantity: true
      },
      _count: {
        productId: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: parseInt(limit)
    });

    // Get product details
    const productDetails = await Promise.all(
      products.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name: true,
            category: true,
            price: true,
            imageUrls: true
          }
        });

        return {
          product,
          totalQuantitySold: item._sum.quantity,
          totalTransactions: item._count.productId
        };
      })
    );

    return productDetails;
  } catch (error) {
    throw error;
  }
};

// Highest revenue products
const getHighestRevenueProducts = async (filters = {}) => {
  try {
    const { startDate, endDate, limit = 10 } = filters;
    
    const where = {};
    if (startDate || endDate) {
      where.transaction = {
        createdAt: {}
      };
      if (startDate) where.transaction.createdAt.gte = startDate;
      if (endDate) where.transaction.createdAt.lte = endDate;
      
      where.transaction.status = 'COMPLETED';
    } else {
      where.transaction = { status: 'COMPLETED' };
    }

    const products = await prisma.transactionItem.groupBy({
      by: ['productId'],
      where,
      _sum: {
        subtotal: true,
        quantity: true
      },
      _count: {
        productId: true
      },
      orderBy: {
        _sum: {
          subtotal: 'desc'
        }
      },
      take: parseInt(limit)
    });

    // Get product details
    const productDetails = await Promise.all(
      products.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name: true,
            category: true,
            price: true,
            imageUrls: true
          }
        });

        return {
          product,
          totalRevenue: item._sum.subtotal,
          totalQuantitySold: item._sum.quantity,
          totalTransactions: item._count.productId
        };
      })
    );

    return productDetails;
  } catch (error) {
    throw error;
  }
};

// Customer analytics
const getCustomerAnalytics = async (filters = {}) => {
  try {
    const { startDate, endDate } = filters;
    
    const transactionWhere = { status: 'COMPLETED' };
    if (startDate || endDate) {
      transactionWhere.createdAt = {};
      if (startDate) transactionWhere.createdAt.gte = startDate;
      if (endDate) transactionWhere.createdAt.lte = endDate;
    }

    const [
      totalCustomers,
      customersWithPurchases,
      topCustomers,
      repeatCustomers,
      oneTimeCustomers
    ] = await Promise.all([
      // Total customers
      prisma.customer.count(),
      
      // Customers who made purchases in the period
      prisma.customer.count({
        where: {
          transactions: {
            some: transactionWhere
          }
        }
      }),
      
      // Top customers by spending
      prisma.customer.findMany({
        where: {
          transactions: {
            some: transactionWhere
          }
        },
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
      
      // Repeat customers (more than 1 transaction)
      prisma.customer.count({
        where: {
          transactions: {
            some: transactionWhere
          },
          AND: {
            transactions: {
              some: {
                AND: [
                  transactionWhere,
                  {
                    id: {
                      not: undefined // This ensures we're looking for customers with multiple transactions
                    }
                  }
                ]
              }
            }
          }
        }
      }),
      
      // One-time customers
      prisma.$queryRaw`
        SELECT COUNT(DISTINCT c.id) as count
        FROM customers c
        WHERE (
          SELECT COUNT(*)
          FROM transactions t
          WHERE t."customerId" = c.id
          AND t.status = 'COMPLETED'
          ${startDate ? `AND t."createdAt" >= ${startDate}` : ''}
          ${endDate ? `AND t."createdAt" <= ${endDate}` : ''}
        ) = 1
      `
    ]);

    return {
      totalCustomers,
      customersWithPurchases,
      topCustomers,
      repeatCustomers,
      oneTimeCustomers: oneTimeCustomers[0]?.count || 0
    };
  } catch (error) {
    throw error;
  }
};

// Sales trends (daily/monthly)
const getSalesTrends = async (filters = {}) => {
  try {
    const { period = 'daily', startDate, endDate } = filters;
    
    let dateFormat;
    let groupBy;
    
    if (period === 'monthly') {
      dateFormat = 'YYYY-MM';
      groupBy = `DATE_TRUNC('month', "createdAt")`;
    } else {
      dateFormat = 'YYYY-MM-DD';
      groupBy = `DATE_TRUNC('day', "createdAt")`;
    }

    const where = { status: 'COMPLETED' };
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    // Get sales data grouped by period
    const salesData = await prisma.$queryRaw`
      SELECT 
        ${groupBy} as period,
        COUNT(*)::int as transaction_count,
        SUM(total)::decimal as total_revenue,
        AVG(total)::decimal as avg_order_value
      FROM transactions
      WHERE status = 'COMPLETED'
      ${startDate ? `AND "createdAt" >= ${startDate}` : ''}
      ${endDate ? `AND "createdAt" <= ${endDate}` : ''}
      GROUP BY ${groupBy}
      ORDER BY period ASC
    `;

    return salesData.map(item => ({
      period: item.period,
      transactionCount: item.transaction_count,
      totalRevenue: parseFloat(item.total_revenue || 0),
      avgOrderValue: parseFloat(item.avg_order_value || 0)
    }));
  } catch (error) {
    throw error;
  }
};

// Feedback vs spending insights
const getFeedbackSpendingInsights = async (filters = {}) => {
  try {
    const { startDate, endDate } = filters;
    
    const where = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [
      feedbackByRating,
      avgSpendingByRating,
      topSpendersWithFeedback
    ] = await Promise.all([
      // Feedback distribution by rating
      prisma.feedback.groupBy({
        by: ['rating'],
        where,
        _count: { rating: true },
        orderBy: { rating: 'asc' }
      }),
      
      // Average spending by rating
      prisma.$queryRaw`
        SELECT 
          f.rating,
          AVG(c."totalSpending")::decimal as avg_spending,
          COUNT(DISTINCT c.id)::int as customer_count
        FROM feedback f
        JOIN customers c ON f."customerId" = c.id
        ${startDate || endDate ? 'WHERE' : ''}
        ${startDate ? `f."createdAt" >= ${startDate}` : ''}
        ${startDate && endDate ? 'AND' : ''}
        ${endDate ? `f."createdAt" <= ${endDate}` : ''}
        GROUP BY f.rating
        ORDER BY f.rating ASC
      `,
      
      // Top spending customers with their feedback
      prisma.customer.findMany({
        where: {
          feedback: {
            some: where
          }
        },
        orderBy: {
          totalSpending: 'desc'
        },
        take: 10,
        select: {
          id: true,
          name: true,
          email: true,
          totalSpending: true,
          feedback: {
            where,
            select: {
              rating: true,
              comment: true,
              createdAt: true
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 1
          }
        }
      })
    ];

    return {
      feedbackDistribution: feedbackByRating.map(item => ({
        rating: item.rating,
        count: item._count.rating
      })),
      avgSpendingByRating: avgSpendingByRating.map(item => ({
        rating: item.rating,
        avgSpending: parseFloat(item.avg_spending || 0),
        customerCount: item.customer_count
      })),
      topSpendersWithFeedback
    };
  } catch (error) {
    throw error;
  }
};

// Comprehensive dashboard overview
const getDashboardOverview = async (filters = {}) => {
  try {
    const { startDate, endDate } = filters;
    
    const transactionWhere = { status: 'COMPLETED' };
    if (startDate || endDate) {
      transactionWhere.createdAt = {};
      if (startDate) transactionWhere.createdAt.gte = startDate;
      if (endDate) transactionWhere.createdAt.lte = endDate;
    }

    const [
      totalRevenue,
      totalTransactions,
      totalCustomers,
      averageOrderValue,
      averageRating,
      lowStockProducts,
      recentTransactions
    ] = await Promise.all([
      // Total revenue
      prisma.transaction.aggregate({
        where: transactionWhere,
        _sum: { total: true }
      }),
      
      // Total transactions
      prisma.transaction.count({
        where: transactionWhere
      }),
      
      // Total customers with purchases
      prisma.customer.count({
        where: {
          transactions: {
            some: transactionWhere
          }
        }
      }),
      
      // Average order value
      prisma.transaction.aggregate({
        where: transactionWhere,
        _avg: { total: true }
      }),
      
      // Average customer rating
      prisma.feedback.aggregate({
        _avg: { rating: true }
      }),
      
      // Low stock products
      prisma.product.count({
        where: {
          quantity: {
            lte: 10
          }
        }
      }),
      
      // Recent transactions
      prisma.transaction.findMany({
        where: transactionWhere,
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: {
              name: true,
              email: true
            }
          },
          items: {
            take: 3,
            include: {
              product: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      })
    ];

    return {
      totalRevenue: totalRevenue._sum.total || 0,
      totalTransactions,
      totalCustomers,
      averageOrderValue: averageOrderValue._avg.total || 0,
      averageRating: averageRating._avg.rating || 0,
      lowStockProducts,
      recentTransactions
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getMostSellingProducts,
  getHighestRevenueProducts,
  getCustomerAnalytics,
  getSalesTrends,
  getFeedbackSpendingInsights,
  getDashboardOverview
};
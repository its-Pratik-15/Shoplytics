const prisma = require('../../prisma/db');

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
          totalRevenue: parseFloat(item._sum.subtotal || 0),
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
      repeatCustomers
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
      
      // Repeat customers (customers with more than 1 transaction)
      prisma.customer.count({
        where: {
          transactions: {
            some: transactionWhere
          }
        }
      })
    ]);

    // Calculate one-time customers (simplified approach)
    const oneTimeCustomers = Math.max(0, customersWithPurchases - repeatCustomers);

    return {
      totalCustomers,
      customersWithPurchases,
      topCustomers,
      repeatCustomers,
      oneTimeCustomers
    };
  } catch (error) {
    throw error;
  }
};

// Sales trends (daily/monthly)
const getSalesTrends = async (filters = {}) => {
  try {
    const { period = 'daily', startDate, endDate } = filters;
    
    const where = { status: 'COMPLETED' };
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    // Get all transactions and group them in JavaScript for simplicity
    const transactions = await prisma.transaction.findMany({
      where,
      select: {
        createdAt: true,
        total: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Group by period
    const groupedData = {};
    transactions.forEach(transaction => {
      let periodKey;
      if (period === 'monthly') {
        periodKey = transaction.createdAt.toISOString().substring(0, 7); // YYYY-MM
      } else {
        periodKey = transaction.createdAt.toISOString().substring(0, 10); // YYYY-MM-DD
      }

      if (!groupedData[periodKey]) {
        groupedData[periodKey] = {
          period: periodKey,
          transactionCount: 0,
          totalRevenue: 0,
          totalAmount: 0
        };
      }

      groupedData[periodKey].transactionCount++;
      groupedData[periodKey].totalRevenue += parseFloat(transaction.total || 0);
      groupedData[periodKey].totalAmount += parseFloat(transaction.total || 0);
    });

    // Calculate averages and return sorted data
    return Object.values(groupedData).map(item => ({
      period: item.period,
      transactionCount: item.transactionCount,
      totalRevenue: parseFloat(item.totalRevenue.toFixed(2)),
      avgOrderValue: item.transactionCount > 0 ? parseFloat((item.totalAmount / item.transactionCount).toFixed(2)) : 0
    })).sort((a, b) => a.period.localeCompare(b.period));
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
      customersWithFeedback,
      topSpendersWithFeedback
    ] = await Promise.all([
      // Feedback distribution by rating
      prisma.feedback.groupBy({
        by: ['rating'],
        where,
        _count: { rating: true },
        orderBy: { rating: 'asc' }
      }),
      
      // Get customers with feedback to calculate average spending by rating
      prisma.customer.findMany({
        where: {
          feedback: {
            some: where
          }
        },
        include: {
          feedback: {
            where,
            select: {
              rating: true
            }
          }
        }
      }),
      
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
    ]);

    // Calculate average spending by rating
    const spendingByRating = {};
    customersWithFeedback.forEach(customer => {
      customer.feedback.forEach(feedback => {
        if (!spendingByRating[feedback.rating]) {
          spendingByRating[feedback.rating] = {
            totalSpending: 0,
            customerCount: 0
          };
        }
        spendingByRating[feedback.rating].totalSpending += parseFloat(customer.totalSpending || 0);
        spendingByRating[feedback.rating].customerCount++;
      });
    });

    const avgSpendingByRating = Object.keys(spendingByRating).map(rating => ({
      rating: parseInt(rating),
      avgSpending: spendingByRating[rating].customerCount > 0 
        ? parseFloat((spendingByRating[rating].totalSpending / spendingByRating[rating].customerCount).toFixed(2))
        : 0,
      customerCount: spendingByRating[rating].customerCount
    })).sort((a, b) => a.rating - b.rating);

    return {
      feedbackDistribution: feedbackByRating.map(item => ({
        rating: item.rating,
        count: item._count.rating
      })),
      avgSpendingByRating,
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
    ]);

    return {
      totalRevenue: parseFloat(totalRevenue._sum.total || 0),
      totalTransactions,
      totalCustomers,
      averageOrderValue: parseFloat(averageOrderValue._avg.total || 0),
      averageRating: parseFloat(averageRating._avg.rating || 0),
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
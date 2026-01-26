const prisma = require('../../prisma/db');

// Helper function to convert Prisma Decimal to number
const toNumber = (decimal) => {
  if (decimal === null || decimal === undefined) return 0;
  return Number(decimal.toString());
};

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
            sellingPrice: true,
            costPrice: true,
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
            sellingPrice: true,
            costPrice: true,
            imageUrls: true
          }
        });

        return {
          product,
          totalRevenue: toNumber(item._sum.subtotal),
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
      topCustomers
    ] = await Promise.all([
      // Total customers
      prisma.customer.count(),
      
      // Customers who made purchases in the period with transaction counts
      prisma.customer.findMany({
        where: {
          transactions: {
            some: transactionWhere
          }
        },
        select: {
          id: true,
          isNewCustomer: true,
          _count: {
            select: {
              transactions: {
                where: transactionWhere
              }
            }
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
          isNewCustomer: true,
          _count: {
            select: {
              transactions: true
            }
          }
        }
      })
    ]);

    // Calculate customer segments based on transaction behavior
    let newCustomers = 0;
    let returningCustomers = 0;
    let oneTimeCustomers = 0;
    let repeatCustomers = 0;

    // Also count customers by isNewCustomer field for backward compatibility
    let newCustomersByFlag = 0;
    let oldCustomersByFlag = 0;

    customersWithPurchases.forEach(customer => {
      const transactionCount = customer._count.transactions;
      
      // Count by transaction behavior
      if (transactionCount === 1) {
        newCustomers++;
        oneTimeCustomers++;
      } else if (transactionCount > 1) {
        returningCustomers++;
        repeatCustomers++;
      }

      // Count by isNewCustomer flag for backward compatibility
      if (customer.isNewCustomer) {
        newCustomersByFlag++;
      } else {
        oldCustomersByFlag++;
      }
    });

    return {
      totalCustomers,
      newCustomers: newCustomersByFlag, // Keep using flag for consistency with existing UI
      oldCustomers: oldCustomersByFlag, // Keep using flag for consistency with existing UI
      customersWithPurchases: customersWithPurchases.length,
      topCustomers,
      repeatCustomers,
      oneTimeCustomers,
      // Add new metrics based on transaction behavior
      newCustomersByBehavior: newCustomers,
      returningCustomersByBehavior: returningCustomers
    };
  } catch (error) {
    throw error;
  }
};

// Sales trends (daily/monthly) with chart-ready format
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
      groupedData[periodKey].totalRevenue += toNumber(transaction.total);
      groupedData[periodKey].totalAmount += toNumber(transaction.total);
    });

    // Calculate averages and return sorted data
    const trendsData = Object.values(groupedData).map(item => ({
      period: item.period,
      transactionCount: item.transactionCount,
      totalRevenue: Number(item.totalRevenue.toFixed(2)),
      avgOrderValue: item.transactionCount > 0 ? Number((item.totalAmount / item.transactionCount).toFixed(2)) : 0
    })).sort((a, b) => a.period.localeCompare(b.period));

    // Format for Chart.js
    const chartData = {
      labels: trendsData.map(item => {
        const date = new Date(item.period);
        return period === 'monthly' 
          ? date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
          : date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      }),
      datasets: [
        {
          label: 'Revenue (₹)',
          data: trendsData.map(item => item.totalRevenue),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
          yAxisID: 'y'
        },
        {
          label: 'Transactions',
          data: trendsData.map(item => item.transactionCount),
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: false,
          tension: 0.4,
          yAxisID: 'y1'
        }
      ]
    };

    return {
      data: trendsData,
      chartData
    };
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
        spendingByRating[feedback.rating].totalSpending += toNumber(customer.totalSpending);
        spendingByRating[feedback.rating].customerCount++;
      });
    });

    const avgSpendingByRating = Object.keys(spendingByRating).map(rating => ({
      rating: parseInt(rating),
      avgSpending: spendingByRating[rating].customerCount > 0 
        ? Number((spendingByRating[rating].totalSpending / spendingByRating[rating].customerCount).toFixed(2))
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
      totalRevenue: toNumber(totalRevenue._sum.total),
      totalTransactions,
      totalCustomers,
      averageOrderValue: toNumber(averageOrderValue._avg.total),
      averageRating: toNumber(averageRating._avg.rating),
      lowStockProducts,
      recentTransactions
    };
  } catch (error) {
    throw error;
  }
};

// Get category-wise sales data for charts
const getCategorySalesData = async (filters = {}) => {
  try {
    const { startDate, endDate } = filters;
    
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

    const categoryData = await prisma.transactionItem.groupBy({
      by: ['productId'],
      where,
      _sum: {
        subtotal: true,
        quantity: true
      }
    });

    // Get product categories
    const productCategories = {};
    for (const item of categoryData) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { category: true }
      });
      
      if (product) {
        if (!productCategories[product.category]) {
          productCategories[product.category] = {
            revenue: 0,
            quantity: 0
          };
        }
        productCategories[product.category].revenue += toNumber(item._sum.subtotal);
        productCategories[product.category].quantity += item._sum.quantity;
      }
    }

    const categories = Object.keys(productCategories);
    const revenues = Object.values(productCategories).map(cat => cat.revenue);
    const quantities = Object.values(productCategories).map(cat => cat.quantity);

    // Chart data for doughnut chart
    const chartData = {
      labels: categories,
      datasets: [
        {
          label: 'Revenue by Category',
          data: revenues,
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(236, 72, 153, 0.8)',
            'rgba(6, 182, 212, 0.8)',
            'rgba(34, 197, 94, 0.8)'
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(139, 92, 246, 1)',
            'rgba(236, 72, 153, 1)',
            'rgba(6, 182, 212, 1)',
            'rgba(34, 197, 94, 1)'
          ],
          borderWidth: 2
        }
      ]
    };

    return {
      data: Object.entries(productCategories).map(([category, data]) => ({
        category,
        revenue: data.revenue,
        quantity: data.quantity
      })),
      chartData
    };
  } catch (error) {
    throw error;
  }
};

// Get customer loyalty statistics for dashboard
const getCustomerLoyaltyStats = async (filters = {}) => {
  try {
    const { startDate, endDate } = filters;
    
    const transactionWhere = { status: 'COMPLETED' };
    if (startDate || endDate) {
      transactionWhere.createdAt = {};
      if (startDate) transactionWhere.createdAt.gte = startDate;
      if (endDate) transactionWhere.createdAt.lte = endDate;
    }

    // Get all customers with their visit counts
    const customers = await prisma.customer.findMany({
      select: {
        id: true,
        name: true,
        visitCount: true,
        totalSpending: true,
        isNewCustomer: true
      }
    });

    // Categorize customers by loyalty
    let newCustomers = 0;
    let regularCustomers = 0;
    let loyalCustomers = 0;
    let totalSpendingByLoyalty = {
      new: 0,
      regular: 0,
      loyal: 0
    };

    customers.forEach(customer => {
      const visitCount = customer.visitCount || 0;
      const spending = toNumber(customer.totalSpending);

      if (visitCount === 0) {
        newCustomers++;
        totalSpendingByLoyalty.new += spending;
      } else if (visitCount < 3) {
        regularCustomers++;
        totalSpendingByLoyalty.regular += spending;
      } else {
        loyalCustomers++;
        totalSpendingByLoyalty.loyal += spending;
      }
    });

    const avgSpendingByLoyalty = {
      new: newCustomers > 0 ? totalSpendingByLoyalty.new / newCustomers : 0,
      regular: regularCustomers > 0 ? totalSpendingByLoyalty.regular / regularCustomers : 0,
      loyal: loyalCustomers > 0 ? totalSpendingByLoyalty.loyal / loyalCustomers : 0
    };

    return {
      totalCustomers: customers.length,
      newCustomers,
      regularCustomers,
      loyalCustomers,
      avgSpendingByLoyalty,
      loyaltyDistribution: {
        labels: ['New Customers', 'Regular Customers', 'Loyal Customers'],
        data: [newCustomers, regularCustomers, loyalCustomers],
        backgroundColor: ['#10B981', '#3B82F6', '#8B5CF6']
      }
    };
  } catch (error) {
    throw error;
  }
};

// Get top products data for bar chart
const getTopProductsChartData = async (filters = {}) => {
  try {
    const { startDate, endDate, limit = 10, type = 'revenue' } = filters;
    
    let products;
    if (type === 'quantity') {
      products = await getMostSellingProducts({ startDate, endDate, limit });
    } else {
      products = await getHighestRevenueProducts({ startDate, endDate, limit });
    }

    const labels = products.map(item => item.product.name);
    const data = products.map(item => 
      type === 'quantity' ? item.totalQuantitySold : item.totalRevenue
    );

    const chartData = {
      labels,
      datasets: [
        {
          label: type === 'quantity' ? 'Quantity Sold' : 'Revenue (₹)',
          data,
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false
        }
      ]
    };

    return {
      data: products,
      chartData
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
  getDashboardOverview,
  getCategorySalesData,
  getCustomerLoyaltyStats,
  getTopProductsChartData
};
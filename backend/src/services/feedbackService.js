const prisma = require('../../prisma/db');
const { createError } = require('../utils/errors');

const createPublicFeedback = async (feedbackData) => {
  try {
    const { customerName, email, phone, rating, comment } = feedbackData;

    // Find or create customer
    let customer;
    
    if (email) {
      // Try to find existing customer by email
      customer = await prisma.customer.findUnique({
        where: { email }
      });
    }
    
    if (!customer) {
      // Create new customer
      customer = await prisma.customer.create({
        data: {
          name: customerName,
          email: email || null,
          phone: phone || null,
          isNewCustomer: true
        }
      });
    }

    // Create feedback
    const feedback = await prisma.feedback.create({
      data: {
        customerId: customer.id,
        rating,
        comment
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            isNewCustomer: true
          }
        }
      }
    });

    return feedback;
  } catch (error) {
    throw error;
  }
};

const createFeedback = async (feedbackData) => {
  try {
    const { customerId, rating, comment } = feedbackData;

    // Verify customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: customerId }
    });

    if (!customer) {
      throw createError('NOT_FOUND', 'Customer not found', 404);
    }

    // Check if customer has made any purchases (business rule: only buyers can leave feedback)
    const customerTransactions = await prisma.transaction.count({
      where: { 
        customerId,
        status: 'COMPLETED'
      }
    });

    if (customerTransactions === 0) {
      throw createError('BUSINESS_RULE_ERROR', 'Only customers with completed purchases can leave feedback', 403);
    }

    // Create feedback
    const feedback = await prisma.feedback.create({
      data: {
        customerId,
        rating,
        comment
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            isNewCustomer: true
          }
        }
      }
    });

    return feedback;
  } catch (error) {
    throw error;
  }
};

const getAllFeedback = async (filters = {}) => {
  try {
    const { 
      rating, 
      customerId, 
      startDate, 
      endDate, 
      page = 1, 
      limit = 10 
    } = filters;

    const where = {};

    // Rating filter
    if (rating) {
      where.rating = rating;
    }

    // Customer filter
    if (customerId) {
      where.customerId = customerId;
    }

    // Date range filter
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const skip = (page - 1) * limit;

    const [feedback, total] = await Promise.all([
      prisma.feedback.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              totalSpending: true,
              isNewCustomer: true
            }
          }
        }
      }),
      prisma.feedback.count({ where })
    ]);

    return {
      feedback,
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

const getFeedbackById = async (feedbackId) => {
  try {
    const feedback = await prisma.feedback.findUnique({
      where: { id: feedbackId },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            totalSpending: true,
            isNewCustomer: true,
            _count: {
              select: {
                transactions: true
              }
            }
          }
        }
      }
    });

    if (!feedback) {
      throw createError('NOT_FOUND', 'Feedback not found', 404);
    }

    return feedback;
  } catch (error) {
    throw error;
  }
};

const updateFeedback = async (feedbackId, updateData, customerId) => {
  try {
    // Check if feedback exists
    const existingFeedback = await prisma.feedback.findUnique({
      where: { id: feedbackId }
    });

    if (!existingFeedback) {
      throw createError('NOT_FOUND', 'Feedback not found', 404);
    }

    // Check if the customer owns this feedback
    if (existingFeedback.customerId !== customerId) {
      throw createError('FORBIDDEN', 'You can only update your own feedback', 403);
    }

    // Update feedback
    const updatedFeedback = await prisma.feedback.update({
      where: { id: feedbackId },
      data: updateData,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            isNewCustomer: true
          }
        }
      }
    });

    return updatedFeedback;
  } catch (error) {
    throw error;
  }
};

const deleteFeedback = async (feedbackId, customerId, isAdmin = false) => {
  try {
    // Check if feedback exists
    const feedback = await prisma.feedback.findUnique({
      where: { id: feedbackId }
    });

    if (!feedback) {
      throw createError('NOT_FOUND', 'Feedback not found', 404);
    }

    // Check permissions (customer can delete own feedback, admin can delete any)
    if (!isAdmin && feedback.customerId !== customerId) {
      throw createError('FORBIDDEN', 'You can only delete your own feedback', 403);
    }

    // Delete feedback
    await prisma.feedback.delete({
      where: { id: feedbackId }
    });

    return { message: 'Feedback deleted successfully' };
  } catch (error) {
    throw error;
  }
};

const getFeedbackStats = async (filters = {}) => {
  try {
    const { startDate, endDate } = filters;
    
    const where = {};
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [
      totalFeedback,
      averageRating,
      ratingDistribution,
      recentFeedback
    ] = await Promise.all([
      // Total feedback count
      prisma.feedback.count({ where }),
      
      // Average rating
      prisma.feedback.aggregate({
        where,
        _avg: { rating: true }
      }),
      
      // Rating distribution
      prisma.feedback.groupBy({
        by: ['rating'],
        where,
        _count: { rating: true },
        orderBy: { rating: 'asc' }
      }),
      
      // Recent feedback (last 10)
      prisma.feedback.findMany({
        where,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              totalSpending: true
            }
          }
        }
      })
    ]);

    return {
      totalFeedback,
      averageRating: averageRating._avg.rating || 0,
      ratingDistribution: ratingDistribution.map(item => ({
        rating: item.rating,
        count: item._count.rating
      })),
      recentFeedback
    };
  } catch (error) {
    throw error;
  }
};

const getFeedbackByCustomer = async (customerId) => {
  try {
    // Verify customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: customerId }
    });

    if (!customer) {
      throw createError('NOT_FOUND', 'Customer not found', 404);
    }

    const feedback = await prisma.feedback.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            isNewCustomer: true
          }
        }
      }
    });

    return feedback;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createPublicFeedback,
  createFeedback,
  getAllFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
  getFeedbackStats,
  getFeedbackByCustomer
};
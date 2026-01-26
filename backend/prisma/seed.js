const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding with Indian products...');

  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@shoplytics.com' },
    update: {},
    create: {
      email: 'admin@shoplytics.com',
      password: hashedPassword,
      name: 'Rajesh Kumar',
      role: 'OWNER'
    }
  });

  // Create default employee
  const employeePassword = await bcrypt.hash('cashier123', 10);
  
  const employee = await prisma.employee.upsert({
    where: { email: 'cashier@shoplytics.com' },
    update: {},
    create: {
      email: 'cashier@shoplytics.com',
      password: employeePassword,
      name: 'Priya Sharma',
      role: 'CASHIER'
    }
  });

  // Create sample Indian products with INR pricing
  const products = [
    {
      name: 'Tata Tea Gold',
      description: 'Premium black tea blend 500g pack',
      sellingPrice: 285.00,
      costPrice: 228.00,
      quantity: 150,
      category: 'Beverages',
      sku: 'TEA001'
    },
    {
      name: 'Amul Butter',
      description: 'Fresh salted butter 500g pack',
      sellingPrice: 240.00,
      costPrice: 192.00,
      quantity: 80,
      category: 'Dairy',
      sku: 'BUTTER001'
    },
    {
      name: 'Basmati Rice',
      description: 'Premium aged basmati rice 5kg bag',
      sellingPrice: 850.00,
      costPrice: 680.00,
      quantity: 45,
      category: 'Grains',
      sku: 'RICE001'
    },
    {
      name: 'Maggi Noodles',
      description: 'Masala instant noodles 2-minute pack',
      sellingPrice: 14.00,
      costPrice: 11.20,
      quantity: 200,
      category: 'Instant Food',
      sku: 'NOODLES001'
    },
    {
      name: 'Parle-G Biscuits',
      description: 'Glucose biscuits family pack 800g',
      sellingPrice: 85.00,
      costPrice: 68.00,
      quantity: 120,
      category: 'Biscuits',
      sku: 'BISCUIT001'
    },
    {
      name: 'Surf Excel Detergent',
      description: 'Matic front load washing powder 2kg',
      sellingPrice: 485.00,
      costPrice: 388.00,
      quantity: 60,
      category: 'Household',
      sku: 'DETERGENT001'
    },
    {
      name: 'Haldiram Namkeen',
      description: 'Aloo Bhujia spicy snack 400g pack',
      sellingPrice: 120.00,
      costPrice: 96.00,
      quantity: 90,
      category: 'Snacks',
      sku: 'NAMKEEN001'
    },
    {
      name: 'Dabur Honey',
      description: 'Pure natural honey 500g bottle',
      sellingPrice: 320.00,
      costPrice: 256.00,
      quantity: 70,
      category: 'Health',
      sku: 'HONEY001'
    },
    {
      name: 'Britannia Bread',
      description: 'White bread loaf 400g pack',
      sellingPrice: 28.00,
      costPrice: 22.40,
      quantity: 100,
      category: 'Bakery',
      sku: 'BREAD001'
    },
    {
      name: 'Colgate Toothpaste',
      description: 'Strong teeth toothpaste 200g tube',
      sellingPrice: 95.00,
      costPrice: 76.00,
      quantity: 85,
      category: 'Personal Care',
      sku: 'TOOTHPASTE001'
    },
    {
      name: 'Patanjali Atta',
      description: 'Whole wheat flour 10kg bag',
      sellingPrice: 420.00,
      costPrice: 336.00,
      quantity: 35,
      category: 'Grains',
      sku: 'ATTA001'
    },
    {
      name: 'MTR Ready Mix',
      description: 'Rava Idli instant mix 500g pack',
      sellingPrice: 85.00,
      costPrice: 68.00,
      quantity: 65,
      category: 'Instant Food',
      sku: 'READYMIX001'
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: product
    });
  }

  // Create sample Indian customers with visit counts
  const customers = [
    {
      name: 'Amit Patel',
      email: 'amit.patel@gmail.com',
      phone: '+91-9876543210',
      address: '15, MG Road, Bangalore, Karnataka 560001',
      isNewCustomer: false // Old customer
    },
    {
      name: 'Sunita Devi',
      email: 'sunita.devi@yahoo.com',
      phone: '+91-8765432109',
      address: '42, Connaught Place, New Delhi, Delhi 110001',
      isNewCustomer: true // New customer
    },
    {
      name: 'Vikram Singh',
      email: 'vikram.singh@hotmail.com',
      phone: '+91-7654321098',
      address: '78, Park Street, Kolkata, West Bengal 700016',
      isNewCustomer: false // Old customer
    },
    {
      name: 'Meera Nair',
      email: 'meera.nair@gmail.com',
      phone: '+91-6543210987',
      address: '23, Marine Drive, Mumbai, Maharashtra 400002',
      isNewCustomer: true // New customer
    },
    {
      name: 'Ravi Kumar',
      email: 'ravi.kumar@gmail.com',
      phone: '+91-9988776655',
      address: '67, Anna Salai, Chennai, Tamil Nadu 600002',
      isNewCustomer: false // Old customer
    },
    {
      name: 'Anjali Gupta',
      email: 'anjali.gupta@outlook.com',
      phone: '+91-8877665544',
      address: '89, Civil Lines, Jaipur, Rajasthan 302006',
      isNewCustomer: true // New customer
    },
    {
      name: 'Deepak Sharma',
      email: 'deepak.sharma@gmail.com',
      phone: '+91-7766554433',
      address: '45, Sector 15, Gurgaon, Haryana 122001',
      isNewCustomer: false // Old customer
    },
    {
      name: 'Kavya Reddy',
      email: 'kavya.reddy@yahoo.com',
      phone: '+91-6655443322',
      address: '12, Banjara Hills, Hyderabad, Telangana 500034',
      isNewCustomer: true // New customer
    }
  ];

  for (const customerData of customers) {
    await prisma.customer.upsert({
      where: { email: customerData.email },
      update: {},
      create: customerData
    });
  }

  // Create sample transactions with Indian products
  const createdProducts = await prisma.product.findMany();
  const createdCustomers = await prisma.customer.findMany();

  if (createdProducts.length > 0 && createdCustomers.length > 0) {
    // Diverse transactions for Amit Patel (5 visits - Loyal)
    const amitTransactions = [
      { products: [0, 4], quantities: [1, 2], total: 455.00, payment: 'UPI' }, // Tea + Biscuits
      { products: [2, 8], quantities: [1, 3], total: 934.00, payment: 'CASH' }, // Rice + Bread
      { products: [1, 7], quantities: [2, 1], total: 800.00, payment: 'UPI' }, // Butter + Honey
      { products: [5, 9], quantities: [1, 2], total: 675.00, payment: 'CARD' }, // Detergent + Toothpaste
      { products: [6, 11], quantities: [2, 3], total: 495.00, payment: 'UPI' } // Namkeen + Ready Mix
    ];

    for (let i = 0; i < amitTransactions.length; i++) {
      const txn = amitTransactions[i];
      await prisma.transaction.create({
        data: {
          customerId: createdCustomers[0].id,
          total: txn.total,
          paymentMode: txn.payment,
          status: 'COMPLETED',
          items: {
            create: txn.products.map((productIndex, idx) => ({
              productId: createdProducts[productIndex].id,
              quantity: txn.quantities[idx],
              priceAtSale: createdProducts[productIndex].sellingPrice,
              subtotal: createdProducts[productIndex].sellingPrice * txn.quantities[idx]
            }))
          }
        }
      });
    }

    // Single transaction for Sunita Devi (1 visit - Regular)
    await prisma.transaction.create({
      data: {
        customerId: createdCustomers[1].id,
        total: 1235.00,
        paymentMode: 'CASH',
        status: 'COMPLETED',
        items: {
          create: [
            {
              productId: createdProducts[2].id, // Basmati Rice
              quantity: 1,
              priceAtSale: 850.00,
              subtotal: 850.00
            },
            {
              productId: createdProducts[5].id, // Surf Excel
              quantity: 1,
              priceAtSale: 485.00,
              subtotal: 485.00
            }
          ]
        }
      }
    });

    // Diverse transactions for Vikram Singh (8 visits - Very Loyal)
    const vikramTransactions = [
      { products: [7, 1], quantities: [1, 1], total: 560.00, payment: 'UPI' },
      { products: [0, 3], quantities: [2, 10], total: 710.00, payment: 'CARD' },
      { products: [10, 8], quantities: [1, 2], total: 476.00, payment: 'CASH' },
      { products: [4, 9], quantities: [3, 1], total: 350.00, payment: 'UPI' },
      { products: [6, 11], quantities: [1, 2], total: 290.00, payment: 'CARD' },
      { products: [2], quantities: [1], total: 850.00, payment: 'CASH' },
      { products: [5, 7], quantities: [1, 1], total: 805.00, payment: 'UPI' },
      { products: [1, 4, 3], quantities: [1, 1, 5], total: 395.00, payment: 'CARD' }
    ];

    for (let i = 0; i < vikramTransactions.length; i++) {
      const txn = vikramTransactions[i];
      await prisma.transaction.create({
        data: {
          customerId: createdCustomers[2].id,
          total: txn.total,
          paymentMode: txn.payment,
          status: 'COMPLETED',
          items: {
            create: txn.products.map((productIndex, idx) => ({
              productId: createdProducts[productIndex].id,
              quantity: txn.quantities[idx],
              priceAtSale: createdProducts[productIndex].sellingPrice,
              subtotal: createdProducts[productIndex].sellingPrice * txn.quantities[idx]
            }))
          }
        }
      });
    }

    // Two diverse transactions for Meera Nair (2 visits - Regular)
    const meeraTransactions = [
      { products: [10, 8, 3], quantities: [1, 1, 3], total: 490.00, payment: 'UPI' },
      { products: [0, 4, 9], quantities: [1, 1, 1], total: 465.00, payment: 'CARD' }
    ];

    for (let i = 0; i < meeraTransactions.length; i++) {
      const txn = meeraTransactions[i];
      await prisma.transaction.create({
        data: {
          customerId: createdCustomers[3].id,
          total: txn.total,
          paymentMode: txn.payment,
          status: 'COMPLETED',
          items: {
            create: txn.products.map((productIndex, idx) => ({
              productId: createdProducts[productIndex].id,
              quantity: txn.quantities[idx],
              priceAtSale: createdProducts[productIndex].sellingPrice,
              subtotal: createdProducts[productIndex].sellingPrice * txn.quantities[idx]
            }))
          }
        }
      });
    }

    // Diverse transactions for Ravi Kumar (5 visits - Loyal Customer, reduced from 12)
    const raviTransactions = [
      { products: [6, 11, 3], quantities: [3, 2, 8], total: 632.00, payment: 'UPI' },
      { products: [2, 5], quantities: [1, 1], total: 1335.00, payment: 'CARD' },
      { products: [0, 1, 4], quantities: [1, 1, 2], total: 695.00, payment: 'CASH' },
      { products: [7, 9, 8], quantities: [1, 2, 2], total: 624.00, payment: 'BANK_TRANSFER' },
      { products: [10, 0, 4], quantities: [1, 1, 1], total: 790.00, payment: 'UPI' }
    ];

    for (let i = 0; i < raviTransactions.length; i++) {
      const txn = raviTransactions[i];
      await prisma.transaction.create({
        data: {
          customerId: createdCustomers[4].id,
          total: txn.total,
          paymentMode: txn.payment,
          status: 'COMPLETED',
          items: {
            create: txn.products.map((productIndex, idx) => ({
              productId: createdProducts[productIndex].id,
              quantity: txn.quantities[idx],
              priceAtSale: createdProducts[productIndex].sellingPrice,
              subtotal: createdProducts[productIndex].sellingPrice * txn.quantities[idx]
            }))
          }
        }
      });
    }

    // Three transactions for Deepak Sharma (3 visits - Exactly Loyal threshold)
    const deepakTransactions = [
      { products: [0, 4, 8], quantities: [2, 1, 3], total: 739.00, payment: 'UPI' },
      { products: [2, 7], quantities: [1, 1], total: 1170.00, payment: 'CARD' },
      { products: [5, 9, 11], quantities: [1, 1, 2], total: 750.00, payment: 'CASH' }
    ];

    for (let i = 0; i < deepakTransactions.length; i++) {
      const txn = deepakTransactions[i];
      await prisma.transaction.create({
        data: {
          customerId: createdCustomers[6].id, // Deepak Sharma
          total: txn.total,
          paymentMode: txn.payment,
          status: 'COMPLETED',
          items: {
            create: txn.products.map((productIndex, idx) => ({
              productId: createdProducts[productIndex].id,
              quantity: txn.quantities[idx],
              priceAtSale: createdProducts[productIndex].sellingPrice,
              subtotal: createdProducts[productIndex].sellingPrice * txn.quantities[idx]
            }))
          }
        }
      });
    }

    // Single transaction for Kavya Reddy (1 visit - Regular)
    await prisma.transaction.create({
      data: {
        customerId: createdCustomers[7].id, // Kavya Reddy
        total: 675.00,
        paymentMode: 'UPI',
        status: 'COMPLETED',
        items: {
          create: [
            {
              productId: createdProducts[1].id, // Amul Butter
              quantity: 2,
              priceAtSale: 240.00,
              subtotal: 480.00
            },
            {
              productId: createdProducts[9].id, // Colgate Toothpaste
              quantity: 2,
              priceAtSale: 95.00,
              subtotal: 190.00
            }
          ]
        }
      }
    });

    // Create diverse feedback from customers
    const feedbackData = [
      {
        customerId: createdCustomers[0].id, // Amit Patel (Loyal)
        rating: 5,
        comment: 'Excellent service and fresh products! Very satisfied with the quality. Been shopping here for months!'
      },
      {
        customerId: createdCustomers[0].id, // Amit Patel (Another feedback)
        rating: 4,
        comment: 'Great variety of products. Sometimes a bit crowded but worth the wait.'
      },
      {
        customerId: createdCustomers[2].id, // Vikram Singh (Very Loyal)
        rating: 5,
        comment: 'Outstanding store! Great variety and competitive prices. My go-to place for groceries.'
      },
      {
        customerId: createdCustomers[2].id, // Vikram Singh (Another feedback)
        rating: 5,
        comment: 'Always fresh products and friendly staff. Highly recommend this place!'
      },
      {
        customerId: createdCustomers[1].id, // Sunita Devi (Regular)
        rating: 4,
        comment: 'Good variety of products. Quick billing process. Will visit again.'
      },
      {
        customerId: createdCustomers[3].id, // Meera Nair (Regular)
        rating: 3,
        comment: 'Decent store with good products. Could improve the checkout speed.'
      },
      {
        customerId: createdCustomers[4].id, // Ravi Kumar (Super Loyal)
        rating: 5,
        comment: 'Best grocery store in the area! Excellent customer service and always fresh products. Highly recommended!'
      },
      {
        customerId: createdCustomers[4].id, // Ravi Kumar (Another feedback)
        rating: 5,
        comment: 'Amazing experience every time I visit. Great prices and quality products.'
      },
      {
        customerId: createdCustomers[4].id, // Ravi Kumar (Third feedback)
        rating: 4,
        comment: 'Love shopping here. Only suggestion is to add more organic options.'
      }
    ];

    for (const feedback of feedbackData) {
      await prisma.feedback.create({
        data: feedback
      });
    }
  }

  console.log('Database seeding completed with Indian products!');
  console.log(`Admin User: ${adminUser.email} (Password: admin123)`);
  console.log(`Employee: ${employee.email} (Password: cashier123)`);
  console.log(`Products created: ${products.length}`);
  console.log(`Customers created: ${customers.length}`);
  console.log('Sample transactions created with visit counts:');
  console.log('- Amit Patel: 5 visits (Loyal Customer)');
  console.log('- Sunita Devi: 1 visit (Regular Customer)');
  console.log('- Vikram Singh: 8 visits (Loyal Customer)');
  console.log('- Meera Nair: 2 visits (Regular Customer)');
  console.log('- Ravi Kumar: 5 visits (Loyal Customer)');
  console.log('- Anjali Gupta: 0 visits (New Customer)');
  console.log('- Deepak Sharma: 3 visits (Loyal Customer)');
  console.log('- Kavya Reddy: 1 visit (Regular Customer)');
  console.log('Loyalty system: 3+ visits = Loyal Customer');
  console.log('All prices are in Indian Rupees (₹)');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
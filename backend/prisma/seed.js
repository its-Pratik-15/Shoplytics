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
      price: 285.00,
      quantity: 150,
      category: 'Beverages',
      sku: 'TEA001'
    },
    {
      name: 'Amul Butter',
      description: 'Fresh salted butter 500g pack',
      price: 240.00,
      quantity: 80,
      category: 'Dairy',
      sku: 'BUTTER001'
    },
    {
      name: 'Basmati Rice',
      description: 'Premium aged basmati rice 5kg bag',
      price: 850.00,
      quantity: 45,
      category: 'Grains',
      sku: 'RICE001'
    },
    {
      name: 'Maggi Noodles',
      description: 'Masala instant noodles 2-minute pack',
      price: 14.00,
      quantity: 200,
      category: 'Instant Food',
      sku: 'NOODLES001'
    },
    {
      name: 'Parle-G Biscuits',
      description: 'Glucose biscuits family pack 800g',
      price: 85.00,
      quantity: 120,
      category: 'Biscuits',
      sku: 'BISCUIT001'
    },
    {
      name: 'Surf Excel Detergent',
      description: 'Matic front load washing powder 2kg',
      price: 485.00,
      quantity: 60,
      category: 'Household',
      sku: 'DETERGENT001'
    },
    {
      name: 'Haldiram Namkeen',
      description: 'Aloo Bhujia spicy snack 400g pack',
      price: 120.00,
      quantity: 90,
      category: 'Snacks',
      sku: 'NAMKEEN001'
    },
    {
      name: 'Dabur Honey',
      description: 'Pure natural honey 500g bottle',
      price: 320.00,
      quantity: 70,
      category: 'Health',
      sku: 'HONEY001'
    },
    {
      name: 'Britannia Bread',
      description: 'White bread loaf 400g pack',
      price: 28.00,
      quantity: 100,
      category: 'Bakery',
      sku: 'BREAD001'
    },
    {
      name: 'Colgate Toothpaste',
      description: 'Strong teeth toothpaste 200g tube',
      price: 95.00,
      quantity: 85,
      category: 'Personal Care',
      sku: 'TOOTHPASTE001'
    },
    {
      name: 'Patanjali Atta',
      description: 'Whole wheat flour 10kg bag',
      price: 420.00,
      quantity: 35,
      category: 'Grains',
      sku: 'ATTA001'
    },
    {
      name: 'MTR Ready Mix',
      description: 'Rava Idli instant mix 500g pack',
      price: 85.00,
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

  // Create sample Indian customers
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
    // Sample transaction 1
    const transaction1 = await prisma.transaction.create({
      data: {
        customerId: createdCustomers[0].id,
        total: 399.00,
        paymentMode: 'UPI',
        status: 'COMPLETED',
        items: {
          create: [
            {
              productId: createdProducts[0].id, // Tata Tea
              quantity: 1,
              priceAtSale: 285.00,
              subtotal: 285.00
            },
            {
              productId: createdProducts[8].id, // Britannia Bread
              quantity: 4,
              priceAtSale: 28.00,
              subtotal: 112.00
            }
          ]
        }
      }
    });

    // Sample transaction 2
    const transaction2 = await prisma.transaction.create({
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

    // Update customer spending
    await prisma.customer.update({
      where: { id: createdCustomers[0].id },
      data: { totalSpending: 399.00 }
    });

    await prisma.customer.update({
      where: { id: createdCustomers[1].id },
      data: { totalSpending: 1235.00 }
    });

    // Create sample feedback
    await prisma.feedback.create({
      data: {
        customerId: createdCustomers[0].id,
        rating: 5,
        comment: 'Excellent service and fresh products! Very satisfied with the quality.'
      }
    });

    await prisma.feedback.create({
      data: {
        customerId: createdCustomers[1].id,
        rating: 4,
        comment: 'Good variety of products. Quick billing process.'
      }
    });
  }

  console.log('Database seeding completed with Indian products!');
  console.log(`Admin User: ${adminUser.email} (Password: admin123)`);
  console.log(`Employee: ${employee.email} (Password: cashier123)`);
  console.log(`Products created: ${products.length}`);
  console.log(`Customers created: ${customers.length}`);
  console.log('Sample transactions and feedback created');
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
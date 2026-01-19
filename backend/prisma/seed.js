const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@pos.com' },
    update: {},
    create: {
      email: 'admin@pos.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'OWNER'
    }
  });

  // Create default employee
  const employeePassword = await bcrypt.hash('cashier123', 10);
  
  const employee = await prisma.employee.upsert({
    where: { email: 'cashier@pos.com' },
    update: {},
    create: {
      email: 'cashier@pos.com',
      password: employeePassword,
      name: 'Cashier Employee',
      role: 'CASHIER'
    }
  });

  // Create sample products
  const products = [
    {
      name: 'Coffee Beans',
      description: 'Premium Arabica coffee beans',
      price: 15.99,
      quantity: 100,
      category: 'Beverages',
      sku: 'COFFEE001'
    },
    {
      name: 'Chocolate Bar',
      description: 'Dark chocolate bar 70% cocoa',
      price: 4.99,
      quantity: 50,
      category: 'Snacks',
      sku: 'CHOC001'
    },
    {
      name: 'Notebook',
      description: 'A5 lined notebook',
      price: 8.50,
      quantity: 25,
      category: 'Stationery',
      sku: 'NOTE001'
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: product
    });
  }

  // Create sample customer
  const customer = await prisma.customer.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'customer@example.com',
      phone: '+1234567890',
      address: '123 Main St, City, State'
    }
  });

  console.log('Database seeding completed!');
  console.log(`Admin User: ${adminUser.email}`);
  console.log(`Employee: ${employee.email}`);
  console.log(`Products created: ${products.length}`);
  console.log(`Customer: ${customer.email}`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
const { PrismaClient } = require('@prisma/client');

// Initialize Prisma Client
const prisma = new PrismaClient();

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
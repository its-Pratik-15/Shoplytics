# Shoplytics Documentation

Welcome to the Shoplytics documentation! This comprehensive guide will help you understand, set up, and use the Shoplytics Point of Sale and Analytics system.

## 📚 Documentation Structure

- [**Getting Started**](./getting-started.md) - Quick setup and installation guide
- [**API Documentation**](./api/README.md) - Complete API reference
- [**Frontend Guide**](./frontend/README.md) - Frontend architecture and components
- [**Backend Guide**](./backend/README.md) - Backend services and architecture
- [**Database Schema**](./database/README.md) - Database structure and relationships
- [**Deployment Guide**](./deployment/README.md) - Production deployment instructions
- [**User Manual**](./user-manual/README.md) - End-user documentation
- [**Developer Guide**](./developer/README.md) - Development best practices

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shoplytics
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure your environment variables
   npx prisma migrate dev
   npm run seed
   npm start
   ```

3. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Configure your environment variables
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 🏗️ Architecture Overview

Shoplytics is built with a modern tech stack:

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for modern, responsive design
- **React Router** for client-side routing
- **Axios** for API communication
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express.js framework
- **Prisma ORM** for database management
- **PostgreSQL** as the primary database
- **JWT** for authentication
- **Cloudinary** for image storage
- **Joi** for request validation

### Key Features
- 🛒 **Point of Sale System** - Complete transaction management
- 📊 **Advanced Analytics** - Real-time business insights
- 👥 **Customer Management** - Customer profiles and history
- 📦 **Inventory Management** - Product catalog and stock tracking
- 💬 **Feedback System** - Customer feedback collection
- 🔐 **Role-based Access Control** - Multi-user permissions
- 📱 **Responsive Design** - Works on all devices

## 🎯 Target Users

- **Store Owners** - Manage their retail business operations
- **Managers** - Oversee store performance and analytics
- **Cashiers** - Process transactions and manage customers
- **Administrators** - System configuration and user management

## 📋 System Requirements

### Development Environment
- Node.js 18+ 
- PostgreSQL 14+
- Git
- Modern web browser

### Production Environment
- Linux/Ubuntu server
- Node.js 18+
- PostgreSQL 14+
- Nginx (recommended)
- SSL certificate

## 🤝 Contributing

We welcome contributions! Please see our [Developer Guide](./developer/README.md) for:
- Code style guidelines
- Development workflow
- Testing procedures
- Pull request process

## 📞 Support

For support and questions:
- 📧 Email: support@shoplytics.com
- 📖 Documentation: [docs.shoplytics.com](https://docs.shoplytics.com)
- 🐛 Issues: [GitHub Issues](https://github.com/shoplytics/shoplytics/issues)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

**Built by the Shoplytics Team**
# Getting Started with Shoplytics

This guide will help you set up Shoplytics on your local development environment.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** (version 14 or higher)
- **Git** for version control

## 🚀 Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd shoplytics
```

### 2. Database Setup

1. **Install PostgreSQL** (if not already installed)
   ```bash
   # On macOS with Homebrew
   brew install postgresql
   brew services start postgresql
   
   # On Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql
   ```

2. **Create a database**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE shoplytics;
   CREATE USER shoplytics_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE shoplytics TO shoplytics_user;
   \q
   ```

### 3. Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment configuration**
   ```bash
   cp .env.example .env
   ```

4. **Configure your `.env` file**
   ```env
   # Database
   DATABASE_URL="postgresql://shoplytics_user:your_password@localhost:5432/shoplytics"
   
   # JWT Secret
   JWT_SECRET="your-super-secret-jwt-key"
   
   # Cloudinary (for image uploads)
   CLOUDINARY_CLOUD_NAME="your_cloud_name"
   CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_api_secret"
   
   # Server
   PORT=3000
   NODE_ENV=development
   ```

5. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

6. **Seed the database**
   ```bash
   npm run seed
   ```

7. **Start the backend server**
   ```bash
   npm start
   ```

   The backend will be available at `http://localhost:3000`

### 4. Frontend Setup

1. **Open a new terminal and navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment configuration**
   ```bash
   cp .env.example .env
   ```

4. **Configure your `.env` file**
   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_APP_NAME=Shoplytics
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## 🎉 First Login

After setup, you can log in with the seeded demo accounts:

### Owner Account
- **Email**: `owner@shoplytics.com`
- **Password**: `password123`
- **Role**: Owner (Full access)

### Manager Account
- **Email**: `manager@shoplytics.com`
- **Password**: `password123`
- **Role**: Manager (Management access)

### Cashier Account
- **Email**: `cashier@shoplytics.com`
- **Password**: `password123`
- **Role**: Cashier (Transaction access)

## 🔧 Development Tools

### Useful Commands

**Backend:**
```bash
# Start development server with auto-reload
npm run dev

# Run database migrations
npx prisma migrate dev

# Reset database and reseed
npx prisma migrate reset

# View database in Prisma Studio
npx prisma studio

# Generate Prisma client
npx prisma generate
```

**Frontend:**
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 🐛 Troubleshooting

### Common Issues

1. **Database connection error**
   - Ensure PostgreSQL is running
   - Check your DATABASE_URL in `.env`
   - Verify database credentials

2. **Port already in use**
   - Change the PORT in backend `.env`
   - Kill existing processes: `lsof -ti:3000 | xargs kill -9`

3. **Module not found errors**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

4. **Prisma client errors**
   - Run `npx prisma generate`
   - Restart your development server

### Getting Help

If you encounter issues:
1. Check the [troubleshooting section](./troubleshooting.md)
2. Search existing [GitHub issues](https://github.com/shoplytics/shoplytics/issues)
3. Create a new issue with detailed error information

## 📚 Next Steps

Now that you have Shoplytics running:

1. **Explore the application** - Try different features and user roles
2. **Read the [User Manual](./user-manual/README.md)** - Learn how to use all features
3. **Check the [API Documentation](./api/README.md)** - Understand the backend APIs
4. **Review the [Developer Guide](./developer/README.md)** - Learn about the codebase

## 🚀 Ready for Production?

When you're ready to deploy:
1. Read the [Deployment Guide](./deployment/README.md)
2. Configure production environment variables
3. Set up SSL certificates
4. Configure your web server (Nginx recommended)

---

**Happy coding! 🎉**
# POS Analytics Application

A professional single-shop Point of Sale (POS) and analytics web application built with Node.js, Express, Prisma, PostgreSQL, and React.

## Features

- 🔐 **Authentication & Authorization** - JWT-based auth with role-based access control
- 📦 **Product Management** - CRUD operations with Cloudinary image storage
- 💰 **Manual Billing System** - Transaction processing with inventory management
- 👥 **Customer Management** - Customer tracking and spending analytics
- ⭐ **Feedback System** - Verified customer reviews and ratings
- 📊 **Analytics Dashboard** - Comprehensive business insights and reporting

## Tech Stack

### Backend
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT tokens with bcrypt
- **Image Storage:** Cloudinary
- **Validation:** Zod schemas

### Frontend (Coming Soon)
- **Framework:** React with Vite
- **Charts:** Recharts
- **State Management:** Context API
- **HTTP Client:** Axios

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Cloudinary account (for image storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pos-analytics-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The API server will be running at `http://localhost:3000`

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/pos_db` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `JWT_EXPIRES_IN` | JWT expiration time | `24h` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `your-api-key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your-api-secret` |

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Authentication (Coming Soon)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token

### Products (Coming Soon)
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Transactions (Coming Soon)
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions/:id` - Get transaction by ID
- `PUT /api/transactions/:id/items` - Add items to transaction
- `POST /api/transactions/:id/payment` - Process payment

### Analytics (Coming Soon)
- `GET /api/analytics/products/top-selling` - Most selling products
- `GET /api/analytics/customers/summary` - Customer analytics
- `GET /api/analytics/sales/trends` - Sales trends

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

### Project Structure

```
src/
├── server.ts           # Express server setup
├── types/              # TypeScript type definitions
├── middleware/         # Express middleware
├── routes/             # API route handlers
├── services/           # Business logic services
├── utils/              # Utility functions
└── test/               # Test files and setup
```

## Deployment

### Backend Deployment (Render/Railway)

1. **Set environment variables** in your hosting platform
2. **Deploy the application**
   ```bash
   npm run build
   npm start
   ```

### Database Setup (Supabase/Railway/Neon)

1. **Create a PostgreSQL database** on your preferred platform
2. **Update DATABASE_URL** in environment variables
3. **Run migrations**
   ```bash
   npm run db:push
   ```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email your-email@example.com or create an issue in the repository.
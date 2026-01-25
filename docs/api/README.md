# API Documentation

This document provides comprehensive information about the Shoplytics REST API.

## 🌐 Base URL

```
http://localhost:3000/api
```

## 🔐 Authentication

Shoplytics uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Authentication Flow

1. **Login** - POST `/auth/login` with credentials
2. **Receive JWT token** - Store securely (httpOnly cookie)
3. **Include token** - In subsequent API requests
4. **Token expires** - After 7 days (re-login required)

## 📚 API Endpoints

### Authentication Endpoints

#### POST `/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "CASHIER"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "CASHIER"
    }
  }
}
```

#### POST `/auth/login`
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "CASHIER"
    }
  }
}
```

#### POST `/auth/logout`
Logout user and clear authentication cookie.

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### Product Endpoints

#### GET `/products`
Get all products with optional filtering.

**Query Parameters:**
- `search` - Search by name or description
- `category` - Filter by category
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Tata Tea Premium",
        "description": "Premium quality tea leaves",
        "category": "Beverages",
        "sellingPrice": 250,
        "costPrice": 200,
        "stock": 100,
        "images": ["image1.jpg"],
        "createdAt": "2024-01-24T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

#### POST `/products`
Create a new product.

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "category": "Electronics",
  "sellingPrice": 1000,
  "costPrice": 800,
  "stock": 50
}
```

#### PUT `/products/:id`
Update an existing product.

#### DELETE `/products/:id`
Delete a product.

### Transaction Endpoints

#### GET `/transactions`
Get all transactions with optional filtering.

**Query Parameters:**
- `search` - Search by customer name or transaction ID
- `status` - Filter by status (PENDING, COMPLETED, CANCELLED)
- `startDate` - Filter by start date
- `endDate` - Filter by end date

#### POST `/transactions`
Create a new transaction.

**Request Body:**
```json
{
  "customerId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 250
    }
  ],
  "paymentMethod": "CASH",
  "notes": "Customer notes"
}
```

#### PUT `/transactions/:id/status`
Update transaction status.

**Request Body:**
```json
{
  "status": "COMPLETED"
}
```

### Customer Endpoints

#### GET `/customers`
Get all customers.

#### POST `/customers`
Create a new customer.

**Request Body:**
```json
{
  "name": "Customer Name",
  "email": "customer@example.com",
  "phone": "+91-9876543210",
  "address": "Customer Address",
  "isNewCustomer": true
}
```

#### PUT `/customers/:id`
Update customer information.

#### DELETE `/customers/:id`
Delete a customer.

### Feedback Endpoints

#### GET `/feedback`
Get all feedback entries.

#### POST `/feedback`
Submit new feedback.

**Request Body:**
```json
{
  "customerId": 1,
  "rating": 5,
  "comment": "Great service!",
  "category": "SERVICE"
}
```

### Analytics Endpoints

#### GET `/analytics/overview`
Get dashboard overview statistics.

**Query Parameters:**
- `startDate` - Start date for analytics
- `endDate` - End date for analytics

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 125430,
    "totalTransactions": 234,
    "totalCustomers": 89,
    "averageRating": 4.5,
    "lowStockProducts": 3
  }
}
```

#### GET `/analytics/most-selling`
Get most selling products.

#### GET `/analytics/highest-revenue`
Get highest revenue generating products.

#### GET `/analytics/customer-analytics`
Get customer analytics data.

#### GET `/analytics/sales-trends`
Get sales trends over time.

## 📊 Response Format

All API responses follow this standard format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error information"
  }
}
```

## 🔒 Role-Based Access Control

Different endpoints require different user roles:

- **OWNER** - Full access to all endpoints
- **ADMIN** - Access to most endpoints except user management
- **MANAGER** - Access to products, customers, transactions, analytics
- **CASHIER** - Access to transactions, customers (limited)

## 📝 Request Validation

All requests are validated using Joi schemas. Common validation rules:

- **Email** - Must be valid email format
- **Password** - Minimum 6 characters
- **Phone** - Valid phone number format
- **Prices** - Must be positive numbers
- **Stock** - Must be non-negative integer

## 🚨 Error Codes

Common HTTP status codes used:

- **200** - Success
- **201** - Created
- **400** - Bad Request (validation error)
- **401** - Unauthorized (authentication required)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found
- **409** - Conflict (duplicate resource)
- **500** - Internal Server Error

## 📋 Rate Limiting

API requests are rate-limited to prevent abuse:

- **100 requests per minute** per IP address
- **1000 requests per hour** per authenticated user

## 🔧 Development Tools

### Testing the API

Use tools like:
- **Postman** - GUI-based API testing
- **curl** - Command-line testing
- **Insomnia** - Alternative to Postman

### Example curl Commands

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@shoplytics.com","password":"password123"}'

# Get products (with authentication)
curl -X GET http://localhost:3000/api/products \
  -H "Authorization: Bearer <your-jwt-token>"

# Create product
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{"name":"Test Product","category":"Test","sellingPrice":100,"costPrice":80,"stock":10}'
```

## 📚 Additional Resources

- [Postman Collection](./postman-collection.json) - Import into Postman
- [OpenAPI Specification](./openapi.yaml) - Machine-readable API spec
- [API Changelog](./changelog.md) - Version history and changes

---

**Need help?** Check our [troubleshooting guide](../troubleshooting.md) or [create an issue](https://github.com/shoplytics/shoplytics/issues).
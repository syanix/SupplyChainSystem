# Supply Chain Management System - API Documentation

This document provides comprehensive documentation for the Supply Chain Management System API. It is generated from the OpenAPI/Swagger specification.

## API Overview

The Supply Chain Management System API follows RESTful principles with consistent resource naming and versioned endpoints. All API endpoints require authentication unless explicitly marked as public.

## Base URL

- Development: `http://localhost:3001`
- Production: `https://api.supplychainsystem.com` (example)

## Authentication

The API uses JWT (JSON Web Token) authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

To obtain a token, use the authentication endpoints described below.

## API Versioning

API endpoints are versioned to ensure backward compatibility. The current version is v1.

Example: `/api/v1/products`

## Rate Limiting

API requests are subject to rate limiting to prevent abuse. The current limits are:

- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

Rate limit information is included in the response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1620000000
```

## Common Response Codes

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

## API Endpoints

### Authentication

#### POST /api/v1/auth/login

Authenticate a user and receive a JWT token.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "role": "admin"
  }
}
```

#### POST /api/v1/auth/refresh

Refresh an expired JWT token.

**Request Body:**

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Products

#### GET /api/v1/products

Retrieve a list of products with pagination.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term
- `category` (optional): Filter by category

**Response:**

```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Product 1",
      "description": "Product description",
      "sku": "PRD-001",
      "price": 19.99,
      "stock": 100,
      "category": "electronics",
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z"
    }
    // More products...
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

#### GET /api/v1/products/:id

Retrieve a single product by ID.

**Response:**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Product 1",
  "description": "Product description",
  "sku": "PRD-001",
  "price": 19.99,
  "stock": 100,
  "category": "electronics",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z"
}
```

#### POST /api/v1/products

Create a new product.

**Request Body:**

```json
{
  "name": "New Product",
  "description": "Product description",
  "sku": "PRD-002",
  "price": 29.99,
  "stock": 50,
  "category": "electronics"
}
```

**Response:**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174001",
  "name": "New Product",
  "description": "Product description",
  "sku": "PRD-002",
  "price": 29.99,
  "stock": 50,
  "category": "electronics",
  "created_at": "2023-01-02T00:00:00Z",
  "updated_at": "2023-01-02T00:00:00Z"
}
```

### Orders

#### GET /api/v1/orders

Retrieve a list of orders with pagination.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status

**Response:**

```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "customer_id": "123e4567-e89b-12d3-a456-426614174000",
      "status": "processing",
      "total": 49.98,
      "items": [
        {
          "product_id": "123e4567-e89b-12d3-a456-426614174000",
          "quantity": 2,
          "price": 19.99,
          "subtotal": 39.98
        }
        // More items...
      ],
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z"
    }
    // More orders...
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "pages": 3
  }
}
```

## Error Responses

All API errors follow a consistent format:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## Webhooks

The API supports webhooks for event notifications. Configure webhook endpoints in the dashboard.

Supported events:

- `order.created`
- `order.updated`
- `order.fulfilled`
- `product.low_stock`

## API Client Libraries

- JavaScript/TypeScript: `@supply-chain/api-client`
- Python: `supply-chain-api-client`

## Additional Resources

- [Interactive API Explorer](http://localhost:3001/api)
- [OpenAPI Specification](http://localhost:3001/api-json)
- [Postman Collection](https://www.postman.com/supply-chain-system)

---

_This documentation is automatically generated from the OpenAPI specification. Last updated: 2023-12-15_

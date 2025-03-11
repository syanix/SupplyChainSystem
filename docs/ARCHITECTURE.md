# System Architecture

This document outlines the architecture of the Supply Chain Management System, including its components, data flow, and design decisions.

## Overview

The Supply Chain Management System is a multi-tenant SaaS platform designed for small businesses in supply-chain-intensive industries. It provides features for order management, supplier collaboration, and goods receipt verification.

## Architecture Principles

The system is built on the following architectural principles:

1. **Modularity**: Components are designed to be modular and loosely coupled
2. **Scalability**: Architecture supports horizontal scaling to handle increased load
3. **Security**: Multi-tenant isolation with proper data segregation
4. **Maintainability**: Clean code organization and comprehensive documentation
5. **Performance**: Optimized for fast response times and efficient resource usage

## System Components

### High-Level Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Next.js        │────▶│  NestJS         │────▶│  PostgreSQL     │
│  Frontend       │     │  Backend        │     │  Database       │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Vercel         │     │  Fly.io         │     │  Supabase       │
│  Hosting        │     │  Hosting        │     │  Hosting        │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Frontend (Next.js)

The frontend is built with Next.js and follows a component-based architecture:

1. **Pages**: Route-based components that represent different views
2. **Components**: Reusable UI elements organized by functionality
3. **Hooks**: Custom hooks for shared logic and state management
4. **Context**: Global state management using React Context API
5. **Services**: API client services for backend communication

### Backend (NestJS)

The backend is built with NestJS and follows a modular architecture:

1. **Controllers**: Handle HTTP requests and define API endpoints
2. **Services**: Contain business logic and interact with repositories
3. **Repositories**: Handle data access and persistence
4. **DTOs**: Define data transfer objects for API requests/responses
5. **Entities**: Define database models and relationships
6. **Guards**: Implement authentication and authorization
7. **Interceptors**: Handle cross-cutting concerns like logging and error handling

### Database (PostgreSQL)

The database is designed with a multi-tenant architecture:

1. **Schema**: Tables include a `tenant_id` column for data isolation
2. **Row-Level Security (RLS)**: Enforces tenant isolation at the database level
3. **Migrations**: Managed through Prisma ORM
4. **Indexes**: Optimized for common query patterns
5. **Audit Logging**: Tracks changes to critical data

## Data Flow

### Authentication Flow

1. User submits login credentials
2. Backend validates credentials and generates JWT token
3. Frontend stores token and includes it in subsequent requests
4. Backend validates token and extracts user/tenant information
5. RLS policies enforce data access based on tenant ID

### Order Management Flow

1. User creates a new order in the frontend
2. Frontend sends order data to backend API
3. Backend validates data and creates order in database
4. Backend generates PDF purchase order
5. Backend sends email notification to supplier
6. Order status is updated and reflected in frontend

## Multi-Tenant Architecture

### Tenant Isolation

The system implements a multi-tenant architecture with the following isolation mechanisms:

1. **Database Level**: 
   - Each table includes a `tenant_id` column
   - Row-Level Security (RLS) policies enforce tenant isolation
   - Database functions validate tenant context

2. **Application Level**:
   - JWT tokens include tenant information
   - Middleware validates tenant access for each request
   - Services filter data by tenant ID

3. **Frontend Level**:
   - User context includes tenant information
   - UI displays only tenant-specific data
   - Routes are protected based on tenant access

## Security Architecture

### Authentication and Authorization

1. **Authentication**:
   - JWT-based authentication
   - Tokens include user ID, role, and tenant ID
   - Token expiration and refresh mechanism

2. **Authorization**:
   - Role-based access control (RBAC)
   - Permission checks at controller and service levels
   - UI elements conditionally rendered based on permissions

### Data Security

1. **Data Encryption**:
   - TLS for data in transit
   - AES-256 encryption for sensitive data at rest
   - Secure storage of credentials and secrets

2. **Input Validation**:
   - Request validation using DTOs
   - Sanitization of user inputs
   - Protection against common web vulnerabilities

## Performance Optimization

### Frontend Optimization

1. **Static Generation**: Pages are statically generated where possible
2. **Incremental Static Regeneration (ISR)**: Dynamic content with caching
3. **Code Splitting**: Automatic code splitting for optimal loading
4. **Image Optimization**: Next.js image optimization for faster loading

### Backend Optimization

1. **Caching**: Response caching for frequently accessed data
2. **Database Indexing**: Optimized indexes for common queries
3. **Query Optimization**: Efficient database queries with proper joins
4. **Connection Pooling**: Database connection pooling for better performance

## Scalability Considerations

### Horizontal Scaling

1. **Stateless Design**: Backend services are stateless for horizontal scaling
2. **Load Balancing**: Requests distributed across multiple instances
3. **Database Scaling**: Read replicas for scaling read operations

### Vertical Scaling

1. **Resource Allocation**: Adjusting CPU and memory based on workload
2. **Database Sizing**: Upgrading database resources as needed

## Monitoring and Observability

### Logging

1. **Application Logs**: Structured logging with context information
2. **Audit Logs**: Tracking of critical operations and data changes
3. **Error Logs**: Detailed error information for troubleshooting

### Metrics

1. **Performance Metrics**: Response times, throughput, error rates
2. **Resource Metrics**: CPU, memory, disk usage
3. **Business Metrics**: Order volumes, user activity, supplier engagement

## Disaster Recovery

### Backup Strategy

1. **Database Backups**: Regular automated backups
2. **File Storage Backups**: Backup of uploaded files and documents
3. **Configuration Backups**: Infrastructure and application configuration

### Recovery Procedures

1. **Database Restoration**: Procedures for restoring from backups
2. **Service Recovery**: Steps to recover failed services
3. **Data Integrity Verification**: Validation of restored data

## Integration Points

### External Systems

1. **Email Service**: Integration with Resend for email notifications
2. **File Storage**: Integration with Cloudflare R2 for file storage
3. **Payment Processing**: Future integration with payment gateways

### APIs

1. **RESTful APIs**: Primary API style for frontend-backend communication
2. **Webhooks**: For event-driven integrations with external systems
3. **GraphQL**: Consideration for future API evolution

## Development Workflow

### Code Organization

The codebase follows a monorepo structure:

```
/
├── apps/
│   ├── web/                 # Next.js frontend application
│   └── api/                 # NestJS backend application
├── packages/
│   ├── database/            # Database schema and migrations
│   ├── shared/              # Shared types and utilities
│   └── ui/                  # Shared UI components
├── docs/                    # Project documentation
├── scripts/                 # Utility scripts
└── docker-compose.yml       # Docker configuration
```

### Deployment Pipeline

1. **CI/CD**: Automated testing and deployment using GitHub Actions
2. **Environment Promotion**: Changes flow from development to staging to production
3. **Feature Flags**: Controlled rollout of new features

## Future Architecture Evolution

### Planned Enhancements

1. **Microservices**: Evolution towards microservices for specific domains
2. **Event-Driven Architecture**: Implementation of event sourcing for certain features
3. **Real-Time Features**: Addition of WebSocket support for real-time updates

### Technical Debt Management

1. **Refactoring Strategy**: Continuous refactoring of critical components
2. **Deprecation Policy**: Process for deprecating and removing legacy features
3. **Technology Upgrades**: Regular updates of framework and library versions

## Appendix

### Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Headless UI
- **Backend**: NestJS, TypeScript, Prisma ORM
- **Database**: PostgreSQL
- **Infrastructure**: Vercel, Fly.io, Supabase, Cloudflare R2
- **CI/CD**: GitHub Actions
- **Monitoring**: Vercel Analytics, Fly.io Metrics, Supabase Monitoring

### Architecture Decision Records (ADRs)

See the `/docs/ADRs` directory for detailed architecture decision records.
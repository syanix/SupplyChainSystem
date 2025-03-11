# User Management Guide

This guide provides detailed instructions on how to manage users in the Supply Chain System, including creating new users, understanding user roles, and accessing user features.

## Table of Contents

1. [User Types and Roles](#user-types-and-roles)
2. [Creating New Users](#creating-new-users)
   - [Initial Registration (New Tenant)](#initial-registration-new-tenant)
   - [Adding Users to Existing Tenant](#adding-users-to-existing-tenant)
3. [User Authentication](#user-authentication)
4. [User Features and Access](#user-features-and-access)
5. [User Profile Management](#user-profile-management)
6. [Troubleshooting](#troubleshooting)

## User Types and Roles

The Supply Chain System implements a role-based access control (RBAC) system with the following roles:

- **Admin**: Full access to all system features, including user management, tenant settings, and system configuration.
- **User**: Standard access to operational features like orders, products, and suppliers management.

Each user belongs to a specific tenant (company), and their access is limited to data within that tenant.

## Creating New Users

There are two primary methods for creating users in the system:

### Initial Registration (New Tenant)

When setting up a new company in the system:

1. Use the Registration API endpoint:

   ```
   POST /api/auth/register
   ```

2. Include the following information in your request body:

   ```json
   {
     "email": "user@example.com",
     "password": "password123",
     "firstName": "John",
     "lastName": "Doe",
     "companyName": "Acme Inc."
   }
   ```

3. This creates:

   - A new tenant (company) with the specified company name
   - An admin user for that tenant with the provided credentials

4. After registration, you'll receive an authentication token that can be used for subsequent API calls.

### Adding Users to Existing Tenant

For administrators who want to add users to their existing company:

1. Log in with an admin account
2. Use the Users API endpoint:

   ```
   POST /api/users
   ```

3. Include the following information in your request body:

   ```json
   {
     "email": "newuser@example.com",
     "password": "password123",
     "firstName": "Jane",
     "lastName": "Smith",
     "roles": ["user"]
   }
   ```

4. The tenant ID is automatically set to the same tenant as the authenticated admin user.

**Note**: Currently, the web interface does not include a dedicated user management page. User creation is primarily handled through API endpoints. Future versions may include a graphical interface for user management.

## User Authentication

The system uses JWT (JSON Web Token) for authentication:

1. **Login**:

   - Navigate to `/auth/login`
   - Enter your email and password
   - Upon successful authentication, you'll be redirected to the dashboard

2. **Session Management**:

   - The system uses NextAuth for session management
   - Authentication tokens are automatically included in API requests
   - Sessions expire after 24 hours by default

3. **Password Recovery**:
   - If you forget your password, use the "Forgot Password" link on the login page
   - Enter your email address to receive a password reset link
   - Follow the link to create a new password

## User Features and Access

Users have access to the following features based on their roles:

### All Users

- **Dashboard**: Overview of key metrics and recent activities
- **Orders**: View, create, and manage purchase orders
- **Products**: Manage product catalog, including inventory levels
- **Suppliers**: Manage supplier information and relationships
- **Profile**: Update personal information and preferences

### Admin Users (Additional Features)

- **User Management**: Create and manage users within their tenant
- **Business Settings**: Configure company-specific settings
- **System Configuration**: Advanced system settings

## User Profile Management

Users can manage their profiles through the following steps:

1. Click on your profile icon in the top-right corner of the dashboard
2. Select "Your Profile" from the dropdown menu
3. Update your information:
   - Personal details (name, email)
   - Password
   - Notification preferences
4. Click "Save Changes" to apply updates

## Troubleshooting

### Common Issues

1. **Login Issues**:

   - Ensure you're using the correct email and password
   - Check if your account has been activated
   - Clear browser cookies and try again

2. **Access Denied Errors**:

   - Verify you have the necessary permissions for the action
   - Check if your session has expired (re-login if necessary)
   - Contact your tenant administrator if you need additional access

3. **Account Lockout**:
   - After multiple failed login attempts, accounts may be temporarily locked
   - Wait 15 minutes before trying again or use the password recovery option

### Support

For additional assistance with user management:

- Contact your system administrator
- Email support at support@supplychainsystem.com
- Check the API documentation for detailed endpoint information

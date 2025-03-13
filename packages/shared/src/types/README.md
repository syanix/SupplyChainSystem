# Shared Types

This directory contains shared type definitions used across the application. These types are the single source of truth for data structures in the application.

## Type Mapping Strategy

One challenge in our architecture is managing the differences between Prisma's generated types and our shared types. We've adopted the following approach:

1. **Define Shared Types**: All entity types are defined in the shared package to ensure consistency across the application.

2. **Explicit Mapping Functions**: Each repository includes mapping functions that convert Prisma's return types to our shared types.

3. **Type Safety**: We use explicit mapping rather than type assertions to ensure type safety.

Example of a mapping function:

```typescript
private mapPrismaProductToSharedProduct(prismaProduct: PrismaProduct): Product {
  return {
    id: prismaProduct.id,
    name: prismaProduct.name,
    description: prismaProduct.description,
    price: prismaProduct.price,
    sku: prismaProduct.sku,
    unit: "each", // Default value for required field in shared type
    stock: prismaProduct.stockQuantity || 0, // Map stockQuantity to stock
    imageUrl: prismaProduct.imageUrl,
    supplierId: prismaProduct.supplierId,
    tenantId: prismaProduct.tenantId,
    createdAt: prismaProduct.createdAt,
    updatedAt: prismaProduct.updatedAt,
  };
}
```

## Type Hierarchy

For each entity, we define a hierarchy of types:

1. **Base Entity**: The complete entity type with all properties.
2. **Create Request**: Type for creating a new entity (omits auto-generated fields).
3. **Update Request**: Type for updating an entity (makes all fields optional).

Example:

```typescript
// Base entity
export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  // ...other properties
}

// Create request
export interface CreateProductRequest {
  name: string;
  sku: string;
  price: number;
  // ...other properties
}

// Update request
export interface UpdateProductRequest {
  name?: string;
  sku?: string;
  price?: number;
  // ...other properties
}
```

## Known Type Discrepancies

There are some known discrepancies between our shared types and the Prisma schema:

1. **Product**:

   - Shared type uses `stock`, Prisma schema uses `stockQuantity`
   - Shared type requires `unit`, Prisma schema doesn't have this field

2. **Order**:
   - OrderItem in shared type requires `productId`, Prisma schema uses a relation

These discrepancies are handled in the mapping functions in each repository.

## Future Improvements

1. **Generate Shared Types from Prisma Schema**: Consider tools to automatically generate shared types from the Prisma schema.

2. **Zod Validation**: Add Zod schemas for runtime validation of data.

3. **Type-Safe Mappers**: Create more type-safe mapping functions using TypeScript utility types.

# Type Strategy for Supply Chain System

This document outlines our approach to type safety in the Supply Chain System codebase.

## Core Principles

1. **TypeScript First**: All code must be fully typed with TypeScript.
2. **No Any**: Avoid using `any` type whenever possible.
3. **Type Hierarchies**: Use type hierarchies to model domain entities.
4. **Runtime Validation**: Use Zod for runtime validation of data.
5. **Repository Pattern**: Use repository interfaces to abstract data access.

## Type Hierarchies

We use type hierarchies to model our domain entities. This allows us to:

- Share common properties between related types
- Create specialized types for specific use cases
- Maintain type safety throughout the application

### Example: Product Type Hierarchy

```typescript
// Base type with common properties
export interface BaseProduct {
  name: string;
  description?: string;
  price: number;
  sku: string;
}

// Full product type with all properties
export interface Product extends BaseProduct {
  id: string;
  stockQuantity: number;
  imageUrl?: string;
  supplierId?: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Types for API requests
export type CreateProductRequest = BaseProduct & {
  stockQuantity?: number;
  imageUrl?: string;
  supplierId?: string;
};

export type UpdateProductRequest = Partial<BaseProduct> & {
  stockQuantity?: number;
  imageUrl?: string;
  supplierId?: string | null;
};
```

## Repository Pattern

We use the repository pattern to abstract data access. Each repository:

- Implements a repository interface
- Maps between Prisma types and domain types
- Handles database-specific logic

### Example: Repository Interface

```typescript
export interface IProductRepository {
  findAll(tenantId: string): Promise<Product[]>;
  findById(id: string, tenantId: string): Promise<Product | null>;
  findBySku(sku: string, tenantId: string): Promise<Product | null>;
  create(data: CreateProductDto, tenantId: string): Promise<Product>;
  update(
    id: string,
    data: UpdateProductDto,
    tenantId: string,
  ): Promise<Product>;
  delete(id: string, tenantId: string): Promise<void>;
}
```

## Prisma Type Mapping

When working with Prisma, we define explicit mapping functions to convert between Prisma types and our domain types:

```typescript
// Define a type for Prisma product
type PrismaProduct = {
  id: string;
  name: string;
  description?: string;
  price: number;
  sku: string;
  stockQuantity: number;
  imageUrl?: string;
  supplierId?: string;
  tenantId?: string;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: unknown;
};

// Helper method to map Prisma product to shared Product type
private mapPrismaProductToSharedProduct(prismaProduct: PrismaProduct): Product {
  return {
    id: prismaProduct.id,
    name: prismaProduct.name,
    description: prismaProduct.description,
    price: prismaProduct.price,
    sku: prismaProduct.sku,
    unit: "each", // Default unit since it's required in the shared type
    stock: prismaProduct.stockQuantity || 0, // Map stockQuantity to stock
    imageUrl: prismaProduct.imageUrl,
    supplierId: prismaProduct.supplierId,
    tenantId: prismaProduct.tenantId,
    createdAt: prismaProduct.createdAt,
    updatedAt: prismaProduct.updatedAt,
  };
}
```

## Runtime Validation with Zod

We use Zod for runtime validation of data:

```typescript
import { z } from "zod";

// Define Zod schema for product
export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  sku: z.string().min(1, "SKU is required"),
  stockQuantity: z.number().int().nonnegative(),
  imageUrl: z.string().url().optional(),
  supplierId: z.string().uuid().optional(),
  tenantId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Type derived from schema
export type Product = z.infer<typeof productSchema>;

// Validation function
export const validateProduct = (data: unknown): Product => {
  return productSchema.parse(data);
};
```

## Best Practices

1. **Use Type Guards**: Create type guards to narrow types when necessary.
2. **Avoid Type Assertions**: Use type guards instead of type assertions when possible.
3. **Document Type Decisions**: Document complex type decisions in comments.
4. **Use Utility Types**: Leverage TypeScript utility types like `Partial`, `Pick`, and `Omit`.
5. **Consistent Naming**: Use consistent naming conventions for types.

## Type Safety in Controllers

Controllers should:

1. Use DTOs for request validation
2. Return typed responses
3. Document API with Swagger annotations

```typescript
@Post()
@ApiOperation({ summary: 'Create a new product' })
@ApiResponse({ status: 201, description: 'Product created successfully', type: ProductResponseDto })
@ApiResponse({ status: 400, description: 'Bad request' })
async create(
  @Body() createProductDto: CreateProductDto,
  @GetUser('tenantId') tenantId: string,
): Promise<ProductResponseDto> {
  return this.productsService.create(createProductDto, tenantId);
}
```

## Frontend Type Safety

In our frontend code, we follow the same principles as in the backend:

1. **No Any Types**: We replace all `any` types with more specific types.
2. **Type Guards**: We use type guards to safely narrow types.
3. **Type Utilities**: We provide utility functions for common type operations.

### Type Utilities

We've created a comprehensive set of type utilities in `apps/web/src/utils/type-utils.ts`:

```typescript
// A type for unknown record objects instead of using 'any'
export type UnknownRecord = Record<string, unknown>;

// Type guard to check if a value is a non-null object
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Type guard to check if a value has a specific property
export function hasProperty<K extends string>(
  obj: unknown,
  prop: K,
): obj is Record<K, unknown> {
  return isObject(obj) && prop in obj;
}

// More utility functions...
```

### API Client Type Safety

Our API client uses generic types to ensure type safety:

```typescript
async request<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: UnknownRecord,
  token?: string
): Promise<T> {
  // Implementation...
}
```

### Form Handling

For form handling, we use explicit types for form values:

```typescript
interface SupplierFormProps {
  initialValues?: CreateSupplierRequest | UpdateSupplierRequest;
  onSubmit: (
    values: CreateSupplierRequest | UpdateSupplierRequest,
  ) => Promise<void>;
  loading?: boolean;
  title?: string;
}
```

### Type Assertions

When type assertions are necessary, we use the safer `unknown` intermediate type:

```typescript
setUser(session.user as unknown as typeof user);
```

## React Hook Dependency Handling

When working with React Hooks, we follow these practices to ensure type safety and avoid dependency issues:

### useEffect Dependencies

For `useEffect` hooks, we handle dependencies in one of two ways:

1. **Move functions inside the useEffect**: When a function uses state or props, we define it inside the useEffect to avoid dependency issues:

```typescript
useEffect(() => {
  // Define the function inside useEffect
  const fetchData = async () => {
    if (!session?.accessToken) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/data`,
      );
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchData();
}, [session]);
```

2. **Use eslint-disable comment**: When moving the function inside isn't practical, we use an eslint-disable comment:

```typescript
useEffect(() => {
  fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [session]);
```

### Event Handlers

For event handlers that use state or props, we define them inside the component body:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  // Implementation...
};
```

## Linter Warning Management

We maintain a comprehensive guide for addressing linter warnings in the codebase at `docs/LINTER_WARNINGS.md`. This document provides:

1. **Categorized Warnings**: Warnings grouped by type (Next.js specific, React Hooks, etc.)
2. **Affected Files**: Lists of files affected by each warning type
3. **Fix Instructions**: Step-by-step instructions for fixing each warning type
4. **Code Examples**: Before and after examples showing how to fix the warnings
5. **Best Practices**: Guidelines for avoiding linter warnings in the future

### Common Linter Warnings and Solutions

1. **React Hook Dependencies**: Use the strategies described above
2. **Unused Imports**: Either remove the import or prefix it with an underscore
3. **Next.js Async Client Components**: Move async logic to useEffect or event handlers
4. **Image Optimization**: Use Next.js `<Image>` component instead of HTML `<img>` tags

By following these practices, we maintain a high level of type safety and code quality throughout the codebase.

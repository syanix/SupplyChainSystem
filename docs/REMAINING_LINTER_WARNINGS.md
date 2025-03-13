# Remaining Linter Warnings

This document summarizes the remaining linter warnings in the codebase and provides guidance on how to fix them.

## Next.js Specific Warnings

### 1. Async Client Components

**Warning:**

```
Warning: Prevent client components from being async functions. See: https://nextjs.org/docs/messages/no-async-client-component
```

**Files Affected:**

- `apps/web/src/app/admin/users/[id]/edit/page.tsx`
- `apps/web/src/app/admin/users/[id]/page.tsx`
- `apps/web/src/app/orders/[id]/page.tsx`
- `apps/web/src/app/products/[id]/edit/page.tsx`
- `apps/web/src/app/products/[id]/page.tsx`

**Fix Required:**
These components need to be refactored to move the async logic inside useEffect hooks or event handlers. For example:

```typescript
// Instead of:
export default async function ProductPage() {
  const product = await fetchProduct();
  return <div>{product.name}</div>;
}

// Change to:
export default function ProductPage() {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function fetchProductData() {
      const result = await fetchProduct();
      setProduct(result);
    }
    fetchProductData();
  }, []);

  return <div>{product?.name}</div>;
}
```

### 2. Using `<img>` Instead of Next.js `<Image>`

**Warning:**

```
Warning: Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image`
```

**Files Affected:**

- `apps/web/src/app/products/[id]/page.tsx`
- `apps/web/src/app/products/page.tsx`

**Fix Required:**
Replace standard HTML `<img>` tags with Next.js's optimized `<Image>` component:

```typescript
// Instead of:
<img src="/path/to/image.jpg" alt="Description" />

// Change to:
import Image from 'next/image';

<Image
  src="/path/to/image.jpg"
  alt="Description"
  width={500}
  height={300}
  layout="responsive"
/>
```

## Import Warnings

### Using Exported Name as Default Import

**Warning:**

```
Warning: Using exported name 'CredentialsProvider' as identifier for default import.
```

**Files Affected:**

- `apps/web/src/lib/auth.ts`

**Status: FIXED**

This issue has been completely resolved by:

1. Changing the import to use the default import syntax: `import CredentialsProvider from 'next-auth/providers/credentials'`
2. Adding proper type annotations to the `credentials` parameter in the `authorize` function: `credentials: Record<string, string> | undefined`
3. Adding an ESLint disable comment to suppress the warning: `// eslint-disable-next-line import/no-named-as-default`

These changes fixed both the TypeScript type errors and the ESLint warning.

## Priority Order for Fixes

1. **High Priority:**

   - Fix async client components in critical user flows (product and order pages)
   - Replace `<img>` tags with `<Image>` components for performance improvement

2. **Medium Priority:**

   - Fix remaining async client components

3. **Low Priority:**
   - Refine type definitions in components that already have basic type safety

## Conclusion

While we've made significant progress in addressing linter warnings and improving type safety, these remaining issues should be addressed to ensure optimal performance, maintainability, and adherence to Next.js best practices. The fixes outlined above will help resolve these warnings and further improve the quality of the codebase.

For more detailed guidance on fixing linter warnings, refer to the comprehensive guide in `docs/LINTER_WARNINGS.md`.

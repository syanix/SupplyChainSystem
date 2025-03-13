# Linter Warnings Guide

This document provides guidance on how to address the remaining linter warnings in the codebase.

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

**How to Fix:**
Next.js recommends against making client components async functions. Instead, move the async logic inside useEffect or event handlers:

```typescript
// Instead of this:
export default async function MyComponent() {
  const data = await fetchData();
  return <div>{data}</div>;
}

// Do this:
export default function MyComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchMyData() {
      const result = await fetchData();
      setData(result);
    }
    fetchMyData();
  }, []);

  return <div>{data}</div>;
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

**How to Fix:**
Replace the standard HTML `<img>` tag with Next.js's optimized `<Image>` component:

```typescript
// Instead of this:
<img src="/path/to/image.jpg" alt="Description" />

// Do this:
import Image from 'next/image';

<Image
  src="/path/to/image.jpg"
  alt="Description"
  width={500}
  height={300}
  layout="responsive"
/>
```

## React Hook Warnings

### Missing Dependencies in useEffect

**Warning:**

```
Warning: React Hook useEffect has a missing dependency: 'fetchUserProfile'. Either include it or remove the dependency array.
```

**Files Affected:**

- `apps/web/src/app/profile/page.tsx`
- `apps/web/src/app/suppliers/pages/SuppliersPage.tsx`

**How to Fix:**
There are two ways to fix this:

1. **Add the missing dependency** (preferred when possible):

   ```typescript
   useEffect(() => {
     fetchUserProfile();
   }, [fetchUserProfile, session, status]);
   ```

2. **Disable the linter for that specific line** (use when adding the dependency would cause issues):
   ```typescript
   useEffect(() => {
     fetchUserProfile();
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [session, status]);
   ```

## Import Warnings

### Using Exported Name as Default Import

**Warning:**

```
Warning: Using exported name 'CredentialsProvider' as identifier for default import.
```

**Files Affected:**

- `apps/web/src/lib/auth.ts`

**How to Fix:**
Change the import statement to use the named import syntax:

```typescript
// Instead of this:
import CredentialsProvider from "next-auth/providers/credentials";

// Do this:
import { CredentialsProvider } from "next-auth/providers/credentials";
```

## Best Practices for Avoiding Linter Warnings

1. **Run linter regularly**: Use `npm run lint` to check for warnings before committing code.

2. **Configure your IDE**: Set up your editor to show linter warnings in real-time.

3. **Use ESLint plugins**: The Next.js ESLint plugin helps catch Next.js-specific issues.

4. **Create custom ESLint rules**: For project-specific conventions.

5. **Document exceptions**: When you need to disable a linter rule, add a comment explaining why.

## Automated Fixes

For some linter warnings, you can use the `--fix` flag to automatically fix issues:

```bash
npm run lint -- --fix
```

This works well for simple formatting issues but may not fix more complex problems like the ones described above.

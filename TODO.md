# Supply Chain System TODO List

## High Priority

- [x] Fix TypeScript type issues with Next.js 15 page params
  - [x] Created proper type definitions for Next.js 15 page props
  - [x] Updated client components to use the correct type definitions
  - [x] Fixed TypeScript checking by converting client components to use server components for params handling
  - [x] Removed invalid tenant prop from Layout component usage

## Medium Priority

- [ ] Ensure proper tenant isolation in all database queries
- [ ] Optimize database performance for large datasets
- [ ] Implement comprehensive error handling throughout the application
- [ ] Fix ESLint warnings in the codebase
- [ ] Update client components that are using async functions (see build warnings)
- [ ] Replace `<img>` elements with Next.js `<Image>` components for better performance

## Low Priority

- [ ] Add missing React Hook dependencies in useEffect calls
- [ ] Replace any types with more specific types
- [ ] Improve code documentation
- [ ] Add more comprehensive test coverage

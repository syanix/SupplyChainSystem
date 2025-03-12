import { ReactNode } from 'react';

/**
 * Type definition for Next.js 15 server component page props
 * In Next.js 15, params and searchParams are Promises
 */
export interface ServerPageProps<P = Record<string, unknown>, SP = Record<string, unknown>> {
  params: Promise<P>;
  searchParams?: Promise<SP>;
  children?: ReactNode;
}

/**
 * Type definition for Next.js 15 client component page props
 * For client components with 'use client', we can still access params and searchParams synchronously
 * for backward compatibility
 */
export interface ClientPageProps<P = Record<string, unknown>, SP = Record<string, unknown>> {
  params: P;
  searchParams?: SP;
  children?: ReactNode;
}

/**
 * Helper type to extract the params type from a page component
 */
export type PageParams<T> = T extends { params: infer P } ? P : never;

/**
 * Helper type to extract the searchParams type from a page component
 */
export type PageSearchParams<T> = T extends { searchParams: infer SP } ? SP : never;

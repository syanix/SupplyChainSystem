/**
 * Common utility types for the application
 */

/**
 * A type for unknown record objects instead of using 'any'
 */
export type UnknownRecord = Record<string, unknown>;

/**
 * A type for repository response objects
 */
export type RepositoryResponse<T> = Promise<T>;

/**
 * A type for repository list response objects
 */
export type RepositoryListResponse<T> = Promise<T[]>;

/**
 * A type for repository error handling
 */
export interface RepositoryError extends Error {
  code?: string;
  details?: UnknownRecord;
}

/**
 * A type for pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * A type for pagination response
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * A type for filtering parameters
 */
export interface FilterParams {
  [key: string]:
    | string
    | number
    | boolean
    | Date
    | string[]
    | number[]
    | null
    | undefined;
}

/**
 * A type for search parameters
 */
export interface SearchParams {
  query?: string;
  fields?: string[];
}

/**
 * A type for REST API response
 */
export interface RestApiResponse<T> {
  data: T;
  message?: string;
  status: "success" | "error";
}

/**
 * A type for REST API list response
 */
export interface RestApiListResponse<T> {
  data: T[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
  status: "success" | "error";
}

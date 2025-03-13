/**
 * Type utilities for enhancing type safety across the application
 */

/**
 * A type for unknown record objects instead of using 'any'
 */
export type UnknownRecord = Record<string, unknown>;

/**
 * Type guard to check if a value is a non-null object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Type guard to check if a value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Type guard to check if a value is a number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Type guard to check if a value is a boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Type guard to check if a value is an array
 */
export function isArray<T>(value: unknown, itemGuard?: (item: unknown) => item is T): value is T[] {
  if (!Array.isArray(value)) return false;
  if (!itemGuard) return true;
  return value.every(itemGuard);
}

/**
 * Type guard to check if a value has a specific property
 */
export function hasProperty<K extends string>(obj: unknown, prop: K): obj is Record<K, unknown> {
  return isObject(obj) && prop in obj;
}

/**
 * Type guard to check if a value has a specific property of a specific type
 */
export function hasPropertyOfType<K extends string, T>(
  obj: unknown,
  prop: K,
  guard: (value: unknown) => value is T
): obj is Record<K, T> {
  return hasProperty(obj, prop) && guard(obj[prop]);
}

/**
 * Safely access a property from an unknown object
 */
export function getProperty<T>(
  obj: unknown,
  prop: string,
  guard: (value: unknown) => value is T
): T | undefined {
  if (hasPropertyOfType(obj, prop, guard)) {
    return obj[prop];
  }
  return undefined;
}

/**
 * Safely cast a value to a specific type
 */
export function safeCast<T>(value: unknown, guard: (value: unknown) => value is T): T | undefined {
  if (guard(value)) {
    return value;
  }
  return undefined;
}

/**
 * Ensure a value is of a specific type or throw an error
 */
export function ensureType<T>(
  value: unknown,
  guard: (value: unknown) => value is T,
  errorMessage = 'Value is not of the expected type'
): T {
  if (guard(value)) {
    return value;
  }
  throw new Error(errorMessage);
}

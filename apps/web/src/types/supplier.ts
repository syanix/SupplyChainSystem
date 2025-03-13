export enum SupplierStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  BLOCKED = 'blocked',
}

// Define a type for unknown record objects instead of using 'any'
type UnknownRecord = Record<string, unknown>;

export interface SupplierContact {
  id: string;
  name: string;
  position?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  notes?: string;
  isPrimary: boolean;
  supplierId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  status: SupplierStatus;
  taxId?: string;
  paymentTerms?: string;
  notes?: string;
  tenantId: string;
  contacts: SupplierContact[];
  customFields?: UnknownRecord;
  createdAt: string;
  updatedAt: string;
}

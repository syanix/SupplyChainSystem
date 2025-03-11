export enum SupplierStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  BLOCKED = 'blocked',
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  contacts?: Contact[];
  tenantId?: string;
  status?: SupplierStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  name: string;
  email: string;
  phone: string;
}

export interface CreateSupplierRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  contacts?: Contact[];
  tenantId?: string;
  status?: SupplierStatus;
}

export interface UpdateSupplierRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  contacts?: Contact[];
  status?: SupplierStatus;
} 
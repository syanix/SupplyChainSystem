import { Supplier, SupplierStatus } from '../../../types/supplier';
import { apiClient } from '../../api-client';

// Define a type for unknown record objects instead of using 'any'
type UnknownRecord = Record<string, unknown>;

const API_URL = '/suppliers';

export interface CreateSupplierRequest {
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
  status?: SupplierStatus;
  taxId?: string;
  paymentTerms?: string;
  notes?: string;
  customFields?: UnknownRecord;
  contacts?: {
    name: string;
    position?: string;
    email?: string;
    phone?: string;
    mobile?: string;
    notes?: string;
    isPrimary?: boolean;
  }[];
}

export interface UpdateSupplierRequest extends Partial<CreateSupplierRequest> {}

export const suppliersApi = {
  getAll: async (token: string): Promise<Supplier[]> => {
    return apiClient.request<Supplier[]>(API_URL, 'GET', undefined, token);
  },

  getById: async (id: string, token: string): Promise<Supplier> => {
    return apiClient.request<Supplier>(`${API_URL}/${id}`, 'GET', undefined, token);
  },

  create: async (supplier: CreateSupplierRequest, token: string): Promise<Supplier> => {
    // Cast to UnknownRecord to satisfy the type constraint
    return apiClient.request<Supplier>(
      API_URL,
      'POST',
      supplier as unknown as UnknownRecord,
      token
    );
  },

  update: async (id: string, supplier: UpdateSupplierRequest, token: string): Promise<Supplier> => {
    // Cast to UnknownRecord to satisfy the type constraint
    return apiClient.request<Supplier>(
      `${API_URL}/${id}`,
      'PUT',
      supplier as unknown as UnknownRecord,
      token
    );
  },

  delete: async (id: string, token: string): Promise<void> => {
    return apiClient.request<void>(`${API_URL}/${id}`, 'DELETE', undefined, token);
  },
};

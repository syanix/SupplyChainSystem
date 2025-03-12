export interface Tenant {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTenantRequest {
  name: string;
  slug: string;
}

export interface UpdateTenantRequest {
  name?: string;
  slug?: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTenantRequest {
  name: string;
  slug?: string;
  description?: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  isActive?: boolean;
}

export interface UpdateTenantRequest {
  name?: string;
  slug?: string;
  description?: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  isActive?: boolean;
}

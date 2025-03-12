'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Layout } from '@supply-chain-system/ui';

interface Tenant {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  tenantId: string;
  isActive: boolean;
}

interface PageParams {
  id: string;
}

export default function EditUserPage({ params }: { params: PageParams }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [formData, setFormData] = useState<Omit<User, 'id'> & { password?: string }>({
    name: '',
    email: '',
    role: '',
    tenantId: '',
    isActive: true,
    password: '',
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Properly unwrap params using use() from React
  const resolvedParams = use(params as any) as PageParams;
  const userId = resolvedParams.id;

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    // Redirect to dashboard if not super admin
    if (status === 'authenticated' && session?.user?.role !== 'SUPER_ADMIN') {
      router.push('/dashboard');
      return;
    }

    if (status === 'loading') {
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        );

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user');
        }

        const userData = await userResponse.json();

        // Fetch tenants
        const tenantsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/tenants`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });

        if (!tenantsResponse.ok) {
          throw new Error('Failed to fetch tenants');
        }

        const tenantsData = await tenantsResponse.json();
        setTenants(tenantsData);

        // Set form data
        setFormData({
          name: userData.name,
          email: userData.email,
          role: userData.role,
          tenantId: userData.tenantId,
          isActive: userData.isActive,
          password: '',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (session?.accessToken) {
      fetchData();
    }
  }, [session, status, router, userId]);

  const validatePassword = (password: string): string | null => {
    if (!password) return null; // Password is optional for updates

    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return 'Password must contain at least one special character (@$!%*?&)';
    }
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));

      // Validate password if provided
      if (name === 'password' && value) {
        setPasswordError(validatePassword(value));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password if provided
    if (formData.password) {
      const passwordValidationError = validatePassword(formData.password);
      if (passwordValidationError) {
        setPasswordError(passwordValidationError);
        return;
      }
    }

    setSubmitting(true);
    setError(null);

    // Remove empty password from the payload
    const payload = { ...formData };
    if (!payload.password) {
      delete payload.password;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }

      router.push('/admin/users');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/auth/login');
  };

  if (status === 'loading' || loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <Layout user={session?.user} onLogout={handleLogout}>
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Edit User</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
              Role
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="STAFF">Staff</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tenantId">
              Organization
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="tenantId"
              name="tenantId"
              value={formData.tenantId}
              onChange={handleChange}
              required
            >
              <option value="">Select an organization</option>
              {tenants.map(tenant => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-gray-700 text-sm font-bold">Active</span>
            </label>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className={`shadow appearance-none border ${passwordError ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
            />
            {passwordError && <p className="text-red-500 text-xs italic">{passwordError}</p>}
            <p className="text-gray-500 text-xs mt-1">
              Password must be at least 6 characters with uppercase, lowercase, number, and special
              character.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <button
              className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => router.push('/admin/users')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

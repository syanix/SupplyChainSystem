'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Layout } from '@supply-chain-system/ui';
import { UserRole } from '@supply-chain-system/shared';

interface Tenant {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export default function TenantsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    // Redirect to dashboard if not admin or super admin
    if (
      status === 'authenticated' &&
      session?.user?.role !== UserRole.ADMIN &&
      session?.user?.role !== 'SUPER_ADMIN'
    ) {
      router.push('/dashboard');
      return;
    }

    if (status === 'loading') {
      return;
    }

    const fetchTenants = async () => {
      try {
        // Use admin endpoint for super admin, regular endpoint for normal admin
        const endpoint =
          session?.user?.role === 'SUPER_ADMIN'
            ? `${process.env.NEXT_PUBLIC_API_URL}/admin/tenants`
            : `${process.env.NEXT_PUBLIC_API_URL}/tenants`;

        const response = await fetch(endpoint, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tenants');
        }

        const data = await response.json();
        setTenants(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (session?.accessToken) {
      fetchTenants();
    }
  }, [session, status, router]);

  const handleDelete = async (id: string) => {
    if (!session?.accessToken) {
      setError('You must be logged in to delete tenants');
      return;
    }

    if (
      window.confirm('Are you sure you want to delete this tenant? This action cannot be undone.')
    ) {
      try {
        // Use admin endpoint for super admin, regular endpoint for normal admin
        const endpoint =
          session?.user?.role === 'SUPER_ADMIN'
            ? `${process.env.NEXT_PUBLIC_API_URL}/admin/tenants/${id}`
            : `${process.env.NEXT_PUBLIC_API_URL}/tenants/${id}`;

        const response = await fetch(endpoint, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete tenant');
        }

        setTenants(tenants.filter(tenant => tenant.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/auth/login');
  };

  if (status === 'loading' || loading) {
    return <div className="p-4">Loading tenants...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  // Ensure we're passing the role correctly to the Layout component
  const userData = {
    name: session?.user?.name,
    email: session?.user?.email,
    role: session?.user?.role,
  };

  console.log('Tenants page - User data being passed to Layout:', userData);
  console.log('Tenants page - Session user role:', session?.user?.role);

  return (
    <Layout user={userData} onLogout={handleLogout}>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Tenant Management</h1>
          <Link href="/admin/tenants/new" className="bg-primary text-white px-4 py-2 rounded">
            Add New Tenant
          </Link>
        </div>

        {tenants.length === 0 ? (
          <div className="text-center p-4 border rounded">
            <p>No tenants found. Add your first tenant to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-left">Slug</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left">Created At</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {tenants.map(tenant => (
                  <tr key={tenant.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left">{tenant.name}</td>
                    <td className="py-3 px-6 text-left">{tenant.slug}</td>
                    <td className="py-3 px-6 text-left">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          tenant.isActive
                            ? 'bg-green-200 text-green-800'
                            : 'bg-red-200 text-red-800'
                        }`}
                      >
                        {tenant.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-left">
                      {new Date(tenant.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center">
                        <Link
                          href={`/admin/tenants/${tenant.id}`}
                          className="w-4 mr-4 transform hover:text-blue-500 hover:scale-110"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </Link>
                        <Link
                          href={`/admin/tenants/${tenant.id}/edit`}
                          className="w-4 mr-4 transform hover:text-yellow-500 hover:scale-110"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(tenant.id)}
                          className="w-4 mr-2 transform hover:text-red-500 hover:scale-110"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

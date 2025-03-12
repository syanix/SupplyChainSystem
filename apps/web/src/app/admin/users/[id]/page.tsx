'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Layout } from '@supply-chain-system/ui';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  tenantId: string;
  tenant?: {
    name: string;
    slug: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Convert to a server component to properly handle params as a Promise
export default async function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // Resolve the params Promise to get the actual id
  const resolvedParams = await params;
  const userId = resolvedParams.id;

  return <UserDetailsClient userId={userId} />;
}

// Create a client component that takes the resolved userId
function UserDetailsClient({ userId }: { userId: string }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

    const fetchUser = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (session?.accessToken) {
      fetchUser();
    }
  }, [session, status, router, userId]);

  const handleDelete = async () => {
    if (!session?.accessToken) {
      setError('You must be logged in to delete users');
      return;
    }

    if (
      window.confirm('Are you sure you want to delete this user? This action cannot be undone.')
    ) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete user');
        }

        router.push('/admin/users');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/auth/login');
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-purple-200 text-purple-800';
      case 'ADMIN':
        return 'bg-blue-200 text-blue-800';
      case 'MANAGER':
        return 'bg-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  if (status === 'loading' || loading) {
    return <div className="p-4">Loading user details...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!user) {
    return <div className="p-4">User not found</div>;
  }

  return (
    <Layout user={session?.user} onLogout={handleLogout}>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User Details</h1>
          <div className="flex space-x-2">
            <Link
              href={`/admin/users/${user.id}/edit`}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
            <Link
              href="/admin/users"
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Back to Users
            </Link>
          </div>
        </div>

        <div className="bg-white shadow-md rounded p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600 font-medium">Name:</span>
                  <span className="ml-2">{user.name}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Email:</span>
                  <span className="ml-2">{user.email}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Role:</span>
                  <span className="ml-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getRoleBadgeColor(user.role)}`}
                    >
                      {user.role}
                    </span>
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Status:</span>
                  <span className="ml-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.isActive ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4">Organization Information</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600 font-medium">Organization:</span>
                  <span className="ml-2">{user.tenant?.name || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Organization Slug:</span>
                  <span className="ml-2">{user.tenant?.slug || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t">
            <h2 className="text-lg font-semibold mb-4">System Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <span className="text-gray-600 font-medium">User ID:</span>
                <span className="ml-2 text-sm font-mono">{user.id}</span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Created At:</span>
                <span className="ml-2">{new Date(user.createdAt).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Last Updated:</span>
                <span className="ml-2">{new Date(user.updatedAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import {
  Layout,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Alert,
} from '@supply-chain-system/ui';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface DashboardStats {
  orders: number;
  products: number;
  suppliers: number;
}

export default function DashboardPage() {
  const { user, tenant, isLoading, setUser, setTenant } = useAppContext();
  const router = useRouter();
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !session) {
      router.push('/auth/login');
      return;
    }

    // Update app context with session data
    if (session?.user && !user) {
      setUser(session.user as any);
      if (session.tenant) {
        setTenant(session.tenant as any);
      }
    }

    // Use mock data for dashboard stats
    setStats({
      orders: 12,
      products: 48,
      suppliers: 7,
    });
  }, [session, user, isLoading, router, setUser, setTenant]);

  if (isLoading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const handleLogout = () => {
    // Clear user context and redirect to login
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('tenant');
    router.push('/auth/login');
  };

  return (
    <Layout user={session.user} onLogout={handleLogout}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {session.user?.name || session.user?.email}!
        </p>
      </div>

      {error && (
        <Alert variant="error" title="Error" className="mb-6" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-500 mr-4">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Orders</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.orders}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link
                href="/orders"
                className="text-indigo-500 hover:text-indigo-600 text-sm font-medium"
              >
                View all orders →
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Products</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.products}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link
                href="/products"
                className="text-green-500 hover:text-green-600 text-sm font-medium"
              >
                View all products →
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Suppliers</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.suppliers}</p>
              </div>
            </div>
            <div className="mt-4">
              <Link
                href="/suppliers"
                className="text-yellow-500 hover:text-yellow-600 text-sm font-medium"
              >
                View all suppliers →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="default" size="lg" fullWidth>
              <Link href="/orders/new" className="w-full text-center">
                Create New Order
              </Link>
            </Button>
            <Button variant="secondary" size="lg" fullWidth>
              <Link href="/products/new" className="w-full text-center">
                Add New Product
              </Link>
            </Button>
            <Button variant="outline" size="lg" fullWidth>
              <Link href="/suppliers/new" className="w-full text-center">
                Add New Supplier
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
}

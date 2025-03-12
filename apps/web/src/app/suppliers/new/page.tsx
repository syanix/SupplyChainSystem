'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Layout } from '@supply-chain-system/ui';
import SupplierForm from '../components/SupplierForm';

export default function NewSupplierPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  if (status === 'unauthenticated') {
    router.push('/auth/login');
    return null;
  }

  if (status === 'loading') {
    return <div className="p-4">Loading...</div>;
  }

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/suppliers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create supplier');
      }

      router.push('/suppliers');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout user={session?.user} onLogout={() => router.push('/auth/login')}>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Add New Supplier</h1>
          <Link href="/suppliers" className="text-blue-500 hover:text-blue-700">
            Back to Suppliers
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <SupplierForm
            onSubmit={handleSubmit}
            loading={loading}
            title="New Supplier Information"
          />
        </div>
      </div>
    </Layout>
  );
}

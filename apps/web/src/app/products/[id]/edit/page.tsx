'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductForm from '../../components/ProductForm';
import { Product } from '@/types/product';
import { useSession } from 'next-auth/react';

// Client component that uses hooks
function EditProductClient({ id }: { id: string }) {
  const { data: session } = useSession();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (session?.accessToken) {
      fetchProduct();
    }
  }, [id, session?.accessToken]);

  if (loading) {
    return <div className="p-4">Loading product details...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!product) {
    return <div className="p-4">Product not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <Link href={`/products/${id}`} className="text-blue-500 hover:text-blue-700">
            Back to Product Details
          </Link>
        </div>
        <p className="text-gray-600 mt-1">Update product information</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <ProductForm product={product} isEditing={true} />
      </div>
    </div>
  );
}

// Page component that handles async params
interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  return <EditProductClient id={id} />;
}

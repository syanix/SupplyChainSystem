'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Product } from '@/types/product';
import { useSession } from 'next-auth/react';

// Client component that uses hooks
function ProductDetailClient({ id }: { id: string }) {
  const router = useRouter();
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

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete product');
        }

        router.push('/products');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    }
  };

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
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <Link href="/products" className="text-blue-500 hover:text-blue-700">
            Back to Products
          </Link>
        </div>
        <p className="text-gray-600 mt-1">Product details</p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row">
            {product.imageUrl && (
              <div className="md:w-1/3 mb-4 md:mb-0 md:mr-6">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-auto rounded-lg object-cover"
                />
              </div>
            )}

            <div className="md:w-2/3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">SKU</h3>
                  <p className="mt-1 text-sm text-gray-900">{product.sku || 'N/A'}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Price</h3>
                  <p className="mt-1 text-sm text-gray-900">${product.price.toFixed(2)}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Stock Quantity</h3>
                  <p className="mt-1 text-sm text-gray-900">{product.stockQuantity}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="mt-1">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${product.isActive ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}
                    >
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>

                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {product.description || 'No description available'}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => router.push(`/products/${product.id}/edit`)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Edit Product
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex space-x-3">
        <button
          onClick={handleDelete}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Delete Product
        </button>
      </div>
    </div>
  );
}

// Page component that handles async params
interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  return <ProductDetailClient id={id} />;
}

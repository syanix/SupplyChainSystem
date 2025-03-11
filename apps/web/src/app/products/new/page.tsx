'use client';

import Link from 'next/link';
import ProductForm from '../components/ProductForm';

export default function NewProductPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Create New Product</h1>
          <Link href="/products" className="text-blue-500 hover:text-blue-700">
            Back to Products
          </Link>
        </div>
        <p className="text-gray-600 mt-1">Add a new product to your inventory</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <ProductForm />
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Layout,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Table,
  Alert,
  Badge,
  Breadcrumb,
} from '@supply-chain-system/ui';
import Link from 'next/link';
import { OrderStatus } from '@supply-chain-system/shared';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  supplierName: string;
  supplierId: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

// Client component that uses hooks
function OrderDetailClient({ id }: { id: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    // Fetch order details
    const fetchOrder = async () => {
      try {
        setError(null);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }

        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error('Failed to fetch order details:', error);
        setError('An error occurred while fetching order details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchOrder();
    }
  }, [id, session, status, router]);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.DRAFT:
        return <Badge variant="secondary">Draft</Badge>;
      case OrderStatus.PENDING:
        return <Badge variant="warning">Pending</Badge>;
      case OrderStatus.CONFIRMED:
        return <Badge variant="info">Confirmed</Badge>;
      case OrderStatus.SHIPPED:
        return <Badge variant="primary">Shipped</Badge>;
      case OrderStatus.DELIVERED:
        return <Badge variant="success">Delivered</Badge>;
      case OrderStatus.CANCELLED:
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleLogout = () => {
    // Clear user context and redirect to login
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('tenant');
    router.push('/auth/login');
  };

  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <Layout user={session.user} onLogout={handleLogout}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </Layout>
    );
  }

  if (error || !order) {
    return (
      <Layout user={session.user} onLogout={handleLogout}>
        <Alert variant="error" title="Error" className="mb-6" onClose={() => setError(null)}>
          {error || 'Order not found'}
        </Alert>
        <Button variant="outline" onClick={() => router.push('/orders')}>
          Back to Orders
        </Button>
      </Layout>
    );
  }

  // Define columns for the order items table
  const itemColumns = [
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (price: number) => formatCurrency(price),
    },
    {
      title: 'Total',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price: number) => formatCurrency(price),
    },
  ];

  return (
    <Layout user={session.user} onLogout={handleLogout}>
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Orders', href: '/orders' },
          { label: `Order #${order.orderNumber}` },
        ]}
        className="mb-4"
      />

      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
          <p className="text-gray-600 mt-1">Created on {formatDate(order.createdAt)}</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => router.push('/orders')}>
            Back to Orders
          </Button>
          <Button variant="default" onClick={() => router.push(`/orders/${order.id}/edit`)}>
            Edit Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Order Status</h3>
            <div className="flex items-center">
              {getStatusBadge(order.status)}
              <span className="ml-2">{order.status}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Supplier</h3>
            <p>{order.supplierName}</p>
            <Link
              href={`/suppliers/${order.supplierId}`}
              className="text-indigo-600 hover:text-indigo-800 text-sm mt-2 inline-block"
            >
              View Supplier
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Total Amount</h3>
            <p className="text-2xl font-bold">{formatCurrency(order.totalAmount)}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table
            columns={itemColumns}
            data={order.items}
            pagination={false}
            summary={() => (
              <tr>
                <th colSpan={3} className="text-right font-semibold">
                  Total:
                </th>
                <td className="font-bold">{formatCurrency(order.totalAmount)}</td>
              </tr>
            )}
          />
        </CardContent>
      </Card>

      {order.notes && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{order.notes}</p>
          </CardContent>
        </Card>
      )}
    </Layout>
  );
}

// Page component that handles async params
type OrderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

// Server component that handles params as a Promise
export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  // Resolve the params Promise to get the actual id
  const resolvedParams = await params;
  const id = resolvedParams.id;

  return <OrderDetailClient id={id} />;
}

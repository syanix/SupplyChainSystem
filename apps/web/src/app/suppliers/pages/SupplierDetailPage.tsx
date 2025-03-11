'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Card, Descriptions, Tag, Button, List, Spin, message } from 'antd';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { suppliersApi } from '../api/suppliers.api';
import { Supplier, SupplierStatus } from '../../../types/supplier';

interface SupplierDetailPageProps {
  params: {
    id: string;
  };
}

const getStatusColor = (status: SupplierStatus) => {
  switch (status) {
    case SupplierStatus.ACTIVE:
      return 'green';
    case SupplierStatus.INACTIVE:
      return 'gray';
    case SupplierStatus.PENDING:
      return 'orange';
    case SupplierStatus.BLOCKED:
      return 'red';
    default:
      return 'blue';
  }
};

const SupplierDetailPage: React.FC<SupplierDetailPageProps> = ({ params }) => {
  const { id } = params;
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchSupplier = async () => {
      if (!session?.accessToken) {
        message.error('Authentication required');
        router.push('/suppliers');
        return;
      }

      try {
        const data = await suppliersApi.getById(id, session.accessToken);
        setSupplier(data);
      } catch (error) {
        console.error('Failed to fetch supplier:', error);
        message.error('Failed to fetch supplier details');
        router.push('/suppliers');
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [id, router, session]);

  const handleDelete = async () => {
    if (!session?.accessToken) {
      message.error('Authentication required');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this supplier?')) {
      return;
    }

    setDeleting(true);
    try {
      await suppliersApi.delete(id, session.accessToken);
      message.success('Supplier deleted successfully');
      router.push('/suppliers');
    } catch (error) {
      console.error('Failed to delete supplier:', error);
      message.error('Failed to delete supplier');
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = () => {
    router.push(`/suppliers/${id}/edit`);
  };

  const handleBack = () => {
    router.push('/suppliers');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Loading supplier details..." />
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="p-6">
        <PageHeader title="Supplier Not Found" onBack={handleBack} />
        <Card>
          <p>The requested supplier could not be found.</p>
          <Button type="primary" onClick={handleBack}>
            Back to Suppliers
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Supplier Details"
        onBack={handleBack}
        extra={[
          <Button key="edit" type="primary" onClick={handleEdit}>
            Edit
          </Button>,
          <Button key="delete" danger onClick={handleDelete} loading={deleting}>
            Delete
          </Button>,
        ]}
      />

      <div className="grid grid-cols-1 gap-6">
        <Card title="Basic Information">
          <Descriptions column={{ xs: 1, sm: 2, md: 3 }} layout="vertical">
            <Descriptions.Item label="Name">{supplier.name}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={getStatusColor(supplier.status)}>{supplier.status}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Email">{supplier.email || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Phone">{supplier.phone || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Website">{supplier.website || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Tax ID">{supplier.taxId || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Payment Terms">
              {supplier.paymentTerms || 'N/A'}
            </Descriptions.Item>
          </Descriptions>
          {supplier.description && (
            <>
              <h3 className="text-lg font-medium mt-4 mb-2">Description</h3>
              <p>{supplier.description}</p>
            </>
          )}
        </Card>

        <Card title="Address Information">
          <Descriptions column={{ xs: 1, sm: 2 }} layout="vertical">
            <Descriptions.Item label="Address">{supplier.address || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="City">{supplier.city || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="State/Province">{supplier.state || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Postal Code">
              {supplier.postalCode || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Country">{supplier.country || 'N/A'}</Descriptions.Item>
          </Descriptions>
        </Card>

        {supplier.contacts && supplier.contacts.length > 0 && (
          <Card title="Contact Persons">
            <List
              itemLayout="vertical"
              dataSource={supplier.contacts}
              renderItem={contact => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <div className="flex items-center">
                        <span>{contact.name}</span>
                        {contact.isPrimary && (
                          <Tag color="blue" className="ml-2">
                            Primary
                          </Tag>
                        )}
                      </div>
                    }
                    description={contact.position || 'No position specified'}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    <div>
                      <strong>Email:</strong> {contact.email || 'N/A'}
                    </div>
                    <div>
                      <strong>Phone:</strong> {contact.phone || 'N/A'}
                    </div>
                    <div>
                      <strong>Mobile:</strong> {contact.mobile || 'N/A'}
                    </div>
                  </div>
                  {contact.notes && (
                    <div className="mt-2">
                      <strong>Notes:</strong> {contact.notes}
                    </div>
                  )}
                </List.Item>
              )}
            />
          </Card>
        )}

        {supplier.notes && (
          <Card title="Notes">
            <p>{supplier.notes}</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SupplierDetailPage;

'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Spin, message } from 'antd';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import SupplierForm from '../components/SupplierForm';
import { suppliersApi, UpdateSupplierRequest } from '../api/suppliers.api';
import { Supplier } from '../../../types/supplier';

interface EditSupplierPageProps {
  params: {
    id: string;
  };
}

const EditSupplierPage: React.FC<EditSupplierPageProps> = ({ params }) => {
  const { id } = params;
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

  const handleSubmit = async (values: UpdateSupplierRequest) => {
    if (!session?.accessToken) {
      message.error('Authentication required');
      return;
    }

    setSubmitting(true);
    try {
      await suppliersApi.update(id, values, session.accessToken);
      message.success('Supplier updated successfully');
      router.push(`/suppliers/${id}`);
    } catch (error) {
      console.error('Failed to update supplier:', error);
      message.error('Failed to update supplier');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push(`/suppliers/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Loading supplier details..." />
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader title="Edit Supplier" onBack={handleBack} />
      {supplier && (
        <SupplierForm
          initialValues={supplier}
          onSubmit={values => handleSubmit(values as UpdateSupplierRequest)}
          loading={submitting}
          title="Supplier Information"
        />
      )}
    </div>
  );
};

export default EditSupplierPage;

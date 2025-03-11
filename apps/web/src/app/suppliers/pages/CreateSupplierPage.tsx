import React, { useState } from 'react';
import { message } from 'antd';
import { PageHeader } from '../../../components/ui/PageHeader';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { suppliersApi, CreateSupplierRequest } from '../api/suppliers.api';
import SupplierForm from '../components/SupplierForm';

const CreateSupplierPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleSubmit = async (values: CreateSupplierRequest) => {
    if (!session?.accessToken) {
      message.error('Authentication required');
      return;
    }

    setLoading(true);
    try {
      await suppliersApi.create(values, session.accessToken);
      message.success('Supplier created successfully');
      router.push('/suppliers');
    } catch (error) {
      console.error('Failed to create supplier:', error);
      message.error('Failed to create supplier');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/suppliers');
  };

  return (
    <div className="p-6">
      <PageHeader title="Create Supplier" onBack={handleBack} />
      <SupplierForm
        onSubmit={values => handleSubmit(values as CreateSupplierRequest)}
        loading={loading}
        title="Supplier Information"
      />
    </div>
  );
};

export default CreateSupplierPage;

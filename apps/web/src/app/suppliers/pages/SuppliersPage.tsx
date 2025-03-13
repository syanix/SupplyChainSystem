'use client';

import React, { useEffect, useState } from 'react';
import { Button, Card, Table, Space, Tag, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Supplier, SupplierStatus } from '../../../types/supplier';
import { suppliersApi } from '../api/suppliers.api';
import { PageHeader } from '../../../components/ui/PageHeader';

const statusColors = {
  [SupplierStatus.ACTIVE]: 'green',
  [SupplierStatus.INACTIVE]: 'orange',
  [SupplierStatus.PENDING]: 'blue',
  [SupplierStatus.BLOCKED]: 'red',
};

const SuppliersPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { data: session } = useSession();

  const fetchSuppliers = async () => {
    if (!session?.accessToken) {
      message.error('Authentication required');
      return;
    }

    try {
      setLoading(true);
      const data = await suppliersApi.getAll(session.accessToken);
      setSuppliers(data);
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
      message.error('Failed to fetch suppliers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const handleDelete = async (id: string) => {
    if (!session?.accessToken) {
      message.error('Authentication required');
      return;
    }

    try {
      await suppliersApi.delete(id, session.accessToken);
      message.success('Supplier deleted successfully');
      fetchSuppliers();
    } catch (error) {
      console.error('Failed to delete supplier:', error);
      message.error('Failed to delete supplier');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Supplier) => (
        <a onClick={() => router.push(`/suppliers/${record.id}`)}>{text}</a>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: SupplierStatus) => (
        <Tag color={statusColors[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Supplier) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => router.push(`/suppliers/${record.id}/edit`)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this supplier?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <PageHeader
        title="Suppliers"
        extra={[
          <Button
            key="add"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push('/suppliers/create')}
          >
            Add Supplier
          </Button>,
        ]}
      />
      <Card>
        <Table
          columns={columns}
          dataSource={suppliers.map(supplier => ({ ...supplier, key: supplier.id }))}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default SuppliersPage;

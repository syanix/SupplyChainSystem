import React from 'react';
import { Table as AntTable } from 'antd';
import type { ColumnsType } from 'antd/es/table';

export interface TableProps<T> {
  data: T[];
  columns: ColumnsType<T>;
  loading?: boolean;
}

export function Table<T extends object>({ data, columns, loading }: TableProps<T>) {
  return <AntTable dataSource={data} columns={columns} loading={loading} rowKey="id" />;
}

import React from "react";
import { Table as AntTable } from "antd";
import type { ColumnType, TableProps as AntTableProps } from "antd/es/table";
import type { Key } from "antd/es/table/interface";

// Use antd's DataIndex type
type DataIndex = string | number | readonly (string | number)[];

export interface TableColumn<T> {
  title: string;
  dataIndex: DataIndex;
  key?: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  width?: number | string;
  align?: "left" | "right" | "center";
  sorter?: boolean | ((a: T, b: T) => number);
  sortDirections?: ("ascend" | "descend")[];
  defaultSortOrder?: "ascend" | "descend";
  filters?: { text: string; value: Key }[];
  onFilter?: (value: Key | boolean, record: T) => boolean;
  // Support for legacy format
  header?: string;
  accessor?: string | ((record: T) => React.ReactNode | string);
}

export interface TableProps<T> extends Omit<AntTableProps<T>, "columns"> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  keyExtractor?: (item: T) => string;
  emptyMessage?: string;
  onRowClick?: (record: T) => void;
}

export function Table<T extends object>({
  data,
  columns,
  loading,
  keyExtractor,
  emptyMessage,
  onRowClick,
  ...props
}: TableProps<T>) {
  // Convert legacy format columns to AntD format
  const antColumns = columns.map((col) => {
    // Handle legacy format
    if (col.header && !col.title) {
      col.title = col.header;
    }

    if (col.accessor && !col.dataIndex) {
      if (typeof col.accessor === "string") {
        col.dataIndex = col.accessor;
      } else {
        // If accessor is a function, use it as render function
        col.render = (_, record) =>
          col.accessor && typeof col.accessor === "function"
            ? col.accessor(record)
            : null;
        col.dataIndex = "id"; // Use a default dataIndex
      }
    }

    return {
      ...col,
      key: col.key || String(col.dataIndex),
    };
  }) as ColumnType<T>[];

  return (
    <AntTable<T>
      dataSource={data}
      columns={antColumns}
      loading={loading}
      rowKey={keyExtractor || "id"}
      locale={{ emptyText: emptyMessage || "No data" }}
      onRow={
        onRowClick
          ? (record) => ({
              onClick: () => onRowClick(record),
            })
          : undefined
      }
      {...props}
    />
  );
}

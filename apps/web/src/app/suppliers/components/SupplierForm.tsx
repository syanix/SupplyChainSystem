import React from 'react';
import { Form, Input, Button, Select, Card } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { CreateSupplierRequest, UpdateSupplierRequest } from '../api/suppliers.api';
import { SupplierStatus } from '../../../types/supplier';

export interface SupplierFormProps {
  initialValues?: any;
  onSubmit: (values: CreateSupplierRequest | UpdateSupplierRequest) => Promise<void>;
  loading?: boolean;
  title?: string;
}

const SupplierForm: React.FC<SupplierFormProps> = ({
  initialValues,
  onSubmit,
  loading = false,
  title = 'Supplier Form',
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      await onSubmit(values);
      if (!initialValues) {
        form.resetFields();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Card title={title} className="mb-6">
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues || {}}
        onFinish={handleSubmit}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter supplier name' }]}
        >
          <Input placeholder="Enter supplier name" />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={4} placeholder="Enter supplier description" />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item name="email" label="Email">
            <Input type="email" placeholder="Enter email address" />
          </Form.Item>

          <Form.Item name="phone" label="Phone">
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item name="website" label="Website">
            <Input placeholder="Enter website URL" />
          </Form.Item>

          <Form.Item name="status" label="Status">
            <Select placeholder="Select status">
              <Select.Option value={SupplierStatus.ACTIVE}>Active</Select.Option>
              <Select.Option value={SupplierStatus.INACTIVE}>Inactive</Select.Option>
              <Select.Option value={SupplierStatus.PENDING}>Pending</Select.Option>
              <Select.Option value={SupplierStatus.BLOCKED}>Blocked</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <h3 className="text-lg font-medium mb-4 mt-6">Address Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item name="address" label="Address">
            <Input placeholder="Enter street address" />
          </Form.Item>

          <Form.Item name="city" label="City">
            <Input placeholder="Enter city" />
          </Form.Item>

          <Form.Item name="state" label="State/Province">
            <Input placeholder="Enter state or province" />
          </Form.Item>

          <Form.Item name="postalCode" label="Postal Code">
            <Input placeholder="Enter postal code" />
          </Form.Item>

          <Form.Item name="country" label="Country">
            <Input placeholder="Enter country" />
          </Form.Item>
        </div>

        <h3 className="text-lg font-medium mb-4 mt-6">Additional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item name="taxId" label="Tax ID">
            <Input placeholder="Enter tax ID" />
          </Form.Item>

          <Form.Item name="paymentTerms" label="Payment Terms">
            <Input placeholder="Enter payment terms" />
          </Form.Item>
        </div>

        <Form.Item name="notes" label="Notes">
          <Input.TextArea rows={4} placeholder="Enter additional notes" />
        </Form.Item>

        <h3 className="text-lg font-medium mb-4 mt-6">Contact Persons</h3>
        <Form.List name="contacts">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Card key={key} className="mb-4" size="small">
                  <div className="flex justify-end mb-2">
                    <Button
                      type="text"
                      danger
                      icon={<MinusCircleOutlined />}
                      onClick={() => remove(name)}
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                      {...restField}
                      name={[name, 'name']}
                      label="Name"
                      rules={[{ required: true, message: 'Name is required' }]}
                    >
                      <Input placeholder="Enter contact name" />
                    </Form.Item>

                    <Form.Item {...restField} name={[name, 'position']} label="Position">
                      <Input placeholder="Enter position" />
                    </Form.Item>

                    <Form.Item {...restField} name={[name, 'email']} label="Email">
                      <Input type="email" placeholder="Enter email" />
                    </Form.Item>

                    <Form.Item {...restField} name={[name, 'phone']} label="Phone">
                      <Input placeholder="Enter phone number" />
                    </Form.Item>

                    <Form.Item {...restField} name={[name, 'mobile']} label="Mobile">
                      <Input placeholder="Enter mobile number" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'isPrimary']}
                      valuePropName="checked"
                      label="Primary Contact"
                    >
                      <Select>
                        <Select.Option value={true}>Yes</Select.Option>
                        <Select.Option value={false}>No</Select.Option>
                      </Select>
                    </Form.Item>
                  </div>

                  <Form.Item {...restField} name={[name, 'notes']} label="Notes">
                    <Input.TextArea rows={2} placeholder="Enter notes" />
                  </Form.Item>
                </Card>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} block>
                  Add Contact
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item className="mt-6">
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialValues ? 'Update Supplier' : 'Create Supplier'}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SupplierForm;

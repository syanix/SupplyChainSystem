import { Typography, Space, Button } from 'antd';

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  extra?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, onBack, extra }) => {
  return (
    <div className="flex justify-between items-center mb-6 py-4">
      <Space>
        {onBack && (
          <Button onClick={onBack} type="link">
            Back
          </Button>
        )}
        <Typography.Title level={4} style={{ margin: 0 }}>
          {title}
        </Typography.Title>
      </Space>
      {extra && <div>{extra}</div>}
    </div>
  );
};

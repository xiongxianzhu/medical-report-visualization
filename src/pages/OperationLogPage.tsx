/**
 * 📝 操作日志页面 / Operation Log Page
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Table,
  Input,
  Select,
  DatePicker,
  Tag,
  Space,
  Button,
  Modal,
  Descriptions,
} from 'antd';
import {
  SearchOutlined,
  ExportOutlined,
  ReloadOutlined,
  EyeOutlined,
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

interface OperationLogData {
  id: string;
  userId: string;
  username: string;
  url: string;
  httpMethod: string;
  requestParams: string;
  responseData: string;
  ip: string;
  createdAt: string;
}

const OperationLogPage: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<OperationLogData | null>(null);

  // 模拟数据
  const mockLogs: OperationLogData[] = [
    {
      id: '1',
      userId: 'u001',
      username: '张医生',
      url: '/api/v1/users',
      httpMethod: 'POST',
      requestParams: '{"username":"test","realName":"测试用户"}',
      responseData: '{"code":200,"msg":"success","data":{"id":"123"}}',
      ip: '192.168.1.101',
      createdAt: '2024-12-24 10:35:22',
    },
    {
      id: '2',
      userId: 'u002',
      username: '李主任',
      url: '/api/v1/reports/1',
      httpMethod: 'PUT',
      requestParams: '{"status":"approved"}',
      responseData: '{"code":200,"msg":"success"}',
      ip: '192.168.1.102',
      createdAt: '2024-12-24 10:20:15',
    },
    {
      id: '3',
      userId: 'u001',
      username: '张医生',
      url: '/api/v1/files/upload',
      httpMethod: 'POST',
      requestParams: '[文件上传]',
      responseData: '{"code":200,"msg":"success","data":{"fileUrl":"/files/xxx.pdf"}}',
      ip: '192.168.1.101',
      createdAt: '2024-12-24 10:15:08',
    },
    {
      id: '4',
      userId: 'u003',
      username: '王护士',
      url: '/api/v1/users/5',
      httpMethod: 'DELETE',
      requestParams: '{}',
      responseData: '{"code":200,"msg":"success"}',
      ip: '192.168.1.103',
      createdAt: '2024-12-24 09:50:33',
    },
  ];

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: 'green',
      POST: 'blue',
      PUT: 'orange',
      DELETE: 'red',
      PATCH: 'purple',
    };
    return colors[method] || 'default';
  };

  const columns = [
    {
      title: t('log.username'),
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: t('log.method'),
      dataIndex: 'httpMethod',
      key: 'httpMethod',
      render: (method: string) => (
        <Tag color={getMethodColor(method)}>{method}</Tag>
      ),
    },
    {
      title: t('log.url'),
      dataIndex: 'url',
      key: 'url',
      render: (url: string) => (
        <code className="px-2 py-0.5 bg-muted rounded text-sm">{url}</code>
      ),
    },
    {
      title: t('log.ip'),
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: t('log.operationTime'),
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: t('common.actions'),
      key: 'actions',
      width: 100,
      render: (_: any, record: OperationLogData) => (
        <Button
          type="text"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedLog(record);
            setDetailOpen(true);
          }}
        >
          详情
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('log.operationLog')}</h1>
          <p className="text-muted-foreground text-sm mt-1">查看系统操作审计记录</p>
        </div>
        <Space>
          <Button icon={<ExportOutlined />}>导出</Button>
          <Button icon={<ReloadOutlined />} onClick={() => setLoading(true)}>
            刷新
          </Button>
        </Space>
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <div className="flex flex-wrap items-center gap-4">
          <Input
            placeholder="搜索用户名/URL"
            allowClear
            style={{ width: 200 }}
            prefix={<SearchOutlined className="text-muted-foreground" />}
          />
          <Select
            placeholder="请求方法"
            allowClear
            style={{ width: 120 }}
            options={[
              { value: 'GET', label: 'GET' },
              { value: 'POST', label: 'POST' },
              { value: 'PUT', label: 'PUT' },
              { value: 'DELETE', label: 'DELETE' },
            ]}
          />
          <RangePicker placeholder={['开始时间', '结束时间']} />
        </div>
      </Card>

      {/* 日志表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={mockLogs}
          rowKey="id"
          loading={loading}
          pagination={{
            total: 5000,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      {/* 详情弹窗 */}
      <Modal
        title="操作详情"
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        footer={null}
        width={700}
      >
        {selectedLog && (
          <Descriptions column={2} bordered className="mt-4">
            <Descriptions.Item label={t('log.username')}>
              {selectedLog.username}
            </Descriptions.Item>
            <Descriptions.Item label={t('log.ip')}>
              {selectedLog.ip}
            </Descriptions.Item>
            <Descriptions.Item label={t('log.method')}>
              <Tag color={getMethodColor(selectedLog.httpMethod)}>
                {selectedLog.httpMethod}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t('log.operationTime')}>
              {selectedLog.createdAt}
            </Descriptions.Item>
            <Descriptions.Item label={t('log.url')} span={2}>
              <code className="px-2 py-1 bg-muted rounded text-sm block">
                {selectedLog.url}
              </code>
            </Descriptions.Item>
            <Descriptions.Item label={t('log.params')} span={2}>
              <pre className="p-3 bg-muted rounded-lg text-sm overflow-auto max-h-32">
                {JSON.stringify(JSON.parse(selectedLog.requestParams), null, 2)}
              </pre>
            </Descriptions.Item>
            <Descriptions.Item label={t('log.response')} span={2}>
              <pre className="p-3 bg-muted rounded-lg text-sm overflow-auto max-h-32">
                {JSON.stringify(JSON.parse(selectedLog.responseData), null, 2)}
              </pre>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default OperationLogPage;

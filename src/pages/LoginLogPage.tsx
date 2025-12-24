/**
 * 📋 登录日志页面 / Login Log Page
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
} from 'antd';
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExportOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

interface LoginLogData {
  id: string;
  userId: string;
  username: string;
  loginType: 'password-sms' | 'password-otp' | 'qr';
  success: boolean;
  ip: string;
  userAgent: string;
  createdAt: string;
}

const LoginLogPage: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  // 模拟数据
  const mockLogs: LoginLogData[] = [
    {
      id: '1',
      userId: 'u001',
      username: '张医生',
      loginType: 'password-sms',
      success: true,
      ip: '192.168.1.101',
      userAgent: 'Chrome 120.0 / Windows 10',
      createdAt: '2024-12-24 10:32:15',
    },
    {
      id: '2',
      userId: 'u002',
      username: '李主任',
      loginType: 'qr',
      success: true,
      ip: '192.168.1.102',
      userAgent: 'Safari 17.0 / macOS',
      createdAt: '2024-12-24 09:45:22',
    },
    {
      id: '3',
      userId: 'u003',
      username: '王护士',
      loginType: 'password-otp',
      success: true,
      ip: '192.168.1.103',
      userAgent: 'Firefox 121.0 / Windows 11',
      createdAt: '2024-12-24 09:12:08',
    },
    {
      id: '4',
      userId: 'u004',
      username: '陈医生',
      loginType: 'password-sms',
      success: false,
      ip: '192.168.1.104',
      userAgent: 'Chrome 120.0 / Android',
      createdAt: '2024-12-24 08:55:33',
    },
    {
      id: '5',
      userId: 'u005',
      username: '赵主任',
      loginType: 'password-sms',
      success: false,
      ip: '10.0.0.50',
      userAgent: 'Edge 120.0 / Windows 11',
      createdAt: '2024-12-23 18:20:45',
    },
  ];

  const getLoginTypeLabel = (type: string) => {
    const labels = {
      'password-sms': { text: t('log.passwordSms'), color: 'blue' },
      'password-otp': { text: t('log.passwordOtp'), color: 'orange' },
      'qr': { text: t('log.qrCode'), color: 'green' },
    };
    return labels[type as keyof typeof labels] || { text: type, color: 'default' };
  };

  const columns = [
    {
      title: t('log.username'),
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: t('log.loginType'),
      dataIndex: 'loginType',
      key: 'loginType',
      render: (type: string) => {
        const { text, color } = getLoginTypeLabel(type);
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: t('log.ip'),
      dataIndex: 'ip',
      key: 'ip',
      render: (ip: string) => <code className="px-2 py-0.5 bg-muted rounded text-sm">{ip}</code>,
    },
    {
      title: t('log.userAgent'),
      dataIndex: 'userAgent',
      key: 'userAgent',
      ellipsis: true,
    },
    {
      title: t('log.success'),
      dataIndex: 'success',
      key: 'success',
      render: (success: boolean) => (
        <Tag
          icon={success ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          color={success ? 'success' : 'error'}
        >
          {success ? '成功' : '失败'}
        </Tag>
      ),
    },
    {
      title: t('log.loginTime'),
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('log.loginLog')}</h1>
          <p className="text-muted-foreground text-sm mt-1">查看系统用户登录记录</p>
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
            placeholder="搜索用户名/IP"
            allowClear
            style={{ width: 200 }}
            prefix={<SearchOutlined className="text-muted-foreground" />}
          />
          <Select
            placeholder="登录方式"
            allowClear
            style={{ width: 150 }}
            options={[
              { value: 'password-sms', label: t('log.passwordSms') },
              { value: 'password-otp', label: t('log.passwordOtp') },
              { value: 'qr', label: t('log.qrCode') },
            ]}
          />
          <Select
            placeholder="登录状态"
            allowClear
            style={{ width: 120 }}
            options={[
              { value: 'true', label: '成功' },
              { value: 'false', label: '失败' },
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
            total: 1000,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>
    </div>
  );
};

export default LoginLogPage;

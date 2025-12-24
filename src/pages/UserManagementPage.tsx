/**
 * 👥 用户管理页面 / User Management Page
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  Tag,
  Avatar,
  Dropdown,
  Modal,
  Form,
  message,
  Popconfirm,
  Switch,
  Badge,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  KeyOutlined,
  ExportOutlined,
  FilterOutlined,
} from '@ant-design/icons';

const { Search } = Input;

interface UserData {
  id: string;
  username: string;
  realName: string;
  nickname: string;
  email: string;
  phone: string;
  jobNumber: string;
  avatar?: string;
  status: 'active' | 'inactive';
  roles: string[];
  createdAt: string;
  latestLoginAt: string;
}

const UserManagementPage: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm();

  // 模拟数据
  const mockUsers: UserData[] = [
    {
      id: '1',
      username: 'zhangsan',
      realName: '张三',
      nickname: '张医生',
      email: 'zhangsan@hospital.com',
      phone: '138****0001',
      jobNumber: 'DOC001',
      status: 'active',
      roles: ['super_admin'],
      createdAt: '2024-01-15 10:30:00',
      latestLoginAt: '2024-12-24 08:15:00',
    },
    {
      id: '2',
      username: 'lisi',
      realName: '李四',
      nickname: '李主任',
      email: 'lisi@hospital.com',
      phone: '138****0002',
      jobNumber: 'DOC002',
      status: 'active',
      roles: ['admin'],
      createdAt: '2024-02-20 14:20:00',
      latestLoginAt: '2024-12-23 16:45:00',
    },
    {
      id: '3',
      username: 'wangwu',
      realName: '王五',
      nickname: '',
      email: 'wangwu@hospital.com',
      phone: '138****0003',
      jobNumber: 'DOC003',
      status: 'inactive',
      roles: ['user'],
      createdAt: '2024-03-10 09:00:00',
      latestLoginAt: '2024-11-15 10:30:00',
    },
    {
      id: '4',
      username: 'zhaoliu',
      realName: '赵六',
      nickname: '赵护士长',
      email: 'zhaoliu@hospital.com',
      phone: '138****0004',
      jobNumber: 'NUR001',
      status: 'active',
      roles: ['user'],
      createdAt: '2024-04-05 11:45:00',
      latestLoginAt: '2024-12-24 09:00:00',
    },
  ];

  const columns = [
    {
      title: t('user.username'),
      dataIndex: 'username',
      key: 'username',
      render: (text: string, record: UserData) => (
        <div className="flex items-center gap-3">
          <Avatar 
            src={record.avatar} 
            icon={<UserOutlined />}
            className="bg-primary"
          />
          <div>
            <p className="font-medium text-foreground">{text}</p>
            <p className="text-xs text-muted-foreground">{record.jobNumber}</p>
          </div>
        </div>
      ),
    },
    {
      title: t('user.realName'),
      dataIndex: 'realName',
      key: 'realName',
    },
    {
      title: t('user.nickname'),
      dataIndex: 'nickname',
      key: 'nickname',
      render: (text: string) => text || '-',
    },
    {
      title: t('user.phone'),
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: t('user.email'),
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: t('user.role'),
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: string[]) => (
        <Space>
          {roles.map((role) => (
            <Tag 
              key={role} 
              color={role === 'super_admin' ? 'gold' : role === 'admin' ? 'blue' : 'default'}
            >
              {role === 'super_admin' ? '超级管理员' : role === 'admin' ? '管理员' : '普通用户'}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: t('user.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: UserData) => (
        <Switch
          checked={status === 'active'}
          checkedChildren="启用"
          unCheckedChildren="禁用"
          disabled={record.roles.includes('super_admin')}
          onChange={(checked) => handleStatusChange(record.id, checked)}
        />
      ),
    },
    {
      title: t('user.lastLogin'),
      dataIndex: 'latestLoginAt',
      key: 'latestLoginAt',
      render: (text: string) => (
        <span className="text-muted-foreground text-sm">{text}</span>
      ),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      width: 120,
      render: (_: any, record: UserData) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'edit',
                icon: <EditOutlined />,
                label: t('common.edit'),
                onClick: () => handleEdit(record),
              },
              {
                key: 'resetPassword',
                icon: <KeyOutlined />,
                label: t('user.resetPassword'),
                onClick: () => handleResetPassword(record),
              },
              { type: 'divider' },
              {
                key: 'delete',
                icon: <DeleteOutlined />,
                label: t('common.delete'),
                danger: true,
                disabled: record.roles.includes('super_admin'),
                onClick: () => handleDelete(record),
              },
            ],
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const handleEdit = (user: UserData) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleStatusChange = (id: string, checked: boolean) => {
    message.success(`用户状态已${checked ? '启用' : '禁用'}`);
  };

  const handleResetPassword = (user: UserData) => {
    Modal.confirm({
      title: '重置密码',
      content: `确定要重置用户 ${user.realName} 的密码吗？`,
      onOk: () => {
        message.success('密码已重置');
      },
    });
  };

  const handleDelete = (user: UserData) => {
    Modal.confirm({
      title: t('user.deleteConfirm'),
      content: `确定要删除用户 ${user.realName} 吗？`,
      okType: 'danger',
      onOk: () => {
        message.success('删除成功');
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      message.success(editingUser ? '更新成功' : '添加成功');
      setModalOpen(false);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('user.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">管理系统用户账号和权限</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          {t('user.addUser')}
        </Button>
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <div className="flex flex-wrap items-center gap-4">
          <Search
            placeholder="搜索用户名/姓名/手机号"
            allowClear
            style={{ width: 280 }}
            prefix={<SearchOutlined className="text-muted-foreground" />}
          />
          <Select
            placeholder="角色筛选"
            allowClear
            style={{ width: 150 }}
            options={[
              { value: 'super_admin', label: '超级管理员' },
              { value: 'admin', label: '管理员' },
              { value: 'user', label: '普通用户' },
            ]}
          />
          <Select
            placeholder="状态筛选"
            allowClear
            style={{ width: 120 }}
            options={[
              { value: 'active', label: '已启用' },
              { value: 'inactive', label: '已禁用' },
            ]}
          />
          <Button icon={<FilterOutlined />}>更多筛选</Button>
          <div className="flex-1" />
          <Space>
            <Button icon={<ExportOutlined />}>导出</Button>
            <Button icon={<ReloadOutlined />} onClick={() => setLoading(true)}>
              刷新
            </Button>
          </Space>
        </div>

        {/* 批量操作 */}
        {selectedRowKeys.length > 0 && (
          <div className="mt-4 p-3 bg-primary-light rounded-lg flex items-center gap-4">
            <span className="text-sm">
              已选择 <strong>{selectedRowKeys.length}</strong> 项
            </span>
            <Space>
              <Button size="small">{t('user.batchEnable')}</Button>
              <Button size="small">{t('user.batchDisable')}</Button>
              <Button size="small" danger>{t('user.batchDelete')}</Button>
            </Space>
          </div>
        )}
      </Card>

      {/* 用户表格 */}
      <Card>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={mockUsers}
          rowKey="id"
          loading={loading}
          pagination={{
            total: 100,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingUser ? t('user.editUser') : t('user.addUser')}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          className="mt-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="username"
              label={t('user.username')}
              rules={[{ required: true, message: t('validation.required') }]}
            >
              <Input placeholder="请输入用户名" disabled={!!editingUser} />
            </Form.Item>
            <Form.Item
              name="jobNumber"
              label={t('user.jobNumber')}
              rules={[{ required: true, message: t('validation.required') }]}
            >
              <Input placeholder="请输入工号" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="realName"
              label={t('user.realName')}
              rules={[{ required: true, message: t('validation.required') }]}
            >
              <Input placeholder="请输入真实姓名" />
            </Form.Item>
            <Form.Item
              name="nickname"
              label={t('user.nickname')}
            >
              <Input placeholder="请输入昵称（可选）" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="phone"
              label={t('user.phone')}
              rules={[{ required: true, message: t('validation.required') }]}
            >
              <Input placeholder="请输入手机号" />
            </Form.Item>
            <Form.Item
              name="email"
              label={t('user.email')}
              rules={[{ type: 'email', message: t('validation.invalidEmail') }]}
            >
              <Input placeholder="请输入邮箱" />
            </Form.Item>
          </div>
          <Form.Item
            name="roles"
            label={t('user.role')}
            rules={[{ required: true, message: t('validation.required') }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择角色"
              options={[
                { value: 'admin', label: '管理员' },
                { value: 'user', label: '普通用户' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagementPage;

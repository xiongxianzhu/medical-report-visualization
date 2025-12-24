/**
 * 🔐 角色管理页面 / Role Management Page
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Tag,
  Modal,
  Form,
  message,
  Tree,
  Tooltip,
  Badge,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
  CrownOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';

const { Search } = Input;
const { TextArea } = Input;

interface RoleData {
  id: string;
  code: string;
  name: string;
  description: string;
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

const RoleManagementPage: React.FC = () => {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleData | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<React.Key[]>([]);
  const [form] = Form.useForm();

  // 模拟角色数据
  const mockRoles: RoleData[] = [
    {
      id: '1',
      code: 'super_admin',
      name: '超级管理员',
      description: '拥有系统所有权限，不可编辑或删除',
      userCount: 1,
      createdAt: '2024-01-01 00:00:00',
      updatedAt: '2024-01-01 00:00:00',
    },
    {
      id: '2',
      code: 'admin',
      name: '管理员',
      description: '系统管理员，拥有大部分管理权限',
      userCount: 5,
      createdAt: '2024-01-15 10:00:00',
      updatedAt: '2024-12-20 15:30:00',
    },
    {
      id: '3',
      code: 'doctor',
      name: '医生',
      description: '医生角色，可查看和管理自己的报告',
      userCount: 128,
      createdAt: '2024-02-01 09:00:00',
      updatedAt: '2024-12-15 11:20:00',
    },
    {
      id: '4',
      code: 'nurse',
      name: '护士',
      description: '护士角色，可查看相关患者数据',
      userCount: 86,
      createdAt: '2024-02-15 14:00:00',
      updatedAt: '2024-12-18 16:45:00',
    },
  ];

  // 权限树数据
  const permissionTreeData: DataNode[] = [
    {
      title: '仪表盘',
      key: 'dashboard',
      children: [
        { title: '查看仪表盘', key: 'dashboard:view' },
        { title: '数据导出', key: 'dashboard:export' },
      ],
    },
    {
      title: '用户管理',
      key: 'user',
      children: [
        { title: '查看用户', key: 'user:view' },
        { title: '添加用户', key: 'user:add' },
        { title: '编辑用户', key: 'user:edit' },
        { title: '删除用户', key: 'user:delete' },
        { title: '重置密码', key: 'user:reset-password' },
      ],
    },
    {
      title: '角色管理',
      key: 'role',
      children: [
        { title: '查看角色', key: 'role:view' },
        { title: '添加角色', key: 'role:add' },
        { title: '编辑角色', key: 'role:edit' },
        { title: '删除角色', key: 'role:delete' },
        { title: '分配权限', key: 'role:assign-permission' },
      ],
    },
    {
      title: '报告管理',
      key: 'report',
      children: [
        { title: '查看报告', key: 'report:view' },
        { title: '创建报告', key: 'report:create' },
        { title: '编辑报告', key: 'report:edit' },
        { title: '删除报告', key: 'report:delete' },
        { title: '导出报告', key: 'report:export' },
      ],
    },
    {
      title: '文件管理',
      key: 'file',
      children: [
        { title: '查看文件', key: 'file:view' },
        { title: '上传文件', key: 'file:upload' },
        { title: '下载文件', key: 'file:download' },
        { title: '删除文件', key: 'file:delete' },
      ],
    },
    {
      title: '日志管理',
      key: 'log',
      children: [
        { title: '查看登录日志', key: 'log:login' },
        { title: '查看操作日志', key: 'log:operation' },
      ],
    },
    {
      title: '系统设置',
      key: 'settings',
      children: [
        { title: '基础设置', key: 'settings:basic' },
        { title: '安全设置', key: 'settings:security' },
      ],
    },
  ];

  const columns = [
    {
      title: t('role.code'),
      dataIndex: 'code',
      key: 'code',
      render: (text: string, record: RoleData) => (
        <div className="flex items-center gap-2">
          {record.code === 'super_admin' && (
            <CrownOutlined className="text-warning" />
          )}
          <code className="px-2 py-0.5 bg-muted rounded text-sm">{text}</code>
        </div>
      ),
    },
    {
      title: t('role.name'),
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: RoleData) => (
        <div>
          <span className="font-medium">{text}</span>
          {record.code === 'super_admin' && (
            <Tooltip title={t('role.superAdminTip')}>
              <InfoCircleOutlined className="ml-2 text-muted-foreground" />
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: t('role.description'),
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '用户数',
      dataIndex: 'userCount',
      key: 'userCount',
      render: (count: number) => (
        <Badge count={count} showZero color="blue" overflowCount={999} />
      ),
    },
    {
      title: t('user.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: t('common.actions'),
      key: 'actions',
      width: 200,
      render: (_: any, record: RoleData) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<SettingOutlined />}
            onClick={() => handleAssignPermission(record)}
            disabled={record.code === 'super_admin'}
          >
            权限
          </Button>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            disabled={record.code === 'super_admin'}
          >
            {t('common.edit')}
          </Button>
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            disabled={record.code === 'super_admin'}
          >
            {t('common.delete')}
          </Button>
        </Space>
      ),
    },
  ];

  const handleEdit = (role: RoleData) => {
    setEditingRole(role);
    form.setFieldsValue(role);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingRole(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleDelete = (role: RoleData) => {
    Modal.confirm({
      title: t('role.deleteConfirm'),
      content: `确定要删除角色 ${role.name} 吗？该操作不可恢复。`,
      okType: 'danger',
      onOk: () => {
        message.success('删除成功');
      },
    });
  };

  const handleAssignPermission = (role: RoleData) => {
    setEditingRole(role);
    // 模拟已有权限
    setSelectedPermissions(['dashboard:view', 'user:view', 'report:view']);
    setPermissionModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      message.success(editingRole ? '更新成功' : '添加成功');
      setModalOpen(false);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handlePermissionSubmit = () => {
    message.success('权限分配成功');
    setPermissionModalOpen(false);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('role.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">管理系统角色和权限配置</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          {t('role.addRole')}
        </Button>
      </div>

      {/* 搜索 */}
      <Card>
        <Search
          placeholder="搜索角色编码/名称"
          allowClear
          style={{ width: 300 }}
          prefix={<SearchOutlined className="text-muted-foreground" />}
        />
      </Card>

      {/* 角色表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={mockRoles}
          rowKey="id"
          pagination={{
            total: mockRoles.length,
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      {/* 新增/编辑角色弹窗 */}
      <Modal
        title={editingRole ? t('role.editRole') : t('role.addRole')}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        width={500}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="code"
            label={t('role.code')}
            rules={[
              { required: true, message: t('validation.required') },
              { pattern: /^[a-z_]+$/, message: '只能包含小写字母和下划线' },
            ]}
          >
            <Input placeholder="请输入角色编码，如: department_admin" disabled={!!editingRole} />
          </Form.Item>
          <Form.Item
            name="name"
            label={t('role.name')}
            rules={[{ required: true, message: t('validation.required') }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item
            name="description"
            label={t('role.description')}
          >
            <TextArea rows={3} placeholder="请输入角色描述" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 分配权限弹窗 */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <SettingOutlined />
            <span>分配权限 - {editingRole?.name}</span>
          </div>
        }
        open={permissionModalOpen}
        onCancel={() => setPermissionModalOpen(false)}
        onOk={handlePermissionSubmit}
        width={500}
      >
        <div className="mt-4 max-h-96 overflow-auto">
          <Tree
            checkable
            defaultExpandAll
            checkedKeys={selectedPermissions}
            onCheck={(keys) => setSelectedPermissions(keys as React.Key[])}
            treeData={permissionTreeData}
          />
        </div>
      </Modal>
    </div>
  );
};

export default RoleManagementPage;

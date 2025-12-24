import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Form, 
  Input, 
  Select,
  TreeSelect,
  message,
  Popconfirm,
  Typography,
  Badge
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  KeyOutlined,
  MenuOutlined,
  ApiOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface Permission {
  id: string;
  code: string;
  name: string;
  type: 'menu' | 'button' | 'api';
  parentId: string | null;
  description?: string;
  path?: string;
  icon?: string;
  sort: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  children?: Permission[];
}

// 模拟权限数据
const mockPermissions: Permission[] = [
  {
    id: '1',
    code: 'dashboard',
    name: '仪表盘',
    type: 'menu',
    parentId: null,
    path: '/dashboard',
    icon: 'DashboardOutlined',
    sort: 1,
    status: true,
    createdAt: '2024-01-01 00:00:00',
    updatedAt: '2024-01-01 00:00:00',
    children: [
      {
        id: '1-1',
        code: 'dashboard:view',
        name: '查看仪表盘',
        type: 'button',
        parentId: '1',
        sort: 1,
        status: true,
        createdAt: '2024-01-01 00:00:00',
        updatedAt: '2024-01-01 00:00:00',
      }
    ]
  },
  {
    id: '2',
    code: 'system',
    name: '系统管理',
    type: 'menu',
    parentId: null,
    path: '/system',
    icon: 'SettingOutlined',
    sort: 2,
    status: true,
    createdAt: '2024-01-01 00:00:00',
    updatedAt: '2024-01-01 00:00:00',
    children: [
      {
        id: '2-1',
        code: 'user',
        name: '用户管理',
        type: 'menu',
        parentId: '2',
        path: '/users/list',
        sort: 1,
        status: true,
        createdAt: '2024-01-01 00:00:00',
        updatedAt: '2024-01-01 00:00:00',
        children: [
          { id: '2-1-1', code: 'user:list', name: '查看用户列表', type: 'button', parentId: '2-1', sort: 1, status: true, createdAt: '2024-01-01 00:00:00', updatedAt: '2024-01-01 00:00:00' },
          { id: '2-1-2', code: 'user:create', name: '创建用户', type: 'button', parentId: '2-1', sort: 2, status: true, createdAt: '2024-01-01 00:00:00', updatedAt: '2024-01-01 00:00:00' },
          { id: '2-1-3', code: 'user:update', name: '编辑用户', type: 'button', parentId: '2-1', sort: 3, status: true, createdAt: '2024-01-01 00:00:00', updatedAt: '2024-01-01 00:00:00' },
          { id: '2-1-4', code: 'user:delete', name: '删除用户', type: 'button', parentId: '2-1', sort: 4, status: true, createdAt: '2024-01-01 00:00:00', updatedAt: '2024-01-01 00:00:00' },
          { id: '2-1-5', code: 'api:user:list', name: '用户列表接口', type: 'api', parentId: '2-1', path: '/api/users', sort: 5, status: true, createdAt: '2024-01-01 00:00:00', updatedAt: '2024-01-01 00:00:00' }
        ]
      },
      {
        id: '2-2',
        code: 'role',
        name: '角色管理',
        type: 'menu',
        parentId: '2',
        path: '/users/roles',
        sort: 2,
        status: true,
        createdAt: '2024-01-01 00:00:00',
        updatedAt: '2024-01-01 00:00:00',
        children: [
          { id: '2-2-1', code: 'role:list', name: '查看角色列表', type: 'button', parentId: '2-2', sort: 1, status: true, createdAt: '2024-01-01 00:00:00', updatedAt: '2024-01-01 00:00:00' },
          { id: '2-2-2', code: 'role:create', name: '创建角色', type: 'button', parentId: '2-2', sort: 2, status: true, createdAt: '2024-01-01 00:00:00', updatedAt: '2024-01-01 00:00:00' }
        ]
      },
      { id: '2-3', code: 'permission', name: '权限管理', type: 'menu', parentId: '2', path: '/users/permissions', sort: 3, status: true, createdAt: '2024-01-01 00:00:00', updatedAt: '2024-01-01 00:00:00' }
    ]
  },
  {
    id: '3',
    code: 'report',
    name: '报告管理',
    type: 'menu',
    parentId: null,
    path: '/templates',
    icon: 'FileTextOutlined',
    sort: 3,
    status: true,
    createdAt: '2024-01-01 00:00:00',
    updatedAt: '2024-01-01 00:00:00',
    children: [
      { id: '3-1', code: 'template:list', name: '查看模板', type: 'button', parentId: '3', sort: 1, status: true, createdAt: '2024-01-01 00:00:00', updatedAt: '2024-01-01 00:00:00' },
      { id: '3-2', code: 'template:create', name: '创建模板', type: 'button', parentId: '3', sort: 2, status: true, createdAt: '2024-01-01 00:00:00', updatedAt: '2024-01-01 00:00:00' }
    ]
  }
];

const PermissionManagementPage: React.FC = () => {
  const { t } = useTranslation();
  const [permissions, setPermissions] = useState<Permission[]>(mockPermissions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>(['1', '2', '3']);
  const [form] = Form.useForm();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'menu': return <MenuOutlined className="text-primary" />;
      case 'button': return <AppstoreOutlined className="text-warning" />;
      case 'api': return <ApiOutlined className="text-success" />;
      default: return <KeyOutlined />;
    }
  };

  const getTypeTag = (type: string) => {
    const config: Record<string, { color: string; label: string }> = {
      menu: { color: 'blue', label: '菜单' },
      button: { color: 'orange', label: '按钮' },
      api: { color: 'green', label: '接口' },
    };
    const { color, label } = config[type] || { color: 'default', label: type };
    return <Tag color={color}>{label}</Tag>;
  };

  const columns = [
    {
      title: '权限名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text: string, record: Permission) => (
        <Space>
          {getTypeIcon(record.type)}
          <span className="font-medium text-sm">{text}</span>
        </Space>
      ),
    },
    {
      title: '权限编码',
      dataIndex: 'code',
      key: 'code',
      width: 160,
      render: (text: string) => <Text code className="text-xs">{text}</Text>,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (type: string) => getTypeTag(type),
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
      width: 140,
      render: (path: string) => path ? <Text type="secondary" className="text-xs">{path}</Text> : '-',
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 60,
      align: 'center' as const,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: boolean) => <Badge status={status ? 'success' : 'default'} text={status ? '启用' : '禁用'} />,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 140,
      render: (date: string) => <span className="text-xs text-muted-foreground">{dayjs(date).format('YYYY-MM-DD HH:mm')}</span>,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: unknown, record: Permission) => (
        <Space size="small">
          <Button type="link" size="small" icon={<PlusOutlined />} onClick={() => handleAddChild(record)}>子级</Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除此权限吗？" onConfirm={() => handleDelete(record.id)} okText="确定" cancelText="取消">
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const convertToTreeData = (data: Permission[]): any[] => {
    return data.map(item => ({
      title: item.name,
      value: item.id,
      key: item.id,
      children: item.children ? convertToTreeData(item.children) : undefined,
    }));
  };

  const handleAddChild = (parent: Permission) => {
    setEditingPermission(null);
    form.resetFields();
    form.setFieldsValue({ parentId: parent.id });
    setIsModalOpen(true);
  };

  const handleEdit = (permission: Permission) => {
    setEditingPermission(permission);
    form.setFieldsValue({ ...permission });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const deleteFromTree = (data: Permission[]): Permission[] => {
      return data.filter(item => {
        if (item.id === id) return false;
        if (item.children) item.children = deleteFromTree(item.children);
        return true;
      });
    };
    setPermissions(deleteFromTree(permissions));
    message.success('删除成功');
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingPermission) {
        const updateTree = (data: Permission[]): Permission[] => {
          return data.map(item => {
            if (item.id === editingPermission.id) return { ...item, ...values, updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss') };
            if (item.children) item.children = updateTree(item.children);
            return item;
          });
        };
        setPermissions(updateTree(permissions));
        message.success('更新成功');
      } else {
        const newPermission: Permission = {
          id: `new-${Date.now()}`,
          ...values,
          status: true,
          createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        };
        if (values.parentId) {
          const addToTree = (data: Permission[]): Permission[] => {
            return data.map(item => {
              if (item.id === values.parentId) return { ...item, children: [...(item.children || []), newPermission] };
              if (item.children) item.children = addToTree(item.children);
              return item;
            });
          };
          setPermissions(addToTree(permissions));
        } else {
          setPermissions([...permissions, newPermission]);
        }
        message.success('创建成功');
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingPermission(null);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <Title level={5} className="!mb-0 flex items-center gap-2">
            <KeyOutlined className="text-primary" />
            权限管理
          </Title>
          <Text type="secondary" className="text-xs">管理系统菜单、按钮和接口权限</Text>
        </div>
        <Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => { setEditingPermission(null); form.resetFields(); setIsModalOpen(true); }}>
          新增权限
        </Button>
      </div>

      {/* 权限统计 - 扁平设计 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card size="small" className="flat-card">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary flex items-center justify-center">
              <MenuOutlined className="text-primary-foreground text-sm" />
            </div>
            <div>
              <div className="text-lg font-semibold">8</div>
              <div className="text-xs text-muted-foreground">菜单权限</div>
            </div>
          </div>
        </Card>
        <Card size="small" className="flat-card">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-warning flex items-center justify-center">
              <AppstoreOutlined className="text-warning-foreground text-sm" />
            </div>
            <div>
              <div className="text-lg font-semibold">12</div>
              <div className="text-xs text-muted-foreground">按钮权限</div>
            </div>
          </div>
        </Card>
        <Card size="small" className="flat-card">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-success flex items-center justify-center">
              <ApiOutlined className="text-success-foreground text-sm" />
            </div>
            <div>
              <div className="text-lg font-semibold">5</div>
              <div className="text-xs text-muted-foreground">接口权限</div>
            </div>
          </div>
        </Card>
      </div>

      {/* 权限列表 */}
      <Card size="small">
        <Table
          columns={columns}
          dataSource={permissions}
          rowKey="id"
          expandable={{ expandedRowKeys, onExpandedRowsChange: (keys) => setExpandedRowKeys(keys as string[]) }}
          pagination={false}
          scroll={{ x: 1000 }}
          size="small"
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={<Space><KeyOutlined className="text-primary" />{editingPermission ? '编辑权限' : '新增权限'}</Space>}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => { setIsModalOpen(false); form.resetFields(); setEditingPermission(null); }}
        width={520}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical" className="mt-4" initialValues={{ type: 'menu', sort: 1, status: true }}>
          <Form.Item name="parentId" label="父级权限">
            <TreeSelect placeholder="请选择父级权限" allowClear treeData={convertToTreeData(permissions)} treeDefaultExpandAll />
          </Form.Item>
          <div className="grid grid-cols-2 gap-3">
            <Form.Item name="name" label="权限名称" rules={[{ required: true, message: '请输入权限名称' }]}>
              <Input placeholder="请输入权限名称" />
            </Form.Item>
            <Form.Item name="code" label="权限编码" rules={[{ required: true, message: '请输入权限编码' }]}>
              <Input placeholder="如：user:create" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Form.Item name="type" label="权限类型" rules={[{ required: true }]}>
              <Select placeholder="请选择权限类型">
                <Select.Option value="menu"><Space><MenuOutlined className="text-primary" />菜单</Space></Select.Option>
                <Select.Option value="button"><Space><AppstoreOutlined className="text-warning" />按钮</Space></Select.Option>
                <Select.Option value="api"><Space><ApiOutlined className="text-success" />接口</Space></Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="sort" label="排序" rules={[{ required: true }]}>
              <Input type="number" placeholder="数字越小越靠前" />
            </Form.Item>
          </div>
          <Form.Item name="path" label="路径/接口地址">
            <Input placeholder="菜单路由或API接口地址" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={2} placeholder="权限描述（可选）" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PermissionManagementPage;

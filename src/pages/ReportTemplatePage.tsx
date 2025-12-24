/**
 * 📊 报告模板页面 / Report Template Page
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Button,
  Input,
  Row,
  Col,
  Tag,
  Modal,
  Form,
  message,
  Empty,
  Dropdown,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CopyOutlined,
  MoreOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
} from '@ant-design/icons';

const { Search } = Input;
const { TextArea } = Input;

interface TemplateData {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  chartTypes: string[];
  createdAt: string;
  updatedAt: string;
}

const ReportTemplatePage: React.FC = () => {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TemplateData | null>(null);
  const [form] = Form.useForm();

  // 模拟模板数据
  const mockTemplates: TemplateData[] = [
    {
      id: '1',
      name: '年度工作报告模板',
      description: '适用于医生年度工作汇报，包含患者数据、手术统计、科研成果等模块',
      thumbnail: '/templates/annual.png',
      chartTypes: ['bar', 'pie', 'line'],
      createdAt: '2024-01-10',
      updatedAt: '2024-12-20',
    },
    {
      id: '2',
      name: '科室绩效报告模板',
      description: '适用于科室绩效评估，包含医疗质量、工作量、患者满意度等指标',
      thumbnail: '/templates/department.png',
      chartTypes: ['bar', 'radar'],
      createdAt: '2024-02-15',
      updatedAt: '2024-12-18',
    },
    {
      id: '3',
      name: '手术统计报告模板',
      description: '专门用于手术统计分析，包含手术类型、成功率、并发症等数据',
      thumbnail: '/templates/surgery.png',
      chartTypes: ['pie', 'bar'],
      createdAt: '2024-03-20',
      updatedAt: '2024-12-15',
    },
    {
      id: '4',
      name: '患者满意度报告模板',
      description: '用于展示患者满意度调查结果，包含各维度评分和改进建议',
      thumbnail: '/templates/satisfaction.png',
      chartTypes: ['radar', 'bar'],
      createdAt: '2024-04-10',
      updatedAt: '2024-12-10',
    },
  ];

  const getChartIcon = (type: string) => {
    switch (type) {
      case 'bar': return <BarChartOutlined />;
      case 'pie': return <PieChartOutlined />;
      case 'line': return <LineChartOutlined />;
      default: return <BarChartOutlined />;
    }
  };

  const handleAdd = () => {
    setEditingTemplate(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (template: TemplateData) => {
    setEditingTemplate(template);
    form.setFieldsValue(template);
    setModalOpen(true);
  };

  const handleDelete = (template: TemplateData) => {
    Modal.confirm({
      title: t('template.deleteConfirm'),
      content: `确定要删除模板 "${template.name}" 吗？`,
      okType: 'danger',
      onOk: () => {
        message.success('删除成功');
      },
    });
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      message.success(editingTemplate ? '更新成功' : '添加成功');
      setModalOpen(false);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('template.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">管理年度报告可视化模板</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          {t('template.addTemplate')}
        </Button>
      </div>

      {/* 搜索 */}
      <Card>
        <Search
          placeholder="搜索模板名称"
          allowClear
          style={{ width: 300 }}
          prefix={<SearchOutlined className="text-muted-foreground" />}
        />
      </Card>

      {/* 模板列表 */}
      <Row gutter={[16, 16]}>
        {mockTemplates.map((template) => (
          <Col xs={24} sm={12} lg={8} xl={6} key={template.id}>
            <Card
              hoverable
              className="group overflow-hidden"
              cover={
                <div className="h-40 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center relative">
                  <div className="text-6xl">📊</div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-foreground/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button 
                      type="primary" 
                      icon={<EyeOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        message.info('预览功能开发中');
                      }}
                    >
                      预览
                    </Button>
                    <Button 
                      icon={<EditOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(template);
                      }}
                    >
                      编辑
                    </Button>
                  </div>
                </div>
              }
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-foreground line-clamp-1">
                    {template.name}
                  </h3>
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: 'copy',
                          icon: <CopyOutlined />,
                          label: '复制',
                          onClick: () => message.success('复制成功'),
                        },
                        {
                          key: 'delete',
                          icon: <DeleteOutlined />,
                          label: '删除',
                          danger: true,
                          onClick: () => handleDelete(template),
                        },
                      ],
                    }}
                    trigger={['click']}
                  >
                    <Button type="text" size="small" icon={<MoreOutlined />} />
                  </Dropdown>
                </div>
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {template.description}
                </p>
                <div className="flex items-center gap-2">
                  {template.chartTypes.map((type) => (
                    <Tag key={type} icon={getChartIcon(type)} className="capitalize">
                      {type}
                    </Tag>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  更新于 {template.updatedAt}
                </p>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 新增/编辑模板弹窗 */}
      <Modal
        title={editingTemplate ? t('template.editTemplate') : t('template.addTemplate')}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        width={500}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="name"
            label={t('template.name')}
            rules={[{ required: true, message: t('validation.required') }]}
          >
            <Input placeholder="请输入模板名称" />
          </Form.Item>
          <Form.Item
            name="description"
            label={t('template.description')}
          >
            <TextArea rows={3} placeholder="请输入模板描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReportTemplatePage;

/**
 * 📦 数据管理页面 / Data Management Page
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
  Upload,
  Modal,
  message,
  Progress,
  Statistic,
  Row,
  Col,
} from 'antd';
import {
  UploadOutlined,
  SearchOutlined,
  DeleteOutlined,
  DownloadOutlined,
  InboxOutlined,
  FileExcelOutlined,
  DatabaseOutlined,
  UserOutlined,
  MedicineBoxOutlined,
} from '@ant-design/icons';
import type { UploadProps } from 'antd';

const { Search } = Input;
const { Dragger } = Upload;

interface DatasetData {
  id: string;
  fileName: string;
  dataType: 'patient' | 'diagnosis' | 'operation';
  recordCount: number;
  fileSize: number;
  importedBy: string;
  createdAt: string;
  status: 'success' | 'processing' | 'failed';
}

const DataManagementPage: React.FC = () => {
  const { t } = useTranslation();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // 模拟数据
  const mockDatasets: DatasetData[] = [
    {
      id: '1',
      fileName: '2024年患者数据.xlsx',
      dataType: 'patient',
      recordCount: 15680,
      fileSize: 2458624,
      importedBy: '张医生',
      createdAt: '2024-12-20 10:30:00',
      status: 'success',
    },
    {
      id: '2',
      fileName: '诊疗记录汇总.csv',
      dataType: 'diagnosis',
      recordCount: 8920,
      fileSize: 1024000,
      importedBy: '李主任',
      createdAt: '2024-12-19 15:45:00',
      status: 'success',
    },
    {
      id: '3',
      fileName: '手术统计表.xlsx',
      dataType: 'operation',
      recordCount: 1256,
      fileSize: 512000,
      importedBy: '王护士',
      createdAt: '2024-12-18 09:00:00',
      status: 'success',
    },
    {
      id: '4',
      fileName: '新患者数据导入中.xlsx',
      dataType: 'patient',
      recordCount: 0,
      fileSize: 3584000,
      importedBy: '系统',
      createdAt: '2024-12-24 10:00:00',
      status: 'processing',
    },
  ];

  // 统计数据
  const statsData = [
    { title: '患者数据', value: 45680, icon: <UserOutlined />, color: 'text-primary' },
    { title: '诊疗记录', value: 28920, icon: <MedicineBoxOutlined />, color: 'text-success' },
    { title: '手术记录', value: 3256, icon: <DatabaseOutlined />, color: 'text-warning' },
  ];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDataTypeConfig = (type: string) => {
    const config = {
      patient: { label: t('data.patientData'), color: 'blue' },
      diagnosis: { label: t('data.diagnosisData'), color: 'green' },
      operation: { label: t('data.operationData'), color: 'orange' },
    };
    return config[type as keyof typeof config] || { label: type, color: 'default' };
  };

  const columns = [
    {
      title: t('data.fileName'),
      dataIndex: 'fileName',
      key: 'fileName',
      render: (text: string) => (
        <div className="flex items-center gap-2">
          <FileExcelOutlined className="text-success text-lg" />
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: t('data.dataType'),
      dataIndex: 'dataType',
      key: 'dataType',
      render: (type: string) => {
        const { label, color } = getDataTypeConfig(type);
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: t('data.recordCount'),
      dataIndex: 'recordCount',
      key: 'recordCount',
      render: (count: number, record: DatasetData) => (
        record.status === 'processing' 
          ? <Tag color="processing">导入中...</Tag>
          : <span className="font-medium">{count.toLocaleString()}</span>
      ),
    },
    {
      title: t('file.fileSize'),
      dataIndex: 'fileSize',
      key: 'fileSize',
      render: (size: number) => formatFileSize(size),
    },
    {
      title: '导入者',
      dataIndex: 'importedBy',
      key: 'importedBy',
    },
    {
      title: t('data.importTime'),
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = {
          success: { label: '成功', color: 'success' },
          processing: { label: '处理中', color: 'processing' },
          failed: { label: '失败', color: 'error' },
        };
        const { label, color } = config[status as keyof typeof config] || { label: status, color: 'default' };
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: t('common.actions'),
      key: 'actions',
      width: 120,
      render: (_: any, record: DatasetData) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<DownloadOutlined />}
            onClick={() => message.success('开始下载...')}
            disabled={record.status === 'processing'}
          />
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: '确定要删除该数据集吗？',
                content: '删除后将无法恢复，请谨慎操作。',
                okType: 'danger',
                onOk: () => message.success('删除成功'),
              });
            }}
            disabled={record.status === 'processing'}
          />
        </Space>
      ),
    },
  ];

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    accept: '.xlsx,.xls,.csv,.json',
    action: '/api/data/import',
    beforeUpload: (file) => {
      const isValid = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv',
        'application/json',
      ].includes(file.type);
      if (!isValid) {
        message.error('只支持 Excel、CSV、JSON 格式的文件');
        return false;
      }
      return true;
    },
    onChange(info) {
      const { status } = info.file;
      if (status === 'uploading') {
        setUploading(true);
        setUploadProgress(info.file.percent || 0);
      }
      if (status === 'done') {
        setUploading(false);
        message.success(`${info.file.name} 导入成功`);
        setUploadModalOpen(false);
      } else if (status === 'error') {
        setUploading(false);
        message.error(`${info.file.name} 导入失败`);
      }
    },
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('data.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">管理医疗数据集和导入记录</p>
        </div>
        <Space>
          <Button icon={<DownloadOutlined />}>{t('data.export')}</Button>
          <Button 
            type="primary" 
            icon={<UploadOutlined />}
            onClick={() => setUploadModalOpen(true)}
          >
            {t('data.import')}
          </Button>
        </Space>
      </div>

      {/* 数据统计 */}
      <Row gutter={16}>
        {statsData.map((stat, index) => (
          <Col xs={24} sm={8} key={index}>
            <Card className="stats-card">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-xl ${stat.color}`}>
                  {stat.icon}
                </div>
                <Statistic 
                  title={stat.title} 
                  value={stat.value} 
                  valueStyle={{ fontWeight: 'bold' }}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 搜索和筛选 */}
      <Card>
        <div className="flex flex-wrap items-center gap-4">
          <Search
            placeholder="搜索文件名"
            allowClear
            style={{ width: 250 }}
            prefix={<SearchOutlined className="text-muted-foreground" />}
          />
          <Select
            placeholder="数据类型"
            allowClear
            style={{ width: 150 }}
            options={[
              { value: 'patient', label: t('data.patientData') },
              { value: 'diagnosis', label: t('data.diagnosisData') },
              { value: 'operation', label: t('data.operationData') },
            ]}
          />
          <Select
            placeholder="导入状态"
            allowClear
            style={{ width: 120 }}
            options={[
              { value: 'success', label: '成功' },
              { value: 'processing', label: '处理中' },
              { value: 'failed', label: '失败' },
            ]}
          />
        </div>
      </Card>

      {/* 数据表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={mockDatasets}
          rowKey="id"
          pagination={{
            total: 100,
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      {/* 导入数据弹窗 */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <UploadOutlined />
            <span>{t('data.import')}</span>
          </div>
        }
        open={uploadModalOpen}
        onCancel={() => setUploadModalOpen(false)}
        footer={null}
        width={600}
      >
        <div className="mt-4">
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined className="text-5xl text-primary" />
            </p>
            <p className="ant-upload-text font-medium">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint text-muted-foreground">
              支持 Excel(.xlsx/.xls)、CSV、JSON 格式的文件
            </p>
          </Dragger>

          {uploading && (
            <div className="mt-4">
              <Progress percent={uploadProgress} status="active" />
            </div>
          )}

          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">数据格式要求：</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 患者数据：需包含患者ID、姓名、年龄、性别等基本信息</li>
              <li>• 诊疗数据：需包含诊断编码、诊断名称、诊疗日期等信息</li>
              <li>• 手术数据：需包含手术编码、手术名称、手术日期、主刀医生等信息</li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DataManagementPage;

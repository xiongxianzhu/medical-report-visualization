/**
 * 📁 文件管理页面 / File Management Page
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
  Modal,
  Upload,
  message,
  Image,
  Tooltip,
  Progress,
} from 'antd';
import {
  UploadOutlined,
  SearchOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
  FileOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileWordOutlined,
  InboxOutlined,
  CloudUploadOutlined,
} from '@ant-design/icons';
import type { UploadProps } from 'antd';

const { Search } = Input;
const { Dragger } = Upload;

interface FileData {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  storageType: 'local' | 'oss' | 'kodo';
  fileUrl: string;
  uploader: string;
  createdAt: string;
}

const FileManagementPage: React.FC = () => {
  const { t } = useTranslation();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // 模拟文件数据
  const mockFiles: FileData[] = [
    {
      id: '1',
      fileName: '2024年度工作报告.pdf',
      fileSize: 2458624,
      mimeType: 'application/pdf',
      storageType: 'local',
      fileUrl: '/files/report.pdf',
      uploader: '张医生',
      createdAt: '2024-12-20 10:30:00',
    },
    {
      id: '2',
      fileName: '患者统计数据.xlsx',
      fileSize: 1024000,
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      storageType: 'oss',
      fileUrl: '/files/data.xlsx',
      uploader: '李主任',
      createdAt: '2024-12-19 15:45:00',
    },
    {
      id: '3',
      fileName: '科室合影.jpg',
      fileSize: 3584000,
      mimeType: 'image/jpeg',
      storageType: 'kodo',
      fileUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400',
      uploader: '王护士',
      createdAt: '2024-12-18 09:00:00',
    },
    {
      id: '4',
      fileName: '手术流程说明.docx',
      fileSize: 512000,
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      storageType: 'local',
      fileUrl: '/files/guide.docx',
      uploader: '陈医生',
      createdAt: '2024-12-17 14:20:00',
    },
  ];

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 获取文件图标
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <FileImageOutlined className="text-success text-lg" />;
    if (mimeType.includes('pdf')) return <FilePdfOutlined className="text-destructive text-lg" />;
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return <FileExcelOutlined className="text-success text-lg" />;
    if (mimeType.includes('word') || mimeType.includes('document')) return <FileWordOutlined className="text-primary text-lg" />;
    return <FileOutlined className="text-muted-foreground text-lg" />;
  };

  const columns = [
    {
      title: t('file.fileName'),
      dataIndex: 'fileName',
      key: 'fileName',
      render: (text: string, record: FileData) => (
        <div className="flex items-center gap-3">
          {getFileIcon(record.mimeType)}
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: t('file.fileSize'),
      dataIndex: 'fileSize',
      key: 'fileSize',
      render: (size: number) => formatFileSize(size),
    },
    {
      title: t('file.fileType'),
      dataIndex: 'mimeType',
      key: 'mimeType',
      render: (type: string) => {
        const shortType = type.split('/').pop()?.toUpperCase() || 'FILE';
        return <Tag>{shortType}</Tag>;
      },
    },
    {
      title: t('file.storageType'),
      dataIndex: 'storageType',
      key: 'storageType',
      render: (type: string) => {
        const config = {
          local: { color: 'blue', label: t('file.local') },
          oss: { color: 'orange', label: t('file.oss') },
          kodo: { color: 'purple', label: t('file.kodo') },
        };
        const { color, label } = config[type as keyof typeof config] || { color: 'default', label: type };
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: t('file.uploader'),
      dataIndex: 'uploader',
      key: 'uploader',
    },
    {
      title: t('file.uploadTime'),
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: t('common.actions'),
      key: 'actions',
      width: 150,
      render: (_: any, record: FileData) => (
        <Space>
          {record.mimeType.startsWith('image/') && (
            <Tooltip title={t('file.preview')}>
              <Button
                type="text"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => {
                  setPreviewUrl(record.fileUrl);
                  setPreviewOpen(true);
                }}
              />
            </Tooltip>
          )}
          <Tooltip title={t('file.download')}>
            <Button
              type="text"
              size="small"
              icon={<DownloadOutlined />}
              onClick={() => message.success('开始下载...')}
            />
          </Tooltip>
          <Tooltip title={t('file.delete')}>
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                Modal.confirm({
                  title: t('file.deleteConfirm'),
                  onOk: () => message.success('删除成功'),
                });
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    action: '/api/upload',
    beforeUpload: (file) => {
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('文件大小不能超过 10MB');
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
        message.success(`${info.file.name} 上传成功`);
      } else if (status === 'error') {
        setUploading(false);
        message.error(`${info.file.name} 上传失败`);
      }
    },
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('file.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">管理上传的文件和资源</p>
        </div>
        <Button 
          type="primary" 
          icon={<UploadOutlined />} 
          onClick={() => setUploadModalOpen(true)}
        >
          {t('file.upload')}
        </Button>
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <div className="flex flex-wrap items-center gap-4">
          <Search
            placeholder="搜索文件名"
            allowClear
            style={{ width: 280 }}
            prefix={<SearchOutlined className="text-muted-foreground" />}
          />
          <Select
            placeholder="存储类型"
            allowClear
            style={{ width: 150 }}
            options={[
              { value: 'local', label: t('file.local') },
              { value: 'oss', label: t('file.oss') },
              { value: 'kodo', label: t('file.kodo') },
            ]}
          />
          <Select
            placeholder="文件类型"
            allowClear
            style={{ width: 150 }}
            options={[
              { value: 'image', label: '图片' },
              { value: 'document', label: '文档' },
              { value: 'excel', label: '表格' },
              { value: 'pdf', label: 'PDF' },
            ]}
          />
        </div>
      </Card>

      {/* 文件表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={mockFiles}
          rowKey="id"
          pagination={{
            total: 100,
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      {/* 上传弹窗 */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <CloudUploadOutlined />
            <span>{t('file.upload')}</span>
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
            <p className="ant-upload-text font-medium">{t('file.dragTip')}</p>
            <p className="ant-upload-hint text-muted-foreground">{t('file.sizeTip')}</p>
          </Dragger>
          
          {uploading && (
            <div className="mt-4">
              <Progress percent={uploadProgress} status="active" />
            </div>
          )}
        </div>
      </Modal>

      {/* 图片预览 */}
      <Image
        style={{ display: 'none' }}
        preview={{
          visible: previewOpen,
          src: previewUrl,
          onVisibleChange: (visible) => setPreviewOpen(visible),
        }}
      />
    </div>
  );
};

export default FileManagementPage;

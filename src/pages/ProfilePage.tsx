/**
 * 👤 个人资料页面 / Profile Page
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  Avatar,
  message,
  Divider,
} from 'antd';
import {
  UserOutlined,
  CameraOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/stores/authStore';

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuthStore();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      updateUser(values);
      message.success(t('profile.saveSuccess'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('profile.title')}</h1>
        <p className="text-muted-foreground text-sm mt-1">管理您的个人信息</p>
      </div>

      {/* 头像卡片 */}
      <Card>
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar
              size={96}
              src={user?.avatar}
              icon={<UserOutlined />}
              className="bg-primary"
            />
            <Upload
              showUploadList={false}
              beforeUpload={() => false}
            >
              <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary-hover transition-colors">
                <CameraOutlined />
              </button>
            </Upload>
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {user?.nickname || user?.realName || user?.username}
            </h2>
            <p className="text-muted-foreground">
              工号：{user?.jobNumber}
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              上次登录：{user?.latestLoginAt}
            </p>
          </div>
        </div>
      </Card>

      {/* 基本信息表单 */}
      <Card title={t('profile.basicInfo')}>
        <Form
          form={form}
          layout="vertical"
          initialValues={user || {}}
          onFinish={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="username"
              label={t('user.username')}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="jobNumber"
              label={t('user.jobNumber')}
            >
              <Input disabled />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Input placeholder="请输入昵称" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <Divider />

          <Form.Item className="mb-0">
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              icon={<SaveOutlined />}
            >
              {t('common.save')}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ProfilePage;

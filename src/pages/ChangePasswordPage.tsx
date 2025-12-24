/**
 * 🔐 修改密码页面 / Change Password Page
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Alert,
} from 'antd';
import {
  LockOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/stores/authStore';

const ChangePasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error(t('changePassword.passwordMismatch'));
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      message.success(t('changePassword.success'));
      logout();
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('changePassword.title')}</h1>
        <p className="text-muted-foreground text-sm mt-1">修改您的登录密码</p>
      </div>

      <Alert
        message={t('changePassword.passwordTip')}
        type="info"
        showIcon
        className="mb-4"
      />

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="oldPassword"
            label={t('changePassword.oldPassword')}
            rules={[{ required: true, message: t('validation.required') }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-muted-foreground" />}
              placeholder="请输入当前密码"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label={t('changePassword.newPassword')}
            rules={[
              { required: true, message: t('validation.required') },
              { min: 8, message: '密码至少8位' },
              { max: 20, message: '密码最多20位' },
            ]}
          >
            <Input.Password
              prefix={<SafetyOutlined className="text-muted-foreground" />}
              placeholder="请输入新密码"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label={t('changePassword.confirmPassword')}
            rules={[
              { required: true, message: t('validation.required') },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t('changePassword.passwordMismatch')));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<SafetyOutlined className="text-muted-foreground" />}
              placeholder="请再次输入新密码"
              size="large"
            />
          </Form.Item>

          <Form.Item className="mb-0 mt-6">
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
              size="large"
            >
              {t('common.confirm')}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ChangePasswordPage;

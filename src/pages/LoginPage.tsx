/**
 * 🏥 医生年度报告管理平台 - 登录页 (扁平设计)
 * Doctor Annual Report Admin Platform - Login Page (Flat Design)
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Form, 
  Input, 
  Button, 
  Tabs, 
  message,
  Space,
  Divider,
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  MobileOutlined,
  SafetyOutlined,
  QrcodeOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/stores/authStore';
import SliderCaptcha from '@/components/captcha/SliderCaptcha';
import QRCodeLogin from '@/components/login/QRCodeLogin';

type LoginMethod = 'password-sms' | 'password-otp' | 'qr';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  const [form] = Form.useForm();
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('password-sms');
  const [loading, setLoading] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showCaptcha, setShowCaptcha] = useState(false);

  // 发送短信验证码
  const handleSendSmsCode = () => {
    const phone = form.getFieldValue('phone');
    if (!phone) {
      message.warning('请输入手机号');
      return;
    }
    if (!captchaVerified) {
      setShowCaptcha(true);
      return;
    }
    
    message.success('验证码已发送');
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 滑块验证成功
  const handleCaptchaSuccess = () => {
    setCaptchaVerified(true);
    setShowCaptcha(false);
    message.success(t('login.imageCaptcha.success'));
    setTimeout(() => {
      handleSendSmsCode();
    }, 500);
  };

  // 登录提交
  const handleSubmit = async (values: any) => {
    setLoading(true);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const mockUser = {
        id: '1',
        username: values.username || 'admin',
        realName: '张医生',
        nickname: '管理员',
        email: 'admin@hospital.com',
        phone: values.phone || '13800138000',
        avatar: '',
        jobNumber: 'DOC001',
        status: 'active' as const,
        roles: ['super_admin'],
        permissions: ['*'],
        latestLoginAt: new Date().toISOString(),
      };
      
      login(mockUser, 'mock-jwt-token');
      message.success(t('login.loginSuccess'));
      navigate('/dashboard');
    } catch (error) {
      message.error(t('login.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  const tabItems = [
    {
      key: 'password-sms',
      label: (
        <span className="flex items-center gap-2">
          <MobileOutlined />
          {t('login.smsLogin')}
        </span>
      ),
    },
    {
      key: 'password-otp',
      label: (
        <span className="flex items-center gap-2">
          <KeyOutlined />
          {t('login.otpLogin')}
        </span>
      ),
    },
    {
      key: 'qr',
      label: (
        <span className="flex items-center gap-2">
          <QrcodeOutlined />
          {t('login.qrLogin')}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="login-card animate-fade-in">
        {/* Logo & Title */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 bg-primary flex items-center justify-center">
            <span className="text-2xl">🏥</span>
          </div>
          <h1 className="text-xl font-semibold text-foreground mb-1">
            {t('login.title')}
          </h1>
          <p className="text-muted-foreground text-sm">
            {t('login.subtitle')}
          </p>
        </div>

        <Tabs
          activeKey={loginMethod}
          onChange={(key) => setLoginMethod(key as LoginMethod)}
          items={tabItems}
          centered
          className="login-tabs"
        />

        {loginMethod === 'qr' ? (
          <QRCodeLogin onSuccess={() => navigate('/dashboard')} />
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            size="large"
            className="mt-4"
          >
            {/* 用户名 */}
            <Form.Item
              name="username"
              rules={[{ required: true, message: t('validation.required') }]}
            >
              <Input
                prefix={<UserOutlined className="text-muted-foreground" />}
                placeholder={t('login.username')}
                className="h-10"
              />
            </Form.Item>

            {/* 密码 */}
            <Form.Item
              name="password"
              rules={[{ required: true, message: t('validation.required') }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-muted-foreground" />}
                placeholder={t('login.password')}
                className="h-10"
              />
            </Form.Item>

            {loginMethod === 'password-sms' && (
              <>
                {/* 手机号 */}
                <Form.Item
                  name="phone"
                  rules={[{ required: true, message: t('validation.required') }]}
                >
                  <Input
                    prefix={<MobileOutlined className="text-muted-foreground" />}
                    placeholder={t('login.phone')}
                    className="h-10"
                  />
                </Form.Item>

                {/* 短信验证码 */}
                <Form.Item
                  name="smsCode"
                  rules={[{ required: true, message: t('validation.required') }]}
                >
                  <Space.Compact className="w-full">
                    <Input
                      prefix={<SafetyOutlined className="text-muted-foreground" />}
                      placeholder={t('login.smsCode')}
                      className="h-10"
                    />
                    <Button
                      type="primary"
                      onClick={handleSendSmsCode}
                      disabled={countdown > 0}
                      className="h-10 min-w-[100px]"
                    >
                      {countdown > 0 ? `${countdown}s` : t('login.sendCode')}
                    </Button>
                  </Space.Compact>
                </Form.Item>
              </>
            )}

            {loginMethod === 'password-otp' && (
              <Form.Item
                name="otpCode"
                rules={[{ required: true, message: t('validation.required') }]}
              >
                <Input
                  prefix={<KeyOutlined className="text-muted-foreground" />}
                  placeholder={t('login.otpCode')}
                  className="h-10"
                  maxLength={6}
                />
              </Form.Item>
            )}

            <Form.Item className="mb-0 mt-4">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="h-10 font-medium"
              >
                {t('login.loginBtn')}
              </Button>
            </Form.Item>
          </Form>
        )}

        <Divider className="my-4">
          <span className="text-muted-foreground text-xs">安全登录</span>
        </Divider>

        <p className="text-center text-xs text-muted-foreground">
          登录即表示您同意我们的服务条款和隐私政策
        </p>
      </div>

      {/* 滑块验证码弹窗 */}
      <SliderCaptcha 
        open={showCaptcha}
        onClose={() => setShowCaptcha(false)}
        onSuccess={handleCaptchaSuccess}
      />
    </div>
  );
};

export default LoginPage;

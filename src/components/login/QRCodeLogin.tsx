/**
 * 📱 二维码登录组件 / QR Code Login Component (Flat Design)
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Spin, Button, message } from 'antd';
import { ReloadOutlined, CheckCircleFilled, ScanOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/stores/authStore';

interface QRCodeLoginProps {
  onSuccess: () => void;
}

type QRStatus = 'loading' | 'ready' | 'scanned' | 'expired' | 'confirmed';

const QRCodeLogin: React.FC<QRCodeLoginProps> = ({ onSuccess }) => {
  const { t } = useTranslation();
  const { login } = useAuthStore();
  const [status, setStatus] = useState<QRStatus>('loading');
  const [qrCode, setQrCode] = useState('');

  const generateQRCode = () => {
    setStatus('loading');
    setTimeout(() => {
      setQrCode(`QR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
      setStatus('ready');
    }, 1000);
  };

  useEffect(() => {
    if (status !== 'ready') return;
    
    const expireTimer = setTimeout(() => {
      if (status === 'ready') {
        setStatus('expired');
      }
    }, 60000);

    const scanTimer = setTimeout(() => {
      if (status === 'ready') {
        setStatus('scanned');
        setTimeout(() => {
          setStatus('confirmed');
          const mockUser = {
            id: '1',
            username: 'admin',
            realName: '张医生',
            nickname: '管理员',
            email: 'admin@hospital.com',
            phone: '13800138000',
            avatar: '',
            jobNumber: 'DOC001',
            status: 'active' as const,
            roles: ['super_admin'],
            permissions: ['*'],
            latestLoginAt: new Date().toISOString(),
          };
          login(mockUser, 'mock-jwt-token');
          message.success(t('login.loginSuccess'));
          onSuccess();
        }, 2000);
      }
    }, 8000);

    return () => {
      clearTimeout(expireTimer);
      clearTimeout(scanTimer);
    };
  }, [status, login, onSuccess, t]);

  useEffect(() => {
    generateQRCode();
  }, []);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex items-center justify-center h-48">
            <Spin size="large" />
          </div>
        );
      
      case 'ready':
        return (
          <>
            {/* 二维码 */}
            <div className="relative w-48 h-48 mx-auto bg-card border border-border p-4">
              {/* 模拟二维码图案 */}
              <div className="w-full h-full bg-muted grid grid-cols-8 gap-0.5 p-2">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div
                    key={i}
                    className={`${Math.random() > 0.5 ? 'bg-foreground' : 'bg-transparent'}`}
                  />
                ))}
              </div>
              {/* 中心 Logo */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-card border border-border flex items-center justify-center">
                <span className="text-xl">🏥</span>
              </div>
            </div>
            
            <p className="text-center text-muted-foreground text-sm mt-4">
              {t('login.qrLoginTip')}
            </p>
          </>
        );
      
      case 'scanned':
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-success-light flex items-center justify-center">
              <ScanOutlined className="text-3xl text-success animate-pulse" />
            </div>
            <p className="text-base font-medium text-foreground">扫码成功</p>
            <p className="text-muted-foreground text-sm mt-2">
              请在手机上确认登录
            </p>
          </div>
        );
      
      case 'confirmed':
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-success-light flex items-center justify-center">
              <CheckCircleFilled className="text-3xl text-success" />
            </div>
            <p className="text-base font-medium text-foreground">登录成功</p>
            <p className="text-muted-foreground text-sm mt-2">
              正在跳转...
            </p>
          </div>
        );
      
      case 'expired':
        return (
          <div className="text-center py-8">
            <div className="w-48 h-48 mx-auto mb-4 bg-muted flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  {t('login.qrExpired')}
                </p>
                <Button 
                  type="primary" 
                  icon={<ReloadOutlined />}
                  onClick={generateQRCode}
                >
                  {t('login.refreshQr')}
                </Button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="py-4">
      {renderContent()}
    </div>
  );
};

export default QRCodeLogin;

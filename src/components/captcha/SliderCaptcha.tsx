/**
 * 🧩 滑块验证码组件 / Slider Captcha Component (Flat Design)
 */

import React, { useState, useRef, useEffect } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { ReloadOutlined, CheckCircleFilled } from '@ant-design/icons';

interface SliderCaptchaProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SliderCaptcha: React.FC<SliderCaptchaProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const [sliderX, setSliderX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [verified, setVerified] = useState(false);
  const [targetX, setTargetX] = useState(150);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);

  useEffect(() => {
    if (open) {
      setTargetX(Math.floor(Math.random() * 120) + 100);
      setSliderX(0);
      setVerified(false);
    }
  }, [open]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (verified) return;
    setIsDragging(true);
    startXRef.current = e.clientX - sliderX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || verified) return;
    const newX = e.clientX - startXRef.current;
    const maxX = containerRef.current ? containerRef.current.offsetWidth - 50 : 250;
    setSliderX(Math.max(0, Math.min(newX, maxX)));
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (Math.abs(sliderX - targetX) < 10) {
      setVerified(true);
      setTimeout(() => {
        onSuccess();
      }, 800);
    } else {
      setSliderX(0);
    }
  };

  const handleRefresh = () => {
    setTargetX(Math.floor(Math.random() * 120) + 100);
    setSliderX(0);
    setVerified(false);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={340}
      centered
      title={
        <div className="flex items-center justify-between">
          <span>{t('login.imageCaptcha.title')}</span>
          <button
            onClick={handleRefresh}
            className="p-1 hover:bg-muted transition-colors"
          >
            <ReloadOutlined className="text-muted-foreground" />
          </button>
        </div>
      }
    >
      <div className="select-none">
        {/* 验证码图片区域 */}
        <div className="relative w-full h-40 bg-muted overflow-hidden mb-4">
          {/* 模拟背景 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid grid-cols-4 gap-2 p-4 opacity-20">
              {Array.from({ length: 12 }).map((_, i) => (
                <div 
                  key={i}
                  className="w-8 h-8 bg-primary"
                  style={{ opacity: Math.random() * 0.5 + 0.2 }}
                />
              ))}
            </div>
          </div>
          
          {/* 目标凹槽 */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-12 h-12 border-2 border-dashed border-primary/50 bg-primary/10"
            style={{ left: targetX }}
          />
          
          {/* 滑块拼图块 */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-12 h-12 transition-colors ${
              verified ? 'bg-success' : 'bg-primary'
            }`}
            style={{ 
              left: sliderX,
              transform: `translateY(-50%) ${isDragging ? 'scale(1.05)' : 'scale(1)'}`,
            }}
          >
            {verified && (
              <CheckCircleFilled className="text-2xl text-success-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            )}
          </div>
        </div>

        {/* 滑块轨道 */}
        <div
          ref={containerRef}
          className="relative w-full h-10 bg-muted overflow-hidden cursor-pointer"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* 已滑动区域 */}
          <div
            className={`absolute left-0 top-0 h-full transition-colors ${
              verified ? 'bg-success' : 'bg-primary/20'
            }`}
            style={{ width: sliderX + 25 }}
          />
          
          {/* 提示文字 */}
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm pointer-events-none">
            {verified 
              ? t('login.imageCaptcha.success')
              : t('login.imageCaptcha.slider')
            }
          </div>
          
          {/* 滑块 */}
          <div
            className={`absolute top-1 bottom-1 w-10 flex items-center justify-center cursor-grab active:cursor-grabbing transition-colors ${
              verified 
                ? 'bg-success text-success-foreground' 
                : 'bg-card text-primary hover:bg-primary hover:text-primary-foreground'
            }`}
            style={{ left: sliderX }}
            onMouseDown={handleMouseDown}
          >
            {verified ? (
              <CheckCircleFilled className="text-base" />
            ) : (
              <span className="text-base">→</span>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SliderCaptcha;

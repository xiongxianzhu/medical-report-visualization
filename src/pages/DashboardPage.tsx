/**
 * 📊 仪表盘页面 / Dashboard Page - Flat Design
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Row, Col, Statistic, Progress, Table, Tag, Avatar, List, Button } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  CloudUploadOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  UploadOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/stores/authStore';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { getDisplayName } = useAuthStore();

  // 统计数据
  const statsData = [
    {
      title: t('dashboard.totalUsers'),
      value: 1256,
      icon: <UserOutlined />,
      bgColor: 'bg-primary',
      lightBg: 'bg-primary-light',
      textColor: 'text-primary',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: t('dashboard.totalDoctors'),
      value: 328,
      icon: <TeamOutlined />,
      bgColor: 'bg-success',
      lightBg: 'bg-success-light',
      textColor: 'text-success',
      trend: '+5%',
      trendUp: true,
    },
    {
      title: t('dashboard.totalReports'),
      value: 892,
      icon: <FileTextOutlined />,
      bgColor: 'bg-warning',
      lightBg: 'bg-warning-light',
      textColor: 'text-warning',
      trend: '+23%',
      trendUp: true,
    },
    {
      title: t('dashboard.totalFiles'),
      value: 2341,
      icon: <CloudUploadOutlined />,
      bgColor: 'bg-accent',
      lightBg: 'bg-primary-light',
      textColor: 'text-accent',
      trend: '-3%',
      trendUp: false,
    },
  ];

  // 最近活动数据
  const recentActivities = [
    { 
      id: 1, 
      user: '张医生', 
      action: '上传了年度报告', 
      time: '5分钟前',
    },
    { 
      id: 2, 
      user: '李主任', 
      action: '审核通过了3份报告', 
      time: '15分钟前',
    },
    { 
      id: 3, 
      user: '王护士长', 
      action: '更新了个人资料', 
      time: '1小时前',
    },
    { 
      id: 4, 
      user: '系统', 
      action: '自动备份完成', 
      time: '2小时前',
    },
    { 
      id: 5, 
      user: '陈医生', 
      action: '导出了患者统计数据', 
      time: '3小时前',
    },
  ];

  // 快捷操作
  const quickActions = [
    { title: '新增用户', icon: <PlusOutlined />, bgColor: 'bg-primary' },
    { title: '上传数据', icon: <UploadOutlined />, bgColor: 'bg-success' },
    { title: '生成报告', icon: <BarChartOutlined />, bgColor: 'bg-warning' },
  ];

  // 系统状态
  const systemStatus = [
    { name: 'CPU使用率', value: 45 },
    { name: '内存使用', value: 62 },
    { name: '磁盘空间', value: 78 },
    { name: '数据库连接', value: 23 },
  ];

  // 最近登录表格列
  const loginColumns = [
    {
      title: '用户',
      dataIndex: 'user',
      key: 'user',
      render: (text: string) => (
        <div className="flex items-center gap-2">
          <Avatar size="small" icon={<UserOutlined />} className="bg-primary" />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: '登录方式',
      dataIndex: 'method',
      key: 'method',
      render: (text: string) => (
        <Tag color={text === '密码+短信' ? 'blue' : text === '扫码' ? 'green' : 'orange'}>
          {text}
        </Tag>
      ),
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag 
          icon={status === '成功' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
          color={status === '成功' ? 'success' : 'error'}
        >
          {status}
        </Tag>
      ),
    },
  ];

  const loginData = [
    { key: 1, user: '张医生', method: '密码+短信', ip: '192.168.1.101', time: '10:32:15', status: '成功' },
    { key: 2, user: '李主任', method: '扫码', ip: '192.168.1.102', time: '09:45:22', status: '成功' },
    { key: 3, user: '王护士', method: 'OTP', ip: '192.168.1.103', time: '09:12:08', status: '成功' },
    { key: 4, user: '陈医生', method: '密码+短信', ip: '192.168.1.104', time: '08:55:33', status: '失败' },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 欢迎横幅 - 扁平设计 */}
      <Card className="bg-primary border-none">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-primary-foreground mb-1">
              {t('dashboard.welcome')}，{getDisplayName()}！
            </h1>
            <p className="text-primary-foreground/80 text-sm">
              今天是 {new Date().toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="hidden md:block text-4xl">📊</div>
        </div>
      </Card>

      {/* 统计卡片 - 扁平设计 */}
      <Row gutter={[12, 12]}>
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="flat-card" size="small">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">{stat.title}</p>
                  <p className="text-2xl font-semibold text-foreground">{stat.value.toLocaleString()}</p>
                  <div className={`flex items-center gap-1 mt-1 text-xs ${stat.trendUp ? 'text-success' : 'text-destructive'}`}>
                    {stat.trendUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    <span>{stat.trend} 较上月</span>
                  </div>
                </div>
                <div className={`w-10 h-10 ${stat.bgColor} flex items-center justify-center text-primary-foreground`}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 主内容区 */}
      <Row gutter={[12, 12]}>
        {/* 最近登录 */}
        <Col xs={24} lg={16}>
          <Card 
            title={<span className="text-sm font-medium">📋 今日登录记录</span>}
            extra={<Button type="link" size="small">查看更多</Button>}
            size="small"
          >
            <Table 
              columns={loginColumns} 
              dataSource={loginData} 
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* 右侧面板 */}
        <Col xs={24} lg={8}>
          {/* 快捷操作 */}
          <Card 
            title={<span className="text-sm font-medium">⚡ {t('dashboard.quickActions')}</span>}
            className="mb-3"
            size="small"
          >
            <div className="grid grid-cols-3 gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="flex flex-col items-center gap-1.5 p-3 bg-muted hover:bg-primary-light transition-colors"
                >
                  <div className={`w-8 h-8 ${action.bgColor} flex items-center justify-center text-primary-foreground text-sm`}>
                    {action.icon}
                  </div>
                  <span className="text-xs">{action.title}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* 系统状态 */}
          <Card 
            title={<span className="text-sm font-medium">🖥️ {t('dashboard.systemStatus')}</span>}
            className="mb-3"
            size="small"
          >
            <div className="space-y-3">
              {systemStatus.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className={item.value > 70 ? 'text-warning' : 'text-foreground'}>
                      {item.value}%
                    </span>
                  </div>
                  <Progress 
                    percent={item.value} 
                    showInfo={false}
                    strokeColor={item.value > 70 ? '#f59e0b' : undefined}
                    size="small"
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* 最近活动 */}
          <Card 
            title={<span className="text-sm font-medium">🕐 {t('dashboard.recentActivity')}</span>}
            size="small"
          >
            <List
              dataSource={recentActivities}
              size="small"
              renderItem={(item) => (
                <List.Item className="!px-0 !py-2">
                  <div className="flex items-center gap-2">
                    <Avatar size="small" className="bg-primary text-xs">
                      {item.user[0]}
                    </Avatar>
                    <div>
                      <p className="text-xs text-foreground">
                        <span className="font-medium">{item.user}</span> {item.action}
                      </p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;

/**
 * 🏠 管理后台主布局 / Admin Main Layout - Flat Design
 */

import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Layout, Menu, Dropdown, Avatar, Badge, Button } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  FileOutlined,
  FileTextOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  LogoutOutlined,
  EditOutlined,
  LockOutlined,
  GlobalOutlined,
  BgColorsOutlined,
  DatabaseOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore, ThemeType } from '@/stores/themeStore';

const { Header, Sider, Content } = Layout;

const AdminLayout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, getDisplayName } = useAuthStore();
  const { theme, setTheme, sidebarCollapsed, toggleSidebar } = useThemeStore();
  
  // 菜单配置
  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: t('menu.dashboard'),
    },
    {
      key: '/users',
      icon: <TeamOutlined />,
      label: t('menu.userManagement'),
      children: [
        { key: '/users/list', label: t('menu.userList') },
        { key: '/users/roles', label: t('menu.roleManagement') },
        { key: '/users/permissions', label: t('menu.permissionManagement') },
      ],
    },
    {
      key: '/templates',
      icon: <BarChartOutlined />,
      label: t('menu.reportTemplate'),
    },
    {
      key: '/data',
      icon: <DatabaseOutlined />,
      label: t('menu.dataManagement'),
    },
    {
      key: '/files',
      icon: <FileOutlined />,
      label: t('menu.fileManagement'),
    },
    {
      key: '/logs',
      icon: <FileTextOutlined />,
      label: t('menu.logManagement'),
      children: [
        { key: '/logs/login', label: t('menu.loginLog') },
        { key: '/logs/operation', label: t('menu.operationLog') },
      ],
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: t('menu.systemSettings'),
    },
  ];

  // 主题选项
  const themeOptions: { key: ThemeType; label: string; color: string }[] = [
    { key: 'medical', label: t('theme.medical'), color: '#0ea5e9' },
    { key: 'forest', label: t('theme.forest'), color: '#22c55e' },
    { key: 'sunset', label: t('theme.sunset'), color: '#f97316' },
  ];

  // 语言选项
  const languageOptions = [
    { key: 'zh-CN', label: '简体中文' },
    { key: 'en', label: 'English' },
  ];

  // 用户下拉菜单
  const userMenuItems = [
    {
      key: 'profile',
      icon: <EditOutlined />,
      label: t('header.profile'),
      onClick: () => navigate('/profile'),
    },
    {
      key: 'password',
      icon: <LockOutlined />,
      label: t('header.changePassword'),
      onClick: () => navigate('/change-password'),
    },
    { type: 'divider' as const },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('header.logout'),
      danger: true,
      onClick: () => {
        logout();
        navigate('/login');
      },
    },
  ];

  // 处理语言切换
  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  // 获取当前选中的菜单项
  const getSelectedKeys = () => {
    const path = location.pathname;
    return [path];
  };

  // 获取展开的子菜单
  const getOpenKeys = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    if (segments.length > 1) {
      return [`/${segments[0]}`];
    }
    return [];
  };

  return (
    <Layout className="min-h-screen">
      {/* 侧边栏 - 扁平设计 */}
      <Sider
        trigger={null}
        collapsible
        collapsed={sidebarCollapsed}
        width={240}
        className="flat-sidebar !fixed left-0 top-0 bottom-0 z-50"
        theme="light"
      >
        {/* Logo */}
        <div className="h-14 flex items-center justify-center border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary flex items-center justify-center">
              <span className="text-lg text-primary-foreground">🏥</span>
            </div>
            {!sidebarCollapsed && (
              <div className="animate-fade-in">
                <h1 className="text-sm font-semibold text-sidebar-foreground leading-tight">
                  医生年度报告
                </h1>
                <p className="text-xs text-muted-foreground">
                  管理平台
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 菜单 */}
        <Menu
          mode="inline"
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={getOpenKeys()}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          className="border-none mt-1"
        />
      </Sider>

      {/* 主内容区 */}
      <Layout className={`transition-all duration-200 ${sidebarCollapsed ? 'ml-20' : 'ml-60'}`}>
        {/* 顶部导航 - 扁平设计 */}
        <Header className="flat-nav !px-4 h-14 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <Button
              type="text"
              icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={toggleSidebar}
              size="small"
            />
          </div>

          <div className="flex items-center gap-1">
            {/* 主题切换 */}
            <Dropdown
              menu={{
                items: themeOptions.map((item) => ({
                  key: item.key,
                  label: (
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.label}
                    </div>
                  ),
                  onClick: () => setTheme(item.key),
                })),
                selectedKeys: [theme],
              }}
              placement="bottom"
            >
              <Button type="text" icon={<BgColorsOutlined />} size="small" />
            </Dropdown>

            {/* 语言切换 */}
            <Dropdown
              menu={{
                items: languageOptions.map((item) => ({
                  key: item.key,
                  label: item.label,
                  onClick: () => handleLanguageChange(item.key),
                })),
                selectedKeys: [i18n.language],
              }}
              placement="bottom"
            >
              <Button type="text" icon={<GlobalOutlined />} size="small" />
            </Dropdown>

            {/* 通知 */}
            <Badge count={3} size="small">
              <Button type="text" icon={<BellOutlined />} size="small" />
            </Badge>

            {/* 用户信息 */}
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div className="flex items-center gap-2 cursor-pointer hover:bg-muted px-2 py-1 transition-colors ml-1">
                <Avatar
                  src={user?.avatar}
                  icon={<UserOutlined />}
                  size="small"
                  className="bg-primary"
                />
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-foreground leading-tight">
                    {getDisplayName()}
                  </p>
                  <p className="text-xs text-muted-foreground leading-tight">
                    {user?.roles.includes('super_admin') ? '超级管理员' : '管理员'}
                  </p>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* 页面内容 */}
        <Content className="p-4 min-h-[calc(100vh-56px)]">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;

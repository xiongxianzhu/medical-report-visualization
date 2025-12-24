import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { useAuthStore } from '@/stores/authStore';

// Pages
import LoginPage from "./pages/LoginPage";
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./pages/DashboardPage";
import UserManagementPage from "./pages/UserManagementPage";
import RoleManagementPage from "./pages/RoleManagementPage";
import PermissionManagementPage from "./pages/PermissionManagementPage";
import FileManagementPage from "./pages/FileManagementPage";
import LoginLogPage from "./pages/LoginLogPage";
import OperationLogPage from "./pages/OperationLogPage";
import ProfilePage from "./pages/ProfilePage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import ReportTemplatePage from "./pages/ReportTemplatePage";
import DataManagementPage from "./pages/DataManagementPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// 路由守卫组件
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ConfigProvider locale={zhCN} theme={{
      token: {
        colorPrimary: '#0ea5e9',
        borderRadius: 2,
        borderRadiusLG: 2,
        borderRadiusSM: 1,
        borderRadiusXS: 1,
        fontFamily: 'Inter, Noto Sans SC, system-ui, sans-serif',
      },
    }}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* 登录页 */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* 管理后台 */}
            <Route path="/" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="users/list" element={<UserManagementPage />} />
              <Route path="users/roles" element={<RoleManagementPage />} />
              <Route path="users/permissions" element={<PermissionManagementPage />} />
              <Route path="templates" element={<ReportTemplatePage />} />
              <Route path="data" element={<DataManagementPage />} />
              <Route path="files" element={<FileManagementPage />} />
              <Route path="logs/login" element={<LoginLogPage />} />
              <Route path="logs/operation" element={<OperationLogPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="change-password" element={<ChangePasswordPage />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ConfigProvider>
  </QueryClientProvider>
);

export default App;

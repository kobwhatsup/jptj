import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  FileText,
  Newspaper,
  MessageSquare,
  LogOut,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/contexts/AuthContext';

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: '仪表盘', path: '/dashboard' },
    { icon: Users, label: '用户管理', path: '/dashboard/users' },
    { icon: FileText, label: '政策管理', path: '/dashboard/policies' },
    { icon: Newspaper, label: '新闻管理', path: '/dashboard/news' },
    { icon: MessageSquare, label: '论坛管理', path: '/dashboard/forum' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm fixed top-0 left-0 right-0 h-16 z-50">
        <div className="flex items-center justify-between px-4 h-full">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="ml-4 text-xl font-semibold">金牌调解员平台管理系统</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-card shadow-sm transition-transform duration-200 ease-in-out",
          !isSidebarOpen && "-translate-x-full"
        )}
      >
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className={cn(
                "w-full justify-start",
                location.pathname === item.path && "bg-accent"
              )}
              asChild
            >
              <Link to={item.path}>
                <item.icon className="mr-2 h-5 w-5" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "pt-16 min-h-screen transition-all duration-200 ease-in-out",
          isSidebarOpen ? "pl-64" : "pl-0"
        )}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;

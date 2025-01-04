import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, User, LogOut, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../lib/hooks/useAuth';

import { CartItem } from '../../lib/types';

interface HeaderProps {
  cartItems: CartItem[];
}

const Header: React.FC<HeaderProps> = ({ cartItems }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const navigation = [
    { name: '首页', href: '/' },
    { name: '商品列表', href: '/products' },
    { name: 'AI设计师', href: '/designer' },
    { name: '购物车', href: '/cart' }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-indigo-600">AI Design Tee</h1>
            </Link>
            <nav className="hidden md:ml-8 md:flex space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-white bg-indigo-600'
                      : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索..."
                className="w-32 px-3 py-1.5 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <Search className="absolute right-2 top-1.5 h-4 w-4 text-gray-400" />
            </div>
            
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-5 w-5 text-gray-600" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-gray-100"
                >
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{user?.profile?.name || user?.username}</span>
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        个人资料
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          <LogOut className="h-4 w-4 mr-2" />
                          退出登录
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 px-3 py-1.5"
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-white bg-indigo-600 px-3 py-1.5 rounded-md hover:bg-indigo-700"
                >
                  注册
                </Link>
              </div>
            )}
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-100"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* 移动端菜单 */}
        {isMenuOpen && (
          <div className="md:hidden py-2">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(item.href)
                      ? 'text-white bg-indigo-600'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

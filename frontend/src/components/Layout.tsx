import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  User, 
  ShoppingCart, 
  Package, 
  Store, 
  BarChart3, 
  Settings,
  Menu,
  X,
  Bell,
  Search,
  Plane,
  LogOut
} from 'lucide-react';
import { RootState, AppDispatch } from '../store/store';
import { logout } from '../store/slices/authSlice';

interface LayoutProps {
  children: React.ReactNode;
  userType: 'customer' | 'seller' | 'admin';
}

const Layout: React.FC<LayoutProps> = ({ children, userType }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const { totalItems } = useSelector((state: RootState) => state.cart);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  // Navigation items based on user type
  const getNavigationItems = () => {
    switch (userType) {
      case 'customer':
        return [
          { name: 'Dashboard', path: '/customer', icon: Home },
          { name: 'Restaurants', path: '/customer/restaurants', icon: Store },
          { name: 'Cart', path: '/customer/cart', icon: ShoppingCart, badge: totalItems },
          { name: 'Orders', path: '/customer/orders', icon: Package },
          { name: 'Profile', path: '/customer/profile', icon: User },
        ];
      
      case 'seller':
        return [
          { name: 'Dashboard', path: '/seller', icon: Home },
          { name: 'Menu', path: '/seller/menu', icon: Store },
          { name: 'Orders', path: '/seller/orders', icon: Package },
          { name: 'Analytics', path: '/seller/analytics', icon: BarChart3 },
          { name: 'Profile', path: '/seller/profile', icon: User },
        ];
      
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin', icon: Home },
          { name: 'Drones', path: '/admin/drones', icon: Plane },
          { name: 'Fleet Monitor', path: '/admin/fleet', icon: BarChart3 },
          { name: 'Users', path: '/admin/users', icon: User },
          { name: 'Analytics', path: '/admin/analytics', icon: Settings },
        ];
      
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  const Sidebar = ({ mobile = false }) => (
    <div className={`${mobile ? 'lg:hidden' : 'hidden lg:flex'} flex-col w-64 bg-white shadow-lg`}>
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
          <Plane className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-800">DroneDelivery</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => mobile && setIsSidebarOpen(false)}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors relative ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.name}</span>
              {item.badge && item.badge > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div 
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-64 h-full"
            >
              <Sidebar mobile />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Search Bar (Customer only) */}
              {userType === 'customer' && (
                <div className="hidden sm:flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search restaurants, food..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-80"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg relative">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user?.firstName}
                  </span>
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10"
                    >
                      <Link
                        to={`/${userType}/profile`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Profile Settings
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
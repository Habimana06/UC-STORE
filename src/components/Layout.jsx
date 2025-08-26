import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useUI } from "../hooks/useUI";
import {
  LogOut, Home, Package, ShoppingCart, FileText, Settings as SettingsIcon, 
  Receipt, Store, Menu, X, User, Clock, Shield, Users, ChevronLeft, ChevronRight,
  Bell, Search, Activity, TrendingUp, AlertTriangle, CheckCircle, 
  MessageSquare, Calendar, BarChart3, PieChart, DollarSign, Inbox
} from "lucide-react";

export default function Layout() {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { theme, toggleTheme, language, setLanguage, t } = useUI();
  const [notifications] = useState([
    { id: 1, type: 'warning', message: 'Low stock: iPhone 15', time: '5m ago' },
    { id: 2, type: 'success', message: 'Order #1247 completed', time: '12m ago' },
    { id: 3, type: 'info', message: 'Daily report ready', time: '1h ago' }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Get current time
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden
     ${isActive 
       ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg" 
       : "hover:bg-white/10 text-gray-300 hover:text-white hover:shadow-md"
     }
     ${sidebarCollapsed ? 'justify-center px-3' : ''}`;

  const navigationItems = [
    { 
      path: "/", 
      icon: Home, 
      label: "Dashboard", 
      allowedRoles: ["admin", "employee"],
      badge: null
    },
    { 
      path: "/products", 
      icon: Package, 
      label: "Products", 
      allowedRoles: ["admin", "employee"],
      badge: "24"
    },
    { 
      path: "/sales", 
      icon: ShoppingCart, 
      label: "Sales", 
      allowedRoles: ["admin", "employee"],
      badge: "12"
    },
    { 
      path: "/purchases", 
      icon: Receipt, 
      label: "Purchases", 
      allowedRoles: ["admin", "employee"],
      badge: null
    },
    { 
      path: "/analytics", 
      icon: BarChart3, 
      label: "Analytics", 
      allowedRoles: ["admin", "employee"],
      badge: null
    },
    { 
      path: "/reports", 
      icon: FileText, 
      label: "Reports", 
      allowedRoles: ["admin"],
      badge: "3"
    },
    { 
      path: "/settings", 
      icon: SettingsIcon, 
      label: "Settings", 
      allowedRoles: ["admin"],
      badge: null
    }
  ];

  const quickActions = [
    { icon: TrendingUp, label: "Quick Stats", color: "text-green-400", to: "/dashboard" },
    { icon: DollarSign, label: "Revenue", color: "text-blue-400", to: "/sales" },
    { icon: PieChart, label: "Analytics", color: "text-purple-400", to: "/analytics" },
    { icon: Calendar, label: "Schedule", color: "text-orange-400", to: "/reports" }
  ];

  const filteredNavigation = navigationItems.filter(item => 
    item.allowedRoles.includes(user?.role)
  );

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return <Shield size={14} className="text-yellow-400" />;
      case 'employee': return <Users size={14} className="text-blue-400" />;
      default: return <User size={14} className="text-gray-400" />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'admin': return "bg-gradient-to-r from-yellow-500 to-orange-500";
      case 'employee': return "bg-gradient-to-r from-blue-500 to-cyan-500";
      default: return "bg-gray-500";
    }
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'warning': return <AlertTriangle size={14} className="text-yellow-400" />;
      case 'success': return <CheckCircle size={14} className="text-green-400" />;
      case 'info': return <Activity size={14} className="text-blue-400" />;
      default: return <Bell size={14} className="text-gray-400" />;
    }
  };

  const getNotificationColor = (type) => {
    switch(type) {
      case 'warning': return "border-l-yellow-400 bg-yellow-50/10";
      case 'success': return "border-l-green-400 bg-green-50/10";
      case 'info': return "border-l-blue-400 bg-blue-50/10";
      default: return "border-l-gray-400 bg-gray-50/10";
    }
  };

  const toggleSidebar = () => {
    if (window.innerWidth >= 768) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 to-gray-950' 
        : 'bg-gradient-to-br from-gray-50 to-gray-100'
    }`}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Enhanced Sidebar with proper height management */}
      <aside className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${sidebarCollapsed ? 'md:w-20' : 'md:w-80'}
        fixed top-0 left-0 z-40
        w-80 h-screen
        bg-gradient-to-b ${
          theme === 'dark' 
            ? 'from-gray-900 via-gray-800 to-gray-900' 
            : 'from-gray-800 via-gray-700 to-gray-800'
        }
        text-white
        transition-all duration-300 ease-in-out
        shadow-2xl md:shadow-xl
        flex flex-col
        border-r ${theme === 'dark' ? 'border-gray-700/50' : 'border-gray-600/50'}
      `}>
        {/* Header with collapse button */}
        <div className={`p-4 border-b flex-shrink-0 ${
          theme === 'dark' ? 'border-gray-700/50' : 'border-gray-600/50'
        }`}>
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                  <Store className="text-white" size={sidebarCollapsed ? 20 : 24} />
                </div>
                {!sidebarCollapsed && (
                  <div>
                    <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                      UC-STORE
                    </span>
                    <div className="text-xs text-gray-400">Inventory System</div>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="hidden md:flex p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
          
          {!sidebarCollapsed && (
            <div className="mt-3">
              <span className={`text-xs px-3 py-1.5 rounded-full text-white font-semibold ${getRoleBadgeColor(user?.role)} flex items-center gap-1 w-fit`}>
                {getRoleIcon(user?.role)}
                <span className="ml-1">{user?.role?.toUpperCase()}</span>
              </span>
            </div>
          )}
        </div>

        {/* User profile section */}
        {!sidebarCollapsed && (
          <div className={`p-4 border-b flex-shrink-0 ${
            theme === 'dark' ? 'border-gray-700/50' : 'border-gray-600/50'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center relative">
                {getRoleIcon(user?.role)}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-gray-900 rounded-full"></div>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white text-sm">{user?.username}</div>
                <div className="text-xs text-gray-400 capitalize">{user?.role}</div>
                <div className="text-xs text-green-400">● Online</div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {!sidebarCollapsed && (
          <div className={`p-4 border-b flex-shrink-0 ${
            theme === 'dark' ? 'border-gray-700/50' : 'border-gray-600/50'
          }`}>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Actions</div>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => navigate(action.to)}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 group"
                >
                  <action.icon size={18} className={`${action.color} group-hover:scale-110 transition-transform`} />
                  <span className="text-xs text-gray-300">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation - Takes remaining space with scroll */}
        <nav className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          <div className={`text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 ${sidebarCollapsed ? 'text-center' : ''}`}>
            {sidebarCollapsed ? '•••' : t('nav.navigation')}
          </div>
          <div className="flex flex-col gap-2">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.path} className="relative">
                  <NavLink 
                    to={item.path} 
                    className={linkClass}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon size={20} className="flex-shrink-0"/>
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1">{
                          (() => {
                            switch(item.path){
                              case '/':
                              case '/dashboard': return t('nav.dashboard');
                              case '/products': return t('nav.products');
                              case '/sales': return t('nav.sales');
                              case '/purchases': return t('nav.purchases');
                              case '/analytics': return t('nav.analytics');
                              case '/reports': return t('nav.reports');
                              case '/settings': return t('nav.settings');
                              default: return item.label;
                            }
                          })()
                        }</span>
                        {item.badge && (
                          <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-medium">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                  
                  {/* Tooltip for collapsed state */}
                  {sidebarCollapsed && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl border border-gray-700">
                      {item.label}
                      {item.badge && (
                        <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-xs rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Footer with system info */}
        <div className={`p-4 border-t flex-shrink-0 ${
          theme === 'dark' ? 'border-gray-700/50' : 'border-gray-600/50'
        }`}>
          {sidebarCollapsed ? (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Store size={16} className="text-white"/>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-xs text-gray-400 flex items-center gap-2 mb-2">
                <Store size={14}/>
                <span>UC-STORE v2.0</span>
              </div>
              <div className="text-xs text-gray-500 mb-2">
                Server: Online • Users: 24
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {currentTime.toLocaleTimeString()}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area - Properly positioned with margin for sidebar */}
      <div className={`flex flex-col min-h-screen transition-all duration-300 ${
        sidebarCollapsed ? 'md:ml-20' : 'md:ml-80'
      }`}>
        {/* Enhanced Header - Now properly positioned */}
        <header className={`backdrop-blur-xl border-b shadow-sm flex-shrink-0 sticky top-0 z-20 transition-colors duration-300 ${
          theme === 'dark' 
            ? 'bg-gray-900/80 border-gray-800' 
            : 'bg-white/90 border-gray-200/50'
        }`}>
          <div className="px-6 py-4 flex items-center justify-between transition-all duration-300">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`md:hidden p-2 rounded-xl transition-colors ${
                theme === 'dark' 
                  ? 'hover:bg-gray-800 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Search bar */}
            <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-4">
              <div className="relative flex-1">
                <Search size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  placeholder="Search products, orders..."
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-400' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-3 ml-auto">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`p-2.5 rounded-xl transition-colors relative ${
                    theme === 'dark' 
                      ? 'bg-gray-800 hover:bg-gray-700' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <Bell size={18} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {/* Notifications dropdown */}
                {showNotifications && (
                  <div className={`absolute right-0 top-full mt-2 w-80 rounded-xl shadow-xl border z-50 max-h-96 overflow-y-auto ${
                    theme === 'dark' 
                      ? 'bg-gray-900 border-gray-800' 
                      : 'bg-white border-gray-200'
                  }`}>
                    <div className={`p-4 border-b ${
                      theme === 'dark' ? 'border-gray-800' : 'border-gray-100'
                    }`}>
                      <div className="flex items-center justify-between">
                        <h3 className={`font-semibold ${
                          theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                        }`}>Notifications</h3>
                        <span className={`text-xs ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>{notifications.length} new</span>
                      </div>
                    </div>
                    <div className="p-2">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg border-l-4 mb-2 ${getNotificationColor(notification.type)}`}
                        >
                          <div className="flex items-start gap-3">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1">
                              <p className={`text-sm ${
                                theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                              }`}>{notification.message}</p>
                              <p className={`text-xs mt-1 ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                              }`}>{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Current path */}
              <div className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
              }`}>
                <Clock size={14} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                <span className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  <span className="font-medium text-indigo-600">{location.pathname}</span>
                </span>
              </div>

              {/* Theme & Language */}
              <div className="hidden sm:flex items-center gap-2">
                <button 
                  onClick={toggleTheme} 
                  className={`px-3 py-2 rounded-lg text-xs transition-colors border ${
                    theme === 'dark'
                      ? 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-200'
                      : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                  }`}
                >
                  {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
                </button>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={`px-2 py-2 rounded-lg text-xs transition-colors border ${
                    theme === 'dark'
                      ? 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-200'
                      : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                  }`}
                >
                  <option value="english">EN</option>
                  <option value="french">FR</option>
                </select>
              </div>

              {/* User menu */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-colors ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700'
                  : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
              }`}>
                <User size={16} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} />
                <span className={`font-medium text-sm ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}>{user?.username}</span>
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                <LogOut size={16}/> 
                <span className="hidden sm:inline">{t('actions.logout')}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className={`flex-1 p-6 overflow-y-auto transition-colors duration-300 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-900 to-gray-950' 
            : 'bg-gradient-to-br from-gray-50 to-gray-100'
        }`}>
          <div className={`rounded-2xl shadow-xl border overflow-hidden min-h-full transition-colors duration-300 ${
            theme === 'dark' 
              ? 'bg-gray-900 border-gray-800' 
              : 'bg-white border-gray-200/50'
          }`}>
            <div className="p-6">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* Click outside to close notifications */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingCart, 
  Package, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock,
  Target,
  Award,
  Calendar,
  Bell,
  Search,
  Filter,
  User,
  Settings,
  LogOut,
  CheckCircle,
  AlertCircle,
  Star,
  Activity,
  DollarSign,
  Eye,
  ArrowUp,
  ArrowDown,
  Plus,
  MessageSquare
} from "lucide-react";

// Mock hook for authentication
const useAuth = () => ({
  user: {
    username: "John Doe",
    role: "sales associate",
    avatar: null,
    joinDate: "Jan 2024",
    performance: 92
  }
});

// Mock data
const mockData = {
  sales: {
    today: 15,
    thisWeek: 89,
    thisMonth: 342,
    target: 400,
    growth: 12.5
  },
  products: {
    total: 156,
    lowStock: 8,
    outOfStock: 3
  },
  tasks: [
    { id: 1, title: "Follow up with Johnson Corp", priority: "high", completed: false, dueTime: "2:00 PM" },
    { id: 2, title: "Update inventory count", priority: "medium", completed: true, dueTime: "10:00 AM" },
    { id: 3, title: "Prepare monthly report", priority: "low", completed: false, dueTime: "5:00 PM" },
    { id: 4, title: "Customer feedback review", priority: "medium", completed: false, dueTime: "3:30 PM" }
  ],
  notifications: [
    { id: 1, message: "New order #1234 received", time: "5 min ago", type: "info" },
    { id: 2, message: "Low stock alert: iPhone cases", time: "15 min ago", type: "warning" },
    { id: 3, message: "Achievement unlocked: Top Performer", time: "1 hour ago", type: "success" }
  ],
  recentActivity: [
    { id: 1, action: "Sale completed", amount: "$299", customer: "Sarah Wilson", time: "10:30 AM" },
    { id: 2, action: "Product updated", product: "Wireless Headphones", time: "9:45 AM" },
    { id: 3, action: "Customer inquiry", customer: "Mike Johnson", time: "9:20 AM" }
  ]
};

function EmployeeHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  // const [selectedPeriod, setSelectedPeriod] = useState('today');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const StatCard = ({ icon, title, value, subtitle, trend, color, bgColor }) => (
    <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-xl hover:shadow-gray-100/50 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50/50" />
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${bgColor} ${color} group-hover:scale-110 transition-transform duration-300`}>
            {React.createElement(icon, { size: 24 })}
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  const TaskItem = ({ task, onToggle }) => (
    <div className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 ${
      task.completed 
        ? 'border-green-100 bg-green-50/50' 
        : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
    }`}>
      <button 
        onClick={() => onToggle(task.id)}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
          task.completed
            ? 'border-green-500 bg-green-500 text-white'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        {task.completed && <CheckCircle size={12} />}
      </button>
      <div className="flex-1">
        <p className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
          {task.title}
        </p>
        <p className="text-sm text-gray-500">{task.dueTime}</p>
      </div>
      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
        task.priority === 'high' 
          ? 'bg-red-100 text-red-700'
          : task.priority === 'medium'
          ? 'bg-yellow-100 text-yellow-700'
          : 'bg-gray-100 text-gray-700'
      }`}>
        {task.priority}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 18 ? 'Afternoon' : 'Evening'}, {user.username.split(' ')[0]}! 
                <span className="ml-2">👋</span>
              </h1>
              <p className="text-gray-600 mt-1">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600 hover:text-gray-900 cursor-pointer" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">{mockData.notifications.length}</span>
                </div>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Performance Banner */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full" style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
            }}></div>
          </div>
          <div className="relative flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Performance This Month</h3>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-white/80 text-sm">Sales Target</p>
                  <p className="text-2xl font-bold">{mockData.sales.thisMonth}/{mockData.sales.target}</p>
                </div>
                <div>
                  <p className="text-white/80 text-sm">Completion Rate</p>
                  <p className="text-2xl font-bold">{Math.round((mockData.sales.thisMonth / mockData.sales.target) * 100)}%</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Award className="w-12 h-12 mb-2 opacity-80" />
              <p className="text-white/80 text-sm">You're doing great!</p>
            </div>
          </div>
          <div className="mt-4 bg-white/20 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-1000"
              style={{ width: `${Math.min((mockData.sales.thisMonth / mockData.sales.target) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={ShoppingCart}
            title="Today's Sales"
            value={mockData.sales.today}
            subtitle={`${mockData.sales.thisWeek} this week`}
            trend={mockData.sales.growth}
            color="text-indigo-600"
            bgColor="bg-indigo-100"
          />
          <StatCard
            icon={DollarSign}
            title="Revenue Today"
            value="$4,280"
            subtitle="$28,640 this week"
            trend={8.2}
            color="text-green-600"
            bgColor="bg-green-100"
          />
          <StatCard
            icon={Package}
            title="Products"
            value={mockData.products.total}
            subtitle={`${mockData.products.lowStock} low stock`}
            color="text-purple-600"
            bgColor="bg-purple-100"
          />
          <StatCard
            icon={Users}
            title="Customers"
            value="34"
            subtitle="12 new this week"
            trend={15.3}
            color="text-orange-600"
            bgColor="bg-orange-100"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tasks & Goals */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                 {[
                   { icon: Plus, label: "New Sale", color: "bg-green-100 text-green-600 hover:bg-green-200", to: "/employee/sales" },
                   { icon: Package, label: "Add Product", color: "bg-blue-100 text-blue-600 hover:bg-blue-200", to: "/employee/products" },
                   { icon: Users, label: "New Customer", color: "bg-purple-100 text-purple-600 hover:bg-purple-200", to: "/employee" },
                   { icon: BarChart3, label: "View Reports", color: "bg-orange-100 text-orange-600 hover:bg-orange-200", to: "/employee/analytics" }
                 ].map((action, index) => {
                   const ActionIcon = action.icon;
                   return (
                     <button 
                       key={index} 
                       onClick={() => navigate(action.to)}
                       className={`p-4 rounded-xl transition-colors ${action.color}`}
                     >
                       <ActionIcon className="w-6 h-6 mx-auto mb-2" />
                       <p className="text-sm font-medium">{action.label}</p>
                     </button>
                   );
                 })}
              </div>
            </div>

            {/* Today's Tasks */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Today's Tasks</h3>
                <div className="text-sm text-gray-500">
                  {mockData.tasks.filter(t => t.completed).length} of {mockData.tasks.length} completed
                </div>
              </div>
              <div className="space-y-3">
                {mockData.tasks.map(task => (
                  <TaskItem key={task.id} task={task} onToggle={() => {}} />
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {mockData.recentActivity.map(activity => (
                  <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Activity className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-500">
                        {activity.customer || activity.product} • {activity.time}
                      </p>
                    </div>
                    {activity.amount && (
                      <div className="text-green-600 font-semibold">{activity.amount}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">{user.username}</h3>
                <p className="text-sm text-gray-500 capitalize mb-4">{user.role}</p>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                  <div className="text-center">
                    <p className="font-semibold text-gray-900">{user.performance}%</p>
                    <p>Performance</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-900">12</p>
                    <p>Months</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
              <div className="space-y-3">
                {mockData.notifications.map(notification => (
                  <div key={notification.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      notification.type === 'success' ? 'bg-green-500' :
                      notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Goals Progress */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Goals</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Sales Target</span>
                    <span className="font-medium">{mockData.sales.thisMonth}/{mockData.sales.target}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${(mockData.sales.thisMonth / mockData.sales.target) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Customer Satisfaction</span>
                    <span className="font-medium">4.8/5.0</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full w-[96%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeHome;
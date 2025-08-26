import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Package, 
  Boxes, 
  ShoppingCart, 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Eye, 
  AlertTriangle,
  Star,
  MapPin,
  Clock,
  Zap,
  Activity
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from "recharts";

// Mock data context for demo
const useData = () => ({
  products: Array.from({length: 245}, (_, i) => ({ 
    id: i + 1, 
    stock: Math.floor(Math.random() * 100),
    category: ['Electronics', 'Clothing', 'Books', 'Home'][Math.floor(Math.random() * 4)]
  })),
  sales: Array.from({length: 156}, (_, i) => ({ 
    id: i + 1, 
    total: Math.floor(Math.random() * 500) + 50,
    date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
  }))
});

function Stat({ icon, label, value, change, trend, color = "blue" }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
    indigo: "bg-indigo-50 text-indigo-600"
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-xl ${colors[color]}`}>{icon}</div>
        {change && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend === 'up' ? 'text-green-600' : 'text-red-500'
          }`}>
            {trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {change}%
          </div>
        )}
      </div>
      <div>
        <div className="text-sm text-gray-500 font-medium">{label}</div>
        <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
      </div>
    </div>
  );
}

function QuickAction({ icon, label, color = "blue", onClick }) {
  const colors = {
    blue: "bg-blue-500 hover:bg-blue-600",
    green: "bg-green-500 hover:bg-green-600",
    purple: "bg-purple-500 hover:bg-purple-600",
    orange: "bg-orange-500 hover:bg-orange-600"
  };

  return (
    <button onClick={onClick} className={`${colors[color]} text-white p-4 rounded-xl flex items-center gap-3 transition-all duration-200 hover:shadow-lg transform hover:scale-105`}>
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

function RecentActivity({ activities }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <Activity className="h-5 w-5 text-gray-400" />
      </div>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
            <div className={`p-2 rounded-lg ${activity.color}`}>
              {activity.icon}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">{activity.title}</div>
              <div className="text-xs text-gray-500">{activity.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopProducts({ products }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
        <Star className="h-5 w-5 text-gray-400" />
      </div>
      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                <div className="text-xs text-gray-500">{product.category}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900">{product.sales}</div>
              <div className="text-xs text-gray-500">sales</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { products, sales } = useData();
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const lowStock = products.filter((p) => p.stock < 30).length;
  const revenue = sales.reduce((a, s) => a + s.total, 0);
  const avgOrderValue = revenue / sales.length;
  const totalCustomers = 1247;

  const salesData = [
    { month: "Jan", sales: 3200, revenue: 45000, orders: 128 },
    { month: "Feb", sales: 4100, revenue: 52000, orders: 164 },
    { month: "Mar", sales: 3800, revenue: 48000, orders: 152 },
    { month: "Apr", sales: 5000, revenue: 65000, orders: 200 },
    { month: "May", sales: 6200, revenue: 78000, orders: 248 },
    { month: "Jun", sales: 5900, revenue: 74000, orders: 236 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 35, color: '#3B82F6' },
    { name: 'Clothing', value: 28, color: '#10B981' },
    { name: 'Books', value: 20, color: '#F59E0B' },
    { name: 'Home', value: 17, color: '#8B5CF6' }
  ];

  const recentActivities = [
    {
      icon: <ShoppingCart className="h-4 w-4" />,
      title: "New order #1247 received",
      time: "2 minutes ago",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: <AlertTriangle className="h-4 w-4" />,
      title: "Low stock alert: iPhone 15",
      time: "15 minutes ago",
      color: "bg-orange-100 text-orange-600"
    },
    {
      icon: <Users className="h-4 w-4" />,
      title: "3 new customers registered",
      time: "1 hour ago",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: <Package className="h-4 w-4" />,
      title: "Product shipment arrived",
      time: "2 hours ago",
      color: "bg-purple-100 text-purple-600"
    }
  ];

  const topProducts = [
    { name: "iPhone 15 Pro", category: "Electronics", sales: 342 },
    { name: "Nike Air Max", category: "Footwear", sales: 287 },
    { name: "MacBook Air", category: "Electronics", sales: 234 },
    { name: "Samsung Watch", category: "Electronics", sales: 198 },
    { name: "Adidas Hoodie", category: "Clothing", sales: 156 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your business.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border shadow-sm">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border shadow-sm">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Kigali, RW</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <Stat 
            icon={<Package className="h-6 w-6" />} 
            label="Total Products" 
            value={products.length.toLocaleString()} 
            change={12.5}
            trend="up"
            color="blue"
          />
          <Stat 
            icon={<AlertTriangle className="h-6 w-6" />} 
            label="Low Stock Items" 
            value={lowStock} 
            change={5.2}
            trend="down"
            color="red"
          />
          <Stat 
            icon={<ShoppingCart className="h-6 w-6" />} 
            label="Monthly Orders" 
            value={sales.length} 
            change={18.7}
            trend="up"
            color="green"
          />
          <Stat 
            icon={<DollarSign className="h-6 w-6" />} 
            label="Total Revenue" 
            value={`$${revenue.toLocaleString()}`} 
            change={23.1}
            trend="up"
            color="purple"
          />
          <Stat 
            icon={<Users className="h-6 w-6" />} 
            label="Customers" 
            value={totalCustomers.toLocaleString()} 
            change={8.3}
            trend="up"
            color="orange"
          />
          <Stat 
            icon={<BarChart3 className="h-6 w-6" />} 
            label="Avg. Order Value" 
            value={`$${avgOrderValue.toFixed(0)}`} 
            change={15.2}
            trend="up"
            color="indigo"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-500" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <QuickAction 
              icon={<Package className="h-5 w-5" />} 
              label="Add Product" 
              color="blue"
              onClick={() => navigate('/products')}
            />
            <QuickAction 
              icon={<ShoppingCart className="h-5 w-5" />} 
              label="New Order" 
              color="green"
              onClick={() => navigate('/sales')}
            />
            <QuickAction 
              icon={<Users className="h-5 w-5" />} 
              label="Manage Customers" 
              color="purple"
              onClick={() => navigate('/settings')}
            />
            <QuickAction 
              icon={<BarChart3 className="h-5 w-5" />} 
              label="View Reports" 
              color="orange"
              onClick={() => navigate('/reports')}
            />
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Sales Chart */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-6 flex items-center justify-between">
              <span>Sales Overview</span>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    fill="url(#salesGradient)"
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-6 flex items-center justify-between">
              <span>Monthly Revenue</span>
              <DollarSign className="h-5 w-5 text-green-500" />
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <Bar 
                    dataKey="revenue" 
                    fill="url(#revenueGradient)" 
                    radius={[8, 8, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981"/>
                      <stop offset="95%" stopColor="#059669"/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Category Distribution */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-6 flex items-center justify-between">
              <span>Sales by Category</span>
              <Eye className="h-5 w-5 text-gray-400" />
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-xs text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <TopProducts products={topProducts} />

          {/* Recent Activity */}
          <RecentActivity activities={recentActivities} />
        </div>
      </div>
    </div>
  );
}
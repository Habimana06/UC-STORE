import React, { useMemo, useState } from "react";
import { 
  Download, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  ShoppingCart, 
  AlertTriangle,
  Calendar,
  Filter,
  FileText,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Users,
  Star,
  Clock,
  Eye
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
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from "recharts";

// Mock data context for demo
const useData = () => ({
  products: Array.from({length: 245}, (_, i) => ({ 
    id: i + 1, 
    name: `Product ${i + 1}`,
    category: ['Electronics', 'Clothing', 'Books', 'Home'][Math.floor(Math.random() * 4)],
    supplier: `Supplier ${Math.floor(Math.random() * 10) + 1}`,
    stock: Math.floor(Math.random() * 100),
    price: Math.floor(Math.random() * 500) + 50
  })),
  sales: Array.from({length: 156}, (_, i) => ({ 
    id: i + 1,
    date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    productId: Math.floor(Math.random() * 245) + 1,
    qty: Math.floor(Math.random() * 10) + 1,
    total: Math.floor(Math.random() * 500) + 50
  })),
  purchases: Array.from({length: 89}, (_, i) => ({ 
    id: i + 1,
    cost: Math.floor(Math.random() * 300) + 100
  }))
});

function downloadCSV(filename, rows) {
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url; 
  link.setAttribute("download", filename);
  document.body.appendChild(link); 
  link.click(); 
  document.body.removeChild(link);
}

function StatCard({ icon, label, value, change, trend, color = "blue" }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    red: "bg-red-50 text-red-600 border-red-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100"
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          {icon}
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${
            trend === 'up' ? 'text-green-600' : 'text-red-500'
          }`}>
            {trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {change}%
          </div>
        )}
      </div>
      <div>
        <div className="text-sm text-gray-500 font-medium mb-1">{label}</div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
      </div>
    </div>
  );
}

function ReportCard({ title, description, icon, children, actions }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {description && <p className="text-sm text-gray-500">{description}</p>}
          </div>
        </div>
        {actions && (
          <div className="flex gap-2">
            {actions}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

function ExportButton({ onClick, label, icon = <Download className="h-4 w-4" /> }) {
  return (
    <button 
      onClick={onClick}
      className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-colors duration-200 text-sm font-medium"
    >
      {icon}
      {label}
    </button>
  );
}

export default function Reports() {
  const { products, sales, purchases } = useData();
  const [dateRange, setDateRange] = useState('30');
  // Removed unused selectedCategory state

  // Calculations
  const revenue = sales.reduce((a, s) => a + s.total, 0);
  const purchaseCost = purchases.reduce((a, p) => a + p.cost, 0);
  const profit = revenue - purchaseCost;
  const profitMargin = ((profit / revenue) * 100);
  const avgOrderValue = revenue / sales.length;
  const totalOrders = sales.length;

  const topLow = useMemo(() => 
    [...products].sort((a,b) => a.stock - b.stock).slice(0, 8), 
    [products]
  );

  const topPerforming = useMemo(() => 
    [...products].sort((a,b) => b.price * Math.random() - a.price * Math.random()).slice(0, 5), 
    [products]
  );

  // Monthly data for charts
  const monthlyData = [
    { month: 'Jan', revenue: 45000, profit: 15000, orders: 120 },
    { month: 'Feb', revenue: 52000, profit: 18500, orders: 145 },
    { month: 'Mar', revenue: 48000, profit: 16200, orders: 138 },
    { month: 'Apr', revenue: 65000, profit: 22750, orders: 180 },
    { month: 'May', revenue: 78000, profit: 27300, orders: 220 },
    { month: 'Jun', revenue: 74000, profit: 25900, orders: 205 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 35, revenue: 28500, color: '#3B82F6' },
    { name: 'Clothing', value: 28, revenue: 22400, color: '#10B981' },
    { name: 'Books', value: 20, revenue: 16000, color: '#F59E0B' },
    { name: 'Home', value: 17, revenue: 13600, color: '#8B5CF6' }
  ];

  // Export functions
  const exportProducts = () => {
    const rows = [
      ["ID", "Name", "Category", "Supplier", "Stock", "Price"],
      ...products.map(p => [p.id, p.name, p.category, p.supplier, p.stock, p.price])
    ];
    downloadCSV("products_report.csv", rows);
  };

  const exportSales = () => {
    const rows = [
      ["Date", "Product ID", "Quantity", "Total"],
      ...sales.map(s => [s.date, s.productId, s.qty, s.total])
    ];
    downloadCSV("sales_report.csv", rows);
  };

  const exportFinancials = () => {
    const rows = [
      ["Metric", "Value"],
      ["Total Revenue", revenue.toFixed(2)],
      ["Total Costs", purchaseCost.toFixed(2)],
      ["Net Profit", profit.toFixed(2)],
      ["Profit Margin", profitMargin.toFixed(2) + "%"],
      ["Average Order Value", avgOrderValue.toFixed(2)],
      ["Total Orders", totalOrders]
    ];
    downloadCSV("financial_report.csv", rows);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Reports</h1>
            <p className="text-gray-600">Comprehensive analytics and insights for your business</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border shadow-sm">
              <Calendar className="h-4 w-4 text-gray-400" />
              <select 
                value={dateRange} 
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-transparent text-sm outline-none"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
            </div>
            <ExportButton 
              onClick={exportFinancials} 
              label="Export Summary" 
              icon={<FileText className="h-4 w-4" />}
            />
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard
            icon={<DollarSign className="h-6 w-6" />}
            label="Total Revenue"
            value={`$${revenue.toLocaleString()}`}
            change={23.5}
            trend="up"
            color="green"
          />
          <StatCard
            icon={<TrendingUp className="h-6 w-6" />}
            label="Net Profit"
            value={`$${profit.toLocaleString()}`}
            change={18.2}
            trend="up"
            color="blue"
          />
          <StatCard
            icon={<Target className="h-6 w-6" />}
            label="Profit Margin"
            value={`${profitMargin.toFixed(1)}%`}
            change={5.3}
            trend="up"
            color="purple"
          />
          <StatCard
            icon={<ShoppingCart className="h-6 w-6" />}
            label="Total Orders"
            value={totalOrders.toLocaleString()}
            change={12.8}
            trend="up"
            color="orange"
          />
          <StatCard
            icon={<Package className="h-6 w-6" />}
            label="Products"
            value={products.length.toLocaleString()}
            change={8.1}
            trend="up"
            color="indigo"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Revenue Trend */}
          <ReportCard
            title="Revenue & Profit Trend"
            description="Monthly performance overview"
            icon={<BarChart3 className="h-5 w-5" />}
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
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
                    dataKey="revenue" 
                    stroke="#3B82F6" 
                    fill="url(#revenueGradient)"
                    strokeWidth={3}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#10B981" 
                    fill="url(#profitGradient)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ReportCard>

          {/* Category Performance */}
          <ReportCard
            title="Sales by Category"
            description="Revenue distribution across categories"
            icon={<PieChart className="h-5 w-5" />}
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Share']}
                    contentStyle={{ 
                      background: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '12px'
                    }} 
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">${item.revenue.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </ReportCard>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Low Stock Alert */}
          <ReportCard
            title="Low Stock Alert"
            description="Products requiring immediate attention"
            icon={<AlertTriangle className="h-5 w-5" />}
            actions={[
              <ExportButton key="export" onClick={exportProducts} label="Export Products" />
            ]}
          >
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Product</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Category</th>
                    <th className="text-right p-4 text-sm font-semibold text-gray-700">Stock</th>
                    <th className="text-right p-4 text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topLow.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">ID: {product.id}</div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">{product.category}</td>
                      <td className="p-4 text-right">
                        <span className={`font-semibold ${product.stock < 10 ? 'text-red-600' : product.stock < 20 ? 'text-orange-600' : 'text-yellow-600'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.stock < 10 ? 'bg-red-100 text-red-800' : 
                          product.stock < 20 ? 'bg-orange-100 text-orange-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {product.stock < 10 ? 'Critical' : product.stock < 20 ? 'Low' : 'Warning'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ReportCard>

          {/* Top Performers */}
          <ReportCard
            title="Top Performing Products"
            description="Best sellers this month"
            icon={<Star className="h-5 w-5" />}
            actions={[
              <ExportButton key="export-sales" onClick={exportSales} label="Export Sales" />
            ]}
          >
            <div className="space-y-4">
              {topPerforming.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.category}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">${product.price}</div>
                    <div className="text-sm text-gray-500">{Math.floor(Math.random() * 50) + 10} sold</div>
                  </div>
                </div>
              ))}
            </div>
          </ReportCard>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center">
            <div className="p-4 bg-blue-50 rounded-full inline-flex mb-4">
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">{avgOrderValue.toFixed(0)}</div>
            <div className="text-sm text-gray-500">Average Order Value</div>
            <div className="text-xs text-green-600 font-medium mt-2">+15.3% from last month</div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center">
            <div className="p-4 bg-green-50 rounded-full inline-flex mb-4">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">1,247</div>
            <div className="text-sm text-gray-500">Active Customers</div>
            <div className="text-xs text-green-600 font-medium mt-2">+8.2% from last month</div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center">
            <div className="p-4 bg-purple-50 rounded-full inline-flex mb-4">
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">3.2%</div>
            <div className="text-sm text-gray-500">Conversion Rate</div>
            <div className="text-xs text-green-600 font-medium mt-2">+0.8% from last month</div>
          </div>
        </div>
      </div>
    </div>
  );
}
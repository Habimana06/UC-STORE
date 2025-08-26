import React, { useState, useMemo } from "react";
import { useData } from "../hooks/useData";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart
} from "recharts";
import {
  TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, Eye,
  Calendar, Filter, Download, RefreshCw, Target, Award, Users, Clock
} from "lucide-react";

export default function Analytics() {
  const { products, sales } = useData();
  const [timeRange, setTimeRange] = useState('7d');
  const [viewType, setViewType] = useState('overview');

  // Calculate key metrics
  const metrics = useMemo(() => {
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
    const totalSales = sales.length;
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
    
    const avgOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;
    const lowStockProducts = products.filter(p => p.stock < 10).length;
    
    return {
      totalRevenue,
      totalSales,
      totalProducts,
      totalStock,
      avgOrderValue,
      lowStockProducts
    };
  }, [sales, products]);

  // Prepare chart data
  const salesByMonth = useMemo(() => {
    const monthlyData = {};
    sales.forEach(sale => {
      const month = new Date(sale.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      monthlyData[month] = (monthlyData[month] || 0) + sale.total;
    });
    
    return Object.entries(monthlyData).map(([month, revenue]) => ({
      month,
      revenue: Number(Number(revenue).toFixed(2))
    }));
  }, [sales]);

  const productPerformance = useMemo(() => {
    const productSales = {};
    sales.forEach(sale => {
      const product = products.find(p => p.id === sale.productId);
      if (product) {
        productSales[product.name] = (productSales[product.name] || 0) + sale.qty;
      }
    });
    
    return Object.entries(productSales)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 8);
  }, [sales, products]);

  const categoryBreakdown = useMemo(() => {
    const categories = {};
    products.forEach(product => {
      const category = product.category || 'Uncategorized';
      categories[category] = (categories[category] || 0) + product.stock;
    });
    
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [products]);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#84cc16'];

  const MetricCard = ({ title, value, change, color, icon, format = 'number' }) => {
    const IconComp = icon;
    return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {format === 'currency' && '$'}
            {typeof value === 'number' ? value.toLocaleString() : value}
            {format === 'percentage' && '%'}
          </p>
          {change && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              change > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {change > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{Math.abs(change)}% vs last period</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-2xl ${color}`}>
          {IconComp && <IconComp size={24} className="text-white" />}
        </div>
      </div>
    </div>
  );
  };

  const ViewSelector = () => (
    <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
      {[
        { key: 'overview', label: 'Overview', icon: Eye },
        { key: 'sales', label: 'Sales', icon: ShoppingCart },
        { key: 'products', label: 'Products', icon: Package },
        { key: 'performance', label: 'Performance', icon: Target }
      ].map(({ key, label, icon }) => {
        const IconComp = icon;
        return (
        <button
          key={key}
          onClick={() => setViewType(key)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            viewType === key
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <IconComp size={16} />
          {label}
        </button>
        );
      })}
    </div>
  );

  const TimeRangeSelector = () => (
    <select
      value={timeRange}
      onChange={(e) => setTimeRange(e.target.value)}
      className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <option value="24h">Last 24 Hours</option>
      <option value="7d">Last 7 Days</option>
      <option value="30d">Last 30 Days</option>
      <option value="3m">Last 3 Months</option>
      <option value="1y">Last Year</option>
    </select>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your business performance and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <TimeRangeSelector />
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
            <Download size={16} />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* View Selector */}
      <ViewSelector />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={metrics.totalRevenue}
          change={12.5}
          icon={DollarSign}
          color="bg-gradient-to-r from-green-500 to-green-600"
          format="currency"
        />
        <MetricCard
          title="Total Sales"
          value={metrics.totalSales}
          change={8.2}
          icon={ShoppingCart}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <MetricCard
          title="Products"
          value={metrics.totalProducts}
          change={-2.1}
          icon={Package}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
        />
        <MetricCard
          title="Avg Order Value"
          value={metrics.avgOrderValue}
          change={15.3}
          icon={Target}
          color="bg-gradient-to-r from-orange-500 to-orange-600"
          format="currency"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            <div className="flex items-center gap-2 text-green-600">
              <TrendingUp size={16} />
              <span className="text-sm font-medium">+12.5%</span>
            </div>
          </div>
          {salesByMonth.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesByMonth}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-sm text-gray-500">
              No sales data yet
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
            <Award className="text-yellow-500" size={20} />
          </div>
          {productPerformance.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productPerformance} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis type="number" stroke="#6b7280" fontSize={12} />
                <YAxis dataKey="name" type="category" width={80} stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="quantity" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-sm text-gray-500">
              No product sales yet
            </div>
          )}
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Category Distribution</h3>
            <Package className="text-indigo-500" size={20} />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Insights</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <TrendingUp size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-medium text-green-900">Revenue Growth</p>
                  <p className="text-sm text-green-700">Compared to last month</p>
                </div>
              </div>
              <span className="text-xl font-bold text-green-600">+12.5%</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Users size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-medium text-blue-900">Customer Retention</p>
                  <p className="text-sm text-blue-700">Returning customers</p>
                </div>
              </div>
              <span className="text-xl font-bold text-blue-600">87%</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Clock size={16} className="text-white" />
                </div>
                <div>
                  <p className="font-medium text-orange-900">Avg Response Time</p>
                  <p className="text-sm text-orange-700">Customer inquiries</p>
                </div>
              </div>
              <span className="text-xl font-bold text-orange-600">2.3h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {sales.slice(0, 5).map((sale) => {
            const product = products.find(p => p.id === sale.productId);
            return (
              <div key={sale.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                    <ShoppingCart size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Sale: {product?.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {sale.qty}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${sale.total.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{new Date(sale.date).toLocaleDateString()}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
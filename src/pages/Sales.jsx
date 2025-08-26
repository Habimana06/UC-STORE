import React, { useState, useMemo } from "react";
import { useData } from "../hooks/useData";
import {
  ShoppingCart, Plus, Search, Calendar, TrendingUp,
  Package, DollarSign, Eye, Edit, Trash2, AlertCircle,
  CheckCircle, Clock, RefreshCw, Download, BarChart3
} from "lucide-react";

export default function Sales() {
  const { products, sales, recordSale } = useData();
  const [productId, setProductId] = useState(products[0]?.id || "");
  const [qty, setQty] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [showForm, setShowForm] = useState(false);
  
  const current = products.find(p => p.id === productId);

  // Calculate metrics
  const metrics = useMemo(() => {
    const today = new Date().toDateString();
    const todaySales = sales.filter(sale => new Date(sale.date).toDateString() === today);
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
    const avgOrderValue = sales.length > 0 ? totalRevenue / sales.length : 0;
    
    return {
      totalSales: sales.length,
      todaySales: todaySales.length,
      totalRevenue,
      avgOrderValue
    };
  }, [sales]);

  // Filter sales based on search and date
  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const product = products.find(p => p.id === sale.productId);
      const matchesSearch = !searchTerm || 
        (product?.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesDate = !selectedDate || 
        new Date(sale.date).toDateString() === new Date(selectedDate).toDateString();
      
      return matchesSearch && matchesDate;
    });
  }, [sales, products, searchTerm, selectedDate]);

  const submit = (e) => {
    e.preventDefault();
    if (!current) return;
    if (qty < 1 || qty > current.stock) {
      alert("Invalid quantity or insufficient stock");
      return;
    }
    
    recordSale({ productId, qty, price: current.price });
    setQty(1);
    setShowForm(false);
  };

  // ✅ Updated MetricCard
  const MetricCard = ({ title, value, color, change, icon: Icon }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {typeof value === 'number' && title.includes('Revenue') ? `$${value.toFixed(2)}` : value}
          </p>
          {change && (
            <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
              <TrendingUp size={14} />
              <span>+{change}% today</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-2xl ${color}`}>
            <Icon size={24} className="text-white" />
          </div>
        )}
      </div>
    </div>
  );

  const getStatusColor = (stock) => {
    if (stock === 0) return "text-red-600 bg-red-50";
    if (stock < 10) return "text-yellow-600 bg-yellow-50";
    return "text-green-600 bg-green-50";
  };

  const getStatusIcon = (stock) => {
    if (stock === 0) return <AlertCircle size={14} />;
    if (stock < 10) return <Clock size={14} />;
    return <CheckCircle size={14} />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingCart className="text-indigo-600" size={28} />
            Sales Management
          </h1>
          <p className="text-gray-600 mt-1">Record and track your sales transactions</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <Download size={16} />
            Export
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <Plus size={16} />
            New Sale
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Sales"
          value={metrics.totalSales}
          icon={ShoppingCart}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          change={8.5}
        />
        <MetricCard
          title="Today's Sales"
          value={metrics.todaySales}
          icon={Calendar}
          color="bg-gradient-to-r from-green-500 to-green-600"
          change={12.3}
        />
        <MetricCard
          title="Total Revenue"
          value={metrics.totalRevenue}
          icon={DollarSign}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
          change={15.2}
        />
        <MetricCard
          title="Avg Order Value"
          value={`$${metrics.avgOrderValue.toFixed(2)}`}
          icon={BarChart3}
          color="bg-gradient-to-r from-orange-500 to-orange-600"
          change={5.7}
        />
      </div>

      {/* Sale Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Record New Sale</h3>
            <button
              onClick={() => setShowForm(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ×
            </button>
          </div>
          
          <form onSubmit={submit} className="grid md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
              <select 
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={productId} 
                onChange={(e) => setProductId(e.target.value)}
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.stock} in stock)
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit Price</label>
              <div className="relative">
                <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pl-10 bg-gray-50 text-gray-600"
                  value={current?.price ?? ""} 
                  readOnly 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <input 
                type="number" 
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={qty} 
                min={1} 
                max={current?.stock ?? 1} 
                onChange={(e) => setQty(Number(e.target.value))}
              />
              {current && (
                <p className="text-xs text-gray-500 mt-1">Max: {current.stock} available</p>
              )}
            </div>
            
            <div className="flex items-end">
              <button className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
                Record Sale
              </button>
            </div>
          </form>
          
          {current && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Amount:</span>
                <span className="text-xl font-bold text-gray-900">
                  ${(current.price * qty).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search sales by product name..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <button 
            onClick={() => {
              setSearchTerm("");
              setSelectedDate("");
            }}
            className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={16} />
            Clear
          </button>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Sales</h3>
            <span className="text-sm text-gray-600">
              {filteredSales.length} of {sales.length} sales
            </span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">Date & Time</th>
                <th className="text-left p-4 font-medium text-gray-600">Product</th>
                <th className="text-center p-4 font-medium text-gray-600">Quantity</th>
                <th className="text-center p-4 font-medium text-gray-600">Unit Price</th>
                <th className="text-right p-4 font-medium text-gray-600">Total</th>
                <th className="text-center p-4 font-medium text-gray-600">Status</th>
                <th className="text-center p-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale, index) => {
                const product = products.find(p => p.id === sale.productId);
                return (
                  <tr key={sale.id} className={`border-t border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {new Date(sale.date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(sale.date).toLocaleTimeString()}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <Package size={16} className="text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {product?.name || 'Unknown Product'}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {sale.productId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {sale.qty}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-medium text-gray-900">
                        ${(sale.total / sale.qty).toFixed(2)}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-lg font-bold text-gray-900">
                        ${sale.total.toFixed(2)}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product?.stock || 0)}`}>
                        {getStatusIcon(product?.stock || 0)}
                        {product?.stock === 0 ? 'Out of Stock' : product?.stock < 10 ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <ShoppingCart size={24} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-900">No sales found</p>
                        <p className="text-gray-500">
                          {searchTerm || selectedDate ? 'Try adjusting your filters' : 'Start by recording your first sale'}
                        </p>
                      </div>
                      {!showForm && (
                        <button
                          onClick={() => setShowForm(true)}
                          className="mt-2 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                        >
                          <Plus size={16} />
                          Record First Sale
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredSales.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {filteredSales.length} sales
              </p>
              <div className="flex items-center gap-2">
                <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-white transition-colors">
                  Previous
                </button>
                <span className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm">1</span>
                <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-white transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

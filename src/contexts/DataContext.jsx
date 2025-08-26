import React, { createContext, useMemo, useState, useCallback, useEffect } from "react";
import axios from 'axios';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [products, setProducts] = useState([
    { 
      id: "P-1001", 
      name: "USB-C Cable", 
      category: "Accessories", 
      supplier: "TechSupply", 
      stock: 120, 
      price: 5.99,
      minStock: 20,
      createdAt: new Date().toISOString()
    },
    { 
      id: "P-1002", 
      name: "Wireless Mouse", 
      category: "Peripherals", 
      supplier: "ClickCo", 
      stock: 48, 
      price: 19.99,
      minStock: 10,
      createdAt: new Date().toISOString()
    },
    { 
      id: "P-1003", 
      name: "Mechanical Keyboard", 
      category: "Peripherals", 
      supplier: "KeyWorks", 
      stock: 22, 
      price: 79.0,
      minStock: 5,
      createdAt: new Date().toISOString()
    },
    { 
      id: "P-1004", 
      name: "27\" Monitor", 
      category: "Displays", 
      supplier: "ViewWorld", 
      stock: 10, 
      price: 199.99,
      minStock: 3,
      createdAt: new Date().toISOString()
    },
  ]);

  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const categories = useMemo(() => ["Accessories", "Peripherals", "Displays", "Storage", "Networking"], []);
  const suppliers = useMemo(() => ["TechSupply", "ClickCo", "KeyWorks", "ViewWorld", "DataFlow"], []);

  const api = axios.create({ baseURL: 'http://localhost:3001/api' });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [p, s, pu] = await Promise.all([
          api.get('/products'),
          api.get('/sales'),
          api.get('/purchases'),
        ]);
        setProducts(p.data || []);
        setSales(s.data || []);
        setPurchases(pu.data || []);
      } catch (e) {
        setError('Failed to load data from server. Working in memory.');
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper function to generate unique IDs
  const generateId = (prefix = "P") => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

  const pushNotification = useCallback((type, message) => {
    setNotifications((prev) => [
      {
        id: generateId("N"),
        type,
        message,
        time: new Date().toLocaleTimeString(),
      },
      ...prev,
    ]);
  }, []);

  // Products CRUD with error handling
  const addProduct = useCallback(async (productData) => {
    try {
      // Try server
      const res = await api.post('/products', productData);
      const newProduct = res.data;
      setProducts((prev) => [...prev, newProduct]);
      pushNotification('success', `Product added: ${newProduct.name}`);
      return { success: true, product: newProduct };
    } catch (e) {
      // Fallback local
      const newProduct = {
        ...productData,
        id: generateId("P"),
        createdAt: new Date().toISOString(),
        minStock: productData.minStock || 10
      };
      setProducts((prev) => [...prev, newProduct]);
      pushNotification('success', `Product added (local): ${newProduct.name}`);
      setError(`Server add failed; saved locally: ${e.message}`);
      return { success: true, product: newProduct };
    }
  }, [api, pushNotification]);

  const updateProduct = useCallback(async (id, data) => {
    try {
      const res = await api.put(`/products/${id}`, data);
      const updated = res.data;
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      return { success: true };
    } catch (e) {
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p)));
      setError(`Server update failed; updated locally: ${e.message}`);
      return { success: true };
    }
  }, [api]);

  const deleteProduct = useCallback(async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      return { success: true };
    } catch (e) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setError(`Server delete failed; removed locally: ${e.message}`);
      return { success: true };
    }
  }, [api]);

  // Enhanced sales recording with validation
  const recordSale = useCallback(async ({ productId, qty, price, customerName = "Walk-in" }) => {
    try {
      const res = await api.post('/sales', { productId, qty, price, customerName });
      const { sale, product } = res.data;
      setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
      setSales((prev) => [...prev, sale]);
      pushNotification('info', `Sale recorded: ${qty} × ${product.name}`);
      return { success: true, sale };
    } catch (e) {
      // Local fallback with validation
      const product = products.find(p => p.id === productId);
      if (!product) return { success: false, error: 'Product not found' };
      if (qty > product.stock) return { success: false, error: `Insufficient stock. Available: ${product.stock}` };
      if (qty <= 0 || price <= 0) return { success: false, error: 'Quantity and price must be positive numbers' };
      setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, stock: Math.max(0, p.stock - qty) } : p)));
      const total = Number((qty * price).toFixed(2));
      const newSale = { id: generateId('S'), productId, qty: Number(qty), price: Number(price), total, customerName, date: new Date().toISOString() };
      setSales((prev) => [...prev, newSale]);
      pushNotification('info', `Sale recorded (local): ${qty} × ${product.name}`);
      setError(`Server sale failed; saved locally: ${e.message}`);
      return { success: true, sale: newSale };
    }
  }, [api, products, pushNotification]);

  // Enhanced purchase recording with validation
  const recordPurchase = useCallback(async ({ productId, qty, cost, supplierName }) => {
    try {
      const res = await api.post('/purchases', { productId, qty, cost, supplierName });
      const { purchase, product } = res.data;
      setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
      setPurchases((prev) => [...prev, purchase]);
      pushNotification('success', `Stock updated: +${qty} for ${product.name}`);
      return { success: true, purchase };
    } catch (e) {
      const product = products.find(p => p.id === productId);
      if (!product) return { success: false, error: 'Product not found' };
      if (qty <= 0 || cost <= 0) return { success: false, error: 'Quantity and cost must be positive numbers' };
      setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, stock: p.stock + Number(qty) } : p)));
      const purchase = { id: generateId('PU'), productId, qty: Number(qty), cost: Number(cost), total: Number((qty * cost).toFixed(2)), supplierName: supplierName || product.supplier, date: new Date().toISOString() };
      setPurchases((prev) => [...prev, purchase]);
      pushNotification('success', `Stock updated (local): +${qty} for ${product.name}`);
      setError(`Server purchase failed; saved locally: ${e.message}`);
      return { success: true, purchase };
    }
  }, [api, products, pushNotification]);

  // Computed values
  const lowStockProducts = useMemo(() => 
    products.filter(p => p.stock <= (p.minStock || 10)), 
    [products]
  );

  const totalInventoryValue = useMemo(() =>
    products.reduce((sum, product) => sum + (product.stock * product.price), 0),
    [products]
  );

  const totalSalesValue = useMemo(() =>
    sales.reduce((sum, sale) => sum + sale.total, 0),
    [sales]
  );

  const totalPurchaseValue = useMemo(() =>
    purchases.reduce((sum, purchase) => sum + purchase.total, 0),
    [purchases]
  );

  // Analytics functions
  const getProductById = useCallback((id) => products.find(p => p.id === id), [products]);
  
  const getProductSales = useCallback((productId) => 
    sales.filter(sale => sale.productId === productId), [sales]);

  const getRecentActivity = useCallback((days = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentSales = sales.filter(sale => new Date(sale.date) > cutoffDate);
    const recentPurchases = purchases.filter(purchase => new Date(purchase.date) > cutoffDate);
    
    return { recentSales, recentPurchases };
  }, [sales, purchases]);

  // Clear error function
  const clearError = useCallback(() => setError(null), []);
  const clearNotifications = useCallback(() => setNotifications([]), []);

  const value = useMemo(
    () => ({
      // Data
      products,
      categories,
      suppliers,
      sales,
      purchases,
      notifications,
      
      // CRUD operations
      addProduct,
      updateProduct,
      deleteProduct,
      recordSale,
      recordPurchase,
      
      // Computed values
      lowStockProducts,
      totalInventoryValue,
      totalSalesValue,
      totalPurchaseValue,
      
      // Utility functions
      getProductById,
      getProductSales,
      getRecentActivity,
      
      // State management
      loading,
      error,
      clearError,
      setLoading,
      clearNotifications,
    }),
                   [
                 products, 
                 sales, 
                 purchases, 
                 notifications,
                 lowStockProducts, 
                 totalInventoryValue, 
                 totalSalesValue, 
                 totalPurchaseValue,
                 loading,
                 error,
                 categories,
                 suppliers,
                 addProduct,
                 updateProduct,
                 deleteProduct,
                 recordSale,
                 recordPurchase,
                 getProductById,
                 getProductSales,
                 getRecentActivity,
                 clearError,
                 clearNotifications
               ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export default DataContext;
import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import { useAuth } from "./hooks/useAuth";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import Purchases from "./pages/Purchases";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
import EmployeeLayout from "./components/EmployeeLayout";
import EmployeeHome from "./pages/EmployeeHome";
import EmployeeSales from "./pages/EmployeeSales";
import EmployeeProducts from "./pages/EmployeeProducts";
import EmployeeProfile from "./pages/EmployeeProfile";
import EmployeeSettings from "./pages/EmployeeSettings";
import AuthForgot from "./pages/AuthForgot";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const router = createBrowserRouter([
    { path: "/login", element: <Login /> },
    { path: "/forgot", element: <AuthForgot /> },
    {
      path: "/",
      element: (
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      ),
      children: [
        { index: true, element: <Dashboard /> },
        { path: "dashboard", element: <Dashboard /> },
        { path: "products", element: <Products /> },
        { path: "sales", element: <Sales /> },
        { path: "purchases", element: <Purchases /> },
        { path: "analytics", element: <Analytics /> },
        { path: "reports", element: <Reports /> },
        { path: "settings", element: <Settings /> },
      ],
    },
    {
      path: "/employee",
      element: (
        <PrivateRoute>
          <EmployeeLayout />
        </PrivateRoute>
      ),
      children: [
        { index: true, element: <EmployeeHome /> },
        { path: "sales", element: <EmployeeSales /> },
        { path: "products", element: <EmployeeProducts /> },
        { path: "analytics", element: <Analytics /> },
        { path: "profile", element: <EmployeeProfile /> },
        { path: "settings", element: <EmployeeSettings /> },
      ],
    },
  ]);
  return (
    <AuthProvider>
      <DataProvider>
        <RouterProvider router={router} future={{ v7_startTransition: true, v7_relativeSplatPath: true }} />
      </DataProvider>
    </AuthProvider>
  );
}

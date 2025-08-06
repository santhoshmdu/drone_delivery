import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store/store';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import SplashScreen from './pages/auth/SplashScreen';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RoleSelection from './pages/auth/RoleSelection';

// Customer Pages
import CustomerDashboard from './pages/customer/Dashboard';
import RestaurantList from './pages/customer/RestaurantList';
import RestaurantDetail from './pages/customer/RestaurantDetail';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import OrderTracking from './pages/customer/OrderTracking';
import OrderHistory from './pages/customer/OrderHistory';
import CustomerProfile from './pages/customer/Profile';

// Seller Pages
import SellerDashboard from './pages/seller/Dashboard';
import MenuManagement from './pages/seller/MenuManagement';
import OrderManagement from './pages/seller/OrderManagement';
import SellerProfile from './pages/seller/Profile';
import Analytics from './pages/seller/Analytics';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import DroneManagement from './pages/admin/DroneManagement';
import FleetMonitoring from './pages/admin/FleetMonitoring';
import UserManagement from './pages/admin/UserManagement';
import SystemAnalytics from './pages/admin/SystemAnalytics';

// Shared Components
import Layout from './components/Layout';
import ChatBot from './components/ChatBot';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<SplashScreen />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/role-selection" element={<RoleSelection />} />

            {/* Customer Routes */}
            <Route path="/customer" element={
              <ProtectedRoute allowedRoles={['customer']}>
                <Layout userType="customer">
                  <CustomerDashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/customer/restaurants" element={
              <ProtectedRoute allowedRoles={['customer']}>
                <Layout userType="customer">
                  <RestaurantList />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/customer/restaurant/:id" element={
              <ProtectedRoute allowedRoles={['customer']}>
                <Layout userType="customer">
                  <RestaurantDetail />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/customer/cart" element={
              <ProtectedRoute allowedRoles={['customer']}>
                <Layout userType="customer">
                  <Cart />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/customer/checkout" element={
              <ProtectedRoute allowedRoles={['customer']}>
                <Layout userType="customer">
                  <Checkout />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/customer/track/:orderId" element={
              <ProtectedRoute allowedRoles={['customer']}>
                <Layout userType="customer">
                  <OrderTracking />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/customer/orders" element={
              <ProtectedRoute allowedRoles={['customer']}>
                <Layout userType="customer">
                  <OrderHistory />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/customer/profile" element={
              <ProtectedRoute allowedRoles={['customer']}>
                <Layout userType="customer">
                  <CustomerProfile />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Seller Routes */}
            <Route path="/seller" element={
              <ProtectedRoute allowedRoles={['seller']}>
                <Layout userType="seller">
                  <SellerDashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/seller/menu" element={
              <ProtectedRoute allowedRoles={['seller']}>
                <Layout userType="seller">
                  <MenuManagement />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/seller/orders" element={
              <ProtectedRoute allowedRoles={['seller']}>
                <Layout userType="seller">
                  <OrderManagement />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/seller/profile" element={
              <ProtectedRoute allowedRoles={['seller']}>
                <Layout userType="seller">
                  <SellerProfile />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/seller/analytics" element={
              <ProtectedRoute allowedRoles={['seller']}>
                <Layout userType="seller">
                  <Analytics />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin', 'drone_operator']}>
                <Layout userType="admin">
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/drones" element={
              <ProtectedRoute allowedRoles={['admin', 'drone_operator']}>
                <Layout userType="admin">
                  <DroneManagement />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/fleet" element={
              <ProtectedRoute allowedRoles={['admin', 'drone_operator']}>
                <Layout userType="admin">
                  <FleetMonitoring />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout userType="admin">
                  <UserManagement />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin/analytics" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Layout userType="admin">
                  <SystemAnalytics />
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>

          {/* Global Components */}
          <ChatBot />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
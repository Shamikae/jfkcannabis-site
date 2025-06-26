import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Components
import AgeVerification from './components/AgeVerification';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/utils/ScrollToTop';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLogin from './components/admin/AdminLogin';
import UnauthorizedPage from './components/admin/UnauthorizedPage';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import SalesPage from './pages/SalesPage';
import Delivery from './pages/Delivery';
import ProductDetail from './pages/ProductDetail';
import BrandsPage from './pages/BrandsPage';
import BrandDetail from './pages/BrandDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CafePage from './pages/CafePage';
import AccountPage from './pages/AccountPage';
import MembershipsPage from './pages/MembershipsPage';
import SubscriptionBox from './components/subscription/SubscriptionBox';
import PreOrderPage from './pages/PreOrderPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  const [isVerified, setIsVerified] = useState(() => {
    return localStorage.getItem('ageVerified') === 'true';
  });

  const location = useLocation();

  useEffect(() => {
    if (isVerified) {
      localStorage.setItem('ageVerified', 'true');
    }
  }, [isVerified]);

  // Reset scroll position on navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Skip age verification for admin routes
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  if (!isVerified && !isAdminRoute) {
    return <AgeVerification onVerify={() => setIsVerified(true)} />;
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/unauthorized" element={<UnauthorizedPage />} />
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="delivery" element={<Delivery />} />
          <Route path="shop" element={<Shop />} />
          <Route path="shop/:category" element={<Shop />} />
          <Route path="shop/:category/:subcategory" element={<Shop />} />
          <Route path="shop/pre-order" element={<PreOrderPage />} />
          <Route path="sale" element={<SalesPage />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="brands" element={<BrandsPage />} />
          <Route path="brands/:brandName" element={<BrandDetail />} />
          <Route path="memberships" element={<MembershipsPage />} />
          <Route path="subscriptions" element={<SubscriptionBox />} />
          <Route path="cafe" element={<CafePage />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="account/*" element={<AccountPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
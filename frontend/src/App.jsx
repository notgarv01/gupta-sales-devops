import { BrowserRouter, Routes, Route } from "react-router-dom";
import IntroGuptaSales from "./components/pages/Intro/IntroGuptaSales";
import Collection from "./components/pages/Intro/Collection";
import Heritage from "./components/pages/Intro/Heritage";
import UserHome from "./components/user/UserHome";
import UserLogin from "./components/auth/UserLogin";
import UserProfile from "./components/user/UserProfile";
import AdminHome from "./components/admin/AdminHome";
import AddProduct from "./components/admin/AddProduct";
import AdminOrders from "./components/admin/AdminOrders";
import AdminCustomers from "./components/admin/AdminCustomers";
import AllProducts from "./components/admin/AllProducts";
import ProtectedRoute from "./components/ProtectedRoute";
import UserCart from "./components/user/UserCart";
import UserCheckout from "./components/user/UserCheckout";
import UserRecentOrders from "./components/user/UserRecentOrders";
import UserAddresses from "./components/user/UserAddresses";
import OrderSuccess from "./components/user/OrderSuccess";
import ComingSoon from "./components/common/ComingSoon";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IntroGuptaSales />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/heritage" element={<Heritage />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/user-home" element={
          <ProtectedRoute requiredRole="user">
            <UserHome />
          </ProtectedRoute>
        } />
        <Route path="/user-profile" element={
          <ProtectedRoute requiredRole="user">
            <UserProfile />
          </ProtectedRoute>
        } />
        <Route path='/user-cart' element={
          <ProtectedRoute requiredRole="user">
            <UserCart />
          </ProtectedRoute>
        } />
        <Route path='/user-checkout' element={
          <ProtectedRoute requiredRole="user">
            <UserCheckout />
          </ProtectedRoute>
        } />
        <Route path='/user-recentOrders' element={
          <ProtectedRoute requiredRole="user">
            <UserRecentOrders />
          </ProtectedRoute>
        } />
        <Route path='/user-addresses' element={
          <ProtectedRoute requiredRole="user">
            <UserAddresses />
          </ProtectedRoute>
        } />
        <Route path='/order-success' element={
          <ProtectedRoute requiredRole="user">
            <OrderSuccess />
          </ProtectedRoute>
        } />
        <Route path="/admin-home" element={
          <ProtectedRoute requiredRole="admin">
            <AdminHome />
          </ProtectedRoute>
        } />
        <Route path="/admin/orders" element={
          <ProtectedRoute requiredRole="admin">
            <AdminOrders />
          </ProtectedRoute>
        } />
        <Route path="/admin/customers" element={
          <ProtectedRoute requiredRole="admin">
            <AdminCustomers />
          </ProtectedRoute>
        } />
        <Route path="/admin/products" element={
          <ProtectedRoute requiredRole="admin">
            <AllProducts />
          </ProtectedRoute>
        } />
        <Route path="/admin/add-product" element={
          <ProtectedRoute requiredRole="admin">
            <AddProduct />
          </ProtectedRoute>
        } />
        
        {/* Coming Soon Pages */}
        <Route path="/wishlist" element={
          <ProtectedRoute requiredRole="user">
            <ComingSoon 
              title="Wishlist" 
              description="Save your favorite heritage pieces and premium blends. This feature is currently in final testing." 
            />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute requiredRole="user">
            <ComingSoon 
              title="Settings" 
              description="Your personalized configuration dashboard is being built with precision." 
            />
          </ProtectedRoute>
        } />
        <Route path="/security" element={
          <ProtectedRoute requiredRole="user">
            <ComingSoon 
              title="Security" 
              description="We are implementing dual-layer protection and advanced encryption for your account safety." 
            />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

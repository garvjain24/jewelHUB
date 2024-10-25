import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, TrendingUp, Gift, LogOut } from 'lucide-react';
import AdminOverview from '../components/admin/AdminOverview';
import AdminProductManagement from '../components/admin/AdminProductManagement';
import AdminOrderManagement from '../components/admin/AdminOrderManagement';
import AdminUserManagement from '../components/admin/AdminUserManagement';
import AdminInvestmentData from '../components/admin/AdminInvestmentData';
import AdminGiftCardManagement from '../components/admin/AdminGiftCardManagement';

const AdminDashboard: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };

  return (
    <div className="flex h-screen bg-royal-light">
      {/* Sidebar */}
      <div className="w-64 bg-royal-footer text-white">
        <div className="p-4">
          <h2 className="text-2xl font-playfair font-bold">Admin Dashboard</h2>
        </div>
        <nav className="mt-8">
          <Link to="/admin" className="flex items-center px-4 py-2 hover:bg-royal-interactive">
            <LayoutDashboard className="mr-2" size={20} />
            Overview
          </Link>
          <Link to="/admin/products" className="flex items-center px-4 py-2 hover:bg-royal-interactive">
            <Package className="mr-2" size={20} />
            Products
          </Link>
          <Link to="/admin/orders" className="flex items-center px-4 py-2 hover:bg-royal-interactive">
            <ShoppingBag className="mr-2" size={20} />
            Orders
          </Link>
          <Link to="/admin/users" className="flex items-center px-4 py-2 hover:bg-royal-interactive">
            <Users className="mr-2" size={20} />
            Users
          </Link>
          <Link to="/admin/investments" className="flex items-center px-4 py-2 hover:bg-royal-interactive">
            <TrendingUp className="mr-2" size={20} />
            Investments
          </Link>
          <Link to="/admin/gift-cards" className="flex items-center px-4 py-2 hover:bg-royal-interactive">
            <Gift className="mr-2" size={20} />
            Gift Cards
          </Link>
        </nav>
        <div className="absolute bottom-4 left-4">
          <button onClick={handleLogout} className="flex items-center text-white hover:text-royal-accent-diamond">
            <LogOut className="mr-2" size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/products" element={<AdminProductManagement />} />
            <Route path="/orders" element={<AdminOrderManagement />} />
            <Route path="/users" element={<AdminUserManagement />} />
            <Route path="/investments" element={<AdminInvestmentData />} />
            <Route path="/gift-cards" element={<AdminGiftCardManagement />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
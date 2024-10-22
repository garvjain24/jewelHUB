import React, { useState, useEffect } from 'react';
import { User, Package, CreditCard, Settings } from 'lucide-react';
import api from '../api';

const AccountPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userProfile, setUserProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [investments, setInvestments] = useState(null);

  useEffect(() => {
    fetchUserProfile();
    fetchOrders();
    fetchInvestments();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.user.getProfile();
      setUserProfile(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };
  

  const fetchOrders = async () => {
    try {
      const response = await api.user.getOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchInvestments = async () => {
    try {
      const response = await api.user.getInvestments();
      setInvestments(response.data);
    } catch (error) {
      console.error('Error fetching investments:', error);
    }
  };

  // ... rest of the component remains the same, but use the fetched data in the respective tabs
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return userProfile ? <ProfileTab  prof={userProfile} /> : <div>Loading...</div>;
      case 'orders':
        return <OrdersTab />;
      case 'investment':
        return <InvestmentTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-playfair text-4xl font-bold mb-8 text-royal-header">My Account</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <div className="bg-royal-accent rounded-lg p-4">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center w-full py-2 px-4 rounded-md ${activeTab === 'profile' ? 'bg-royal-interactive text-white' : 'hover:bg-royal-highlight'}`}
            >
              <User size={20} className="mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center w-full py-2 px-4 rounded-md ${activeTab === 'orders' ? 'bg-royal-interactive text-white' : 'hover:bg-royal-highlight'}`}
            >
              <Package size={20} className="mr-2" />
              Orders
            </button>
            <button
              onClick={() => setActiveTab('investment')}
              className={`flex items-center w-full py-2 px-4 rounded-md ${activeTab === 'investment' ? 'bg-royal-interactive text-white' : 'hover:bg-royal-highlight'}`}
            >
              <CreditCard size={20} className="mr-2" />
              Investment
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center w-full py-2 px-4 rounded-md ${activeTab === 'settings' ? 'bg-royal-interactive text-white' : 'hover:bg-royal-highlight'}`}
            >
              <Settings size={20} className="mr-2" />
              Settings
            </button>
          </div>
        </div>
        <div className="md:w-3/4">
          <div className="bg-white rounded-lg p-6 shadow-md">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProfileTabProps {
  
  prof: {
    name: string;
    phone: string;
    email:string;
    address:string;
    // Add other properties as needed
  };
}

const ProfileTab: React.FC<ProfileTabProps> = ({ prof }) => (
  <div>
    <h2 className="font-playfair text-2xl font-bold mb-4 text-royal-header">Profile Information</h2>
    <form>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-royal-dark mb-1">First Name</label>
          <p className="w-full px-3 py-2 border border-royal-highlight rounded-md focus:outline-none focus:ring-2 focus:ring-royal-accent-diamond">
            {prof.name}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-royal-dark mb-1">Last Name</label>
          <input type="text" className="w-full px-3 py-2 border border-royal-highlight rounded-md focus:outline-none focus:ring-2 focus:ring-royal-accent-diamond" />
        </div>
        <div>
          <label className="block text-sm font-medium text-royal-dark mb-1">Email</label>
          <p className="w-full px-3 py-2 border border-royal-highlight rounded-md focus:outline-none focus:ring-2 focus:ring-royal-accent-diamond">
            {prof.email}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-royal-dark mb-1">Phone</label>
          <p className="w-full px-3 py-2 border border-royal-highlight rounded-md focus:outline-none focus:ring-2 focus:ring-royal-accent-diamond">
            {prof.phone}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-royal-dark mb-1">Address</label>
        <p className="w-full px-3 py-2 border border-royal-highlight rounded-md focus:outline-none focus:ring-2 focus:ring-royal-accent-diamond">
            {prof.address}
          </p>
      </div>
      <button type="submit" className="mt-4 bg-royal-interactive text-white px-6 py-2 rounded-full font-semibold hover:bg-royal-accent-diamond transition-colors">
        Save Changes
      </button>
    </form>
  </div>
);

const OrdersTab: React.FC = () => (
  <div>
    <h2 className="font-playfair text-2xl font-bold mb-4 text-royal-header">Order History</h2>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-royal-highlight">
            <th className="px-4 py-2 text-left">Order ID</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Total</th>
            <th className="px-4 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border-t px-4 py-2">#12345</td>
            <td className="border-t px-4 py-2">2023-05-15</td>
            <td className="border-t px-4 py-2">₹3,499</td>
            <td className="border-t px-4 py-2">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">Delivered</span>
            </td>
          </tr>
          <tr>
            <td className="border-t px-4 py-2">#12346</td>
            <td className="border-t px-4 py-2">2023-05-10</td>
            <td className="border-t px-4 py-2">₹2,199</td>
            <td className="border-t px-4 py-2">
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">Processing</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const InvestmentTab: React.FC = () => (
  <div>
    <h2 className="font-playfair text-2xl font-bold mb-4 text-royal-header">Investment Portfolio</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="bg-royal-accent rounded-lg p-4">
        <h3 className="font-semibold text-lg mb-2">Digital Gold</h3>
        <p className="text-2xl font-bold text-royal-interactive">10.5 grams</p>
        <p className="text-sm text-royal-dark">Current Value: ₹52,500</p>
      </div>
      <div className="bg-royal-accent rounded-lg p-4">
        <h3 className="font-semibold text-lg mb-2">Digital Silver</h3>
        <p className="text-2xl font-bold text-royal-interactive">500 grams</p>
        <p className="text-sm text-royal-dark">Current Value: ₹35,000</p>
      </div>
    </div>
    <h3 className="font-semibold text-lg mb-2">Transaction History</h3>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-royal-highlight">
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Type</th>
            <th className="px-4 py-2 text-left">Amount</th>
            <th className="px-4 py-2 text-left">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border-t px-4 py-2">2023-05-15</td>
            <td className="border-t px-4 py-2">Buy Gold</td>
            <td className="border-t px-4 py-2">5 grams</td>
            <td className="border-t px-4 py-2">₹25,000</td>
          </tr>
          <tr>
            <td className="border-t px-4 py-2">2023-05-10</td>
            <td className="border-t px-4 py-2">Buy Silver</td>
            <td className="border-t px-4 py-2">250 grams</td>
            <td className="border-t px-4 py-2">₹17,500</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const SettingsTab: React.FC = () => (
  <div>
    <h2 className="font-playfair text-2xl font-bold mb-4 text-royal-header">Account Settings</h2>
    <form>
      <div className="mb-4">
        <label className="block text-sm font-medium text-royal-dark mb-1">Change Password</label>
        <input type="password" placeholder="Current Password" className="w-full px-3 py-2 border border-royal-highlight rounded-md focus:outline-none focus:ring-2 focus:ring-royal-accent-diamond mb-2" />
        <input type="password" placeholder="New Password" className="w-full px-3 py-2 border border-royal-highlight rounded-md focus:outline-none focus:ring-2 focus:ring-royal-accent-diamond mb-2" />
        <input type="password" placeholder="Confirm New Password" className="w-full px-3 py-2 border border-royal-highlight rounded-md focus:outline-none focus:ring-2 focus:ring-royal-accent-diamond" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-royal-dark mb-1">Notification Preferences</label>
        <div className="flex items-center mb-2">
          <input type="checkbox" id="emailNotif" className="mr-2" />
          <label htmlFor="emailNotif">Receive email notifications</label>
        </div>
        <div className="flex items-center">
          <input type="checkbox" id="smsNotif" className="mr-2" />
          <label htmlFor="smsNotif">Receive SMS notifications</label>
        </div>
      </div>
      <button type="submit" className="bg-royal-interactive text-white px-6 py-2 rounded-full font-semibold hover:bg-royal-accent-diamond transition-colors">
        Save Settings
      </button>
    </form>
  </div>
);

export default AccountPage;
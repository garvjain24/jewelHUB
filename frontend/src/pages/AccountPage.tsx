import React, { useState, useEffect } from 'react';
import { User, Package, CreditCard, Settings } from 'lucide-react';
import api from '../api';


const AccountPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userProfile, setUserProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [investments, setInvestments] = useState<Investment[]>([]);

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
      const ordersWithDates = response.data.map((order: { _id: any; createdAt: string | number | Date; }) => ({
        ...order,
        id: order._id,
        createdAt: new Date(order.createdAt)
      }));
      setOrders(ordersWithDates);
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return userProfile ? <ProfileTab prof={userProfile} /> : <div>Loading...</div>;
      case 'orders':
        return <OrdersTab orders={orders} />;
      case 'investment':
        return userProfile ? <InvestmentTab userId={investments} /> : <div>Loading...</div>;
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
    email: string;
    address: string;
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

interface OrderTabProps {
  orders: {
    id: string;
    totalValue: string;
    status: string;
    createdAt: Date;
  }[];
}

const OrdersTab: React.FC<OrderTabProps> = ({ orders }) => (
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
          {orders.map(order => (
            <tr key={order.id}>
              <td className="border-t px-4 py-2">{order.id}</td>
              <td className="border-t px-4 py-2">{order.createdAt.toLocaleDateString()}</td>
              <td className="border-t px-4 py-2">{order.totalValue}</td>
              <td className="border-t px-4 py-2">
                <span className={`px-2 py-1 rounded-full text-sm ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

interface Investment {
  _id: string;
  type: string;
  amount: number;
  price: number;
  createdAt: string;
}

const InvestmentTab: React.FC<{ userId: string }> = ({ userId }) => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [goldBalance, setGoldBalance] = useState<number>(0);
  const [silverBalance, setSilverBalance] = useState<number>(0);

  useEffect(() => {
    if (userId) {
      fetchInvestments();
    }
  }, [userId]);

  const fetchInvestments = async () => {
    try {
      const response = await api.user.getInvestments(userId);
      // Ensure response.data is an object
      if (response.data && typeof response.data === 'object') {
        setGoldBalance(response.data.goldBalance);
        setSilverBalance(response.data.silverBalance);
        // Check if transactions is an array before setting
        if (Array.isArray(response.data.transactions)) {
          setInvestments(response.data.transactions);
        } else {
          console.error('Expected transactions to be an array, but received:', response.data.transactions);
          setInvestments([]); // Set to empty array if data is not in expected format
        }
      } else {
        console.error('Expected an object, but received:', response.data);
        setInvestments([]); // Set to empty array if data is not in expected format
      }
    } catch (error) {
      console.error('Error fetching investments:', error);
      setInvestments([]); // Optionally set to empty array on error
    }
  };

  return (
    <div>
      <h2 className="font-playfair text-2xl font-bold mb-4 text-royal-header">Investment History</h2>
      {/* Display Gold and Silver Balances */}
      <div className="mb-4">
        <div>Gold Balance: {goldBalance.toFixed(3)}</div>
        <div>Silver Balance: {silverBalance.toFixed(3)}</div>
        <div>Total amount: {(parseFloat(goldBalance.toFixed(3)) * 5300) + (parseFloat(silverBalance.toFixed(3))*300)}</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-royal-highlight">
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Rate</th> {/* New Rate Column */}
              <th className="px-4 py-2 text-left">Price</th>
            </tr>
          </thead>
          <tbody>
            {investments.map(investment => {
              const rate = investment.amount > 0 ? (investment.price / investment.amount).toFixed(2) : ((investment.price / investment.amount)).toFixed(2); // Calculate Rate
              const price = investment.amount > 0 ? (investment.price) : ((investment.price * -1)); // Calculate Price
              return (
                <tr key={investment._id}>
                  <td className="border-t px-4 py-2">{new Date(investment.createdAt).toLocaleDateString()}</td>
                  <td className="border-t px-4 py-2">{investment.type}</td>
                  <td className="border-t px-4 py-2">{investment.amount}</td>
                  <td className="border-t px-4 py-2">{rate}</td> {/* Display Rate */}
                  <td className="border-t px-4 py-2">{price}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};


const SettingsTab: React.FC = () => (
  <div>
    <h2 className="font-playfair text-2xl font-bold mb-4 text-royal-header">Account Settings</h2>
    {/* Add your settings form here */}
  </div>
);

export default AccountPage;

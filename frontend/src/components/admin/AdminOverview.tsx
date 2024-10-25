import React, { useState, useEffect } from 'react';
import { Eye, Ban } from 'lucide-react';
import api from '../../api';

interface Order {
  _id: string;
  totalValue: number;
  status: string;
}

interface Investment {
  _id: string;
  type: string;
  amount: number;
  value: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalInvestment: number;
  orders: Order[];
  investments: Investment[];
}

const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.admin.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleViewUser = async (userId: string) => {
    try {
      const response = await api.admin.getUserDetails(userId);
      setSelectedUser(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleBanUser = async (userId: string) => {
    try {
      await api.admin.banUser(userId);
      fetchUsers();
      setSelectedUser(null);
    } catch (error) {
      console.error('Error banning user:', error);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-playfair font-bold mb-6 text-royal-header">User Management</h2>
      
      {/* User List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-royal-highlight">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Total Investment</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.phone}</td>
                <td className="px-4 py-2">₹{user.totalInvestment}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleViewUser(user._id)}
                    className="text-royal-interactive hover:text-royal-accent-diamond mr-2"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => handleBanUser(user._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Ban size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <h3 className="text-xl font-semibold mb-4 text-royal-header">User Details</h3>
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Phone:</strong> {selectedUser.phone}</p>
            <p><strong>Address:</strong> {selectedUser.address}</p>
            <p><strong>Total Investment:</strong> ₹{selectedUser.totalInvestment}</p>
            
            <h4 className="font-semibold mt-4 mb-2">Order History:</h4>
            <ul>
              {selectedUser.orders.map((order) => (
                <li key={order._id}>
                  Order ID: {order._id} - Total: ₹{order.totalValue} - Status: {order.status}
                </li>
              ))}
            </ul>

            <h4 className="font-semibold mt-4 mb-2">Investment History:</h4>
            <ul>
              {selectedUser.investments.map((investment) => (
                <li key={investment._id}>
                  {investment.type}: {investment.amount}g - Value: ₹{investment.value}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setSelectedUser(null)}
                className="text-royal-interactive hover:text-royal-accent-diamond"
              >
                Close
              </button>
              <button
                onClick={() => handleBanUser(selectedUser._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                Ban User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
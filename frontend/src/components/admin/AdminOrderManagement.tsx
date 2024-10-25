import React, { useState, useEffect } from 'react';
import { Eye, TrendingUp } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import api from '../../api';

interface Order {
  _id: string;
  user: {
    name: string;
  };
  createdAt: string;
  totalValue: number;
  status: string;
  items: OrderItem[];
}

interface OrderItem {
  _id: string;
  product: {
    name: string;
    price: number;
  };
  quantity: number;
}

interface SalesData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

const AdminOrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [salesData, setSalesData] = useState<SalesData>({
    labels: [],
    datasets: [
      {
        label: 'Total Sales',
        data: [],
        borderColor: 'rgb(156, 39, 176)',
        backgroundColor: 'rgba(156, 39, 176, 0.5)',
      },
    ],
  });

  useEffect(() => {
    fetchOrders();
    fetchSalesData();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.admin.getAllOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchSalesData = async () => {
    try {
      const response = await api.admin.getSalesData();
      setSalesData({
        labels: response.data.map((item: any) => item.date),
        datasets: [
          {
            label: 'Total Sales',
            data: response.data.map((item: any) => item.totalSales),
            borderColor: 'rgb(156, 39, 176)',
            backgroundColor: 'rgba(156, 39, 176, 0.5)',
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.admin.updateOrderStatus(orderId, newStatus);
      fetchOrders();
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-playfair font-bold mb-6 text-royal-header">Order Management</h2>
      
      {/* Sales Graph */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4 text-royal-header">Sales Overview</h3>
        <Line data={salesData} />
      </div>

      {/* Order List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-royal-highlight">
            <tr>
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Total Value</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t">
                <td className="px-4 py-2">{order._id}</td>
                <td className="px-4 py-2">{order.user.name}</td>
                <td className="px-4 py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2">₹{order.totalValue}</td>
                <td className="px-4 py-2">{order.status}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleViewOrder(order)}
                    className="text-royal-interactive hover:text-royal-accent-diamond"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <h3 className="text-xl font-semibold mb-4 text-royal-header">Order Details</h3>
            <p><strong>Order ID:</strong> {selectedOrder._id}</p>
            <p><strong>User:</strong> {selectedOrder.user.name}</p>
            <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
            <p><strong>Total Value:</strong> ₹{selectedOrder.totalValue}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <h4 className="font-semibold mt-4 mb-2">Items:</h4>
            <ul>
              {selectedOrder.items.map((item) => (
                <li key={item._id}>
                  {item.product.name} - Quantity: {item.quantity} - Price: ₹{item.product.price}
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Update Status:</h4>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleUpdateStatus(selectedOrder._id, 'Processing')}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition-colors"
                >
                  Processing
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder._id, 'Shipped')}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Shipped
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder._id, 'Delivered')}
                  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors"
                >
                  Delivered
                </button>
              </div>
            </div>
            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-6 text-royal-interactive hover:text-royal-accent-diamond"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderManagement;
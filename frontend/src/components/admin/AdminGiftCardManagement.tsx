import React, { useState, useEffect } from 'react';
import { Copy } from 'lucide-react';
import { Pie } from 'react-chartjs-2';
import api from '../../api';

interface GiftCard {
  _id: string;
  code: string;
  amount: number;
  isRedeemed: boolean;
  createdAt: string;
}

interface GiftCardStats {
  totalIssued: number;
  totalRedeemed: number;
  totalValue: number;
}

const AdminGiftCardManagement: React.FC = () => {
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [newGiftCardAmount, setNewGiftCardAmount] = useState<string>('');
  const [giftCardStats, setGiftCardStats] = useState<GiftCardStats>({
    totalIssued: 0,
    totalRedeemed: 0,
    totalValue: 0,
  });

  useEffect(() => {
    fetchGiftCards();
    fetchGiftCardStats();
  }, []);

  const fetchGiftCards = async () => {
    try {
      const response = await api.admin.getAllGiftCards();
      setGiftCards(response.data);
    } catch (error) {
      console.error('Error fetching gift cards:', error);
    }
  };

  const fetchGiftCardStats = async () => {
    try {
      const response = await api.admin.getGiftCardStats();
      setGiftCardStats(response.data);
    } catch (error) {
      console.error('Error fetching gift card stats:', error);
    }
  };

  const handleGenerateGiftCard = async () => {
    try {
      const amount = parseFloat(newGiftCardAmount);
      if (amount < 5000 || amount > 99999) {
        alert('Gift card amount must be between ₹5,000 and ₹99,999');
        return;
      }
      await api.admin.generateGiftCard(amount);
      setNewGiftCardAmount('');
      fetchGiftCards();
      fetchGiftCardStats();
    } catch (error) {
      console.error('Error generating gift card:', error);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    // Show a toast or some feedback here
  };

  const giftCardUsageData = {
    labels: ['Redeemed', 'Unredeemed'],
    datasets: [
      {
        data: [giftCardStats.totalRedeemed, giftCardStats.totalIssued - giftCardStats.totalRedeemed],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 206, 86, 0.6)'],
      },
    ],
  };

  return (
    <div>
      <h2 className="text-3xl font-playfair font-bold mb-6 text-royal-header">Gift Card Management</h2>
      
      {/* Generate Gift Card */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4 text-royal-header">Generate Gift Card</h3>
        <div className="flex space-x-4">
          <input
            type="number"
            value={newGiftCardAmount}
            onChange={(e) => setNewGiftCardAmount(e.target.value)}
            className="w-full px-3 py-2 border border-royal-highlight rounded-md"
            placeholder="Amount (₹5,000 - ₹99,999)"
          />
          <button
            onClick={handleGenerateGiftCard}
            className="bg-royal-interactive text-white px-4 py-2 rounded-md hover:bg-royal-accent-diamond transition-colors"
          >
            Generate
          </button>
        </div>
      </div>

      {/* Gift Card Usage Stats */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4 text-royal-header">Gift Card Usage</h3>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p><strong>Total Issued:</strong> {giftCardStats.totalIssued}</p>
            <p><strong>Total Redeemed:</strong> {giftCardStats.totalRedeemed}</p>
            <p><strong>Total Value:</strong> ₹{giftCardStats.totalValue}</p>
          </div>
          <div className="w-48 h-48">
            <Pie data={giftCardUsageData} />
          </div>
        </div>
      </div>

      {/* Gift Card List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-royal-highlight">
            <tr>
              <th className="px-4 py-2 text-left">Code</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Created At</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {giftCards.map((giftCard) => (
              <tr key={giftCard._id} className="border-t">
                <td className="px-4 py-2">{giftCard.code}</td>
                <td className="px-4 py-2">₹{giftCard.amount}</td>
                <td className="px-4 py-2">
                  {giftCard.isRedeemed ? (
                    <span className="text-green-500">Redeemed</span>
                  ) : (
                    <span className="text-yellow-500">Unredeemed</span>
                  )}
                </td>
                <td className="px-4 py-2">{new Date(giftCard.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleCopyCode(giftCard.code)}
                    className="text-royal-interactive hover:text-royal-accent-diamond"
                  >
                    <Copy size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminGiftCardManagement;
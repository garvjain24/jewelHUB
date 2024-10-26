import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import api from '../api';

const InvestmentPage: React.FC = () => {
  const [rates, setRates] = useState({ goldRate: 0, silverRate: 0 });
  const [investmentType, setInvestmentType] = useState('Gold');
  const [amount, setAmount] = useState('');
  const [goldBalance, setGoldBalance] = useState(0);
  const [silverBalance, setSilverBalance] = useState(0);

  useEffect(() => {
    fetchRates();
    fetchBalances();
  }, []);

  const fetchRates = async () => {
    try {
      const response = await api.investment.getRates();
      setRates(response.data);
    } catch (error) {
      console.error('Error fetching rates:', error);
    }
  };

  const fetchBalances = async () => {
    try {
      const response = await api.investment.getBalances();
      setGoldBalance(response.data.goldBalance || 0);
      setSilverBalance(response.data.silverBalance || 0);
    } catch (error) {
      console.error('Error fetching balances:', error);
    }
  };

  const handleAction = async (action: 'buy' | 'sell', e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (action === 'buy') {
        await api.investment.buy({ type: investmentType, amount: parseFloat(amount) });
      } else {
        await api.investment.sell({ type: investmentType, amount: parseFloat(amount) });
      }
      setAmount('');
      fetchBalances(); // Refresh balances after action
    } catch (error) {
      console.error(`Error ${action === 'buy' ? 'investing' : 'selling'}:`, error);
    }
  };

  const totalGoldValue = goldBalance * rates.goldRate;
  const totalSilverValue = silverBalance * rates.silverRate;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-playfair text-4xl font-bold mb-8 text-royal-header">Digital Metal Investment</h1>

      {/* Balance Display Section */}
      <div className="bg-royal-highlight rounded-lg p-6 mb-8 shadow-md">
        <h2 className="font-playfair text-2xl font-bold mb-4 text-royal-header">Your Balances</h2>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-lg font-semibold">Gold Balance:</p>
            <p className="text-2xl font-bold text-royal-interactive">{goldBalance.toFixed(3)} g</p>
            <p className="text-lg font-semibold">Total Value: ₹{totalGoldValue.toFixed(2)}</p>
          </div>
          <TrendingUp className="text-green-500" size={24} />
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg font-semibold">Silver Balance:</p>
            <p className="text-2xl font-bold text-royal-interactive">{silverBalance.toFixed(3)} g</p>
            <p className="text-lg font-semibold">Total Value: ₹{totalSilverValue.toFixed(2)}</p>
          </div>
          <TrendingDown className="text-red-500" size={24} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Current Rates */}
        <div className="bg-royal-accent rounded-lg p-6 shadow-md">
          <h2 className="font-playfair text-2xl font-bold mb-4 text-royal-header">Current Rates</h2>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-lg font-semibold">Gold</p>
              <p className="text-2xl font-bold text-royal-interactive">₹{rates.goldRate}/g</p>
            </div>
            <TrendingUp className="text-green-500" size={24} />
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">Silver</p>
              <p className="text-2xl font-bold text-royal-interactive">₹{rates.silverRate}/g</p>
            </div>
            <TrendingDown className="text-red-500" size={24} />
          </div>
        </div>

        {/* Investment Form */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="font-playfair text-2xl font-bold mb-4 text-royal-header">Invest / Sell</h2>
          <form onSubmit={(e) => handleAction('buy', e)}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-royal-dark mb-1">Select Metal</label>
              <select
                className="w-full px-3 py-2 border border-royal-highlight rounded-md focus:outline-none focus:ring-2 focus:ring-royal-accent-diamond"
                value={investmentType}
                onChange={(e) => setInvestmentType(e.target.value)}
              >
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-royal-dark mb-1">Amount (in grams)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-royal-highlight rounded-md focus:outline-none focus:ring-2 focus:ring-royal-accent-diamond"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0.1"
                step="0.1"
                required
              />
            </div>
            <div className="mb-4">
              <p className="text-lg font-semibold">
                Total Cost: ₹{(parseFloat(amount) * (investmentType === 'Gold' ? rates.goldRate : rates.silverRate)).toFixed(2)}
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-royal-interactive text-white py-3 rounded-full font-semibold hover:bg-royal-accent-diamond transition-colors"
              >
                Invest Now
              </button>
              <button
                type="button"
                className="flex-1 bg-royal-interactive text-white py-3 rounded-full font-semibold hover:bg-royal-accent-diamond transition-colors"
                onClick={(e) => handleAction('sell', e)}
                disabled={(investmentType === 'Gold' && goldBalance < parseFloat(amount)) || (investmentType === 'Silver' && silverBalance < parseFloat(amount))}
              >
                Sell Now
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Investment Benefits */}
      <div className="mt-12">
        <h2 className="font-playfair text-3xl font-bold mb-6 text-royal-header">Why Invest in Digital Metals?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-royal-highlight rounded-lg p-6">
            <h3 className="font-playfair text-xl font-bold mb-2 text-royal-header">Security</h3>
            <p>Your digital metal investments are securely stored and insured.</p>
          </div>
          <div className="bg-royal-highlight rounded-lg p-6">
            <h3 className="font-playfair text-xl font-bold mb-2 text-royal-header">Flexibility</h3>
            <p>Buy, sell, or redeem your digital metals at any time with ease.</p>
          </div>
          <div className="bg-royal-highlight rounded-lg p-6">
            <h3 className="font-playfair text-xl font-bold mb-2 text-royal-header">Growth</h3>
            <p>Potential for long-term growth and hedge against inflation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentPage;
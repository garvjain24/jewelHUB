import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import api from '../../api';

Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

interface InvestmentTrend {
  date: string;
  goldAmount: number;
  silverAmount: number;
}

const AdminInvestmentData: React.FC = () => {
  const [investmentData, setInvestmentData] = useState({
    totalGoldBought: 0,
    totalSilverBought: 0,
    totalGoldSold: 0,
    totalSilverSold: 0,
    goldRate: 0,
    silverRate: 0,
    investmentTrends: [] as InvestmentTrend[],
  });

  const [newRates, setNewRates] = useState({
    goldRate: 0,
    silverRate: 0,
  });

  useEffect(() => {
    fetchInvestmentData();
  }, []);

  const fetchInvestmentData = async () => {
    try {
      const response = await api.admin.getInvestmentData();
      setInvestmentData(response.data);
      setNewRates({
        goldRate: response.data.goldRate,
        silverRate: response.data.silverRate,
      });
    } catch (error) {
      console.error('Error fetching investment data:', error);
    }
  };

  const handleUpdateRates = async () => {
    try {
      await api.admin.updateGoldSilverRates(newRates);
      fetchInvestmentData();
    } catch (error) {
      console.error('Error updating rates:', error);
    }
  };

  const goldVsSilverData = {
    labels: ['Gold', 'Silver'],
    datasets: [
      {
        label: 'Bought',
        data: [investmentData.totalGoldBought, investmentData.totalSilverBought],
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
      },
      {
        label: 'Sold',
        data: [investmentData.totalGoldSold, investmentData.totalSilverSold],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const investmentTrendsData = {
    labels: investmentData.investmentTrends.map((trend) => trend.date),
    datasets: [
      {
        label: 'Gold Investments',
        data: investmentData.investmentTrends.map((trend) => trend.goldAmount),
        borderColor: 'rgb(255, 206, 86)',
        backgroundColor: 'rgba(255, 206, 86, 0.5)',
      },
      {
        label: 'Silver Investments',
        data: investmentData.investmentTrends.map((trend) => trend.silverAmount),
        borderColor: 'rgb(192, 192, 192)',
        backgroundColor: 'rgba(192, 192, 192, 0.5)',
      },
    ],
  };

  return (
    <div>
      <h2 className="text-3xl font-playfair font-bold mb-6 text-royal-header">Investment Data</h2>
      
      {/* Current Rates and Update Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4 text-royal-header">Current Rates</h3>
        <div className="flex justify-between items-center mb-4">
          <p><strong>Gold Rate:</strong> ₹{investmentData.goldRate}/g</p>
          <p><strong>Silver Rate:</strong> ₹{investmentData.silverRate}/g</p>
        </div>
        <h4 className="font-semibold mb-2">Update Rates:</h4>
        <div className="flex space-x-4">
          <input
            type="number"
            value={newRates.goldRate}
            onChange={(e) => setNewRates({ ...newRates, goldRate: parseFloat(e.target.value) })}
            className="w-full px-3 py-2 border border-royal-highlight rounded-md"
            placeholder="New Gold Rate"
          />
          <input
            type="number"
            value={newRates.silverRate}
            onChange={(e) => setNewRates({ ...newRates, silverRate: parseFloat(e.target.value) })}
            className="w-full px-3 py-2 border border-royal-highlight rounded-md"
            placeholder="New Silver Rate"
          />
          <button
            onClick={handleUpdateRates}
            className="bg-royal-interactive text-white px-4 py-2 rounded-md hover:bg-royal-accent-diamond transition-colors"
          >
            Update Rates
          </button>
        </div>
      </div>

      {/* Gold vs Silver Investments */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4 text-royal-header">Gold vs Silver Investments</h3>
        <Bar data={goldVsSilverData} />
      </div>

      {/* Investment Trends */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-royal-header">Investment Trends</h3>
        <Line data={investmentTrendsData} />
      </div>
    </div>
  );
};

export default AdminInvestmentData;
import React, { useState } from 'react';
import { Gift, Copy, Mail } from 'lucide-react';
import api from '../api';

const GiftCardPage: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [giftCardCode, setGiftCardCode] = useState('');

  const handleGenerateGiftCard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.giftCard.generate({ 
        amount: parseFloat(amount), 
        recipientEmail 
      });
      
      // Redirect to Stripe Checkout
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error generating gift card:', error);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(giftCardCode);
    // Show a toast or some feedback here
  };

  const handleSendEmail = async () => {
    try {
      await api.giftCard.sendEmail({ code: giftCardCode, recipientEmail });
      // Show success message
    } catch (error) {
      console.error('Error sending gift card:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-playfair text-4xl font-bold mb-8 text-royal-header">Gift Cards</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Gift Card Generator */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="font-playfair text-2xl font-bold mb-4 text-royal-header">Generate a Gift Card</h2>
          <form onSubmit={handleGenerateGiftCard}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-royal-dark mb-1">Amount (₹5,000 - ₹99,999)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-royal-highlight rounded-md focus:outline-none focus:ring-2 focus:ring-royal-accent-diamond"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="5000"
                max="99999"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-royal-dark mb-1">Recipient's Email (optional)</label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-royal-highlight rounded-md focus:outline-none focus:ring-2 focus:ring-royal-accent-diamond"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-royal-interactive text-white py-3 rounded-full font-semibold hover:bg-royal-accent-diamond transition-colors"
            >
              Generate Gift Card
            </button>
          </form>
        </div>

        {/* Gift Card Display */}
        {giftCardCode && (
          <div className="bg-royal-accent rounded-lg p-6 shadow-md">
            <h2 className="font-playfair text-2xl font-bold mb-4 text-royal-header">Your Gift Card</h2>
            <div className="bg-white rounded-lg p-6 mb-4 text-center">
              <Gift size={48} className="mx-auto mb-4 text-royal-interactive" />
              <p className="text-2xl font-bold text-royal-header mb-2">₹{amount}</p>
              <p className="text-lg font-semibold text-royal-interactive">{giftCardCode}</p>
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleCopyCode}
                className="flex items-center px-4 py-2 bg-royal-button text-royal-dark rounded-full hover:bg-royal-interactive hover:text-white transition-colors"
              >
                <Copy size={20} className="mr-2" />
                Copy Code
              </button>
              <button
                onClick={handleSendEmail}
                className="flex items-center px-4 py-2 bg-royal-button text-royal-dark rounded-full hover:bg-royal-interactive hover:text-white transition-colors"
              >
                <Mail size={20} className="mr-2" />
                Send Email
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Gift Card Information */}
      <div className="mt-12">
        <h2 className="font-playfair text-3xl font-bold mb-6 text-royal-header">Gift Card Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-royal-highlight rounded-lg p-6">
            <h3 className="font-playfair text-xl font-bold mb-2 text-royal-header">How to Use</h3>
            <p>Enter the gift card code during checkout to apply it to your purchase.</p>
          </div>
          <div className="bg-royal-highlight rounded-lg p-6">
            <h3 className="font-playfair text-xl font-bold mb-2 text-royal-header">Validity</h3>
            <p>Gift cards are valid for 1 year from the date of purchase.</p>
          </div>
          <div className="bg-royal-highlight rounded-lg p-6">
            <h3 className="font-playfair text-xl font-bold mb-2 text-royal-header">Terms & Conditions</h3>
            <p>Gift cards cannot be redeemed for cash and are non-refundable.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftCardPage;
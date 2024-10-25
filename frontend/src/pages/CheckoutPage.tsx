import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import api from '../api';

const CheckoutPage: React.FC = () => {
  const [status, setStatus] = useState<'success' | 'failure' | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get('session_id');

    if (sessionId) {
      // Verify payment status with backend
      api.payment.verifyPayment(sessionId)
        .then(() => setStatus('success'))
        .catch(() => setStatus('failure'));
    }
  }, [location]);

  const handleContinueShopping = () => {
    navigate('/shop');
  };

  const handleViewOrders = () => {
    navigate('/account');
  };

  if (!status) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-royal-light flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        {status === 'success' ? (
          <>
            <CheckCircle className="mx-auto text-green-500 w-16 h-16 mb-4" />
            <h2 className="text-2xl font-bold text-royal-header mb-4">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your order has been confirmed and will be processed shortly.
            </p>
          </>
        ) : (
          <>
            <XCircle className="mx-auto text-red-500 w-16 h-16 mb-4" />
            <h2 className="text-2xl font-bold text-royal-header mb-4">Payment Failed</h2>
            <p className="text-gray-600 mb-6">
              Something went wrong with your payment. Please try again or contact support.
            </p>
          </>
        )}
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleContinueShopping}
            className="bg-royal-interactive text-white px-6 py-2 rounded-full hover:bg-royal-accent-diamond transition-colors"
          >
            Continue Shopping
          </button>
          {status === 'success' && (
            <button
              onClick={handleViewOrders}
              className="bg-royal-button text-royal-dark px-6 py-2 rounded-full hover:bg-royal-interactive hover:text-white transition-colors"
            >
              View Orders
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../api';

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
  quantity: number;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await api.cart.get();
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart items');
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      if (newQuantity < 1) return;
      await api.cart.update(itemId, { quantity: newQuantity });
      fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await api.cart.remove(itemId);
      fetchCart();
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handleCheckout = async () => {
    try {
      setLoading(true);
      
      if (cartItems.length === 0) {
        toast.error('Your cart is empty');
        return;
      }

      const orderData = { items: cartItems, couponCode }; // Example order data
      const orderResponse = await api.order.create(orderData);
      
      if (!orderResponse.data._id) {
        throw new Error('No order ID received');
      }

      if (orderResponse.data.checkoutUrl) {
        window.location.href = orderResponse.data.checkoutUrl;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Error during checkout:', error);
      toast.error(error.response?.data?.error || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-playfair text-4xl font-bold mb-8 text-royal-header">
        Your Cart
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-xl text-royal-dark">
          Your cart is empty.
        </p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center border-b border-royal-highlight py-4"
              >
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-md mr-4"
                />
                <div className="flex-grow">
                  <h3 className="font-playfair text-xl font-semibold text-royal-header">
                    {item.product.name}
                  </h3>
                  <p className="text-royal-interactive font-bold">
                    ₹{item.product.price.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="p-1 bg-royal-button rounded-full disabled:opacity-50"
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="mx-2 font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="p-1 bg-royal-button rounded-full"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item._id)}
                  className="ml-4 text-royal-interactive hover:text-red-500"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3 bg-royal-accent rounded-lg p-6">
            <h2 className="font-playfair text-2xl font-bold mb-4 text-royal-header">
              Order Summary
            </h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%)</span>
                <span>₹{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter gift card code"
                className="w-full px-4 py-2 border border-royal-interactive rounded-full focus:outline-none focus:ring-2 focus:ring-royal-accent-diamond"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
            </div>
            <button
              onClick={handleCheckout}
              disabled={loading || cartItems.length === 0}
              className="w-full bg-royal-interactive text-white py-3 rounded-full font-semibold hover:bg-royal-accent-diamond transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import api from '../api';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await api.cart.get();
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const updateQuantity = async (id: string, newQuantity: number) => {
    try {
      await api.cart.update(id, newQuantity);
      fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (id: string) => {
    try {
      await api.cart.remove(id);
      fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // Assuming 10% tax
  const total = subtotal + tax;

  const handleCheckout = async () => {
    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      };
      const orderResponse = await api.order.create(orderData);
      const paymentResponse = await api.payment.checkout({
        amount: total,
        currency: 'inr',
        orderId: orderResponse.data.id
      });
      
      // Redirect to Stripe Checkout
      window.location.href = paymentResponse.data.url;
    } catch (error) {
      console.error('Error during checkout:', error);
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
                key={item.id}
                className="flex items-center border-b border-royal-highlight py-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-md mr-4"
                />
                <div className="flex-grow">
                  <h3 className="font-playfair text-xl font-semibold text-royal-header">
                    {item.name}
                  </h3>
                  <p className="text-royal-interactive font-bold">
                    ₹{item.price}
                  </p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 bg-royal-button rounded-full"
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="mx-2 font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 bg-royal-button rounded-full"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
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
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter coupon code"
                className="w-full px-4 py-2 border border-royal-interactive rounded-full focus:outline-none focus:ring-2 focus:ring-royal-accent-diamond"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-royal-interactive text-white py-3 rounded-full font-semibold hover:bg-royal-accent-diamond transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.auth.adminLogin({ email, password });
      localStorage.setItem('adminToken', response.data.token);
      navigate('/admin');
    } catch (error) {
      setError('Invalid authorized as admin');
    }
    navigate('/admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-royal-light">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-playfair font-bold text-royal-header mb-6 text-center">Admin Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-royal-dark mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-royal-highlight rounded-md focus:outline-none focus:ring-2 focus:ring-royal-accent-diamond"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-royal-dark mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-royal-highlight rounded-md focus:outline-none focus:ring-2 focus:ring-royal-accent-diamond"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-royal-interactive text-white py-2 px-4 rounded-md hover:bg-royal-accent-diamond transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
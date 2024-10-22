import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const response = await api.auth.login({ email, password });
        localStorage.setItem('token', response.data.token);
        navigate('/account');
      } else {
        await api.auth.signup({ name, email, phone, address, password });
        setIsLogin(true);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-royal-light flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-royal-header">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="name" className="sr-only">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-royal-highlight placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-royal-accent-diamond focus:border-royal-accent-diamond focus:z-10 sm:text-sm"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="sr-only">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-royal-highlight placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-royal-accent-diamond focus:border-royal-accent-diamond focus:z-10 sm:text-sm"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="address" className="sr-only">
                    Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-royal-highlight placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-royal-accent-diamond focus:border-royal-accent-diamond focus:z-10 sm:text-sm"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </>
            )}
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-royal-highlight placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-royal-accent-diamond focus:border-royal-accent-diamond focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-royal-highlight placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-royal-accent-diamond focus:border-royal-accent-diamond focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-royal-interactive hover:bg-royal-accent-diamond focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royal-accent-diamond"
            >
              {isLogin ? 'Sign in' : 'Sign up'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-royal-interactive hover:text-royal-accent-diamond"
          >
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
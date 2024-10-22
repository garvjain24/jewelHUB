import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Diamond, ShoppingCart, User, ChevronDown } from 'lucide-react';
import api from '../api';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile();
    }
  }, [isAuthenticated]);

  const fetchUserProfile = async () => {
    try {
      const response = await api.user.getProfile();
      setUsername(response.data.name);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUsername('');
    navigate('/login');
  };

  return (
    <nav className="bg-royal-dark text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Diamond className="text-royal-accent-diamond" />
          <span className="font-playfair text-2xl font-bold">Royal Jewels</span>
        </Link>
        <div className="flex items-center space-x-6">
          <Link
            to="/shop"
            className="hover:text-royal-accent-diamond transition-colors"
          >
            Shop
          </Link>
          <Link
            to="/investment"
            className="hover:text-royal-accent-diamond transition-colors"
          >
            Invest
          </Link>
          <Link
            to="/gift-card"
            className="hover:text-royal-accent-diamond transition-colors"
          >
            Gift Cards
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/cart"
                className="hover:text-royal-accent-diamond transition-colors"
              >
                <ShoppingCart />
              </Link>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center hover:text-royal-accent-diamond transition-colors"
                >
                  <User className="mr-2" />
                  <span>{username}</span>
                  <ChevronDown className="ml-1" size={16} />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    <Link
                      to="/account"
                      className="block px-4 py-2 text-sm text-royal-dark hover:bg-royal-accent"
                    >
                      Account
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-royal-dark hover:bg-royal-accent"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="hover:text-royal-accent-diamond transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
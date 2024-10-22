
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import AccountPage from './pages/AccountPage';
import InvestmentPage from './pages/InvestmentPage';
import GiftCardPage from './pages/GiftCardPage';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';
/*
API Endpoints:
- POST /api/auth/signup - User Signup
- POST /api/auth/login - User Login
- POST /api/auth/admin-login - Admin Login
- GET /api/user/profile - Get User Profile
- PUT /api/user/profile - Update User Profile
- GET /api/user/orders - Get User Orders
- GET /api/user/investments - Get User Investments
- GET /api/products - Get All Products
- GET /api/products/:id - Get Specific Product
- POST /api/products - Add New Product (Admin)
- PUT /api/products/:id - Update Product (Admin)
- DELETE /api/products/:id - Delete Product (Admin)
- POST /api/cart - Add Product to Cart
- GET /api/cart - Get User's Cart
- DELETE /api/cart/:productId - Remove Product from Cart
- POST /api/order - Create New Order
- GET /api/order/:id - Get Specific Order
- POST /api/payment/checkout - Process Payment
- GET /api/investment/rates - Get Current Rates
- POST /api/investment/buy - Buy Digital Gold/Silver
- POST /api/investment/sell - Sell Digital Gold/Silver
- POST /api/giftcard/generate - Generate Gift Card
- GET /api/giftcard/:code - Get Gift Card Details
- POST /api/giftcard/redeem - Redeem Gift Card
*/
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-royal-light flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<PrivateRoute />}>
              <Route path="/shop" element={<ShopPage />} />
            </Route>
            <Route path="/cart" element={<PrivateRoute />}>
              <Route path="/cart" element={<CartPage />} />
            </Route>
            <Route path="/account" element={<PrivateRoute />}>
              <Route path="/account" element={<AccountPage />} />
            </Route>
            <Route path="/investment" element={<PrivateRoute />}>
              <Route path="/investment" element={<InvestmentPage />} />
            </Route>
            <Route path="/gift-card" element={<PrivateRoute />}>
              <Route path="/gift-card" element={<GiftCardPage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
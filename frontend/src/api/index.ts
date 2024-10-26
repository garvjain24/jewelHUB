import axios, { AxiosRequestConfig } from 'axios';

const API_URL = 'http://localhost:4000/api';

const defaultOptions: AxiosRequestConfig = {
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
};

const api = axios.create(defaultOptions);

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    if (token) {
      config.headers.set('x-auth-token', token);
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  signup: (userData: any) => api.post('/auth/signup', userData),
  login: (credentials: any) => api.post('/auth/login', credentials),
  adminLogin: (credentials: any) => api.post('/auth/admin-login', credentials),
};

export const cart = {
  get: () => api.get('/cart'),
  add: (productData:any) => api.post('/cart', productData),
  update: (itemId: string, data: any) => api.put(`/cart/${itemId}`, data),
  remove: (itemId: string) => api.delete(`/cart/${itemId}`),
};

export const order = {
  create: (orderData: any) => api.post('/order', orderData),
  getOne: (id: string) => api.get(`/order/${id}`),
  getAll: () => api.get('/order'),
};

export const payment = {
  checkout: (paymentData: any) => api.post('/payment/checkout', paymentData),
  verifyPayment: (sessionId: string) => api.post('/payment/verify', { sessionId }),
};

export const products = {
  getAll: (params?: any) => api.get('/products', { params }),
  getOne: (id: string) => api.get(`/products/${id}`),
  create: (productData: any) => api.post('/products', productData),
  update: (id: string, productData: any) => api.put(`/products/${id}`, productData),
  delete: (id: string) => api.delete(`/products/${id}`),
};
export const investment = {
  getRates: () => api.get('/investment/rates'),
  getBalances: () => api.get('/investment/balances'),
  buy: (investmentData: any) => api.post('/investment/buy', investmentData),
  sell: (investmentData: any) => api.post('/investment/sell', investmentData),
};

export const giftCard = {
  generate: (giftCardData: any) => api.post('/giftcard/generate', giftCardData),
  verifyPurchase: (sessionId: string, data: any) => api.post('/giftcard/verify-purchase', { sessionId, ...data }),
  getDetails: (code: string) => api.get(`/giftcard/${code}`),
  redeem: (redeemData: any) => api.post('/giftcard/redeem', redeemData),
  sendEmail: (emailData: any) => api.post('/giftcard/send-email', emailData), // Add this line
};

export const user = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (userData: any) => api.put('/user/profile', userData),
  getOrders: () => api.get('/user/orders'),
  getInvestments: () => api.get('/user/investments'),
};

export const admin = {
  getOverviewData: () => api.get('/admin/overview'),
  getAllProducts: () => api.get('/products'),
  updateProduct: (id: string, productData: any) => api.put(`/admin/products/${id}`, productData),
  addProduct: (productData: any) => api.post('/products', productData),
  getAllOrders: () => api.get('/admin/orders'),
  updateOrderStatus: (id: string, status: string) => api.put(`/admin/orders/${id}/status`, { status }),
  getAllUsers: () => api.get('/admin/users'),
  getUserDetails: (id: string) => api.get(`/admin/users/${id}`),
  banUser: (id: string) => api.put(`/admin/users/${id}/ban`),
  getInvestmentData: () => api.get('/admin/investments'),
  updateGoldSilverRates: (rates: any) => api.put('/admin/investments/rates', rates),
  generateGiftCard: (amount: number) => api.post('/admin/giftcards', { amount }),
  getAllGiftCards: () => api.get('/admin/giftcards'),
  getGiftCardStats: () => api.get('/admin/giftcards/stats'),
  getSalesData: () => api.get('/admin/sales'), 
};

export default {
  auth,
  user,
  products,
  cart,
  order,
  payment,
  investment,
  giftCard,
  admin,
};
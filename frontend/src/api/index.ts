import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in the header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log(token)
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const auth = {
  signup: (userData: {address: string; phone: string ; name: string; password: string; email: string }) => api.post('/auth/signup', userData),
  login: (credentials: { email: string; password: string }) => api.post('/auth/login', credentials),
  adminLogin: (credentials: { username: string; password: string }) => api.post('/auth/admin-login', credentials),
};

export const user = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (userData: { username: string; email: string }) => api.put('/user/profile', userData),
  getOrders: () => api.get('/user/orders'),
  getInvestments: () => api.get('/user/investments'),
};

export const products = {
  getAll: (params?: Record<string, any>) => api.get('/products', { params }),
  getOne: (id: string) => api.get(`/products/${id}`),
  create: (productData: { name: string; price: number; description: string }) => api.post('/products', productData),
  update: (id: string, productData: { name?: string; price?: number; description?: string }) => api.put(`/products/${id}`, productData),
  delete: (id: string) => api.delete(`/products/${id}`),
};

export const cart = {
  add: (productData: { productId: string; quantity: number }) => api.post('/cart', productData),
  get: () => api.get('/cart'),
  remove: (productId: string) => api.delete(`/cart/${productId}`),
  update: (productId: string, quantity: number) => api.put(`/cart/${productId}`, { quantity }),
};

export const order = {
  create: (orderData: { items: Array<{ productId: string; quantity: number }> }) => api.post('/order', orderData),
  getOne: (id: string) => api.get(`/order/${id}`),
};

export const payment = {
  checkout: (paymentData: { amount: number; currency: string;orderId: object }) => api.post('/payment/checkout', paymentData),
};

export const investment = {
  getRates: () => api.get('/investment/rates'),
  buy: (investmentData: { amount: number; type: string }) => api.post('/investment/buy', investmentData),
  sell: (investmentData: { amount: number; type: string }) => api.post('/investment/sell', investmentData),
};

export const giftCard = {
  generate: (giftCardData: { amount: number; recipientEmail: string }) => api.post('/giftcard/generate', giftCardData),
  getDetails: (code: string) => api.get(`/giftcard/${code}`),
  redeem: (redeemData: { code: string; userId: string }) => api.post('/giftcard/redeem', redeemData),
  sendEmail: (emailData: { code: string; recipientEmail: string }) => api.post('/giftcard/send-email', emailData),
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
};
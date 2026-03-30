import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

// Products
export const getProducts = (params) => api.get('/products', { params });
export const getProductById = (id) => api.get(`/products/${id}`);
export const getFeaturedProducts = () => api.get('/products/featured');
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Categories
export const getCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// Cart
export const getCart = () => api.get('/cart');
export const addToCart = (data) => api.post('/cart/add', data);
export const updateCartItem = (cartItemId, quantity) =>
    api.put(`/cart/update/${cartItemId}`, null, { params: { quantity } });
export const removeFromCart = (cartItemId) => api.delete(`/cart/remove/${cartItemId}`);
export const clearCart = () => api.delete('/cart/clear');

// Orders
export const placeOrder = () => api.post('/orders');
export const getMyOrders = () => api.get('/orders/my');
export const getOrderById = (id) => api.get(`/orders/${id}`);
export const getAllOrders = (params) => api.get('/orders/all', { params });
export const updateOrderStatus = (id, status) =>
    api.put(`/orders/${id}/status`, null, { params: { status } });

// Admin
export const getAdminStats = () => api.get('/admin/stats');

export default api;

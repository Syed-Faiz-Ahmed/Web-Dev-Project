import axios from 'axios';

// Create an Axios instance. 
// Vite proxy in vite.config.js forwards '/daycares' to 'http://localhost:3000'
const api = axios.create({
    baseURL: '/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Auto-inject JWT token for authorized routes
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));

export const fetchDaycares = async (params) => {
    const response = await api.get('/daycares', { params });
    return response.data;
};

export const fetchRecommendedDaycares = async () => {
    const response = await api.get('/daycares/recommended');
    return response.data;
};

export const fetchDaycareById = async (id) => {
    // Append a cache-buster timestamp to force browsers to fetch the fresh reviews payload
    const response = await api.get(`/daycares/${id}?t=${new Date().getTime()}`);
    return response.data;
};

// --- Auth & Favorites ---
export const loginUser = async (credentials) => {
    const response = await api.post('/api/users/login', credentials);
    return response.data;
};

export const registerUser = async (userData) => {
    const response = await api.post('/api/users/register', userData);
    return response.data;
};

export const fetchFavorites = async () => {
    const response = await api.get('/api/users/favorites');
    return response.data; // array of Daycare records
};

export const addFavorite = async (daycareId) => {
    const response = await api.post('/api/users/favorites', { daycareId });
    return response.data;
};

export const removeFavorite = async (daycareId) => {
    const response = await api.delete(`/api/users/favorites/${daycareId}`);
    return response.data;
};

export const submitInquiry = async (inquiryData) => {
    const response = await api.post('/api/inquiries', inquiryData);
    return response.data;
};

// --- Dashboard ---
export const fetchUserDashboard = async () => {
    const response = await api.get('/api/users/dashboard');
    return response.data;
};

export const fetchUserInquiries = async () => {
    const response = await api.get('/api/users/inquiries');
    return response.data;
};

// --- Simulating Inquiry Status Update ---
export const updateInquiryStatus = async (inquiryId) => {
    // The backend route is PUT /api/inquiries/:id/status
    const response = await api.put(`/api/inquiries/${inquiryId}/status`);
    return response.data;
};

export default api;

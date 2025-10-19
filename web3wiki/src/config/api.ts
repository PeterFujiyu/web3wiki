// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  newsletter: {
    subscribe: `${API_BASE_URL}/api/newsletter/subscribe`,
    count: `${API_BASE_URL}/api/newsletter/count`, // Public - only returns count
  },
  feedback: {
    submit: `${API_BASE_URL}/api/feedback`,
  },
  health: `${API_BASE_URL}/api/health`,
  // Admin endpoints (require authentication)
  admin: {
    subscribers: `${API_BASE_URL}/api/admin/newsletter/subscribers`,
  },
};

export default API_BASE_URL;

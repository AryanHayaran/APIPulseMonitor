// API Configuration
// Use relative URL to leverage Vite proxy (cookies work with same-origin)

// No need for dotenv import in frontend — Vite handles .env automatically

export const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
  },
  SERVICES: '/services',
  SERVICE: '/services/service',
  SERVICE_DETAILS: '/services/service_details',
  SERVICE_LOGS: (id) => `/services/service/${id}/logs`,
  SERVICE_INCIDENTS: (id) => `/services/service/${id}/incident-logs`,
};

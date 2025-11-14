import { API_BASE_URL, API_ENDPOINTS } from '../config/api'
// import { getAccessToken } from './authService'

// Helper function to handle API calls with error handling
const apiCall = async (url, options = {}) => {
  try {
    // For cookie-based auth, we don't check token here
    // The browser will automatically send cookies with credentials: 'include'

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true', // Required for ngrok
        ...options.headers,
      },
      credentials: 'include', // This sends cookies automatically
    })

    // Check if response is ok before parsing JSON
    let data
    const contentType = response.headers.get('content-type')
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      const text = await response.text()
      if (!response.ok) {
        throw new Error(text || `HTTP ${response.status}: ${response.statusText}`)
      }
      return { success: true, message: text }
    }

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Unauthorized. Please login again.')
      }
      throw new Error(data.message || data.error || data.detail || `Request failed: ${response.status} ${response.statusText}`)
    }

    return data
  } catch (error) {
    if (error instanceof TypeError) {
      if (error.message.includes('fetch')) {
        throw new Error(`Network error: Unable to connect to the server at ${API_BASE_URL}. Please check if the API server is running.`)
      }
      throw new Error(`Network error: ${error.message}`)
    }
    throw error
  }
}

// Fetch all services
export const getServices = async () => {
  return apiCall(`${API_BASE_URL}${API_ENDPOINTS.SERVICES}`, {
    method: 'GET',
  })
}

// Get specific service by ID
export const getService = async (id) => {
  return apiCall(`${API_BASE_URL}${API_ENDPOINTS.SERVICE}/${id}`, {
    method: 'GET',
  })
}

// Get detailed service info by ID
export const getServiceDetails = async (id) => {
  return apiCall(`${API_BASE_URL}${API_ENDPOINTS.SERVICE_DETAILS}/${id}`, {
    method: 'GET',
  })
}

// Create new service
export const createService = async (serviceData) => {
  return apiCall(`${API_BASE_URL}${API_ENDPOINTS.SERVICE}`, {
    method: 'POST',
    body: JSON.stringify(serviceData),
  })
}

// Update service
export const updateService = async (id, serviceData) => {
  return apiCall(`${API_BASE_URL}${API_ENDPOINTS.SERVICE}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(serviceData),
  })
}

// Delete service
export const deleteService = async (id) => {
  return apiCall(`${API_BASE_URL}${API_ENDPOINTS.SERVICE}/${id}`, {
    method: 'DELETE',
  })
}

// Get service logs
export const getServiceLogs = async (id) => {
  return apiCall(`${API_BASE_URL}${API_ENDPOINTS.SERVICE_LOGS(id)}`, {
    method: 'GET',
  })
}

// Get service incident logs
export const getServiceIncidents = async (id) => {
  return apiCall(`${API_BASE_URL}${API_ENDPOINTS.SERVICE_INCIDENTS(id)}`, {
    method: 'GET',
  })
}

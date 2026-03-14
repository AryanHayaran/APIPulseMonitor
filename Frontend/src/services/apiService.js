import { API_BASE_URL, API_ENDPOINTS } from '../config/api'
import { getAccessToken, getRefreshToken, setTokens, removeTokens, refreshAccessToken } from './authService'

// Flag to prevent multiple simultaneous token refresh calls
let isRefreshing = false
let failedQueue = [] // queue of { resolve, reject } for requests pending refresh

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token)
    }
  })
  failedQueue = []
}

// Core fetch wrapper with Bearer token + auto-refresh
const apiCall = async (url, options = {}, isRetry = false) => {
  const accessToken = getAccessToken()

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
  })

  // ── Handle 401 – attempt token refresh ──────────────────────────────────────
  if (response.status === 401 && !isRetry) {
    const refreshToken = getRefreshToken()

    if (!refreshToken) {
      // No refresh token available — force logout
      removeTokens()
      throw new Error('Session expired. Please login again.')
    }

    if (isRefreshing) {
      // Another request is already refreshing — queue this one
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((newToken) => {
        return apiCall(url, options, true)
      }).catch((err) => {
        throw err
      })
    }

    isRefreshing = true

    try {
      await refreshAccessToken()
      isRefreshing = false
      processQueue(null, getAccessToken())
      // Retry the original request with the new access token
      return apiCall(url, options, true)
    } catch (refreshError) {
      isRefreshing = false
      processQueue(refreshError)
      removeTokens()
      throw new Error('Session expired. Please login again.')
    }
  }

  // ── Parse Response ───────────────────────────────────────────────────────────
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
    if (response.status === 403) {
      throw new Error('Access denied.')
    }
    throw new Error(data.message || data.error || data.detail || `Request failed: ${response.status} ${response.statusText}`)
  }

  return data
}

// Wrapper that catches network-level errors
const safeApiCall = async (url, options = {}) => {
  try {
    return await apiCall(url, options)
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Network error: Unable to connect to the server at ${API_BASE_URL}. Please check if the API server is running.`)
    }
    throw error
  }
}

// ─── Service APIs ─────────────────────────────────────────────────────────────

export const getServices = async () => {
  return safeApiCall(`${API_BASE_URL}${API_ENDPOINTS.SERVICES}`, { method: 'GET' })
}

export const getService = async (id) => {
  return safeApiCall(`${API_BASE_URL}${API_ENDPOINTS.SERVICE}/${id}`, { method: 'GET' })
}

export const getServiceDetails = async (id) => {
  return safeApiCall(`${API_BASE_URL}${API_ENDPOINTS.SERVICE_DETAILS}/${id}`, { method: 'GET' })
}

export const createService = async (serviceData) => {
  return safeApiCall(`${API_BASE_URL}${API_ENDPOINTS.SERVICE}`, {
    method: 'POST',
    body: JSON.stringify(serviceData),
  })
}

export const updateService = async (id, serviceData) => {
  return safeApiCall(`${API_BASE_URL}${API_ENDPOINTS.SERVICE}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(serviceData),
  })
}

export const deleteService = async (id) => {
  return safeApiCall(`${API_BASE_URL}${API_ENDPOINTS.SERVICE}/${id}`, { method: 'DELETE' })
}

export const getServiceLogs = async (id) => {
  return safeApiCall(`${API_BASE_URL}${API_ENDPOINTS.SERVICE_LOGS(id)}`, { method: 'GET' })
}

export const getServiceIncidents = async (id) => {
  return safeApiCall(`${API_BASE_URL}${API_ENDPOINTS.SERVICE_INCIDENTS(id)}`, { method: 'GET' })
}

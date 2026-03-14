import { API_BASE_URL, API_ENDPOINTS } from '../config/api'

// ─── Token Storage ────────────────────────────────────────────────────────────

export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem('access_token', accessToken)
  if (refreshToken) {
    localStorage.setItem('refresh_token', refreshToken)
  }
}

export const getAccessToken = () => {
  return localStorage.getItem('access_token')
}

export const getRefreshToken = () => {
  return localStorage.getItem('refresh_token')
}

export const removeTokens = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

// ─── Refresh Token ────────────────────────────────────────────────────────────

export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: JSON.stringify({
      refresh_token: `Bearer ${refreshToken}`,
    }),
  })

  const contentType = response.headers.get('content-type')
  let data
  if (contentType && contentType.includes('application/json')) {
    data = await response.json()
  } else {
    const text = await response.text()
    throw new Error(text || `Token refresh failed: ${response.status}`)
  }

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Token refresh failed')
  }

  // Store the new access token
  const newAccessToken = data.data.access_token
  setTokens(newAccessToken, null) // refresh_token stays the same
  return newAccessToken
}

// ─── Login ────────────────────────────────────────────────────────────────────

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    let data
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      const text = await response.text()
      throw new Error(text || `HTTP ${response.status}: ${response.statusText}`)
    }

    if (!response.ok) {
      throw new Error(data.message || data.error || `Login failed: ${response.status} ${response.statusText}`)
    }

    // Store both tokens
    const { access_token, refresh_token } = data.data
    setTokens(access_token, refresh_token)

    return data
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Network error: Unable to connect to the server at ${API_BASE_URL}. Please check if the API server is running.`)
    }
    throw error
  }
}

// ─── Signup ───────────────────────────────────────────────────────────────────

export const signup = async (full_name, email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.SIGNUP}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ full_name, email, password }),
    })

    let data
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      const text = await response.text()
      throw new Error(text || `HTTP ${response.status}: ${response.statusText}`)
    }

    if (!response.ok) {
      throw new Error(data.message || data.error || `Signup failed: ${response.status} ${response.statusText}`)
    }

    // Store both tokens
    const { access_token, refresh_token } = data.data
    setTokens(access_token, refresh_token)

    return data
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Network error: Unable to connect to the server at ${API_BASE_URL}. Please check if the API server is running.`)
    }
    throw error
  }
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export const logout = async () => {
  try {
    const accessToken = getAccessToken()
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGOUT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    })

    // Always clear tokens on logout regardless of response
    removeTokens()

    if (!response.ok) {
      let errorMessage = `Logout failed: ${response.status} ${response.statusText}`
      try {
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json()
          errorMessage = data.message || data.error || errorMessage
        }
      } catch {
        // Ignore JSON parsing errors
      }
      throw new Error(errorMessage)
    }

    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return await response.json()
    }

    return { success: true }
  } catch (error) {
    // Always remove tokens even if API call fails
    removeTokens()
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Network error: Unable to connect to the server at ${API_BASE_URL}. Please check if the API server is running.`)
    }
    throw error
  }
}

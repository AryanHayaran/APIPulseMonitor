import { API_BASE_URL, API_ENDPOINTS } from '../config/api'

// Get access token - for cookie-based auth
export const getAccessToken = () => {
  // For HttpOnly cookie-based auth, we can't read the cookie from JavaScript
  // The cookie is automatically sent by the browser with credentials: 'include'
  // We check localStorage for a login flag set after successful login
  return localStorage.getItem('isLoggedIn') || null
}

// Set login flag
export const setLoginFlag = () => {
  localStorage.setItem('isLoggedIn', 'true')
}

// Remove access token - clear login flag
export const removeAccessToken = () => {
  // Clear login flag - cookies are cleared by the backend on logout
  localStorage.removeItem('isLoggedIn')
}

// Login API call
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true', // Required for ngrok
      },
      credentials: 'include', // Important for cookies
      body: JSON.stringify({
        email,
        password,
      }),
    })

    // Check if response is ok before parsing JSON
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

    // Cookie is automatically set by the backend via Set-Cookie header
    // Set a login flag in localStorage so we know user is authenticated
    setLoginFlag()

    return data
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError) {
      if (error.message.includes('fetch')) {
        throw new Error(`Network error: Unable to connect to the server at ${API_BASE_URL}. Please check if the API server is running.`)
      }
      throw new Error(`Network error: ${error.message}`)
    }
    // Re-throw other errors
    throw error
  }
}

// Signup API call
export const signup = async (full_name, email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.SIGNUP}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true', // Required for ngrok
      },
      credentials: 'include',
      body: JSON.stringify({
        full_name,
        email,
        password,
      }),
    })

    // Check if response is ok before parsing JSON
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

    // Cookie is automatically set by the backend via Set-Cookie header
    // Set a login flag in localStorage so we know user is authenticated
    setLoginFlag()

    return data
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError) {
      if (error.message.includes('fetch')) {
        throw new Error(`Network error: Unable to connect to the server at ${API_BASE_URL}. Please check if the API server is running.`)
      }
      throw new Error(`Network error: ${error.message}`)
    }
    // Re-throw other errors
    throw error
  }
}

// Logout API call
export const logout = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGOUT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true', // Required for ngrok
      },
      credentials: 'include', // Cookies are sent automatically with credentials: 'include'
    })

    // Remove token regardless of response
    removeAccessToken()

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

    // Try to parse response if it's JSON
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return await response.json()
    }
    
    return { success: true }
  } catch (error) {
    // Even if API call fails, remove token locally
    removeAccessToken()
    if (error instanceof TypeError) {
      if (error.message.includes('fetch')) {
        throw new Error(`Network error: Unable to connect to the server at ${API_BASE_URL}. Please check if the API server is running.`)
      }
      throw new Error(`Network error: ${error.message}`)
    }
    throw error
  }
}

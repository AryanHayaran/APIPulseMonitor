import { createContext, useState, useEffect } from 'react'
import { getAccessToken, removeAccessToken } from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated on mount
    const token = getAccessToken()
    setIsAuthenticated(!!token)
    setLoading(false)
  }, [])

  const login = () => {
    // For cookie-based auth, we trust that the login API succeeded
    // Cookies are HttpOnly and sent automatically, so we can't read them
    setIsAuthenticated(true)
    return Promise.resolve()
  }

  const logout = () => {
    removeAccessToken()
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext

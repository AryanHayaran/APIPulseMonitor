import { createContext, useState, useEffect, useCallback } from 'react'
import { getAccessToken, removeTokens } from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated on mount by reading the stored access token
    const token = getAccessToken()
    setIsAuthenticated(!!token)
    setLoading(false)
  }, [])

  const login = useCallback(() => {
    // Tokens have already been stored by authService.login() — just update state
    setIsAuthenticated(true)
    return Promise.resolve()
  }, [])

  const logout = useCallback(() => {
    removeTokens()
    setIsAuthenticated(false)
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext

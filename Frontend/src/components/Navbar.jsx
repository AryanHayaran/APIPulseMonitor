import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

function Navbar() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="">
        <div className="flex justify-between items-center h-16">
          {/* LEFT: LOGO + NAV LINKS */}
          <div className="flex items-center space-x-8">
            {/* Brand */}
            <h1
              onClick={() => navigate('/')}
              className="text-2xl font-bold text-blue-600 cursor-pointer hover:text-blue-700 transition-colors duration-200"
            >
              API<span className="text-gray-800">Monitor</span>
            </h1>

            {/* Desktop Links */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center space-x-6">
                <button
                  onClick={() => navigate('/')}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 cursor-pointer"
                >
                  Home
                </button>
                <button
                  onClick={() => navigate('/add-service')}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 cursor-pointer"
                >
                  Add Service
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: AUTH BUTTONS */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-5 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 cursor-pointer"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-300 focus:outline-none cursor-pointer"
                >
                  Login
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/logout')}
                className="px-5 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 font-medium shadow-sm transition-all duration-200 focus:ring-2 focus:ring-rose-300 focus:outline-none cursor-pointer"
              >
                Logout
              </button>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-md p-2 cursor-pointer"
            >
              {menuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-md">
          <div className="px-6 py-4 space-y-4">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    navigate('/')
                    setMenuOpen(false)
                  }}
                  className="block w-full text-left text-gray-700 hover:text-blue-600 font-medium transition cursor-pointer"
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    navigate('/add-service')
                    setMenuOpen(false)
                  }}
                  className="block w-full text-left text-gray-700 hover:text-blue-600 font-medium transition cursor-pointer"
                >
                  Add Service
                </button>
                <button
                  onClick={() => {
                    navigate('/logout')
                    setMenuOpen(false)
                  }}
                  className="block w-full text-left bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 font-medium transition cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate('/signup')
                    setMenuOpen(false)
                  }}
                  className="block w-full text-left text-gray-700 hover:text-blue-600 font-medium transition cursor-pointer"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => {
                    navigate('/login')
                    setMenuOpen(false)
                  }}
                  className="block w-full text-left bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition cursor-pointer"
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar

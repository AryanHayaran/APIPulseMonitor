import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getServices } from '../../services/apiService'
import { useAuth } from '../../context/useAuth'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from '../../components/Navbar'
import ServiceCard from '../../components/ServiceCard'

function Home() {
  const navigate = useNavigate()
  const { isAuthenticated, logout: handleLogout, loading: authLoading } = useAuth()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchServices = async () => {
      // Wait for auth to finish loading
      if (authLoading) {
        return
      }

      if (isAuthenticated) {
        try {
          setLoading(true)
          setError('')
          const data = await getServices()

          console.log("DATA", data)
          
          // Handle different response formats
          if (Array.isArray(data)) {
            setServices(data)
          } else if (data.services && Array.isArray(data.services)) {
            setServices(data.services)
          } else if (data.data && Array.isArray(data.data)) {
            setServices(data.data)
          } else {
            setServices([])
          }
        } catch (err) {
          const errorMessage = err.message || 'Failed to load services'
          setError(errorMessage)
          setServices([])
          
          // If unauthorized, logout user
          if (err.message.includes('token') || err.message.includes('unauthorized') || err.message.includes('Unauthorized')) {
            handleLogout()
            navigate('/login')
          }
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
        setServices([])
      }
    }

    fetchServices()
  }, [isAuthenticated, authLoading, navigate, handleLogout])

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />

      {/* Body with Services */}
      <div className=" py-8">
        {/* Header Section */}
        {isAuthenticated && (
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">API Services</h1>
              <p className="text-gray-600">Monitor and manage your API services</p>
            </div>
            <button
              onClick={() => navigate('/add-service')}
              className="mt-4 sm:mt-0 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition duration-200 shadow-md flex items-center space-x-2"
            >
              <span className="text-xl">+</span>
              <span>Add New Service</span>
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-600 flex items-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Loading services...</span>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : !isAuthenticated ? (
          <div className="bg-white min-h-[300px] rounded-lg flex flex-col justify-center shadow-md p-12 text-center border border-gray-200">
              <div className="mb-6 flex justify-center">
                <svg className="w-20 h-20 mx-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to API Monitor</h2>
              <p className="text-gray-600 mb-8">
                Please login or signup to view and manage your API services.
              </p>
          </div>
        ) : services.length === 0 ? (
          <div className="bg-white min-h-[250px] justify-center flex flex-col rounded-lg shadow-md p-12 text-center border border-gray-200">
            <div className="mb-6 flex flex-col justify-center">
              <div className="mb-6 flex justify-center">
                <svg className="w-20 h-20 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Services Yet</h2>
              <p className="text-gray-600 mb-8">
                Get started by adding your first API service to monitor.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.service_id || service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home

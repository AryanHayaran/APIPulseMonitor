import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getServiceIncidents, getService } from '../../services/apiService'
import { useAuth } from '../../context/useAuth'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from '../../components/Navbar'

function Incidents() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, logout: handleLogout } = useAuth()
  const [incidents, setIncidents] = useState([])
  const [serviceName, setServiceName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedError, setSelectedError] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        setError('')

        const [serviceData, incidentsData] = await Promise.all([
          getService(id),
          getServiceIncidents(id),
        ])

        setServiceName(serviceData?.data?.name || 'Service')

        if (Array.isArray(incidentsData)) setIncidents(incidentsData)
        else if (incidentsData.data && Array.isArray(incidentsData.data))
          setIncidents(incidentsData.data)
        else setIncidents([])
      } catch (err) {
        const errorMessage = err.message || 'Failed to load incidents'
        setError(errorMessage)
        toast.error(errorMessage)

        if (err.message.includes('Unauthorized') || err.message.includes('token')) {
          handleLogout()
          navigate('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, isAuthenticated, navigate, handleLogout])

  const calculateDuration = (start, end) => {
    if (!start || !end) return 'N/A'
    const startTime = new Date(start)
    const endTime = new Date(end)
    const diffMs = endTime - startTime
    const diffMinutes = Math.floor(diffMs / 60000)
    if (diffMinutes < 60) return `${diffMinutes} min`
    const hours = Math.floor(diffMinutes / 60)
    const mins = diffMinutes % 60
    return `${hours}h ${mins}m`
  }

  const trimError = (msg) => {
    if (!msg) return '—'
    return msg.length > 100 ? msg.slice(0, 100) + '...' : msg
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <div className="flex items-center text-gray-600 space-x-3">
            <svg
              className="animate-spin h-6 w-6 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
                5.291A7.962 7.962 0 014 12H0
                c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-lg font-medium">Loading incidents...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />

      <main className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10 space-y-10">

        {/* Header */}
        <section className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Incident Logs</h1>
            <p className="text-slate-600 text-sm font-medium">{serviceName}</p>
          </div>
        </section>

        {/* Error Message */}
        {error && (
          <div className="bg-rose-100 border border-rose-300 text-rose-800 px-5 py-3 rounded-lg shadow-sm">
            {error}
          </div>
        )}

        {/* Incidents Table */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
          {incidents.length === 0 ? (
            <div className="p-10 text-center text-slate-600 text-sm">
              <div className="text-green-500 mb-3">
                <svg
                  className="w-14 h-14 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p>No incidents recorded for this service. All systems healthy.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-red-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-red-800 uppercase tracking-wider">
                      Start Time
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-red-800 uppercase tracking-wider">
                      End Time
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-red-800 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-red-800 uppercase tracking-wider w-64">
                      Initial Error
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {incidents.map((incident, index) => (
                    <tr key={incident.id || index} className="hover:bg-red-50 transition-all">
                      {/* Start Time */}
                      <td className="px-6 py-4 whitespace-nowrap text-slate-800">
                        {incident.start_time
                          ? new Date(incident.start_time).toLocaleString()
                          : 'N/A'}
                      </td>

                      {/* End Time */}
                      <td className="px-6 py-4 whitespace-nowrap text-slate-800">
                        {incident.end_time
                          ? new Date(incident.end_time).toLocaleString()
                          : 'N/A'}
                      </td>

                      {/* Duration */}
                      <td className="px-6 py-4 whitespace-nowrap text-slate-800">
                        {calculateDuration(incident.start_time, incident.end_time)}
                      </td>

                      {/* Error Message */}
                      <td
                        className="px-6 py-4 whitespace-nowrap text-rose-700 font-medium cursor-pointer truncate max-w-[30rem] hover:text-rose-900"
                        title="Click to view full error"
                        onClick={() => setSelectedError(incident.initial_error)}
                      >
                        {trimError(incident.initial_error)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Error Modal */}
      {selectedError && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-2xl p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Incident Error</h3>
              <button
                onClick={() => setSelectedError(null)}
                className="text-slate-500 hover:text-slate-800 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <pre className="bg-slate-50 text-slate-700 text-sm p-4 rounded-lg border border-slate-200 overflow-x-auto">
              {selectedError}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

export default Incidents

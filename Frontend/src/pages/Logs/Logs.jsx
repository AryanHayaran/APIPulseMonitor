import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getServiceLogs, getService } from '../../services/apiService'
import { useAuth } from '../../context/useAuth'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from '../../components/Navbar'

function Logs() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, logout: handleLogout } = useAuth()
  const [logs, setLogs] = useState([])
  const [serviceName, setServiceName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedResponse, setSelectedResponse] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        setError('')

        const [serviceData, logsData] = await Promise.all([
          getService(id),
          getServiceLogs(id)
        ])

        setServiceName(serviceData?.data?.name || 'Service')

        if (Array.isArray(logsData)) setLogs(logsData)
        else if (logsData.logs && Array.isArray(logsData.logs)) setLogs(logsData.logs)
        else if (logsData.data && Array.isArray(logsData.data)) setLogs(logsData.data)
        else setLogs([])
      } catch (err) {
        const errorMessage = err.message || 'Failed to load logs'
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

  const getHealthColor = (status) =>
    status
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-rose-100 text-rose-800 border-rose-200'

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
            <span className="text-lg font-medium">Loading logs...</span>
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
            <h3 className="text-2xl font-bold text-slate-900 mb-1">Service Logs</h3>
            <p className="text-slate-600 text-sm font-medium">{serviceName}</p>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="bg-rose-100 border border-rose-300 text-rose-800 px-5 py-3 rounded-lg shadow-sm">
            {error}
          </div>
        )}

        {/* Logs Table */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
          {logs.length === 0 ? (
            <div className="p-10 text-center text-slate-600 text-sm">
              No logs available for this service.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-slate-700 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-700 uppercase tracking-wider">
                      Health
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-700 uppercase tracking-wider">
                      Latency
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-700 uppercase tracking-wider w-48">
                      Response
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-700 uppercase tracking-wider">
                      Error Message
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {logs.map((log, index) => (
                    <tr
                      key={log.id || index}
                      className="hover:bg-slate-50 transition-all"
                    >
                      {/* Timestamp */}
                      <td className="px-6 py-4 whitespace-nowrap text-slate-800">
                        {log.checked_at
                          ? new Date(log.checked_at).toLocaleString()
                          : 'N/A'}
                      </td>

                      {/* Health */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getHealthColor(
                            log.is_healthy
                          )}`}
                        >
                          {log.is_healthy ? 'Healthy' : 'Unhealthy'}
                        </span>
                      </td>

                      {/* Latency */}
                      <td className="px-6 py-4 whitespace-nowrap text-slate-800">
                        {log.response_time_ms
                          ? `${log.response_time_ms.toFixed(2)} ms`
                          : 'N/A'}
                      </td>

                      {/* Response Body */}
                      <td className="px-6 py-4 whitespace-nowrap text-blue-600 hover:text-blue-800 font-medium cursor-pointer truncate max-w-96"
                        onClick={() => setSelectedResponse(log.response_body)}
                        title="Click to view full response"
                      >
                        {log.response_body
                          ? log.response_body.slice(0, 60) + '...'
                          : '—'}
                      </td>

                      {/* Error Message */}
                      <td className="px-6 py-4 text-xs text-rose-700">
                        {trimError(log.error_message)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Response Modal */}
      {selectedResponse && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-3xl max-h-[80vh] overflow-y-auto p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Response Body</h3>
              <button
                onClick={() => setSelectedResponse(null)}
                className="text-slate-500 hover:text-slate-800 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <pre className="bg-slate-50 text-slate-700 text-sm p-4 rounded-lg border border-slate-200 overflow-x-auto">
              {JSON.stringify(selectedResponse, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

export default Logs

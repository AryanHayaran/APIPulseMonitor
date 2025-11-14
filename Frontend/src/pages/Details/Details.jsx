import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getServiceDetails, deleteService } from '../../services/apiService'
import { useAuth } from '../../context/useAuth'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from '../../components/Navbar'
import LatencyGraph from '../../components/LatencyGraph'
import Modal from '../../components/Modal'

function Details() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, logout: handleLogout } = useAuth()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    const fetchServiceDetails = async () => {
      try {
        setLoading(true)
        setError('')
        const details = await getServiceDetails(id)
        setService(details.data)
      } catch (err) {
        const message = err.message || 'Failed to load service details'
        setError(message)
        toast.error(message)

        if (err.message.includes('Unauthorized') || err.message.includes('token')) {
          handleLogout()
          navigate('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchServiceDetails()
  }, [id, isAuthenticated, navigate, handleLogout])

  const handleDelete = async () => {
    try {
      setDeleting(true)
      await deleteService(id)
      toast.success('Service deleted successfully!')
      setTimeout(() => navigate('/'), 1200)
    } catch (err) {
      toast.error(err.message || 'Failed to delete service')
    } finally {
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const getStatusColor = (status) =>
    status ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-rose-100 text-rose-700 border-rose-200'

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="flex flex-col items-center space-y-3">
            <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <p className="text-gray-600 font-medium">Loading service details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-rose-100 border border-rose-300 text-rose-700 px-6 py-4 rounded-xl shadow-sm max-w-lg text-center">
            {error}
          </div>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-gray-600 text-lg font-medium">
          Service not found.
        </div>
      </div>
    )
  }

  return (
    <div className=" min-h-screen bg-slate-50 text-gray-800 flex flex-col">
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />

      <main className=" py-10 space-y-10">
        {/* HEADER */}
        <section className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">{service.name}</h1>
            <div className="flex items-center space-x-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                  service.is_healthy
                )}`}
              >
                {service.is_healthy ? 'Healthy' : 'Unhealthy'}
              </span>
              <span className="text-sm font-medium uppercase text-slate-500 tracking-wide">
                {service.http_method}
              </span>
            </div>
          </div>


          <div className="flex flex-wrap items-center justify-start mt-6 md:mt-0 gap-4">
              <button
                onClick={() => navigate(`/logs/${id}`)}
                className="min-w-[130px] px-8 py-3 rounded-lg cursor-pointer bg-blue-600 text-white font-medium hover:bg-blue-700 active:scale-95 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                View Logs
              </button>

              <button
                onClick={() => navigate(`/incidents/${id}`)}
                className="min-w-[130px] px-8 py-3 rounded-lg cursor-pointer bg-amber-500 text-white font-medium hover:bg-amber-600 active:scale-95 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
              >
                Incidents
              </button>

              <button
                onClick={() => navigate(`/edit-service/${id}`)}
                className="min-w-[130px] px-8 py-3 rounded-lg cursor-pointer bg-emerald-600 text-white font-medium hover:bg-emerald-700 active:scale-95 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                Edit
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="min-w-[130px] px-8 py-3 rounded-lg cursor-pointer bg-rose-600 text-white font-medium hover:bg-rose-700 active:scale-95 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              >
                Delete
              </button>
           </div>


        </section>

        {/* GRID: CONFIG + METRICS */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* CONFIG */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 border-b border-gray-100 pb-2">
              Service Configuration
            </h2>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="font-medium text-gray-600">URL:</dt>
                <dd className="mt-1 text-blue-600 break-words">{service.url}</dd>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="font-medium text-gray-600">Method:</dt>
                  <dd className="mt-1">{service.http_method}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-600">Expected Status:</dt>
                  <dd className="mt-1">{service.expected_status_code}</dd>
                </div>
              </div>
              <div>
                <dt className="font-medium text-gray-600">Expected Latency:</dt>
                <dd className="mt-1">{service.expected_latency_ms} ms</dd>
              </div>
              {service.periodic_summary_report && (
                <div>
                  <dt className="font-medium text-gray-600">Summary Report:</dt>
                  <dd className="mt-1">{service.periodic_summary_report} minutes</dd>
                </div>
              )}
            </dl>
          </div>

          {/* METRICS */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 border-b border-gray-100 pb-2">
              Performance Metrics
            </h2>
            <div className="space-y-5">
              {service.response_time_ms !== undefined && (
                <div>
                  <p className="text-gray-600 text-sm font-medium">Last Latency:</p>
                  <p className="text-3xl font-bold text-blue-600 mt-1">
                    {service.response_time_ms ? `${service.response_time_ms.toFixed(2)} ms` : 'N/A'}
                  </p>
                </div>
              )}
              {service.checked_at && (
                <div>
                  <p className="text-gray-600 text-sm font-medium">Last Checked:</p>
                  <p className="text-sm text-gray-800 mt-1">
                    {new Date(service.checked_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* GRAPH */}
        {service.last_20_latencies?.length > 0 && (
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md p-6 transition-all">
            <h2 className="text-xl font-semibold text-slate-800 mb-4 border-b border-gray-100 pb-2">
              Latency Overview
            </h2>
            <LatencyGraph latencyData={service.last_20_latencies} />
          </section>
        )}

        {/* REQUEST & VALIDATION */}
        <section className="space-y-8">
          {service.request_headers && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-3 border-b border-gray-100 pb-2">
                Request Headers
              </h2>
              <pre className="bg-slate-50 text-slate-800 text-sm p-4 rounded-lg overflow-x-auto border border-slate-200">
                {JSON.stringify(service.request_headers, null, 2)}
              </pre>
            </div>
          )}
          {service.request_body && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-3 border-b border-gray-100 pb-2">
                Request Body
              </h2>
              <pre className="bg-slate-50 text-slate-800 text-sm p-4 rounded-lg overflow-x-auto border border-slate-200">
                {JSON.stringify(service.request_body, null, 2)}
              </pre>
            </div>
          )}
          {service.response_validation && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-3 border-b border-gray-100 pb-2">
                Response Validation
              </h2>
              <pre className="bg-slate-50 text-slate-800 text-sm p-4 rounded-lg overflow-x-auto border border-slate-200">
                {JSON.stringify(service.response_validation, null, 2)}
              </pre>
            </div>
          )}
        </section>
      </main>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Service"
        message={`Are you sure you want to delete "${service.name}"? This action cannot be undone.`}
        confirmText={deleting ? 'Deleting...' : 'Delete'}
        cancelText="Cancel"
      />
    </div>
  )
}

export default Details

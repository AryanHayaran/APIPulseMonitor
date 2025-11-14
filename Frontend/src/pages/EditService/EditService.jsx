import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getService, updateService } from '../../services/apiService'
import { useAuth } from '../../context/useAuth'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from '../../components/Navbar'

function EditService() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, logout: handleLogout } = useAuth()
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    http_method: 'GET',
    url: '',
    request_headers: '{}',
    request_body: '',
    periodic_summary_report: 120,
    expected_status_code: 200,
    expected_latency_ms: 500,
    response_validation: '{}',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    const fetchService = async () => {
      try {
        setLoading(true)
        const res = await getService(id)

        setFormData({
          name: res.data.name || '',
          http_method: res.data.http_method || 'GET',
          url: res.data.url || '',
          request_headers: JSON.stringify(res.data.request_headers || {}, null, 2),
          request_body: res.data.request_body ? JSON.stringify(res.data.request_body, null, 2) : '',
          periodic_summary_report: res.data.periodic_summary_report || 120,
          expected_status_code: res.data.expected_status_code || 200,
          expected_latency_ms: res.data.expected_latency_ms || 500,
          response_validation: JSON.stringify(res.data.response_validation || {}, null, 2),
        })
      } catch (err) {
        const message = err.message || 'Failed to load service details.'
        toast.error(message)
        if (message.includes('Unauthorized') || message.includes('token')) {
          handleLogout()
          navigate('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchService()
  }, [id, isAuthenticated, navigate, handleLogout])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) setErrors({ ...errors, [name]: '' })
  }

  const validateJSON = (jsonString, fieldName) => {
    if (!jsonString.trim()) return true
    try {
      JSON.parse(jsonString)
      return true
    } catch {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: 'Invalid JSON format',
      }))
      return false
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Service name is required'
    if (!formData.url.trim()) newErrors.url = 'URL is required'
    else {
      try {
        new URL(formData.url)
      } catch {
        newErrors.url = 'Invalid URL format'
      }
    }

    if (!validateJSON(formData.request_headers, 'request_headers'))
      newErrors.request_headers = 'Invalid JSON format'
    if (formData.request_body && !validateJSON(formData.request_body, 'request_body'))
      newErrors.request_body = 'Invalid JSON format'
    if (!validateJSON(formData.response_validation, 'response_validation'))
      newErrors.response_validation = 'Invalid JSON format'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    setUpdating(true)
    try {
      const payload = {
        name: formData.name,
        http_method: formData.http_method,
        url: formData.url,
        request_headers: JSON.parse(formData.request_headers || '{}'),
        request_body: formData.request_body ? JSON.parse(formData.request_body) : null,
        periodic_summary_report: parseInt(formData.periodic_summary_report),
        expected_status_code: parseInt(formData.expected_status_code),
        expected_latency_ms: parseInt(formData.expected_latency_ms),
        response_validation: JSON.parse(formData.response_validation || '{}'),
      }

      await updateService(id, payload)
      toast.success('Service updated successfully!')
      setTimeout(() => navigate(`/details/${id}`), 1000)
    } catch (err) {
      toast.error(err.message || 'Failed to update service')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex justify-center items-center py-24">
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
                d="M4 12a8 8 0 018-8V0C5.373 0 0 
                5.373 0 12h4zm2 5.291A7.962 7.962 
                0 014 12H0c0 3.042 1.135 5.824 
                3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-lg font-medium">Loading service details...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />

      <main className=" py-10 space-y-10">
          {/* Header */}
          <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-slate-900 mb-3 sm:mb-0">
              Edit API Service
            </h1>
          </section>

          {/* Form Card */}
          <section className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* First Row: Service + URL */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className='w-full md:w-1/3'>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Service Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.name ? 'border-rose-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                    placeholder="e.g. User Service API"
                  />
                  {errors.name && (
                    <p className="text-rose-600 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div className='w-full md:w-2/3'>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    URL <span className="text-rose-600">*</span>
                  </label>
                  <input
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.url ? 'border-rose-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                    placeholder="https://api.example.com/endpoint"
                  />
                  {errors.url && (
                    <p className="text-rose-600 text-sm mt-1">{errors.url}</p>
                  )}
                </div>
              </div>


              {/* Second Row: Method + Config Fields */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Method
                  </label>
                  <select
                    name="http_method"
                    value={formData.http_method}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                {[
                  { id: 'expected_status_code', label: 'Expected Status Code' },
                  { id: 'expected_latency_ms', label: 'Expected Latency (ms)' },
                  { id: 'periodic_summary_report', label: 'Check Interval (s)' },
                ].map(({ id, label }) => (
                  <div key={id}>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      {label}
                    </label>
                    <input
                      type="number"
                      name={id}
                      value={formData[id]}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                ))}
              </div>

            {/* JSON Fields */}
            {[
              { id: 'request_headers', label: 'Request Headers (JSON)' },
              ...(formData.http_method !== 'GET'
                ? [{ id: 'request_body', label: 'Request Body (JSON)' }]
                : []),
              { id: 'response_validation', label: 'Response Validation (JSON)' },
            ].map(({ id, label }) => (
              <div key={id}>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  {label}
                </label>
                <textarea
                  name={id}
                  value={formData[id]}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full px-4 py-2.5 border ${
                    errors[id] ? 'border-rose-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-sm`}
                />
                {errors[id] && (
                  <p className="text-rose-600 text-sm mt-1">{errors[id]}</p>
                )}
              </div>
            ))}


            {/* Actions */}
            <div className=" flex justify-end space-x-3 pt-6 gap-x-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate(`/details/${id}`)}
                className="cursor-pointer min-w-[140px]  px-8 py-5 border border-[#c9c5c5] bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="cursor-pointer min-w-[140px]  px-8 py-5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm disabled:opacity-60 transition"
              >
                {updating ? 'Updating...' : 'Update Service'}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}

export default EditService

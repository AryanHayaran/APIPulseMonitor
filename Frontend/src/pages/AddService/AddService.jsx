import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createService } from '../../services/apiService'
import { useAuth } from '../../context/useAuth'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from '../../components/Navbar'

function AddService() {
  const navigate = useNavigate()
  const { isAuthenticated, logout: handleLogout } = useAuth()
  const [loading, setLoading] = useState(false)
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

  if (!isAuthenticated) {
    navigate('/login')
    return null
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const validateJSON = (jsonString, fieldName) => {
    if (!jsonString || jsonString.trim() === '') return true
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

    if (!formData.url.trim()) {
      newErrors.url = 'URL is required'
    } else {
      try {
        new URL(formData.url)
      } catch {
        newErrors.url = 'Invalid URL format'
      }
    }

    if (!validateJSON(formData.request_headers, 'request_headers'))
      newErrors.request_headers = 'Invalid JSON format for headers'
    if (formData.request_body && !validateJSON(formData.request_body, 'request_body'))
      newErrors.request_body = 'Invalid JSON format for request body'
    if (!validateJSON(formData.response_validation, 'response_validation'))
      newErrors.response_validation = 'Invalid JSON format for response validation'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    setLoading(true)
    try {
      const serviceData = {
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

      await createService(serviceData)
      toast.success('Service created successfully!')
      setTimeout(() => navigate('/'), 1000)
    } catch (err) {
      const errorMessage = err.message || 'Failed to create service'
      toast.error(errorMessage)
      if (err.message.includes('Unauthorized') || err.message.includes('token')) {
        handleLogout()
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />

      <main className="py-10 space-y-10">
        {/* Header */}
        <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-slate-900 mb-3 sm:mb-0">
            Add New API Service
          </h1>
        </section>

        {/* Form Card */}
        <section className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* First Row: Service (40%) + URL (60%) */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Service Name */}
              <div className="w-full md:w-1/3">
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

              {/* URL */}
              <div className="w-full md:w-2/3">
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

            {/* Request Headers */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Request Headers (JSON)
              </label>
              <textarea
                name="request_headers"
                value={formData.request_headers}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-2.5 rounded-lg border font-mono text-sm ${
                  errors.request_headers ? 'border-rose-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
              />
              {errors.request_headers && (
                <p className="text-rose-600 text-sm mt-1">
                  {errors.request_headers}
                </p>
              )}
            </div>

            {/* Request Body */}
            {(formData.http_method === 'POST' ||
              formData.http_method === 'PUT' ||
              formData.http_method === 'PATCH') && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Request Body (JSON)
                </label>
                <textarea
                  name="request_body"
                  value={formData.request_body}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-2.5 rounded-lg border font-mono text-sm ${
                    errors.request_body ? 'border-rose-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                  placeholder='{"key": "value"}'
                />
                {errors.request_body && (
                  <p className="text-rose-600 text-sm mt-1">
                    {errors.request_body}
                  </p>
                )}
              </div>
            )}

            {/* Response Validation */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Response Validation (JSON)
              </label>
              <textarea
                name="response_validation"
                value={formData.response_validation}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-2.5 rounded-lg border font-mono text-sm ${
                  errors.response_validation ? 'border-rose-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                placeholder='{"json_path": "$.data.id", "expected_value": "123"}'
              />
              {errors.response_validation && (
                <p className="text-rose-600 text-sm mt-1">
                  {errors.response_validation}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="cursor-pointer min-w-[140px]  px-8 py-5 border border-[#c9c5c5] rounded-lg bg-gray-200 text-slate-800 hover:bg-gray-300 font-medium transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer min-w-[140px]  px-8 py-5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Service'}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  )
}

export default AddService

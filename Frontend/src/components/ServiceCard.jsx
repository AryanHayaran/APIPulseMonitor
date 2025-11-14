import { useNavigate } from 'react-router-dom'

function ServiceCard({ service }) {
  const navigate = useNavigate()

  const getStatusColor = (status) => {
    if (status) {
      return 'bg-green-100 text-green-800 border-green-200'
    } 
    else {
      return 'bg-red-100 text-red-800 border-red-200'
    }
  }

  const getMethodColor = (method) => {
    const methodUpper = (method || 'GET').toUpperCase()
    switch (methodUpper) {
      case 'GET':
        return 'bg-blue-100 text-blue-800'
      case 'POST':
        return 'bg-green-100 text-green-800'
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800'
      case 'DELETE':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div
      onClick={() => navigate(`/details/${service.service_id || service.id}`)}
      className="bg-white min-h-30 flex flex-col justify-center  rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 hover:border-blue-400 transform hover:-translate-y-1"
    >
      <div className="flex items-start justify-between mb-4 pt-2">
        <h3 className="text-xl font-bold text-gray-800 flex-1">
          {service.name || service.title || 'Unnamed Service'}
        </h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getMethodColor(service.http_method)}`}>
          {(service.http_method || 'GET').toUpperCase()}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 font-medium">Status:</span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(service.is_healthy || service.status)}`}>
            {service.is_healthy ? "Success" : 'Failed'}
          </span>
        </div>

        {service.response_time_ms !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 font-medium">Latency:</span>
            <span className="text-sm font-semibold text-gray-800">
              {service.response_time_ms ? `${service.response_time_ms.toFixed(0)}ms` : 'N/A'}
            </span>
          </div>
        )}


      </div>
    </div>
  )
}

export default ServiceCard


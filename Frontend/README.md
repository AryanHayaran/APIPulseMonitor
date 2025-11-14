# Internal API Monitoring Frontend

A modern React + Vite frontend application for monitoring and managing internal API services. This application provides a comprehensive dashboard to track API health, latency, logs, and incidents.

## Features

- 🔐 **Authentication** - Secure login and signup with cookie-based sessions
- 📊 **Dashboard** - View all monitored API services at a glance
- 📈 **Latency Graphs** - Visualize API performance over time with interactive charts
- 📝 **Service Management** - Full CRUD operations for API services
- 🔍 **Detailed Monitoring** - View service configuration, performance metrics, and validation rules
- 📋 **Logs** - Comprehensive logging with timestamps, status codes, and latency
- ⚠️ **Incidents** - Track and analyze API failures and issues
- 🎨 **Modern UI** - Beautiful, responsive design with TailwindCSS
- 🔔 **Notifications** - Toast notifications for user feedback

## Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite 7
- **Routing**: React Router DOM v7
- **Styling**: TailwindCSS 4
- **Charts**: Recharts
- **Notifications**: React Toastify
- **HTTP Client**: Fetch API

## Prerequisites

Before running this application, ensure you have:

- Node.js (v18 or higher)
- npm or yarn
- Backend API running on `http://localhost:8000`

## Installation

1. Clone the repository or navigate to the project directory:

```bash
cd InternalApiMonitoringFrontend
```

2. Install dependencies:

```bash
npm install
```

## Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

### Production Build

Build the application for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation bar
│   ├── ServiceCard.jsx # Service display card
│   ├── LatencyGraph.jsx# Latency visualization
│   └── Modal.jsx       # Confirmation modal
├── pages/              # Page components
│   ├── Home/          # Dashboard/home page
│   ├── Login/         # Login page
│   ├── Signup/        # Registration page
│   ├── Logout/        # Logout handler
│   ├── Details/       # Service details page
│   ├── Logs/          # Service logs page
│   ├── Incidents/     # Incident logs page
│   ├── AddService/    # Add new service page
│   └── EditService/   # Edit service page
├── context/           # React context
│   ├── AuthContext.jsx# Authentication context
│   └── useAuth.js     # Auth hook
├── services/          # API service layer
│   ├── authService.js # Authentication APIs
│   └── apiService.js  # Service management APIs
├── config/            # Configuration
│   └── api.js        # API endpoints and base URL
├── App.jsx           # Main app component with routing
└── main.jsx          # Application entry point
```

## API Endpoints

The frontend integrates with the following backend endpoints:

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Services
- `GET /api/services` - Get all services
- `POST /api/services/service` - Create new service
- `GET /api/services/service/:id` - Get specific service
- `GET /api/services/service_details/:id` - Get detailed service info
- `PUT /api/services/service/:id` - Update service
- `DELETE /api/services/service/:id` - Delete service
- `GET /api/services/service/:id/logs` - Get service logs
- `GET /api/services/service/:id/incident-logs` - Get incident logs

## Usage Guide

### 1. Authentication

**Sign Up:**
- Navigate to the signup page
- Enter your full name, email, and password
- Click "Sign up" to create your account

**Login:**
- Navigate to the login page
- Enter your email and password
- Click "Sign in" to access the dashboard

### 2. Dashboard

After logging in, you'll see:
- All your monitored API services displayed as cards
- Service status, method, and latency information
- "Add New Service" button to create a new service

### 3. Adding a Service

Click "Add New Service" and fill in:
- **Service Name**: Descriptive name for your API
- **HTTP Method**: GET, POST, PUT, DELETE, or PATCH
- **URL**: Complete API endpoint URL
- **Request Headers**: JSON object with headers
- **Request Body**: JSON body (for POST/PUT/PATCH)
- **Expected Status Code**: HTTP status code you expect
- **Expected Latency**: Maximum acceptable latency in ms
- **Check Interval**: How often to check (in seconds)
- **Response Validation**: JSON validation rules

### 4. Service Details

Click on any service card to view:
- Service configuration and settings
- Performance metrics
- Latency graph (last 15 checks)
- Request headers and body
- Response validation rules

**Actions available:**
- **View Logs**: See all check logs
- **View Incidents**: See failure logs
- **Edit Service**: Modify configuration
- **Delete Service**: Remove the service

### 5. Logs

View comprehensive logs including:
- Timestamp of each check
- Status code received
- Latency measurement
- Success/failure result

### 6. Incidents

Track failures with:
- Timestamp of incident
- Duration of the issue
- Status code
- Error message details

## Configuration

### API Base URL

To change the backend API URL, edit `src/config/api.js`:

```javascript
export const API_BASE_URL = 'http://localhost:8000/api'
```

For production, update this to your production backend URL.

## Styling

The application uses TailwindCSS 4 for styling. To customize the design:

1. Modify `src/index.css` for global styles
2. Update component classes for specific changes
3. Add custom Tailwind configurations if needed

## Features in Detail

### Authentication
- Cookie-based session management
- Automatic token refresh
- Secure logout with server cleanup
- Protected routes

### Dashboard
- Real-time service status
- Color-coded health indicators
- Quick navigation to service details
- Responsive grid layout

### Service Management
- Form validation for all inputs
- JSON syntax validation
- Support for all HTTP methods
- Flexible configuration options

### Monitoring
- Visual latency graphs using Recharts
- Historical data display
- Performance metrics tracking
- Success/failure tracking

### User Experience
- Loading states for all operations
- Error handling with toast notifications
- Confirmation modals for destructive actions
- Responsive design for all screen sizes

## Troubleshooting

### Backend Connection Issues

If you see "Network error: Unable to connect to the server":
1. Ensure the backend is running on `http://localhost:8000`
2. Check if CORS is properly configured on the backend
3. Verify the API base URL in `src/config/api.js`

### Authentication Issues

If login/signup isn't working:
1. Check browser console for errors
2. Verify cookies are enabled in your browser
3. Ensure the backend is setting cookies correctly
4. Check the session flag in browser DevTools > Application > Cookies

### Missing Data

If services aren't loading:
1. Verify you're logged in
2. Check the backend is returning the correct data format
3. Look for errors in the browser console
4. Ensure the backend API is accessible

## Development

### Adding New Features

1. Create new components in `src/components/`
2. Add new pages in `src/pages/`
3. Update routing in `src/App.jsx`
4. Add API calls in `src/services/`

### Code Style

- Use functional components with hooks
- Follow React best practices
- Keep components small and focused
- Use meaningful variable names
- Add comments for complex logic

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is for internal use only.

## Support

For issues or questions, please contact your development team.

---

**Happy Monitoring!** 🚀

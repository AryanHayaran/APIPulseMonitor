import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import Logout from './pages/Logout/Logout'
import Details from './pages/Details/Details'
import Logs from './pages/Logs/Logs'
import Incidents from './pages/Incidents/Incidents'
import AddService from './pages/AddService/AddService'
import EditService from './pages/EditService/EditService'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/details/:id" element={<Details />} />
          <Route path="/logs/:id" element={<Logs />} />
          <Route path="/incidents/:id" element={<Incidents />} />
          <Route path="/add-service" element={<AddService />} />
          <Route path="/edit-service/:id" element={<EditService />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

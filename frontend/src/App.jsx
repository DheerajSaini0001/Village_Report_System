import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import Dashboard from './pages/Dashboard';
import Report from './pages/Report';
import AdminDashboard from './pages/AdminDashboard';
import HowItWorks from './pages/HowItWorks';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col transition-colors duration-300">
          
          {/* NAVBAR */}
          <Navbar />

          {/* ✅ GLOBAL OFFSET FOR STICKY NAVBAR */}
          <main className="flex-grow pt-16">
            <Routes>
              {/* PUBLIC ROUTES */}
              <Route path="/" element={<Home />} />
              <Route path="/landing" element={<Home />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* PROTECTED ROUTES */}
              <Route
                path="/feed"
                element={
                  <ProtectedRoute>
                    <Feed />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/report"
                element={
                  <ProtectedRoute>
                    <Report />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          {/* FOOTER */}
          <Footer />

          {/* TOASTS */}
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

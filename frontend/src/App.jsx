import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProductListingPage from './pages/ProductListingPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import CartPage from './pages/CartPage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import OrderTrackingPage from './pages/OrderTrackingPage'
import AdminDashboard from './pages/AdminDashboard'

function ProtectedRoute({ children, adminOnly }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#0b0b0b]"><div className="skeleton-dark w-16 h-16 rounded-full" /></div>
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/" replace />
  return children
}

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
)

export default function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white selection:bg-[#E50914] selection:text-white font-sans">
      <Navbar />
      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
            <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
            <Route path="/register" element={<PageWrapper><RegisterPage /></PageWrapper>} />
            <Route path="/products" element={<PageWrapper><ProductListingPage /></PageWrapper>} />
            <Route path="/products/:id" element={<PageWrapper><ProductDetailsPage /></PageWrapper>} />
            <Route path="/cart" element={<ProtectedRoute><PageWrapper><CartPage /></PageWrapper></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><PageWrapper><OrderHistoryPage /></PageWrapper></ProtectedRoute>} />
            <Route path="/orders/:id" element={<ProtectedRoute><PageWrapper><OrderTrackingPage /></PageWrapper></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><PageWrapper><AdminDashboard /></PageWrapper></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  )
}

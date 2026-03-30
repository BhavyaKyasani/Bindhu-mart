import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function LoginPage() {
    const [credentials, setCredentials] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await login(credentials)
            toast.success('Welcome back to Bindu Mart!', {
                style: { background: '#1c1c1c', color: '#fff', border: '1px solid #E50914' }
            })
            navigate(location.state?.from || '/')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid credentials')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden">
            {/* Background Image with Dark Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2070&auto=format&fit=crop"
                    className="w-full h-full object-cover opacity-30"
                    alt="bg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-[450px] bg-black/75 p-10 md:p-16 rounded-lg shadow-2xl backdrop-blur-sm border border-white/5"
            >
                <h1 className="text-3xl font-black mb-8 tracking-tight">Sign In</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email"
                            required
                            className="netflix-input"
                            value={credentials.email}
                            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            className="netflix-input"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-netflix justify-center py-4 text-lg"
                    >
                        {loading ? 'Entering...' : 'Sign In'}
                    </button>

                    <div className="flex items-center justify-between text-gray-500 text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="accent-netflix-red w-4 h-4" /> Remember me
                        </label>
                        <a href="#" className="hover:underline">Need help?</a>
                    </div>
                </form>

                <div className="mt-16 space-y-4">
                    <p className="text-gray-500 font-medium">
                        New to Bindu Mart? <Link to="/register" className="text-white hover:underline">Sign up now.</Link>
                    </p>
                    <p className="text-[11px] text-gray-500 leading-tight">
                        This page is protected by Google reCAPTCHA to ensure you're not a bot.
                        <span className="text-blue-600 hover:underline cursor-pointer ml-1">Learn more.</span>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../services/api'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function RegisterPage() {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (formData.password !== formData.confirmPassword) return toast.error('Passwords do not match')

        setLoading(true)
        try {
            await register(formData)
            toast.success('Cinematic membership created!', {
                style: { background: '#1c1c1c', color: '#fff', border: '1px solid #E50914' }
            })
            navigate('/login')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center py-24 px-4 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2070&auto=format&fit=crop"
                    className="w-full h-full object-cover opacity-20"
                    alt="bg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-[500px] bg-black/80 p-10 md:p-14 rounded-lg shadow-2xl backdrop-blur-sm border border-white/5"
            >
                <h1 className="text-3xl font-black mb-8 tracking-tight">Create Membership</h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <input
                        type="text"
                        placeholder="Full Name"
                        required
                        className="netflix-input"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <input
                        type="email"
                        placeholder="Email Address"
                        required
                        className="netflix-input"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <input
                        type="tel"
                        placeholder="Phone Number"
                        required
                        className="netflix-input"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Create Password"
                        required
                        className="netflix-input"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        required
                        className="netflix-input"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-netflix justify-center py-4 text-lg mt-4"
                    >
                        {loading ? 'Joining...' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-10 text-gray-500 font-medium text-center">
                    Already a member? <Link to="/login" className="text-white hover:underline">Sign in here.</Link>
                </div>
            </motion.div>
        </div>
    )
}

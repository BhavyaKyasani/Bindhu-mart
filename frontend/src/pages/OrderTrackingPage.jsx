import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getOrderById } from '../services/api'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { ChevronLeftIcon, MapPinIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

const STEPS = [
    { status: 'PLACED', label: 'Order Placed', icon: '🛒' },
    { status: 'PREPARING', label: 'Preparing', icon: '🔪' },
    { status: 'DISPATCHED', label: 'On The Way', icon: '🚚' },
    { status: 'DELIVERED', label: 'Delivered', icon: '🏠' }
]

export default function OrderTrackingPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadOrder()
        const interval = setInterval(loadOrder, 30000)
        return () => clearInterval(interval)
    }, [id])

    const loadOrder = async () => {
        try {
            const res = await getOrderById(id)
            setOrder(res.data.data)
        } catch {
            toast.error('Failed to track order')
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="min-h-screen bg-[#0b0b0b] pt-40 px-4 md:px-12 text-center"><div className="skeleton-dark h-64 w-full max-w-4xl mx-auto rounded-3xl" /></div>
    if (!order) return null

    const currentStepIdx = STEPS.findIndex(s => s.status === order.orderStatus)

    return (
        <div className="min-h-screen bg-[#0b0b0b] pt-32 pb-20 px-4 md:px-12">
            <div className="max-w-[1000px] mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
                >
                    <ChevronLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back
                </button>

                <div className="bg-[#141414] rounded-3xl p-8 md:p-12 border border-white/5 shadow-2xl space-y-12">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="space-y-2">
                            <span className="text-netflix-red font-black tracking-widest text-xs uppercase">Tracking Production</span>
                            <h1 className="text-4xl font-black tracking-tighter">Order #{order.id}</h1>
                            <p className="text-gray-500 font-medium flex items-center gap-2">
                                <ClockIcon className="w-4 h-4" /> Estimated arrival in 22 mins
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-500 text-sm uppercase tracking-widest font-bold">Total Bill</p>
                            <p className="text-3xl font-black text-white">₹{parseFloat(order.totalAmount).toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative pt-8 pb-12">
                        <div className="absolute top-[60px] left-0 w-full h-1 bg-white/5 rounded-full" />
                        <div
                            className="absolute top-[60px] left-0 h-1 bg-netflix-red rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(229,9,20,0.5)]"
                            style={{ width: `${(currentStepIdx / (STEPS.length - 1)) * 100}%` }}
                        />

                        <div className="grid grid-cols-4 relative z-10">
                            {STEPS.map((step, idx) => (
                                <div key={step.status} className="flex flex-col items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-500 ${idx <= currentStepIdx ? 'bg-netflix-red text-white scale-110 shadow-lg' : 'bg-gray-800 text-gray-500'}`}>
                                        {idx < currentStepIdx ? <CheckCircleIcon className="w-6 h-6" /> : step.icon}
                                    </div>
                                    <p className={`text-[10px] md:text-xs font-black uppercase tracking-widest text-center ${idx <= currentStepIdx ? 'text-white' : 'text-gray-600'}`}>
                                        {step.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="border-t border-white/5 pt-12">
                        <h2 className="text-xl font-bold mb-8">Production Inventory</h2>
                        <div className="space-y-6">
                            {order.orderItems?.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-lg bg-black border border-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                            {item.productImageUrl ? (
                                                <img src={item.productImageUrl} alt="" className="w-full h-full object-cover" />
                                            ) : <span className="text-xl">🥬</span>}
                                        </div>
                                        <div>
                                            <p className="font-bold group-hover:text-netflix-red transition-colors">{item.productName}</p>
                                            <p className="text-xs text-gray-500">{item.quantity} x ₹{item.price}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold">₹{(item.quantity * item.price).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-8 flex flex-col md:flex-row gap-4">
                        <div className="flex-1 bg-black/40 p-6 rounded-2xl border border-white/5 flex items-center gap-4">
                            <MapPinIcon className="w-8 h-8 text-netflix-red flex-shrink-0" />
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Delivery Address</p>
                                <p className="text-sm font-medium">Home • 123 Cinematic Lane, Studio 5, Mumbai</p>
                            </div>
                        </div>
                        <button className="btn-netflix px-10 py-5 text-sm uppercase tracking-widest">
                            Need Help?
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

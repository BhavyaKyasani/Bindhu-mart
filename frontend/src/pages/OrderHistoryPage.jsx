import { useState, useEffect } from 'react'
import { getMyOrders } from '../services/api'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CalendarIcon, CurrencyRupeeIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'

const STATUS_COLOR = {
    PLACED: 'border-yellow-500 text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.2)]',
    PREPARING: 'border-orange-500 text-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.2)]',
    DISPATCHED: 'border-blue-500 text-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.2)]',
    DELIVERED: 'border-green-500 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.2)]',
    CANCELLED: 'border-red-500 text-red-500',
}

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadOrders()
    }, [])

    const loadOrders = async () => {
        setLoading(true)
        try {
            const res = await getMyOrders()
            setOrders(res.data.data?.content || res.data.data || [])
        } catch {
            toast.error('Failed to retrieve order history')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0b0b0b] pt-32 pb-20 px-4 md:px-12">
            <div className="max-w-[1200px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <h1 className="text-4xl font-black tracking-tighter">Cinematic History</h1>
                    <Link to="/products" className="btn-netflix py-2 px-6 text-sm">Continue Shopping</Link>
                </div>

                {loading ? (
                    <div className="grid gap-6">
                        {[1, 2, 3].map(i => <div key={i} className="h-48 skeleton-dark rounded-2xl" />)}
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {orders.map((order, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={order.id}
                                className="bg-[#141414] rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-colors shadow-2xl"
                            >
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-gray-500 font-medium whitespace-nowrap">Order #{order.id}</span>
                                            <span className={`px-3 py-1 text-[10px] font-black border rounded-full uppercase tracking-widest ${STATUS_COLOR[order.orderStatus]}`}>
                                                {order.orderStatus}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold flex items-center gap-2">
                                            <CurrencyRupeeIcon className="w-5 h-5 text-netflix-red" />
                                            {parseFloat(order.totalAmount).toFixed(2)}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <CalendarIcon className="w-4 h-4" />
                                                {new Date(order.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                            <div className="flex items-center gap-1 font-bold text-white">
                                                <ShoppingBagIcon className="w-4 h-4" />
                                                {order.orderItems?.length || 0} Items
                                            </div>
                                        </div>
                                    </div>

                                    {/* Preview Thumbnails */}
                                    <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
                                        {order.orderItems?.slice(0, 4).map((item, i) => (
                                            <div key={i} className="w-16 h-16 rounded-xl bg-black border border-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                                {item.productImageUrl ? (
                                                    <img src={item.productImageUrl} alt="" className="w-full h-full object-cover" />
                                                ) : <span className="text-xl">🥬</span>}
                                            </div>
                                        ))}
                                        {(order.orderItems?.length || 0) > 4 && (
                                            <div className="w-16 h-16 rounded-xl bg-netflix-dark border border-white/10 flex items-center justify-center text-xs font-bold text-gray-500">
                                                +{order.orderItems.length - 4}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center">
                                        <Link
                                            to={`/orders/${order.id}`}
                                            className="w-full md:w-auto text-center px-8 py-3 bg-white/5 border border-white/10 rounded-lg font-bold text-sm hover:bg-white/10 transition-colors"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {orders.length === 0 && (
                            <div className="text-center py-24 bg-[#141414] rounded-2xl border border-white/5">
                                <p className="text-gray-500 text-lg">You haven't placed any orders yet.</p>
                                <button onClick={() => navigate('/products')} className="mt-4 text-netflix-red font-bold hover:underline">Browse the catalog</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

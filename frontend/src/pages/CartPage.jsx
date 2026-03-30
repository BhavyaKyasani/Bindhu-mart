import { useCart } from '../context/CartContext'
import { placeOrder } from '../services/api'
import { TrashIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export default function CartPage() {
    const { cartItems, loadCart, updateQuantity, removeFromCart, cartTotal } = useCart()
    const navigate = useNavigate()
    const [checkingOut, setCheckingOut] = useState(false)

    const handleCheckout = async () => {
        setCheckingOut(true)
        try {
            await placeOrder()
            toast.success('Cinematic order placed successfully!', {
                style: { background: '#1c1c1c', color: '#fff', border: '1px solid #E50914' }
            })
            loadCart()
            navigate('/orders')
        } catch (err) {
            toast.error('Checkout failed')
        } finally {
            setCheckingOut(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0b0b0b] pt-32 pb-20 px-4 md:px-12">
            <div className="max-w-[1000px] mx-auto">
                <h1 className="text-4xl font-black mb-12 tracking-tighter">Your Shopping Bag</h1>

                <div className="grid lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-6">
                        <AnimatePresence mode="popLayout">
                            {cartItems.map(item => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-[#141414] p-6 rounded-xl flex flex-col sm:flex-row items-center gap-6 border border-white/5 hover:border-white/10 transition-colors"
                                >
                                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-black flex-shrink-0 flex items-center justify-center">
                                        {item.productImageUrl ? (
                                            <img
                                                src={item.productImageUrl}
                                                alt={item.productName}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                            />
                                        ) : null}
                                        <div className="hidden absolute inset-0 flex items-center justify-center text-2xl">🥬</div>
                                    </div>

                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="font-bold text-lg">{item.productName}</h3>
                                        <p className="text-netflix-red font-bold">₹{item.price}</p>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center bg-black/40 rounded border border-white/5">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-2 hover:text-netflix-red transition-colors disabled:opacity-10"
                                                disabled={item.quantity <= 1}
                                            >
                                                <MinusIcon className="w-4 h-4" />
                                            </button>
                                            <span className="w-8 text-center font-bold">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-2 hover:text-netflix-red transition-colors"
                                            >
                                                <PlusIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="p-2 text-gray-500 hover:text-white transition-colors"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {cartItems.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-20 bg-[#141414] rounded-2xl border border-dashed border-white/10"
                            >
                                <ShoppingBagIcon className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                                <p className="text-gray-500 font-medium text-lg">Your bag is empty. Start your fresh shopping journey!</p>
                                <button onClick={() => navigate('/products')} className="mt-6 text-netflix-red font-black hover:underline">Explore Products</button>
                            </motion.div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#141414] p-8 rounded-2xl border border-white/5 sticky top-32 space-y-6">
                            <h2 className="text-xl font-bold border-b border-white/5 pb-4">Order Summary</h2>
                            <div className="space-y-4 text-gray-400">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="text-white font-bold">₹{cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-medium">
                                    <span>Delivery Fee</span>
                                    <span className="text-green-500">FREE</span>
                                </div>
                                <div className="flex justify-between text-xl font-black border-t border-white/5 pt-4 text-white">
                                    <span>Total</span>
                                    <span>₹{cartTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={cartItems.length === 0 || checkingOut}
                                className="w-full btn-netflix py-4 text-lg justify-center mt-6 disabled:bg-gray-800 disabled:opacity-50"
                            >
                                {checkingOut ? 'Processing...' : 'Secure Checkout'}
                            </button>

                            <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest font-bold">
                                Safe & Secure Cinematic Payments
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

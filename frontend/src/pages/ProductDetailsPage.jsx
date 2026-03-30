import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductById, addToCart } from '../services/api'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { PlusIcon, MinusIcon, ShoppingBagIcon, ChevronLeftIcon } from '@heroicons/react/24/outline'

export default function ProductDetailsPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { loadCart } = useCart()
    const [product, setProduct] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [loading, setLoading] = useState(true)
    const [adding, setAdding] = useState(false)

    useEffect(() => {
        loadProduct()
    }, [id])

    const loadProduct = async () => {
        setLoading(true)
        try {
            const res = await getProductById(id)
            setProduct(res.data.data)
        } catch (err) {
            toast.error('Product not found in database')
        } finally {
            setLoading(false)
        }
    }

    const handleAddToCart = async () => {
        setAdding(true)
        try {
            await addToCart({ productId: product.id, quantity })
            toast.success(`${quantity} ${product.name} added to cart!`, {
                style: { background: '#1c1c1c', color: '#fff', border: '1px solid #E50914' }
            })
            loadCart()
        } catch (err) {
            toast.error('Failed to add to cart')
        } finally {
            setAdding(false)
        }
    }

    if (loading) return (
        <div className="max-w-[1800px] mx-auto px-4 md:px-12 py-32 grid md:grid-cols-2 gap-12">
            <div className="aspect-square skeleton-dark rounded-3xl" />
            <div className="space-y-6">
                <div className="h-10 w-3/4 skeleton-dark rounded" />
                <div className="h-6 w-1/4 skeleton-dark rounded" />
                <div className="h-32 w-full skeleton-dark rounded" />
            </div>
        </div>
    )

    if (!product) return null

    return (
        <div className="min-h-screen bg-[#0b0b0b]">
            <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-20 md:py-32">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
                >
                    <ChevronLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back
                </button>

                <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Cinematic Product Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#141414] to-black aspect-square flex items-center justify-center border border-white/5 netflix-card-shadow"
                    >
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                            />
                        ) : null}
                        <div className="hidden absolute inset-0 flex items-center justify-center text-[150px]">🥬</div>

                        {product.stock === 0 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <span className="bg-netflix-red text-white text-2xl font-black px-8 py-3 rounded-sm uppercase tracking-tighter">Sold Out</span>
                            </div>
                        )}
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <span className="text-netflix-red font-black tracking-widest text-sm uppercase">Fresh Category</span>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter">{product.name}</h1>
                            <div className="flex items-center gap-6">
                                <span className="text-3xl font-bold">₹{product.price}</span>
                                <span className="px-3 py-1 bg-white/10 text-gray-400 text-sm font-bold rounded">{product.unit || '1 Unit'}</span>
                                {product.stock > 0 && <span className="text-green-500 text-sm font-bold">● In Stock ({product.stock})</span>}
                            </div>
                        </div>

                        <p className="text-gray-400 text-lg leading-relaxed">
                            {product.description || 'No detailed description available for this item. Guaranteed fresh and hand-picked for your kitchen.'}
                        </p>

                        <div className="pt-8 space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center bg-[#141414] rounded-lg border border-white/10">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="p-4 hover:text-netflix-red transition-colors disabled:opacity-20"
                                        disabled={quantity <= 1}
                                    >
                                        <MinusIcon className="w-5 h-5" />
                                    </button>
                                    <span className="w-12 text-center font-bold text-xl">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                                        className="p-4 hover:text-netflix-red transition-colors disabled:opacity-20"
                                        disabled={quantity >= product.stock}
                                    >
                                        <PlusIcon className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="text-gray-500 font-medium">
                                    Subtotal: <span className="text-white font-bold ml-1">₹{(product.price * quantity).toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0 || adding}
                                className="w-full md:w-auto min-w-[300px] btn-netflix py-5 px-10 text-xl justify-center disabled:bg-gray-800 disabled:opacity-50 disabled:scale-100"
                            >
                                <ShoppingBagIcon className="w-6 h-6" /> {adding ? 'Adding...' : 'Add to Cart'}
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 border-t border-white/5 pt-8">
                            <p>● Express Delivery in 30min</p>
                            <p>● 100% Organic Quality</p>
                            <p>● Free returns on freshness</p>
                            <p>● Safe & Contactless</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

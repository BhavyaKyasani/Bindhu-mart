import { motion, AnimatePresence } from 'framer-motion'
import { PlusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'
import { useState } from 'react'

export default function ProductCard({ product, widthClass = "w-full" }) {
    const navigate = useNavigate()
    const { addToCart } = useCart()
    const [isHovered, setIsHovered] = useState(false)

    const handleAdd = async (e) => {
        e.stopPropagation()
        try {
            await addToCart({ productId: product.id, quantity: 1 })
            toast.success(`${product.name} added to cart!`, {
                style: { background: '#1c1c1c', color: '#fff', border: '1px solid #E50914' },
                iconTheme: { primary: '#E50914', secondary: '#fff' }
            })
        } catch (err) {
            toast.error('Failed to add to cart')
        }
    }

    return (
        <motion.div
            className={`flex-shrink-0 ${widthClass} cursor-pointer relative group`}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={() => navigate(`/products/${product.id}`)}
        >
            <div className="relative aspect-[2/3] md:aspect-video rounded-md overflow-hidden bg-[#141414] netflix-card-shadow border border-white/5 group-hover:border-white/20">
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                ) : null}
                <div className="hidden absolute inset-0 flex items-center justify-center bg-gradient-to-br from-netflix-dark to-black text-4xl">
                    🥬
                </div>

                {/* Hover Details Overlay */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 flex flex-col justify-end p-4 gap-2 backdrop-blur-[2px]"
                        >
                            <motion.button
                                initial={{ y: 20 }}
                                animate={{ y: 0 }}
                                onClick={handleAdd}
                                className="w-full bg-white text-black py-2 rounded-full font-bold text-xs flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                            >
                                <PlusIcon className="w-4 h-4" /> Add
                            </motion.button>
                            <motion.button
                                initial={{ y: 20 }}
                                animate={{ y: 0 }}
                                onClick={() => navigate(`/products/${product.id}`)}
                                className="w-full bg-gray-500/50 text-white py-2 rounded-full font-bold text-xs flex items-center justify-center gap-2 backdrop-blur-md hover:bg-gray-500/70 transition-colors"
                            >
                                <InformationCircleIcon className="w-4 h-4" /> Details
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {product.stock < 10 && product.stock > 0 && (
                    <span className="absolute top-2 right-2 bg-orange-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-lg">Low Stock</span>
                )}
                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="bg-netflix-red text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-tighter">Out of Stock</span>
                    </div>
                )}
            </div>

            <div className="mt-3 px-1">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-sm md:text-base text-gray-100 line-clamp-1 group-hover:text-white transition-colors">
                        {product.name}
                    </h3>
                    <span className="font-black text-netflix-red whitespace-nowrap">₹{product.price}</span>
                </div>
                <p className="text-xs text-gray-500 font-medium">{product.unit || '1 Unit'}</p>
            </div>
        </motion.div>
    )
}

function InformationCircleIcon({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.835m0 0A3 3 0 1 0 14.73 18m-2.724-4.5h3.45m2.704-9.602a2.25 2.25 0 1 1 3.182 3.182m-12.182-1.25V7.5a2.25 2.25 0 0 1 2.25 2.25h1.25" />
        </svg>
    )
}

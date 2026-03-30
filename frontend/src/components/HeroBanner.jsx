import { motion } from 'framer-motion'
import { PlayIcon, InformationCircleIcon } from '@heroicons/react/24/solid'
import { useNavigate } from 'react-router-dom'

export default function HeroBanner() {
    const navigate = useNavigate()

    return (
        <section className="relative h-[85vh] w-full group overflow-hidden">
            {/* Background Image with Cinematic Zoom */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2070&auto=format&fit=crop"
                    alt="Hero"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[10000ms] ease-out"
                />
                {/* Cinematic Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-transparent to-black/20" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center px-4 md:px-12 max-w-[1800px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="max-w-2xl space-y-6"
                >
                    <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-netflix-red rounded-sm flex items-center justify-center text-[10px] font-bold">G</span>
                        <span className="text-gray-400 font-bold tracking-[0.3em] text-xs uppercase">Original</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter drop-shadow-2xl">
                        FRESH <br />
                        <span className="text-netflix-red">ARRIVALS</span>
                    </h1>

                    <p className="text-lg text-gray-200 font-medium drop-shadow-lg max-w-lg leading-relaxed">
                        Discover the harvest of the season. Hand-picked organic vegetables,
                        sun-ripened fruits, and daily essentials delivered at lightning speed.
                    </p>

                    <div className="flex items-center gap-4 pt-4">
                        <button
                            onClick={() => navigate('/products')}
                            className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded font-bold hover:bg-white/90 transition-all scale-100 hover:scale-105"
                        >
                            <PlayIcon className="w-6 h-6" /> Shop Now
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Badge for featured item */}
            <div className="absolute bottom-10 right-0 py-2 pl-4 pr-10 bg-white/10 border-l-4 border-netflix-red backdrop-blur-md hidden md:block">
                <p className="text-xs uppercase tracking-widest font-bold opacity-60">Featured Category</p>
                <p className="text-xl font-bold italic tracking-tight">Seasonal Organic Harvest</p>
            </div>
        </section>
    )
}

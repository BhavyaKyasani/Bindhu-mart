import { useRef } from 'react'
import ProductCard from './ProductCard'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

export default function ProductCarousel({ title, products, loading }) {
    const scrollRef = useRef(null)

    const scroll = (direction) => {
        const { current } = scrollRef
        if (current) {
            const scrollAmount = direction === 'left' ? -500 : 500
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
        }
    }

    if (loading) {
        return (
            <div className="space-y-4 mb-10">
                <div className="h-6 w-48 skeleton-dark rounded ml-4 md:ml-12" />
                <div className="flex gap-4 overflow-hidden px-4 md:px-12">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="flex-shrink-0 w-56 aspect-video skeleton-dark rounded-md" />
                    ))}
                </div>
            </div>
        )
    }

    if (products.length === 0) return null

    return (
        <div className="space-y-4 mb-10 relative group/row">
            <h2 className="text-xl md:text-2xl font-black px-4 md:px-12 tracking-tight flex items-center gap-2 group cursor-pointer hover:text-white transition-colors">
                {title}
                <ChevronRightIcon className="w-5 h-5 text-netflix-red opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
            </h2>

            <div className="relative">
                {/* Scroll Buttons */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-0 bottom-0 z-20 w-12 bg-black/50 opacity-0 group-hover/row:opacity-100 disabled:opacity-0 hover:bg-black/70 flex items-center justify-center transition-all"
                >
                    <ChevronLeftIcon className="w-8 h-8 text-white" />
                </button>

                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto px-4 md:px-12 hide-scrollbar py-4"
                >
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} widthClass="w-40 md:w-56 lg:w-64" />
                    ))}
                </div>

                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-0 bottom-0 z-20 w-12 bg-black/50 opacity-0 group-hover/row:opacity-100 disabled:opacity-0 hover:bg-black/70 flex items-center justify-center transition-all"
                >
                    <ChevronRightIcon className="w-8 h-8 text-white" />
                </button>
            </div>
        </div>
    )
}

import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getProducts, getCategories } from '../services/api'
import ProductCard from '../components/ProductCard'
import Footer from '../components/Footer'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function ProductListingPage() {
    const [searchParams] = useSearchParams()
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [selectedCat, setSelectedCat] = useState('')
    const [loading, setLoading] = useState(true)

    const query = searchParams.get('search') || ''

    useEffect(() => {
        loadData()
    }, [query, selectedCat])

    const loadData = async () => {
        setLoading(true)
        try {
            const [pRes, cRes] = await Promise.all([
                getProducts({ search: query, categoryId: selectedCat, size: 100 }),
                getCategories()
            ])
            setProducts(pRes.data.data?.content || [])
            setCategories(cRes.data.data || [])
        } catch {
            toast.error('Failed to load products')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0b0b0b] pt-32 pb-20">
            <div className="max-w-[1800px] mx-auto px-4 md:px-12">

                {/* Header & Filter */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                            {query ? `Results for "${query}"` : 'Browse Everything'}
                        </h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 bg-[#141414] px-4 py-2.5 rounded-md border border-white/5">
                            <FunnelIcon className="w-4 h-4 text-gray-500" />
                            <select
                                value={selectedCat}
                                onChange={(e) => setSelectedCat(e.target.value)}
                                className="bg-transparent border-none outline-none text-sm font-bold text-gray-300 cursor-pointer hover:text-white transition-colors"
                            >
                                <option value="" className="bg-[#141414]">All Categories</option>
                                {categories.map(c => <option key={c.id} value={c.id} className="bg-[#141414]">{c.name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
                            <div key={i} className="space-y-4">
                                <div className="aspect-[2/3] skeleton-dark rounded-md" />
                                <div className="h-4 w-3/4 skeleton-dark rounded" />
                                <div className="h-4 w-1/4 skeleton-dark rounded" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 md:gap-x-8 gap-y-12">
                            <AnimatePresence>
                                {products.map((p, idx) => (
                                    <motion.div
                                        key={p.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        <ProductCard product={p} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {products.length === 0 && (
                            <div className="text-center py-40 bg-[#141414] rounded-3xl border border-dashed border-white/5">
                                <MagnifyingGlassIcon className="w-16 h-16 text-gray-800 mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">No matches found</h3>
                                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                                <button onClick={() => { setSelectedCat(''); setProducts([]); }} className="mt-8 text-netflix-red font-bold hover:underline">Clear all filters</button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="mt-40">
                <Footer />
            </div>
        </div>
    )
}

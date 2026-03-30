import { useState, useEffect } from 'react'
import { getProducts, getCategories, getFeaturedProducts } from '../services/api'
import HeroBanner from '../components/HeroBanner'
import ProductCarousel from '../components/ProductCarousel'
import Footer from '../components/Footer'
import toast from 'react-hot-toast'

export default function LandingPage() {
    const [categories, setCategories] = useState([])
    const [categoryRows, setCategoryRows] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        try {
            const catRes = await getCategories()

            const cats = catRes.data.data || []
            setCategories(cats)

            // Load first 4 categories data
            const rowData = {}
            await Promise.all(cats.slice(0, 4).map(async (cat) => {
                try {
                    const res = await getProducts({ categoryId: cat.id, size: 10 })
                    rowData[cat.name] = res.data.data?.content || []
                } catch { }
            }))
            setCategoryRows(rowData)
        } catch (err) {
            toast.error('Failed to load catalog')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-[#0b0b0b] min-h-screen pb-20">
            <HeroBanner />

            <div className="relative z-10 -mt-8 pb-20 pt-8">


                {Object.entries(categoryRows).map(([name, products]) => (
                    <ProductCarousel
                        key={name}
                        title={name}
                        products={products}
                        loading={loading}
                    />
                ))}

                {/* Additional segments to mimic Netflix complexity if data is sparse */}
                {loading && (
                    <>
                        <ProductCarousel title="Fresh Fruits" products={[]} loading={true} />
                        <ProductCarousel title="Daily Essentials" products={[]} loading={true} />
                    </>
                )}
            </div>

            <Footer />
        </div>
    )
}

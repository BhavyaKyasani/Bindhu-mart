import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { MagnifyingGlassIcon, ShoppingCartIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export default function Navbar() {
    const { user, logout } = useAuth()
    const { cartItems } = useCart()
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenu, setMobileMenu] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
            setMobileMenu(false)
        }
    }

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#0b0b0b] shadow-2xl py-3' : 'bg-gradient-to-b from-black/80 to-transparent py-5'}`}>
            <div className="max-w-[1800px] mx-auto px-4 md:px-12 flex items-center justify-between">
                {/* Left: Logo & Links */}
                <div className="flex items-center gap-10">
                    <Link to="/" className="flex items-center gap-1 group">
                        <span className="text-netflix-red text-3xl font-black tracking-tighter transition-transform group-hover:scale-105">
                            BINDU MART
                        </span>
                    </Link>

                    <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
                        <Link to="/" className="text-white hover:text-gray-300 transition-colors">Home</Link>
                        <Link to="/products" className="text-gray-300 hover:text-white transition-colors">Categories</Link>
                        {user?.role === 'ADMIN' && (
                            <Link to="/admin" className="text-netflix-red font-bold hover:animate-pulse">Admin Panel</Link>
                        )}
                    </div>
                </div>

                {/* Right: Search & Icons */}
                <div className="flex items-center gap-6">
                    <form onSubmit={handleSearch} className="hidden md:flex items-center bg-black/40 border border-white/20 rounded-full px-4 py-1.5 focus-within:border-netflix-red transition-all">
                        <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Titles, products..."
                            className="bg-transparent border-none outline-none text-sm ml-2 w-48 placeholder:text-gray-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>

                    <Link to="/cart" className="relative text-white hover:scale-110 transition-transform">
                        <ShoppingCartIcon className="w-6 h-6" />
                        {cartItems.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-netflix-red text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(229,9,20,0.5)]">
                                {cartItems.length}
                            </span>
                        )}
                    </Link>

                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <div className="group relative">
                                <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                                    <div className="w-8 h-8 rounded bg-netflix-red flex items-center justify-center text-xs font-bold ring-2 ring-transparent group-hover:ring-white/50 transition-all">
                                        {user.name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                </button>
                                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                    <div className="bg-[#141414] border border-white/10 rounded overflow-hidden shadow-2xl min-w-[160px]">
                                        <Link to="/orders" className="block px-4 py-3 text-sm hover:bg-white/10">Order History</Link>
                                        {user.role === 'ADMIN' && <Link to="/admin" className="block px-4 py-3 text-sm hover:bg-white/10">Admin Dashboard</Link>}
                                        <button onClick={logout} className="w-full text-left px-4 py-3 text-sm hover:bg-white/10 text-netflix-red font-bold border-t border-white/5">Sign Out</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="bg-netflix-red px-4 py-1.5 rounded text-sm font-bold hover:bg-[#f40a16] transition-colors">
                                Sign In
                            </Link>
                        )}
                    </div>

                    <button className="md:hidden text-white" onClick={() => setMobileMenu(!mobileMenu)}>
                        {mobileMenu ? <XMarkIcon className="w-8 h-8" /> : <Bars3Icon className="w-8 h-8" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenu && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-[#0b0b0b] border-t border-white/10 animate-slide-down">
                    <div className="p-6 flex flex-col gap-6 font-medium">
                        <Link to="/" onClick={() => setMobileMenu(false)} className="hover:text-netflix-red transition-colors">Home</Link>
                        <Link to="/products" onClick={() => setMobileMenu(false)} className="hover:text-netflix-red transition-colors">Categories</Link>
                        {user && <Link to="/orders" onClick={() => setMobileMenu(false)} className="hover:text-netflix-red transition-colors">Orders</Link>}
                        {user ? (
                            <button onClick={() => { logout(); setMobileMenu(false); }} className="text-left text-netflix-red font-bold underline">Sign Out</button>
                        ) : (
                            <Link to="/login" onClick={() => setMobileMenu(false)} className="text-netflix-red font-bold underline">Sign In</Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}

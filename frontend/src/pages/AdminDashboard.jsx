import React, { useState, useEffect } from 'react'
import { getAdminStats, getProducts, getCategories, getAllOrders, updateOrderStatus, deleteProduct, createProduct, updateProduct, createCategory, updateCategory, deleteCategory } from '../services/api'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusIcon, PencilIcon, TrashIcon, ShoppingBagIcon, ChartBarIcon, CubeIcon, TagIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline'

export default function AdminDashboard() {
    const [stats, setStats] = useState(null)
    const [activeTab, setActiveTab] = useState('products')
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingItem, setEditingItem] = useState(null)
    const [categories, setCategories] = useState([])
    const [expandedOrderId, setExpandedOrderId] = useState(null)
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', stock: '', unit: '', imageUrl: '', categoryId: ''
    })

    const toggleOrderDetails = (id) => {
        setExpandedOrderId(expandedOrderId === id ? null : id)
    }

    useEffect(() => {
        loadStats()
        loadTabContent()
        loadCategories()
    }, [activeTab])

    const loadStats = async () => {
        try {
            const res = await getAdminStats()
            setStats(res.data.data)
        } catch (err) { }
    }

    const loadTabContent = async () => {
        setLoading(true)
        try {
            if (activeTab === 'products') {
                const res = await getProducts({ size: 100 })
                setItems(res.data.data?.content || [])
            } else if (activeTab === 'orders') {
                const res = await getAllOrders({ size: 100 })
                setItems(res.data.data?.content || [])
            } else if (activeTab === 'categories') {
                const res = await getCategories()
                setItems(res.data.data || [])
            }
        } catch (err) {
            toast.error('Failed to load management data')
        } finally {
            setLoading(false)
        }
    }

    const loadCategories = async () => {
        try {
            const res = await getCategories()
            setCategories(res.data.data || [])
        } catch (err) { }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (activeTab === 'products') {
                const dataToSubmit = {
                    ...formData,
                    price: parseFloat(formData.price),
                    stock: parseInt(formData.stock),
                    categoryId: parseInt(formData.categoryId)
                }
                if (editingItem) {
                    await updateProduct(editingItem.id, dataToSubmit)
                    toast.success('Production updated')
                } else {
                    await createProduct(dataToSubmit)
                    toast.success('Production created')
                }
            } else if (activeTab === 'categories') {
                const dataToSubmit = {
                    name: formData.name,
                    imageUrl: formData.imageUrl
                }
                if (editingItem) {
                    await updateCategory(editingItem.id, dataToSubmit)
                    toast.success('Genre updated')
                } else {
                    await createCategory(dataToSubmit)
                    toast.success('Genre created')
                }
            }
            setShowModal(false)
            loadTabContent()
            resetForm()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Action failed')
        }
    }

    const resetForm = () => {
        setFormData({ name: '', description: '', price: '', stock: '', unit: '', imageUrl: '', categoryId: '' })
        setEditingItem(null)
    }

    const handleEdit = (item) => {
        setEditingItem(item)
        if (activeTab === 'products') {
            setFormData({
                name: item.name,
                description: item.description || '',
                price: item.price,
                stock: item.stock,
                unit: item.unit,
                imageUrl: item.imageUrl,
                categoryId: item.categoryId || ''
            })
        } else if (activeTab === 'categories') {
            setFormData({
                ...formData,
                name: item.name,
                imageUrl: item.imageUrl || ''
            })
        }
        setShowModal(true)
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this item?')) return
        try {
            if (activeTab === 'products') await deleteProduct(id)
            if (activeTab === 'categories') await deleteCategory(id)
            toast.success('Asset destroyed')
            loadTabContent()
        } catch (err) {
            toast.error('Failed to destroy asset')
        }
    }

    const handleStatusMove = async (id, targetStatus) => {
        try {
            await updateOrderStatus(id, targetStatus)
            toast.success(`Order designated as ${targetStatus}`)
            loadTabContent()
        } catch (err) {
            toast.error('Failed to update progression')
        }
    }

    return (
        <div className="min-h-screen bg-[#0b0b0b] pt-32 pb-20 px-4 md:px-12">
            <div className="max-w-[1400px] mx-auto space-y-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-netflix-red flex items-center justify-center text-xl shadow-lg">🎬</div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tighter uppercase italic">Studio Control</h1>
                            <p className="text-gray-500 font-bold text-xs tracking-widest">BINDU MART BACKSTAGE</p>
                        </div>
                    </div>

                    <div className="flex gap-2 bg-[#141414] p-1.5 rounded-xl border border-white/5">
                        {[
                            { id: 'products', name: 'Productions', icon: CubeIcon },
                            { id: 'orders', name: 'Sequences', icon: ClipboardDocumentListIcon },
                            { id: 'categories', name: 'Genres', icon: TagIcon },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-black transition-all ${activeTab === tab.id ? 'bg-netflix-red text-white shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                            >
                                <tab.icon className="w-4 h-4" /> {tab.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats Grid */}
                {stats && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: 'Total Revenue', value: stats.totalRevenue === 'N/A' ? 'N/A' : `₹${parseFloat(stats.totalRevenue).toFixed(2)}`, icon: ChartBarIcon, color: 'text-green-500', tab: 'orders' },
                            { label: 'Total Orders', value: stats.totalOrders, icon: ClipboardDocumentListIcon, color: 'text-netflix-red', tab: 'orders' },
                            { label: 'Productions', value: stats.totalProducts, icon: CubeIcon, color: 'text-blue-500', tab: 'products' },
                            { label: 'Active Users', value: stats.totalUsers || stats.totalCustomers, icon: ChartBarIcon, color: 'text-yellow-500', tab: null },
                        ].map((s, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={s.label}
                                onClick={() => s.tab && setActiveTab(s.tab)}
                                className={`bg-[#141414] p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-all group ${s.tab ? 'cursor-pointer hover:bg-white/[0.02]' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-4 rounded-2xl bg-black/40 ${s.color} group-hover:scale-110 transition-transform`}>
                                        <s.icon className="w-6 h-6" />
                                    </div>
                                    {s.tab && <div className="text-[10px] font-black text-gray-600 uppercase tracking-tighter group-hover:text-netflix-red transition-colors">View Details →</div>}
                                </div>
                                <p className="text-gray-500 text-xs font-black tracking-widest uppercase mb-1">{s.label}</p>
                                <p className="text-3xl font-black tracking-tighter">{s.value}</p>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Main Content Area */}
                <div className="bg-[#141414] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/40">
                        <h2 className="text-2xl font-black tracking-tighter uppercase italic">{activeTab} catalog</h2>
                        {activeTab !== 'orders' && (
                            <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-netflix py-2 px-6 text-sm">
                                <PlusIcon className="w-4 h-4" /> New {activeTab === 'products' ? 'Production' : 'Genre'}
                            </button>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#141414] text-xs font-black uppercase tracking-widest text-gray-500">
                                {activeTab === 'products' ? (
                                    <tr>
                                        <th className="px-8 py-6">Production</th>
                                        <th className="px-8 py-6">Genre</th>
                                        <th className="px-8 py-6">Ticket Price</th>
                                        <th className="px-8 py-6">Vault Stock</th>
                                        <th className="px-8 py-6">Quantity</th>
                                        <th className="px-8 py-6">Actions</th>
                                    </tr>
                                ) : activeTab === 'orders' ? (
                                    <tr>
                                        <th className="px-8 py-6">Sequence ID</th>
                                        <th className="px-8 py-6">Director</th>
                                        <th className="px-8 py-6">Budget</th>
                                        <th className="px-8 py-6">Phase</th>
                                        <th className="px-8 py-6">Progression</th>
                                    </tr>
                                ) : (
                                    <tr>
                                        <th className="px-8 py-6">Genre Name</th>
                                        <th className="px-8 py-6 text-right">Actions</th>
                                    </tr>
                                )}
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    [1, 2, 3].map(i => (
                                        <tr key={i}><td colSpan="5" className="p-8"><div className="skeleton-dark h-8 w-full rounded" /></td></tr>
                                    ))
                                ) : (
                                    items.map(item => (
                                        <React.Fragment key={item.id}>
                                        <tr className="hover:bg-white/5 transition-colors group border-b border-white/10">
                                            {activeTab === 'products' ? (
                                                <>
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-black rounded-lg border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                                                {item.imageUrl ? <img src={item.imageUrl} alt="" className="w-full h-full object-cover" /> : '🥬'}
                                                            </div>
                                                            <span className="font-bold group-hover:text-netflix-red transition-colors">{item.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5 text-gray-400 font-medium">{item.categoryName}</td>
                                                    <td className="px-8 py-5 font-black text-netflix-red">₹{item.price}</td>
                                                    <td className="px-8 py-5 font-bold">{item.stock}</td>
                                                    <td className="px-8 py-5 font-medium text-gray-400">{item.unit}</td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => handleEdit(item)} className="p-2 hover:text-white transition-colors"><PencilIcon className="w-5 h-5" /></button>
                                                            <button onClick={() => handleDelete(item.id)} className="p-2 hover:text-netflix-red transition-colors"><TrashIcon className="w-5 h-5" /></button>
                                                        </div>
                                                    </td>
                                                </>
                                            ) : activeTab === 'orders' ? (
                                                <>
                                                    <td className="px-8 py-5 font-mono text-xs text-gray-500">#{item.id}</td>
                                                    <td className="px-8 py-5 font-bold">{item.customerName || 'Anonymous Director'}</td>
                                                    <td className="px-8 py-5 font-black">₹{parseFloat(item.totalAmount).toFixed(2)}</td>
                                                    <td className="px-8 py-5 uppercase font-black text-[10px] tracking-widest italic">
                                                        <span className={`px-2 py-1 rounded ${item.orderStatus === 'DELIVERED' ? 'bg-green-500/20 text-green-500' : 'bg-white/10'}`}>
                                                            {item.orderStatus}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <button onClick={() => toggleOrderDetails(item.id)} className="text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded transition-all">
                                                            {expandedOrderId === item.id ? 'Hide Details' : 'View Details'}
                                                        </button>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-black rounded-lg border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                                                {item.imageUrl ? <img src={item.imageUrl} alt="" className="w-full h-full object-cover" /> : '🎬'}
                                                            </div>
                                                            <span className="font-bold group-hover:text-netflix-red transition-colors">{item.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5 text-right text-gray-500 font-medium italic">Genre ID: {item.id}</td>
                                                    <td className="px-8 py-5 text-right">
                                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => handleEdit(item)} className="p-2 hover:text-white transition-colors"><PencilIcon className="w-5 h-5" /></button>
                                                            <button onClick={() => handleDelete(item.id)} className="p-2 hover:text-netflix-red transition-colors"><TrashIcon className="w-5 h-5" /></button>
                                                        </div>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                        {activeTab === 'orders' && expandedOrderId === item.id && (
                                            <tr className="bg-[#0b0b0b]/60 border-b border-white/5">
                                                <td colSpan="5" className="p-8">
                                                    <div className="flex flex-col md:flex-row gap-8 justify-between">
                                                        <div className="flex-1 space-y-4">
                                                            <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-4">Order Manifest / Items</h4>
                                                            {item.orderItems && item.orderItems.length > 0 ? (
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                    {item.orderItems.map((oi, idx) => (
                                                                        <div key={idx} className="flex justify-between items-center bg-[#141414] p-3 rounded-lg border border-white/5">
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="w-8 h-8 rounded bg-black flex items-center justify-center font-black text-xs text-netflix-red border border-white/10">
                                                                                    {oi.quantity}x
                                                                                </div>
                                                                                <span className="font-medium text-sm text-gray-300">{oi.product?.name || oi.productName || 'Unknown Provision'}</span>
                                                                            </div>
                                                                            <span className="font-mono text-xs font-bold text-gray-500">₹{parseFloat(oi.price).toFixed(2)}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <p className="text-sm text-gray-500 italic">No detailed manifest found.</p>
                                                            )}
                                                        </div>
                                                        <div className="w-full md:w-64 space-y-3 md:pl-8 md:border-l border-white/10">
                                                            <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-4">Action Controls</h4>
                                                            <button onClick={() => handleStatusMove(item.id, 'PREPARING')} disabled={item.orderStatus !== 'PLACED'} className={`w-full py-3 rounded text-xs font-black uppercase transition-all tracking-wider ${item.orderStatus === 'PLACED' ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg' : 'bg-white/5 text-gray-600 cursor-not-allowed'}`}>Accept Order</button>
                                                            <button onClick={() => handleStatusMove(item.id, 'DISPATCHED')} disabled={item.orderStatus !== 'PREPARING'} className={`w-full py-3 rounded text-xs font-black uppercase transition-all tracking-wider ${item.orderStatus === 'PREPARING' ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg' : 'bg-white/5 text-gray-600 cursor-not-allowed'}`}>Dispatch</button>
                                                            <button onClick={() => handleStatusMove(item.id, 'DELIVERED')} disabled={item.orderStatus !== 'DISPATCHED'} className={`w-full py-3 rounded text-xs font-black uppercase transition-all tracking-wider ${item.orderStatus === 'DISPATCHED' ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg' : 'bg-white/5 text-gray-600 cursor-not-allowed'}`}>Mark Delivered</button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                        </React.Fragment>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Cinematic Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowModal(false)} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative bg-[#141414] w-full max-w-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
                    >
                        <form onSubmit={handleSubmit} className="p-10 space-y-6">
                            <h3 className="text-3xl font-black tracking-tighter uppercase italic mb-8">
                                {activeTab === 'categories'
                                    ? (editingItem ? 'Rewrite Genre' : 'New Genre')
                                    : (editingItem ? 'Script Rewrite' : 'New Production')
                                }
                            </h3>

                            {activeTab === 'categories' ? (
                                <div className="grid gap-6">
                                    <input placeholder="Genre Name" required className="netflix-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                    <input placeholder="Genre Cover URL (Image)" className="netflix-input" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />
                                </div>
                            ) : (
                                <>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <input placeholder="Asset Name" required className="netflix-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                        <select required className="netflix-input appearance-none" value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })}>
                                            <option value="">Select Genre</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                        <input placeholder="Ticket Price (₹)" type="number" step="0.01" required className="netflix-input" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                                        <input placeholder="Vault Stock" type="number" required className="netflix-input" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} />
                                        <input placeholder="Unit (e.g., kg, dozen)" required className="netflix-input" value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} />
                                        <input placeholder="Poster URL (Image)" className="netflix-input" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />
                                    </div>
                                    <textarea placeholder="Production Log / Description" className="netflix-input h-32" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                </>
                            )}

                            <div className="flex gap-4 pt-6">
                                <button type="submit" className="flex-1 btn-netflix justify-center py-4 text-lg">Save Changes</button>
                                <button type="button" onClick={() => setShowModal(false)} className="px-8 py-4 font-bold text-gray-500 hover:text-white transition-colors">Discard</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    )
}

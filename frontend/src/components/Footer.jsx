import { ShoppingBagIcon } from '@heroicons/react/24/outline'

export default function Footer() {
    return (
        <footer className="bg-[#0b0b0b] text-gray-500 py-16 px-4 md:px-12 border-t border-white/5">
            <div className="max-w-[1800px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
                <div className="col-span-2 md:col-span-1 space-y-4">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-netflix-red font-black text-2xl tracking-tighter">BINDU MART</span>
                    </div>
                    <div className="flex gap-4 text-white">
                        {/* Social Icons Placeholder */}
                        <div className="w-6 h-6 bg-gray-600/20 rounded-full" />
                        <div className="w-6 h-6 bg-gray-600/20 rounded-full" />
                        <div className="w-6 h-6 bg-gray-600/20 rounded-full" />
                    </div>
                </div>

                <div className="space-y-4 text-sm">
                    <p className="hover:underline cursor-pointer">Help Center</p>
                    <p className="hover:underline cursor-pointer">Gift Cards</p>
                    <p className="hover:underline cursor-pointer">Investor Relations</p>
                    <p className="hover:underline cursor-pointer">Terms of Use</p>
                </div>

                <div className="space-y-4 text-sm">
                    <p className="hover:underline cursor-pointer">Privacy</p>
                    <p className="hover:underline cursor-pointer">Legal Notices</p>
                    <p className="hover:underline cursor-pointer">Cookie Preferences</p>
                    <p className="hover:underline cursor-pointer">Corporate Information</p>
                </div>

                <div className="space-y-4 text-sm">
                    <p className="hover:underline cursor-pointer">Contact Us</p>
                    <p className="hover:underline cursor-pointer">App Store</p>
                    <p className="hover:underline cursor-pointer">Google Play</p>
                    <p className="hover:underline cursor-pointer">Redemption Center</p>
                </div>
            </div>

            <div className="max-w-[1800px] mx-auto mt-12 pt-8 border-t border-white/5">
                <p className="text-xs uppercase tracking-widest font-bold">© 2024 Bindu Mart. All Rights Reserved.</p>
                <p className="text-[10px] mt-2 opacity-50">Built for a fresh shopping experience. Inspired by the best in digital convenience.</p>
            </div>
        </footer>
    )
}

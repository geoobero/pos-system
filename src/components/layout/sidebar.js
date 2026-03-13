"use client";

import Link from "next/link";

export default function Sidebar({ isAdmin = false, isOpen = false, onClose }) {
    return (
        <>
            {/* Mobile sidebar - slide in from left */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50 
                w-64 bg-black/20 backdrop-blur-sm text-white flex flex-col
                transform transition-transform duration-200 ease-in-out
                lg:transform-none
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="px-6 py-4 text-xl font-bold border-b border-gray-700 flex items-center justify-between">
                    <span>POS System</span>
                    {/* Close button for mobile */}
                    <button 
                        onClick={onClose}
                        className="lg:hidden p-1 hover:bg-gray-700 rounded"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                    <Link href="/dashboard/pos" className="block px-3 py-2 rounded hover:bg-gray-700">
                        POS
                    </Link>
                    <Link href="/dashboard/transactions" className="block px-3 py-2 rounded hover:bg-gray-700">
                        Transactions
                    </Link>
                    
                    {isAdmin && (
                        <>
                            <div className="border-t border-gray-700 my-2"></div>
                            <p className="px-3 text-xs font-thin text-gray-100 uppercase">Admin</p>
                            <Link href="/dashboard/categories" className="block px-3 py-2 rounded hover:bg-gray-700">
                                Categories
                            </Link>
                            <Link href="/dashboard/products" className="block px-3 py-2 rounded hover:bg-gray-700">
                                Products
                            </Link>
                            <Link href="/dashboard/users" className="block px-3 py-2 rounded hover:bg-gray-700">
                                Users
                            </Link>
                        </>
                    )}
                </nav>
            </aside>
        </>
    );
}

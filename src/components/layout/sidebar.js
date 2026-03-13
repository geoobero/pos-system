"use client";

import Link from "next/link";

export default function Sidebar() {
    return (
        <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col">
            <div className="px-6 py-4 text-xl font-bold border-b border-gray-700">
                POS System
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
                <Link href="/dashboard/pos" className="block px-3 py-2 rounded hover:bg-gray-700">
                    POS
                </Link>
                <Link href="/dashboard/categories" className="block px-3 py-2 rounded hover:bg-gray-700">
                    Categories
                </Link>
                <Link href="/dashboard/products" className="block px-3 py-2 rounded hover:bg-gray-700">
                    Products
                </Link>
                <Link href="/dashboard/transactions" className="block px-3 py-2 rounded hover:bg-gray-700">
                    Transactions
                </Link>
                <Link href="/dashboard/users" className="block px-3 py-2 rounded hover:bg-gray-700">
                    Users
                </Link>
            </nav>
        </aside>
    );
}

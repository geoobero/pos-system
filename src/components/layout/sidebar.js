"use client";

import Link from "next/link";

export default function Sidebar({ isAdmin = false, isOpen = false, onClose }) {
    return (
        <>
            {/* Mobile sidebar - slide in from left */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50 
                w-64 lg:bg-slate-900 backdrop-blur-sm lg:text-gray-50 text-black flex flex-col
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
                    <Link href="/dashboard/pos" className="items-center block px-3 py-2 rounded hover:text-amber-400 duration-300 flex gap-2">
                        <span>
                            <svg className="w-8 h-8 text-gray-800 dark:text-sky-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 18h14M5 18v3h14v-3M5 18l1-9h12l1 9M16 6v3m-4-3v3m-2-6h8v3h-8V3Zm-1 9h.01v.01H9V12Zm3 0h.01v.01H12V12Zm3 0h.01v.01H15V12Zm-6 3h.01v.01H9V15Zm3 0h.01v.01H12V15Zm3 0h.01v.01H15V15Z" />
                            </svg>
                        </span>
                        POS
                    </Link>
                    <Link href="/dashboard/transactions" className="items-center block px-3 py-2 rounded hover:text-amber-400 duration-300 flex gap-2">
                        <span>
                            <svg className="w-8 h-8 text-gray-800 dark:text-amber-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-6 5h6m-6 4h6M10 3v4h4V3h-4Z" />
                            </svg>

                        </span>
                        Transactions
                    </Link>

                    {isAdmin && (
                        <>
                            <div className="border-t border-gray-700 my-2"></div>
                            <p className="px-3 text-xs font-thin text-red-600 uppercase">Admin</p>
                            <Link href="/dashboard/overview" className="flex gap-2 items-center block px-3 py-2 rounded hover:text-amber-400 duration-300">
                                <span>
                                    <svg className="w-8 h-8 text-gray-800 dark:text-green-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6.025A7.5 7.5 0 1 0 17.975 14H10V6.025Z" />
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.5 3c-.169 0-.334.014-.5.025V11h7.975c.011-.166.025-.331.025-.5A7.5 7.5 0 0 0 13.5 3Z" />
                                    </svg>

                                </span>
                                Overview
                            </Link>
                            <Link href="/dashboard/categories" className="flex gap-2 items-center block px-3 py-2 hover:text-amber-400 rounded duration-300">
                                <span>
                                    <svg className="w-8 h-8 text-gray-800 dark:text-teal-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M5 4a2 2 0 0 0-2 2v1h10.968l-1.9-2.28A2 2 0 0 0 10.532 4H5ZM3 19V9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Zm9-8.5a1 1 0 0 1 1 1V13h1.5a1 1 0 1 1 0 2H13v1.5a1 1 0 1 1-2 0V15H9.5a1 1 0 1 1 0-2H11v-1.5a1 1 0 0 1 1-1Z" clipRule="evenodd" />
                                    </svg>


                                </span>
                                Categories
                            </Link>
                            <Link href="/dashboard/products" className="flex gap-2 items-center block px-3 py-2 rounded hover:text-amber-400 duration-300">
                                <span>
                                    <svg className="w-8 h-8 text-gray-800 dark:text-purple-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.583 8.445h.01M10.86 19.71l-6.573-6.63a.993.993 0 0 1 0-1.4l7.329-7.394A.98.98 0 0 1 12.31 4l5.734.007A1.968 1.968 0 0 1 20 5.983v5.5a.992.992 0 0 1-.316.727l-7.44 7.5a.974.974 0 0 1-1.384.001Z" />
                                    </svg>
                                </span>
                                Products
                            </Link>
                            <Link href="/dashboard/users" className="flex gap-2 items-center block px-3 py-2 rounded hover:text-amber-400 duration-300">
                                <span>
                                    <svg className="w-8 h-8 text-gray-800 dark:text-blue-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                </span>
                                Users
                            </Link>
                        </>
                    )}
                </nav>
            </aside>
        </>
    );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { getTransactions } from "@/lib/supabase/transactions";
import Loading from "@/components/shared/loading";
import Error from "@/components/shared/error";

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [dateFilter, setDateFilter] = useState("all");
    const printRef = useRef();

    useEffect(() => {
        async function loadTransactions() {
            const { data, error } = await getTransactions();
            if (error) {
                setError(error.message);
            } else {
                setTransactions(data || []);
            }
            setLoading(false);
        }

        loadTransactions();
    }, []);

    const getFilteredTransactions = () => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        return transactions.filter(t => {
            const transDate = new Date(t.created_at);
            
            switch (dateFilter) {
                case "today":
                    return transDate >= today;
                case "weekly":
                    const weekAgo = new Date(today);
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return transDate >= weekAgo;
                case "monthly":
                    const monthAgo = new Date(today);
                    monthAgo.setMonth(monthAgo.getMonth() - 1);
                    return transDate >= monthAgo;
                case "yearly":
                    const yearAgo = new Date(today);
                    yearAgo.setFullYear(yearAgo.getFullYear() - 1);
                    return transDate >= yearAgo;
                default:
                    return true;
            }
        });
    };

    const handlePrint = () => {
        const printContent = printRef.current;
        const originalContents = document.body.innerHTML;
        
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Transactions Report</title>');
        printWindow.document.write('<style>');
        printWindow.document.write(`
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .text-right { text-align: right; }
            .no-print { display: none; }
            h1 { margin-bottom: 10px; }
        `);
        printWindow.document.write('</style></head><body>');
        printWindow.document.write(printContent.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };

    const filteredTransactions = getFilteredTransactions();
    const grandTotal = filteredTransactions.reduce((sum, t) => sum + Number(t.total || 0), 0);

    if (loading) return <Loading />;
    if (error) return <Error message={error} />;

    return (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow text-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h1 className="text-2xl font-bold">Transactions</h1>
                
                <div className="flex flex-wrap gap-2 no-print">
                    <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="border rounded px-3 py-2 text-sm"
                    >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="weekly">This Week</option>
                        <option value="monthly">This Month</option>
                        <option value="yearly">This Year</option>
                    </select>

                    <button
                        onClick={handlePrint}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                    >
                        Print
                    </button>
                </div>
            </div>

            {filteredTransactions.length === 0 ? (
                <p className="text-gray-500">No transactions found.</p>
            ) : (
                <div ref={printRef}>
                    <div className="hidden print:block mb-4">
                        <h1>Transactions Report</h1>
                        <p className="text-sm text-gray-500">
                            {dateFilter === "all" ? "All Time" : 
                             dateFilter === "today" ? "Today" :
                             dateFilter === "weekly" ? "This Week" :
                             dateFilter === "monthly" ? "This Month" : "This Year"}
                        </p>
                    </div>

                    <div className="overflow-y-auto max-h-120 max-w-[100%]">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 text-sm">Date</th>
                                    <th className="text-left py-2 text-sm">Products</th>
                                    <th className="text-left py-2 text-sm hidden sm:table-cell">Category</th>
                                    <th className="text-left py-2 text-sm hidden md:table-cell">Cashier</th>
                                    <th className="text-right py-2 text-sm">Total</th>
                                    <th className="text-right py-2 text-sm hidden sm:table-cell">Cash</th>
                                    <th className="text-right py-2 text-sm hidden sm:table-cell">Change</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map((t) => (
                                    <tr key={t.id} className="border-b text-sm">
                                        <td className="py-2">
                                            {new Date(t.created_at).toLocaleString()}
                                        </td>
                                        <td className="py-2 text-xs sm:text-sm">{t.product_names || "-"}</td>
                                        <td className="py-2 text-xs sm:text-sm hidden sm:table-cell">{t.categories || "-"}</td>
                                        <td className="py-2 text-xs sm:text-sm hidden md:table-cell">{t.cashier}</td>
                                        <td className="py-2 text-right font-medium">₱{Number(t.total).toFixed(2)}</td>
                                        <td className="py-2 text-right hidden sm:table-cell">₱{Number(t.cash).toFixed(2)}</td>
                                        <td className="py-2 text-right hidden sm:table-cell">₱{Number(t.change).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="border-b bg-gray-50">
                                    <td colSpan={4} className="py-3 text-right font-bold hidden sm:table-cell">Grand Total:</td>
                                    <td colSpan={1} className="py-3 text-right font-bold sm:hidden">Total:</td>
                                    <td className="py-3 text-right font-bold">₱{grandTotal.toFixed(2)}</td>
                                    <td colSpan={2} className="hidden sm:table-cell"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

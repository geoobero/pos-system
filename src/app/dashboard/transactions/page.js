"use client";

import { useEffect, useState } from "react";
import { getTransactions } from "@/lib/supabase/transactions";
import Loading from "@/components/shared/loading";
import Error from "@/components/shared/error";

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadTransactions() {
            const { data, error } = await getTransactions();
            if (error) {
                setError(error.message);
            } else {
                setTransactions(data);
            }
            setLoading(false);
        }

        loadTransactions();
    }, []);

    if (loading) return <Loading />;
    if (error) return <Error message={error} />;

    return (
        <div className="bg-white p-6 rounded-lg shadow text-gray-700">
            <h1 className="text-2xl font-bold mb-4">Transactions</h1>

            {transactions.length === 0 ? (
                <p className="text-gray-500">No transactions found.</p>
            ) : (
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left py-2">Date</th>
                            <th className="text-left py-2">Products</th>
                            <th className="text-left py-2">Category</th>
                            <th className="text-left py-2">Cashier</th>
                            <th className="text-right py-2">Total</th>
                            <th className="text-right py-2">Cash</th>
                            <th className="text-right py-2">Change</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((t) => (
                            <tr key={t.id} className="border-b text-sm">
                                <td className="py-2">
                                    {new Date(t.created_at).toLocaleString()}
                                </td>
                                <td className="py-2">{t.product_names || "-"}</td>
                                <td className="py-2">{t.categories || "-"}</td>
                                <td className="py-2">{t.cashier}</td>
                                <td className="py-2 text-right">₱{Number(t.total).toFixed(2)}</td>
                                <td className="py-2 text-right">₱{Number(t.cash).toFixed(2)}</td>
                                <td className="py-2 text-right">₱{Number(t.change).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

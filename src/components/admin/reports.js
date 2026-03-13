"use client";

import Table from "@/components/ui/table";

export default function Reports({ data = [] }) {
    // Define columns for transactions
    const columns = [
        { key: "id", label: "ID" },
        { key: "date", label: "Date" },
        { key: "cashier", label: "Cashier" },
        { key: "total", label: "Total" },
    ];

    // Map data for table display
    const tableData = data.map((tx) => ({
        id: tx.id,
        date: new Date(tx.date).toLocaleString(),
        cashier: tx.cashier,
        total: `₱${tx.total.toFixed(2)}`,
    }));

    return (
        <div className="bg-white rounded shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Reports</h2>
            <Table columns={columns} data={tableData} />
        </div>
    );
}

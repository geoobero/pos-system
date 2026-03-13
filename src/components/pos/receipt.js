"use client";

import Button from "@/components/ui/button";

export default function Receipt({ transaction, onNewSale }) {
    if (!transaction) return null;

    const { items, total, cash, change, cashier, date } = transaction;

    return (
        <div className="receipt-print mt-6 bg-white border rounded-lg shadow p-6 text-gray-700">
            <h2 className="text-2xl font-bold text-center mb-4">
                🧾 Receipt
            </h2>

            <div className="text-sm mb-4">
                <p><strong>Cashier:</strong> {cashier}</p>
                <p><strong>Date:</strong> {new Date(date).toLocaleString()}</p>
            </div>

            <hr className="my-3" />

            <div className="flex flex-col gap-2">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex justify-between text-sm"
                    >
                        <span>
                            {item.name} × {item.quantity}
                        </span>
                        <span>
                            ₱{(item.price * item.quantity).toFixed(2)}
                        </span>
                    </div>
                ))}
            </div>

            <hr className="my-3" />

            <div className="text-sm space-y-1">
                <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₱{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Cash</span>
                    <span>₱{cash.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Change</span>
                    <span>₱{change.toFixed(2)}</span>
                </div>
            </div>

            <div className="mt-6 flex justify-center print:hidden">
                <Button onClick={() => window.print()}>
                    Print Receipt
                </Button>
            </div>
            <Button
                onClick={onNewSale}
                className="mt-4 w-full"
            >
                New Sale
            </Button>

        </div>
    );
}

"use client";

import Button from "@/components/ui/button";

export default function CartItem({
    item,
    onIncrease,
    onDecrease,
    onRemove,
}) {
    return (
        <div className="flex items-center justify-between border-b py-3">
            {/* Product info */}
            <div className="flex justify-between items-center border-b py-2">
                <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-500 text-sm">₱{item.price} x {item.quantity}</p>
                </div>

                <div className="flex gap-2">
                    <button onClick={onDecrease} className="px-2 py-1 bg-gray-200 rounded">-</button>
                    <button onClick={onIncrease} className="px-2 py-1 bg-gray-200 rounded">+</button>
                    <button onClick={onRemove} className="px-2 py-1 bg-red-500 text-white rounded">x</button>
                </div>
            </div>
        </div>
    );
}

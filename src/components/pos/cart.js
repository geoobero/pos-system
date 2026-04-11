"use client";

import CartItem from "@/components/pos/cartItem";

export default function Cart({ initialItems, onIncrease, onDecrease, onRemove }) {
    return (
        <div className="border border-gray-300 p-4 rounded-lg shadow-lg text-gray-600 flex-1 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Cart</h2>
                {initialItems.length > 0 && (
                    <button
                        onClick={() => initialItems.forEach(item => onRemove(item.id))}
                        className="text-sm text-red-600 hover:text-red-800 hover:underline cursor-pointer"
                    >
                        Drop Order
                    </button>
                )}
            </div>

            {initialItems.length === 0 ? (
                <p className="text-gray-500">empty</p>
            ) : (
                <div className="flex flex-col gap-2 overflow-y-auto">
                    {initialItems.map((item) => (
                        <CartItem
                            key={item.id}
                            item={item}
                            onIncrease={() => onIncrease(item.id)}
                            onDecrease={() => onDecrease(item.id)}
                            onRemove={() => onRemove(item.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
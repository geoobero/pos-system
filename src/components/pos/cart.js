"use client";

import CartItem from "@/components/pos/cartItem";

export default function Cart({ initialItems, onIncrease, onDecrease, onRemove }) {
    return (
        <div className="border p-4 rounded-lg shadow-lg text-gray-600">
            <h2 className="text-xl font-bold mb-4">Cart</h2>

            {initialItems.length === 0 ? (
                <p className="text-gray-500">Cart is empty</p>
            ) : (
                <div className="flex flex-col gap-2">
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


"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/button";

export default function Payment({ total = 0, onConfirm }) {
  const [cash, setCash] = useState("");
  const [change, setChange] = useState(0);

  useEffect(() => {
    const cashAmount = parseFloat(cash) || 0;
    setChange(cashAmount - total);
  }, [cash, total]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (total <= 0) {
      alert("Cart is empty.");
      return;
    }

    if (parseFloat(cash) < total) {
      alert("Cash is not enough!");
      return;
    }

    onConfirm({
      total,
      cash: parseFloat(cash),
      change,
    });

    setCash("");
  };

  return (
    <div className="bg-white rounded shadow p-4 flex flex-col gap-4 text-gray-600">
      <h2 className="text-lg font-semibold">Payment</h2>
      <p className="text-gray-700">Total: ₱{total.toFixed(2)}</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="number"
          min={0}
          step={0.01}
          placeholder="Enter cash amount"
          value={cash}
          onChange={(e) => setCash(e.target.value)}
          className="border rounded px-2 py-1"
        />

        <p className="text-gray-700">Change: ₱{change.toFixed(2)}</p>

        <Button
          type="submit"
          disabled={cash < total}
          className={`w-full ${total <= 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          Confirm Payment
        </Button>
      </form>
    </div>
  );
}

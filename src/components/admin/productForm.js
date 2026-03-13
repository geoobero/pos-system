"use client";

import { useState } from "react";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";

export default function ProductForm({ isOpen, onClose, onSubmit, initialData, categories = [] }) {
    const [name, setName] = useState(initialData?.name || "");
    const [price, setPrice] = useState(initialData?.price || "");
    const [barcode, setBarcode] = useState(initialData?.barcode || "");
    const [category, setCategory] = useState(initialData?.category || "");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim() || !price || !barcode.trim()) {
            setError("Please fill in all required fields");
            return;
        }

        onSubmit?.({
            id: initialData?.id,
            name: name.trim(),
            price: parseFloat(price),
            barcode: barcode.trim(),
            category,
        });

        // Reset form
        setName("");
        setPrice("");
        setBarcode("");
        setCategory("");
        setError("");
        onClose?.();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Product" : "Add Product"}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input label="Product Name" value={name} onChange={(e) => setName(e.target.value)} />
                <Input label="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                <Input label="Barcode" value={barcode} onChange={(e) => setBarcode(e.target.value)} />

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring border-gray-300 focus:ring-blue-300"
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary">
                        {initialData ? "Update" : "Add"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

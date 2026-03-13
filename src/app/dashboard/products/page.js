"use client";

import { useState } from "react";

export default function ProductsPage() {
    // Mock categories (normally from DB)
    const categories = [
        { id: 1, name: "Beverages" },
        { id: 2, name: "Snacks" },
        { id: 3, name: "Meals" },
    ];

    // Mock products
    const [products, setProducts] = useState([
        { id: 1, name: "Coke", category: "Beverages", price: 1.5, barcode: "123456" },
        { id: 2, name: "Chips", category: "Snacks", price: 2.0, barcode: "234567" },
        { id: 3, name: "Burger", category: "Meals", price: 5.0, barcode: "345678" },
    ]);

    const [newProduct, setNewProduct] = useState({
        name: "",
        categoryId: "",
        price: "",
        barcode: "",
    });

    function handleAddProduct(e) {
        e.preventDefault();

        if (!newProduct.name || !newProduct.categoryId || !newProduct.price || !newProduct.barcode)
            return;

        const categoryName = categories.find(c => c.id === parseInt(newProduct.categoryId))?.name || "";

        setProducts([
            ...products,
            {
                id: Date.now(),
                name: newProduct.name,
                category: categoryName,
                price: parseFloat(newProduct.price),
                barcode: newProduct.barcode,
            },
        ]);

        setNewProduct({ name: "", categoryId: "", price: "", barcode: "" });
    }

    function deleteProduct(id) {
        setProducts(products.filter(p => p.id !== id));
    }

    return (
        <div className="text-gray-600">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Products</h1>
            </div>

            {/* Add Product */}
            <form
                onSubmit={handleAddProduct}
                className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-6"
            >
                <input
                    type="text"
                    placeholder="Product name"
                    className="border border-gray-300 rounded px-3 py-2"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />

                <select
                    className="border border-gray-300 rounded px-3 py-2"
                    value={newProduct.categoryId}
                    onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                >
                    <option value="">Select Category</option>
                    {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>

                <input
                    type="number"
                    placeholder="Price"
                    step="0.01"
                    className="border border-gray-300 rounded px-3 py-2"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />

                <input
                    type="text"
                    placeholder="Barcode"
                    className="border border-gray-300 rounded px-3 py-2"
                    value={newProduct.barcode}
                    onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
                />

                <button
                    type="submit"
                    className="md:col-span-4 max-w-50 cursor-pointer duration-300 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Add Product
                </button>
            </form>

            {/* Product List */}
            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Category</th>
                            <th className="px-4 py-2 text-left">Price</th>
                            <th className="px-4 py-2 text-left">Barcode</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.id} className="border-b">
                                <td className="px-4 py-2">{p.name}</td>
                                <td className="px-4 py-2">{p.category}</td>
                                <td className="px-4 py-2">${p.price.toFixed(2)}</td>
                                <td className="px-4 py-2">{p.barcode}</td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => deleteProduct(p.id)}
                                        className="text-red-600 hover:underline text-sm"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

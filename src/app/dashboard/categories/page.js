"use client";

import { useState } from "react";

export default function CategoriesPage() {
    const [categories, setCategories] = useState([
        { id: 1, name: "Beverages" },
        { id: 2, name: "Snacks" },
        { id: 3, name: "Meals" },
    ]);

    const [newCategory, setNewCategory] = useState("");

    function addCategory(e) {
        e.preventDefault();

        if (!newCategory.trim()) return;

        setCategories([
            ...categories,
            {
                id: Date.now(),
                name: newCategory,
            },
        ]);

        setNewCategory("");
    }

    function deleteCategory(id) {
        setCategories(categories.filter((c) => c.id !== id));
    }

    return (
        <div className="text-gray-600">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Categories</h1>
            </div>

            {/* Add Category */}
            <form
                onSubmit={addCategory}
                className="flex gap-2 mb-6"
            >
                <input
                    type="text"
                    placeholder="Category name"
                    className="flex-1 border border-gray-300 rounded px-3 py-2"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                />

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
                >
                    Add
                </button>
            </form>

            {/* Category List */}
            <div className="bg-white rounded shadow">
                <ul className="divide-y">
                    {categories.map((category) => (
                        <li
                            key={category.id}
                            className="flex justify-between items-center p-4"
                        >
                            <span>{category.name}</span>

                            <button
                                onClick={() => deleteCategory(category.id)}
                                className="text-red-600 hover:underline text-sm"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/lib/supabase/products";
import { getCategories } from "@/lib/supabase/categories";
import { supabase } from "@/lib/supabase/client";
import Loading from "@/components/shared/loading";
import Error from "@/components/shared/error";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingProduct, setEditingProduct] = useState(null);
    const [uploading, setUploading] = useState(false);

    const [newProduct, setNewProduct] = useState({
        name: "",
        categoryId: "",
        price: "",
    });

    const [newImage, setNewImage] = useState(null);

    useEffect(() => {
        async function loadData() {
            const [productsRes, categoriesRes] = await Promise.all([
                getProducts(),
                getCategories()
            ]);

            if (productsRes.error) {
                setError(productsRes.error.message);
            } else {
                setProducts(productsRes.data);
            }

            if (categoriesRes.error) {
                setError(categoriesRes.error.message);
            } else {
                setCategories(categoriesRes.data);
            }

            setLoading(false);
        }
        loadData();
    }, []);

    async function uploadImage(file) {
        if (!file) return null;

        setUploading(true);

        const fileName = `${Date.now()}-${file.name}`;

        const { data, error } = await supabase.storage
            .from("product-images")
            .upload(fileName, file, {
                cacheControl: "3600",
                upsert: false,
            });

        setUploading(false);

        if (error) {
            console.error("Upload error:", error);
            alert("Failed to upload image: " + error.message);
            return null;
        }

        const { data: { publicUrl } } = supabase.storage
            .from("product-images")
            .getPublicUrl(fileName);

        return publicUrl;
    }

    async function handleAddProduct(e) {
        e.preventDefault();

        if (!newProduct.name || !newProduct.categoryId || !newProduct.price)
            return;

        let imageUrl = null;
        if (newImage) {
            imageUrl = await uploadImage(newImage);
        }

        const { data, error } = await createProduct({
            name: newProduct.name,
            price: parseFloat(newProduct.price),
            category: newProduct.categoryId,
            image_url: imageUrl,
        });

        if (error) {
            alert(error.message);
            return;
        }

        const { data: refreshedProducts } = await getProducts();
        setProducts(refreshedProducts || []);

        setNewProduct({ name: "", categoryId: "", price: "" });
        setNewImage(null);
    }

    async function handleUpdateProduct(e) {
        e.preventDefault();
        if (!editingProduct) return;

        let imageUrl = editingProduct.image_url;

        if (editingProduct.newImage) {
            imageUrl = await uploadImage(editingProduct.newImage);
        }

        const { error } = await updateProduct(editingProduct.id, {
            name: editingProduct.name,
            category: editingProduct.category,
            price: parseFloat(editingProduct.price),
            image_url: imageUrl,
        });

        if (error) {
            alert(error.message);
            return;
        }

        const { data: refreshedProducts } = await getProducts();
        setProducts(refreshedProducts || []);
        setEditingProduct(null);
    }

    async function handleDeleteProduct(id) {
        if (!confirm("Are you sure you want to delete this product?")) return;

        const { error } = await deleteProduct(id);
        if (error) {
            alert(error.message);
            return;
        }
        setProducts(products.filter(p => p.id !== id));
    }

    if (loading) return <Loading />;
    if (error) return <Error message={error} />;

    return (
        <div className="text-gray-600">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Products</h1>
            </div>

            {editingProduct && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold mb-3">Edit Product</h3>
                    <form onSubmit={handleUpdateProduct} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                        <input
                            type="text"
                            placeholder="Product name"
                            className="border border-gray-300 rounded px-3 py-2"
                            value={editingProduct.name}
                            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Category"
                            className="border border-gray-300 rounded px-3 py-2 bg-gray-100"
                            value={editingProduct.category_name || "Uncategorized"}
                            disabled
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            step="0.01"
                            className="border border-gray-300 rounded px-3 py-2"
                            value={editingProduct.price}
                            onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            className="border border-gray-300 rounded px-3 py-2"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setEditingProduct({ ...editingProduct, newImage: file });
                                }
                            }}
                        />
                        {/* Show current image */}
                        <div className="md:col-span-4">
                            {editingProduct.image_url ? (
                                <div className="flex items-center gap-4">
                                    <img
                                        src={editingProduct.image_url}
                                        alt="Current"
                                        className="w-20 h-20 object-cover rounded"
                                    />
                                    <span className="text-sm text-gray-500">
                                        {editingProduct.newImage ? `New: ${editingProduct.newImage.name}` : "Leave empty to keep current image"}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-sm text-gray-500">No image set</span>
                            )}
                        </div>
                        <div className="md:col-span-4 flex gap-2">
                            <button
                                type="submit"
                                disabled={uploading}
                                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                            >
                                {uploading ? "Saving..." : "Save Changes"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditingProduct(null)}
                                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

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
                    type="file"
                    accept="image/*"
                    className="border border-gray-300 rounded px-3 py-2"
                    onChange={(e) => setNewImage(e.target.files[0])}
                />

                <button
                    type="submit"
                    disabled={uploading}
                    className="md:col-span-4 max-w-50 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {uploading ? "Adding..." : "Add Product"}
                </button>
            </form>

            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left">Image</th>
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Category</th>
                            <th className="px-4 py-2 text-left">Price</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                    No products found. Add one above.
                                </td>
                            </tr>
                        ) : (
                            products.map((p) => (
                                <tr key={p.id} className="border-b">
                                    <td className="px-4 py-2">
                                        {p.image_url ? (
                                            <img
                                                src={p.image_url}
                                                alt={p.name}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                                                -
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-2">{p.name}</td>
                                    <td className="px-4 py-2">{p.category_name || "Uncategorized"}</td>
                                    <td className="px-4 py-2">₱{Number(p.price).toFixed(2)}</td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => setEditingProduct(p)}
                                            className="text-blue-600 hover:underline text-sm mr-3"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(p.id)}
                                            className="text-red-600 hover:underline text-sm"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
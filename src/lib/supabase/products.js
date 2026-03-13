import { supabase } from "./client";

// Get all products
export async function getProducts() {
    const { data, error } = await supabase
        .from("products")
        .select("*");
    return { data, error };
}

// Create a product
export async function createProduct({ name, price, barcode, category }) {
    const { data, error } = await supabase
        .from("products")
        .insert([{ name, price, barcode, category }]);
    return { data, error };
}

// Update a product
export async function updateProduct(id, { name, price, barcode, category }) {
    const { data, error } = await supabase
        .from("products")
        .update({ name, price, barcode, category })
        .eq("id", id);
    return { data, error };
}

// Delete a product
export async function deleteProduct(id) {
    const { data, error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);
    return { data, error };
}

import { supabase } from "./client";

// Get all products with category name
export async function getProducts() {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name", { ascending: true });
    
    if (data && data.length > 0) {
        const { data: categories } = await supabase.from("categories").select("id, name");
        
        const productsWithCategoryName = data.map(product => ({
            ...product,
            category_name: categories?.find(c => c.id === product.category)?.name || "Unknown"
        }));
        
        return { data: productsWithCategoryName, error };
    }
    
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

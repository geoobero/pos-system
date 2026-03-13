import { supabase } from "./client";

export async function getCategories() {
    return await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });
}

export async function createCategory({ name }) {
    const { data, error } = await supabase
        .from("categories")
        .insert([{ name }]);
    return { data, error };
}

export async function updateCategory(id, { name }) {
    const { data, error } = await supabase
        .from("categories")
        .update({ name })
        .eq("id", id);
    return { data, error };
}

export async function deleteCategory(id) {
    const { data, error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);
    return { data, error };
}

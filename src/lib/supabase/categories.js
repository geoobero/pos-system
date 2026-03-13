import { supabase } from "./client";

export async function getCategories() {
    return await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });
}

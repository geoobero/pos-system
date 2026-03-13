import { supabase } from "./client";

// Get all users (metadata from auth.users)
export async function getUsers() {
    const { data, error } = await supabase
        .from("users")
        .select("*");
    return { data, error };
}

// Create a user (for user metadata table, NOT for passwords)
// Use Supabase Auth for actual authentication
export async function createUser({ name, email, role }) {
    const { data, error } = await supabase
        .from("users")
        .insert([{ name, email, role }]);
    return { data, error };
}

// Update a user
export async function updateUser(id, { name, email, role }) {
    const { data, error } = await supabase
        .from("users")
        .update({ name, email, role })
        .eq("id", id);
    return { data, error };
}

// Delete a user
export async function deleteUser(id) {
    const { data, error } = await supabase
        .from("users")
        .delete()
        .eq("id", id);
    return { data, error };
}

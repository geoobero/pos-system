import { supabase } from "./client";

// Get all users
export async function getUsers() {
    const { data, error } = await supabase.from("users").select("*");
    return { data, error };
}

// Create a user
export async function createUser({ name, email, role, password }) {
    const { data, error } = await supabase.from("users").insert([
        { name, email, role, password },
    ]);
    return { data, error };
}

// Update a user
export async function updateUser(id, { name, email, role, password }) {
    const updateData = { name, email, role };
    if (password) updateData.password = password;

    const { data, error } = await supabase
        .from("users")
        .update(updateData)
        .eq("id", id);
    return { data, error };
}

// Delete a user
export async function deleteUser(id) {
    const { data, error } = await supabase.from("users").delete().eq("id", id);
    return { data, error };
}

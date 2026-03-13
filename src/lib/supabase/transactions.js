import { supabase } from "./client";

// Get all transactions
export async function getTransactions() {
  return await supabase
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false });
}

// Create a transaction
export async function createTransaction({ items, total, cash, change, cashier }) {
    const { data, error } = await supabase.from("transactions").insert([
        { items, total, cash, change, cashier },
    ]);
    return { data, error };
}

// Update a transaction
export async function updateTransaction(id, { items, total, cash, change, cashier }) {
    const { data, error } = await supabase
        .from("transactions")
        .update({ items, total, cash, change, cashier })
        .eq("id", id);
    return { data, error };
}

// Delete a transaction
export async function deleteTransaction(id) {
    const { data, error } = await supabase.from("transactions").delete().eq("id", id);
    return { data, error };
}

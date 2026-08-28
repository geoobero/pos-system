import { supabase } from "./client";

function buildValidationError(message) {
    return { data: null, error: new Error(message) };
}

// Get all transactions
export async function getTransactions() {
    return await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });
}

// Create a transaction
export async function createTransaction({ items, total, cash, change, cashier }) {
    if (!Array.isArray(items) || items.length === 0) {
        return buildValidationError("Transaction items are required.");
    }

    if (!Number.isFinite(Number(total)) || !Number.isFinite(Number(cash)) || !Number.isFinite(Number(change))) {
        return buildValidationError("Transaction totals must be valid numbers.");
    }

    if (!cashier || typeof cashier !== "string") {
        return buildValidationError("Cashier is required.");
    }

    const { data, error } = await supabase.rpc("complete_sale", {
        p_items: items,
        p_total: total,
        p_cash: cash,
        p_change: change,
        p_cashier: cashier,
    });
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

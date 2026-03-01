import { supabase } from "../supabaseClient";

// Add inventory item
export async function addInventoryItem(userId: string, item: any) {
  const { data, error } = await supabase.from("inventory").insert([{ ...item, user_id: userId }]);
  if (error) throw error;
  return data;
}

// Get inventory for current user
export async function getInventory(userId: string) {
  const { data, error } = await supabase.from("inventory").select("*").eq("user_id", userId);
  if (error) throw error;
  return data;
}

// Update inventory item
export async function updateInventoryItem(itemId: string, updates: any) {
  const { data, error } = await supabase.from("inventory").update(updates).eq("id", itemId);
  if (error) throw error;
  return data;
}

// Delete inventory item
export async function deleteInventoryItem(itemId: string) {
  const { data, error } = await supabase.from("inventory").delete().eq("id", itemId);
  if (error) throw error;
  return data;
}
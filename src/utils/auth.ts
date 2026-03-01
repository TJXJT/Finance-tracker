// src/utils/auth.ts
import { supabase } from "../supabaseClient";

export interface User {
  id: string;
  email: string;
}

// --- Register new user ---
export const registerUser = async (email: string, password: string): Promise<User> => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(error.message);
  if (!data.user) throw new Error("Registration failed");
  return { id: data.user.id, email: data.user.email! };
};

// --- Login existing user ---
export const loginUser = async (email: string, password: string): Promise<User> => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  if (!data.user) throw new Error("Login failed");
  return { id: data.user.id, email: data.user.email! };
};

// --- Get current logged in user ---
export const getCurrentUser = async (): Promise<User | null> => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message);
  if (!data.session?.user) return null;
  return { id: data.session.user.id, email: data.session.user.email! };
};

// --- Logout ---
export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
};
// src/utils/storage.ts
import { Transaction } from "../types";

const STORAGE_KEY = "finance-tracker-transactions";

export function getTransactions(): Transaction[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function addTransaction(t: Transaction) {
  const transactions = getTransactions();
  transactions.push(t);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

export function deleteTransaction(id: string) {
  const transactions = getTransactions().filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}
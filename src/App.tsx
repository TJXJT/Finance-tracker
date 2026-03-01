// src/App.tsx
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

import TransactionForm from "./components/TransactionForm";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import CategoryTotals from "./components/CategoryTotals";

import "./styles.css";

export type Transaction = {
  id: string;
  date: string;
  category: "Dad" | "Mom" | "Vavy" | "Juni" | "Lael";
  description: string;
  amount: number;
  type: "income" | "expense";
  notes?: string;
  location?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
};

export default function App() {
  const [user, setUser] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- Fixed categories ---
  const categories: Transaction["category"][] = ["Dad", "Mom", "Vavy", "Juni", "Lael"];

  // --- Filters & Sorting ---
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [filterCategory, setFilterCategory] = useState<"all" | Transaction["category"]>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [sortField, setSortField] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // --- Fetch transactions ---
  const fetchTransactions = async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from<Transaction>("transactions")
      .select("*")
      .order(sortField, { ascending: sortOrder === "asc" });

    if (error) console.error("Fetch error:", error);
    else setTransactions(data || []);

    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchTransactions();
  }, [user, sortField, sortOrder]);

  // --- Delete transaction ---
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) console.error("Delete error:", error);
    else fetchTransactions();
  };

  // --- Summary calculations ---
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  // --- Filtered & sorted transactions ---
  const displayedTransactions = [...transactions]
    .filter((t) => filterType === "all" || t.type === filterType)
    .filter((t) => filterCategory === "all" || t.category === filterCategory)
    .filter((t) => !startDate || t.date >= startDate)
    .filter((t) => !endDate || t.date <= endDate)
    .sort((a, b) => {
      if (sortField === "date")
        return sortOrder === "asc" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
      return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
    });

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div className="app-container">
      <h1>Finance Tracker</h1>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card balance">
          <h3>Balance</h3>
          <p>${balance.toFixed(2)}</p>
        </div>
        <div className="summary-card income">
          <h3>Total Income</h3>
          <p>${totalIncome.toFixed(2)}</p>
        </div>
        <div className="summary-card expense">
          <h3>Total Expenses</h3>
          <p>${totalExpense.toFixed(2)}</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="buttons-row">
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Hide Transaction Form" : "Add Transaction"}
        </button>
        <button onClick={() => setShowSidebar(!showSidebar)}>
          {showSidebar ? "Hide Filters" : "Show Filters"}
        </button>
        <button className="logout-btn" onClick={() => setUser(null)}>
          Logout
        </button>
      </div>

      {/* Transaction Form */}
      {showForm && <TransactionForm categories={categories} onAdd={fetchTransactions} />}

      {/* Sidebar */}
      {showSidebar && (
        <Sidebar
          filterType={filterType}
          setFilterType={setFilterType}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          sortField={sortField}
          setSortField={setSortField}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          categories={categories}
        />
      )}

      {/* Transactions Table */}
      <div className="transactions-section">
        <h2>Transactions</h2>

        {loading ? (
          <p>Loading...</p>
        ) : displayedTransactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Notes</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedTransactions.map((t, i) => (
                <tr key={t.id} className={i % 2 === 0 ? "even" : "odd"}>
                  <td>{t.date}</td>
                  <td>{t.category}</td>
                  <td>{t.description}</td>
                  <td style={{ textAlign: "right" }}>${t.amount.toFixed(2)}</td>
                  <td style={{ textAlign: "center" }}>{t.type}</td>
                  <td>{t.notes || ""}</td>
                  <td>{t.location || ""}</td>
                  <td style={{ textAlign: "center" }}>
                    <button className="delete-btn" onClick={() => handleDelete(t.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Category Totals */}
      <CategoryTotals transactions={transactions} />
    </div>
  );
}
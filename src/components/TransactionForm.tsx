// src/components/TransactionForm.tsx
import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Transaction } from "../types";

type Props = {
  categories: Transaction["category"][];
  onAdd: () => void;
};

export default function TransactionForm({ categories, onAdd }: Props) {
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);
  const [category, setCategory] = useState<Transaction["category"]>(categories[0]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<"income" | "expense">("income");
  const [notes, setNotes] = useState("");
  const [location, setLocation] = useState("");

  const quickAmounts = [10, 50, 100, 500];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !category || amount <= 0) return;

    const newTransaction: Omit<Transaction, "id"> = {
      date,
      category,
      description,
      amount,
      type,
      notes,
      location,
    };

    const { data, error } = await supabase.from<Transaction>("transactions").insert([newTransaction]);
    if (error) {
      console.error("Error adding transaction:", error);
    } else {
      onAdd();
      // Reset form
      setDate(today);
      setCategory(categories[0]);
      setDescription("");
      setAmount(0);
      setType("income");
      setNotes("");
      setLocation("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <div>
        <label>Date:</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
      </div>

      <div>
        <label>Category:</label>
        <select value={category} onChange={e => setCategory(e.target.value as Transaction["category"])}>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Description:</label>
        <input type="text" value={description} onChange={e => setDescription(e.target.value)} />
      </div>

      <div>
        <label>Amount:</label>
        <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} required />
        <div style={{ marginTop: "0.3rem" }}>
          {quickAmounts.map(a => (
            <button
              key={a}
              type="button"
              onClick={() => setAmount(a)}
              style={{ marginRight: "0.3rem" }}
            >
              ${a}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label>Type:</label>
        <select value={type} onChange={e => setType(e.target.value as "income" | "expense")}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div>
        <label>Notes:</label>
        <input type="text" value={notes} onChange={e => setNotes(e.target.value)} />
      </div>

      <div>
        <label>Location:</label>
        <input type="text" value={location} onChange={e => setLocation(e.target.value)} />
      </div>

      <button type="submit" style={{ marginTop: "0.5rem" }}>Add Transaction</button>
    </form>
  );
}
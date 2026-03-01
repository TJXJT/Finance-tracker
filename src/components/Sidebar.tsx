// src/components/Sidebar.tsx
import React from "react";

type Props = {
  filterType: "all" | "income" | "expense";
  setFilterType: (value: "all" | "income" | "expense") => void;
  filterCategory: "all" | "Dad" | "Mom" | "Vavy" | "Juni" | "Lael";
  setFilterCategory: (value: "all" | "Dad" | "Mom" | "Vavy" | "Juni" | "Lael") => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  sortField: "date" | "amount";
  setSortField: (value: "date" | "amount") => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (value: "asc" | "desc") => void;
};

const categories: Props["filterCategory"][] = ["Dad", "Mom", "Vavy", "Juni", "Lael"];

export default function Sidebar({
  filterType,
  setFilterType,
  filterCategory,
  setFilterCategory,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
}: Props) {
  return (
    <div className="sidebar">
      <h3>Filters</h3>

      <div>
        <label>Type:</label>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value as any)}>
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div>
        <label>Category:</label>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value as any)}>
          <option value="all">All</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Start Date:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </div>

      <div>
        <label>End Date:</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>

      <div>
        <label>Sort by:</label>
        <select value={sortField} onChange={(e) => setSortField(e.target.value as "date" | "amount")}>
          <option value="date">Date</option>
          <option value="amount">Amount</option>
        </select>
      </div>

      <div>
        <label>Order:</label>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
}
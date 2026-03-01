export type Transaction = {
  id: string;           // unique ID for each transaction
  date: string;         // ISO date string
  category: string;     // e.g., "Food", "Salary"
  description: string;  // optional notes
  amount: number;       // positive number
  type: "income" | "expense";
};
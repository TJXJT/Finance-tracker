import { Transaction } from "../types";

type Props = {
  transactions: Transaction[];
};

export default function CategoryTotals({ transactions }: Props) {
  const categoryMap: Record<string, number> = {};

  transactions.forEach(t => {
    if (!categoryMap[t.category]) categoryMap[t.category] = 0;
    if (t.type === "expense") categoryMap[t.category] += t.amount;
  });

  const categories = Object.keys(categoryMap);

  if (categories.length === 0) return <p>No expenses to show.</p>;

  return (
    <div className="category-cards">
      {categories.map(cat => (
        <div className="category-card" key={cat}>
          <p><strong>{cat}</strong></p>
          <p>${categoryMap[cat].toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}
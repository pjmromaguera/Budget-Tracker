import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Props = { householdId: string };

export default function Budgets({ householdId }: Props) {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [amount, setAmount] = useState("");

  async function load() {
    const { data, error } = await supabase
      .from("budgets")
      .select("*")
      .eq("household_id", householdId)
      .order("year", { ascending: false })
      .order("month", { ascending: false });

    if (!error) setBudgets(data || []);
  }

  async function addBudget() {
    await supabase.from("budgets").insert({
      household_id: householdId,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      amount: Number(amount),
    });

    setAmount("");
    load();
  }

  useEffect(() => {
    load();
  }, [householdId]);

  return (
    <div style={{ padding: 16 }}>
      <h2>Budgets</h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          placeholder="Monthly amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={addBudget}>Add Budget</button>
      </div>

      <a href="#/">Dashboard</a> | <a href="#/transactions">Transactions</a>

      <ul style={{ marginTop: 12 }}>
        {budgets.map((b) => (
          <li key={b.id}>
            {b.month}/{b.year}: ₱{b.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}

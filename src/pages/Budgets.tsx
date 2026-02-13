import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Budgets() {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [amount, setAmount] = useState("");

  async function load() {
    const { data } = await supabase.from("budgets").select("*");
    setBudgets(data || []);
  }

  async function addBudget() {
    await supabase.from("budgets").insert({
      amount: Number(amount),
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      household_id: null // TEMP
    });

    setAmount("");
    load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>Budgets</h2>

      <input
        placeholder="Monthly amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      <button onClick={addBudget}>Add Budget</button>

      <ul>
        {budgets.map(b => (
          <li key={b.id}>
            {b.month}/{b.year}: ₱{b.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}

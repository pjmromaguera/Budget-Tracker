import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Dashboard() {
  const [total, setTotal] = useState(0);

  async function load() {
    const { data } = await supabase.from("transactions").select("amount");
    const sum = (data || []).reduce((a, b) => a + Number(b.amount), 0);
    setTotal(sum);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>Dashboard</h2>
      <h3>Total spent: ₱{total.toFixed(2)}</h3>

      <a href="#/transactions">Transactions</a> |{" "}
      <a href="#/budgets">Budgets</a>
    </div>
  );
}

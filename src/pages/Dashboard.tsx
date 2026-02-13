import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Props = { householdId: string };

export default function Dashboard({ householdId }: Props) {
  const [total, setTotal] = useState(0);

  async function load() {
    const { data, error } = await supabase
      .from("transactions")
      .select("amount")
      .eq("household_id", householdId);

    if (error) return;

    const sum = (data || []).reduce((a, b) => a + Number(b.amount), 0);
    setTotal(sum);
  }

  useEffect(() => {
    load();
  }, [householdId]);

  return (
    <div style={{ padding: 16 }}>
      <h2>Dashboard</h2>
      <h3>Total spent (all time): ₱{total.toFixed(2)}</h3>

      <div style={{ marginTop: 8 }}>
        <a href="#/transactions">Transactions</a> |{" "}
        <a href="#/budgets">Budgets</a>
      </div>
    </div>
  );
}

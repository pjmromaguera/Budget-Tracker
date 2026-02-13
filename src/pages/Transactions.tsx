import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Props = { householdId: string };

export default function Transactions({ householdId }: Props) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  async function load() {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("household_id", householdId)
      .order("date", { ascending: false });

    if (!error) setTransactions(data || []);
  }

  async function addTransaction() {
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes.user;
    if (!user) return;

    await supabase.from("transactions").insert({
      household_id: householdId,
      user_id: user.id,
      amount: Number(amount),
      date: new Date().toISOString().slice(0, 10),
      note,
    });

    setAmount("");
    setNote("");
    load();
  }

  useEffect(() => {
    load();
  }, [householdId]);

  return (
    <div style={{ padding: 16 }}>
      <h2>Transactions</h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <input placeholder="Note" value={note} onChange={(e) => setNote(e.target.value)} />
        <button onClick={addTransaction}>Add</button>
      </div>

      <a href="#/">Dashboard</a> | <a href="#/budgets">Budgets</a>

      <ul style={{ marginTop: 12 }}>
        {transactions.map((t) => (
          <li key={t.id}>
            ₱{t.amount} — {t.note} ({t.date})
          </li>
        ))}
      </ul>
    </div>
  );
}

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Transactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  async function load() {
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false });

    setTransactions(data || []);
  }

  async function addTransaction() {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    await supabase.from("transactions").insert({
      amount: Number(amount),
      date: new Date().toISOString().slice(0, 10),
      note,
      user_id: user.id,
      household_id: null // TEMP (we’ll wire household next)
    });

    setAmount("");
    setNote("");
    load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>Transactions</h2>

      <input
        placeholder="Amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />
      <input
        placeholder="Note"
        value={note}
        onChange={e => setNote(e.target.value)}
      />
      <button onClick={addTransaction}>Add</button>

      <ul>
        {transactions.map(t => (
          <li key={t.id}>
            ₱{t.amount} — {t.note} ({t.date})
          </li>
        ))}
      </ul>
    </div>
  );
}

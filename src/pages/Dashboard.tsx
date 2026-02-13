import { supabase } from "../lib/supabase";

export default function Dashboard() {
  return (
    <div style={{ padding: 16, maxWidth: 1100, margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Dashboard</h2>
        <button onClick={() => supabase.auth.signOut()}>Log out</button>
      </header>

      <p style={{ opacity: 0.8 }}>
        Next: household setup, transactions, budgets, charts.
      </p>
    </div>
  );
}

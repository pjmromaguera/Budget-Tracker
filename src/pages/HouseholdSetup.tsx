import { useState } from "react";
import { supabase } from "../lib/supabase";

type Props = {
  onReady: (householdId: string) => void;
};

export default function HouseholdSetup({ onReady }: Props) {
  const [name, setName] = useState("Paola & Voughn");
  const [joinId, setJoinId] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function createHousehold() {
    setMsg(null);
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes.user;
    if (!user) return setMsg("Not logged in.");

    const { data: h, error: hErr } = await supabase
      .from("households")
      .insert({ name })
      .select("id")
      .single();

    if (hErr) return setMsg(hErr.message);

    const { error: mErr } = await supabase
      .from("household_members")
      .insert({ household_id: h.id, user_id: user.id });

    if (mErr) return setMsg(mErr.message);

    onReady(h.id);
  }

  async function joinHousehold() {
    setMsg(null);
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes.user;
    if (!user) return setMsg("Not logged in.");

    const hid = joinId.trim();
    if (!hid) return setMsg("Paste a Household ID.");

    const { error } = await supabase
      .from("household_members")
      .insert({ household_id: hid, user_id: user.id });

    if (error) return setMsg(error.message);

    onReady(hid);
  }

  return (
    <div style={{ maxWidth: 520, margin: "40px auto", padding: 16 }}>
      <h2>Set up your shared household</h2>

      <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12, marginBottom: 16 }}>
        <h3>Create household</h3>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={createHousehold} style={{ marginLeft: 8 }}>Create</button>
        <p style={{ opacity: 0.8 }}>
          After creating, you’ll share the Household ID with Voughn so he can join.
        </p>
      </div>

      <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
        <h3>Join household</h3>
        <input
          placeholder="Paste Household ID"
          value={joinId}
          onChange={(e) => setJoinId(e.target.value)}
        />
        <button onClick={joinHousehold} style={{ marginLeft: 8 }}>Join</button>
      </div>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </div>
  );
}

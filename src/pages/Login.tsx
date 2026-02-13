import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      setMsg(error ? error.message : "Account created. Now sign in.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setMsg(error ? error.message : null);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h1>Budget Buddy</h1>

      <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{mode === "signup" ? "Create account" : "Sign in"}</button>
      </form>

      <button style={{ marginTop: 12 }} onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
        Switch to {mode === "signin" ? "Sign up" : "Sign in"}
      </button>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </div>
  );
}

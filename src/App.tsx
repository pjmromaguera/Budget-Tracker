import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./lib/supabase";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  if (loading) return <div style={{ padding: 16 }}>Loading…</div>;

  return (
    <Routes>
      <Route path="/login" element={session ? <Navigate to="/" /> : <Login />} />
      <Route path="/" element={session ? <Dashboard /> : <Navigate to="/login" />} />
    </Routes>
  );
}

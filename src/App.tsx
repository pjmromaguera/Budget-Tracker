import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./lib/supabase";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import HouseholdSetup from "./pages/HouseholdSetup";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [householdId, setHouseholdId] = useState<string | null>(
    localStorage.getItem("householdId")
  );

  async function pickFirstHouseholdIfAny() {
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes.user;
    if (!user) return;

    const { data, error } = await supabase
      .from("household_members")
      .select("household_id")
      .eq("user_id", user.id)
      .limit(1);

    if (!error && data && data.length > 0) {
      const hid = data[0].household_id as string;
      localStorage.setItem("householdId", hid);
      setHouseholdId(hid);
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        localStorage.removeItem("householdId");
        setHouseholdId(null);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session && !householdId) {
      pickFirstHouseholdIfAny();
    }
  }, [session, householdId]);

  function onHouseholdReady(hid: string) {
    localStorage.setItem("householdId", hid);
    setHouseholdId(hid);
  }

  if (loading) return <div style={{ padding: 16 }}>Loading…</div>;

  if (!session) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  // logged in but no household yet
  if (!householdId) {
    return <HouseholdSetup onReady={onHouseholdReady} />;
  }

  // logged in + household selected
  return (
    <Routes>
      <Route path="/" element={<Dashboard householdId={householdId} />} />
      <Route path="/transactions" element={<Transactions householdId={householdId} />} />
      <Route path="/budgets" element={<Budgets householdId={householdId} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

"use client";

import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export function useUser() {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Helper: display name from metadata or email prefix
  const displayName =
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";

  const initial = displayName[0]?.toUpperCase() ?? "U";

  return { user, loading, displayName, initial };
}

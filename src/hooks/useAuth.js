import { useState, useEffect } from "react";
import { getSession, onAuthChange } from "../lib/api.js";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });
    const sub = onAuthChange(setUser);
    return () => sub.unsubscribe();
  }, []);

  return { user, loading };
}

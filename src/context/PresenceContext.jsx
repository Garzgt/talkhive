import { useEffect } from "react";
import { AppState } from "react-native";
import { supabase } from "../config/supabase";
import { useAuth } from "./AuthContext";

async function setPresence(userId, online) {
  const patch = { is_online: online };
  if (!online) patch.last_seen_at = new Date().toISOString();
  await supabase.from("profiles").update(patch).eq("id", userId);
}

export function PresenceProvider({ children }) {
  const { profile } = useAuth();

  useEffect(() => {
    if (!profile?.id) return;
    setPresence(profile.id, true);

    const sub = AppState.addEventListener("change", (state) => {
      setPresence(profile.id, state === "active");
    });

    return () => {
      sub.remove();
      setPresence(profile.id, false);
    };
  }, [profile?.id]);

  return <>{children}</>;
}

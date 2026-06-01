import { createContext, useContext, useState, useEffect, useRef } from "react";
import { supabase } from "../config/supabase";
import { getUnreadCount } from "../screens/Notifications/services/notificationService";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext({ unreadCount: 0, refresh: () => {} });

export function NotificationProvider({ children }) {
  const { profile } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  async function refresh() {
    if (!profile?.id) return;
    try {
      const count = await getUnreadCount(profile.id);
      setUnreadCount(count);
    } catch (_) {}
  }

  const refreshRef = useRef(refresh);
  useEffect(() => { refreshRef.current = refresh; });

  useEffect(() => {
    if (!profile?.id) return;
    refreshRef.current();

    const channel = supabase
      .channel(`notif-badge-${profile.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${profile.id}`,
        },
        () => refreshRef.current()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [profile?.id]);

  return (
    <NotificationContext.Provider value={{ unreadCount, refresh }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}

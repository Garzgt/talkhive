import { supabase } from "../../../config/supabase";

export function subscribeToRoomList(userId, onUpdate) {
  const channel = supabase
    .channel(`room-list-${userId}`)
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "rooms" }, onUpdate)
    .on("postgres_changes", { event: "DELETE", schema: "public", table: "rooms" }, onUpdate)
    .on("postgres_changes", {
      event:  "*",
      schema: "public",
      table:  "room_members",
      filter: `user_id=eq.${userId}`,
    }, onUpdate)
    .subscribe();

  return () => supabase.removeChannel(channel);
}

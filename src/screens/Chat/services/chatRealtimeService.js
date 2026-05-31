import { supabase } from "../../../config/supabase";

export function subscribeToRoom(roomId, onInsert) {
  const channel = supabase
    .channel(`room-messages-${roomId}`)
    .on(
      "postgres_changes",
      {
        event:  "INSERT",
        schema: "public",
        table:  "messages",
        filter: `room_id=eq.${roomId}`,
      },
      async (payload) => {
        if (payload.new.is_deleted) return;
        const { data: sender } = await supabase
          .from("profiles")
          .select("id, username, display_name, avatar_url")
          .eq("id", payload.new.sender_id)
          .single();
        onInsert({ ...payload.new, sender: sender || null });
      }
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}

import { supabase } from "../../../config/supabase";

export function subscribeToRoom(roomId, { onInsert, onEdit, onReaction }) {
  const channel = supabase
    .channel(`room-messages-${roomId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages", filter: `room_id=eq.${roomId}` },
      async (payload) => {
        if (payload.new.is_deleted) return;

        const [{ data: sender }, { data: attachments }] = await Promise.all([
          supabase
            .from("profiles")
            .select("id, username, display_name, avatar_url")
            .eq("id", payload.new.sender_id)
            .single(),
          supabase
            .from("attachments")
            .select("*")
            .eq("message_id", payload.new.id),
        ]);

        const enriched = (attachments || []).map((a) => ({
          ...a,
          url: supabase.storage.from("chat-attachments").getPublicUrl(a.storage_path).data.publicUrl,
        }));

        onInsert({ ...payload.new, sender: sender || null, attachments: enriched, reactions: [] });
      }
    )
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "messages", filter: `room_id=eq.${roomId}` },
      (payload) => onEdit?.(payload.new)
    )
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "reactions" },
      (payload) => onReaction?.({ reaction: payload.new, type: "add" })
    )
    .on(
      "postgres_changes",
      { event: "DELETE", schema: "public", table: "reactions" },
      (payload) => onReaction?.({ reaction: payload.old, type: "remove" })
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}

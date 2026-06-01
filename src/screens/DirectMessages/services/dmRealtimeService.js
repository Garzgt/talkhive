import { supabase } from "../../../config/supabase";

export function subscribeToInbox(userId, onNewMessage) {
  const channel = supabase
    .channel(`dm-inbox-${userId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "direct_messages", filter: `to_id=eq.${userId}` },
      (payload) => { if (!payload.new.is_deleted) onNewMessage(payload.new); }
    )
    .subscribe();
  return () => supabase.removeChannel(channel);
}

export function subscribeToDM(userId, otherId, { onInsert, onEdit, onReaction }) {
  const channel = supabase
    .channel(`dm-${[userId, otherId].sort().join("-")}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "direct_messages", filter: `from_id=eq.${otherId}` },
      async (payload) => {
        if (payload.new.to_id !== userId) return;
        if (payload.new.is_deleted) return;

        const [{ data: from }, { data: attachments }] = await Promise.all([
          supabase
            .from("profiles")
            .select("id, username, display_name, avatar_url")
            .eq("id", payload.new.from_id)
            .single(),
          supabase.from("attachments").select("*").eq("dm_id", payload.new.id),
        ]);

        const enriched = (attachments || []).map((a) => ({
          ...a,
          url: supabase.storage.from("chat-attachments").getPublicUrl(a.storage_path).data.publicUrl,
        }));

        onInsert({ ...payload.new, from: from || null, attachments: enriched, dm_reactions: [] });
      }
    )
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "direct_messages" },
      (payload) => {
        const { from_id, to_id } = payload.new;
        const isRelevant =
          (from_id === userId && to_id === otherId) ||
          (from_id === otherId && to_id === userId);
        if (isRelevant) onEdit?.(payload.new);
      }
    )
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "dm_reactions" },
      (payload) => onReaction?.({ reaction: payload.new, type: "add" })
    )
    .on(
      "postgres_changes",
      { event: "DELETE", schema: "public", table: "dm_reactions" },
      (payload) => onReaction?.({ reaction: payload.old, type: "remove" })
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}

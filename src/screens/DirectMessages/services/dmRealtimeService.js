import { supabase } from "../../../config/supabase";

export function subscribeToDM(userId, otherId, onInsert) {
  console.log("[dmRealtime] subscribing to DM —", { userId, otherId });

  const channel = supabase
    .channel(`dm-${[userId, otherId].sort().join("-")}`)
    .on(
      "postgres_changes",
      {
        event:  "INSERT",
        schema: "public",
        table:  "direct_messages",
        filter: `from_id=eq.${otherId}`,
      },
      async (payload) => {
        console.log("[dmRealtime] new message →", payload.new);
        if (payload.new.to_id !== userId) return;
        if (payload.new.is_deleted) return;

        const { data: from } = await supabase
          .from("profiles")
          .select("id, username, display_name, avatar_url")
          .eq("id", payload.new.from_id)
          .single();

        onInsert({ ...payload.new, from: from || null });
      }
    )
    .subscribe((status) => {
      console.log("[dmRealtime] status →", status);
    });

  return () => {
    console.log("[dmRealtime] unsubscribing");
    supabase.removeChannel(channel);
  };
}

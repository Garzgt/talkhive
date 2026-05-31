import { supabase } from "../../../config/supabase";

export async function fetchConversations(userId) {
  console.log("[dmService] fetchConversations — userId:", userId);

  const { data, error } = await supabase
    .from("direct_messages")
    .select("*")
    .or(`from_id.eq.${userId},to_id.eq.${userId}`)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false });

  console.log("[dmService] raw DMs →", { count: data?.length, error });
  if (error) throw error;
  if (!data.length) return [];

  const convMap = {};
  for (const msg of data) {
    const otherId = msg.from_id === userId ? msg.to_id : msg.from_id;
    if (!convMap[otherId]) {
      convMap[otherId] = { otherId, lastMessage: msg, unreadCount: 0 };
    }
    if (!msg.is_read && msg.to_id === userId) {
      convMap[otherId].unreadCount++;
    }
  }

  const otherIds = Object.keys(convMap);
  const { data: profiles, error: profErr } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, is_online")
    .in("id", otherIds);

  console.log("[dmService] profiles →", { count: profiles?.length, profErr });

  return Object.values(convMap)
    .map((c) => ({
      ...c,
      profile: (profiles || []).find((p) => p.id === c.otherId) || null,
    }))
    .sort((a, b) => new Date(b.lastMessage.created_at) - new Date(a.lastMessage.created_at));
}

export async function fetchDMMessages(userId, otherId) {
  console.log("[dmService] fetchDMMessages — userId:", userId, "otherId:", otherId);

  const { data, error } = await supabase
    .from("direct_messages")
    .select("*, from:profiles!direct_messages_from_id_fkey(id, username, display_name, avatar_url)")
    .or(`and(from_id.eq.${userId},to_id.eq.${otherId}),and(from_id.eq.${otherId},to_id.eq.${userId})`)
    .eq("is_deleted", false)
    .order("created_at", { ascending: true });

  console.log("[dmService] messages →", { count: data?.length, error });
  if (error) throw error;
  return data;
}

export async function sendDM(fromId, toId, body) {
  console.log("[dmService] sendDM →", { fromId, toId, body });

  const { data, error } = await supabase
    .from("direct_messages")
    .insert({ from_id: fromId, to_id: toId, body: body.trim() })
    .select("*, from:profiles!direct_messages_from_id_fkey(id, username, display_name, avatar_url)")
    .single();

  console.log("[dmService] sendDM result →", { data, error });
  if (error) throw error;
  return data;
}

export async function markMessagesRead(userId, otherId) {
  const { error } = await supabase
    .from("direct_messages")
    .update({ is_read: true })
    .eq("to_id", userId)
    .eq("from_id", otherId)
    .eq("is_read", false);

  if (error) console.log("[dmService] markRead error →", error);
}

export async function deleteDM(messageId) {
  const { error } = await supabase
    .from("direct_messages")
    .update({ is_deleted: true })
    .eq("id", messageId);
  if (error) throw error;
}

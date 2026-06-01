import { supabase } from "../../../config/supabase";

function withAttachmentUrls(msg) {
  if (!msg.attachments?.length) return msg;
  return {
    ...msg,
    attachments: msg.attachments.map((a) => ({
      ...a,
      url: supabase.storage.from("chat-attachments").getPublicUrl(a.storage_path).data.publicUrl,
    })),
  };
}

export async function fetchConversations(userId) {
  const [{ data, error }, { data: hiddenRows }] = await Promise.all([
    supabase
      .from("direct_messages")
      .select("*")
      .or(`from_id.eq.${userId},to_id.eq.${userId}`)
      .eq("is_deleted", false)
      .order("created_at", { ascending: false }),
    supabase
      .from("dm_hidden")
      .select("other_user_id, hidden_at")
      .eq("user_id", userId),
  ]);
  if (error) throw error;
  if (!data.length) return [];

  const hiddenMap = {};
  for (const h of hiddenRows ?? []) hiddenMap[h.other_user_id] = h.hidden_at;

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

  // Only show conversations where: not hidden, OR a new message arrived after hidden_at
  const otherIds = Object.keys(convMap).filter((id) => {
    const hiddenAt = hiddenMap[id];
    if (!hiddenAt) return true;
    return new Date(convMap[id].lastMessage.created_at) > new Date(hiddenAt);
  });
  if (!otherIds.length) return [];

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, is_online")
    .in("id", otherIds);

  return otherIds
    .map((id) => ({
      ...convMap[id],
      profile: (profiles || []).find((p) => p.id === id) || null,
    }))
    .sort((a, b) => new Date(b.lastMessage.created_at) - new Date(a.lastMessage.created_at));
}

export async function hideConversation(userId, otherId) {
  const { error } = await supabase
    .from("dm_hidden")
    .upsert(
      { user_id: userId, other_user_id: otherId, hidden_at: new Date().toISOString() },
      { onConflict: "user_id,other_user_id" }
    );
  if (error) throw error;
}

export async function fetchDMMessages(userId, otherId) {
  const { data: hiddenRow } = await supabase
    .from("dm_hidden")
    .select("hidden_at")
    .eq("user_id", userId)
    .eq("other_user_id", otherId)
    .maybeSingle();

  let query = supabase
    .from("direct_messages")
    .select("*, from:profiles!direct_messages_from_id_fkey(id, username, display_name, avatar_url), attachments(*), dm_reactions(id, emoji, user_id)")
    .or(`and(from_id.eq.${userId},to_id.eq.${otherId}),and(from_id.eq.${otherId},to_id.eq.${userId})`)
    .eq("is_deleted", false)
    .order("created_at", { ascending: true });

  if (hiddenRow?.hidden_at) {
    query = query.gt("created_at", hiddenRow.hidden_at);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(withAttachmentUrls);
}

export async function sendDM(fromId, toId, body, attachment = null) {
  const { data, error } = await supabase
    .from("direct_messages")
    .insert({ from_id: fromId, to_id: toId, body: body || null })
    .select("*, from:profiles!direct_messages_from_id_fkey(id, username, display_name, avatar_url)")
    .single();
  if (error) throw error;

  if (attachment) {
    await supabase.from("attachments").insert({
      dm_id:        data.id,
      storage_path: attachment.path,
      file_name:    attachment.fileName,
      mime_type:    attachment.mimeType,
      file_size:    attachment.fileSize,
    });
  }

  return {
    ...data,
    attachments: attachment
      ? [{ storage_path: attachment.path, url: attachment.url, mime_type: attachment.mimeType }]
      : [],
  };
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

export async function editDM(messageId, body) {
  const { error } = await supabase
    .from("direct_messages")
    .update({ body, is_edited: true, updated_at: new Date().toISOString() })
    .eq("id", messageId);
  if (error) throw error;
}

export async function toggleDMReaction(dmId, userId, emoji) {
  // One reaction per user — find any existing reaction on this message by this user
  const { data: existing } = await supabase
    .from("dm_reactions")
    .select("id, emoji")
    .eq("dm_id", dmId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    await supabase.from("dm_reactions").delete().eq("id", existing.id);
    if (existing.emoji === emoji) return; // same emoji → just remove (toggle off)
  }
  const { error } = await supabase.from("dm_reactions").insert({ dm_id: dmId, user_id: userId, emoji });
  if (error) throw error;
}

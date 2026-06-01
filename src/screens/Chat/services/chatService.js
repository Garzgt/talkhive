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

export async function fetchMessages(roomId) {
  const { data, error } = await supabase
    .from("messages")
    .select("*, sender:profiles!messages_sender_id_fkey(id, username, display_name, avatar_url), attachments(*), reactions(id, emoji, user_id)")
    .eq("room_id", roomId)
    .eq("is_deleted", false)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data || []).map(withAttachmentUrls);
}

export async function sendMessage(roomId, senderId, body, attachment = null) {
  const { data, error } = await supabase
    .from("messages")
    .insert({ room_id: roomId, sender_id: senderId, body: body || null })
    .select("*, sender:profiles!messages_sender_id_fkey(id, username, display_name, avatar_url)")
    .single();
  if (error) throw error;

  if (attachment) {
    await supabase.from("attachments").insert({
      message_id:   data.id,
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

export async function deleteMessage(messageId) {
  const { error } = await supabase
    .from("messages")
    .update({ is_deleted: true })
    .eq("id", messageId);
  if (error) throw error;
}

export async function editMessage(messageId, body) {
  const { error } = await supabase
    .from("messages")
    .update({ body, is_edited: true, updated_at: new Date().toISOString() })
    .eq("id", messageId);
  if (error) throw error;
}

export async function toggleReaction(messageId, userId, emoji) {
  // One reaction per user — find any existing reaction on this message by this user
  const { data: existing } = await supabase
    .from("reactions")
    .select("id, emoji")
    .eq("message_id", messageId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    await supabase.from("reactions").delete().eq("id", existing.id);
    if (existing.emoji === emoji) return; // same emoji → just remove (toggle off)
  }
  const { error } = await supabase.from("reactions").insert({ message_id: messageId, user_id: userId, emoji });
  if (error) throw error;
}

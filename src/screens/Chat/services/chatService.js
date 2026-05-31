import { supabase } from "../../../config/supabase";

export async function fetchMessages(roomId) {
  const { data, error } = await supabase
    .from("messages")
    .select("*, sender:profiles!messages_sender_id_fkey(id, username, display_name, avatar_url)")
    .eq("room_id", roomId)
    .eq("is_deleted", false)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function sendMessage(roomId, senderId, body) {
  const { data, error } = await supabase
    .from("messages")
    .insert({ room_id: roomId, sender_id: senderId, body: body.trim() })
    .select("*, sender:profiles!messages_sender_id_fkey(id, username, display_name, avatar_url)")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteMessage(messageId) {
  const { error } = await supabase
    .from("messages")
    .update({ is_deleted: true })
    .eq("id", messageId);
  if (error) throw error;
}

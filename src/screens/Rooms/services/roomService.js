import { supabase } from "../../../config/supabase";

export async function fetchRooms(userId, filter = "all") {
  const { data: rooms, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("is_private", false)
    .order("created_at", { ascending: false });
  if (error) throw error;
  if (!rooms.length) return [];

  const [{ data: memberships }, { data: allMembers }] = await Promise.all([
    supabase.from("room_members").select("room_id, status").eq("user_id", userId),
    supabase.from("room_members").select("room_id").eq("status", "approved").in("room_id", rooms.map((r) => r.id)),
  ]);

  const statusMap = {};
  (memberships || []).forEach((m) => { statusMap[m.room_id] = m.status; });

  const countMap = {};
  (allMembers || []).forEach((m) => {
    countMap[m.room_id] = (countMap[m.room_id] || 0) + 1;
  });

  const enriched = rooms.map((r) => ({
    ...r,
    member_count: countMap[r.id] || 0,
    is_joined:    statusMap[r.id] === "approved",
    is_pending:   statusMap[r.id] === "pending",
  }));

  if (filter === "joined") return enriched.filter((r) => r.is_joined);
  return enriched;
}

export async function createRoom(userId, name, description) {
  const { data, error } = await supabase
    .from("rooms")
    .insert({
      name:        name.trim(),
      description: description?.trim() || null,
      created_by:  userId,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function joinRoom(roomId, userId) {
  const { error } = await supabase
    .from("room_members")
    .insert({ room_id: roomId, user_id: userId, status: "pending" });
  if (error) throw error;
}

export async function leaveRoom(roomId, userId) {
  const { error } = await supabase
    .from("room_members")
    .delete()
    .eq("room_id", roomId)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function fetchPendingRequests(roomId) {
  const { data, error } = await supabase
    .from("room_members")
    .select("id, user_id, joined_at, profiles!room_members_user_id_fkey(id, username, display_name)")
    .eq("room_id", roomId)
    .eq("status", "pending")
    .order("joined_at", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function approveRequest(membershipId) {
  const { error } = await supabase
    .from("room_members")
    .update({ status: "approved" })
    .eq("id", membershipId);
  if (error) throw error;
}

export async function rejectRequest(membershipId) {
  const { error } = await supabase
    .from("room_members")
    .delete()
    .eq("id", membershipId);
  if (error) throw error;
}

export async function kickMember(membershipId) {
  const { error } = await supabase
    .from("room_members")
    .delete()
    .eq("id", membershipId);
  if (error) throw error;
}

export async function deleteRoom(roomId) {
  const { error } = await supabase
    .from("rooms")
    .delete()
    .eq("id", roomId);
  if (error) throw error;
}

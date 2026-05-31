import { supabase } from "../../../config/supabase";

export async function searchUsers(query, currentUserId) {
  console.log("[searchService] searchUsers — query:", query);
  if (!query.trim()) return [];

  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, display_name, avatar_url, is_online")
    .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
    .neq("id", currentUserId)
    .limit(20);

  console.log("[searchService] results →", { count: data?.length, error });
  if (error) throw error;
  return data;
}

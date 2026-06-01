import { supabase } from "../../../config/supabase";
import * as FileSystem from "expo-file-system/legacy";

function decodeBase64(base64) {
  const binary = atob(base64);
  const bytes  = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

export async function updateProfile(userId, { displayName, bio }) {
  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: displayName?.trim() || null,
      bio:          bio?.trim() || null,
      updated_at:   new Date().toISOString(),
    })
    .eq("id", userId);
  if (error) throw error;
}

export async function changePassword(email, currentPassword, newPassword) {
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword,
  });
  if (verifyError) throw new Error("Current password is incorrect.");

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

export async function uploadAvatar(userId, asset) {
  const ext      = asset.uri.split(".").pop()?.toLowerCase() || "jpg";
  const mimeType = asset.mimeType || `image/${ext}`;
  const filePath = `${userId}/avatar.${ext}`;

  const base64 = await FileSystem.readAsStringAsync(asset.uri, {
    encoding: "base64",
  });

  const { data, error } = await supabase.storage
    .from("avatars")
    .upload(filePath, decodeBase64(base64), {
      contentType: mimeType,
      upsert:      true,
    });
  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from("avatars")
    .getPublicUrl(data.path);

  const urlWithBust = `${publicUrl}?t=${Date.now()}`;

  await supabase
    .from("profiles")
    .update({ avatar_url: urlWithBust })
    .eq("id", userId);

  return urlWithBust;
}

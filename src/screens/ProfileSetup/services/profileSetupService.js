import { supabase } from "../../../config/supabase";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";

export const updateProfile = async (userId, updates) => {
  const { error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId);
  if (error) throw error;
};

export const uploadAvatar = async (userId, imageUri) => {
  const base64 = await FileSystem.readAsStringAsync(imageUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const arrayBuffer = decode(base64);
  const filePath = `${userId}/avatar.jpg`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, arrayBuffer, {
      contentType: "image/jpeg",
      upsert: true,
    });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
  return data.publicUrl;
};

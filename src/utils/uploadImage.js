import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { supabase } from "../config/supabase";

function decodeBase64(base64) {
  console.log("[upload] decoding base64, length:", base64.length);
  const binary = atob(base64);
  const bytes  = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  console.log("[upload] decoded bytes:", bytes.byteLength);
  return bytes.buffer;
}

export async function pickImage() {
  console.log("[upload] requesting media library permission");
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  console.log("[upload] permission status:", status);
  if (status !== "granted") throw new Error("Gallery permission denied.");

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    quality:    0.8,
  });
  console.log("[upload] picker result — canceled:", result.canceled, "assets:", result.assets?.length);
  if (result.canceled) return null;
  const asset = result.assets[0];
  console.log("[upload] picked asset:", { uri: asset.uri, mimeType: asset.mimeType, fileSize: asset.fileSize });
  return asset;
}

export async function uploadImage(userId, asset) {
  console.log("[upload] starting upload — userId:", userId, "uri:", asset.uri);
  const ext      = asset.uri.split(".").pop()?.toLowerCase() || "jpg";
  const mimeType = asset.mimeType || `image/${ext}`;
  const filePath = `${userId}/${Date.now()}.${ext}`;
  console.log("[upload] filePath:", filePath, "mimeType:", mimeType);

  console.log("[upload] reading file as base64...");
  const base64 = await FileSystem.readAsStringAsync(asset.uri, {
    encoding: "base64",
  });
  console.log("[upload] base64 read, length:", base64.length);

  const buffer = decodeBase64(base64);
  console.log("[upload] uploading to supabase storage...");

  const { data, error } = await supabase.storage
    .from("chat-attachments")
    .upload(filePath, buffer, { contentType: mimeType });

  console.log("[upload] storage upload result:", { data, error });
  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from("chat-attachments")
    .getPublicUrl(data.path);

  console.log("[upload] publicUrl:", publicUrl);

  return {
    path:     data.path,
    url:      publicUrl,
    mimeType,
    fileName: asset.fileName || filePath,
    fileSize: asset.fileSize || null,
  };
}

import { supabase } from "../../../config/supabase";

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) throw error;
  return data;
};

export const signUp = async (email, password, username) => {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: {
        username: username.trim().toLowerCase(),
        display_name: username.trim(),
      },
    },
  });
  if (error) throw error;
  return data;
};

export const sendOtpCode = async (email) => {
  const { sendOtpEmail } = await import("./brevoService");
  const normalizedEmail = email.trim().toLowerCase();

  const { data: exists, error: checkError } = await supabase.rpc("check_email_exists", { p_email: normalizedEmail });
  if (checkError) throw checkError;
  if (!exists) throw new Error("EMAIL_NOT_FOUND");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  const { error } = await supabase
    .from("password_resets")
    .upsert({ email: normalizedEmail, otp, expires_at: expiresAt });
  if (error) throw error;

  await sendOtpEmail(normalizedEmail, otp);
};

export const verifyOtpCode = async (email, otp) => {
  const { data: anyMatch } = await supabase
    .from("password_resets")
    .select("expires_at")
    .eq("email", email.trim().toLowerCase())
    .eq("otp", otp)
    .single();

  if (!anyMatch) throw new Error("WRONG_CODE");
  if (new Date(anyMatch.expires_at) < new Date()) throw new Error("EXPIRED_CODE");
};

export const resetPasswordWithOtp = async (email, otp, newPassword) => {
  const { error } = await supabase.rpc("reset_password_with_otp", {
    p_email: email.trim().toLowerCase(),
    p_otp: otp,
    p_new_password: newPassword,
  });
  if (error) throw error;
};

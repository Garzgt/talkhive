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

export const sendPasswordReset = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(
    email.trim().toLowerCase()
  );
  if (error) throw error;
};

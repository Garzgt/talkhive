export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidUsername = (username) =>
  /^[a-zA-Z0-9_]{3,20}$/.test(username);

export const isValidPassword = (password) =>
  password && password.length >= 8;

export const getPasswordStrength = (password) => {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8)  score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

export const formatFileSize = (bytes) => {
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const formatUsername = (username) =>
  username ? `@${username}` : "";

export const truncate = (str, max = 60) =>
  str && str.length > max ? `${str.slice(0, max)}…` : str;

export const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
};

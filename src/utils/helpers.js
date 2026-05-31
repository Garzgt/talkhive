export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const generateConversationId = (userIdA, userIdB) =>
  [userIdA, userIdB].sort().join("_");

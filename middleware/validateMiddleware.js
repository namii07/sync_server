export const sanitizeInput = (value) => {
  if (!value) return "";
  return value.replace(/[<>/"'`;()]/g, "").trim();
};

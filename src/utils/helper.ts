export const getAuthToken = () => {
  if (typeof window === "undefined") return "";
  const token = localStorage?.getItem("token") ?? sessionStorage.getItem("token") ?? "";
  return token;
}

export const logout = () => {
  if (typeof window === "undefined") return;
  localStorage?.clear();
  sessionStorage?.clear();
}
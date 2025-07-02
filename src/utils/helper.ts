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

export const getAvtarName = (name: string) => {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length > 1) {
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`;
  }
  return name.charAt(0);
};
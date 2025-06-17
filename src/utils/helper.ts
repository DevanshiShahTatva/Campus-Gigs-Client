export const getAuthToken = () => {
  const token = localStorage.getItem("token") ?? sessionStorage.getItem("token") ?? "";
  return token;
}

export const logout = () => {
  localStorage.clear();
  sessionStorage.clear();
}
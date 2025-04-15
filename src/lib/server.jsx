export const apiRoute = "https://yaro-6000-karma.offline.coffeecodes.in";

export const getAuthHeaders = () => {
  const token =
    localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};


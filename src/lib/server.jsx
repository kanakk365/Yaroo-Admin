export const apiRoute = "http://localhost:3000";

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


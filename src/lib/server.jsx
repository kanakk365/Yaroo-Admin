export const apiRoute= "http://localhost:3000"

// Helper function to get auth headers
export const getAuthHeaders = () => {
  // Get token from local storage or session storage
  const token = localStorage.getItem("adminToken") || sessionStorage.getItem("adminToken");
  
  const headers = {
    "Content-Type": "application/json",
 
  };

  // Add Authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

// Authenticated axios request helper
export const authRequest = async (method, endpoint, data = null) => {
  // Import axios dynamically to avoid server/client mismatch
  const axios = (await import('axios')).default;
  
  const config = {
    method,
    url: `${apiRoute}${endpoint}`,
    headers: getAuthHeaders()
  };

  if (data) {
    config.data = data;
  }

  return axios(config);
}
"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { apiRoute } from "@/lib/server";

interface Region {
  id: string;
  name: string;
}

interface User {
  uid: string;
  email: string;
  phone?: string;
  region: string;
  admin: boolean;
  name?: string;
}

interface RegisterData {
  id: string;
  username: string;
  password: string;
  email: string;
  address: string;
  dob: string;
  referral_code?: string;
  region: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  token: string | null;
  loginWithPhone: (phone: string) => Promise<void>;
  verifyOtp: (
    phone: string,
    otp: string,
    remember?: boolean
  ) => Promise<{ success: boolean; accountExists: boolean; token: string }>;
  registerAdmin: (registerData: RegisterData) => Promise<void>;
  getRegions: () => Promise<Region[]>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const storedToken = localStorage.getItem("adminToken");
      const storedUser = localStorage.getItem("adminUser");

      if (storedToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setToken(storedToken);
          setIsAuthenticated(true);

          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${storedToken}`;
        } catch (error) {
          console.error("Error parsing stored user data:", error);
          localStorage.removeItem("adminUser");
          localStorage.removeItem("adminToken");
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const loginWithPhone = async (phone: string) => {
    try {
      const response = await axios.post(
        `${apiRoute}/v1/admin/phone_login`,
        {
          phone,
        },
        {
          timeout: 10000,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to send OTP");
      }

      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error && error.code === "ERR_NETWORK") {
        console.error("Network error when attempting phone login:", error);
        throw new Error(
          "Network error: Unable to connect to the authentication service. Please check your internet connection and try again."
        );
      }
      console.error("Phone login error:", error);
      throw error;
    }
  };

  const verifyOtp = async (phone: string, otp: string, remember = false) => {
    try {
      console.log("Verifying OTP with:", { phone, otp });

      const response = await axios.post(
        `${apiRoute}/v1/admin/phone_verify_otp`,
        {
          phone: phone,
          otp: otp,
        }
      );

      if (response.data.success) {
        const authToken = response.data.data.token;
        const accountExists = response.data.data.account_exists;

        setToken(authToken);

        axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;

        if (accountExists) {
          try {
            const base64Url = authToken.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const decodedToken = JSON.parse(window.atob(base64));

            const userData: User = {
              uid: decodedToken.uid,
              email: decodedToken.email || "",
              phone: decodedToken.phone || phone,
              region: decodedToken.region || "",
              admin: true,
              name: decodedToken.name || "",
            };

            handleAuthSuccess(authToken, userData, remember);
          } catch (decodeError) {
            console.error("Error decoding token:", decodeError);
          }
        }

        return {
          success: true,
          accountExists,
          token: authToken,
        };
      }

      throw new Error(response.data.message || "OTP verification failed");
    } catch (error: unknown) {
      console.error("OTP verification error:", error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
          throw new Error(axiosError.response.data.message);
        }
      }
      throw new Error("OTP verification failed. Please try again.");
    }
  };

  const registerAdmin = async (registerData: RegisterData) => {
    try {
      const response = await axios.post(
        `${apiRoute}/v1/admin/register`,
        registerData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Registration failed");
      }

      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const handleAuthSuccess = (
    authToken: string,
    userData: User,
    remember: boolean
  ) => {
    setToken(authToken);
    setUser(userData);
    setIsAuthenticated(true);

    axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;

    if (remember) {
      localStorage.setItem("adminToken", authToken);
      localStorage.setItem("adminUser", JSON.stringify(userData));
    } else {
      sessionStorage.setItem("adminToken", authToken);
      sessionStorage.setItem("adminUser", JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);

    delete axios.defaults.headers.common["Authorization"];

    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminUser");
  };

  const getRegions = async (): Promise<Region[]> => {
    try {
      const response = await axios.get(`${apiRoute}/v1/regions`);

      if (response.data.success) {
        return response.data.data.regions || [];
      }

      throw new Error(response.data.message || "Failed to fetch regions");
    } catch (error) {
      console.error("Error fetching regions:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        user,
        token,
        loginWithPhone,
        verifyOtp,
        registerAdmin,
        getRegions,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

import { create } from "zustand";
import {
  login as loginApi,
  logout as logoutApi,
  register as registerApi,
  getMe as getMeApi,
} from "./auth.api";

// Функція для декодування JWT токену
const parseTokenPayload = (token) => {
  if (!token || typeof token !== 'string') return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error parsing token:", error);
    return null;
  }
};

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") === "undefined" ? null : localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token") && localStorage.getItem("token") !== "undefined",
  isLoading: false,
  error: null,

  // Додамо метод для отримання ролі користувача
  getUserRole: () => {
    const token = localStorage.getItem("token");
    if (token) {
      const userData = parseTokenPayload(token);
      return userData?.role || null;
    }
    return null;
  },

  // Додамо метод для перевірки прав доступу
  hasRole: (requiredRole) => {
    const userRole = localStorage.getItem("token")
      ? parseTokenPayload(localStorage.getItem("token"))?.role
      : null;

    if (!userRole) return false;

    // Визначаємо ієрархію ролей
    const roleHierarchy = {
      admin: 3,
      manager: 2,
      employee: 1
    };

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await loginApi(credentials);
      console.log("Login response:", response); // Логування відповіді
      const { token } = response.data || {};
      if (!token) {
        throw new Error("No token received from server");
      }
      localStorage.setItem("token", token);

      // Додатково отримаємо дані користувача з токену або іншим способом
      const userData = parseTokenPayload(token);
      set({ token, user: userData, isAuthenticated: true, isLoading: false });
      return { success: true, token, user: userData };
    } catch (error) {
      console.error("Login error:", error); // Логування помилки
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      set({
        error: errorMessage,
        isLoading: false,
      });
      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await registerApi(userData);
      const { token } = response.data.data || {};
      if (!token) {
        throw new Error("No token received from server");
      }
      localStorage.setItem("token", token);

      // Додатково отримаємо дані користувача з токену або іншим способом
      const tokenData = parseTokenPayload(token);
      set({ token, user: tokenData, isAuthenticated: true, isLoading: false });
      return { success: true, token, user: tokenData };
    } catch (error) {
      set({
        error: error.response?.data?.message || "Registration failed",
        isLoading: false,
      });
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  },

  logout: async () => {
    try {
      await logoutApi();
      localStorage.removeItem("token");
      set({ token: null, isAuthenticated: false, user: null });
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("token");
      set({ token: null, isAuthenticated: false, user: null });
    }
  },

  checkAuth: () => {
    const token = localStorage.getItem("token");
    if (token) {
      const userData = parseTokenPayload(token);
      set({ token, user: userData, isAuthenticated: !!token });
    } else {
      set({ token: null, user: null, isAuthenticated: false });
    }
  },

  fetchProfile: async () => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined") {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }

    set({ isLoading: true });
    try {
      const response = await getMeApi();
      const userData = response.data.user;
      set({ user: userData, isAuthenticated: true, isLoading: false });
      return userData;
    } catch (error) {
      console.error("Fetch profile error:", error);
      // If unauthorized, clear local storage
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        set({ token: null, user: null, isAuthenticated: false });
      }
      set({ isLoading: false });
      return null;
    }
  },
}));

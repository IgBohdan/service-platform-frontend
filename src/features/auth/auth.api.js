import { api } from "../../lib/api";

export const login = async (credentials) => {
  console.log("Sending login request with credentials:", credentials); // Логування даних для логіну
  try {
    const response = await api.post("/api/auth/login", credentials);
    console.log("Login response:", response); // Логування відповіді
    return response.data;
  } catch (error) {
    console.error("Login API error:", error); // Логування помилки
    throw error;
  }
};

export const register = async (userData) => {
  const { data } = await api.post("/api/auth/register", userData);
  return data;
};

export const logout = async () => {
  // Очищення токену з локального сховища
  localStorage.removeItem("token");
  return Promise.resolve({ message: "Logged out successfully" });
};

export const getMe = async () => {
  const { data } = await api.get("/api/auth/me");
  return data;
};

import { useQuery } from "@tanstack/react-query";

// Створюємо функцію для отримання даних про повідомлення
const fetchNotifications = async () => {
  // Використовуємо GraphQL запит для отримання повідомлень
  const response = await fetch("/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(localStorage.getItem("token") && localStorage.getItem("token") !== "undefined"
        ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
        : {}),
    },
    body: JSON.stringify({
      query: `
        query GetNotifications {
          notifications {
            id
            title
            message
            type
            read
            createdAt
          }
        }
      `,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }

  const result = await response.json();
  if (result.errors) {
    throw new Error(
      result.errors[0]?.message || "Failed to fetch notifications"
    );
  }

  return result.data.notifications;
};

// Хук для отримання повідомлень
export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
  });
};

// Хук для отримання непрочитаних повідомлень
export const useUnreadNotifications = () => {
  return useQuery({
    queryKey: ["unreadNotifications"],
    queryFn: async () => {
      const response = await fetch("/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("token") && localStorage.getItem("token") !== "undefined"
            ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
            : {}),
        },
        body: JSON.stringify({
          query: `
            query GetUnreadNotifications {
              unreadNotifications {
                id
                title
                message
                type
                read
                createdAt
              }
            }
          `,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch unread notifications");
      }

      const result = await response.json();
      if (result.errors) {
        throw new Error(
          result.errors[0]?.message || "Failed to fetch unread notifications"
        );
      }

      return result.data.unreadNotifications;
    },
  });
};

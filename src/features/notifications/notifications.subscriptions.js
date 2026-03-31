import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuth } from "../auth/useAuth";

// Функція для підключення до GraphQL WebSocket підписок
export const useNotificationSubscriptions = () => {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  useEffect(() => {
    // Перевіряємо наявність WebSocket підтримки
    if (!window.WebSocket) {
      console.error("WebSocket is not supported by this browser");
      return;
    }

    // Створюємо WebSocket з'єднання
    const ws = new WebSocket(`ws://localhost:4000/graphql`);

    ws.onopen = () => {
      console.log("Connected to WebSocket server");

      // Відправляємо ініціалізаційне повідомлення для підписки
      ws.send(
        JSON.stringify({
          type: "connection_init",
          payload: {
            authorization: `Bearer ${token}`,
          },
        })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Обробляємо підписку на нові повідомлення
      if (data.type === "next" && data.payload?.data?.newNotification) {
        const notification = data.payload.data.newNotification;

        // Оновлюємо кеш повідомлень
        queryClient.setQueryData(["notifications"], (oldData) => {
          if (!oldData) return [notification];
          return [notification, ...oldData];
        });

        // Оновлюємо кеш непрочитаних повідомлень
        queryClient.setQueryData(["unreadNotifications"], (oldData) => {
          if (!oldData) return [notification];
          return [notification, ...oldData];
        });

        // Створюємо браузерне сповіщення, якщо дозволено
        if (Notification.permission === "granted") {
          new Notification("Нове повідомлення", {
            body: notification.message,
            icon: "/notification-icon.png",
          });
        }
      }

      // Обробляємо підписку на зміни статусу бронювання
      if (data.type === "next" && data.payload?.data?.bookingStatusChanged) {
        const booking = data.payload.data.bookingStatusChanged;

        // Оновлюємо кеш бронювань
        queryClient.invalidateQueries({ queryKey: ["bookings"] });

        // Створюємо повідомлення про зміну статусу бронювання
        if (Notification.permission === "granted") {
          new Notification("Статус бронювання змінено", {
            body: `Бронювання #${booking.id} тепер має статус ${booking.status}`,
            icon: "/notification-icon.png",
          });
        }
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    // Повертаємо функцію очищення для закриття з'єднання
    return () => {
      ws.close();
    };
  }, [queryClient, token]);
};

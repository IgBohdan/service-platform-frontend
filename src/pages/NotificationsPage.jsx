import { useState } from "react";
import {
  useDeleteNotification,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useNotifications,
  useUnreadNotifications,
} from "../features/notifications/notifications.queries";

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const { data: notifications, isLoading, error } = useNotifications();
  const { data: unreadNotifications } = useUnreadNotifications();
  const deleteNotificationMutation = useDeleteNotification();
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  const handleMarkAsRead = (id) => {
    markAsReadMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  // Видаляємо дублікати функцій

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      deleteNotificationMutation.mutate(id);
    }
  };

  // Видаляємо дублікати хуків, залишаємо лише один варіант

  if (isLoading) return <div className="p-4">Loading notifications...</div>;
  if (error)
    return <div className="p-4 text-red-600">Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-2 text-gray-600">Manage system notifications</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Notifications
            </h2>
            {activeTab === "unread" && (
              <button
                onClick={handleMarkAllAsRead}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-150 ease-in-out"
              >
                Mark All as Read
              </button>
            )}
          </div>

          {/* Tabs for switching between all and unread notifications */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`${
                    activeTab === "all"
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  All Notifications
                  {activeTab === "all" && notifications && (
                    <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      {notifications.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("unread")}
                  className={`${
                    activeTab === "unread"
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Unread
                  {activeTab === "unread" && unreadNotifications && (
                    <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      {unreadNotifications.length}
                    </span>
                  )}
                </button>
              </nav>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Message
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(activeTab === "all"
                  ? notifications
                  : unreadNotifications
                )?.map((notification) => (
                  <tr
                    key={notification._id || notification.id}
                    className={`${
                      !notification.isRead ? "bg-blue-50" : "bg-white"
                    } hover:bg-gray-50`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {notification.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          notification.type === "info"
                            ? "bg-blue-100 text-blue-800"
                            : notification.type === "warning"
                              ? "bg-yellow-100 text-yellow-800"
                              : notification.type === "error"
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                        }`}
                      >
                        {notification.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          notification.isRead
                            ? "bg-gray-100 text-gray-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {notification.isRead ? "Read" : "Unread"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {!notification.isRead && (
                        <button
                          onClick={() =>
                            handleMarkAsRead(
                              notification._id || notification.id
                            )
                          }
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          Mark as Read
                        </button>
                      )}
                      <button
                        onClick={() =>
                          handleDelete(notification._id || notification.id)
                        }
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;

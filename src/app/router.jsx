import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import Layout from "../components/Layout";
// Pages
import DashboardPage from "../pages/DashboardPage";
import BookingsPage from "../pages/BookingsPage";
import CustomersPage from "../pages/CustomersPage";
import ServicesPage from "../pages/ServicesPage";
import SchedulePage from "../pages/SchedulePage";
import AnalyticsPage from "../pages/AnalyticsPage";
import UsersPage from "../pages/UsersPage";
import ChatPage from "../pages/ChatPage";
import CustomerDetailsPage from "../pages/CustomerDetailsPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

export const router = createBrowserRouter([
  // Public Protocols
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },

  // Protected Platform Area
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { 
        path: "dashboard", 
        element: <DashboardPage /> 
      },
      { 
        path: "bookings", 
        element: (
          <ProtectedRoute allowedRoles={["owner", "admin", "manager", "client"]}>
            <BookingsPage />
          </ProtectedRoute>
        )
      },
      { 
        path: "customers", 
        element: (
          <ProtectedRoute allowedRoles={["owner", "admin", "manager"]}>
            <CustomersPage />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "customers/:id", 
        element: (
          <ProtectedRoute allowedRoles={["owner", "admin", "manager"]}>
            <CustomerDetailsPage />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "services", 
        element: (
          <ProtectedRoute allowedRoles={["owner", "admin", "manager"]}>
            <ServicesPage />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "schedule", 
        element: (
          <ProtectedRoute allowedRoles={["owner", "admin", "manager", "master", "employee"]}>
            <SchedulePage />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "users", 
        element: (
          <ProtectedRoute allowedRoles={["owner", "admin"]}>
            <UsersPage />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "analytics", 
        element: (
          <ProtectedRoute allowedRoles={["owner", "admin", "manager"]}>
            <AnalyticsPage />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "chat", 
        element: <ChatPage /> 
      },
      { 
        path: "notifications", 
        element: (
            <div className="flex flex-col items-center justify-center min-h-[500px] opacity-20 font-black uppercase tracking-[0.4em] text-center">
                Системний Потік Сповіщень Порожній
            </div>
        ) 
      },
    ],
  },
]);

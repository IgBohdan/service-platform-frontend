import { api } from "../../lib/api";

const URL = import.meta.env.VITE_API_URL;

export const fetchDashboardStats = async () => {
    // Current month range for trends
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const endDate = now.toISOString();

    const response = await api.post("/graphql", {
        url: URL,
        query: `
            query GetDashboardStats($startDate: Date!, $endDate: Date!) {
                bookingStats {
                    totalBookings
                    totalConfirmed
                    totalPending
                    totalCancelled
                }
                userStats {
                    totalUsers
                    activeUsers
                }
                serviceStats {
                    totalServices
                }
                revenueStats {
                    totalRevenue
                    averageRevenue
                }
                bookingTrends(startDate: $startDate, endDate: $endDate) {
                    date
                    count
                    confirmed
                }
                topServices(limit: 5) {
                    serviceName
                    bookingCount
                }
            }
        `,
        variables: { startDate, endDate }
    });

    return response.data.data;
};

export const fetchExtendedAnalytics = async (startDate, endDate) => {
    const response = await api.post("/graphql", {
        url: URL,
        query: `
            query GetExtendedAnalytics($startDate: Date!, $endDate: Date!) {
                bookingTrends(startDate: $startDate, endDate: $endDate) {
                    date
                    count
                    confirmed
                    pending
                    cancelled
                }
                topServices(startDate: $startDate, endDate: $endDate, limit: 10) {
                    serviceName
                    bookingCount
                }
                revenueStats(startDate: $startDate, endDate: $endDate) {
                    totalRevenue
                    bookingsCount
                    averageRevenue
                }
                bookingStats(startDate: $startDate, endDate: $endDate) {
                    totalBookings
                    totalConfirmed
                    totalPending
                    totalCancelled
                }
            }
        `,
        variables: { startDate, endDate }
    });

    return response.data.data;
};

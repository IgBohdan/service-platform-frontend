import { useQuery } from "@tanstack/react-query";
import { fetchDashboardStats, fetchExtendedAnalytics } from "./analytics.api";

export const useDashboardStats = () =>
  useQuery({
    queryKey: ["dashboardStats"],
    queryFn: fetchDashboardStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

export const useExtendedAnalytics = (startDate, endDate) =>
  useQuery({
    queryKey: ["extendedAnalytics", startDate, endDate],
    queryFn: () => fetchExtendedAnalytics(startDate, endDate),
    enabled: !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  });

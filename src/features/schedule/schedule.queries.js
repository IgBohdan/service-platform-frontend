import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchSchedules,
  createSchedule,
  deleteSchedule,
  updateSchedule,
  updateScheduleStatus,
} from "./schedule.api";

export const useSchedules = () =>
  useQuery({
    queryKey: ["schedule"],
    queryFn: fetchSchedules,
  });

export const useCreateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scheduleData) => createSchedule(scheduleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
    },
  });
};

export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...updateData }) => updateSchedule(id, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
    },
  });
};

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
    },
  });
};

export const useUpdateScheduleStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => updateScheduleStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
    },
  });
};

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createService,
  deactivateService,
  deleteService,
  fetchServices as fetchServicesApi,
  updateService,
} from "./services.api";

export const useServices = () =>
  useQuery({
    queryKey: ["services"],
    queryFn: fetchServicesApi,
  });

export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serviceData) => createService(serviceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...updateData }) => updateService(id, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};

export const useDeactivateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deactivateService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};

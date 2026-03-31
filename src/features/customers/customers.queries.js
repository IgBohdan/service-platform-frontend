import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCustomer,
  deactivateCustomer,
  deleteCustomer,
  fetchCustomers as fetchCustomersApi,
  updateCustomer,
} from "./customers.api";

export const useCustomers = () =>
  useQuery({
    queryKey: ["customers"],
    queryFn: fetchCustomersApi,
  });

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (customerData) => createCustomer(customerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...updateData }) => updateCustomer(id, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};

export const useDeactivateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deactivateCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};

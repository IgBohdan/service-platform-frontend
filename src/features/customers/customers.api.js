import { api } from "../../lib/api";

export const fetchCustomers = async () => {
  const response = await api.post("/graphql", {
    query: `
      query GetCustomers {
        customers {
          id
          firstName
          lastName
          email
          phone
          isActive
          createdAt
          updatedAt
        }
      }
    `,
  });

  return response.data.data.customers;
};

export const createCustomer = (payload) =>
  api.post("/graphql", {
    query: `
    mutation CreateCustomer($input: CreateCustomerInput!) {
      createCustomer(input: $input) {
        id
        firstName
        lastName
        email
        phone
        isActive
        createdAt
        updatedAt
      }
    }
  `,
    variables: { input: payload },
  });
export const updateCustomer = (id, payload) =>
  api.post("/graphql", {
    query: `
    mutation UpdateCustomer($id: ID!, $input: UpdateCustomerInput!) {
      updateCustomer(id: $id, input: $input) {
        id
        firstName
        lastName
        email
        phone
        isActive
        createdAt
        updatedAt
      }
    }
  `,
    variables: { id, input: payload },
  });

export const deleteCustomer = (id) =>
  api.post("/graphql", {
    query: `
    mutation DeleteCustomer($id: ID!) {
      deleteCustomer(id: $id) {
        id
      }
    }
  `,
    variables: { id },
  });

export const deactivateCustomer = (id) =>
  api.post("/graphql", {
    query: `
    mutation DeactivateCustomer($id: ID!) {
      deactivateCustomer(id: $id) {
        id
        isActive
      }
    }
  `,
    variables: { id },
  });

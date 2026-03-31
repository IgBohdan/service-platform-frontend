import { api } from "../../lib/api";

const URL = import.meta.env.VITE_API_URL;

export const fetchUsers = async () => {
  const response = await api.post("/graphql", {
    url: URL, // Not strictly needed by axios if baseURL is set, but kept for clarity if used elsewhere
    query: `
      query GetUsers {
        users {
          id
          email
          role
          isActive
          createdAt
        }
      }
    `,
  });
  return response.data.data.users;
};

export const createUser = async (payload) => {
  const response = await api.post("/graphql", {
    query: `
      mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
          id
          email
          role
        }
      }
    `,
    variables: { input: payload },
  });
  return response.data.data.createUser;
};

export const updateUser = async (id, payload) => {
  const response = await api.post("/graphql", {
    query: `
      mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
        updateUser(id: $id, input: $input) {
          id
          email
          role
          isActive
        }
      }
    `,
    variables: { id, input: payload },
  });
  return response.data.data.updateUser;
};

export const deleteUser = async (id) => {
    // GraphQL schema showed deactivateUser or deleteUser? Let me check
    // Schema has 'deactivateUser(id: ID!): User'
    const response = await api.post("/graphql", {
      query: `
        mutation DeactivateUser($id: ID!) {
          deactivateUser(id: $id) {
            id
            isActive
          }
        }
      `,
      variables: { id },
    });
    return response.data.data.deactivateUser;
};

export const deactivateUser = deleteUser; // Alias for consistency

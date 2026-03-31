import { api } from "../../lib/api";

const URL = import.meta.env.VITE_API_URL;

export const fetchServices = async () => {
    const response = await api.post("/graphql", {
        url: URL,
        query: `
            query GetServices {
                services {
                    id
                    title
                    description
                    price
                    durationMinutes
                    isActive
                    createdAt
                }
            }
        `,
    });
    return response.data.data.services || [];
};

export const createService = async (payload) => {
    const response = await api.post("/graphql", {
        query: `
            mutation CreateService($input: CreateServiceInput!) {
                createService(input: $input) {
                    id
                    title
                    price
                }
            }
        `,
        variables: { input: payload },
    });
    return response.data.data.createService;
};

export const updateService = async (id, payload) => {
    const response = await api.post("/graphql", {
        query: `
            mutation UpdateService($id: ID!, $input: UpdateServiceInput!) {
                updateService(id: $id, input: $input) {
                    id
                    title
                    price
                    isActive
                }
            }
        `,
        variables: { id, input: payload },
    });
    return response.data.data.updateService;
};

export const deleteService = async (id) => {
    const response = await api.post("/graphql", {
        query: `
            mutation DeleteService($id: ID!) {
                deleteService(id: $id)
            }
        `,
        variables: { id },
    });
    return response.data.data.deleteService;
};

export const deactivateService = async (id) => {
    const response = await api.post("/graphql", {
        query: `
            mutation UpdateService($id: ID!, $input: UpdateServiceInput!) {
                updateService(id: $id, input: $input) {
                    id
                    isActive
                }
            }
        `,
        variables: { id, input: { isActive: false } }, // Assumes backend supports boolean update
    });
    return response.data.data.updateService;
};

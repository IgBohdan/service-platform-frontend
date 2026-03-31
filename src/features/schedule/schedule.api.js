import { api } from "../../lib/api";

const URL = import.meta.env.VITE_API_URL;

export const fetchSchedules = async () => {
    const response = await api.post("/graphql", {
        url: URL,
        query: `
            query GetSchedules {
                schedules {
                    id
                    title
                    description
                    startAt
                    endAt
                    location
                    status
                }
            }
        `,
    });
    return response.data.data.schedules || [];
};

export const createSchedule = async (payload) => {
    const response = await api.post("/graphql", {
        query: `
            mutation CreateSchedule($input: CreateScheduleInput!) {
                createSchedule(input: $input) {
                    id
                    title
                }
            }
        `,
        variables: { input: payload },
    });
    return response.data.data.createSchedule;
};

export const updateSchedule = async (id, payload) => {
    const response = await api.post("/graphql", {
        query: `
            mutation UpdateSchedule($id: ID!, $input: UpdateScheduleInput!) {
                updateSchedule(id: $id, input: $input) {
                    id
                    title
                }
            }
        `,
        variables: { id, input: payload },
    });
    return response.data.data.updateSchedule;
};

export const deleteSchedule = async (id) => {
    const response = await api.post("/graphql", {
        query: `
            mutation DeleteSchedule($id: ID!) {
                deleteSchedule(id: $id)
            }
        `,
        variables: { id },
    });
    return response.data.data.deleteSchedule;
};

export const updateScheduleStatus = async (id, status) => {
    const response = await api.post("/graphql", {
        query: `
            mutation UpdateScheduleStatus($id: ID!, $status: String!) {
                updateScheduleStatus(id: $id, status: $status) {
                    id
                    status
                }
            }
        `,
        variables: { id, status },
    });
    return response.data.data.updateScheduleStatus;
};

import { api } from "../../lib/api";

const URL = import.meta.env.VITE_API_URL;

export const fetchBookings = async () => {
    const response = await api.post("/graphql", {
        url: URL,
        query: `
            query GetBookings {
                bookings {
                    id
                    userId
                    resourceId
                    resource {
                        title
                    }
                    startAt
                    endAt
                    status
                    customerName
                    customerEmail
                    customerPhone
                    notes
                    createdAt
                }
            }
        `,
    });
    return response.data.data.bookings || [];
};

export const createBooking = async (payload) => {
    const response = await api.post("/graphql", {
        query: `
            mutation CreateBooking($input: CreateBookingInput!) {
                createBooking(input: $input) {
                    id
                    status
                }
            }
        `,
        variables: { input: payload },
    });
    return response.data.data.createBooking;
};

export const updateBooking = async (id, payload) => {
    const response = await api.post("/graphql", {
        query: `
            mutation UpdateBooking($id: ID!, $input: UpdateBookingInput!) {
                updateBooking(id: $id, input: $input) {
                    id
                    status
                }
            }
        `,
        variables: { id, input: payload },
    });
    return response.data.data.updateBooking;
};

export const deleteBooking = async (id) => {
    const response = await api.post("/graphql", {
        query: `
            mutation DeleteBooking($id: ID!) {
                deleteBooking(id: $id)
            }
        `,
        variables: { id },
    });
    return response.data.data.deleteBooking;
};

export const updateBookingStatus = async (id, status) => {
    const response = await api.post("/graphql", {
        query: `
            mutation UpdateBookingStatus($id: ID!, $status: String!) {
                updateBookingStatus(id: $id, status: $status) {
                    id
                    status
                }
            }
        `,
        variables: { id, status },
    });
    return response.data.data.updateBookingStatus;
};

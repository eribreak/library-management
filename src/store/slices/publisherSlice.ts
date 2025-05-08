import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Publisher {
    id: number;
    name: string;
    description: string;
    [key: string]: string | number;
}

export interface PublisherFormData {
    id?: number;
    name: string;
    description: string;
}

export interface PaginationInfo {
    total: number;
    current_page: number;
    total_pages: number;
    per_page: number;
}

export interface FetchPublishersParams {
    page?: number;
    perPage?: number;
    searchTerm?: string;
}

interface PublishersState {
    publishers: Publisher[];
    loading: boolean;
    error: string | null;
    pagination: PaginationInfo;
}

const initialState: PublishersState = {
    publishers: [],
    loading: false,
    error: null,
    pagination: {
        total: 0,
        current_page: 1,
        total_pages: 1,
        per_page: 10,
    },
};

const publishersSlice = createSlice({
    name: "publishers",
    initialState,
    reducers: {
        fetchPublishers: (state, _action: PayloadAction<FetchPublishersParams>) => {
            state.loading = true;
            state.error = null;
        },
        fetchPublishersSuccess: (
            state,
            action: PayloadAction<{
                data: Publisher[];
                pagination: PaginationInfo;
            }>
        ) => {
            state.publishers = action.payload.data;
            state.pagination = action.payload.pagination;
            state.loading = false;
            state.error = null;
        },
        fetchPublishersFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        createPublisher: (state) => {
            state.loading = true;
            state.error = null;
        },
        createPublisherSuccess: (state, action: PayloadAction<Publisher>) => {
            state.publishers.push(action.payload);
            state.loading = false;
            state.error = null;
        },
        createPublisherFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        updatePublisher: (state) => {
            state.loading = true;
            state.error = null;
        },
        updatePublisherSuccess: (state, action: PayloadAction<Publisher>) => {
            const index = state.publishers.findIndex(
                (publisher) => publisher.id === action.payload.id
            );
            if (index !== -1) {
                state.publishers[index] = action.payload;
            }
            state.loading = false;
            state.error = null;
        },
        updatePublisherFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        deletePublisher: (state) => {
            state.loading = true;
            state.error = null;
        },
        deletePublisherSuccess: (state, action: PayloadAction<number>) => {
            state.publishers = state.publishers.filter(
                (publisher) => publisher.id !== action.payload
            );
            state.loading = false;
            state.error = null;
        },
        deletePublisherFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    fetchPublishers,
    fetchPublishersSuccess,
    fetchPublishersFailure,
    createPublisher,
    createPublisherSuccess,
    createPublisherFailure,
    updatePublisher,
    updatePublisherSuccess,
    updatePublisherFailure,
    deletePublisher,
    deletePublisherSuccess,
    deletePublisherFailure,
} = publishersSlice.actions;

export const publishersReducer = publishersSlice.reducer;

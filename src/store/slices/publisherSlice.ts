import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Publisher {
    id: number;
    name: string;
    description: string;
    slug?: string;
    [key: string]: string | number | undefined;
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
    isCreating: boolean;
    isUpdating: boolean;
    createError: string | null;
    updateError: string | null;
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
    isCreating: false,
    isUpdating: false,
    createError: null,
    updateError: null,
};

const publishersSlice = createSlice({
    name: "publishers",
    initialState,
    reducers: {
        fetchPublishers: (state, _: PayloadAction<FetchPublishersParams>) => {
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
            state.isCreating = true;
            state.createError = null;
        },
        createPublisherSuccess: (state) => {
            state.isCreating = false;
            state.createError = null;
        },
        createPublisherFailure: (state, action: PayloadAction<string>) => {
            state.isCreating = false;
            state.createError = action.payload;
        },
        updatePublisher: (state) => {
            state.isUpdating = true;
            state.updateError = null;
        },
        updatePublisherSuccess: (state) => {
            state.isUpdating = false;
            state.updateError = null;
        },
        updatePublisherFailure: (state, action: PayloadAction<string>) => {
            state.isUpdating = false;
            state.updateError = action.payload;
        },
        deletePublisher: (state) => {
            state.loading = true;
            state.error = null;
        },
        deletePublisherSuccess: (state) => {
            state.loading = false;
            state.error = null;
        },
        deletePublisherFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        clearCreateError: (state) => {
            state.createError = null;
        },
        clearUpdateError: (state) => {
            state.updateError = null;
        },
        resetPublisherState: (state) => {
            state.publishers = [];
            state.loading = true;
            state.error = null;
            state.pagination = initialState.pagination;
            state.isCreating = false;
            state.isUpdating = false;
            state.createError = null;
            state.updateError = null;
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
    clearCreateError,
    clearUpdateError,
    resetPublisherState,
} = publishersSlice.actions;

export const publishersReducer = publishersSlice.reducer;

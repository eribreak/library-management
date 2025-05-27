import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Author {
    id: number;
    name: string;
    description: string;
    slug?: string;
    [key: string]: string | number | undefined;
}

export interface AuthorFormData {
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

export interface FetchAuthorsParams {
    page?: number;
    perPage?: number;
    searchTerm?: string;
}

interface AuthorsState {
    authors: Author[];
    loading: boolean;
    error: string | null;
    pagination: PaginationInfo;
    isCreating: boolean;
    isUpdating: boolean;
    createError: string | null;
    updateError: string | null;
}

const initialState: AuthorsState = {
    authors: [],
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

const authorsSlice = createSlice({
    name: "authors",
    initialState,
    reducers: {
        fetchAuthors: (state, _action: PayloadAction<FetchAuthorsParams>) => {
            state.loading = true;
            state.error = null;
        },
        fetchAuthorsSuccess: (
            state,
            action: PayloadAction<{
                data: Author[];
                pagination: PaginationInfo;
            }>
        ) => {
            state.authors = action.payload.data;
            state.pagination = action.payload.pagination;
            state.loading = false;
            state.error = null;
        },
        fetchAuthorsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        createAuthor: (state) => {
            state.isCreating = true;
            state.createError = null;
        },
        createAuthorSuccess: (state) => {
            state.isCreating = false;
            state.createError = null;
        },
        createAuthorFailure: (state, action: PayloadAction<string>) => {
            state.isCreating = false;
            state.createError = action.payload;
        },
        updateAuthor: (state) => {
            state.isUpdating = true;
            state.updateError = null;
        },
        updateAuthorSuccess: (state) => {
            state.isUpdating = false;
            state.updateError = null;
        },
        updateAuthorFailure: (state, action: PayloadAction<string>) => {
            state.isUpdating = false;
            state.updateError = action.payload;
        },
        deleteAuthor: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteAuthorSuccess: (state) => {
            state.loading = false;
            state.error = null;
        },
        deleteAuthorFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        clearCreateError: (state) => {
            state.createError = null;
        },
        clearUpdateError: (state) => {
            state.updateError = null;
        },
    },
});

export const {
    fetchAuthors,
    fetchAuthorsSuccess,
    fetchAuthorsFailure,
    createAuthor,
    createAuthorSuccess,
    createAuthorFailure,
    updateAuthor,
    updateAuthorSuccess,
    updateAuthorFailure,
    deleteAuthor,
    deleteAuthorSuccess,
    deleteAuthorFailure,
    clearCreateError,
    clearUpdateError,
} = authorsSlice.actions;

export const authorsReducer = authorsSlice.reducer;

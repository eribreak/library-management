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
};

const authorsSlice = createSlice({
    name: "authors",
    initialState,
    reducers: {
        fetchAuthors: (state, _: PayloadAction<FetchAuthorsParams>) => {
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
            state.loading = true;
            state.error = null;
        },
        createAuthorSuccess: (state, action: PayloadAction<Author>) => {
            state.authors.push(action.payload);
            state.loading = false;
            state.error = null;
        },
        createAuthorFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateAuthor: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateAuthorSuccess: (state, action: PayloadAction<Author>) => {
            const index = state.authors.findIndex(
                (author) => author.id === action.payload.id
            );
            if (index !== -1) {
                state.authors[index] = action.payload;
            }
            state.loading = false;
            state.error = null;
        },
        updateAuthorFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteAuthor: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteAuthorSuccess: (state, action: PayloadAction<number>) => {
            state.authors = state.authors.filter(
                (author) => author.id !== action.payload
            );
            state.loading = false;
            state.error = null;
        },
        deleteAuthorFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
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
} = authorsSlice.actions;

export const authorsReducer = authorsSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Author {
    id: number;
    name: string;
}

export interface Category {
    id: number;
    name: string;
}

export interface Publisher {
    id: number;
    name: string;
}

export interface Book {
    id: number;
    title: string;
    imageFile: string | null;
    additional_images: { id: number; url: string }[];
    short_description?: string;
    description?: string;
    slug?: string;
    price?: number;
    stock_quantity?: number;
    published_year?: number;
    publisherYear: number;
    stockQuantity: number;
    page?: number;
    image_url?: string | null;
    thumbnail_url?: string | null;
    category?: { id: number; name: string }[];
    author?: { id: number; name: string }[];
    publisher?: string | { id: number; name: string };
    quantity?: number;
    order_details_count?: number;
    deleted_at?: string | null;
}

export interface PaginationInfo {
    total: number;
    current_page: number;
    total_pages: number;
    per_page: number;
}

export interface FetchBooksParams {
    page?: number;
    perPage?: number;
    searchTerm?: string;
    authorId?: string;
    publisherId?: string;
    categoryId?: string;
    includeDeleted?: boolean;
}

export interface BookState {
    books: Book[];
    currentBook: Book | null;
    loading: boolean;
    error: string | null;
    showDialog: boolean;
    isEditMode: boolean;
    pagination: PaginationInfo;
}

const initialState: BookState = {
    books: [],
    currentBook: null,
    loading: false,
    error: null,
    showDialog: false,
    isEditMode: false,
    pagination: {
        total: 0,
        current_page: 1,
        total_pages: 1,
        per_page: 10,
    },
};

const bookSlice = createSlice({
    name: "books",
    initialState,
    reducers: {
        fetchBooks: (state, _: PayloadAction<FetchBooksParams>) => {
            state.loading = true;
            state.error = null;
        },
        fetchBooksSuccess: (
            state,
            action: PayloadAction<{
                data: Book[];
                pagination: PaginationInfo;
            }>
        ) => {
            state.books = action.payload.data;
            state.pagination = action.payload.pagination;
            state.loading = false;
            state.error = null;
        },
        fetchBooksFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        addBook: (state, _: PayloadAction<Omit<Book, "id">>) => {
            state.loading = true;
            state.error = null;
        },
        addBookSuccess: (state) => {
            
            state.loading = false;
            state.error = null;
            state.showDialog = false;
        },
        addBookFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateBook: (state, _: PayloadAction<Book>) => {
            state.loading = true;
            state.error = null;
        },
        updateBookSuccess: (state) => {
            
            state.loading = false;
            state.error = null;
            state.showDialog = false;
        },
        updateBookFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteBook: (state, _: PayloadAction<number>) => {
            state.loading = true;
            state.error = null;
        },
        deleteBookSuccess: (state) => {
            
            state.loading = false;
            state.error = null;
        },
        deleteBookFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        openAddDialog: (state) => {
            state.showDialog = true;
            state.isEditMode = false;
            state.currentBook = null;
        },
        openEditDialog: (state, action: PayloadAction<Book>) => {
            state.showDialog = true;
            state.isEditMode = true;
            state.currentBook = action.payload;
        },
        closeDialog: (state) => {
            state.showDialog = false;
            state.currentBook = null;
        },
    },
});

export const {
    fetchBooks,
    fetchBooksSuccess,
    fetchBooksFailure,
    addBook,
    addBookSuccess,
    addBookFailure,
    updateBook,
    updateBookSuccess,
    updateBookFailure,
    deleteBook,
    deleteBookSuccess,
    deleteBookFailure,
    openAddDialog,
    openEditDialog,
    closeDialog,
} = bookSlice.actions;

export const booksReducer = bookSlice.reducer;

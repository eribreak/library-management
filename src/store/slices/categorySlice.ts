import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Category {
    id: number;
    name: string;
    description: string;
    slug?: string;
    [key: string]: string | number | undefined;
}

export interface CategoryFormData {
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

export interface FetchCategoriesParams {
    page?: number;
    perPage?: number;
    searchTerm?: string;
}

interface CategoriesState {
    categories: Category[];
    loading: boolean;
    error: string | null;
    pagination: PaginationInfo;
    isCreating: boolean;
    isUpdating: boolean;
    createError: string | null;
    updateError: string | null;
}

const initialState: CategoriesState = {
    categories: [],
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

const categoriesSlice = createSlice({
    name: "categories",
    initialState,
    reducers: {
        fetchCategories: (state, _action: PayloadAction<FetchCategoriesParams>) => {
            state.loading = true;
            state.error = null;
        },
        fetchCategoriesSuccess: (
            state,
            action: PayloadAction<{
                data: Category[];
                pagination: PaginationInfo;
            }>
        ) => {
            state.categories = action.payload.data;
            state.pagination = action.payload.pagination;
            state.loading = false;
            state.error = null;
        },
        fetchCategoriesFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        createCategory: (state) => {
            state.isCreating = true;
            state.createError = null;
        },
        createCategorySuccess: (state) => {
            state.isCreating = false;
            state.createError = null;
        },
        createCategoryFailure: (state, action: PayloadAction<string>) => {
            state.isCreating = false;
            state.createError = action.payload;
        },
        updateCategory: (state) => {
            state.isUpdating = true;
            state.updateError = null;
        },
        updateCategorySuccess: (state) => {
            state.isUpdating = false;
            state.updateError = null;
        },
        updateCategoryFailure: (state, action: PayloadAction<string>) => {
            state.isUpdating = false;
            state.updateError = action.payload;
        },
        deleteCategory: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteCategorySuccess: (state) => {
            state.loading = false;
            state.error = null;
        },
        deleteCategoryFailure: (state, action: PayloadAction<string>) => {
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
    fetchCategories,
    fetchCategoriesSuccess,
    fetchCategoriesFailure,
    createCategory,
    createCategorySuccess,
    createCategoryFailure,
    updateCategory,
    updateCategorySuccess,
    updateCategoryFailure,
    deleteCategory,
    deleteCategorySuccess,
    deleteCategoryFailure,
    clearCreateError,
    clearUpdateError,
} = categoriesSlice.actions;

export const categoriesReducer = categoriesSlice.reducer;

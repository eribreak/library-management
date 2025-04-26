import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    [key: string]: string | number;
}

export interface CategoryFormData {
    id?: number;
    name: string;
    description: string;
}

interface CategoriesState {
    categories: Category[];
    loading: boolean;
    error: string | null;
}

const initialState: CategoriesState = {
    categories: [],
    loading: false,
    error: null,
};

const categoriesSlice = createSlice({
    name: "categories",
    initialState,
    reducers: {
        fetchCategories: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchCategoriesSuccess: (state, action: PayloadAction<Category[]>) => {
            state.categories = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchCategoriesFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        createCategory: (state) => {
            state.loading = true;
            state.error = null;
        },
        createCategorySuccess: (state, action: PayloadAction<Category>) => {
            state.categories.push(action.payload);
            state.loading = false;
            state.error = null;
        },
        createCategoryFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateCategory: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateCategorySuccess: (state, action: PayloadAction<Category>) => {
            const index = state.categories.findIndex(
                (category) => category.id === action.payload.id
            );
            if (index !== -1) {
                state.categories[index] = action.payload;
            }
            state.loading = false;
            state.error = null;
        },
        updateCategoryFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteCategory: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteCategorySuccess: (state, action: PayloadAction<number>) => {
            state.categories = state.categories.filter(
                (category) => category.id !== action.payload
            );
            state.loading = false;
            state.error = null;
        },
        deleteCategoryFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
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
} = categoriesSlice.actions;

export const categoriesReducer = categoriesSlice.reducer;

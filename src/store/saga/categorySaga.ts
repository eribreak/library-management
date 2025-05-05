import { call, put, takeLatest } from "redux-saga/effects";
import { adminApi } from "../../services/axios";
import { toaster } from "@/components/ui/toaster";
import {
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
    CategoryFormData,
} from "../slices/categorySlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { SagaIterator } from "redux-saga";

function* fetchCategoriesWorker(
    action: PayloadAction<{
        page?: number;
        perPage?: number;
        searchTerm?: string;
    }>
): SagaIterator {
    try {
        const { perPage = 99, searchTerm = "" } = action.payload || {};
        const response = yield call(
            [adminApi, adminApi.getCategories],
            99,
            searchTerm
        );

        yield put(
            fetchCategoriesSuccess({
                data: response.data.data,
                pagination: {
                    total:
                        response.data.pagination?.total ||
                        response.data.data.length,
                    current_page:
                        response.data.pagination?.current_page || page,
                    total_pages:
                        response.data.pagination?.total_pages ||
                        Math.ceil(response.data.data.length / perPage),
                    per_page: response.data.pagination?.per_page || perPage,
                },
            })
        );
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message || "Failed to fetch categories";

        yield put(fetchCategoriesFailure(errorMessage));

        toaster.toast({
            title: "Error",
            description: errorMessage,
            status: "error",
        });
    }
}

function* createCategoryWorker(
    action: PayloadAction<CategoryFormData>
): SagaIterator {
    try {
        const response = yield call(
            [adminApi, adminApi.createCategory],
            action.payload
        );

        yield put(createCategorySuccess(response.data.data));

        toaster.toast({
            title: "Success",
            description:
                response.data.message || "Category created successfully",
            status: "success",
        });
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message || "Failed to create category";

        yield put(createCategoryFailure(errorMessage));

        toaster.toast({
            title: "Error",
            description: errorMessage,
            status: "error",
        });
    }
}

function* updateCategoryWorker(
    action: PayloadAction<CategoryFormData>
): SagaIterator {
    try {
        if (!action.payload.id) {
            throw new Error("Category ID is required for update");
        }

        const response = yield call(
            [adminApi, adminApi.adminUpdateCategory],
            action.payload.id,
            {
                name: action.payload.name,
                description: action.payload.description,
            }
        );

        yield put(updateCategorySuccess(response.data.data));

        toaster.toast({
            title: "Success",
            description:
                response.data.message || "Category updated successfully",
            status: "success",
        });
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message || "Failed to update category";

        yield put(updateCategoryFailure(errorMessage));

        toaster.toast({
            title: "Error",
            description: errorMessage,
            status: "error",
        });
    }
}

function* deleteCategoryWorker(action: PayloadAction<number>) {
    try {
        const response = yield call(
            [adminApi, adminApi.deleteCategory],
            action.payload
        );

        yield put(deleteCategorySuccess(action.payload));

        toaster.toast({
            title: "Success",
            description:
                response.data.message || "Category deleted successfully",
            status: "success",
        });
    } catch (error: any) {
        const errorMessage =
            error.response.data?.message || "Failed to delete category";

        yield put(deleteCategoryFailure(errorMessage));

        toaster.toast({
            title: "Error",
            description: errorMessage,
            status: "error",
        });
    }
}

export default function* categorySaga() {
    yield takeLatest(fetchCategories.type, fetchCategoriesWorker);
    yield takeLatest(createCategory.type, createCategoryWorker);
    yield takeLatest(updateCategory.type, updateCategoryWorker);
    yield takeLatest(deleteCategory.type, deleteCategoryWorker);
}

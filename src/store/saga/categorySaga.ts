import { call, put, select, takeLatest } from "redux-saga/effects";
import { adminApi } from "../../services/axios";
import { toaster } from "@/components/ui/toaster";
import { RootState } from "../store";
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
        const {
            page = 1,
            perPage = 10,
            searchTerm = "",
        } = action.payload || {};
        const response = yield call(
            [adminApi, adminApi.getCategories],
            perPage,
            page,
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
            (error.response?.data?.message &&
                "Lỗi khi tải danh sách danh mục") ||
            "Lỗi khi tải danh sách danh mục";

        yield put(fetchCategoriesFailure(errorMessage));

        toaster.toast({
            title: "Lỗi",
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
            title: "Thành công",
            description:
                (response.data.message && "Tạo danh mục thành công") ||
                "Tạo danh mục thành công",
            status: "success",
        });

        const state = yield select((state: RootState) => state.categories);
        yield put(
            fetchCategories({
                page: state.pagination.current_page,
                perPage: state.pagination.per_page,
                searchTerm: "",
            })
        );
    } catch (error: unknown) {
        const errorMessage =
            (error.response?.data?.errors?.name && "Tên danh mục đã tồn tại") ||
            "Tên danh mục đã tồn tại";

        yield put(createCategoryFailure(errorMessage));

        toaster.toast({
            title: "Lỗi",
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
            title: "Thành công",
            description:
                (response.data.message && "Cập nhật danh mục thành công") ||
                "Cập nhật danh mục thành công",
            status: "success",
        });

        const state = yield select((state: RootState) => state.categories);
        yield put(
            fetchCategories({
                page: state.pagination.current_page,
                perPage: state.pagination.per_page,
                searchTerm: "",
            })
        );
    } catch (error: unknown) {
        const errorMessage =
            (error.response?.data?.errors?.name && "Tên danh mục đã tồn tại") ||
            "Tên danh mục đã tồn tại";

        yield put(updateCategoryFailure(errorMessage));

        toaster.toast({
            title: "Lỗi",
            description: errorMessage,
            status: "error",
        });
    }
}

function* deleteCategoryWorker(action: PayloadAction<number>): SagaIterator {
    try {
        const response = yield call(
            [adminApi, adminApi.deleteCategory],
            action.payload
        );

        yield put(deleteCategorySuccess(action.payload));

        toaster.toast({
            title: "Thành công",
            description:
                (response.data.message && "Xóa danh mục thành công") ||
                "Xóa danh mục thành công",
            status: "success",
        });

        const state = yield select((state: RootState) => state.categories);
        yield put(
            fetchCategories({
                page: state.pagination.current_page,
                perPage: state.pagination.per_page,
                searchTerm: "",
            })
        );
    } catch (error: unknown) {
        const errorMessage =
            (error.response?.data?.message && "Lỗi khi xóa danh mục") ||
            "Lỗi khi xóa danh mục";

        yield put(deleteCategoryFailure(errorMessage));

        toaster.toast({
            title: "Lỗi",
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

import { call, put, takeLatest, select } from "redux-saga/effects";
import { adminApi } from "../../services/axios";
import { toaster } from "@/components/ui/toaster";
import {
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
    FetchBooksParams,
    PaginationInfo,
} from "../slices/bookSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { SagaIterator } from "redux-saga";
import { GetBooksIncludeDeletedEnum } from "@/services/api";
import { RootState } from "@/store/store";

function* fetchBooksWorker(
    action: PayloadAction<FetchBooksParams>
): SagaIterator {
    try {
        const {
            searchTerm = "",
            page = 1,
            perPage = 10,
            authorId,
            publisherId,
            categoryId,
            includeDeleted,
        } = action.payload;

        let includeDeletedValue;
        if (includeDeleted === true) {
            includeDeletedValue = GetBooksIncludeDeletedEnum.NUMBER_1;
        }

        const response = yield call(
            [adminApi, adminApi.getBooks],
            perPage,
            page,
            searchTerm,
            authorId,
            publisherId,
            categoryId,
            includeDeletedValue
        );

        const pagination: PaginationInfo = response.data.pagination || {
            total: response.data.data.length,
            current_page: page,
            total_pages: Math.ceil(response.data.data.length / perPage),
            per_page: perPage,
        };

        yield put(
            fetchBooksSuccess({
                data: response.data.data,
                pagination,
            })
        );
    } catch (error: any) {
        const errorMessage =
            (error.response?.data?.message && "Lỗi khi tải danh sách sách") ||
            "Lỗi khi tải danh sách sách";

        yield put(fetchBooksFailure(errorMessage));

        toaster.toast({
            title: "Lỗi",
            description: errorMessage,
            status: "error",
        });
    }
}

function* addBookWorker(action: PayloadAction<any>): SagaIterator {
    try {
        const bookData = action.payload;

        const thumbnailFile =
            bookData.thumbnailFile instanceof File
                ? bookData.thumbnailFile
                : undefined;

        const additionalImages = Array.isArray(bookData.imageFiles)
            ? bookData.imageFiles.filter(
                  (file: File | string) => file instanceof File
              )
            : [];

        const response = yield call(
            [adminApi, adminApi.createBook],
            bookData.title,
            thumbnailFile,
            additionalImages,
            bookData.author_ids || [],
            bookData.publisher_id,
            bookData.category_ids || [],
            bookData.published_year,
            bookData.quantity,
            bookData.page_count,
            bookData.short_description || "",
            bookData.long_description || ""
        );

        yield put(addBookSuccess(response.data.data));

        const state = yield select((state: RootState) => state.books);
        yield put(
            fetchBooks({
                page: state.pagination.current_page,
                perPage: state.pagination.per_page,
                searchTerm: "",
            })
        );

        toaster.toast({
            title: "Thành công",
            description: "Thêm sách mới thành công",
            status: "success",
        });
    } catch (error: unknown) {
        console.error("Error adding book:", error);
        const errorMessage =
            (error.response?.data?.errors?.title && "Tên sách đã tồn tại") ||
            "Tên sách đã tồn tại";

        yield put(addBookFailure(errorMessage));

        toaster.toast({
            title: "Lỗi",
            description: errorMessage,
            status: "error",
        });
    }
}

function* updateBookWorker(action: PayloadAction<any>): SagaIterator {
    try {
        if (!action.payload.id) {
            throw new Error("ID sách là bắt buộc để cập nhật");
        }

        const bookData = action.payload;

        let authorString = "";
        if (Array.isArray(bookData.author_ids)) {
            authorString = bookData.author_ids.join(", ");
        } else if (typeof bookData.author_ids === "string") {
            authorString = bookData.author_ids;
        }
        let categoryString = "";
        if (Array.isArray(bookData.category_ids)) {
            categoryString = bookData.category_ids.join(", ");
        } else if (typeof bookData.category_ids === "string") {
            categoryString = bookData.category_ids;
        }

        const thumbnailFile =
            bookData.thumbnailFile instanceof File
                ? bookData.thumbnailFile
                : undefined;

        const additionalImages = Array.isArray(bookData.imageFiles)
            ? bookData.imageFiles.filter(
                  (file: File | string) => file instanceof File
              )
            : [];

        const response = yield call(
            [adminApi, adminApi.updateBook],
            bookData.id,
            "PUT",
            bookData.title,
            authorString,
            bookData.publisher_id,
            categoryString,
            Number(bookData.published_year),
            bookData.quantity,
            bookData.page_count || 1,
            bookData.short_description || "",
            bookData.long_description || "",
            thumbnailFile,
            additionalImages.length > 0 ? additionalImages : undefined
        );

        yield put(updateBookSuccess(response.data.data));

        const state = yield select((state: RootState) => state.books);
        yield put(
            fetchBooks({
                page: state.pagination.current_page,
                perPage: state.pagination.per_page,
                searchTerm: "",
            })
        );

        toaster.toast({
            title: "Thành công",
            description: "Cập nhật sách thành công",
            status: "success",
        });
    } catch (error: unknown) {
        console.error("Error updating book:", error);
        const errorMessage =
            (error.response?.data?.errors?.title && "Tên sách đã tồn tại") ||
            "Tên sách đã tồn tại";

        yield put(updateBookFailure(errorMessage));

        toaster.toast({
            title: "Lỗi",
            description: errorMessage,
            status: "error",
        });
    }
}

function* deleteBookWorker(action: PayloadAction<number>): SagaIterator {
    try {
        yield call([adminApi, adminApi.deleteBook], action.payload);

        yield put(deleteBookSuccess(action.payload));

        const state = yield select((state: RootState) => state.books);
        yield put(
            fetchBooks({
                page: state.pagination.current_page,
                perPage: state.pagination.per_page,
                searchTerm: "",
            })
        );

        toaster.toast({
            title: "Thành công",
            description: "Xóa sách thành công",
            status: "success",
        });
    } catch (error: any) {
        const errorMessage =
            (error.response?.data?.message &&
                "Không thể xóa vì sách đang trong đơn hàng") ||
            "Không thể xóa vì sách đang trong đơn hàng";

        yield put(deleteBookFailure(errorMessage));

        toaster.toast({
            title: "Lỗi",
            description: errorMessage,
            status: "error",
        });
    }
}

export default function* bookSaga() {
    yield takeLatest(fetchBooks.type, fetchBooksWorker);
    yield takeLatest(addBook.type, addBookWorker);
    yield takeLatest(updateBook.type, updateBookWorker);
    yield takeLatest(deleteBook.type, deleteBookWorker);
}

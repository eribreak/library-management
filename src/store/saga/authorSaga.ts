import { call, put, select, takeLatest } from "redux-saga/effects";
import { adminApi } from "../../services/axios";
import { toaster } from "@/components/ui/toaster";
import { RootState } from "../store";
import {
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
    AuthorFormData,
    FetchAuthorsParams,
    PaginationInfo,
} from "../slices/authorSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { SagaIterator } from "redux-saga";

function* fetchAuthorsWorker(
    action: PayloadAction<FetchAuthorsParams>
): SagaIterator {
    try {
        const { page = 1, perPage = 10, searchTerm = "" } = action.payload;
        const response = yield call(
            [adminApi, adminApi.getAuthors],
            perPage,
            page,
            searchTerm
        );

        const pagination: PaginationInfo = response.data.pagination || {
            total: response.data.data.length,
            current_page: page,
            total_pages: Math.ceil(response.data.data.length / perPage),
            per_page: perPage,
        };

        yield put(
            fetchAuthorsSuccess({
                data: response.data.data,
                pagination,
            })
        );
    } catch (error: any) {
        const errorMessage =
            (error.response?.data?.message &&
                "Lỗi khi tải danh sách tác giả") ||
            "Lỗi khi tải danh sách tác giả";

        yield put(fetchAuthorsFailure(errorMessage));

        toaster.toast({
            title: "Lỗi",
            description: errorMessage,
            status: "error",
        });
    }
}

function* createAuthorWorker(
    action: PayloadAction<AuthorFormData>
): SagaIterator {
    try {
        const response = yield call([adminApi, adminApi.createAuthor], {
            name: action.payload.name,
            description: action.payload.description,
        });

        yield put(createAuthorSuccess(response.data.data));

        toaster.toast({
            title: "Thành công",
            description:
                (response.data.message && "Tạo tác giả thành công") ||
                "Tạo tác giả thành công",
            status: "success",
        });

        const state = yield select((state: RootState) => state.authors);
        yield put(
            fetchAuthors({
                page: state.pagination.current_page,
                perPage: state.pagination.per_page,
                searchTerm: "",
            })
        );
    } catch (error: unknown) {
        const errorMessage =
            (error instanceof Error &&
                (error as any).response?.data?.errors?.name &&
                "Tên tác giả đã tồn tại") ||
            "Tên tác giả đã tồn tại";

        yield put(createAuthorFailure(errorMessage));

        toaster.toast({
            title: "Lỗi",
            description: errorMessage,
            status: "error",
        });
    }
}

function* updateAuthorWorker(
    action: PayloadAction<AuthorFormData>
): SagaIterator {
    try {
        const authorId = action.payload.id;
        if (!authorId) {
            throw new Error("Author ID is required");
        }

        const response = yield call(
            [adminApi, adminApi.adminUpdateAuthor],
            authorId,
            {
                name: action.payload.name,
                description: action.payload.description,
            }
        );

        yield put(updateAuthorSuccess(response.data.data));

        toaster.toast({
            title: "Thành công",
            description:
                (response.data.message && "Cập nhật tác giả thành công") ||
                "Cập nhật tác giả thành công",
            status: "success",
        });

        const state = yield select((state: RootState) => state.authors);
        yield put(
            fetchAuthors({
                page: state.pagination.current_page,
                perPage: state.pagination.per_page,
                searchTerm: "",
            })
        );
    } catch (error: unknown) {
        const errorMessage =
            (error.response?.data?.errors?.name && "Tên tác giả đã tồn tại") ||
            "Tên tác giả đã tồn tại";

        yield put(updateAuthorFailure(errorMessage));

        toaster.toast({
            title: "Lỗi",
            description: errorMessage,
            status: "error",
        });
    }
}

function* deleteAuthorWorker(action: PayloadAction<number>): SagaIterator {
    try {
        const response = yield call(
            [adminApi, adminApi.deleteAuthor],
            action.payload
        );

        yield put(deleteAuthorSuccess(action.payload));

        toaster.toast({
            title: "Thành công",
            description:
                (response.data.message && "Xóa tác giả thành công") ||
                "Xóa tác giả thành công",
            status: "success",
        });

        const state = yield select((state: RootState) => state.authors);
        yield put(
            fetchAuthors({
                page: state.pagination.current_page,
                perPage: state.pagination.per_page,
                searchTerm: "",
            })
        );
    } catch (error: unknown) {
        const errorMessage =
            (error.response?.data?.message &&
                "Không thể xóa vì có sách đang có tác giả này") ||
            "Không thể xóa vì có sách đang có tác giả này";

        yield put(deleteAuthorFailure(errorMessage));

        toaster.toast({
            title: "Lỗi",
            description: errorMessage,
            status: "error",
        });
    }
}

export default function* authorSaga() {
    yield takeLatest(fetchAuthors.type, fetchAuthorsWorker);
    yield takeLatest(createAuthor.type, createAuthorWorker);
    yield takeLatest(updateAuthor.type, updateAuthorWorker);
    yield takeLatest(deleteAuthor.type, deleteAuthorWorker);
}

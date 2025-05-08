import { call, put, takeLatest } from "redux-saga/effects";
import { adminApi } from "../../services/axios";
import { toaster } from "@/components/ui/toaster";
import {
    fetchUsers,
    fetchUsersSuccess,
    fetchUsersFailure,
    updateUserStatus,
    updateUserStatusSuccess,
    updateUserStatusFailure,
    FetchUsersParams,
    PaginationInfo,
} from "../slices/userSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { SagaIterator } from "redux-saga";
import { PutUserRequest } from "@/services/api";

function* fetchUsersWorker(
    action: PayloadAction<FetchUsersParams>
): SagaIterator {
    try {
        const {
            page = 1,
            perPage = 10,
            searchTerm = "",
            status,
        } = action.payload;
        const response = yield call(
            [adminApi, adminApi.getUsers],
            perPage,
            page,
            searchTerm,
            status
        );

        const pagination: PaginationInfo = response.data.pagination || {
            total: response.data.data.length,
            current_page: page,
            total_pages: Math.ceil(response.data.data.length / perPage),
            per_page: perPage,
        };

        yield put(
            fetchUsersSuccess({
                data: response.data.data,
                pagination,
            })
        );
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message || "Failed to fetch users";

        yield put(fetchUsersFailure(errorMessage));

        toaster.toast({
            title: "Error",
            description: errorMessage,
            status: "error",
        });
    }
}

function* updateUserStatusWorker(
    action: PayloadAction<{
        userId: number;
        status: string | number;
    }>
): SagaIterator {
    try {
        const { userId, status } = action.payload;

        const updateRequest: PutUserRequest = {
            status: status.toString(),
        };

        const response = yield call(
            [adminApi, adminApi.adminUpdateUser],
            userId,
            updateRequest
        );

        yield put(updateUserStatusSuccess(response.data.data));

        toaster.toast({
            title: "Success",
            description: "User status updated successfully",
            status: "success",
        });
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message || "Failed to update user status";

        yield put(updateUserStatusFailure(errorMessage));

        toaster.toast({
            title: "Error",
            description: errorMessage,
            status: "error",
        });
    }
}

export default function* userSaga() {
    yield takeLatest(fetchUsers.type, fetchUsersWorker);
    yield takeLatest(updateUserStatus.type, updateUserStatusWorker);
}

import { call, put, select, takeLatest } from "redux-saga/effects";
import { adminApi } from "../../services/axios";
import { toaster } from "@/components/ui/toaster";
import {
    fetchReviews,
    fetchReviewsSuccess,
    fetchReviewsFailure,
    updateReviewStatus,
    updateReviewStatusSuccess,
    updateReviewStatusFailure,
    FetchReviewsParams,
    PaginationInfo,
} from "../slices/reviewSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { SagaIterator } from "redux-saga";
import { PutReviewRequest } from "@/services/api";
import { RootState } from "../store";

function* fetchReviewsWorker(
    action: PayloadAction<FetchReviewsParams>
): SagaIterator {
    try {
        const {
            page = 1,
            perPage = 10,
            statusParam,
            searchTerm,
            stars,
        } = action.payload;

        const status = statusParam === "" ? undefined : statusParam;

        const response = yield call(
            [adminApi, adminApi.getReviews],
            perPage,
            page,
            searchTerm,
            stars,
            status
        );

        const pagination: PaginationInfo = response.data.pagination || {
            total: response.data.data.length,
            current_page: page,
            total_pages: Math.ceil(response.data.data.length / perPage),
            per_page: perPage,
        };

        yield put(
            fetchReviewsSuccess({
                data: response.data.data,
                pagination,
            })
        );
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message || "Failed to fetch reviews";

        yield put(fetchReviewsFailure(errorMessage));

        toaster.toast({
            title: "Error",
            description: errorMessage,
            status: "error",
        });
    }
}

function* updateReviewStatusWorker(
    action: PayloadAction<{
        reviewId: number;
        status: string;
    }>
): SagaIterator {
    try {
        const { reviewId, status } = action.payload;

        const updateRequest: PutReviewRequest = {
            status,
        };

        const response = yield call(
            [adminApi, adminApi.adminUpdateReview],
            reviewId,
            updateRequest
        );

        yield put(updateReviewStatusSuccess(response.data.data));

        let statusText = "";
        switch (status) {
            case "0":
                statusText = "đang chờ duyệt";
                break;
            case "1":
                statusText = "đã duyệt";
                break;
            case "2":
                statusText = "đã từ chối";
                break;
        }

        toaster.toast({
            title: "Thành công",
            description: `Đã cập nhật trạng thái đánh giá thành ${statusText}`,
            status: "success",
        });

        const state: RootState = yield select();
        const { filterStatus, filterStars, searchTerm, pagination } =
            state.reviews;

        yield put(
            fetchReviews({
                page: pagination.current_page,
                perPage: pagination.per_page,
                status: filterStatus,
                stars: filterStars,
                searchTerm,
            })
        );
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message || "Failed to update review status";

        yield put(updateReviewStatusFailure(errorMessage));

        toaster.toast({
            title: "Lỗi",
            description: errorMessage,
            status: "error",
        });
    }
}

export default function* reviewSaga() {
    yield takeLatest(fetchReviews.type, fetchReviewsWorker);
    yield takeLatest(updateReviewStatus.type, updateReviewStatusWorker);
}

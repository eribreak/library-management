import { call, put, takeLatest } from "redux-saga/effects";
import { adminApi } from "../../services/axios";
import { toaster } from "@/components/ui/toaster";
import {
    fetchPublishers,
    fetchPublishersSuccess,
    fetchPublishersFailure,
    createPublisher,
    createPublisherSuccess,
    createPublisherFailure,
    updatePublisher,
    updatePublisherSuccess,
    updatePublisherFailure,
    deletePublisher,
    deletePublisherSuccess,
    deletePublisherFailure,
    PublisherFormData,
    FetchPublishersParams,
    PaginationInfo,
} from "../slices/publisherSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { SagaIterator } from "redux-saga";

function* fetchPublishersWorker(
    action: PayloadAction<FetchPublishersParams>
): SagaIterator {
    try {
        const { page = 1, perPage = 10, searchTerm = "" } = action.payload;
        const response = yield call(
            [adminApi, adminApi.getPublishers],
            perPage,
            page,
            searchTerm
        );

        const publishers = Array.isArray(response.data.data)
            ? response.data.data
            : [];

        const pagination: PaginationInfo = response.data.pagination || {
            total: publishers.length,
            current_page: page,
            total_pages: Math.ceil(publishers.length / perPage),
            per_page: perPage,
        };

        yield put(
            fetchPublishersSuccess({
                data: publishers,
                pagination,
            })
        );
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message || "Failed to fetch publishers";

        yield put(fetchPublishersFailure(errorMessage));

        toaster.toast({
            title: "Error",
            description: errorMessage,
            status: "error",
        });
    }
}

function* createPublisherWorker(
    action: PayloadAction<PublisherFormData>
): SagaIterator {
    try {
        const response = yield call([adminApi, adminApi.createPublisher], {
            name: action.payload.name,
            description: action.payload.description,
        });

        yield put(createPublisherSuccess(response.data.data));

        toaster.toast({
            title: "Success",
            description:
                response.data.message || "Publisher created successfully",
            status: "success",
        });
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message || "Failed to create publisher";

        yield put(createPublisherFailure(errorMessage));

        toaster.toast({
            title: "Error",
            description: errorMessage,
            status: "error",
        });
    }
}

function* updatePublisherWorker(
    action: PayloadAction<PublisherFormData>
): SagaIterator {
    try {
        const publisherId = action.payload.id;
        if (!publisherId) {
            throw new Error("Publisher ID is required");
        }

        const response = yield call(
            [adminApi, adminApi.adminUpdatePublisher],
            publisherId,
            {
                name: action.payload.name,
                description: action.payload.description,
            }
        );

        yield put(updatePublisherSuccess(response.data.data));

        toaster.toast({
            title: "Success",
            description:
                response.data.message || "Publisher updated successfully",
            status: "success",
        });
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message || "Failed to update publisher";

        yield put(updatePublisherFailure(errorMessage));

        toaster.toast({
            title: "Error",
            description: errorMessage,
            status: "error",
        });
    }
}

function* deletePublisherWorker(action: PayloadAction<number>) {
    try {
        const response = yield call(
            [adminApi, adminApi.deletePublisher],
            action.payload
        );

        yield put(deletePublisherSuccess(action.payload));

        toaster.toast({
            title: "Success",
            description:
                response.data.message || "Publisher deleted successfully",
            status: "success",
        });
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message || "Failed to delete publisher";

        yield put(deletePublisherFailure(errorMessage));

        toaster.toast({
            title: "Error",
            description: errorMessage,
            status: "error",
        });
    }
}

export default function* publisherSaga() {
    yield takeLatest(fetchPublishers.type, fetchPublishersWorker);
    yield takeLatest(createPublisher.type, createPublisherWorker);
    yield takeLatest(updatePublisher.type, updatePublisherWorker);
    yield takeLatest(deletePublisher.type, deletePublisherWorker);
}

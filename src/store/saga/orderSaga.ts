import { call, put, takeLatest } from "redux-saga/effects";
import { adminApi } from "../../services/axios";
import { toaster } from "@/components/ui/toaster";
import {
    fetchOrders,
    fetchOrdersSuccess,
    fetchOrdersFailure,
    updateOrderDetails,
    updateOrderDetailsSuccess,
    updateOrderDetailsFailure,
    UpdateOrderDetailRequest,
    Order,
    FetchOrdersParams,
    PaginationInfo,
} from "../slices/orderSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { SagaIterator } from "redux-saga";
import { UpdateOrderRequest } from "@/services/api";

function* fetchOrdersWorker(
    action: PayloadAction<FetchOrdersParams>
): SagaIterator {
    try {
        const {
            page = 1,
            perPage = 10,
            searchTerm = "",
            status,
            startDate,
            endDate,
        } = action.payload;
        const response = yield call(
            [adminApi, adminApi.getOrders],
            perPage,
            page,
            searchTerm,
            status,
            startDate,
            endDate
        );

        const pagination: PaginationInfo = response.data.pagination || {
            total: response.data.data.length,
            current_page: page,
            total_pages: Math.ceil(response.data.data.length / perPage),
            per_page: perPage,
        };

        yield put(
            fetchOrdersSuccess({
                data: response.data.data,
                pagination,
            })
        );
    } catch (error: any) {
        const errorMessage =
            (error.response?.data?.message &&
                "Lỗi khi tải danh sách đơn hàng") ||
            "Lỗi khi tải danh sách đơn hàng";

        yield put(fetchOrdersFailure(errorMessage));

        toaster.toast({
            title: "Lỗi",
            description: errorMessage,
            status: "error",
        });
    }
}

function* updateOrderDetailsWorker(
    action: PayloadAction<{
        orderId: number;
        details: UpdateOrderDetailRequest[];
    }>
): SagaIterator {
    try {
        const { orderId, details } = action.payload;

        const updateRequest: UpdateOrderRequest = {
            details: details.map((detail) => ({
                id: detail.id,
                status: detail.status,
                return_date_real: detail.return_date_real || null,
            })),
        };

        const response = yield call(
            [adminApi, adminApi.updateOrder],
            orderId,
            updateRequest
        );

        const updatedOrder: Order = response.data.data;
        yield put(updateOrderDetailsSuccess(updatedOrder));

        toaster.toast({
            title: "Thành công",
            description:
                (response.data.message &&
                    "Cập nhật chi tiết đơn hàng thành công") ||
                "Cập nhật chi tiết đơn hàng thành công",
            status: "success",
        });
    } catch (error: any) {
        const errorMessage =
            (error.response?.data?.message &&
                "Lỗi khi cập nhật chi tiết đơn hàng") ||
            "Lỗi khi cập nhật chi tiết đơn hàng";

        yield put(updateOrderDetailsFailure(errorMessage));

        toaster.toast({
            title: "Lỗi",
            description: errorMessage,
            status: "error",
        });
    }
}

export default function* orderSaga() {
    yield takeLatest(fetchOrders.type, fetchOrdersWorker);
    yield takeLatest(updateOrderDetails.type, updateOrderDetailsWorker);
}

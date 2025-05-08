import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface OrderDetail {
    id: number;
    title: string;
    image_url: string;
    return_date_due: string;
    return_date_real: string | null;
    status: string;
    quantity: number;
}

export interface Order {
    id: number;
    status: string;
    created_at: string;
    full_name: string;
    employee_code: string;
    details: OrderDetail[];
}

export interface PaginationInfo {
    total: number;
    current_page: number;
    total_pages: number;
    per_page: number;
}

export interface FetchOrdersParams {
    page?: number;
    perPage?: number;
    searchTerm?: string;
    status?: string;
}

export interface UpdateOrderDetailRequest {
    id: number;
    status: string;
    return_date_real?: string | null;
}

interface OrdersState {
    orders: Order[];
    selectedOrder: Order | null;
    loading: boolean;
    error: string | null;
    updateSuccess: boolean;
    pagination: PaginationInfo;
}

const initialState: OrdersState = {
    orders: [],
    selectedOrder: null,
    loading: false,
    error: null,
    updateSuccess: false,
    pagination: {
        total: 0,
        current_page: 1,
        total_pages: 1,
        per_page: 10,
    },
};

const ordersSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        fetchOrders: (state, _action: PayloadAction<FetchOrdersParams>) => {
            state.loading = true;
            state.error = null;
        },
        fetchOrdersSuccess: (
            state,
            action: PayloadAction<{ data: Order[]; pagination: PaginationInfo }>
        ) => {
            state.orders = action.payload.data;
            state.pagination = action.payload.pagination;
            state.loading = false;
            state.error = null;
        },
        fetchOrdersFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        selectOrder: (state, action: PayloadAction<number>) => {
            const order = state.orders.find((o) => o.id === action.payload);
            if (order) {
                state.selectedOrder = order;
            }
        },
        clearSelectedOrder: (state) => {
            state.selectedOrder = null;
        },
        updateOrderDetails: (
            state,
            _action: PayloadAction<{
                orderId: number;
                details: UpdateOrderDetailRequest[];
            }>
        ) => {
            state.loading = true;
            state.error = null;
            state.updateSuccess = false;
        },
        updateOrderDetailsSuccess: (state, action: PayloadAction<Order>) => {
            const updatedOrder = action.payload;
            const index = state.orders.findIndex(
                (o) => o.id === updatedOrder.id
            );
            if (index !== -1) {
                state.orders[index] = updatedOrder;
            }
            if (
                state.selectedOrder &&
                state.selectedOrder.id === updatedOrder.id
            ) {
                state.selectedOrder = updatedOrder;
            }
            state.loading = false;
            state.updateSuccess = true;
        },
        updateOrderDetailsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
            state.updateSuccess = false;
        },
        resetUpdateStatus: (state) => {
            state.updateSuccess = false;
        },
    },
});

export const {
    fetchOrders,
    fetchOrdersSuccess,
    fetchOrdersFailure,
    selectOrder,
    clearSelectedOrder,
    updateOrderDetails,
    updateOrderDetailsSuccess,
    updateOrderDetailsFailure,
    resetUpdateStatus,
} = ordersSlice.actions;

export const ordersReducer = ordersSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GetUsersStatusEnum } from "@/services/api";

export interface User {
    id: number;
    name?: string;
    full_name?: string;
    email: string;
    phone_number?: string;
    status: string | number;
    created_at?: string;
    updated_at?: string;
    orders_count?: number;
    gender?: string;
    birth_date?: string;
    address?: string;
    employee_code?: string;
}

export interface PaginationInfo {
    total: number;
    current_page: number;
    total_pages: number;
    per_page: number;
}

export interface FetchUsersParams {
    page?: number;
    perPage?: number;
    searchTerm?: string;
    status?: GetUsersStatusEnum[];
}

interface UserState {
    users: User[];
    loading: boolean;
    error: string | null;
    pagination: PaginationInfo;
}

const initialState: UserState = {
    users: [],
    loading: false,
    error: null,
    pagination: {
        total: 0,
        current_page: 1,
        total_pages: 1,
        per_page: 10,
    },
};

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        fetchUsers(state, _action: PayloadAction<FetchUsersParams>) {
            state.loading = true;
            state.error = null;
        },
        fetchUsersSuccess(
            state,
            action: PayloadAction<{ data: User[]; pagination: PaginationInfo }>
        ) {
            state.users = action.payload.data;
            state.pagination = action.payload.pagination;
            state.loading = false;
        },
        fetchUsersFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        updateUserStatus(
            state,
            _: PayloadAction<{
                userId: number;
                status: string | number;
            }>
        ) {
            state.loading = true;
            state.error = null;
        },
        updateUserStatusSuccess(state, action: PayloadAction<User>) {
            const updatedUser = action.payload;
            state.users = state.users.map((user) =>
                user.id === updatedUser.id ? updatedUser : user
            );
            state.loading = false;
        },
        updateUserStatusFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    fetchUsers,
    fetchUsersSuccess,
    fetchUsersFailure,
    updateUserStatus,
    updateUserStatusSuccess,
    updateUserStatusFailure,
} = userSlice.actions;

export const usersReducer = userSlice.reducer;

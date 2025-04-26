import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthProfile } from "@/services/api";

export interface AuthState {
    isAuthenticated: boolean;
    user: {
        fullName?: string;
        email?: string;
        role?: number;
    } | null;
    accessToken: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    isAuthenticated: !!localStorage.getItem("accessToken"),
    user: null,
    accessToken: localStorage.getItem("accessToken"),
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginRequest: (
            state,
            action: PayloadAction<{ email: string; password: string }>
        ) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (
            state,
            action: PayloadAction<{ accessToken: string; user: AuthProfile }>
        ) => {
            state.isAuthenticated = true;
            const userData = action.payload.user || {};
            state.user = {
                fullName: userData.full_name || "User",
                email: userData.email || "",
                role: userData.role || 0,
            };

            state.accessToken = action.payload.accessToken;
            state.loading = false;
            state.error = null;

            localStorage.setItem("accessToken", action.payload.accessToken);
        },

        loginFailure: (state, action: PayloadAction<string>) => {
            state.isAuthenticated = false;
            state.user = null;
            state.accessToken = null;
            state.loading = false;
            state.error = action.payload;
            localStorage.removeItem("accessToken");
        },

        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.accessToken = null;
            state.loading = false;
            state.error = null;
            localStorage.removeItem("accessToken");
        },

        clearErrors: (state) => {
            state.error = null;
        },
    },
});

export const { loginRequest, loginSuccess, loginFailure, logout, clearErrors } =
    authSlice.actions;

export const authReducer = authSlice.reducer;

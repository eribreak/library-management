import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import { loginFailure, loginRequest, loginSuccess } from "../slices/authSlice";
import { authApi } from "@/services/axios";
import { AuthLoginRequest } from "@/services/api";
import { toaster } from "@/components/ui/toaster";

function* handleLogin(action: PayloadAction<AuthLoginRequest>) {
    try {
        const response = yield call([authApi, authApi.login], action.payload);
        const responseData = response.data;
        const { access_token, user } = responseData;
        if (!access_token) {
            throw new Error("Token không hợp lệ");
        }
        localStorage.setItem("accessToken", access_token);

        yield put(
            loginSuccess({
                accessToken: access_token,
                user,
            })
        );
    } catch (error: any) {
        const errorMessage =
            (error.response.data.error === "Tài khoản đã bị chặn" &&
                "Tài khoản đã bị chặn") ||
            "Tài khoản hoặc mật khẩu không chính xác";

        toaster.toast({
            title: "Đăng nhập thất bại",
            description: errorMessage,
            status: "error",
        });

        yield put(loginFailure(errorMessage));
    }
}

export function* authSaga() {
    yield takeLatest(loginRequest.type, handleLogin);
}

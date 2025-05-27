import { call, put, takeLatest, select } from "redux-saga/effects";
import { adminApi } from "../../services/axios";
import { toaster } from "@/components/ui/toaster";
import {
    fetchEmployees,
    fetchEmployeesSuccess,
    fetchEmployeesFailure,
    createEmployee,
    createEmployeeSuccess,
    createEmployeeFailure,
    updateEmployee,
    updateEmployeeSuccess,
    updateEmployeeFailure,
    deleteEmployee,
    deleteEmployeeSuccess,
    deleteEmployeeFailure,
    EmployeeFormData,
    FetchEmployeesParams,
    PaginationInfo,
} from "../slices/employeeSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { SagaIterator } from "redux-saga";
import { RootState } from "../store";
import { SuccessMessages } from "@/utils/message";

function* fetchEmployeesWorker(
    action: PayloadAction<FetchEmployeesParams>
): SagaIterator {
    try {
        const {
            page = 1,
            perPage = 10,
            searchTerm = "",
            sortBy = "",
            sortDirection = "asc",
        } = action.payload;
        const response = yield call(
            [adminApi, adminApi.getEmployees],
            perPage,
            page,
            searchTerm,
            {
                params: {
                    sortBy,
                    sortDirection,
                },
            }
        );

        const pagination: PaginationInfo = response.data.pagination || {
            total: response.data.data.length,
            current_page: page,
            total_pages: Math.ceil(response.data.data.length / perPage),
            per_page: perPage,
        };

        yield put(
            fetchEmployeesSuccess({
                data: response.data.data,
                pagination,
            })
        );
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message || "Lỗi khi tải dữ liệu";

        yield put(fetchEmployeesFailure(errorMessage));

        toaster.toast({
            title: "Lỗi",
            description: errorMessage,
            status: "error",
        });
    }
}

function* createEmployeeWorker(
    action: PayloadAction<EmployeeFormData>
): SagaIterator {
    try {
        const response = yield call([adminApi, adminApi.createEmployee], {
            employee_code: action.payload.employee_code,
            full_name: action.payload.full_name,
            email: action.payload.email,
        });

        yield put(createEmployeeSuccess(response.data.data));

        const state = yield select((state: RootState) => state.employees);
        yield put(
            fetchEmployees({
                page: state.pagination.current_page,
                perPage: state.pagination.per_page,
                searchTerm: "",
                sortBy: (state.sortBy as string) || "",
                sortDirection: state.sortDirection || "asc",
            })
        );

        toaster.toast({
            title: "Thành công",
            description: response.data.message && SuccessMessages.CreateSuccess,
            status: "success",
        });
    } catch (error: any) {
        let errorMessage = "Có lỗi xảy ra khi tạo nhân viên";

        if (error.response?.data?.errors) {
            const errors = error.response.data.errors;
            const errorMessages = [];

            if (errors.employee_code) {
                errorMessages.push("Mã nhân viên đã tồn tại");
            }
            if (errors.email) {
                errorMessages.push("Email đã tồn tại");
            }
            if (errors.full_name) {
                errorMessages.push("Tên nhân viên không hợp lệ");
            }

            if (errorMessages.length > 0) {
                errorMessage = errorMessages.join(", ");
            }
        } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        }

        yield put(createEmployeeFailure(errorMessage));
        toaster.toast({
            title: "Lỗi",
            description: errorMessage,
            status: "error",
        });
    }
}

function* updateEmployeeWorker(
    action: PayloadAction<EmployeeFormData>
): SagaIterator {
    try {
        const employeeId = action.payload.id;
        if (!employeeId) {
            throw new Error("Employee ID is required");
        }

        const response = yield call(
            [adminApi, adminApi.adminUpdateEmployee],
            employeeId,
            {
                employee_code: action.payload.employee_code,
                full_name: action.payload.full_name,
                email: action.payload.email,
            }
        );

        yield put(updateEmployeeSuccess(response.data.data));

        const state = yield select((state: RootState) => state.employees);
        yield put(
            fetchEmployees({
                page: state.pagination.current_page,
                perPage: state.pagination.per_page,
                searchTerm: "",
                sortBy: (state.sortBy as string) || "",
                sortDirection: state.sortDirection || "asc",
            })
        );

        toaster.toast({
            title: "Thành công",
            description: response.data.message && SuccessMessages.UpdateSuccess,
            status: "success",
        });
    } catch (error: any) {
        let errorMessage = "Có lỗi xảy ra khi cập nhật nhân viên";

        if (error.response?.data?.errors) {
            const errors = error.response.data.errors;
            const errorMessages = [];

            if (errors.employee_code) {
                errorMessages.push("Mã nhân viên đã tồn tại");
            }
            if (errors.email) {
                errorMessages.push("Email đã tồn tại");
            }
            if (errors.full_name) {
                errorMessages.push("Tên nhân viên không hợp lệ");
            }

            if (errorMessages.length > 0) {
                errorMessage = errorMessages.join(", ");
            }
        } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        }

        yield put(updateEmployeeFailure(errorMessage));
        toaster.toast({
            title: "Lỗi",
            description: errorMessage,
            status: "error",
        });
    }
}

function* deleteEmployeeWorker(action: PayloadAction<number>): SagaIterator {
    try {
        const response = yield call(
            [adminApi, adminApi.deleteEmployee],
            action.payload
        );

        yield put(deleteEmployeeSuccess(action.payload));

        const state = yield select((state: RootState) => state.employees);
        yield put(
            fetchEmployees({
                page: state.pagination.current_page,
                perPage: state.pagination.per_page,
                searchTerm: "",
                sortBy: (state.sortBy as string) || "",
                sortDirection: state.sortDirection || "asc",
            })
        );

        toaster.toast({
            title: "Thành công",
            description: response.data.message && SuccessMessages.DeleteSuccess,
            status: "success",
        });
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message || "Lỗi khi xóa nhân viên";

        yield put(deleteEmployeeFailure(errorMessage));

        toaster.toast({
            title: "Lỗi",
            description: errorMessage,
            status: "error",
        });
    }
}

export default function* employeeSaga() {
    yield takeLatest(fetchEmployees.type, fetchEmployeesWorker);
    yield takeLatest(createEmployee.type, createEmployeeWorker);
    yield takeLatest(updateEmployee.type, updateEmployeeWorker);
    yield takeLatest(deleteEmployee.type, deleteEmployeeWorker);
}

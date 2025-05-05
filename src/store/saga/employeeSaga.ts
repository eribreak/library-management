import { call, put, takeLatest } from "redux-saga/effects";
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
} from "../slices/employeeSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { SagaIterator } from "redux-saga";

function* fetchEmployeesWorker(
    action: PayloadAction<string | undefined>
): SagaIterator {
    try {
        const searchTerm = action.payload;
        const response = yield call(
            [adminApi, adminApi.getEmployees],
            99,
            searchTerm
        );

        yield put(fetchEmployeesSuccess(response.data.data));
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message || "Failed to fetch employees";

        yield put(fetchEmployeesFailure(errorMessage));

        toaster.toast({
            title: "Error",
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

        toaster.toast({
            title: "Success",
            description:
                response.data.message || "Employee created successfully",
            status: "success",
        });
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message || "Failed to create employee";

        yield put(createEmployeeFailure(errorMessage));

        toaster.toast({
            title: "Error",
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

        toaster.toast({
            title: "Success",
            description:
                response.data.message || "Employee updated successfully",
            status: "success",
        });
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message || "Failed to update employee";

        yield put(updateEmployeeFailure(errorMessage));

        toaster.toast({
            title: "Error",
            description: errorMessage,
            status: "error",
        });
    }
}

function* deleteEmployeeWorker(action: PayloadAction<number>) {
    try {
        const response = yield call(
            [adminApi, adminApi.deleteEmployee],
            action.payload
        );

        yield put(deleteEmployeeSuccess(action.payload));

        toaster.toast({
            title: "Success",
            description:
                response.data.message || "Employee deleted successfully",
            status: "success",
        });
    } catch (error: any) {
        const errorMessage =
            error.response?.data?.message || "Failed to delete employee";

        yield put(deleteEmployeeFailure(errorMessage));

        toaster.toast({
            title: "Error",
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

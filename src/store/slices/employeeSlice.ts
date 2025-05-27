import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Employee {
    id: number;
    employee_code: string;
    full_name: string;
    email: string;
    [key: string]: string | number | undefined;
}

export interface EmployeeFormData {
    id?: number;
    employee_code: string;
    full_name: string;
    email: string;
}

export interface PaginationInfo {
    total: number;
    current_page: number;
    total_pages: number;
    per_page: number;
}

export interface FetchEmployeesParams {
    page?: number;
    perPage?: number;
    searchTerm?: string;
    sortBy?: string;
    sortDirection?: "asc" | "desc";
}

interface EmployeesState {
    employees: Employee[];
    loading: boolean;
    error: string | null;
    pagination: PaginationInfo;
    sortBy: string | null;
    sortDirection: "asc" | "desc";
    isCreating: boolean;
    isUpdating: boolean;
    createError: string | null;
    updateError: string | null;
    deleteError: string | null;
}

const initialState: EmployeesState = {
    employees: [],
    loading: false,
    error: null,
    pagination: {
        total: 0,
        current_page: 1,
        total_pages: 1,
        per_page: 10,
    },
    sortBy: null,
    sortDirection: "asc",
    isCreating: false,
    isUpdating: false,
    createError: null,
    updateError: null,
    deleteError: null,
};

const employeesSlice = createSlice({
    name: "employees",
    initialState,
    reducers: {
        fetchEmployees: {
            reducer: (state, action: PayloadAction<FetchEmployeesParams>) => {
                state.loading = true;
                state.error = null;

                if (action.payload.sortBy) {
                    state.sortBy = action.payload.sortBy;
                }
                if (action.payload.sortDirection) {
                    state.sortDirection = action.payload.sortDirection;
                }
            },
            prepare: (params: FetchEmployeesParams) => ({ payload: params }),
        },
        fetchEmployeesSuccess: (
            state,
            action: PayloadAction<{
                data: Employee[];
                pagination: PaginationInfo;
            }>
        ) => {
            state.employees = action.payload.data;
            state.pagination = action.payload.pagination;
            state.loading = false;
            state.error = null;
        },
        fetchEmployeesFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        createEmployee: {
            reducer: (state) => {
                state.isCreating = true;
                state.createError = null;
            },
            prepare: (data: EmployeeFormData) => ({ payload: data }),
        },
        createEmployeeSuccess: (state) => {
            state.isCreating = false;
            state.createError = null;
        },
        createEmployeeFailure: (state, action: PayloadAction<string>) => {
            state.isCreating = false;
            state.createError = action.payload;
        },
        updateEmployee: {
            reducer: (state) => {
                state.isUpdating = true;
                state.updateError = null;
            },
            prepare: (data: EmployeeFormData) => ({ payload: data }),
        },
        updateEmployeeSuccess: (state) => {
            state.isUpdating = false;
            state.updateError = null;
        },
        updateEmployeeFailure: (state, action: PayloadAction<string>) => {
            state.isUpdating = false;
            state.updateError = action.payload;
        },
        deleteEmployee: {
            reducer: (state) => {
                state.loading = true;
                state.deleteError = null;
            },
            prepare: (id: number) => ({ payload: id }),
        },
        deleteEmployeeSuccess: (state) => {
            state.loading = false;
            state.deleteError = null;
        },
        deleteEmployeeFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.deleteError = action.payload;
        },
        clearCreateError: (state) => {
            state.createError = null;
        },
        clearUpdateError: (state) => {
            state.updateError = null;
        },
    },
});

export const {
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
    clearCreateError,
    clearUpdateError,
} = employeesSlice.actions;

export const employeesReducer = employeesSlice.reducer;

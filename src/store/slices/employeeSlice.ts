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
}

interface EmployeesState {
    employees: Employee[];
    loading: boolean;
    error: string | null;
    pagination: PaginationInfo;
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
};

const employeesSlice = createSlice({
    name: "employees",
    initialState,
    reducers: {
        fetchEmployees: (
            state,
            _action: PayloadAction<FetchEmployeesParams>
        ) => {
            state.loading = true;
            state.error = null;
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
        createEmployee: (state) => {
            state.loading = true;
            state.error = null;
        },
        createEmployeeSuccess: (state, action: PayloadAction<Employee>) => {
            state.employees.push(action.payload);
            state.loading = false;
            state.error = null;
        },
        createEmployeeFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateEmployee: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateEmployeeSuccess: (state, action: PayloadAction<Employee>) => {
            const index = state.employees.findIndex(
                (employee) => employee.id === action.payload.id
            );
            if (index !== -1) {
                state.employees[index] = action.payload;
            }
            state.loading = false;
            state.error = null;
        },
        updateEmployeeFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteEmployee: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteEmployeeSuccess: (state, action: PayloadAction<number>) => {
            state.employees = state.employees.filter(
                (employee) => employee.id !== action.payload
            );
            state.loading = false;
            state.error = null;
        },
        deleteEmployeeFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
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
} = employeesSlice.actions;

export const employeesReducer = employeesSlice.reducer;

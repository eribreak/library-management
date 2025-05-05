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

interface EmployeesState {
    employees: Employee[];
    loading: boolean;
    error: string | null;
}

const initialState: EmployeesState = {
    employees: [],
    loading: false,
    error: null,
};

const employeesSlice = createSlice({
    name: "employees",
    initialState,
    reducers: {
        fetchEmployees: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchEmployeesSuccess: (state, action: PayloadAction<Employee[]>) => {
            state.employees = action.payload;
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

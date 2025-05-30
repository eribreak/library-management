import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import styles from "./Employee.module.css";
import SearchInput from "../../components/common/search-input/SearchInput";
import CustomTable from "@/components/common/table/CustomTable";
import { Column } from "@/components/common/table/CustomTable";
import SimplePagination from "../../components/common/pagination/SimplePagination";
import { Toaster, toaster } from "@/components/ui/toaster";
import deleteIcon from "@/assets/images/images/delete-icon.svg";
import clsx from "clsx";
import {
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    Employee as EmployeeType,
    EmployeeFormData,
    type Employee,
} from "@/store/slices/employeeSlice";
import { RootState, AppDispatch } from "@/store/store";
import EmployeeFormDialog from "@/components/common/dialog/EmployeeFormDialog";
import CustomButton from "@/components/common/button/CustomButton";
import { Box, Center, Spinner } from "@chakra-ui/react";
import { adminApi } from "@/services/axios";
import ConfirmDialog from "@/components/common/dialog/ConfirmDialog";

const Employee: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [searchParams, setSearchParams] = useSearchParams();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { employees, loading, pagination } = useSelector(
        (state: RootState) => state.employees
    );

    const pageFromUrl = searchParams.get("page");
    const searchTermFromUrl = searchParams.get("search");
    const idFromUrl = searchParams.get("id");

    const [inputValue, setInputValue] = useState(searchTermFromUrl || "");
    const [searchTerm, setSearchTerm] = useState(searchTermFromUrl || "");
    const [currentPage, setCurrentPage] = useState(
        pageFromUrl ? parseInt(pageFromUrl) : 1
    );
    const [sortBy, setSortBy] = useState<keyof EmployeeType | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [itemsPerPage] = useState(8);
    const [importing, setImporting] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] =
        useState<EmployeeType | null>(null);

    useEffect(() => {
        if (idFromUrl) {
            const employeeId = parseInt(idFromUrl);
            const employee = employees.find((emp) => emp.id === employeeId);

            if (employee) {
                console.log(`Selected employee with ID: ${employeeId}`);
            }
        }
    }, [idFromUrl, employees]);

    useEffect(() => {
        dispatch(
            fetchEmployees({
                page: currentPage,
                perPage: itemsPerPage,
                searchTerm,
                sortBy: sortBy as string,
                sortDirection,
            })
        );
    }, [
        dispatch,
        currentPage,
        itemsPerPage,
        searchTerm,
        sortBy,
        sortDirection,
    ]);

    const handleInputChange = (term: string) => {
        setInputValue(term);
    };

    const handleClearSearch = () => {
        setInputValue("");
        setSearchTerm("");
        setCurrentPage(1);

        const params = new URLSearchParams();
        if (idFromUrl) {
            params.set("id", idFromUrl);
        }
        setSearchParams(params);

        dispatch(
            fetchEmployees({
                page: 1,
                perPage: itemsPerPage,
                searchTerm: "",
            })
        );
    };

    const handleCreateEmployee = (data: EmployeeFormData) => {
        dispatch(createEmployee(data));
    };

    const handleEditSubmit = (data: EmployeeFormData) => {
        dispatch(updateEmployee(data));
    };

    const handleDeleteEmployee = (employee: EmployeeType) => {
        setEmployeeToDelete(employee);
        setConfirmDialogOpen(true);

        const params = new URLSearchParams(searchParams);
        params.set("id", employee.id.toString());
        setSearchParams(params);
    };

    const confirmDelete = () => {
        if (employeeToDelete) {
            dispatch(deleteEmployee(employeeToDelete.id));
        }
        setConfirmDialogOpen(false);

        const params = new URLSearchParams(searchParams);
        params.delete("id");
        setSearchParams(params);
    };

    const cancelDelete = () => {
        setEmployeeToDelete(null);
        setConfirmDialogOpen(false);

        const params = new URLSearchParams(searchParams);
        params.delete("id");
        setSearchParams(params);
    };

    const handleSearch = () => {
        setSearchTerm(inputValue);

        setCurrentPage(1);

        const params = new URLSearchParams();

        if (inputValue) {
            params.set("search", inputValue);
        }

        setSearchParams(params);

        dispatch(
            fetchEmployees({
                page: 1,
                perPage: itemsPerPage,
                searchTerm: inputValue,
            })
        );
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            setImporting(true);
            await adminApi.importEmployees(file);

            toaster.toast({
                title: "Import thành công",
                description: "Dữ liệu nhân viên đã được nhập thành công.",
                status: "success",
            });

            dispatch(
                fetchEmployees({
                    page: currentPage,
                    perPage: itemsPerPage,
                    searchTerm,
                })
            );
        } catch (error: unknown) {
            let detail = "Có lỗi xảy ra khi nhập dữ liệu nhân viên.";
            interface AxiosErrorWithMessage {
                response?: {
                    data?: {
                        message?: unknown;
                    };
                };
            }
            const err = error as AxiosErrorWithMessage;
            const message = err.response?.data?.message;
            if (typeof message === "object" && message !== null) {
                detail = Object.entries(message as Record<string, string[]>)
                    .map(([row, msgs]) => `Dòng ${row}: ${msgs.join(", ")}`)
                    .join("\n");
            } else if (typeof message === "string") {
                detail = message;
            }

            toaster.toast({
                title: "Import thất bại",
                description: detail,
                status: "error",
            });
        } finally {
            setImporting(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const renderEmployeeCode = (employee: Employee) => {
        return (
            <div className={styles.employee_code}>{employee.employee_code}</div>
        );
    };

    const renderEmployeeName = (employee: Employee) => {
        return <div className={styles.employee_name}>{employee.full_name}</div>;
    };

    const renderEmployeeEmail = (employee: Employee) => {
        return <div className={styles.employee_email}>{employee.email}</div>;
    };
    const renderAction = (employee: Employee) => {
        const handleEditClick = () => {
            const params = new URLSearchParams(searchParams);
            params.set("id", employee.id.toString());
            setSearchParams(params);
        };

        const handleDialogClose = () => {
            const params = new URLSearchParams(searchParams);
            params.delete("id");
            setSearchParams(params);
        };

        return (
            <div className={styles.actions_wrapper}>
                <div onClick={handleEditClick}>
                    <EmployeeFormDialog
                        isEdit={true}
                        employee={employee}
                        onSubmit={(data) => {
                            handleEditSubmit(data);
                            handleDialogClose();
                        }}
                        onDialogClose={handleDialogClose}
                    />
                </div>

                <CustomButton
                    onClick={() => handleDeleteEmployee(employee)}
                    className={clsx(
                        styles.action_button,
                        styles.action_button_right
                    )}
                >
                    <img src={deleteIcon} alt="Delete" />
                </CustomButton>
            </div>
        );
    };
    const columns: Column<EmployeeType>[] = [
        {
            key: "employee_code",
            header: "Mã nhân viên",
            width: "20%",
            render: renderEmployeeCode,
        },
        {
            key: "full_name",
            header: "Họ và tên",
            render: renderEmployeeName,
        },
        {
            key: "email",
            header: "Email",
            width: "30%",
            render: renderEmployeeEmail,
        },
        {
            key: "actions",
            header: "Thao tác",
            width: "15%",
            headerTextAlign: "center",
            render: renderAction,
        },
    ];

    const handlePageChange = (page: number) => {
        setCurrentPage(page);

        const params = new URLSearchParams(searchParams);

        if (page > 1) {
            params.set("page", page.toString());
        } else {
            params.delete("page");
        }

        setSearchParams(params);
    };

    const totalItems = pagination?.total || 0;
    const totalPages =
        pagination?.total_pages || Math.ceil(totalItems / itemsPerPage);
    const startIndex =
        ((pagination?.current_page || 1) - 1) *
            (pagination?.per_page || itemsPerPage) +
        1;
    const endIndex = Math.min(
        startIndex + (pagination?.per_page || itemsPerPage) - 1,
        totalItems
    );

    const handleSortChange = (
        columnKey: keyof EmployeeType,
        direction: "asc" | "desc"
    ) => {
        setSortBy(columnKey);
        setSortDirection(direction);
    };

    return (
        <div>
            <Toaster />
            <Box className={styles.employee_title}>Quản lý Nhân viên</Box>
            <Box className={styles.search_wrapper}>
                <SearchInput
                    value={inputValue}
                    onChange={handleInputChange}
                    onSearch={handleSearch}
                    onClear={handleClearSearch}
                    placeholder="Tìm kiếm theo tên hoặc mã nhân viên..."
                />
                <div className={styles.action_buttons}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        accept=".csv"
                        onChange={handleFileChange}
                    />
                    <CustomButton
                        onClick={handleImportClick}
                        className={styles.import_button}
                        disabled={importing}
                    >
                        {importing ? "Đang import..." : "Import CSV"}
                    </CustomButton>
                    <EmployeeFormDialog
                        isEdit={false}
                        onSubmit={handleCreateEmployee}
                    />
                </div>
            </Box>
            {loading ? (
                <Center h="400px">
                    <Spinner size="xl" color="var(--primary-color)" />
                </Center>
            ) : (
                <>
                    <Box
                        borderRadius={"8px"}
                        overflow={"hidden"}
                        boxShadow={"0 0 10px 0 rgba(0, 0, 0, 0.1)"}
                    >
                        <CustomTable<EmployeeType>
                            tableLayout="fixed"
                            data={employees}
                            columns={columns}
                            onSortChange={handleSortChange}
                        />
                    </Box>

                    <div className={styles.pagination_wrapper}>
                        <SimplePagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            itemsInfo={{
                                startIndex,
                                endIndex,
                                totalItems,
                            }}
                        />
                    </div>
                </>
            )}
            {confirmDialogOpen && employeeToDelete && (
                <ConfirmDialog
                    isOpen={confirmDialogOpen}
                    onClose={cancelDelete}
                    onConfirm={confirmDelete}
                    title="Xác nhận xóa"
                    description={`Bạn có chắc chắn muốn xóa nhân viên "${employeeToDelete.full_name}"?`}
                />
            )}
        </div>
    );
};

export default Employee;

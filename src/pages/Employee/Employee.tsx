import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Employee.module.css";
import SearchInput from "../../components/common/search-input/SearchInput";
import { CustomTable } from "@/components/common/table";
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
} from "@/store/slices/employeeSlice";
import { RootState, AppDispatch } from "@/store/store";
import EmployeeFormDialog from "@/components/common/dialog/EmployeeFormDialog";
import CustomButton from "@/components/common/button/CustomButton";
import { Box } from "@chakra-ui/react";
import { adminApi } from "@/services/axios";

const Employee: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { employees, loading, pagination } = useSelector(
        (state: RootState) => state.employees
    );

    const [inputValue, setInputValue] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);
    const [importing, setImporting] = useState(false);

    useEffect(() => {
        dispatch(
            fetchEmployees({
                page: currentPage,
                perPage: itemsPerPage,
                searchTerm,
            })
        );
    }, [dispatch, currentPage, itemsPerPage, searchTerm]);

    const handleInputChange = (term: string) => {
        setInputValue(term);
    };

    const handleCreateEmployee = (data: EmployeeFormData) => {
        dispatch(createEmployee(data));
    };

    const handleEditSubmit = (data: EmployeeFormData) => {
        dispatch(updateEmployee(data));
    };

    const handleDeleteEmployee = (employee: EmployeeType) => {
        if (
            window.confirm(
                `Bạn có chắc chắn muốn xóa nhân viên "${employee.full_name}"?`
            )
        ) {
            dispatch(deleteEmployee(employee.id));
        }
    };

    const handleSearch = () => {
        setSearchTerm(inputValue);
        setCurrentPage(1);
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
            adminApi.importEmployees(file);

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
        } catch (error) {
            toaster.toast({
                title: "Import thất bại",
                description: "Có lỗi xảy ra khi nhập dữ liệu nhân viên.",
                status: "error",
            });
        } finally {
            setImporting(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const columns: Column<EmployeeType>[] = [
        {
            key: "id",
            header: "ID",
            render: (employee) => <div>{employee.id}</div>,
            width: "10%",
        },
        {
            key: "employee_code",
            header: "Mã nhân viên",
            width: "20%",
            render: (employee) => (
                <div className={styles.employee_code}>
                    {employee.employee_code}
                </div>
            ),
        },
        {
            key: "full_name",
            header: "Họ và tên",
            render: (employee) => (
                <div className={styles.employee_name}>{employee.full_name}</div>
            ),
        },
        {
            key: "email",
            header: "Email",
            render: (employee) => (
                <div className={styles.employee_email}>{employee.email}</div>
            ),
        },
        {
            key: "actions",
            header: "Thao tác",
            headerTextAlign: "center",
            render: (employee) => (
                <div className={styles.actions_wrapper}>
                    <EmployeeFormDialog
                        isEdit={true}
                        employee={employee}
                        onSubmit={(data) => handleEditSubmit(data)}
                    />

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
            ),
        },
    ];

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
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

    return (
        <div>
            <Toaster />
            <Box className={styles.employee_title}>Quản lý Nhân viên</Box>
            <Box className={styles.search_wrapper}>
                <SearchInput
                    value={inputValue}
                    onChange={handleInputChange}
                    onSearch={handleSearch}
                    placeholder="Tìm kiếm nhân viên..."
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
                <div className={styles.loading}>Đang tải...</div>
            ) : (
                <>
                    <Box borderRadius={"8px"} overflow={"hidden"}>
                        <CustomTable<EmployeeType>
                            data={employees}
                            columns={columns}
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
        </div>
    );
};

export default Employee;

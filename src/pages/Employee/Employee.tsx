import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Employee.module.css";
import SearchInput from "../../components/common/search-input/SearchInput";
import { CustomTable } from "@/components/common/table";
import { Column } from "@/components/common/table/CustomTable";
import SimplePagination from "../../components/common/pagination/SimplePagination";
import { Toaster } from "@/components/ui/toaster";
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
import { RootState } from "@/store/store";
import EmployeeFormDialog from "@/components/common/dialog/EmployeeFormDialog";
import CustomButton from "@/components/common/button/CustomButton";
import { Box } from "@chakra-ui/react";

const Employee: React.FC = () => {
    const dispatch = useDispatch();
    const { employees, loading } = useSelector(
        (state: RootState) => state.employees
    );

    const [inputValue, setInputValue] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [displayData, setDisplayData] = useState<EmployeeType[]>([]);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        dispatch(fetchEmployees(searchTerm));
    }, [dispatch, searchTerm]);

    useEffect(() => {
        if (employees.length > 0) {
            setTotalItems(employees.length);

            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = Math.min(
                startIndex + itemsPerPage,
                employees.length
            );
            setDisplayData(employees.slice(startIndex, endIndex));
        } else {
            setDisplayData([]);
            setTotalItems(0);
        }
    }, [currentPage, employees, itemsPerPage]);

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

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex =
        employees.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <Toaster />
            <Box className={styles.search_wrapper}>
                <SearchInput
                    value={inputValue}
                    onChange={handleInputChange}
                    onSearch={handleSearch}
                    placeholder="Tìm kiếm nhân viên..."
                />
                <EmployeeFormDialog
                    isEdit={false}
                    onSubmit={(data) => handleCreateEmployee(data)}
                />
            </Box>
            {loading ? (
                <div className={styles.loading}>Đang tải...</div>
            ) : (
                <>
                    <Box borderRadius={"8px"} overflow={"hidden"}>
                        <CustomTable<EmployeeType>
                            data={displayData}
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

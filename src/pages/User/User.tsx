import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CustomTable } from "@/components/common/table";
import { Column } from "@/components/common/table/CustomTable";
import SearchInput from "@/components/common/search-input/SearchInput";
import { RootState } from "@/store/store";
import {
    fetchUsers,
    updateUserStatus,
    User as UserType,
} from "@/store/slices/userSlice";
import CustomButton from "@/components/common/button/CustomButton";
import styles from "./User.module.css";
import SimplePagination from "@/components/common/pagination/SimplePagination";
import { format } from "date-fns";
import { Toaster } from "@/components/ui/toaster";
import { Badge, Box } from "@chakra-ui/react";

const User = () => {
    const dispatch = useDispatch();
    const { users, loading, pagination } = useSelector(
        (state: RootState) => state.users
    );

    const [inputValue, setInputValue] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);
    useEffect(() => {
        dispatch(
            fetchUsers({
                page: currentPage,
                perPage: itemsPerPage,
                searchTerm,
            })
        );
    }, [dispatch, currentPage, itemsPerPage, searchTerm]);

    const handleInputChange = (term: string) => {
        setInputValue(term);
    };

    const handleSearch = () => {
        setSearchTerm(inputValue);
        setCurrentPage(1);
    };

    const handleToggleUserStatus = (user: UserType) => {
        // Toggle status between active (1) and inactive (0)
        const newStatus = user.status === "1" || user.status === 1 ? "0" : "1";
        const confirmMessage =
            newStatus === "0"
                ? `Bạn có chắc chắn muốn khóa người dùng "${
                      user.name || user.email
                  }"?`
                : `Bạn có chắc chắn muốn mở khóa người dùng "${
                      user.name || user.email
                  }"?`;

        if (window.confirm(confirmMessage)) {
            dispatch(
                updateUserStatus({
                    userId: user.id,
                    status: newStatus,
                })
            );
        }
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return "";
        try {
            return format(new Date(dateString), "dd/MM/yyyy");
        } catch {
            return dateString;
        }
    };

    const renderStatus = (status: string | number) => {
        const statusValue =
            typeof status === "string" ? status : status.toString();

        if (statusValue === "1") {
            return (
                <Badge
                    px={"0px"}
                    w={"100%"}
                    textAlign={"center"}
                    className={styles.status_active}
                >
                    Hoạt động
                </Badge>
            );
        } else {
            return (
                <Badge
                    w={"100%"}
                    textAlign={"center"}
                    className={styles.status_inactive}
                >
                    Đã khóa
                </Badge>
            );
        }
    };

    const columns: Column<UserType>[] = [
        {
            key: "id" as keyof UserType,
            header: "ID",
            width: "5%",

            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            render: (user) => user.id,
        },
        {
            key: "employee_code" as keyof UserType,
            header: "Mã nhân viên",
            width: "10%",

            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            render: (user) => (
                <span title={user.employee_code || "N/A"}>
                    {user.employee_code || "N/A"}
                </span>
            ),
        },
        {
            key: "name" as keyof UserType,
            header: "Tên",
            width: "15%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            render: (user) => (
                <span title={user.full_name || "N/A"}>
                    {user.full_name || "N/A"}
                </span>
            ),
        },
        {
            key: "gender" as keyof UserType,
            header: "Giới tính",
            width: "7%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            render: (user) => (
                <span title={user.gender || "N/A"}>{user.gender || "N/A"}</span>
            ),
        },
        {
            key: "email" as keyof UserType,
            header: "Email",
            width: "10%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            render: (user) => (
                <span className={styles.user_email} title={user.email}>
                    {user.email}
                </span>
            ),
        },
        {
            key: "phone_number" as keyof UserType,
            header: "Số điện thoại",
            width: "10%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            render: (user) => (
                <span title={user.phone_number || "N/A"}>
                    {user.phone_number || "N/A"}
                </span>
            ),
        },
        {
            key: "address" as keyof UserType,
            header: "Địa chỉ",
            width: "15%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            render: (user) => (
                <span title={user.address || "N/A"}>
                    {user.address || "N/A"}
                </span>
            ),
        },
        {
            key: "birth_date" as keyof UserType,
            header: "Ngày sinh",
            width: "10%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            render: (user) => (
                <span title={formatDate(user.birth_date)}>
                    {formatDate(user.birth_date)}
                </span>
            ),
        },
        {
            key: "status" as keyof UserType,
            header: "Trạng thái",
            width: "10%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            render: (user) => renderStatus(user.status),
        },
        {
            key: "actions" as keyof UserType,
            header: "Thao tác",
            headerTextAlign: "center",
            width: "10%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            render: (user) => {
                const isActive = user.status === "1" || user.status === 1;
                return (
                    <div className={styles.column_actions}>
                        <CustomButton
                            w={"100%"}
                            onClick={() => handleToggleUserStatus(user)}
                            className={`${styles.action_button} ${
                                isActive
                                    ? styles.action_button__danger
                                    : styles.action_button__success
                            }`}
                        >
                            {isActive ? "Khóa" : "Mở khóa"}
                        </CustomButton>
                    </div>
                );
            },
        },
    ];

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

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <Toaster />
            <Box className={styles.user_title}>Quản lý Người dùng</Box>

            <Box className={styles.search_wrapper}>
                <SearchInput
                    value={inputValue}
                    onChange={handleInputChange}
                    onSearch={handleSearch}
                    placeholder="Tìm kiếm người dùng..."
                />
            </Box>

            {loading ? (
                <div className={styles.loading}>Đang tải...</div>
            ) : (
                <>
                    <Box overflow="auto" borderRadius="8px">
                        <CustomTable data={users} columns={columns} />
                    </Box>

                    {users.length > 0 && (
                        <div>
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
                    )}
                </>
            )}
        </div>
    );
};

export default User;

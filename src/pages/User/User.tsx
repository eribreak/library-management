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
import { FaLockOpen, FaLock } from "react-icons/fa6";

const User = () => {
    const dispatch = useDispatch();
    const { users, loading, pagination } = useSelector(
        (state: RootState) => state.users
    );

    const [inputValue, setInputValue] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);

    const handleInputChange = (term: string) => {
        setInputValue(term);
    };

    const handleSearch = () => {
        setSearchTerm(inputValue);
        setCurrentPage(1);
    };

    const handleToggleUserStatus = (user: UserType) => {
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
                    
                    textAlign={"center"}
                    className={styles.status_active}
                >
                    Hoạt động
                </Badge>
            );
        } else {
            return (
                <Badge
                    textAlign={"center"}
                    className={styles.status_inactive}
                >
                    Đã khóa
                </Badge>
            );
        }
    };

    
    const renderId = (user: UserType) => user.id;

    const renderEmployeeCode = (user: UserType) => (
        <span title={user.employee_code || "N/A"}>
            {user.employee_code || "N/A"}
        </span>
    );

    const renderName = (user: UserType) => (
        <span title={user.full_name || "N/A"}>{user.full_name || "N/A"}</span>
    );

    const renderGender = (user: UserType) => (
        <span title={user.gender || "N/A"}>{user.gender || "N/A"}</span>
    );

    const renderEmail = (user: UserType) => (
        <span className={styles.user_email} title={user.email}>
            {user.email}
        </span>
    );

    const renderPhoneNumber = (user: UserType) => (
        <span title={user.phone_number || "N/A"}>
            {user.phone_number || "N/A"}
        </span>
    );

    const renderAddress = (user: UserType) => (
        <span title={user.address || "N/A"}>{user.address || "N/A"}</span>
    );

    const renderBirthDate = (user: UserType) => (
        <span title={formatDate(user.birth_date)}>
            {formatDate(user.birth_date)}
        </span>
    );

    const renderActions = (user: UserType) => {
        const isActive = user.status === "1" || user.status === 1;
        return (
            <div className={styles.column_actions}>
                <CustomButton
                    title="Thay đổi trạng thái"
                    onClick={() => handleToggleUserStatus(user)}
                    className={`${styles.action_button} ${
                        isActive
                            ? styles.action_button__danger
                            : styles.action_button__success
                    }`}
                >
                    {isActive ? <FaLock /> : <FaLockOpen />}
                </CustomButton>
            </div>
        );
    };

    const columns: Column<UserType>[] = [
        {
            key: "id" as keyof UserType,
            header: "ID",
            width: "5%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            render: renderId,
        },
        {
            key: "employee_code" as keyof UserType,
            header: "MNV",
            width: "10%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            render: renderEmployeeCode,
        },
        {
            key: "name" as keyof UserType,
            header: "Tên",
            width: "15%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            render: renderName,
        },
        {
            key: "gender" as keyof UserType,
            header: "Giới tính",
            width: "7%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            render: renderGender,
        },
        {
            key: "email" as keyof UserType,
            header: "Email",
            width: "10%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            render: renderEmail,
        },
        {
            key: "phone_number" as keyof UserType,
            header: "Số điện thoại",
            width: "10%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            render: renderPhoneNumber,
        },
        {
            key: "address" as keyof UserType,
            header: "Địa chỉ",
            width: "15%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            render: renderAddress,
        },
        {
            key: "birth_date" as keyof UserType,
            header: "Ngày sinh",
            width: "10%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            render: renderBirthDate,
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
            cellAlign: "center",
            render: renderActions,
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

    useEffect(() => {
        dispatch(
            fetchUsers({
                page: currentPage,
                perPage: itemsPerPage,
                searchTerm,
            })
        );
    }, [dispatch, currentPage, itemsPerPage, searchTerm]);

    return (
        <div>
            <Toaster />
            <Box className={styles.user_title}>Quản lý Người dùng</Box>

            <Box className={styles.search_wrapper}>
                <SearchInput
                    value={inputValue}
                    onChange={handleInputChange}
                    onSearch={handleSearch}
                    placeholder="Tìm kiếm theo tên, email, MNV..."
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

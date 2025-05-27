import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import CustomTable from "@/components/common/table/CustomTable";
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
import { Badge, Box, Center, Spinner, Table } from "@chakra-ui/react";
import { FaLockOpen, FaLock } from "react-icons/fa6";
import ConfirmDialog from "@/components/common/dialog/ConfirmDialog";
import { Tooltip } from "@/components/ui/tooltip";

const User = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();

    const { users, loading, pagination } = useSelector(
        (state: RootState) => state.users
    );

    const pageFromUrl = searchParams.get("page");
    const searchTermFromUrl = searchParams.get("search");
    const idFromUrl = searchParams.get("id");

    const [inputValue, setInputValue] = useState(searchTermFromUrl || "");
    const [searchTerm, setSearchTerm] = useState(searchTermFromUrl || "");
    const [currentPage, setCurrentPage] = useState(
        pageFromUrl ? parseInt(pageFromUrl) : 1
    );
    const [itemsPerPage] = useState(7);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [userToUpdate, setUserToUpdate] = useState<{
        user: UserType;
        newStatus: string;
    } | null>(null);

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
            fetchUsers({
                page: 1,
                perPage: itemsPerPage,
                searchTerm: "",
            })
        );
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
            fetchUsers({
                page: 1,
                perPage: itemsPerPage,
                searchTerm: inputValue,
            })
        );
    };

    const handleToggleUserStatus = (user: UserType) => {
        const newStatus = user.status === "1" || user.status === 1 ? "0" : "1";

        setUserToUpdate({ user, newStatus });
        setConfirmDialogOpen(true);

        const params = new URLSearchParams(searchParams);
        params.set("id", user.id.toString());
        setSearchParams(params);
    };

    const handleConfirmDialogClose = (confirmed: boolean) => {
        setConfirmDialogOpen(false);

        const params = new URLSearchParams(searchParams);
        params.delete("id");
        setSearchParams(params);

        if (confirmed && userToUpdate) {
            dispatch(
                updateUserStatus({
                    userId: userToUpdate.user.id,
                    status: userToUpdate.newStatus,
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
            return <Badge className={styles.status_active}>Hoạt động</Badge>;
        } else {
            return <Badge className={styles.status_inactive}>Đã khóa</Badge>;
        }
    };

    const renderId = (user: UserType) => user.id;

    const renderEmployeeCode = (user: UserType) => (
        <Tooltip content={user.employee_code || "N/A"}>
            <span>{user.employee_code || "N/A"}</span>
        </Tooltip>
    );

    const renderName = (user: UserType) => (
        <Tooltip content={user.full_name || "N/A"}>
            <span>{user.full_name || "N/A"}</span>
        </Tooltip>
    );

    const renderGender = (user: UserType) => (
        <Tooltip content={user.gender || "N/A"}>
            <span>{user.gender || "N/A"}</span>
        </Tooltip>
    );

    const renderEmail = (user: UserType) => (
        <Tooltip content={user.email}>
            <span className={styles.user_email}>{user.email}</span>
        </Tooltip>
    );

    const renderPhoneNumber = (user: UserType) => (
        <Tooltip content={user.phone_number || "N/A"}>
            <span>{user.phone_number || "N/A"}</span>
        </Tooltip>
    );

    const renderAddress = (user: UserType) => (
        <Tooltip content={user.address || "N/A"}>
            <span>{user.address || "N/A"}</span>
        </Tooltip>
    );

    const renderBirthDate = (user: UserType) => (
        <Tooltip content={formatDate(user.birth_date)}>
            <span>{formatDate(user.birth_date)}</span>
        </Tooltip>
    );

    const renderActions = (user: UserType) => {
        const isActive = user.status === "1" || user.status === 1;
        return (
            <div className={styles.column_actions}>
                <Tooltip content="Thay đổi trạng thái">
                    <CustomButton
                        onClick={() => handleToggleUserStatus(user)}
                        className={`${styles.action_button} ${
                            isActive
                                ? styles.action_button__danger
                                : styles.action_button__success
                        }`}
                    >
                        {isActive ? <FaLock /> : <FaLockOpen />}
                    </CustomButton>
                </Tooltip>
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
            tableColumnHeaderProps: {
                position: "sticky",
                left: 0,
            },
            tableCellProps: {
                position: "sticky",
                left: 0,
                backgroundColor: "white",
            },
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
            cellAlign: "center",
            render: (user) => renderStatus(user.status),
        },
        {
            key: "actions" as keyof UserType,
            header: "Thao tác",
            headerTextAlign: "center",
            width: "10%",
            cellAlign: "center",
            tableColumnHeaderProps: {
                position: "sticky",
                right: 0,
            },
            tableCellProps: {
                position: "sticky",
                right: 0,
                backgroundColor: "white",
            },
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

        const params = new URLSearchParams(searchParams);

        if (page > 1) {
            params.set("page", page.toString());
        } else {
            params.delete("page");
        }

        if (searchTerm) {
            params.set("search", searchTerm);
        }

        setSearchParams(params);
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
                    onClear={handleClearSearch}
                    placeholder="Tìm kiếm theo tên, email, MNV..."
                />
            </Box>

            {loading ? (
                <Center h="400px">
                    <Spinner size="xl" color="var(--primary-color)" />
                </Center>
            ) : (
                <>
                    <Box
                        overflow="auto"
                        borderRadius="8px"
                        boxShadow={"0 0 10px 0 rgba(0, 0, 0, 0.1)"}
                    >
                        <Table.ScrollArea>
                            <CustomTable
                                tableLayout="auto"
                                data={users}
                                columns={columns}
                                className={styles.user_table}
                            />
                        </Table.ScrollArea>
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

            {userToUpdate && (
                <ConfirmDialog
                    isOpen={confirmDialogOpen}
                    onClose={() => handleConfirmDialogClose(false)}
                    onConfirm={() => handleConfirmDialogClose(true)}
                    title="Xác nhận thay đổi trạng thái"
                    description={`Bạn có chắc chắn muốn ${
                        userToUpdate.newStatus === "1" ? "mở khóa" : "khóa"
                    } người dùng "${
                        userToUpdate.user.name || userToUpdate.user.email
                    }"?`}
                />
            )}
        </div>
    );
};

export default User;

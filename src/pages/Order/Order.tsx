import { useEffect, useState } from "react";
import { CustomTable } from "@/components/common/table";
import { Column } from "@/components/common/table/CustomTable";
import SearchInput from "@/components/common/search-input/SearchInput";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
    fetchOrders,
    Order as OrderType,
    selectOrder,
} from "@/store/slices/orderSlice";
import CustomButton from "@/components/common/button/CustomButton";
import styles from "./Order.module.css";
import SimplePagination from "@/components/common/pagination/SimplePagination";
import OrderDetailDialog from "@/components/common/dialog/OrderDetailDialog";
import { format } from "date-fns";
import { Badge, Box } from "@chakra-ui/react";
import { Toaster } from "@/components/ui/toaster";

const Order = () => {
    const dispatch = useDispatch();
    const { orders, loading, pagination } = useSelector(
        (state: RootState) => state.orders
    );

    const [inputValue, setInputValue] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);

    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

    useEffect(() => {
        dispatch(
            fetchOrders({
                page: currentPage,
                perPage: itemsPerPage,
                searchTerm,
            })
        );
    }, [dispatch, searchTerm, currentPage, itemsPerPage]);

    const handleInputChange = (term: string) => {
        setInputValue(term);
    };

    const handleSearch = () => {
        setSearchTerm(inputValue);
        setCurrentPage(1);
    };

    const handleViewOrderDetails = (order: OrderType) => {
        setSelectedOrderId(order.id);
        dispatch(selectOrder(order.id));
        setIsDetailDialogOpen(true);
    };

    const closeDetailDialog = () => {
        setIsDetailDialogOpen(false);
        setSelectedOrderId(null);
    };

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "dd/MM/yyyy HH:mm");
        } catch {
            return dateString;
        }
    };

    const renderStatus = (status: string) => {
        switch (status) {
            case "0":
                return (
                    <Badge className={styles.status_pending}>Đang mượn</Badge>
                );
            case "1":
                return (
                    <Badge className={styles.status_completed}>
                        Hoàn thành
                    </Badge>
                );
            case "2":
                return <Badge className={styles.status_overdue}>Quá hạn</Badge>;
            case "3":
                return <Badge className={styles.status_issue}>Có vấn đề</Badge>;
            default:
                return <Badge colorPalette={"green"}>{status}</Badge>;
        }
    };

    const columns: Column<OrderType>[] = [
        {
            key: "id" as keyof OrderType,
            header: "ID",
            width: "10%",
            render: (order) => <div>{order.id}</div>,
        },
        {
            key: "full_name" as keyof OrderType,
            header: "Người mượn",
            width: "20%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            render: (order) => <div>{order.full_name}</div>,
        },
        {
            key: "employee_code" as keyof OrderType,
            header: "Mã nhân viên",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width: "20%",
            render: (order) => (
                <div className="font-medium text-blue-600">
                    {order.employee_code}
                </div>
            ),
        },
        {
            key: "created_at" as keyof OrderType,
            header: "Ngày tạo",
            width: "20%",
            render: (order) => <div>{formatDate(order.created_at)}</div>,
        },
        {
            key: "status" as keyof OrderType,
            header: "Trạng thái",
            cellAlign: "center",
            headerTextAlign: "center",
            render: (order) => renderStatus(order.status),
        },
        {
            key: "details" as keyof OrderType,
            header: "Thao tác",
            headerTextAlign: "center",
            render: (order) => (
                <Box justifyContent="center" display={"flex"}>
                    <CustomButton
                        onClick={() => handleViewOrderDetails(order)}
                        className={`${styles.action_button} ${styles.action_button__primary}`}
                        _hover={{
                            backgroundColor: "var(--primary-color-dark)",
                            color: "#fff",
                        }}
                    >
                        Xem chi tiết
                    </CustomButton>
                </Box>
            ),
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
            <Box className={styles.order_title}>Quản lý Đơn mượn</Box>
            <Box className={styles.search_wrapper}>
                <SearchInput
                    value={inputValue}
                    onChange={handleInputChange}
                    onSearch={handleSearch}
                    placeholder="Tìm kiếm đơn hàng..."
                />
            </Box>

            {loading ? (
                <div className={styles.loading}>Đang tải...</div>
            ) : (
                <>
                    <Box borderRadius={"8px"} overflow={"hidden"}>
                        <CustomTable data={orders} columns={columns} />
                    </Box>

                    {orders.length > 0 && (
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
                    )}
                </>
            )}

            {selectedOrderId && (
                <OrderDetailDialog
                    orderId={selectedOrderId}
                    isOpen={isDetailDialogOpen}
                    onClose={closeDetailDialog}
                />
            )}
        </div>
    );
};

export default Order;

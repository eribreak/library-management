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
import {
    Badge,
    Box,
    Popover,
    Button,
    Stack,
    Input,
    Flex,
    Portal,
    Text,
} from "@chakra-ui/react";
import { Toaster } from "@/components/ui/toaster";
import { TbFilter, TbFilterCancel, TbFilterCheck } from "react-icons/tb";

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
    const [filterStatus, setFilterStatus] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isFilterApplied, setIsFilterApplied] = useState(false);

    const [activeFilters, setActiveFilters] = useState<{
        status?: string;
        startDate?: string;
        endDate?: string;
    }>({});

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
            case "Đang mượn":
                return (
                    <Badge colorPalette={"gray"}>Đang mượn</Badge>
                );
            case "Đã trả":
                return (
                    <Badge colorPalette={"green"}>
                        Đã trả
                    </Badge>
                );
            case "Quá hạn":
                return <Badge colorPalette={"red"}>Quá hạn</Badge>;
            case "Mất":
                return <Badge color={"darkgray"}>Mất</Badge>;
            default:
                return <Badge colorPalette="green">{status}</Badge>;
        }
    };

    const handleApplyFilter = () => {
        const newFilters = {
            status: filterStatus || undefined,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
        };

        setActiveFilters(newFilters);
        setIsFilterApplied(true);
        setCurrentPage(1);
    };

    const handleResetFilter = () => {
        setFilterStatus("");
        setStartDate("");
        setEndDate("");
        setActiveFilters({});
        setIsFilterApplied(false);
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

    useEffect(() => {
        dispatch(
            fetchOrders({
                page: currentPage,
                perPage: itemsPerPage,
                searchTerm,
                status: activeFilters.status,
                startDate: activeFilters.startDate,
                endDate: activeFilters.endDate,
            })
        );
    }, [dispatch, searchTerm, currentPage, itemsPerPage, activeFilters]);

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

            <Flex mb={6} align="center">
                <Box>
                    <SearchInput
                        value={inputValue}
                        onChange={handleInputChange}
                        onSearch={handleSearch}
                        placeholder="Tìm kiếm đơn hàng..."
                    />
                </Box>
                <Popover.Root positioning={{ placement: "left" }}>
                    <Popover.Trigger>
                        <CustomButton
                            bg={
                                isFilterApplied
                                    ? "var(--primary-color)"
                                    : "var(--color-success)"
                            }
                        >
                            <TbFilter />
                        </CustomButton>
                    </Popover.Trigger>
                    <Portal>
                        <Popover.Positioner>
                            <Popover.Content width={"fit-content"}>
                                <Popover.Arrow />
                                <Popover.CloseTrigger />
                                <Popover.Body>
                                    <Stack gap={4} direction={"row"} alignItems={"flex-end"}>
                                        <div>
                                            <Text
                                                fontWeight={
                                                    "var(--font-weight-bold)"
                                                }
                                                marginBottom={"5px"}
                                            >
                                                Trạng thái
                                            </Text>
                                            <select
                                                className={styles.status_select}
                                                value={filterStatus}
                                                defaultValue={""}
                                                onChange={(e) =>
                                                    setFilterStatus(
                                                        e.target.value
                                                    )
                                                }
                                            >   
                                                <option value="">
                                                    Chọn trạng thái
                                                </option>
                                                <option value="0">
                                                    Đang mượn
                                                </option>
                                                <option value="1">
                                                    Hoàn thành
                                                </option>
                                                <option value="2">
                                                    Quá hạn
                                                </option>
                                                <option value="3">Mất</option>
                                            </select>
                                        </div>

                                        <div>
                                            <Text
                                                fontWeight={
                                                    "var(--font-weight-bold)"
                                                }
                                                marginBottom={"5px"}
                                            >
                                                Từ ngày
                                            </Text>
                                            <Input
                                                maxH={"30px"}
                                                type="date"
                                                value={startDate}
                                                borderRadius={"var(--border-radius-medium)"}
                                                onChange={(e) => {
                                                    setStartDate(
                                                        e.target.value
                                                    );
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <Text
                                                fontWeight={
                                                    "var(--font-weight-bold)"
                                                }
                                                marginBottom={"5px"}
                                            >
                                                Đến ngày
                                            </Text>
                                            <Input
                                                maxH={"30px"}
                                                type="date"
                                                value={endDate}
                                                borderRadius={"var(--border-radius-medium)"}
                                                onChange={(e) =>
                                                    setEndDate(e.target.value)
                                                }
                                            />
                                        </div>

                                        <Stack
                                            direction="row"
                                            gap={4}
                                            justifyContent="flex-end"
                                        >
                                            <Button
                                                variant="outline"
                                                onClick={handleResetFilter}
                                                title="Xóa bộ lọc"
                                            >
                                                <TbFilterCancel />
                                            </Button>
                                            <Button
                                                title="Áp dụng bộ lọc"
                                                colorScheme="blue"
                                                onClick={handleApplyFilter}
                                            >
                                                <TbFilterCheck />
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </Popover.Body>
                            </Popover.Content>
                        </Popover.Positioner>
                    </Portal>
                </Popover.Root>
            </Flex>

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

import { useEffect, useState, useRef } from "react";
import CustomTable from "@/components/common/table/CustomTable";
import { Column } from "@/components/common/table/CustomTable";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    Badge,
    Box,
    Button,
    Stack,
    Flex,
    Center,
    Spinner,
} from "@chakra-ui/react";
import { Toaster } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";
import { RiResetLeftLine } from "react-icons/ri";
import { IoSearchSharp } from "react-icons/io5";

const Order = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const { orders, loading, pagination } = useSelector(
        (state: RootState) => state.orders
    );

    const pageFromUrl = searchParams.get("page");
    const searchTermFromUrl = searchParams.get("search");
    const statusFromUrl = searchParams.get("status");
    const startDateFromUrl = searchParams.get("startDate");
    const endDateFromUrl = searchParams.get("endDate");
    const idFromUrl = searchParams.get("id");

    const [inputValue, setInputValue] = useState(searchTermFromUrl || "");
    const [searchTerm, setSearchTerm] = useState(searchTermFromUrl || "");
    const [filterStatus, setFilterStatus] = useState(statusFromUrl || "");
    const [startDate, setStartDate] = useState(startDateFromUrl || "");
    const [endDate, setEndDate] = useState(endDateFromUrl || "");
    const [currentPage, setCurrentPage] = useState(
        pageFromUrl ? parseInt(pageFromUrl) : 1
    );
    const [itemsPerPage] = useState(7);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [isFilterApplied, setIsFilterApplied] = useState(
        !!(statusFromUrl || startDateFromUrl || endDateFromUrl)
    );

    const dialogOpenRef = useRef(isDetailDialogOpen);

    const [activeFilters, setActiveFilters] = useState<{
        status?: string;
        startDate?: string;
        endDate?: string;
    }>({});

    const handleInputChange = (term: string) => {
        setInputValue(term);
    };

    const handleViewOrderDetails = (order: OrderType) => {
        setSelectedOrderId(order.id);
        dispatch(selectOrder(order.id));
        setIsDetailDialogOpen(true);

        const params = new URLSearchParams(searchParams);
        params.set("id", order.id.toString());
        setSearchParams(params);
    };

    const closeDetailDialog = () => {
        setIsDetailDialogOpen(false);
        setSelectedOrderId(null);

        const params = new URLSearchParams(searchParams);
        params.delete("id");
        setSearchParams(params);
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
                return <Badge colorPalette={"gray"}>Đang mượn</Badge>;
            case "Đã trả":
                return <Badge colorPalette={"green"}>Đã trả</Badge>;
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
            endDate: endDate
                ? format(
                      new Date(
                          new Date(endDate).setDate(
                              new Date(endDate).getDate() + 1
                          )
                      ),
                      "yyyy-MM-dd"
                  )
                : undefined,
        };

        setActiveFilters(newFilters);
        setIsFilterApplied(true);
        setCurrentPage(1);
        setSearchTerm(inputValue);

        const params = new URLSearchParams(searchParams);

        if (filterStatus) {
            params.set("status", filterStatus);
        } else {
            params.delete("status");
        }

        if (startDate) {
            params.set("startDate", startDate);
        } else {
            params.delete("startDate");
        }

        if (endDate) {
            params.set("endDate", endDate);
        } else {
            params.delete("endDate");
        }

        if (inputValue) {
            params.set("search", inputValue);
        } else {
            params.delete("search");
        }

        if (!idFromUrl && isDetailDialogOpen && selectedOrderId) {
            params.set("id", selectedOrderId.toString());
        }

        setSearchParams(params);
    };

    const handleResetFilter = () => {
        setFilterStatus("");
        setStartDate("");
        setEndDate("");
        setActiveFilters({});
        setIsFilterApplied(false);
        setInputValue("");
        setSearchTerm("");

        const params = new URLSearchParams();
        if (currentPage > 1) {
            params.set("page", currentPage.toString());
        }
        if (idFromUrl && isDetailDialogOpen) {
            params.set("id", idFromUrl);
        }
        setSearchParams(params);
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

        const params = new URLSearchParams(searchParams);

        if (page > 1) {
            params.set("page", page.toString());
        } else {
            params.delete("page");
        }

        setSearchParams(params);
    };

    useEffect(() => {
        if (isDetailDialogOpen && !dialogOpenRef.current && selectedOrderId) {
            const params = new URLSearchParams(searchParams);
            params.set("id", selectedOrderId.toString());
            setSearchParams(params);
        }

        if (!isDetailDialogOpen && dialogOpenRef.current) {
            const params = new URLSearchParams(searchParams);
            params.delete("id");
            setSearchParams(params);
        }

        dialogOpenRef.current = isDetailDialogOpen;
    }, [isDetailDialogOpen, selectedOrderId, searchParams, setSearchParams]);

    return (
        <div>
            <Toaster />
            <Box className={styles.order_title}>Quản lý Đơn mượn</Box>

            <Flex mb={6} align="center" flexWrap="wrap" gap={4}>
                <Box
                    display={"flex"}
                    alignItems={"flex-start"}
                    flexWrap="wrap"
                    gap={4}
                    width="100%"
                    flexDirection={"column"}
                >
                    <Stack
                        direction="row"
                        gap={2}
                        alignItems="flex-end"
                        flexWrap="wrap"
                    >
                        <div className={styles.filter_section}>
                            <Stack
                                direction="row"
                                gap={3}
                                flexWrap="wrap"
                                alignItems="center"
                            >
                                <div className={styles.filter_group}>
                                    <input
                                        className={styles.filter_select}
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) =>
                                            handleInputChange(e.target.value)
                                        }
                                        placeholder="Tìm tên người, MNV..."
                                    />
                                </div>
                                <div className={styles.filter_group}>
                                    <select
                                        className={styles.filter_select}
                                        value={filterStatus}
                                        onChange={(e) =>
                                            setFilterStatus(e.target.value)
                                        }
                                    >
                                        <option value="">
                                            Chọn trạng thái
                                        </option>
                                        <option value="0">Đang mượn</option>
                                        <option value="1">Hoàn thành</option>
                                        <option value="2">Quá hạn</option>
                                        <option value="3">Mất</option>
                                    </select>
                                </div>

                                <div className={styles.filter_group}>
                                    <DatePicker
                                        selected={
                                            startDate
                                                ? new Date(startDate)
                                                : null
                                        }
                                        onChange={(date) =>
                                            setStartDate(
                                                date
                                                    ? format(date, "yyyy-MM-dd")
                                                    : ""
                                            )
                                        }
                                        dateFormat="dd/MM/yyyy"
                                        className={styles.filter_input}
                                        placeholderText="Chọn ngày"
                                        onKeyDown={(e) => {
                                            e.preventDefault();
                                        }}
                                        isClearable
                                    />
                                </div>

                                <div className={styles.filter_group}>
                                    <DatePicker
                                        selected={
                                            endDate ? new Date(endDate) : null
                                        }
                                        onChange={(date) =>
                                            setEndDate(
                                                date
                                                    ? format(date, "yyyy-MM-dd")
                                                    : ""
                                            )
                                        }
                                        popperPlacement="bottom-start"
                                        dateFormat="dd/MM/yyyy"
                                        className={styles.filter_input}
                                        placeholderText="Chọn ngày"
                                        isClearable
                                        onKeyDown={(e) => {
                                            e.preventDefault();
                                        }}
                                        minDate={
                                            startDate
                                                ? new Date(startDate)
                                                : undefined
                                        }
                                    />
                                </div>

                                <div className={styles.filter_buttons}>
                                    <Button
                                        variant="outline"
                                        onClick={handleResetFilter}
                                        colorScheme={
                                            isFilterApplied ? "red" : "gray"
                                        }
                                        className={
                                            styles.filter_button +
                                            " " +
                                            styles.filter_button_reset
                                        }
                                    >
                                        <Tooltip content="Đặt lại bộ lọc">
                                            <Box
                                                display={"flex"}
                                                alignItems={"center"}
                                                gap={2}
                                            >
                                                <RiResetLeftLine />{" "}
                                                <div>Đặt lại</div>
                                            </Box>
                                        </Tooltip>
                                    </Button>
                                    <Button
                                        bg={"green.500"}
                                        border={"none"}
                                        onClick={handleApplyFilter}
                                        className={
                                            styles.filter_button +
                                            " " +
                                            styles.filter_button_apply
                                        }
                                    >
                                        <Tooltip content="Áp dụng bộ lọc">
                                            <Box
                                                display={"flex"}
                                                alignItems={"center"}
                                                gap={2}
                                            >
                                                <IoSearchSharp />
                                                <div>Lọc</div>
                                            </Box>
                                        </Tooltip>
                                    </Button>
                                </div>
                            </Stack>
                        </div>
                    </Stack>
                </Box>
            </Flex>

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
                        <CustomTable
                            tableLayout="fixed"
                            data={orders}
                            columns={columns}
                        />
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

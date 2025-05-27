import { useEffect, useState, ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import CustomTable from "@/components/common/table/CustomTable";
import { Column } from "@/components/common/table/CustomTable";
import SearchInput from "@/components/common/search-input/SearchInput";
import { RootState } from "@/store/store";
import {
    fetchReviews,
    updateReviewStatus,
    Review as ReviewType,
} from "@/store/slices/reviewSlice";
import styles from "./Review.module.css";
import SimplePagination from "@/components/common/pagination/SimplePagination";
import { Toaster } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";
import { Box, Center, Spinner } from "@chakra-ui/react";

const Review = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const { reviews, loading, pagination } = useSelector(
        (state: RootState) => state.reviews
    );

    const pageFromUrl = searchParams.get("page");
    const searchTermFromUrl = searchParams.get("search");
    const statusFromUrl = searchParams.get("status");

    const [searchInput, setSearchInput] = useState(searchTermFromUrl || "");
    const [searchTerm, setSearchTerm] = useState(searchTermFromUrl || "");
    const [filterStatus, setFilterStatus] = useState<string>(
        statusFromUrl || ""
    );
    const [currentPage, setCurrentPage] = useState(
        pageFromUrl ? parseInt(pageFromUrl) : 1
    );
    const [itemsPerPage] = useState(7);

    const handleInputChange = (term: string) => {
        setSearchInput(term);
    };

    const handleClearSearch = () => {
        setSearchInput("");
        setSearchTerm("");
        setCurrentPage(1);

        const params = new URLSearchParams();
        if (filterStatus) {
            params.set("status", filterStatus);
        }
        setSearchParams(params);

        dispatch(
            fetchReviews({
                page: 1,
                perPage: itemsPerPage,
                statusParam: filterStatus,
                searchTerm: "",
            })
        );
    };

    const handleSearch = () => {
        setSearchTerm(searchInput);
        setCurrentPage(1);

        const params = new URLSearchParams();
        if (searchInput) {
            params.set("search", searchInput);
        }
        if (filterStatus) {
            params.set("status", filterStatus);
        }
        setSearchParams(params);
    };

    const handleStatusFilterChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const newStatus = e.target.value;
        setFilterStatus(newStatus);
        setCurrentPage(1);

        const params = new URLSearchParams(searchParams);
        if (newStatus) {
            params.set("status", newStatus);
        } else {
            params.delete("status");
        }
        if (searchTerm) {
            params.set("search", searchTerm);
        }
        setSearchParams(params);
    };

    const getNumericStatus = (status: string | number): number => {
        if (status === "Pending" || status === 0 || status === "0") {
            return 0;
        } else if (status === "Approved" || status === 1 || status === "1") {
            return 1;
        } else {
            return 2;
        }
    };

    const handleReviewStatusChange = (
        reviewId: number,
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const newStatus = e.target.value;
        const currentReview = reviews.find((review) => review.id === reviewId);

        if (currentReview) {
            const currentStatusValue = getNumericStatus(currentReview.status);
            const newStatusValue = parseInt(newStatus);

            if (!(currentStatusValue > 0 && newStatusValue === 0)) {
                dispatch(updateReviewStatus({ reviewId, status: newStatus }));
            }
        }
    };

    const renderStarRating = (stars: number) => (
        <Tooltip content={`${stars} sao`}>
            <div className={styles.star_rating}>{stars}</div>
        </Tooltip>
    );

    const renderReviewComment = (review: ReviewType) => (
        <Tooltip content={review.comment || "N/A"}>
            <div className={styles.review_comment}>
                {review.comment || "N/A"}
            </div>
        </Tooltip>
    );

    const renderReviewID = (review: ReviewType) => (
        <Tooltip content={`ID: ${review.id}`}>
            <div className={styles.review_id}>{review.id || "N/A"}</div>
        </Tooltip>
    );

    const renderReviewBook = (review: ReviewType) => (
        <Tooltip content={review.book?.title || `Sách #${review.book_id}`}>
            <div className={styles.review_book}>
                {review.book?.title || `Sách #${review.book_id}`}
            </div>
        </Tooltip>
    );

    const renderReviewUser = (review: ReviewType) => (
        <Tooltip
            content={
                review.user?.full_name || review.user?.email || "Anonymous"
            }
        >
            <div className={styles.review_user}>
                {review.user?.full_name || review.user?.email || "Anonymous"}
            </div>
        </Tooltip>
    );

    const renderReviewStatus = (review: ReviewType) => {
        const getStatusValue = (reviewStatus: string | number): string => {
            if (reviewStatus === "Pending" || reviewStatus === 0) {
                return "0";
            } else if (reviewStatus === "Approved" || reviewStatus === 1) {
                return "1";
            } else {
                return "2";
            }
        };

        const status = getStatusValue(review.status);
        const statusValue = parseInt(status);

        const getOptionsForStatus = (currentStatus: number): ReactNode[] => {
            const options = [
                <option key="0" value="0" disabled={currentStatus > 0}>
                    Chờ duyệt
                </option>,
                <option key="1" value="1">
                    Duyệt
                </option>,
                <option key="2" value="2">
                    Từ chối
                </option>,
            ];

            return options;
        };

        return (
            <Tooltip
                content={
                    statusValue === 0
                        ? "Chờ duyệt"
                        : statusValue === 1
                        ? "Đã duyệt"
                        : "Đã từ chối"
                }
            >
                <div className={styles.select_wrapper}>
                    <select
                        value={status}
                        onChange={(e) => handleReviewStatusChange(review.id, e)}
                        className={styles.action_select}
                        
                    >
                        {getOptionsForStatus(statusValue)}
                    </select>
                </div>
            </Tooltip>
        );
    };

    const getRowClassName = (review: ReviewType): string => {
        let status;

        if (typeof review.status === "string") {
            if (review.status.toLowerCase() === "pending") status = 0;
            else if (review.status.toLowerCase() === "approved") status = 1;
            else if (review.status.toLowerCase() === "rejected") status = 2;
            else if (review.status === "0") status = 0;
            else if (review.status === "1") status = 1;
            else if (review.status === "2") status = 2;
            else status = parseInt(review.status);
        } else if (typeof review.status === "number") {
            status = review.status;
        } else {
            return "";
        }

        return status === 2 ? styles.rejected_row : "";
    };

    const columns: Column<ReviewType>[] = [
        {
            key: "id" as keyof ReviewType,
            header: "ID",
            width: "8%",
            render: (review) => renderReviewID(review),
        },
        {
            key: "user" as keyof ReviewType,
            header: "Người đánh giá",
            width: "15%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            render: (review) => renderReviewUser(review),
        },
        {
            key: "book" as keyof ReviewType,
            header: "Sách được đánh giá",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width: "15%",
            render: (review) => renderReviewBook(review),
        },
        {
            key: "star" as keyof ReviewType,
            header: "Số sao",
            width: "10%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            render: (review) => renderStarRating(review.star),
        },
        {
            key: "comment" as keyof ReviewType,
            header: "Lời đánh giá",
            width: "43%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            render: (review) => renderReviewComment(review),
        },
        {
            key: "status" as keyof ReviewType,
            width: "20%",
            header: "Trạng thái",
            render: (review) => renderReviewStatus(review),
        },
    ];

    useEffect(() => {
        dispatch(
            fetchReviews({
                page: currentPage,
                perPage: itemsPerPage,
                statusParam: filterStatus,
                searchTerm: searchTerm,
            })
        );
    }, [dispatch, filterStatus, searchTerm, currentPage, itemsPerPage]);

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

    return (
        <div>
            <Toaster />
            <Box className={styles.review_title}>Quản lý Đánh giá</Box>
            <div className={styles.search_wrapper}>
                <SearchInput
                    value={searchInput}
                    onChange={handleInputChange}
                    onSearch={handleSearch}
                    onClear={handleClearSearch}
                    placeholder="Tìm theo tên người, sách, đánh giá..."
                />

                <div className={styles.filters}>
                    <div>
                        <select
                            className={styles.filter_select}
                            value={filterStatus}
                            onChange={handleStatusFilterChange}
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="0">Chờ duyệt</option>
                            <option value="1">Đã duyệt</option>
                            <option value="2">Đã từ chối</option>
                        </select>
                    </div>
                </div>
            </div>

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
                            data={reviews}
                            columns={columns}
                            getRowClassName={getRowClassName}
                        />
                    </Box>

                    {reviews.length > 0 && (
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

export default Review;

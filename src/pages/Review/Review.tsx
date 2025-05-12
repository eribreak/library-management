import { useEffect, useState, ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CustomTable } from "@/components/common/table";
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
import { Box } from "@chakra-ui/react";

const Review = () => {
    const dispatch = useDispatch();
    const { reviews, loading, pagination } = useSelector(
        (state: RootState) => state.reviews
    );

    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);

    const handleInputChange = (term: string) => {
        setSearchInput(term);
    };

    const handleSearch = () => {
        setSearchTerm(searchInput);
        setCurrentPage(1);
    };

    const handleStatusFilterChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setFilterStatus(e.target.value);
        setCurrentPage(1);
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

            
            if (newStatusValue >= currentStatusValue || newStatusValue === 2) {
                dispatch(updateReviewStatus({ reviewId, status: newStatus }));
            }
        } else {
            dispatch(updateReviewStatus({ reviewId, status: newStatus }));
        }

    };

    const renderStarRating = (stars: number) => {
        return <div className={styles.star_rating}>{stars}</div>;
    };

    const renderReviewComment = (review: ReviewType) => (
        <div className={styles.review_comment}>{review.comment || "N/A"}</div>
    );

    const renderReviewID = (review: ReviewType) => (
        <div className={styles.review_id}>{review.id || "N/A"}</div>
    );

    const renderReviewBook = (review: ReviewType) => (
        <div className={styles.review_book}>
            {review.book?.title || `Sách #${review.book_id}`}
        </div>
    );
    const renderReviewUser = (review: ReviewType) => (
        <div className={styles.review_user}>
            {review.user?.full_name || review.user?.email || "Anonymous"}
        </div>
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
        const isRejected = status === "2";
        const statusValue = parseInt(status);

        
        const getOptionsForStatus = (currentStatus: number): ReactNode[] => {
            const options = [
                <option key="0" value="0" disabled={currentStatus > 0}>
                    Chờ duyệt
                </option>,
                <option key="1" value="1" disabled={currentStatus > 1}>
                    Duyệt
                </option>,
                <option key="2" value="2">
                    Từ chối
                </option>,
            ];

            return options;
        };

        return (
            <div className={styles.select_wrapper}>
                <select
                    
                    value={status}
                    onChange={(e) => handleReviewStatusChange(review.id, e)}
                    disabled={isRejected}
                    className={styles.action_select}
                    title={
                        isRejected
                            ? "Đánh giá đã bị từ chối không thể thay đổi"
                            : statusValue === 1
                            ? "Đã duyệt, chỉ có thể từ chối"
                            : "Chọn trạng thái đánh giá"
                    }
                >
                    {getOptionsForStatus(statusValue)}
                </select>
            </div>
        );
    };

    const columns: Column<ReviewType>[] = [
        {
            key: "id" as keyof ReviewType,
            header: "ID",
            width: "5%",
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
            width: "7%",
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
                    placeholder="Tìm kiếm đánh giá..."
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
                <div className={styles.loading}>Đang tải...</div>
            ) : (
                <>
                    <Box borderRadius={"8px"} overflow={"hidden"}>
                        <CustomTable data={reviews} columns={columns} />
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

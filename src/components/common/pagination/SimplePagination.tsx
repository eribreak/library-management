import React from "react";
import styles from "./SimplePagination.module.css";
import CustomButton from "../button/CustomButton";
import previousIcon from "@/assets/images/previous.svg";
import nextIcon from "@/assets/images/next.svg";

interface ItemsInfo {
    startIndex: number;
    endIndex: number;
    totalItems: number;
}

interface SimplePaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    itemsInfo: ItemsInfo;
}

const SimplePagination: React.FC<SimplePaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    itemsInfo,
}) => {
    const { startIndex, endIndex, totalItems } = itemsInfo;

    const handlePrevPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };
    
    const getPageNumbers = () => {
        const pages = [];

        
        pages.push(1);

        
        const startPage = Math.max(2, currentPage - 2);
        const endPage = Math.min(totalPages - 1, currentPage + 2);

        
        if (startPage > 2) {
            pages.push("ellipsis1");
        }

        
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        
        if (endPage < totalPages - 1) {
            pages.push("ellipsis2");
        }

        
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className={styles["pagination-container"]}>
            <div className={styles["pagination-info"]}>
                {totalItems > 0 ? (
                    <span>
                        Hiện từ {startIndex} đến {endIndex} trên tổng số
                        lượng: {totalItems} (Trang {currentPage}/{totalPages})
                    </span>
                ) : (
                    <span>Không có</span>
                )}
            </div>

            {totalPages > 0 && (
                <div className={styles["pagination-controls"]}>

                    <CustomButton
                        className={`${styles["pagination-button"]} ${
                            styles["pagination-button-left"]
                        } ${currentPage === 1 ? styles["disabled"] : ""}`}
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                    >
                        <img src={previousIcon} alt="Previous" />
                    </CustomButton>

                    <div className={styles["page-numbers"]}>
                        {getPageNumbers().map((page, index) => {
                            if (page === "ellipsis1" || page === "ellipsis2") {
                                return (
                                    <span
                                        key={`${page}-${index}`}
                                        className={styles["ellipsis"]}
                                    >
                                        ...
                                    </span>
                                );
                            }

                            return (
                                <CustomButton
                                    key={`page-${page}`}
                                    className={`${styles["page-number"]} ${
                                        currentPage === page
                                            ? styles["active"]
                                            : ""
                                    }`}
                                    onClick={() => onPageChange(Number(page))}
                                >
                                    {page}
                                </CustomButton>
                            );
                        })}
                    </div>

                    <CustomButton
                        className={`${styles["pagination-button"]} ${
                            styles["pagination-button-right"]
                        } ${
                            currentPage === totalPages || totalPages === 0
                                ? styles["disabled"]
                                : ""
                        }`}
                        onClick={handleNextPage}
                        disabled={
                            currentPage === totalPages || totalPages === 0
                        }
                    >
                        <img src={nextIcon} alt="Next" />
                    </CustomButton>

                   
                </div>
            )}
        </div>
    );
};

export default SimplePagination;

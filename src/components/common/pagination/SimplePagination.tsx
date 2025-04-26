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

    return (
        <div className={styles["pagination-container"]}>
            <div className={styles["pagination-info"]}>
                {totalItems > 0 ? (
                    <span>
                        Hiện từ {startIndex} đến {endIndex} của trên tổng số
                        lượng: {totalItems}
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

import { useState, useEffect } from "react";
import CustomTable from "@/components/common/table/CustomTable";
import { Column } from "@/components/common/table/CustomTable";
import { OrderDetail as OrderDetailType } from "@/store/slices/orderSlice";
import styles from "./OrderDetailTable.module.css";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface OrderDetailTableProps {
    details: OrderDetailType[];
    onUpdateDetails: (updatedDetails: OrderDetailType[]) => void;
    onSave?: () => void;
}

const STATUS_PRIORITY: Record<string, number> = {
    "0": 0,
    "2": 1,
    "3": 2,
    "1": 3,
};

const OrderDetailTable: React.FC<OrderDetailTableProps> = ({
    details,
    onUpdateDetails,
    onSave,
}) => {
    const [localDetails, setLocalDetails] = useState<OrderDetailType[]>([]);
    const [initialDetails, setInitialDetails] = useState<OrderDetailType[]>([]);
    const [savedDetails, setSavedDetails] = useState<OrderDetailType[]>([]);

    const today = new Date();
    const oneWeekBefore = new Date(today);
    oneWeekBefore.setDate(today.getDate() - 7);
    const oneWeekAfter = new Date(today);
    oneWeekAfter.setDate(today.getDate() + 7);

    const minDate = oneWeekBefore.toISOString().split("T")[0];
    const maxDate = oneWeekAfter.toISOString().split("T")[0];

    const handleStatusChange = (id: number, newStatus: string) => {
        const updatedDetails = localDetails.map((detail) => {
            if (detail.id === id) {
                const isReturnedStatus =
                    newStatus === "1" ||
                    newStatus === 1 ||
                    newStatus === "Đã trả";
                const return_date_real = isReturnedStatus
                    ? detail.return_date_real ||
                      new Date().toISOString().split("T")[0]
                    : detail.return_date_real;

                return { ...detail, status: newStatus, return_date_real };
            }
            return detail;
        });

        setLocalDetails(updatedDetails);
        onUpdateDetails(updatedDetails);
    };

    const isStatusDisabled = (
        bookId: number,
        bookStatus: string,
        optionStatus: string
    ) => {
        const initialDetail = initialDetails.find(
            (detail) => detail.id === bookId
        );
        if (!initialDetail) return false;

        const currentDetail = localDetails.find(
            (detail) => detail.id === bookId
        );
        if (!currentDetail) return false;

        const savedDetail = savedDetails.find((detail) => detail.id === bookId);

        const baseStatus = savedDetail
            ? savedDetail.status
            : initialDetail.status;
        const basePriority = STATUS_PRIORITY[baseStatus];
        const optionPriority = STATUS_PRIORITY[optionStatus];

        if (optionStatus === initialDetail.status) {
            return false;
        }

        return optionPriority < basePriority;
    };

    const handleReturnDateChange = (id: number, newDate: string) => {
        const updatedDetails = localDetails.map((detail) => {
            if (detail.id === id) {
                return { ...detail, return_date_real: newDate };
            }
            return detail;
        });

        setLocalDetails(updatedDetails);
        onUpdateDetails(updatedDetails);
    };

    const renderImage = (book: OrderDetailType) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <img
                src={book.image_url}
                alt="Book Cover"
                style={{
                    width: "60px",
                    height: "85px",
                    objectFit: "cover",
                    borderRadius: "4px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
            />
        </div>
    );

    const renderTitle = (book: OrderDetailType) => (
        <div
            style={{
                fontWeight: "500",
                color: "#1f2937",
                maxWidth: "250px",
                overflow: "hidden",
                textOverflow: "ellipsis",
            }}
        >
            {book.title}
        </div>
    );

    const renderReturnDateDue = (book: OrderDetailType) => {
        let formatted = book.return_date_due;
        if (book.return_date_due) {
            try {
                formatted = format(
                    new Date(book.return_date_due),
                    "dd/MM/yyyy"
                );
            } catch {
                formatted = book.return_date_due;
            }
        }
        return (
            <div
                style={{
                    fontWeight: "500",
                    color: "var(--font-color)",
                }}
            >
                {formatted}
            </div>
        );
    };

    const renderReturnDateReal = (book: OrderDetailType) => {
        const isReturnedStatus =
            book.status === "1" ||
            book.status === 1 ||
            book.status === "Đã trả";

        let formatted = book.return_date_real;
        if (book.return_date_real) {
            try {
                formatted = format(
                    new Date(book.return_date_real),
                    "dd/MM/yyyy"
                );
            } catch {
                formatted = book.return_date_real;
            }
        }

        return (
            <div
                style={{
                    fontWeight: "500",
                    color: isReturnedStatus
                        ? "var(--color-success)"
                        : "#6b7280",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                {isReturnedStatus ? (
                    <>
                        <DatePicker
                            selected={
                                book.return_date_real
                                    ? new Date(book.return_date_real)
                                    : null
                            }
                            onChange={(date) =>
                                handleReturnDateChange(
                                    book.id,
                                    date
                                        ? date instanceof Date
                                            ? date.toISOString().split("T")[0]
                                            : date
                                        : ""
                                )
                            }
                            dateFormat="dd/MM/yyyy"
                            minDate={new Date(minDate)}
                            maxDate={new Date(maxDate)}
                            onKeyDown={(e) => {
                                e.preventDefault();
                            }}
                            placeholderText="Chọn ngày"
                            className={styles["custom-datepicker"]}
                            isClearable
                        />
                    </>
                ) : (
                    "-"
                )}
            </div>
        );
    };

    const renderStatus = (book: OrderDetailType) => (
        <select
            className={styles.status_select}
            value={book.status}
            onChange={(e) => handleStatusChange(book.id, e.target.value)}
        >
            <option
                value="0"
                disabled={isStatusDisabled(book.id, book.status, "0")}
                className={
                    isStatusDisabled(book.id, book.status, "0")
                        ? styles.status_option_disabled
                        : ""
                }
            >
                Đang mượn
            </option>
            <option
                value="2"
                disabled={isStatusDisabled(book.id, book.status, "2")}
                className={
                    isStatusDisabled(book.id, book.status, "2")
                        ? styles.status_option_disabled
                        : ""
                }
            >
                Quá hạn
            </option>
            <option
                value="3"
                disabled={isStatusDisabled(book.id, book.status, "3")}
                className={
                    isStatusDisabled(book.id, book.status, "3")
                        ? styles.status_option_disabled
                        : ""
                }
            >
                Mất sách
            </option>
            <option
                value="1"
                disabled={isStatusDisabled(book.id, book.status, "1")}
                className={
                    isStatusDisabled(book.id, book.status, "1")
                        ? styles.status_option_disabled
                        : ""
                }
            >
                Đã trả
            </option>
        </select>
    );

    const columns: Column<OrderDetailType>[] = [
        {
            key: "image_url",
            header: "Ảnh bìa",
            render: renderImage,
        },
        {
            key: "title",
            header: "Tên sách",
            render: renderTitle,
        },
        {
            key: "return_date_due",
            header: "Ngày trả dự kiến",
            render: renderReturnDateDue,
        },
        {
            key: "return_date_real",
            header: "Ngày trả thực tế",
            render: renderReturnDateReal,
        },
        {
            key: "status",
            header: "Trạng thái",
            render: renderStatus,
        },
    ];

    useEffect(() => {
        if (details.length > 0 && initialDetails.length === 0) {
            setInitialDetails(details);
            setLocalDetails(details);
        }
    }, [details, initialDetails.length]);

    useEffect(() => {
        const detailsWithReturnDates = details.map((detail) => {
            const isReturnedStatus =
                detail.status === "1" ||
                detail.status === 1 ||
                detail.status === "Đã trả";

            if (isReturnedStatus && !detail.return_date_real) {
                return {
                    ...detail,
                    return_date_real: new Date().toISOString().split("T")[0],
                };
            }
            return detail;
        });

        setLocalDetails(detailsWithReturnDates);
    }, [details]);

    useEffect(() => {
        if (onSave) {
            setSavedDetails(details);
        }
    }, [onSave, details]);

    return (
        <div>
            <div style={{ marginBottom: "20px" }}>
                <CustomTable
                    tableLayout="fixed"
                    data={localDetails}
                    columns={columns}
                />
            </div>
        </div>
    );
};

export default OrderDetailTable;

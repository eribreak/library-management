import { useState, useEffect } from "react";
import { CustomTable } from "@/components/common/table";
import { Column } from "@/components/common/table/CustomTable";
import { OrderDetail as OrderDetailType } from "@/store/slices/orderSlice";

interface OrderDetailTableProps {
    details: OrderDetailType[];
    onUpdateDetails: (updatedDetails: OrderDetailType[]) => void;
}

const OrderDetailTable: React.FC<OrderDetailTableProps> = ({
    details,
    onUpdateDetails,
}) => {
    const [localDetails, setLocalDetails] = useState<OrderDetailType[]>([]);

    const handleStatusChange = (id: number, newStatus: string) => {
        const updatedDetails = localDetails.map((detail) => {
            if (detail.id === id) {
                const return_date_real =
                    newStatus === "1" && !detail.return_date_real
                        ? new Date().toISOString().split("T")[0]
                        : detail.return_date_real;
                return { ...detail, status: newStatus, return_date_real };
            }
            return detail;
        });

        setLocalDetails(updatedDetails);
        onUpdateDetails(updatedDetails);
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

    const renderReturnDateDue = (book: OrderDetailType) => (
        <div
            style={{
                fontWeight: "500",
                color: "var(--font-color)",
            }}
        >
            {book.return_date_due}
        </div>
    );

    const renderReturnDateReal = (book: OrderDetailType) => (
        <div
            style={{
                fontWeight: "500",
                color: book.status === "1" ? "var(--color-success)" : "#6b7280",
                display: "flex",
                alignItems: "center",
            }}
        >
            {book.status === "1" ? (
                <input
                    type="date"
                    value={
                        book.return_date_real ||
                        new Date().toISOString().split("T")[0]
                    }
                    onChange={(e) =>
                        handleReturnDateChange(book.id, e.target.value)
                    }
                    style={{
                        padding: "6px 10px",
                        borderRadius: "6px",
                        border: "1px solid var(--border-color)",
                        backgroundColor: "#fff",
                        fontSize: "0.875rem",
                    }}
                />
            ) : (
                "-"
            )}
        </div>
    );

    const renderStatus = (book: OrderDetailType) => (
        <select
            style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
                backgroundColor: "#fff",
                fontSize: "0.875rem",
            }}
            value={book.status}
            onChange={(e) => handleStatusChange(book.id, e.target.value)}
        >
            <option value="0">Đang mượn</option>
            <option value="1">Đã trả</option>
            <option value="2">Quá hạn</option>
            <option value="3">Mất sách</option>
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
        setLocalDetails(details);
    }, [details]);

    return (
        <div>
            <div style={{ marginBottom: "20px" }}>
                <CustomTable data={localDetails} columns={columns} />
            </div>
        </div>
    );
};

export default OrderDetailTable;

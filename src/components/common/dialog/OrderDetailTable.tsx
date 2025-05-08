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

    useEffect(() => {
        setLocalDetails(details);
    }, [details]);

    const handleStatusChange = (id: number, newStatus: string) => {
        const updatedDetails = localDetails.map((detail) => {
            if (detail.id === id) {
                const return_date_real =
                    newStatus === "1"
                        ? new Date().toISOString().split("T")[0]
                        : detail.return_date_real;

                return { ...detail, status: newStatus, return_date_real };
            }
            return detail;
        });

        setLocalDetails(updatedDetails);
        onUpdateDetails(updatedDetails);
    };

    const columns: Column<OrderDetailType>[] = [
        {
            key: "image_url",
            header: "Ảnh bìa",
            render: (book) => (
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
            ),
        },
        {
            key: "title",
            header: "Tên sách",
            render: (book) => (
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
            ),
        },
        {
            key: "return_date_due",
            header: "Ngày trả dự kiến",
            render: (book) => (
                <div
                    style={{
                        fontWeight: "500",
                        color: "#1f2937",
                    }}
                >
                    {book.return_date_due}
                </div>
            ),
        },
        {
            key: "return_date_real",
            header: "Ngày trả thực tế",
            render: (book) => (
                <div
                    style={{
                        fontWeight: "500",
                        color: book.status === "1" ? "#389e0d" : "#6b7280",
                    }}
                >
                    {book.status === "1" && book.return_date_real
                        ? book.return_date_real
                        : "-"}
                </div>
            ),
        },
        {
            key: "status",
            header: "Trạng thái",
            render: (book) => (
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
                    onChange={(e) =>
                        handleStatusChange(book.id, e.target.value)
                    }
                >
                    <option value="0">Đang mượn</option>
                    <option value="1">Đã trả</option>
                    <option value="2">Quá hạn</option>
                    <option value="3">Mất sách</option>
                </select>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: "20px" }}>
                <CustomTable data={localDetails} columns={columns} />
            </div>
        </div>
    );
};

export default OrderDetailTable;

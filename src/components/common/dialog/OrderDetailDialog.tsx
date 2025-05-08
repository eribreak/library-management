import { useEffect, useState } from "react";
import { Dialog } from "@chakra-ui/react";
import {
    OrderDetail,
    UpdateOrderDetailRequest,
} from "@/store/slices/orderSlice";
import OrderDetailTable from "./OrderDetailTable";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
    updateOrderDetails,
    resetUpdateStatus,
} from "@/store/slices/orderSlice";
import styles from "./OrderDetailDialog.module.css";
import CustomButton from "../button/CustomButton";

interface OrderDetailDialogProps {
    orderId: number;
    isOpen: boolean;
    onClose: () => void;
}

const OrderDetailDialog: React.FC<OrderDetailDialogProps> = ({
    orderId,
    isOpen,
    onClose,
}) => {
    const dispatch = useDispatch();
    const { selectedOrder, loading, updateSuccess } = useSelector(
        (state: RootState) => state.orders
    );
    const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
    const [updatedDetails, setUpdatedDetails] = useState<OrderDetail[]>([]);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (selectedOrder && selectedOrder.details) {
            setOrderDetails(selectedOrder.details);
            setUpdatedDetails(selectedOrder.details);
        }
    }, [selectedOrder]);

    useEffect(() => {
        if (!isOpen) {
            setOrderDetails([]);
            setUpdatedDetails([]);
            setHasChanges(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (updateSuccess) {
            onClose();
            dispatch(resetUpdateStatus());
        }
    }, [updateSuccess, onClose, dispatch]);

    const handleUpdateDetails = (details: OrderDetail[]) => {
        setUpdatedDetails(details);
        const changedDetails = details.filter((detail) => {
            const originalDetail = selectedOrder?.details.find(
                (d) => d.id === detail.id
            );
            return (
                originalDetail &&
                (originalDetail.status !== detail.status ||
                    originalDetail.return_date_real !== detail.return_date_real)
            );
        });

        setHasChanges(changedDetails.length > 0);
    };

    const handleSave = () => {
        const changedDetails: UpdateOrderDetailRequest[] = updatedDetails
            .filter((detail) => {
                const originalDetail = selectedOrder?.details.find(
                    (d) => d.id === detail.id
                );
                return (
                    originalDetail &&
                    (originalDetail.status !== detail.status ||
                        originalDetail.return_date_real !==
                            detail.return_date_real)
                );
            })
            .map((detail) => ({
                id: detail.id,
                status: detail.status,
                return_date_real: detail.return_date_real,
            }));

        if (changedDetails.length > 0) {
            dispatch(
                updateOrderDetails({
                    orderId,
                    details: changedDetails,
                })
            );
        } else {
            onClose();
        }
    };

    const renderStatusBadge = (status: string) => {
        let statusText = "";
        let statusClass = "";

        switch (status) {
            case "0":
                statusText = "Đang mượn";
                statusClass = styles.status0;
                break;
            case "1":
                statusText = "Hoàn thành";
                statusClass = styles.status1;
                break;
            case "2":
                statusText = "Quá hạn";
                statusClass = styles.status2;
                break;
            default:
                statusText = "Không xác định";
                statusClass = "";
        }

        return (
            <span className={`${styles.statusBadge} ${statusClass}`}>
                {statusText}
            </span>
        );
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content className={styles.orderDetailDialog}>
                    <Dialog.Header className={styles.dialogHeader}>
                        <Dialog.Title className={styles.dialogTitle}>
                            Chi tiết đơn hàng #{orderId}
                        </Dialog.Title>
                        <Dialog.CloseTrigger />
                    </Dialog.Header>

                    <div className={styles.dialogContent}>
                        {selectedOrder && (
                            <div className={styles.infoSection}>
                                <div className={styles.infoGrid}>
                                    <div className={styles.infoItem}>
                                        <p className={styles.infoLabel}>
                                            Người mượn:
                                        </p>
                                        <p className={styles.infoValue}>
                                            {selectedOrder.full_name}
                                        </p>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <p className={styles.infoLabel}>
                                            Mã nhân viên:
                                        </p>
                                        <p className={styles.infoValue}>
                                            {selectedOrder.employee_code}
                                        </p>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <p className={styles.infoLabel}>
                                            Ngày tạo đơn:
                                        </p>
                                        <p className={styles.infoValue}>
                                            {selectedOrder.created_at}
                                        </p>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <p className={styles.infoLabel}>
                                            Trạng thái:
                                        </p>
                                        <p className={styles.infoValue}>
                                            {renderStatusBadge(
                                                selectedOrder.status
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedOrder && (
                            <div className={styles.tableContainer}>
                                <OrderDetailTable
                                    details={orderDetails}
                                    onUpdateDetails={handleUpdateDetails}
                                />
                            </div>
                        )}

                        {loading && (
                            <div className={styles.loadingIndicator}>
                                <div className={styles.spinnerAnimation}></div>
                            </div>
                        )}
                    </div>

                    <div className={styles.actionButtons}>
                        <CustomButton
                            onClick={onClose}
                            className={styles.closeButton}
                        >
                            Đóng
                        </CustomButton>

                        {hasChanges && (
                            <CustomButton
                                onClick={handleSave}
                                className={styles.saveButton}
                                loading={loading}
                            >
                                Lưu thay đổi
                            </CustomButton>
                        )}
                    </div>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
};

export default OrderDetailDialog;

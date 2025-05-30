import { useEffect, useState, useRef } from "react";
import { Dialog } from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
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
import CustomButton from "../../button/CustomButton";
import { format } from "date-fns";

interface OrderDetailDialogProps {
    orderId: number;
    isOpen: boolean;
    onClose: () => void;
}

const STATUS_TEXT: Record<string, string> = {
    "0": "Đang mượn",
    "1": "Hoàn thành",
    "2": "Quá hạn",
};

const OrderDetailDialog: React.FC<OrderDetailDialogProps> = ({
    orderId,
    isOpen,
    onClose,
}) => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const { selectedOrder, loading, updateSuccess } = useSelector(
        (state: RootState) => state.orders
    );
    const [updatedDetails, setUpdatedDetails] = useState<OrderDetail[]>([]);
    const [hasChanges, setHasChanges] = useState(false);
    const firstRenderRef = useRef(true);

    const checkDetailChanges = (detail: OrderDetail) => {
        const originalDetail = selectedOrder?.details.find(
            (d) => d.id === detail.id
        );
        return (
            originalDetail &&
            (originalDetail.status !== detail.status ||
                originalDetail.return_date_real !== detail.return_date_real)
        );
    };

    const handleUpdateDetails = (details: OrderDetail[]) => {
        setUpdatedDetails(details);
        const hasAnyChanges = details.some(checkDetailChanges);
        setHasChanges(hasAnyChanges);
    };

    const handleSave = () => {
        const changedDetails: UpdateOrderDetailRequest[] = updatedDetails
            .filter(checkDetailChanges)
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

    useEffect(() => {
        if (isOpen && selectedOrder?.details) {
            setUpdatedDetails(selectedOrder.details);
            setHasChanges(false);
        } else if (!isOpen) {
            setUpdatedDetails([]);
            setHasChanges(false);
        }
    }, [isOpen, selectedOrder]);

    useEffect(() => {
        if (updateSuccess) {
            onClose();
            dispatch(resetUpdateStatus());
        }
    }, [updateSuccess, dispatch]);

    useEffect(() => {
        if (firstRenderRef.current) {
            firstRenderRef.current = false;
            return;
        }

        if (!isOpen) {
            const params = new URLSearchParams(searchParams);
            params.delete("id");
            setSearchParams(params);
        }
    }, [isOpen, searchParams, setSearchParams]);

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
                                            {selectedOrder.created_at
                                                ? format(
                                                      new Date(
                                                          selectedOrder.created_at
                                                      ),
                                                      "dd/MM/yyyy HH:mm"
                                                  )
                                                : ""}
                                        </p>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <p className={styles.infoLabel}>
                                            Trạng thái:
                                        </p>
                                        <p className={styles.infoValue}>
                                            {selectedOrder.status}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedOrder && (
                            <div className={styles.tableContainer}>
                                <OrderDetailTable
                                    details={updatedDetails}
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

import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Employee,
    EmployeeFormData,
    clearCreateError,
    clearUpdateError,
} from "@/store/slices/employeeSlice";
import { RootState, AppDispatch } from "@/store/store";
import styled from "./FormButton.module.css";
import clsx from "clsx";
import CustomButton from "../button/CustomButton";
import editIcon from "@/assets/images/images/edit-icon.svg";
import FormDialog from "./FormDialog";
import { CustomInputField } from "../form/CustomInputField";
import { employeeSchema } from "@/utils/validator/employee";
import { IoMdAddCircleOutline } from "react-icons/io";
import { Box } from "@chakra-ui/react";
import ConfirmDialog from "./ConfirmDialog";

interface EmployeeFormDialogProps {
    isEdit: boolean;
    employee?: Employee;
    onSubmit: (data: EmployeeFormData) => void;
    onDialogClose?: () => void;
}

const EmployeeFormDialog: React.FC<EmployeeFormDialogProps> = ({
    isEdit,
    employee,
    onSubmit,
    onDialogClose,
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const { isCreating, isUpdating, createError, updateError } = useSelector(
        (state: RootState) => state.employees
    );

    const [isOpen, setIsOpen] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const wasOpenRef = useRef(false);
    const initialValuesRef = useRef<EmployeeFormData | null>(null);
    const wasSubmittingRef = useRef(false);

    useEffect(() => {
        const currentError = isEdit ? updateError : createError;
        const isSubmitting = isEdit ? isUpdating : isCreating;

        if (isSubmitting) {
            wasSubmittingRef.current = true;
        }

        if (
            wasSubmittingRef.current &&
            !isSubmitting &&
            !currentError &&
            isOpen
        ) {
            setTimeout(() => {
                setHasChanges(false);
                setIsOpen(false);
                wasSubmittingRef.current = false;
            }, 100);
        }

        if (currentError) {
            wasSubmittingRef.current = false;
        }
    }, [isCreating, isUpdating, createError, updateError, isEdit, isOpen]);

    useEffect(() => {
        if (isOpen) {
            wasOpenRef.current = true;

            if (isEdit) {
                dispatch(clearUpdateError());
            } else {
                dispatch(clearCreateError());
            }

            initialValuesRef.current = {
                employee_code: isEdit && employee ? employee.employee_code : "",
                full_name: isEdit && employee ? employee.full_name : "",
                email: isEdit && employee ? employee.email : "",
            };
            setHasChanges(false);
            wasSubmittingRef.current = false;
        } else if (wasOpenRef.current && onDialogClose) {
            onDialogClose();
            wasOpenRef.current = false;
            initialValuesRef.current = null;

            if (isEdit) {
                dispatch(clearUpdateError());
            } else {
                dispatch(clearCreateError());
            }
        }
    }, [isOpen, onDialogClose, isEdit, employee, dispatch]);

    const defaultValues = {
        employee_code: isEdit && employee ? employee.employee_code : "",
        full_name: isEdit && employee ? employee.full_name : "",
        email: isEdit && employee ? employee.email : "",
    };

    const handleFormSubmit = (data: Record<string, unknown>) => {
        const employeeData: EmployeeFormData = {
            employee_code: data.employee_code as string,
            full_name: data.full_name as string,
            email: data.email as string,
        };

        if (isEdit && employee) {
            employeeData.id = employee.id;
        }

        if (isEdit) {
            dispatch(clearUpdateError());
        } else {
            dispatch(clearCreateError());
        }

        onSubmit(employeeData);
    };

    const handleFormChange = (data: Record<string, unknown>) => {
        const currentValues = {
            employee_code: data.employee_code as string,
            full_name: data.full_name as string,
            email: data.email as string,
        };

        if (initialValuesRef.current) {
            const hasFormChanged =
                currentValues.employee_code !==
                    initialValuesRef.current.employee_code ||
                currentValues.full_name !==
                    initialValuesRef.current.full_name ||
                currentValues.email !== initialValuesRef.current.email;
            setHasChanges(hasFormChanged);
        }
    };

    const openDialog = () => {
        setIsOpen(true);
    };

    const closeDialog = () => {
        const isSubmitting = isEdit ? isUpdating : isCreating;

        if (isSubmitting) {
            return;
        }

        if (hasChanges) {
            setShowConfirmDialog(true);
        } else {
            setIsOpen(false);
        }
    };

    const handleConfirmClose = () => {
        setShowConfirmDialog(false);
        setIsOpen(false);
    };

    const handleCancelClose = () => {
        setShowConfirmDialog(false);
    };

    const isSubmitting = isEdit ? isUpdating : isCreating;

    const formFields = (
        <Box display={"flex"} flexDirection="column" gap={4}>
            <CustomInputField
                name="employee_code"
                label="Mã nhân viên"
                required
            />
            <CustomInputField name="full_name" label="Tên nhân viên" required />
            <CustomInputField name="email" label="Email" required />
        </Box>
    );

    return (
        <>
            {isEdit ? (
                <CustomButton
                    onClick={openDialog}
                    className={clsx(
                        styled.action_button,
                        styled.action_button_left
                    )}
                >
                    <img src={editIcon} alt="Edit" />
                </CustomButton>
            ) : (
                <CustomButton
                    onClick={openDialog}
                    bg={"var(--primary-color)"}
                    variant="solid"
                    px={4}
                    py={2}
                    borderRadius="md"
                    _hover={{ bg: "var(--primary-color-dark)" }}
                >
                    <IoMdAddCircleOutline /> Thêm nhân viên
                </CustomButton>
            )}

            {isOpen && (
                <FormDialog
                    title={isEdit ? "Chỉnh sửa nhân viên" : "Thêm nhân viên"}
                    isOpen={isOpen}
                    onClose={closeDialog}
                    onSubmit={handleFormSubmit}
                    formFields={formFields}
                    defaultValues={defaultValues}
                    schema={employeeSchema}
                    hideDefaultTrigger={true}
                    onFormChange={handleFormChange}
                    isSubmitting={isSubmitting}
                    submitButtonText={
                        isSubmitting
                            ? "Đang xử lý..."
                            : isEdit
                            ? "Cập nhật"
                            : "Tạo mới"
                    }
                />
            )}

            <ConfirmDialog
                isOpen={showConfirmDialog}
                onClose={handleCancelClose}
                onConfirm={handleConfirmClose}
                title="Xác nhận hủy"
                description="Bạn có chắc chắn muốn hủy? Các thay đổi chưa lưu sẽ bị mất."
                confirmText="Hủy thay đổi"
                cancelText="Tiếp tục chỉnh sửa"
            />
        </>
    );
};

export default EmployeeFormDialog;

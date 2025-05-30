import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Category,
    CategoryFormData,
    clearCreateError,
    clearUpdateError,
} from "@/store/slices/categorySlice";
import { RootState, AppDispatch } from "@/store/store";
import styled from "./FormButton.module.css";
import clsx from "clsx";
import CustomButton from "../button/CustomButton";
import editIcon from "@/assets/images/images/edit-icon.svg";
import FormDialog from "./formDialog/FormDialog";
import { CustomInputField } from "../form/CustomInputField";
import { z } from "zod";
import { name, description } from "@/utils/validator/commonValidator";
import { IoMdAddCircleOutline } from "react-icons/io";
import { Box } from "@chakra-ui/react";
import { CustomTextarea } from "../form/CustomTextarea";
import ConfirmDialog from "./ConfirmDialog";

const categorySchema = z.object({
    name: name,
    description: description,
});

interface CategoryFormDialogProps {
    isEdit: boolean;
    category?: Category;
    onSubmit: (data: CategoryFormData) => void;
    id?: string;
    onDialogClose?: () => void;
}

export const CategoryFormDialog: React.FC<CategoryFormDialogProps> = ({
    isEdit,
    category,
    onSubmit,

    onDialogClose,
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const { isCreating, isUpdating, createError, updateError } = useSelector(
        (state: RootState) => state.categories
    );

    const [isOpen, setIsOpen] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const wasOpenRef = useRef(false);
    const initialValuesRef = useRef<CategoryFormData | null>(null);
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
                name: isEdit && category ? category.name : "",
                description: isEdit && category ? category.description : "",
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
    }, [isOpen, onDialogClose, isEdit, category, dispatch]);

    const defaultValues = {
        name: isEdit && category ? category.name : "",
        description: isEdit && category ? category.description : "",
    };

    const handleFormSubmit = (data: Record<string, unknown>) => {
        const categoryData: CategoryFormData = {
            name: data.name as string,
            description: data.description as string,
        };

        if (isEdit && category) {
            categoryData.id = category.id;
        }

        if (isEdit) {
            dispatch(clearUpdateError());
        } else {
            dispatch(clearCreateError());
        }

        onSubmit(categoryData);
    };

    const handleFormChange = (data: Record<string, unknown>) => {
        const currentValues = {
            name: data.name as string,
            description: data.description as string,
        };

        if (initialValuesRef.current) {
            const hasFormChanged =
                currentValues.name !== initialValuesRef.current.name ||
                currentValues.description !==
                    initialValuesRef.current.description;
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
            <CustomInputField name="name" label="Tên danh mục" required />
            <CustomTextarea
                name="description"
                label="Mô tả"
                required
                resize="vertical"
            />
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
                    <IoMdAddCircleOutline /> Thêm danh mục
                </CustomButton>
            )}

            {isOpen && (
                <FormDialog
                    title={isEdit ? "Chỉnh sửa danh mục" : "Thêm danh mục"}
                    isOpen={isOpen}
                    onClose={closeDialog}
                    onSubmit={handleFormSubmit}
                    formFields={formFields}
                    defaultValues={defaultValues}
                    schema={categorySchema}
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

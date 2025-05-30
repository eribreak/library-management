import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Author,
    AuthorFormData,
    clearCreateError,
    clearUpdateError,
} from "@/store/slices/authorSlice";
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

const authorSchema = z.object({
    name: name,
    description: description,
});

interface AuthorFormDialogProps {
    isEdit: boolean;
    author?: Author;
    onSubmit: (data: AuthorFormData) => void;
    renderTriggerOnly?: boolean;
    onDialogClose?: () => void;
}

const AuthorFormDialog: React.FC<AuthorFormDialogProps> = ({
    isEdit,
    author,
    onSubmit,
    renderTriggerOnly = false,
    onDialogClose,
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const { isCreating, isUpdating, createError, updateError } = useSelector(
        (state: RootState) => state.authors
    );

    const [isOpen, setIsOpen] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const wasOpenRef = useRef(false);
    const initialValuesRef = useRef<AuthorFormData | null>(null);
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
                name: isEdit && author ? author.name : "",
                description: isEdit && author ? author.description : "",
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
    }, [isOpen, onDialogClose, isEdit, author, dispatch]);

    const defaultValues = {
        name: isEdit && author ? author.name : "",
        description: isEdit && author ? author.description : "",
    };

    const handleFormSubmit = (data: Record<string, unknown>) => {
        const authorData: AuthorFormData = {
            name: data.name as string,
            description: data.description as string,
        };

        if (isEdit && author) {
            authorData.id = author.id;
        }

        if (isEdit) {
            dispatch(clearUpdateError());
        } else {
            dispatch(clearCreateError());
        }

        onSubmit(authorData);
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
            <CustomInputField
                name="name"
                label="Tên tác giả"
                required
                placeholder="Nhập tên tác giả"
            />
            <CustomTextarea
                required
                name="description"
                label="Mô tả"
                placeholder="Nhập mô tả tác giả"
                rows={3}
            />
        </Box>
    );

    const renderTrigger = () => {
        if (isEdit) {
            return (
                <CustomButton
                    onClick={openDialog}
                    className={clsx(
                        styled.action_button,
                        styled.action_button_left
                    )}
                >
                    <img src={editIcon} alt="Edit" />
                </CustomButton>
            );
        } else {
            return (
                <CustomButton
                    onClick={openDialog}
                    bg={"var(--primary-color)"}
                    variant="solid"
                    px={4}
                    py={2}
                    borderRadius="md"
                    _hover={{ bg: "var(--primary-color-dark)" }}
                >
                    <IoMdAddCircleOutline /> Thêm tác giả
                </CustomButton>
            );
        }
    };

    if (renderTriggerOnly) {
        return renderTrigger();
    }

    return (
        <>
            {renderTrigger()}
            {isOpen && (
                <FormDialog
                    title={isEdit ? "Chỉnh sửa tác giả" : "Thêm tác giả"}
                    isOpen={isOpen}
                    onClose={closeDialog}
                    onSubmit={handleFormSubmit}
                    formFields={formFields}
                    defaultValues={defaultValues}
                    schema={authorSchema}
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

export default AuthorFormDialog;

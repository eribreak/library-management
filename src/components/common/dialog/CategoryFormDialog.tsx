import React, { useState } from "react";
import { Category, CategoryFormData } from "@/store/slices/categorySlice";
import styled from "./FormButton.module.css";
import clsx from "clsx";
import CustomButton from "../button/CustomButton";
import editIcon from "@/assets/images/images/edit-icon.svg";
import FormDialog from "./FormDialog";
import { CustomInputField } from "../form/CustomInputField";
import { z } from "zod";
import { name, description } from "@/utils/validate";

const categorySchema = z.object({
    name: name,
    description: description,
});

interface CategoryFormDialogProps {
    isEdit: boolean;
    category?: Category;
    onSubmit: (data: CategoryFormData) => void;
}

export const CategoryFormDialog: React.FC<CategoryFormDialogProps> = ({
    isEdit,
    category,
    onSubmit,
}) => {
    const [isOpen, setIsOpen] = useState(false);

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

        onSubmit(categoryData);
        setIsOpen(false);
    };

    const openDialog = () => {
        setIsOpen(true);
    };

    const closeDialog = () => {
        setIsOpen(false);
    };

    const formFields = (
        <>
            <CustomInputField name="name" label="Tên danh mục" required />
            <CustomInputField
                name="description"
                label="Mô tả"
                required
                as="textarea"
                resize="vertical"
            />
        </>
    );

    return (
        <>
            {isEdit ? (
                <CustomButton
                    onClick={openDialog}
                    className={clsx(styled.action_button, styled.action_button_left)}
                >
                    <img src={editIcon} alt="Edit" />
                </CustomButton>
            ) : (
                <CustomButton
                    onClick={openDialog}
                    bg={"var(--primary-color)"}
                >
                    Thêm mới
                </CustomButton>
            )}

            {isOpen && (
                <FormDialog
                    title={isEdit ? "Sửa danh mục" : "Thêm mới danh mục"}
                    submitButtonText={isEdit ? "Lưu" : "Thêm mới"}
                    isOpen={isOpen}
                    onClose={closeDialog}
                    hideDefaultTrigger={true}
                    onSubmit={handleFormSubmit}
                    formFields={formFields}
                    defaultValues={defaultValues}
                    schema={categorySchema} 
                />
            )}
        </>
    );
};

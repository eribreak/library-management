import React, { useState } from "react";
import { Author, AuthorFormData } from "@/store/slices/authorSlice";
import styled from "./FormButton.module.css";
import clsx from "clsx";
import CustomButton from "../button/CustomButton";
import editIcon from "@/assets/images/images/edit-icon.svg";
import FormDialog from "./FormDialog";
import { CustomInputField } from "../form/CustomInputField";
import { z } from "zod";
import { name, description } from "@/utils/validator/commonValidator";
import { IoMdAddCircleOutline } from "react-icons/io";

const authorSchema = z.object({
    name: name,
    description: description,
});

interface AuthorFormDialogProps {
    isEdit: boolean;
    author?: Author;
    onSubmit: (data: AuthorFormData) => void;
    renderTriggerOnly?: boolean;
}

const AuthorFormDialog: React.FC<AuthorFormDialogProps> = ({
    isEdit,
    author,
    onSubmit,
    renderTriggerOnly = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);

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

        onSubmit(authorData);
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
            <CustomInputField name="name" label="Tên tác giả" required />
            <CustomInputField
                name="description"
                label="Mô tả"
                required
                resize="vertical"
            />
        </>
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
                    <IoMdAddCircleOutline />
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
                />
            )}
        </>
    );
};

export default AuthorFormDialog;

import React, { useState } from "react";
import { Publisher, PublisherFormData } from "@/store/slices/publisherSlice";
import styled from "./FormButton.module.css";
import clsx from "clsx";
import CustomButton from "../button/CustomButton";
import editIcon from "@/assets/images/images/edit-icon.svg";
import FormDialog from "./FormDialog";
import { CustomInputField } from "../form/CustomInputField";
import { z } from "zod";
import { name, description } from "@/utils/validator/commonValidator";
import { IoMdAddCircleOutline } from "react-icons/io";

const publisherSchema = z.object({
    name: name,
    description: description,
});

interface PublisherFormDialogProps {
    isEdit: boolean;
    publisher?: Publisher;
    onSubmit: (data: PublisherFormData) => void;
}

const PublisherFormDialog: React.FC<PublisherFormDialogProps> = ({
    isEdit,
    publisher,
    onSubmit,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const defaultValues = {
        name: isEdit && publisher ? publisher.name : "",
        description: isEdit && publisher ? publisher.description : "",
    };

    const handleFormSubmit = (data: Record<string, unknown>) => {
        const publisherData: PublisherFormData = {
            name: data.name as string,
            description: data.description as string,
        };

        if (isEdit && publisher) {
            publisherData.id = publisher.id;
        }

        onSubmit(publisherData);
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
            <CustomInputField name="name" label="Tên nhà xuất bản" required />
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
                    <IoMdAddCircleOutline />
                </CustomButton>
            )}

            {isOpen && (
                <FormDialog
                    title={
                        isEdit ? "Chỉnh sửa nhà xuất bản" : "Thêm nhà xuất bản"
                    }
                    isOpen={isOpen}
                    onClose={closeDialog}
                    onSubmit={handleFormSubmit}
                    formFields={formFields}
                    defaultValues={defaultValues}
                    schema={publisherSchema}
                    hideDefaultTrigger={true}
                />
            )}
        </>
    );
};

export default PublisherFormDialog;

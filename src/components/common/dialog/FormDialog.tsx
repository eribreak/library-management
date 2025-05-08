import React, { useState } from "react";
import {
    useForm,
    FormProvider,
    SubmitHandler,
    DefaultValues,
    UseFormProps,
} from "react-hook-form";
import { Dialog } from "@chakra-ui/react";
import CustomButton from "../button/CustomButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface FormDialogProps<TFormData = Record<string, unknown>> {
    title: string;
    triggerText?: string;
    onSubmit: (data: TFormData) => void;
    formFields?: React.ReactNode;
    submitButtonText?: string;
    cancelButtonText?: string;
    hideDefaultTrigger?: boolean;
    isOpen?: boolean;
    onClose?: () => void;
    defaultValues?: Partial<TFormData>;
    schema?: z.ZodType<TFormData>;
}

export const FormDialog = <
    TFormData extends Record<string, unknown> = Record<string, unknown>
>({
    title,
    triggerText,
    onSubmit,
    formFields,
    submitButtonText = "Lưu",
    cancelButtonText = "Hủy",
    hideDefaultTrigger = false,
    isOpen: externalIsOpen,
    onClose: externalOnClose,
    defaultValues = {},
    schema,
}: FormDialogProps<TFormData>) => {
    const [internalIsOpen, setInternalIsOpen] = useState(false);

    const isControlled = externalIsOpen !== undefined;
    const isOpen = isControlled ? externalIsOpen : internalIsOpen;

    const formOptions: UseFormProps<TFormData> = {
        defaultValues: defaultValues as DefaultValues<TFormData>,
    };

    if (schema) {
        formOptions.resolver = zodResolver(schema);
    }
    const methods = useForm<TFormData>(formOptions);

    const handleSubmit: SubmitHandler<TFormData> = (data) => {
        onSubmit(data);
        if (!isControlled) {
            setInternalIsOpen(false);
        } else if (externalOnClose) {
            externalOnClose();
        }
    };

    const handleOpenChange = (details: { open: boolean }) => {
        if (!isControlled) {
            setInternalIsOpen(details.open);
        } else if (!details.open && externalOnClose) {
            externalOnClose();
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
            {!hideDefaultTrigger && (
                <Dialog.Trigger>
                    <p className="primary-button">{triggerText}</p>
                </Dialog.Trigger>
            )}

            <Dialog.Backdrop />

            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>{title}</Dialog.Title>
                    </Dialog.Header>

                    <FormProvider {...methods}>
                        <form onSubmit={methods.handleSubmit(handleSubmit)}>
                            <Dialog.Body>{formFields}</Dialog.Body>
                            <Dialog.Footer>
                                <CustomButton
                                    type="button"
                                    className="secondary-button"
                                    onClick={() => {
                                        if (!isControlled) {
                                            setInternalIsOpen(false);
                                        } else if (externalOnClose) {
                                            externalOnClose();
                                        }
                                    }}
                                >
                                    {cancelButtonText}
                                </CustomButton>
                                <CustomButton
                                    bg={"var(--primary-color)"}
                                    type="submit"
                                    className="primary-button"
                                >
                                    {submitButtonText}
                                </CustomButton>
                            </Dialog.Footer>
                        </form>
                    </FormProvider>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
};

export default FormDialog;

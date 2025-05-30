import React, { useState } from "react";
import {
    useForm,
    FormProvider,
    SubmitHandler,
    DefaultValues,
    UseFormProps,
} from "react-hook-form";
import { Dialog } from "@chakra-ui/react";
import CustomButton from "../../button/CustomButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import styles from "./FormDialog.module.css";

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
    width?: string;
    onFormChange?: (data: TFormData) => void;
    isSubmitting?: boolean;
}

const FormDialog = <
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
    width = "600px",
    onFormChange,
    isSubmitting = false,
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

    React.useEffect(() => {
        if (onFormChange) {
            const subscription = methods.watch((data) => {
                onFormChange(data as TFormData);
            });
            return () => subscription.unsubscribe();
        }
    }, [methods, onFormChange]);

    const handleSubmit: SubmitHandler<TFormData> = (data) => {
        onSubmit(data);
    };

    const handleOpenChange = (details: { open: boolean }) => {
        if (!details.open && isSubmitting) {
            return;
        }

        if (!isControlled) {
            setInternalIsOpen(details.open);
        } else if (!details.open && externalOnClose) {
            externalOnClose();
        }
    };

    const handleCancelClick = () => {
        if (isSubmitting) {
            return;
        }

        if (!isControlled) {
            setInternalIsOpen(false);
        } else if (externalOnClose) {
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
                <Dialog.Content
                    maxW={width}
                    className={styles.bookDetailDialog}
                >
                    <Dialog.Header className={styles.dialogHeader}>
                        <Dialog.Title className={styles.dialogTitle}>
                            {title}
                        </Dialog.Title>
                    </Dialog.Header>

                    <div className={styles.dialogContent}>
                        <FormProvider {...methods}>
                            <form onSubmit={methods.handleSubmit(handleSubmit)}>
                                <Dialog.Body>{formFields}</Dialog.Body>
                                <Dialog.Footer className={styles.actionButtons}>
                                    <CustomButton
                                        type="button"
                                        className="secondary-button"
                                        onClick={handleCancelClick}
                                        disabled={isSubmitting}
                                    >
                                        {cancelButtonText}
                                    </CustomButton>
                                    <CustomButton
                                        bg={"var(--primary-color)"}
                                        type="submit"
                                        className="primary-button"
                                        disabled={isSubmitting}
                                    >
                                        {submitButtonText}
                                    </CustomButton>
                                </Dialog.Footer>
                            </form>
                        </FormProvider>
                    </div>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
};

export default FormDialog;

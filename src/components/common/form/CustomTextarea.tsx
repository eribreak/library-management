import { Field, TextareaProps, Textarea } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

export interface CustomTextareaProps extends TextareaProps {
    name: string;
    label?: string;
    placeholder?: string;
    rows?: number;
    required?: boolean;
}

export const CustomTextarea = ({
    name,
    label,
    placeholder,
    rows = 3,
    required,
    ...textareaProps
}: CustomTextareaProps) => {
    const {
        control,
        formState: { errors },
    } = useFormContext();

    const error = errors[name]?.message as string | undefined;

    return (
        <Field.Root invalid={!!error}>
            {label && (
                <Field.Label htmlFor={name}>
                    {label}
                    {required && <span style={{ color: "red" }}>*</span>}
                </Field.Label>
            )}
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Textarea
                        borderRadius={"var(--border-radius-medium)"}
                        focusRingColor={"rgb(228 228 231)"}
                        id={name}
                        placeholder={placeholder}
                        rows={rows}
                        {...field}
                        {...textareaProps}
                    />
                )}
            />
            {error && <Field.ErrorText>{error}</Field.ErrorText>}
        </Field.Root>
    );
};
